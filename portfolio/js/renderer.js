// DOM Rendering Engine
export function renderPage(viewType, data) {
  const container = document.getElementById('app-viewport');
  
  // Apply page transitions fade effects
  container.innerHTML = '';
  const transitionWrapper = document.createElement('div');
  transitionWrapper.className = 'fade-in';
  
  switch (viewType) {
    case 'home':
      transitionWrapper.innerHTML = getHomeTemplate(data);
      break;
    case 'work':
      transitionWrapper.innerHTML = getWorkTemplate(data);
      bindWorkFilters(transitionWrapper, data);
      break;
    case 'project-detail':
      transitionWrapper.innerHTML = getProjectDetailTemplate(data);
      break;
    case 'blog':
      transitionWrapper.innerHTML = getBlogTemplate(data);
      bindBlogSearchAndFilters(transitionWrapper, data);
      break;
    case 'blog-detail':
      transitionWrapper.innerHTML = getBlogDetailTemplate(data);
      break;
    case 'about':
      transitionWrapper.innerHTML = getAboutTemplate(data);
      break;
    case 'contact':
      transitionWrapper.innerHTML = getContactTemplate(data);
      break;
    default:
      transitionWrapper.innerHTML = `<h2 class="text-center text-white py-20">View Unknown</h2>`;
  }
  
  container.appendChild(transitionWrapper);
  
  // Trigger Lucide icons generation
  lucide.createIcons();
  
  // Trigger Intersection Observers for entry animations
  initScrollObserver();
}

// -------------------------------------------------------------
// View Template Generators
// -------------------------------------------------------------

function getHomeTemplate(state) {
  const p = state.profile;
  const projects = state.projects.slice(0, 2);
  const blogs = state.blogs.slice(0, 2);
  
  return `
    <!-- Hero Block -->
    <section class="py-20 relative overflow-hidden">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-emerald-glow opacity-10 rounded-full blur-[120px]"></div>
      <div class="max-w-4xl mx-auto text-center relative z-10 reveal-on-scroll">
        <div class="badge-neon mb-6">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          ${state.contact.availability}
        </div>
        <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          Hi, I'm <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">${p.name}</span>
        </h1>
        <p class="text-xl sm:text-2xl text-slate-400 mb-10 font-light max-w-2xl mx-auto">${p.tagline}</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#work" class="btn-primary w-full sm:w-auto">View Selected Work <i data-lucide="arrow-right"></i></a>
          <a href="#contact" class="btn-secondary w-full sm:w-auto">Contact Me</a>
        </div>
      </div>
    </section>

    <!-- Selected Projects -->
    <section class="py-20 border-t border-slate-900">
      <div class="max-w-5xl mx-auto">
        <div class="flex items-end justify-between mb-12 reveal-on-scroll">
          <div>
            <div class="badge-neon mb-2">Portfolio</div>
            <h2 class="text-3xl font-bold text-white">Selected Projects</h2>
          </div>
          <a href="#work" class="text-emerald-400 hover:text-white font-medium flex items-center gap-2 transition-colors">See All <i data-lucide="chevron-right" class="w-4 h-4"></i></a>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${projects.map(proj => getProjectCardHTML(proj)).join('')}
        </div>
      </div>
    </section>

    <!-- Latest Articles -->
    <section class="py-20 border-t border-slate-900">
      <div class="max-w-5xl mx-auto">
        <div class="flex items-end justify-between mb-12 reveal-on-scroll">
          <div>
            <div class="badge-neon mb-2">Articles</div>
            <h2 class="text-3xl font-bold text-white">Latest Writing</h2>
          </div>
          <a href="#blog" class="text-emerald-400 hover:text-white font-medium flex items-center gap-2 transition-colors">See All <i data-lucide="chevron-right" class="w-4 h-4"></i></a>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          ${blogs.map(blog => getBlogCardHTML(blog)).join('')}
        </div>
      </div>
    </section>
  `;
}

