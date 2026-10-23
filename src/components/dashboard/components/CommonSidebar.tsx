// components/CommonSidebar.tsx
'use client';

import React from 'react';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

interface CommonSidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
  onLogout: () => void;
  onThemeToggle: () => void;
  darkMode: boolean;
  user: {
    name: string;
    email: string;
    photoUrl: string | null;
    role?: string;
  } | null;
  menuItems: MenuItem[];
  title: string;
  logoIcon: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const CommonSidebar: React.FC<CommonSidebarProps> = ({ 
  activeNav, 
  setActiveNav, 
  onLogout, 
  onThemeToggle, 
  darkMode,
  user,
  menuItems,
  title,
  logoIcon,
  isOpen,
  onClose
}) => {
  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (onClose) onClose();
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
     

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">{user?.name?.charAt(0) || 'U'}</div>
            )}
          </div>
          <div className="sidebar-user-info">
            <h4>{user?.name || 'User'}</h4>
            <p>{user?.email || 'user@company.com'}</p>
            {user?.role && <span className="user-role-badge">{user.role}</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-footer-btn logout" onClick={onLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default CommonSidebar;