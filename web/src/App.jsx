import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import Outline from './components/Outline';
import ImageZoomer from './components/ImageZoomer';
import GlossaryTooltip from './components/GlossaryTooltip';
import rawData from './data.json'; // Compiled by build_site_data.py

export default function App() {
  // --- LocalStorage Loader Helpers ---
  const loadCompletedFiles = () => {
    const saved = localStorage.getItem('completedFiles');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  };

  const loadCompletedSections = () => {
    const saved = localStorage.getItem('completedSections');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  };

  const loadTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  // --- States ---
  const [activePath, setActivePath] = useState('');
  const [completedFiles, setCompletedFiles] = useState(loadCompletedFiles);
  const [completedSections, setCompletedSections] = useState(loadCompletedSections);
  const [theme, setTheme] = useState(loadTheme);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Modals / Tooltips
  const [zoomerImage, setZoomerImage] = useState(null); // { src, alt }
  const [tooltip, setTooltip] = useState(null); // { text, rect }

  // --- Theme Handler ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Sync Completed to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('completedFiles', JSON.stringify(Array.from(completedFiles)));
  }, [completedFiles]);

  useEffect(() => {
    localStorage.setItem('completedSections', JSON.stringify(Array.from(completedSections)));
  }, [completedSections]);

  // Get first file path recursively
  const getFirstFilePath = (nodes) => {
    if (!nodes || nodes.length === 0) return '';
    for (let node of nodes) {
      if (node.type === 'file') return node.path;
      if (node.children) {
        const path = getFirstFilePath(node.children);
        if (path) return path;
      }
    }
    return '';
  };

  // Auto expand all parent folders of the active path
  const expandParentFolders = (path) => {
    const parts = path.split('/');
    const parents = new Set(expandedNodes);
    let current = '';
    
    // Split parts and construct prefix path, e.g. "system-design", "system-design/01-Scaling"
    for (let i = 0; i < parts.length - 1; i++) {
      current = current ? `${current}/${parts[i]}` : parts[i];
      parents.add(current);
    }
    setExpandedNodes(parents);
  };

  // --- Calculate Progress ---
  const totalFilesCount = useMemo(() => {
    let count = 0;
    const countFiles = (nodes) => {
      nodes.forEach(n => {
        if (n.type === 'file') count++;
        else if (n.children) countFiles(n.children);
      });
    };
    countFiles(rawData.tree);
    return count;
  }, []);

  const progressPercentage = useMemo(() => {
    if (totalFilesCount === 0) return 0;
    return Math.round((completedFiles.size / totalFilesCount) * 100);
  }, [completedFiles, totalFilesCount]);

  // --- Search and Filter Tree ---
  const filteredTree = useMemo(() => {
    if (selectedTopic === 'glossary') {
      const termsGrouped = {};
      Object.keys(rawData.glossary || {}).forEach(term => {
        const letter = term.charAt(0).toUpperCase();
        if (!termsGrouped[letter]) {
          termsGrouped[letter] = [];
        }
        termsGrouped[letter].push(term);
      });
      
      return Object.entries(termsGrouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, terms]) => ({
          name: letter,
          path: `glossary-${letter}`,
          type: 'directory',
          children: terms.sort().map(term => ({
            name: term,
            title: term,
            path: `glossary#glossary-card-${term.replace(/\s+/g, '-')}`,
            type: 'file'
          }))
        }));
    }

    const query = searchQuery.toLowerCase().trim();
    const matches = new Set();

    // Helper to check if a file node matches the selected topic
    const matchesQueryAndTopic = (node) => {
      // 1. Topic Match
      let topicMatch = false;
      if (selectedTopic === 'all') {
        topicMatch = true;
      } else {
        const path = (node.path || '').toLowerCase();
        const name = (node.name || '').toLowerCase();
        if (selectedTopic === 'system-design') {
          topicMatch = path.startsWith('system-design');
        } else if (selectedTopic === 'aws') {
          topicMatch = path.startsWith('cloud/aws') || path.startsWith('cloud/aws/services') || name.includes('aws') || name.includes('ec2') || name.includes('s3') || name.includes('rds') || name.includes('elb') || name.includes('vpc') || name.includes('cloudfront') || name.includes('efs');
        } else if (selectedTopic === 'kubernetes') {
          topicMatch = path.includes('kubernetes') || path.includes('eks') || name.includes('kubernetes') || name.includes('eks');
        } else if (selectedTopic === 'cicd-docker') {
          topicMatch = path.startsWith('pipelines') || path.startsWith('dockerfiles') || path.includes('docker-compose') || path.includes('docker') || path.includes('jenkins');
        }
      }

      if (!topicMatch) return false;

      // 2. Search Query Match
      if (!query) return true;
      const matchName = node.name.toLowerCase().includes(query);
      const matchTitle = node.title && node.title.toLowerCase().includes(query);
      return matchName || matchTitle;
    };

    // Pass 1: Find all files/folders matching criteria, and collect their parents
    const findMatches = (node, parentPaths = []) => {
      const nodeId = node.path || node.name;
      if (node.type === 'file') {
        if (matchesQueryAndTopic(node)) {
          matches.add(nodeId);
          parentPaths.forEach(p => matches.add(p));
        }
      } else if (node.children) {
        node.children.forEach(child => {
          findMatches(child, [...parentPaths, nodeId]);
        });
      }
    };
    rawData.tree.forEach(cat => findMatches(cat));

    // Pass 2: Filter tree nodes recursively keeping only matching items
    const filterNodes = (nodes) => {
      return nodes
        .map(node => {
          const nodeId = node.path || node.name;
          if (!matches.has(nodeId)) return null;

          if (node.type === 'file') {
            return { ...node };
          }

          return {
            ...node,
            children: filterNodes(node.children)
          };
        })
        .filter(n => n !== null);
    };

    // Auto expand search results / topic filtering
    const newExpanded = new Set();
    if (query) {
      // If there is a search query, expand all matching folders
      matches.forEach(p => {
        if (p.includes('/')) {
          newExpanded.add(p);
        }
      });
      // Add all categories
      rawData.tree.forEach(cat => {
        if (matches.has(cat.name)) {
          newExpanded.add(cat.name);
        }
      });
      setExpandedNodes(newExpanded);
    } else {
      // If no search query, only expand the active path's parent folders
      // and the top-level categories that have matches, keeping nested sub-folders collapsed.
      rawData.tree.forEach(cat => {
        if (matches.has(cat.name)) {
          newExpanded.add(cat.name);
        }
      });
      if (activePath) {
        const parts = activePath.split('/');
        let current = '';
        for (let i = 0; i < parts.length - 1; i++) {
          current = current ? `${current}/${parts[i]}` : parts[i];
          newExpanded.add(current);
        }
      }
      setExpandedNodes(newExpanded);
    }

    return filterNodes(rawData.tree);
  }, [searchQuery, selectedTopic, activePath]);

  // --- Hash Routing Setup ---
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#')) {
        const decodedPath = decodeURIComponent(hash.slice(1));
        
        // Glossary route (with or without anchor)
        if (decodedPath.startsWith('glossary')) {
          setActivePath('glossary');
          setSelectedTopic('glossary');
          
          const hashIndex = decodedPath.indexOf('#');
          if (hashIndex !== -1) {
            const targetId = decodedPath.slice(hashIndex + 1);
            setTimeout(() => {
              const targetEl = document.getElementById(targetId);
              if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetEl.classList.add('highlight-flash');
                setTimeout(() => targetEl.classList.remove('highlight-flash'), 2000);
              }
            }, 100);
          }
          return;
        }

        if (rawData.docs[decodedPath]) {
          setActivePath(decodedPath);
          // Auto-expand parent folders of active path
          expandParentFolders(decodedPath);
          return;
        }
      }
      // Fallback: Default to first file in the tree
      const firstFilePath = getFirstFilePath(rawData.tree);
      if (firstFilePath) {
        window.location.hash = `#${firstFilePath}`;
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial load
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // --- Auto-switch page when topic changes ---
  useEffect(() => {
    if (selectedTopic === 'glossary') {
      setActivePath('glossary');
      window.location.hash = '#glossary';
    } else if (activePath === 'glossary') {
      const firstFile = getFirstFilePath(filteredTree);
      if (firstFile) {
        setActivePath(firstFile);
        window.location.hash = `#${firstFile}`;
      }
    }
  }, [selectedTopic, filteredTree]);

  // --- Callbacks ---
  const handleSelectFile = useCallback((path) => {
    window.location.hash = `#${path}`;
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(false);
    }
  }, []);

  const handleToggleFileComplete = useCallback((paths, isChecked) => {
    setCompletedFiles(prev => {
      const next = new Set(prev);
      paths.forEach(path => {
        if (isChecked) {
          next.add(path);
        } else {
          next.delete(path);
        }
      });
      return next;
    });

    // Automatically check/uncheck all section headers inside those files
    setCompletedSections(prev => {
      const next = new Set(prev);
      paths.forEach(path => {
        if (path === activePath) {
          const headers = document.getElementById('content-area')?.querySelectorAll('h2, h3') || [];
          headers.forEach(h => {
            const sectionId = `section-${path}-${h.id}`;
            if (isChecked) next.add(sectionId);
            else next.delete(sectionId);
          });
        }
      });
      return next;
    });
  }, [activePath]);

  const handleToggleSectionComplete = useCallback((sectionId, isChecked) => {
    setCompletedSections(prev => {
      const next = new Set(prev);
      if (isChecked) next.add(sectionId);
      else next.delete(sectionId);
      return next;
    });

    // Check if all sections in the active file are completed
    // If yes, mark file completed. If no, mark file uncompleted.
    setTimeout(() => {
      const headers = document.getElementById('content-area')?.querySelectorAll('h2, h3') || [];
      const sectionIds = Array.from(headers).map(h => `section-${activePath}-${h.id}`);
      
      setCompletedSections(currentSections => {
        const completedCount = sectionIds.filter(id => currentSections.has(id)).length;
        
        setCompletedFiles(prevFiles => {
          const nextFiles = new Set(prevFiles);
          if (sectionIds.length > 0 && completedCount === sectionIds.length) {
            nextFiles.add(activePath);
          } else {
            nextFiles.delete(activePath);
          }
          return nextFiles;
        });

        return currentSections;
      });
    }, 0);
  }, [activePath]);

  const handleToggleExpand = useCallback((nodeId) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const handleShowTooltip = useCallback((text, rect) => setTooltip({ text, rect }), []);
  const handleHideTooltip = useCallback(() => setTooltip(null), []);
  const handleImageClick = useCallback((src, alt) => setZoomerImage({ src, alt }), []);

  // Flat list of files currently visible in the sidebar to compute next/prev
  const visibleFiles = useMemo(() => {
    const files = [];
    const traverse = (nodes) => {
      nodes.forEach(node => {
        if (node.type === 'file') {
          files.push({
            path: node.path,
            title: node.title || node.name.replace(/\.md$/, '')
          });
        } else if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(filteredTree);
    return files;
  }, [filteredTree]);

  // Find index of activePath in visibleFiles
  const activeFileIndex = useMemo(() => {
    return visibleFiles.findIndex(f => f.path === activePath);
  }, [visibleFiles, activePath]);

  const prevFile = useMemo(() => {
    if (activeFileIndex > 0) {
      return visibleFiles[activeFileIndex - 1];
    }
    return null;
  }, [visibleFiles, activeFileIndex]);

  const nextFile = useMemo(() => {
    if (activeFileIndex >= 0 && activeFileIndex < visibleFiles.length - 1) {
      return visibleFiles[activeFileIndex + 1];
    }
    return null;
  }, [visibleFiles, activeFileIndex]);

  const activeDoc = rawData.docs[activePath] || null;

  return (
    <>
      {/* App Header */}
      <header className="app-header">
        <div className="header-left">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="icon-btn mobile-only"
            aria-label="Toggle Sidebar"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="logo">
            <svg viewBox="0 0 24 24" class="logo-icon" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            <span className="logo-text">DevOps & System <span className="accent-text">Explorer</span></span>
          </div>
        </div>

        <div className="header-center">
          <div className="search-box">
            <svg viewBox="0 0 24 24" className="search-icon" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu học tập..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm tài liệu"
            />
          </div>
        </div>

        <div className="header-right">
          <div className="progress-indicator">
            <span className="progress-label">Tiến trình học tập:</span>
            <span id="global-progress-text">{completedFiles.size}/{totalFilesCount} ({progressPercentage}%)</span>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="icon-btn"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="app-container">
        <Sidebar
          tree={filteredTree}
          activePath={activePath}
          onSelectFile={handleSelectFile}
          completedFiles={completedFiles}
          onToggleFileComplete={handleToggleFileComplete}
          expandedNodes={expandedNodes}
          onToggleExpand={handleToggleExpand}
          isOpen={mobileSidebarOpen}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
        />

        <ContentArea
          content={activeDoc ? activeDoc.content : ''}
          title={activeDoc ? activeDoc.title : ''}
          type={activeDoc ? activeDoc.type : 'markdown'}
          language={activeDoc ? activeDoc.language : ''}
          glossaryData={rawData.glossary}
          completedSections={completedSections}
          onToggleSection={handleToggleSectionComplete}
          onImageClick={handleImageClick}
          activePath={activePath}
          onShowTooltip={handleShowTooltip}
          onHideTooltip={handleHideTooltip}
          onSelectFile={handleSelectFile}
          availablePaths={useMemo(() => Object.keys(rawData.docs), [])}
          prevFile={prevFile}
          nextFile={nextFile}
        />

        <Outline
          content={activeDoc ? activeDoc.content : ''}
          activePath={activePath}
          completedSections={completedSections}
          onToggleSection={handleToggleSectionComplete}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="sidebar-overlay open"
          id="sidebar-overlay"
        ></div>
      )}

      {/* Glossary Tooltip Popup */}
      {tooltip && (
        <GlossaryTooltip
          text={tooltip.text}
          triggerRect={tooltip.rect}
        />
      )}

      {/* Diagram Zoomer Modal */}
      {zoomerImage && (
        <ImageZoomer
          src={zoomerImage.src}
          alt={zoomerImage.alt}
          onClose={() => setZoomerImage(null)}
        />
      )}
    </>
  );
}