function getWorkTemplate(projects) {
  // Extract all unique project tags for filtering controls
  const allTags = ['All', ...new Set(projects.flatMap(p => p.tags))];
  
  return `
    <section class="py-16 max-w-5xl mx-auto reveal-on-scroll">
      <div class="text-center mb-12">
        <div class="badge-neon mb-2">Exhibits</div>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Selected Case Studies</h1>
        <p class="text-slate-400">Deep dives into client-facing remote software engineering deliveries.</p>
      </div>

      <!-- Tag Filter Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-3 mb-12" id="work-filter-controls">
        ${allTags.map((tag, idx) => `
          <button class="tag-btn ${idx === 0 ? 'active' : ''}" data-tag="${tag}">${tag}</button>
        `).join('')}
      </div>

      <!-- Projects Grid Output -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8" id="projects-grid">
        ${projects.map(proj => getProjectCardHTML(proj)).join('')}
      </div>
    </section>
  `;
}

function getProjectDetailTemplate(p) {
  return `
    <section class="py-12 max-w-4xl mx-auto reveal-on-scroll">
      <a href="#work" class="hover:text-emerald-400 text-slate-400 text-sm font-medium flex items-center gap-2 mb-8 transition-colors">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Exhibits
      </a>

      <!-- Case study Header -->
      <div class="mb-10">
        <div class="flex flex-wrap items-center gap-2 mb-4">
          ${p.tags.map(t => `<span class="badge-neon py-0.5 px-2.5 text-[10px]">${t}</span>`).join('')}
          <span class="text-slate-500 text-sm ml-2">${p.role} &bull; ${p.year}</span>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">${p.title}</h1>
        <p class="text-lg sm:text-xl text-slate-400 leading-relaxed font-light">${p.summary}</p>
      </div>

      <!-- Hero Gallery Slides -->
      <div class="relative w-full h-[300px] sm:h-[450px] rounded-2xl overflow-hidden border border-slate-800 mb-12 shadow-2xl">
        <img src="${p.thumbnail}" alt="${p.title}" class="w-full h-full object-cover" />
      </div>

      <!-- Key metrics panels -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        ${p.metrics.map(m => `
          <div class="p-6 bg-slate-900 border border-slate-850 rounded-xl text-center shadow-md">
            <span class="block text-2xl font-bold text-emerald-400 mb-1">${m.split(' ')[0]}</span>
            <span class="text-xs text-slate-400 uppercase tracking-wider font-semibold">${m.substring(m.indexOf(' ') + 1)}</span>
          </div>
        `).join('')}
      </div>

      <!-- Structured Case Study Sections -->
      <div class="space-y-12 leading-relaxed text-slate-350">
        <div class="card-glass">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="help-circle" class="text-red-400"></i> The Challenge</h3>
          <p>${p.problem}</p>
        </div>

        <div class="card-glass">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="loader" class="text-blue-400"></i> Engineering Process</h3>
          <p>${p.process}</p>
        </div>

        <div class="card-glass">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="check-circle" class="text-emerald-400"></i> The Solution</h3>
          <p>${p.solution}</p>
        </div>

        <div class="card-glass">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2"><i data-lucide="trending-up" class="text-teal-450"></i> Shipped Outcomes</h3>
          <p>${p.outcome}</p>
        </div>
      </div>

      <!-- Live and Git Action Buttons -->
      <div class="mt-12 flex flex-wrap items-center gap-4 justify-center border-t border-slate-900 pt-10">
        <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary">View Deployment <i data-lucide="external-link"></i></a>
        <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary">Source Code <i data-lucide="github"></i></a>
      </div>
    </section>
  `;
}

