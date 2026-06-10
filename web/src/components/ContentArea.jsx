import React, { useEffect, useRef, memo } from 'react';
import { marked } from 'marked';

const ContentArea = memo(function ContentArea({
  content,
  title,
  glossaryData,
  onImageClick,
  completedSections,
  onToggleSection,
  activePath,
  onShowTooltip,
  onHideTooltip
}) {
  const containerRef = useRef(null);

  // Parse markdown
  const htmlContent = content ? marked.parse(content) : '';

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !content) return;

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

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
    };
  }, [content, glossaryData, completedSections, activePath]);

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
          <article className="markdown-body" id="content-area">
            <div ref={containerRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </article>
        ) : (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Vui lòng chọn tài liệu từ thanh bên trái để bắt đầu đọc...</p>
          </div>
        )}
      </div>
    </main>
  );
});

export default ContentArea;
