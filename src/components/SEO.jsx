import { useEffect } from 'react';

const SEO = ({ title, description, keywords, noindex, image, type = 'website', publishedTime }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const updateMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (content === undefined || content === null || content === '') {
        if (el) el.remove();
        return;
      }
      if (el) {
        el.setAttribute('content', content);
      } else {
        el = document.createElement('meta');
        el.name = name;
        el.content = content;
        document.head.appendChild(el);
      }
    };

    const updateProperty = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (content === undefined || content === null || content === '') {
        if (el) el.remove();
        return;
      }
      if (el) {
        el.setAttribute('content', content);
      } else {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        el.content = content;
        document.head.appendChild(el);
      }
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    
    // OG & Twitter tags
    updateProperty('og:title', title);
    updateProperty('og:description', description);
    updateProperty('og:type', type);
    
    // Image handling (with default fallback)
    const defaultImage = 'https://pujan-anghan.vercel.app/assets/index-Bgt6NMfJ.css'; // fallback placeholder URL
    const ogImage = image || defaultImage;
    updateProperty('og:image', ogImage);
    updateProperty('twitter:image', ogImage);
    updateMeta('twitter:card', image ? 'summary_large_image' : 'summary');

    updateProperty('twitter:title', title);
    updateProperty('twitter:description', description);

    // Article Specific Tags
    if (type === 'article' && publishedTime) {
      updateProperty('article:published_time', publishedTime);
      updateProperty('article:author', 'Poojan Anghan');
    } else {
      updateProperty('article:published_time', null);
      updateProperty('article:author', null);
    }

    // Robots indexing rules
    if (noindex || window.location.hash.startsWith('#/admin') || window.location.pathname.startsWith('/admin')) {
      updateMeta('robots', 'noindex, nofollow');
    } else {
      updateMeta('robots', 'index, follow');
    }

    // Update canonical link dynamically per page route (BrowserRouter-aware)
    let canonical = document.querySelector('link[rel="canonical"]');
    const currentUrl = window.location.origin + window.location.pathname;
    if (canonical) {
      canonical.setAttribute('href', currentUrl);
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = currentUrl;
      document.head.appendChild(canonical);
    }

    // JSON-LD Structured Data
    const siteUrl = 'https://pujan-anghan.vercel.app';
    const authorName = 'Poojan Anghan';
    let schema = {};

    if (type === 'article') {
      schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': title,
        'description': description,
        'image': ogImage ? [ogImage] : [],
        'datePublished': publishedTime,
        'author': {
          '@type': 'Person',
          'name': authorName,
          'url': siteUrl
        },
        'publisher': {
          '@type': 'Organization',
          'name': authorName,
          'logo': {
            '@type': 'ImageObject',
            'url': `${siteUrl}/favicon.ico`
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': currentUrl
        }
      };
    } else {
      schema = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            'name': title || 'Poojan Anghan',
            'url': siteUrl,
            'publisher': {
              '@id': `${siteUrl}/#person`
            }
          },
          {
            '@type': 'Person',
            '@id': `${siteUrl}/#person`,
            'name': authorName,
            'url': siteUrl,
            'image': `${siteUrl}/profile.jpg`,
            'sameAs': [
              'https://github.com/PoojanAnghan',
              'https://www.linkedin.com/in/poojan-a-447073340/',
              'https://pujan-anghan.vercel.app'
            ],
            'jobTitle': 'Freelance Software Engineer',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Surat',
              'addressRegion': 'Gujarat',
              'addressCountry': 'IN'
            },
            'knowsAbout': ['React.js', 'Python', 'Django', 'FastAPI', 'Flask', 'Web Development', 'IT Consulting']
          },
          {
            '@type': 'ProfessionalService',
            '@id': `${siteUrl}/#service`,
            'name': authorName,
            'url': siteUrl,
            'image': `${siteUrl}/profile.jpg`,
            'telephone': '+917043832747',
            'priceRange': '$$',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Surat',
              'addressRegion': 'Gujarat',
              'addressCountry': 'IN'
            },
            'knowsAbout': ['React.js', 'Python', 'Django', 'FastAPI', 'Flask', 'Web Development', 'IT Consulting'],
            'serviceType': 'freelance software/IT consulting'
          }
        ]
      };
    }

    let schemaScript = document.querySelector('script[id="json-ld-schema"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'json-ld-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.text = JSON.stringify(schema);

    // Cleanup on unmount or prop changes
    return () => {
      const scriptEl = document.querySelector('script[id="json-ld-schema"]');
      if (scriptEl) {
        scriptEl.remove();
      }
    };
  }, [title, description, keywords, noindex, image, type, publishedTime]);

  return null;
};

export default SEO;