function getBlogTemplate(blogs) {
  const allTags = ['All', ...new Set(blogs.flatMap(b => b.tags))];
  
  return `
    <section class="py-16 max-w-5xl mx-auto reveal-on-scroll">
      <div class="text-center mb-12">
        <div class="badge-neon mb-2">Knowledge Base</div>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Engineering Notebook</h1>
        <p class="text-slate-400">Deep dives into software architecture, React state closures, and API engineering.</p>
      </div>

      <!-- Search & Tag Filter Matrix -->
      <div class="max-w-2xl mx-auto space-y-6 mb-16">
        <div class="relative">
          <input type="text" id="blog-search" placeholder="Search articles by title or content..." class="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-5 py-4 pl-12 text-sm text-slate-200 outline-none transition-all shadow-inner" />
          <i data-lucide="search" class="absolute left-4 top-4.5 text-slate-500 w-5 h-5"></i>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2" id="blog-filter-controls">
          ${allTags.map((tag, idx) => `
            <button class="tag-btn ${idx === 0 ? 'active' : ''}" data-tag="${tag}">${tag}</button>
          `).join('')}
        </div>
      </div>

      <!-- Articles Output Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8" id="blogs-grid">
        ${blogs.map(blog => getBlogCardHTML(blog)).join('')}
      </div>
    </section>
  `;
}

function getBlogDetailTemplate(blog) {
  return `
    <section class="py-12 max-w-3xl mx-auto reveal-on-scroll">
      <a href="#blog" class="hover:text-emerald-400 text-slate-400 text-sm font-medium flex items-center gap-2 mb-8 transition-colors">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Writing
      </a>

      <!-- Article Header -->
      <div class="mb-10 border-b border-slate-900 pb-10">
        <div class="flex items-center gap-2 mb-4">
          ${blog.tags.map(t => `<span class="badge-neon py-0.5 px-2.5 text-[10px]">${t}</span>`).join('')}
          <span class="text-slate-500 text-sm ml-2">${blog.date} &bull; ${blog.readTime}</span>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">${blog.title}</h1>
        <p class="text-lg text-slate-400 font-light leading-relaxed">${blog.excerpt}</p>
      </div>

      <!-- Article Banner -->
      <div class="w-full h-[250px] sm:h-[350px] rounded-2xl overflow-hidden border border-slate-800 mb-12 shadow-2xl">
        <img src="${blog.coverImage}" alt="${blog.title}" class="w-full h-full object-cover" />
      </div>

      <!-- Content Renderer -->
      <article class="prose prose-invert max-w-none text-slate-350 leading-relaxed space-y-6">
        ${blog.content}
      </article>
    </section>
  `;
}

