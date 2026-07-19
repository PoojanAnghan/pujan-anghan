import { useEffect } from 'react';

const SEO = ({ title, description, keywords }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const updateMeta = (name, content) => {
      if (content === undefined || content === null) return;
      let el = document.querySelector(`meta[name="${name}"]`);
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
      if (content === undefined || content === null) return;
      let el = document.querySelector(`meta[property="${property}"]`);
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
    updateProperty('twitter:title', title);
    updateProperty('twitter:description', description);

    // Update canonical link dynamically per page route (hash-aware)
    let canonical = document.querySelector('link[rel="canonical"]');
    const currentUrl = window.location.href.split('#')[0] + (window.location.hash || '');
    if (canonical) {
      canonical.setAttribute('href', currentUrl);
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = currentUrl;
      document.head.appendChild(canonical);
    }
  }, [title, description, keywords]);

  return null;
};

export default SEO;
