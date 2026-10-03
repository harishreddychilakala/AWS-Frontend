import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  ChevronRight,
  Database,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  ClipboardList,
  Plus,
  Sparkles,
  SearchCode,
  Calculator,
  TrendingUp,
  Settings as SettingsIcon,
  Layers,
  ChevronDown
} from 'lucide-react';

interface TopNavbarProps {
  backendOnline: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ backendOnline }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setShowToolsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowToolsDropdown(false);
  }, [location.pathname]);

  // Primary top links
  const primaryNavLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/reports', label: 'Reports', icon: ClipboardList },
    { to: '/ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'Gemini' },
    { to: '/nested-query', label: 'Query Explorer', icon: SearchCode },
  ];

  // Secondary tools in "Tools & Architecture" dropdown
  const toolsNavLinks = [
    { to: '/cost-optimizer', label: 'AI Cost Optimizer', icon: Calculator, desc: 'Cluster sizing & pricing recommendations' },
    { to: '/cost-monitoring', label: 'Cost Monitoring', icon: TrendingUp, desc: 'Live DocumentDB usage & bill forecasting' },
    { to: '/database-overview', label: 'Architecture & Engine', icon: Database, desc: 'Amazon DocumentDB & Neon setup' },
    { to: '/settings', label: 'System Settings', icon: SettingsIcon, desc: 'API keys, cluster URI, & preferences' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/reports?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    setShowProfile(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const isToolsActive = toolsNavLinks.some(link => location.pathname === link.to);

  // Format first name or truncated name
  const getUserDisplayName = () => {
    if (!currentUser?.name) return 'Inspector';
    const parts = currentUser.name.trim().split(' ');
    if (parts.length > 0 && parts[0].length <= 12) return parts[0];
    return currentUser.name.length > 12 ? `${currentUser.name.slice(0, 10)}...` : currentUser.name;
  };

  return (
    <>
      <header
        style={{
          height: 'var(--topbar-height)',
          backgroundColor: 'var(--color-topbar-bg)',
          borderBottom: '1px solid var(--color-topbar-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
          gap: '1rem'
        }}
      >
        {/* Left Section: Brand Logo & Desktop Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: 0, flexShrink: 1 }}>
          {/* Brand Logo */}
          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 14px rgba(37, 99, 235, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }} className="brand-text-container">
              <span
                style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1
                }}
              >
                Inspect<span style={{ color: '#60a5fa' }}>DB</span>
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.02em' }}>
                DocDB Platform
              </span>
            </div>
          </Link>

          {/* Desktop Top Navigation Links */}
          <nav
            className="top-desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              flexWrap: 'nowrap'
            }}
          >
            {primaryNavLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: isActive ? '#60a5fa' : '#94a3b8',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid transparent',
                    transition: 'all var(--transition-fast)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                  className="top-nav-item"
                >
                  <Icon size={15} color={isActive ? '#60a5fa' : '#94a3b8'} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: '0.62rem',
                        padding: '0.08rem 0.35rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))',
                        color: '#c084fc',
                        border: '1px solid rgba(192, 132, 252, 0.3)',
                        fontWeight: 700
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* "Tools" Dropdown for secondary management pages */}
            <div style={{ position: 'relative' }} ref={toolsDropdownRef}>
              <button
                type="button"
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: isToolsActive ? '#60a5fa' : '#94a3b8',
                  backgroundColor: isToolsActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: isToolsActive ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                className="top-nav-item"
              >
                <Layers size={15} />
                <span>Tools</span>
                <ChevronDown size={13} style={{ transform: showToolsDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>

              {showToolsDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    width: 260,
                    backgroundColor: '#111827',
                    border: '1px solid #1f2937',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.6)',
                    padding: '0.5rem',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem'
                  }}
                >
                  {toolsNavLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setShowToolsDropdown(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem',
                          padding: '0.55rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none',
                          color: isActive ? '#60a5fa' : '#e2e8f0',
                          backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent'
                        }}
                        className="dropdown-nav-item"
                      >
                        <Icon size={16} color={isActive ? '#60a5fa' : '#94a3b8'} style={{ marginTop: 2, flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.825rem', fontWeight: 600 }}>{item.label}</span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.2 }}>{item.desc}</span>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Section: Action Button, Search, Badge, Alerts & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          {/* Quick "New Report" Button */}
          <Link
            to="/create-inspection"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            className="topbar-create-btn"
          >
            <Plus size={15} />
            <span>New Report</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '170px' }} className="topbar-search">
            <Search size={13} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '1.9rem',
                paddingRight: '0.65rem',
                height: '34px',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f8fafc',
                outline: 'none'
              }}
              className="topbar-search-input"
            />
          </form>

          {/* Database & Backend Status Badge */}
          <Link
            to="/database-overview"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: backendOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${backendOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              fontSize: '0.72rem',
              fontWeight: 600,
              color: backendOnline ? '#34d399' : '#f87171',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            title="Amazon DocumentDB & Neon Auth Status"
            className="topbar-db-badge"
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: backendOnline ? '#10b981' : '#ef4444',
                boxShadow: backendOnline ? '0 0 8px #10b981' : 'none'
              }}
            />
            <span>{backendOnline ? 'DocDB + Neon' : 'Offline'}</span>
          </Link>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }} ref={notificationsRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              style={{
                position: 'relative',
                width: 34,
                height: 34,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
              aria-label="Notifications"
              className="topbar-icon-btn"
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 6,
                  height: 6,
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  boxShadow: '0 0 6px #3b82f6'
                }}
              />
            </button>

            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: 300,
                  backgroundColor: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.6)',
                  padding: '0.75rem',
                  zIndex: 100
                }}
              >
                <div
                  style={{
                    padding: '0.4rem 0.4rem 0.6rem',
                    borderBottom: '1px solid #1f2937',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc' }}>System Status</span>
                  <span style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: 600 }}>Active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem' }}>
                  <div
                    style={{
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      gap: '0.5rem'
                    }}
                  >
                    <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>Neon PostgreSQL Online</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>User account isolated securely</div>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      gap: '0.5rem'
                    }}
                  >
                    <ShieldCheck size={15} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>DocumentDB Compatibility</div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Amazon DocumentDB 5.0 validator active</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.55rem 0.25rem 0.3rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer',
                flexShrink: 0
              }}
              className="topbar-profile-btn"
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  boxShadow: '0 0 8px rgba(99, 102, 241, 0.4)',
                  flexShrink: 0
                }}
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User size={13} />}
              </div>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#f8fafc',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                className="user-name"
                title={currentUser?.name || 'Inspector'}
              >
                {getUserDisplayName()}
              </span>
              <ChevronDown size={12} color="#94a3b8" style={{ flexShrink: 0 }} />
            </button>

            {showProfile && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: 240,
                  backgroundColor: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.6)',
                  padding: '0.5rem',
                  zIndex: 100
                }}
              >
                <div
                  style={{
                    padding: '0.55rem',
                    borderBottom: '1px solid #1f2937',
                    marginBottom: '0.3rem'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser?.name || 'Inspector Account'}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#94a3b8',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {currentUser?.email || 'inspector@inspectdb.internal'}
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        color: '#a5b4fc',
                        fontWeight: 600,
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      {currentUser?.role || 'USER'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.62rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        color: '#6ee7b7',
                        fontWeight: 600,
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      Neon Auth
                    </span>
                  </div>
                </div>

                <Link
                  to="/ai-assistant"
                  onClick={() => setShowProfile(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.6rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-md)',
                    color: '#e2e8f0',
                    textDecoration: 'none'
                  }}
                  className="dropdown-nav-item"
                >
                  <Sparkles size={14} color="#60a5fa" />
                  <span>AI Query Assistant</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowProfile(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.6rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-md)',
                    color: '#e2e8f0',
                    textDecoration: 'none'
                  }}
                  className="dropdown-nav-item"
                >
                  <SettingsIcon size={14} color="#94a3b8" />
                  <span>Project Settings</span>
                </Link>

                <div style={{ borderTop: '1px solid #1f2937', marginTop: '0.3rem', paddingTop: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.6rem',
                      fontSize: '0.8rem',
                      borderRadius: 'var(--radius-md)',
                      color: '#f87171',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      textAlign: 'left'
                    }}
                    className="dropdown-logout-item"
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="mobile-menu-btn"
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            aria-label="Toggle navigation menu"
          >
            {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: 'var(--topbar-height)',
            backgroundColor: 'rgba(11, 17, 32, 0.96)',
            backdropFilter: 'blur(20px)',
            zIndex: 89,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
          className="mobile-drawer"
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search reports, inspectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '2.4rem',
                paddingRight: '1rem',
                height: '40px',
                fontSize: '0.875rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#f8fafc',
                outline: 'none'
              }}
            />
          </form>

          {/* Quick Create Link */}
          <Link
            to="/create-inspection"
            onClick={() => setShowMobileMenu(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.7rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              color: '#ffffff',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <Plus size={18} />
            <span>Create New Inspection</span>
          </Link>

          {/* Nav items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', paddingLeft: '0.5rem' }}>
              Main Navigation
            </span>
            {[...primaryNavLinks, ...toolsNavLinks].map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setShowMobileMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: isActive ? '#60a5fa' : '#e2e8f0',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid transparent'
                  }}
                >
                  <Icon size={18} color={isActive ? '#60a5fa' : '#94a3b8'} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Logout */}
          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.7rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              <span>Log Out ({currentUser?.email})</span>
            </button>
          </div>
        </div>
      )}

      {/* Responsive & Hover CSS */}
      <style>{`
        .top-nav-item:hover {
          color: #f1f5f9 !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
        .dropdown-nav-item:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
        }
        .dropdown-logout-item:hover {
          background-color: rgba(239, 68, 68, 0.15) !important;
        }
        .topbar-create-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.5) !important;
        }
        .topbar-search-input:focus {
          border-color: #3b82f6 !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .topbar-icon-btn:hover, .topbar-profile-btn:hover {
          background-color: rgba(255, 255, 255, 0.12) !important;
        }

        @media (max-width: 1250px) {
          .topbar-search {
            display: none !important;
          }
        }

        @media (max-width: 1050px) {
          .topbar-db-badge {
            display: none !important;
          }
        }

        @media (max-width: 950px) {
          .top-desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }

        @media (max-width: 600px) {
          .topbar-create-btn span {
            display: none;
          }
          .topbar-create-btn {
            padding: 0.4rem !important;
          }
          .user-name {
            display: none !important;
          }
          .brand-text-container span:last-child {
            display: none;
          }
        }
      `}</style>
    </>
  );
};
