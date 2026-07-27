import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually parse .env file if running locally and process.env is not populated
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
  console.error('Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set in process.env or .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BASE_URL = 'https://pujan-anghan.vercel.app';

// Static pages
const staticPages = [
  '',
  '#/about',
  '#/projects',
  '#/services',
  '#/experience',
  '#/blog',
  '#/testimonials',
  '#/contact'
];

async function generate() {
  console.log('Generating sitemap.xml...');
  
  // Fetch blog posts from Supabase
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    process.exit(1);
  }

  const currentDate = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static pages
  staticPages.forEach((route) => {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/${route}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });

  // Add dynamic blog posts
  posts.forEach((post) => {
    const postDate = new Date(post.updated_at || new Date()).toISOString().split('T')[0];
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}/#/blog/${post.slug}</loc>\n`;
    xml += `    <lastmod>${postDate}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>\n';

  // Write to public/sitemap.xml
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  
  console.log(`Sitemap successfully generated at: ${sitemapPath}`);
}

generate().catch(err => {
  console.error('Sitemap generation failed:', err);
  process.exit(1);
});