function getAboutTemplate(p) {
  return `
    <section class="py-16 max-w-4xl mx-auto reveal-on-scroll">
      <div class="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12 items-start mb-20">
        <!-- Profile Column -->
        <div class="text-center md:text-left space-y-6">
          <div class="w-48 h-48 rounded-2xl overflow-hidden border border-slate-800 mx-auto md:mx-0 shadow-2xl">
            <img src="${p.avatar}" alt="${p.name}" class="w-full h-full object-cover" />
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">${p.name}</h2>
            <p class="text-sm text-emerald-400 font-medium">${p.title}</p>
          </div>
          <a href="${p.resume}" target="_blank" download class="btn-primary w-full justify-center"><i data-lucide="download"></i> Download Resume</a>
        </div>

        <!-- Bio Paragraph and Tech Grids -->
        <div class="space-y-8">
          <div>
            <div class="badge-neon mb-4">Bio Profile</div>
            <p class="text-lg text-slate-400 leading-relaxed font-light">${p.bio}</p>
          </div>

          <!-- Skills grids -->
          <div>
            <h3 class="text-xl font-bold text-white mb-6">Technical Skills</h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              ${p.skills.map(s => `
                <div class="p-5 bg-slate-900 border border-slate-850 rounded-xl">
                  <h4 class="text-emerald-400 font-bold text-sm mb-3 uppercase tracking-wider">${s.category}</h4>
                  <ul class="space-y-2 text-xs text-slate-300">
                    ${s.items.map(item => `<li class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> ${item}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Experience & Academic Timeline Stack -->
      <div class="border-t border-slate-900 pt-16">
        <h3 class="text-2xl font-bold text-white mb-10 text-center md:text-left flex items-center gap-3 justify-center md:justify-start">
          <i data-lucide="briefcase" class="text-emerald-400"></i> Work Experience & Education
        </h3>
        
        <div class="timeline-track space-y-12">
          <!-- Experience Items -->
          ${p.experience.map(e => `
            <div class="relative">
              <div class="timeline-dot"></div>
              <div class="mb-2">
                <span class="badge-neon py-0.5 px-2.5 text-[10px]">${e.period}</span>
              </div>
              <h4 class="text-xl font-bold text-white">${e.role}</h4>
              <div class="text-xs text-emerald-400 font-medium uppercase tracking-wider mb-3">${e.company}</div>
              <p class="text-slate-400 text-sm leading-relaxed">${e.desc}</p>
            </div>
          `).join('')}

          <!-- Academic Items -->
          ${p.education.map(ed => `
            <div class="relative">
              <div class="timeline-dot bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
              <div class="mb-2">
                <span class="badge-neon py-0.5 px-2.5 text-[10px] border-blue-900/50 bg-blue-950/20 text-blue-400">${ed.year}</span>
              </div>
              <h4 class="text-xl font-bold text-white">${ed.degree}</h4>
              <div class="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">${ed.school}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function getContactTemplate(c) {
  return `
    <section class="py-16 max-w-4xl mx-auto reveal-on-scroll">
      <div class="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
        
        <!-- Interactive Form -->
        <div class="card-glass">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-white mb-2">Let's Build Together</h2>
            <p class="text-xs text-slate-500">Response time: ${c.responseTime} &bull; ${c.availability}</p>
          </div>
          
          <form id="contact-form" class="space-y-5">
            <div>
              <label for="form-name" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
              <input type="text" id="form-name" required class="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50" placeholder="Poojan Anghan" />
            </div>

            <div>
              <label for="form-email" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Coordinate</label>
              <input type="email" id="form-email" required class="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50" placeholder="anghanpoojan66@gmail.com" />
            </div>

            <div>
              <label for="form-subject" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
              <input type="text" id="form-subject" required class="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50" placeholder="Remote contract scope" />
            </div>

            <div>
              <label for="form-message" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message Description</label>
              <textarea id="form-message" required rows="4" class="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50 resize-none" placeholder="Provide project milestones or scope requirements..."></textarea>
            </div>

            <div>
              <label for="form-attachment" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Attachment <span class="text-slate-500">(Optional, Max 5MB)</span></label>
              <input type="file" id="form-attachment" class="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-400 file:bg-slate-900 file:border-0 file:text-emerald-400 file:px-3 file:py-1 file:mr-3 file:rounded file:font-semibold" />
              <div id="file-error" class="hidden text-red-500 text-[10px] mt-1 font-semibold"></div>
            </div>

            <button type="submit" class="btn-primary w-full justify-center" id="submit-btn">
              Send Message <i data-lucide="send"></i>
            </button>
            <div id="form-response" class="hidden text-center text-xs mt-3 p-3 rounded-lg"></div>
          </form>
        </div>

        <!-- Coordinates Details -->
        <div class="space-y-8">
          <div>
            <div class="badge-neon mb-4">Coordinates</div>
            <h1 class="text-3xl font-bold text-white mb-6">Contact Channels</h1>
            <p class="text-slate-400">Reach out for remote consulting, project inquiries, or standard hiring scopes.</p>
          </div>

          <div class="space-y-6">
            <a href="tel:${c.phone}" class="flex items-center gap-4 p-5 bg-slate-900 border border-slate-850 rounded-xl hover:border-emerald-500/30 transition-all group">
              <div class="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <i data-lucide="phone"></i>
              </div>
              <div>
                <span class="block text-xs text-slate-500">Call Me</span>
                <span class="text-white font-medium group-hover:text-emerald-400 transition-colors">${c.phone}</span>
              </div>
            </a>

            <a href="mailto:${c.email}" class="flex items-center gap-4 p-5 bg-slate-900 border border-slate-850 rounded-xl hover:border-emerald-500/30 transition-all group">
              <div class="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <i data-lucide="mail"></i>
              </div>
              <div>
                <span class="block text-xs text-slate-500">Email Coordinate</span>
                <span class="text-white font-medium group-hover:text-emerald-400 transition-colors break-all">${c.email}</span>
              </div>
            </a>

            <div class="flex items-center gap-4 p-5 bg-slate-900 border border-slate-850 rounded-xl">
              <div class="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center text-emerald-400">
                <i data-lucide="map-pin"></i>
              </div>
              <div>
                <span class="block text-xs text-slate-500">Location Base</span>
                <span class="text-white font-medium">${c.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// -------------------------------------------------------------
// Component HTML Helpers
// -------------------------------------------------------------

function getProjectCardHTML(p) {
  return `
    <div class="card-glass flex flex-col justify-between h-full group project-card" data-tags="${p.tags.join(',')}">
      <div>
        <div class="w-full h-48 rounded-lg overflow-hidden border border-slate-800/80 mb-6 relative">
          <img src="${p.thumbnail}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div class="flex flex-wrap items-center gap-1.5 mb-3">
          ${p.tags.map(t => `<span class="badge-neon py-0.5 px-2 text-[8px]">${t}</span>`).join('')}
        </div>
        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">${p.title}</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6 font-light">${p.summary}</p>
      </div>
      <a href="#work/${p.slug}" class="text-sm font-semibold text-emerald-400 group-hover:text-white flex items-center gap-1.5 transition-colors">
        Read Case Study <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </a>
    </div>
  `;
}

function getBlogCardHTML(b) {
  return `
    <div class="card-glass flex flex-col justify-between h-full group blog-card" data-tags="${b.tags.join(',')}" data-title="${b.title.toLowerCase()}">
      <div>
        <div class="w-full h-40 rounded-lg overflow-hidden border border-slate-800/80 mb-6 relative">
          <img src="${b.coverImage}" alt="${b.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div class="flex items-center gap-2 mb-3">
          ${b.tags.map(t => `<span class="badge-neon py-0.5 px-2 text-[8px]">${t}</span>`).join('')}
          <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">${b.date}</span>
        </div>
        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">${b.title}</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6 font-light">${b.excerpt}</p>
      </div>
      <a href="#blog/${b.slug}" class="text-sm font-semibold text-emerald-400 group-hover:text-white flex items-center gap-1.5 transition-colors">
        Read Article <i data-lucide="arrow-right" class="w-4 h-4"></i>
      </a>
    </div>
  `;
}

// -------------------------------------------------------------
// Interactive Bindings & Action Listeners
// -------------------------------------------------------------

function bindWorkFilters(el, projects) {
  const controls = el.querySelector('#work-filter-controls');
  const cards = el.querySelectorAll('.project-card');
  
  if (!controls) return;
  
  controls.addEventListener('click', (e) => {
    const btn = e.target.closest('.tag-btn');
    if (!btn) return;
    
    controls.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const tag = btn.getAttribute('data-tag');
    
    cards.forEach(card => {
      const cardTags = card.getAttribute('data-tags').split(',');
      if (tag === 'All' || cardTags.includes(tag)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

function bindBlogSearchAndFilters(el, blogs) {
  const searchInput = el.querySelector('#blog-search');
  const controls = el.querySelector('#blog-filter-controls');
  const cards = el.querySelectorAll('.blog-card');
  
  if (!searchInput || !controls) return;
  
  let activeTag = 'All';
  let searchQuery = '';
  
  const filterBlogs = () => {
    cards.forEach(card => {
      const cardTags = card.getAttribute('data-tags').split(',');
      const title = card.getAttribute('data-title');
      const matchesTag = activeTag === 'All' || cardTags.includes(activeTag);
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      
      if (matchesTag && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };
  
  controls.addEventListener('click', (e) => {
    const btn = e.target.closest('.tag-btn');
    if (!btn) return;
    
    controls.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    activeTag = btn.getAttribute('data-tag');
    filterBlogs();
  });
  
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterBlogs();
  });
}

// -------------------------------------------------------------
// Intersection Observers for Scroll Fades
// -------------------------------------------------------------

export function initScrollObserver() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(el => observer.observe(el));
  
  // Also add immediate reveal to items visible without scroll
  setTimeout(() => {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight) {
        el.classList.add('revealed');
      }
    });
  }, 100);
}
