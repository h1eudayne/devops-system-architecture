import React, { useEffect, useRef, memo, useState } from 'react';
import { marked } from 'marked';

// Helper to resolve relative path from base path
function resolveRelativePath(basePath, relativePath) {
  if (!relativePath || relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('#') || relativePath.startsWith('mailto:')) {
    return null;
  }
  
  let cleanRel = decodeURIComponent(relativePath);
  if (cleanRel.startsWith('/')) {
    return cleanRel.slice(1);
  }
  
  const baseParts = basePath.split('/');
  baseParts.pop(); // remove filename
  
  const relParts = cleanRel.split('/');
  for (const part of relParts) {
    if (part === '.' || part === '') {
      continue;
    }
    if (part === '..') {
      if (baseParts.length > 0) {
        baseParts.pop();
      }
    } else {
      baseParts.push(part);
    }
  }
  
  return baseParts.join('/');
}

const ContentArea = memo(function ContentArea({
  content,
  title,
  type = 'markdown',
  language = '',
  glossaryData,
  onImageClick,
  completedSections,
  onToggleSection,
  activePath,
  onShowTooltip,
  onHideTooltip,
  onSelectFile,
  availablePaths = [],
  prevFile = null,
  nextFile = null
}) {
  const containerRef = useRef(null);
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Parse markdown
  const htmlContent = content && type === 'markdown' ? marked.parse(content) : '';

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (type === 'code' && codeRef.current && window.Prism) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [content, type, language]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !content || type !== 'markdown') return;

    // 1. Walk DOM to apply glossary tooltips
    applyGlossary(container);

    // 2. Inject section checkboxes
    injectCheckboxes(container);

    // 3. Bind image click handlers for Zoomer
    bindImageTriggers(container);

    // 3.5. Render Mermaid diagrams
    renderMermaidDiagrams(container);

    // 4. Setup Glossary tooltip delegation
    const handleMouseOver = (e) => {
      const term = e.target.closest('.glossary-term');
      if (term) {
        const tooltipText = term.getAttribute('data-tooltip');
        if (tooltipText) {
          const rect = term.getBoundingClientRect();
          onShowTooltip(tooltipText, rect);
        }
      }
    };

    const handleMouseOut = (e) => {
      const term = e.target.closest('.glossary-term');
      if (term) {
        onHideTooltip();
      }
    };

    // 5. Setup link click interception
    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      const hashIndex = href.indexOf('#');
      const cleanHref = hashIndex !== -1 ? href.slice(0, hashIndex) : href;
      const targetHash = hashIndex !== -1 ? href.slice(hashIndex) : '';

      if (!cleanHref && targetHash) {
        e.preventDefault();
        const targetEl = document.querySelector(targetHash);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      const resolved = resolveRelativePath(activePath, cleanHref);
      if (resolved && availablePaths.includes(resolved)) {
        e.preventDefault();
        onSelectFile(resolved);
        if (targetHash) {
          setTimeout(() => {
            const targetEl = document.querySelector(targetHash);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);
    container.addEventListener('click', handleLinkClick);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
      container.removeEventListener('click', handleLinkClick);
    };
  }, [content, glossaryData, completedSections, activePath, type, availablePaths, onSelectFile]);

  // Apply glossary tooltips on text nodes
  const applyGlossary = (root) => {
    if (!glossaryData) return;
    const glossaryKeys = Object.keys(glossaryData).sort((a, b) => b.length - a.length);
    if (glossaryKeys.length === 0) return;

    function walk(node) {
      if (node.nodeType === 3) { // TEXT_NODE
        const text = node.nodeValue;
        const parent = node.parentNode;
        
        if (!parent) return;
        
        const parentTag = parent.tagName.toLowerCase();
        const skipTags = ['pre', 'code', 'a', 'button', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        if (skipTags.includes(parentTag) || parent.classList.contains('glossary-term')) {
          return;
        }
        
        let matches = [];
        glossaryKeys.forEach(key => {
          const regex = new RegExp(`\\b${key}s?\\b`, 'gi');
          let match;
          while ((match = regex.exec(text)) !== null) {
            matches.push({
              index: match.index,
              length: match[0].length,
              word: match[0],
              key: key
            });
          }
        });
        
        matches.sort((a, b) => a.index - b.index);
        let cleanMatches = [];
        let lastIndex = 0;
        matches.forEach(m => {
          if (m.index >= lastIndex) {
            cleanMatches.push(m);
            lastIndex = m.index + m.length;
          }
        });
        
        if (cleanMatches.length > 0) {
          const fragment = document.createDocumentFragment();
          let cursor = 0;
          
          cleanMatches.forEach(m => {
            if (m.index > cursor) {
              fragment.appendChild(document.createTextNode(text.substring(cursor, m.index)));
            }
            
            const span = document.createElement('span');
            span.className = 'glossary-term';
            span.textContent = m.word;
            const entry = glossaryData[m.key];
            span.setAttribute('data-tooltip', `[${entry.vi}] ${entry.def}`);
            fragment.appendChild(span);
            
            cursor = m.index + m.length;
          });
          
          if (cursor < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(cursor)));
          }
          
          parent.replaceChild(fragment, node);
        }
      } else {
        const children = Array.from(node.childNodes);
        children.forEach(child => walk(child));
      }
    }

    walk(root);
  };

  // Inject section checkboxes next to H2/H3
  const injectCheckboxes = (root) => {
    const headers = root.querySelectorAll('h2, h3');
    
    headers.forEach((header, index) => {
      // Create clean id if none exists
      if (!header.id) {
        const cleanText = header.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        header.id = `heading-${index}-${cleanText}`;
      }

      const sectionId = `section-${activePath}-${header.id}`;
      const isChecked = completedSections.has(sectionId);

      // Check if checkbox already exists to avoid duplication
      let checkboxWrapper = header.querySelector('.section-checkbox-wrapper');
      if (!checkboxWrapper) {
        checkboxWrapper = document.createElement('span');
        checkboxWrapper.className = 'section-checkbox-wrapper';
        checkboxWrapper.innerHTML = `<input type="checkbox" class="section-checkbox" />`;
        header.insertBefore(checkboxWrapper, header.firstChild);
      }

      const checkbox = checkboxWrapper.querySelector('input');
      checkbox.checked = isChecked;
      
      // Update check handler
      checkbox.onchange = (e) => {
        onToggleSection(sectionId, e.target.checked);
      };
    });
  };

  // Bind image zoom triggers
  const bindImageTriggers = (root) => {
    const images = root.querySelectorAll('img');
    images.forEach(img => {
      img.onclick = () => {
        onImageClick(img.src, img.alt || 'Sơ đồ thiết kế hệ thống');
      };
    });
  };

  // Render Mermaid diagrams dynamically
  const renderMermaidDiagrams = (root) => {
    if (!window.mermaid) return;
    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        suppressErrors: true
      });

      const codeBlocks = root.querySelectorAll('pre code.language-mermaid');
      codeBlocks.forEach((codeEl, idx) => {
        const preEl = codeEl.parentNode;
        const text = codeEl.textContent.trim();

        const div = document.createElement('div');
        div.className = 'mermaid';
        div.id = `mermaid-diagram-${idx}-${Date.now()}`;
        div.textContent = text;

        preEl.parentNode.replaceChild(div, preEl);
      });

      const mermaidDivs = root.querySelectorAll('.mermaid');
      if (mermaidDivs.length > 0) {
        window.mermaid.run({
          nodes: mermaidDivs
        });
      }
    } catch (e) {
      console.error("Failed to render mermaid diagrams:", e);
    }
  };

  return (
    <main className="content-panel" id="content-panel">
      <div className="content-wrapper">
        {content ? (
          type === 'code' ? (
            <div className="code-viewer-container">
              <div className="code-viewer-header">
                <div className="code-viewer-file-info">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="code-file-icon">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span className="code-viewer-filepath">{activePath}</span>
                </div>
                <button onClick={handleCopy} className="code-copy-btn" aria-label="Copy code">
                  {copied ? (
                    <>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" className="copy-success-icon">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="copy-icon">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
              <div className="code-viewer-body">
                <pre className={`language-${language}`}>
                  <code ref={codeRef} className={`language-${language}`}>
                    {content}
                  </code>
                </pre>
              </div>
            </div>
          ) : (
            <article className="markdown-body" id="content-area">
              <div ref={containerRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </article>
          )
        ) : (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Vui lòng chọn tài liệu từ thanh bên trái để bắt đầu đọc...</p>
          </div>
        )}
        
        {content && (prevFile || nextFile) && (
          <div className="doc-pagination">
            {prevFile ? (
              <button 
                className="pagination-btn prev-btn"
                onClick={() => onSelectFile(prevFile.path)}
                title={prevFile.title}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pagination-arrow">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <div className="pagination-info">
                  <span className="pagination-label">Bài trước</span>
                  <span className="pagination-title">{prevFile.title}</span>
                </div>
              </button>
            ) : (
              <div className="pagination-spacer" />
            )}
            
            {nextFile ? (
              <button 
                className="pagination-btn next-btn"
                onClick={() => onSelectFile(nextFile.path)}
                title={nextFile.title}
              >
                <div className="pagination-info">
                  <span className="pagination-label">Bài tiếp theo</span>
                  <span className="pagination-title">{nextFile.title}</span>
                </div>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pagination-arrow">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            ) : (
              <div className="pagination-spacer" />
            )}
          </div>
        )}
      </div>
    </main>
  );
});

export default ContentArea;
