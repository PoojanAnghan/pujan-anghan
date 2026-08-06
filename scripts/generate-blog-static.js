import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const staticRoutes = [
  {
    path: 'services',
    title: 'Custom IT Solutions & Software Development Services | Poojan Anghan',
    description: 'Comprehensive custom software development, business process automation, enterprise ERP platforms, and IT architecture consulting by Poojan Anghan.'
  },
  {
    path: 'services/it-consulting',
    title: 'Enterprise IT Consulting & Systems Architecture | Poojan Anghan',
    description: 'Strategic IT consulting, systems architecture design, database optimization, and cloud backend security audits for growing businesses and tech companies.'
  },
  {
    path: 'services/web-development',
    title: 'Custom Web Application & SaaS Development | Poojan Anghan',
    description: 'Full-stack custom software and web application development services for businesses. React.js frontends, Python (Django, FastAPI) backends, and cloud deployment.'
  },
  {
    path: 'about',
    title: 'About Poojan Anghan | Full-Stack Software Engineer & IT Consultant',
    description: 'Learn about Poojan Anghan\'s experience providing custom business software solutions, enterprise IT consulting, and full-stack web application development.'
  },
  {
    path: 'projects',
    title: 'Software Development Projects & Portfolio | Poojan Anghan',
    description: 'Explore case studies and portfolio of custom enterprise ERP systems, healthcare platforms, booking engines, and web applications.'
  },
  {
    path: 'experience',
    title: 'Engineering Experience & Work History | Poojan Anghan',
    description: 'Professional experience of Poojan Anghan in enterprise software engineering, IT consulting, and backend architecture.'
  },
  {
    path: 'contact',
    title: 'Contact Poojan Anghan | IT Solutions & Software Consulting Inquiry',
    description: 'Get in touch with Poojan Anghan to discuss your business software project, IT consulting requirements, or custom web platform.'
  },
  {
    path: 'quote',
    title: 'Get a Quote | Custom Software & IT Consulting Project Estimate',
    description: 'Request a custom software development quote or schedule an IT strategy session for your business.'
  }
];

async function generate() {
  console.log('Generating static HTML files for core pages and blog posts...');

  const distDir = path.resolve(__dirname, '../dist');
  const templatePath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Error: dist/index.html not found. Run vite build first.');
    process.exit(1);
  }
  const templateHtml = fs.readFileSync(templatePath, 'utf8');

  // 1. Generate Static Core Pages
  for (const route of staticRoutes) {
    let html = templateHtml;
    const pageUrl = `${BASE_URL}/${route.path}`;

    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${route.title}</title>`
    );

    html = html.replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${route.description.replace(/"/g, '&quot;')}" />`
    );

    html = html.replace(
      /<link rel="canonical" href=".*?" \/>/,
      `<link rel="canonical" href="${pageUrl}" />`
    );

    html = html.replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${route.title.replace(/"/g, '&quot;')}" />`
    );

    html = html.replace(
      /<meta property="og:description" content=".*?" \/>/,
      `<meta property="og:description" content="${route.description.replace(/"/g, '&quot;')}" />`
    );

    html = html.replace(
      /<meta property="og:url" content=".*?" \/>/,
      `<meta property="og:url" content="${pageUrl}" />`
    );

    const routeDir = path.join(distDir, route.path);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
    console.log(`Generated static page: dist/${route.path}/index.html`);
  }

  // 2. Fetch & Generate Blog Posts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, published_at, cover_images, cover_image_url')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching blog posts:', error);
    process.exit(1);
  }

  console.log(`Fetched ${posts.length} published blog posts.`);

  for (const post of posts) {
    const postSlug = post.slug;
    const postTitle = post.title;
    const postExcerpt = post.excerpt || '';
    const postUrl = `${BASE_URL}/blog/${postSlug}`;
    
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

    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${postTitle} — Poojan Anghan Blog</title>`
    );
    
    html = html.replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${postExcerpt.replace(/"/g, '&quot;')}" />`
    );

    html = html.replace(
      /<link rel="canonical" href=".*?" \/>/,
      `<link rel="canonical" href="${postUrl}" />`
    );

    html = html.replace(
      /<meta property="og:type" content=".*?" \/>/,
      `<meta property="og:type" content="article" />`
    );

    html = html.replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${postTitle.replace(/"/g, '&quot;')} — Poojan Anghan Blog" />`
    );

    html = html.replace(
      /<meta property="og:description" content=".*?" \/>/,
      `<meta property="og:description" content="${postExcerpt.replace(/"/g, '&quot;')}" />`
    );

    html = html.replace(
      /<meta property="og:url" content=".*?" \/>/,
      `<meta property="og:url" content="${postUrl}" />`
    );

    html = html.replace(
      /<meta property="og:image" content=".*?" \/>/,
      `<meta property="og:image" content="${mainImage}" />`
    );

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

    const postDir = path.join(distDir, 'blog', postSlug);
    fs.mkdirSync(postDir, { recursive: true });
    fs.writeFileSync(path.join(postDir, 'index.html'), html, 'utf8');
    console.log(`Generated static post: dist/blog/${postSlug}/index.html`);
  }

  console.log('All static pages and blog posts generated successfully!');
}

generate().catch(err => {
  console.error('Static generation failed:', err);
  process.exit(1);
});
