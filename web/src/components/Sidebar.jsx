import React, { useRef, useEffect } from 'react';

// Custom checkbox component to handle indeterminate state
const TreeCheckbox = ({ checked, indeterminate, onChange, id }) => {
  const checkboxRef = useRef(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      ref={checkboxRef}
      checked={checked}
      onChange={onChange}
      className="chapter-checkbox"
      id={id}
    />
  );
};

export default function Sidebar({
  tree,
  activePath,
  onSelectFile,
  completedFiles,
  onToggleFileComplete,
  expandedNodes,
  onToggleExpand,
  isOpen
}) {

  // Helper to determine if a node is a parent directory of active file (to auto-expand it)
  // Recursively check if a directory contains all completed files
  const getDirectoryCompletionState = (node) => {
    if (node.type === 'file') {
      return completedFiles.has(node.path) ? 'checked' : 'unchecked';
    }

    if (!node.children || node.children.length === 0) {
      return 'unchecked';
    }

    let checkedCount = 0;
    let uncheckedCount = 0;
    let hasIndeterminate = false;

    node.children.forEach(child => {
      const state = getDirectoryCompletionState(child);
      if (state === 'checked') {
        checkedCount++;
      } else if (state === 'unchecked') {
        uncheckedCount++;
      } else {
        hasIndeterminate = true;
      }
    });

    if (hasIndeterminate) {
      return 'indeterminate';
    }
    if (checkedCount === node.children.length) {
      return 'checked';
    }
    if (uncheckedCount === node.children.length) {
      return 'unchecked';
    }
    return 'indeterminate';
  };

  // Recursively toggle all child files of a directory
  const toggleDirectoryComplete = (node, makeCompleted) => {
    const filesToToggle = [];
    const collectFiles = (n) => {
      if (n.type === 'file') {
        filesToToggle.push(n.path);
      } else if (n.children) {
        n.children.forEach(collectFiles);
      }
    };
    collectFiles(node);
    onToggleFileComplete(filesToToggle, makeCompleted);
  };

  // Render a single node recursively
  const renderNode = (node, depth = 0) => {
    const isDir = node.type === 'directory';
    const nodeId = node.path || node.name;
    const isExpanded = expandedNodes.has(nodeId);

    if (isDir) {
      const completionState = getDirectoryCompletionState(node);
      const isChecked = completionState === 'checked';
      const isIndeterminate = completionState === 'indeterminate';

      return (
        <li key={nodeId} className="vol-section" style={{ marginLeft: depth > 0 ? '12px' : '0' }}>
          <div className="vol-header-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="chapter-checkbox-container">
              <TreeCheckbox
                checked={isChecked}
                indeterminate={isIndeterminate}
                onChange={(e) => toggleDirectoryComplete(node, e.target.checked)}
                id={`cb-dir-${nodeId}`}
              />
            </div>
            <button
              className="vol-header"
              aria-expanded={isExpanded}
              onClick={() => onToggleExpand(nodeId)}
              style={{ flex: 1, textTransform: depth === 0 ? 'uppercase' : 'none', paddingLeft: '4px' }}
            >
              <span className="vol-title" style={{ fontSize: depth === 0 ? '12px' : '13px', fontWeight: depth === 0 ? '700' : '600' }}>
                {node.displayName || node.name}
              </span>
              <svg
                className="chevron-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s ease' }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>

          {isExpanded && node.children && (
            <ul className="chapter-list" style={{ paddingLeft: '4px', marginTop: '4px' }}>
              {node.children.map(child => renderNode(child, depth + 1))}
            </ul>
          )}
        </li>
      );
    } else {
      // File node
      const isActive = node.path === activePath;
      const isChecked = completedFiles.has(node.path);

      // Check if file is chapter in Alex Xu (starts with a number)
      // Extract number to display
      const match = node.name.match(/^(\d+)/);
      const fileNum = match ? `${match[1].padStart(2, '0')}.` : '';
      const displayTitle = node.title || node.name.replace(/\.md$/, '');

      return (
        <li key={node.path} className="chapter-item-container" style={{ marginLeft: depth > 0 ? '12px' : '0' }}>
          <div className={`chapter-item ${isActive ? 'active' : ''}`} data-index={node.path}>
            <div className="chapter-checkbox-container">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onToggleFileComplete([node.path], e.target.checked)}
                className="chapter-checkbox"
                id={`cb-file-${node.path}`}
              />
            </div>
            <div
              className="chapter-item-link"
              onClick={() => onSelectFile(node.path)}
              style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}
            >
              {fileNum && <span className="chapter-num">{fileNum}</span>}
              <span className="chapter-title-text" title={displayTitle}>
                {displayTitle}
              </span>
            </div>
          </div>
        </li>
      );
    }
  };

  return (
    <aside className={`sidebar-left ${isOpen ? 'open' : ''}`} id="sidebar-left">
      <div className="sidebar-scroll">
        <ul className="chapter-list">
          {tree && tree.map(node => renderNode(node, 0))}
        </ul>
      </div>
    </aside>
  );
}
