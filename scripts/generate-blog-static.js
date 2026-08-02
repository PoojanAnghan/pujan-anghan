import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index === -1) return;
      const key = trimmed.substring(0, index).trim();
      const val = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const BASE_URL = 'https://pujan-anghan.vercel.app';

async function generate() {
  console.log('Generating static HTML files for blog posts...');

  // 1. Fetch posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, published_at, cover_images, cover_image_url')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching blog posts:', error);
    process.exit(1);
  }

  console.log(`Fetched ${posts.length} published blog posts.`);

  // 2. Read built dist/index.html
  const distDir = path.resolve(__dirname, '../dist');
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/index.html not found. Run vite build first.');
    process.exit(1);
  }
  const templateHtml = fs.readFileSync(templatePath, 'utf8');

  // 3. Generate static file for each post
  for (const post of posts) {
    const postSlug = post.slug;
    const postTitle = post.title;
    const postExcerpt = post.excerpt || '';
    const postUrl = `${BASE_URL}/blog/${postSlug}`;
    
    // Cover image resolution
    let mainImage = `${BASE_URL}/og-image.png`;
    if (Array.isArray(post.cover_images) && post.cover_images.length > 0) {
      const validImages = post.cover_images.filter(Boolean);
      if (validImages.length > 0) {
        mainImage = validImages[0];
      }
    } else if (post.cover_image_url) {
      mainImage = post.cover_image_url;
    }

    let html = templateHtml;

    // Head tag literal replacements
    html = html.replaceAll(
      '<title>Poojan Anghan — Software Engineer | React.js & Python Specialist</title>',
      `<title>${postTitle} — Poojan Anghan Blog</title>`
    );
    
    html = html.replaceAll(
      '<meta name="description" content="Portfolio of Poojan Anghan, a freelance Software Engineer specializing in React.js, Python (Django, FastAPI, Flask), and REST API design. Shipped 10+ scalable remote projects." />',
      `<meta name="description" content="${postExcerpt.replace(/"/g, '&quot;')}" />`
    );

    html = html.replaceAll(
      '<link rel="canonical" href="https://pujan-anghan.vercel.app" />',
      `<link rel="canonical" href="${postUrl}" />`
    );

    html = html.replaceAll(
      '<meta property="og:type" content="website" />',
      `<meta property="og:type" content="article" />`
    );

    html = html.replaceAll(
      '<meta property="og:title" content="Poojan Anghan — Software Engineer" />',
      `<meta property="og:title" content="${postTitle} — Poojan Anghan Blog" />`
    );

    html = html.replaceAll(
      '<meta property="og:description" content="Freelance Software Engineer building scalable web applications with React.js and Python. Deliver secure, production-grade enterprise ERP, healthcare, and booking platforms." />',
      `<meta property="og:description" content="${postExcerpt.replace(/"/g, '&quot;')}" />`
    );

    html = html.replaceAll(
      '<meta property="og:url" content="https://pujan-anghan.vercel.app" />',
      `<meta property="og:url" content="${postUrl}" />`
    );

    html = html.replaceAll(
      '<meta property="og:image" content="https://pujan-anghan.vercel.app/og-image.png" />',
      `<meta property="og:image" content="${mainImage}" />`
    );

    html = html.replaceAll(
      '<meta name="twitter:title" content="Poojan Anghan — Software Engineer" />',
      `<meta name="twitter:title" content="${postTitle} — Poojan Anghan Blog" />`
    );

    html = html.replaceAll(
      '<meta name="twitter:description" content="Freelance Software Engineer building scalable web applications with React.js and Python." />',
      `<meta name="twitter:description" content="${postExcerpt.replace(/"/g, '&quot;')}" />`
    );

    html = html.replaceAll(
      '<meta name="twitter:image" content="https://pujan-anghan.vercel.app/og-image.png" />',
      `<meta name="twitter:image" content="${mainImage}" />`
    );

    // Build and inject JSON-LD BlogPosting schema right before </head>
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': postTitle,
      'description': postExcerpt,
      'image': [mainImage],
      'datePublished': post.published_at,
      'author': {
        '@type': 'Person',
        'name': 'Poojan Anghan',
        'url': BASE_URL
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Poojan Anghan',
        'logo': {
          '@type': 'ImageObject',
          'url': `${BASE_URL}/favicon.ico`
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': postUrl
      }
    };
    
    const jsonLdScript = `\n    <script id="json-ld-schema" type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>\n  `;
    html = html.replace('</head>', `${jsonLdScript}</head>`);

    // Write generated index.html under dist/blog/[slug]/
    const postDir = path.join(distDir, 'blog', postSlug);
    fs.mkdirSync(postDir, { recursive: true });
    const postFilePath = path.join(postDir, 'index.html');
    fs.writeFileSync(postFilePath, html, 'utf8');
    console.log(`Generated: dist/blog/${postSlug}/index.html`);
  }

  console.log('All static blog pages generated successfully!');
}

generate().catch(err => {
  console.error('Static generation failed:', err);
  process.exit(1);
});
