import { renderPage, initScrollObserver } from './renderer.js';
import { initContactForm } from './email.js';

// Global Application Memory Store
export const AppState = {
  profile: null,
  projects: [],
  blogs: [],
  contact: null
};

// Application Bootloader
async function initApp() {
  try {
    // 1. Fetch Static JSON Layer asynchronously
    const [profileRes, projectsRes, blogsRes, contactRes] = await Promise.all([
      fetch('data/profile.json'),
      fetch('data/projects.json'),
      fetch('data/blogs.json'),
      fetch('data/contact.json')
    ]);

    AppState.profile = await profileRes.json();
    AppState.projects = await projectsRes.json();
    AppState.blogs = await blogsRes.json();
    AppState.contact = await contactRes.json();

    // 2. Populate Footer Socials on load
    populateSocials();

    // 3. Bind Route Handlers
    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);

    // 4. Setup Cursor Spotlight glow for desktop
    initCursorSpotlight();

    // 5. Setup Mobile Menu Toggle Drawer
    initMobileMenu();

    // 6. Trigger first routing
    router();

  } catch (error) {
    console.error("Critical: Failed to bootloader-load static assets:", error);
    document.getElementById('app-viewport').innerHTML = `
      <div class="container mx-auto px-6 py-20 text-center">
        <h2 class="text-3xl font-bold text-red-500 mb-4">Bootloader Loading Failure</h2>
        <p class="text-slate-400">Failed to load essential portfolio parameters from the local memory store. Please check developer console logs.</p>
      </div>
    `;
  }
}

// Router Event Processor
function router() {
  const hash = window.location.hash.trim() || '#home';
  updateActiveNavLink(hash);
  window.scrollTo(0, 0);

  // Close mobile drawer on route transition
  const mobileDrawer = document.getElementById('mobile-drawer');
  mobileDrawer.classList.add('max-h-0', 'opacity-0');

  // Route matches
  // Pattern 1: #work/:slug
  if (hash.startsWith('#work/')) {
    const slug = hash.replace('#work/', '');
    const project = AppState.projects.find(p => p.slug === slug);
    if (project) {
      renderPage('project-detail', project);
      updateSEOTags(project.title, project.summary);
    } else {
      render404();
    }
    return;
  }

  // Pattern 2: #blog/:slug
  if (hash.startsWith('#blog/')) {
    const slug = hash.replace('#blog/', '');
    const blog = AppState.blogs.find(b => b.slug === slug);
    if (blog) {
      renderPage('blog-detail', blog);
      updateSEOTags(blog.title, blog.excerpt);
    } else {
      render404();
    }
    return;
  }

  // Simple matches: #home, #work, #blog, #about, #contact
  switch (hash) {
    case '#home':
      renderPage('home', AppState);
      updateSEOTags(
        `${AppState.profile.name} — ${AppState.profile.title}`,
        AppState.profile.tagline
      );
      break;
    case '#work':
      renderPage('work', AppState.projects);
      updateSEOTags("Selected Work — Poojan Anghan", "View client-facing case study designs.");
      break;
    case '#blog':
      renderPage('blog', AppState.blogs);
      updateSEOTags("Technical Articles — Poojan Anghan", "Read software engineering deep dives.");
      break;
    case '#about':
      renderPage('about', AppState.profile);
      updateSEOTags("About Me — Poojan Anghan", AppState.profile.bio);
      break;
    case '#contact':
      renderPage('contact', AppState.contact);
      updateSEOTags("Get in Touch — Poojan Anghan", "Reach out for remote engineering contracts.");
      initContactForm();
      break;
    default:
      render404();
  }
}

// Update Active CSS Classes on Navlinks
function updateActiveNavLink(hash) {
  const activeBase = hash.split('/')[0];
  
  // Header Desktop Links
  document.querySelectorAll('#nav-links a').forEach(link => {
    const linkHash = link.getAttribute('href');
    if (linkHash === activeBase) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile drawer links
  document.querySelectorAll('#mobile-drawer a').forEach(link => {
    const linkHash = link.getAttribute('href');
    if (linkHash === activeBase) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Render Fallback 404 View
function render404() {
  document.getElementById('app-viewport').innerHTML = `
    <div class="container mx-auto px-6 py-32 text-center fade-in">
      <div class="badge-neon mb-4">Error 404</div>
      <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">Page Not Found</h2>
      <p class="text-slate-400 max-w-md mx-auto mb-10">The view parameter you requested does not exist or has been shifted coordinates.</p>
      <a href="#home" class="btn-primary">Return to Base</a>
    </div>
  `;
  updateSEOTags("404 Page Not Found", "The page coordinates you requested do not exist.");
  lucide.createIcons();
}

// Update Document SEO metadata
function updateSEOTags(title, description) {
  document.title = title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);
}

// Render socials inside footer
function populateSocials() {
  const socialsContainer = document.getElementById('footer-socials');
  const s = AppState.profile.social;
  socialsContainer.innerHTML = `
    <a href="${s.github}" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors" aria-label="GitHub Profile"><i data-lucide="github"></i></a>
    <a href="${s.linkedin}" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors" aria-label="LinkedIn Profile"><i data-lucide="linkedin"></i></a>
    <a href="${s.twitter}" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors" aria-label="Twitter Profile"><i data-lucide="twitter"></i></a>
  `;
}

// Spotlight cursor Glow Effect
function initCursorSpotlight() {
  const glow = document.getElementById('cursor-glow');
  window.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

// Setup burger menu overlay
function initMobileMenu() {
  const btn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  
  btn.addEventListener('click', () => {
    const isClosed = drawer.classList.contains('max-h-0');
    if (isClosed) {
      drawer.classList.remove('max-h-0', 'opacity-0');
      drawer.classList.add('max-h-96', 'opacity-100');
      btn.innerHTML = `<i data-lucide="x" class="w-6 h-6"></i>`;
    } else {
      drawer.classList.add('max-h-0', 'opacity-0');
      drawer.classList.remove('max-h-96', 'opacity-100');
      btn.innerHTML = `<i data-lucide="menu" class="w-6 h-6"></i>`;
    }
    lucide.createIcons();
  });
}

// Listen for navigation header background transparency shifts
window.addEventListener('scroll', () => {
  const header = document.getElementById('header-nav');
  if (window.scrollY > 40) {
    header.classList.add('bg-slate-950/80', 'backdrop-blur-md', 'border-slate-800');
    header.classList.remove('border-transparent');
  } else {
    header.classList.remove('bg-slate-950/80', 'backdrop-blur-md', 'border-slate-800');
    header.classList.add('border-transparent');
  }
});

// Run Init
initApp();
