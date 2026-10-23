'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// TYPES (based on BDE Director API documentation)
// ============================================

interface Client {
  id: number;
  companyName: string;
  companyMobileNumber: string;
  companyEmail: string;
  orgType: string;
  clientType: string;
  clientWebsite: string;
  isApproved: boolean;
  clientStatus: string;
  createdAt: string;
  rejectionReason?: string | null;
}

interface BDETeamMember {
  employeeId: number;
  user: {
    userId: number;
    name: string;
    email: string;
    photoUrl: string | null;
  };
  positionName: string;
  salary: number;
  skillSet: string;
  departmentRef: {
    departmentId: number;
    departmentName: string;
  };
}

interface DashboardKPIs {
  totalClients: number;
  pendingApprovals: number;
  approvedClients: number;
  rejectedClients: number;
  approvalRate: number;
  totalBDEProjects: number;
  totalBDETeam: number;
  clientTypeDistribution: Record<string, number>;
  orgTypeDistribution: Record<string, number>;
}

interface UpdateClientData {
  companyName?: string;
  companyMobileNumber?: string;
  companyEmail?: string;
  orgType?: string;
  clientType?: string;
  clientWebsite?: string;
}

interface ApproveRejectData {
  isApproved: boolean;
  rejectionReason?: string | null;
}

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiCall = async <T,>(
  method: string,
  endpoint: string,
  data?: any
): Promise<T> => {
  try {
    const config: any = {
      method,
      url: `${API_BASE}${endpoint}`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// ============================================
// API FUNCTIONS
// ============================================

const checkBDEDirectorAccess = async () => {
  return apiCall<{ success: boolean; message: string; data: boolean }>(
    'GET',
    '/api/bde-director/check'
  );
};

const getPendingClients = async () => {
  return apiCall<{ success: boolean; message: string; data: Client[] }>(
    'GET',
    '/api/bde-director/client/pending'
  );
};

const getAllClients = async () => {
  return apiCall<{ success: boolean; message: string; data: Client[] }>(
    'GET',
    '/api/bde-director/client/all'
  );
};

const getClientById = async (clientId: number) => {
  return apiCall<{ success: boolean; message: string; data: Client }>(
    'GET',
    `/api/bde-director/client/${clientId}`
  );
};

const approveClient = async (clientId: number, data: ApproveRejectData) => {
  return apiCall<{ success: boolean; message: string; data: Client }>(
    'PUT',
    `/api/bde-director/client/approve/${clientId}`,
    data
  );
};

const updateClient = async (clientId: number, data: UpdateClientData) => {
  return apiCall<{ success: boolean; message: string; data: Client }>(
    'PUT',
    `/api/bde-director/client/update/${clientId}`,
    data
  );
};

const getBDETeam = async () => {
  return apiCall<{ success: boolean; message: string; data: BDETeamMember[] }>(
    'GET',
    '/api/bde-director/bde-team'
  );
};

const getDashboardKPIs = async () => {
  return apiCall<{ success: boolean; message: string; data: DashboardKPIs }>(
    'GET',
    '/api/bde-director/dashboard/kpis'
  );
};

// ============================================
// STATUS CONFIGURATION
// ============================================

const getClientStatusBadge = (status: string, isApproved: boolean) => {
  if (status === 'PENDING') {
    return <span className="status-badge status-pending">⏳ Pending</span>;
  } else if (status === 'ACTIVE' && isApproved) {
    return <span className="status-badge status-approved">✅ Active</span>;
  } else if (status === 'REJECTED') {
    return <span className="status-badge status-rejected">❌ Rejected</span>;
  }
  return <span className="status-badge status-pending">{status}</span>;
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// ============================================
// MAIN BDE DIRECTOR COMPONENT
// ============================================

const BDEDirectorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardKPIs | null>(null);
  const [pendingClients, setPendingClients] = useState<Client[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [bdeTeam, setBdeTeam] = useState<BDETeamMember[]>([]);

  // Loading states for actions
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Selected item states
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Modal states
  const [showClientDetailModal, setShowClientDetailModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
  const [showTeamMemberModal, setShowTeamMemberModal] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<BDETeamMember | null>(null);

  // Form states
  const [editClientData, setEditClientData] = useState<UpdateClientData>({});
  const [approveRejectData, setApproveRejectData] = useState<ApproveRejectData>({
    isApproved: true,
    rejectionReason: null,
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    checkAccessAndLoadData();
  }, []);

  const checkAccessAndLoadData = async () => {
    setLoading(true);
    setLoadingMessage('Verifying access...');
    try {
      const accessRes = await checkBDEDirectorAccess();
      if (accessRes.success && accessRes.data) {
        setHasAccess(true);
        await loadAllData();
      } else {
        setHasAccess(false);
        setAccessError(accessRes.message || 'Access denied');
      }
    } catch (error: any) {
      console.error('Access check error:', error);
      setHasAccess(false);
      setAccessError(error.message || 'Failed to verify access');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const loadAllData = async () => {
    setLoadingMessage('Loading dashboard data...');
    try {
      const [kpisRes, pendingRes, allClientsRes, teamRes] = await Promise.all([
        getDashboardKPIs().catch(() => ({ data: null })),
        getPendingClients().catch(() => ({ data: [] })),
        getAllClients().catch(() => ({ data: [] })),
        getBDETeam().catch(() => ({ data: [] })),
      ]);

      setDashboardData(kpisRes.data);
      setPendingClients(pendingRes.data);
      setAllClients(allClientsRes.data);
      setBdeTeam(teamRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingMessage('');
    }
  };

  const handleViewClient = async (client: Client) => {
    setSelectedClient(client);
    setEditClientData({
      companyName: client.companyName,
      companyMobileNumber: client.companyMobileNumber,
      companyEmail: client.companyEmail,
      orgType: client.orgType,
      clientType: client.clientType,
      clientWebsite: client.clientWebsite,
    });
    setShowClientDetailModal(true);
  };

  const handleEditClient = async () => {
    if (!selectedClient) return;
    setActionLoading(true);
    setLoadingMessage('Updating client...');
    try {
      await updateClient(selectedClient.id, editClientData);
      await loadAllData();
      setShowEditClientModal(false);
      setShowClientDetailModal(false);
      showNotification('Client updated successfully', 'success');
    } catch (error: any) {
      showNotification(error.message || 'Failed to update client', 'error');
    } finally {
      setActionLoading(false);
      setLoadingMessage('');
    }
  };

  const handleApproveClient = async () => {
    if (!selectedClient) return;
    setActionLoading(true);
    setLoadingMessage(approveRejectData.isApproved ? 'Approving client...' : 'Rejecting client...');
    try {
      await approveClient(selectedClient.id, approveRejectData);
      await loadAllData();
      setShowApproveRejectModal(false);
      setShowClientDetailModal(false);
      showNotification(
        approveRejectData.isApproved ? 'Client approved successfully' : 'Client rejected successfully',
        'success'
      );
    } catch (error: any) {
      showNotification(error.message || 'Failed to process request', 'error');
    } finally {
      setActionLoading(false);
      setLoadingMessage('');
    }
  };

  const handleViewTeamMember = (member: BDETeamMember) => {
    setSelectedTeamMember(member);
    setShowTeamMemberModal(true);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    // Simple alert for now - can be replaced with toast
    alert(message);
  };

  // Filtered data
  const filteredPendingClients = pendingClients.filter(client => {
    if (searchQuery && !client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !client.companyEmail.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredAllClients = allClients.filter(client => {
    if (statusFilter !== 'all' && client.clientStatus !== statusFilter) return false;
    if (searchQuery && !client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !client.companyEmail.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Loading overlay component
  const LoadingOverlay = () => {
    if (!actionLoading && !loadingMessage) return null;
    return (
      <div className="loading-overlay">
        <div className="loader-container">
          <div className="loader-spinner"></div>
          <p>{loadingMessage || 'Processing...'}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bde-loader">
        <div className="loader-spinner"></div>
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="access-denied">
        <div className="access-denied-card">
          <span className="access-denied-icon">🔒</span>
          <h2>Access Denied</h2>
          <p>{accessError || 'You do not have permission to access this page.'}</p>
          <button className="btn-primary" onClick={() => window.location.href = '/'}>
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bde-director-container">
      <LoadingOverlay />
      
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🏢</span>
            <span className="logo-text">BDE Director</span>
          </div>
          <button className="theme-toggle-btn" onClick={() => {
            const root = document.documentElement;
            const currentTheme = root.getAttribute('data-theme');
            root.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
          }}>
            🌓
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            <div className="avatar-placeholder">
              {user?.name?.charAt(0) || 'D'}
            </div>
          </div>
          <div className="sidebar-user-info">
            <h4>{user?.name || 'BDE Director'}</h4>
            <p>{user?.email || 'director@bde.com'}</p>
          </div>
        </div>

        <div className="sidebar-nav">
          <button className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </button>
          <button className={`sidebar-nav-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => { setActiveTab('pending'); setIsMobileMenuOpen(false); }}>
            <span className="nav-icon">⏳</span>
            <span>Pending Approvals</span>
            {pendingClients.length > 0 && <span className="badge">{pendingClients.length}</span>}
          </button>
          <button className={`sidebar-nav-item ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => { setActiveTab('clients'); setIsMobileMenuOpen(false); }}>
            <span className="nav-icon">🏢</span>
            <span>All Clients</span>
          </button>
          <button className={`sidebar-nav-item ${activeTab === 'team' ? 'active' : ''}`} onClick={() => { setActiveTab('team'); setIsMobileMenuOpen(false); }}>
            <span className="nav-icon">👥</span>
            <span>BDE Team</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-footer-btn logout" onClick={logout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      {/* Main Content */}
      <div className="client-main">
        {/* Header */}
        <div className="client-header">
          <div className="header-welcome">
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'Director'}</h1>
            <p>Manage clients, approvals, and BDE team from one place</p>
          </div>
          <div className="header-stats">
            <div className="header-stat-item">
              <span className="stat-label">Total Clients</span>
              <span className="stat-value-sm">{dashboardData?.totalClients || 0}</span>
            </div>
            <div className="header-stat-item">
              <span className="stat-label">Pending</span>
              <span className="stat-value-sm">{dashboardData?.pendingApprovals || 0}</span>
            </div>
            <div className="header-stat-item">
              <span className="stat-label">Approval Rate</span>
              <span className="stat-value-sm">{dashboardData?.approvalRate || 0}%</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="dashboard-content">
            {/* KPI Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">🏢</div>
                <div className="stat-info">
                  <span className="stat-value">{dashboardData.totalClients}</span>
                  <span className="stat-label">Total Clients</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">⏳</div>
                <div className="stat-info">
                  <span className="stat-value">{dashboardData.pendingApprovals}</span>
                  <span className="stat-label">Pending Approvals</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">✅</div>
                <div className="stat-info">
                  <span className="stat-value">{dashboardData.approvedClients}</span>
                  <span className="stat-label">Approved Clients</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">📈</div>
                <div className="stat-info">
                  <span className="stat-value">{dashboardData.approvalRate}%</span>
                  <span className="stat-label">Approval Rate</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="dashboard-card full-width">
              <div className="card-header">
                <h2>Distribution Analytics</h2>
              </div>
              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Client Type Distribution</h3>
                  <div className="distribution-list">
                    {Object.entries(dashboardData.clientTypeDistribution).map(([type, count]) => (
                      <div key={type} className="dist-item">
                        <span className="dist-name">{type}</span>
                        <div className="dist-bar-container">
                          <div className="dist-bar" style={{ width: `${(count / dashboardData.totalClients) * 100}%`, backgroundColor: '#2ca6a4' }}></div>
                          <span className="dist-count">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="chart-card">
                  <h3>Organization Type Distribution</h3>
                  <div className="distribution-list">
                    {Object.entries(dashboardData.orgTypeDistribution).map(([type, count]) => (
                      <div key={type} className="dist-item">
                        <span className="dist-name">{type}</span>
                        <div className="dist-bar-container">
                          <div className="dist-bar" style={{ width: `${(count / dashboardData.totalClients) * 100}%`, backgroundColor: '#34a853' }}></div>
                          <span className="dist-count">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Approvals Tab */}
        {activeTab === 'pending' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>Pending Client Approvals</h2>
              <input
                type="text"
                placeholder="Search by company name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="clients-grid">
              {filteredPendingClients.map((client) => (
                <div key={client.id} className="client-card pending-card">
                  <div className="client-header">
                    <h3>{client.companyName}</h3>
                    {getClientStatusBadge(client.clientStatus, client.isApproved)}
                  </div>
                  <div className="client-details">
                    <p><span className="detail-label">📧 Email:</span> {client.companyEmail}</p>
                    <p><span className="detail-label">📞 Phone:</span> {client.companyMobileNumber}</p>
                    <p><span className="detail-label">🏷️ Type:</span> {client.clientType}</p>
                    <p><span className="detail-label">🏢 Org:</span> {client.orgType}</p>
                    <p><span className="detail-label">📅 Created:</span> {formatDate(client.createdAt)}</p>
                  </div>
                  <div className="client-actions">
                    <button className="btn-sm btn-outline" onClick={() => handleViewClient(client)}>
                      View Details
                    </button>
                    <button className="btn-sm btn-success" onClick={() => {
                      setSelectedClient(client);
                      setApproveRejectData({ isApproved: true, rejectionReason: null });
                      setShowApproveRejectModal(true);
                    }}>
                      Approve
                    </button>
                    <button className="btn-sm btn-danger" onClick={() => {
                      setSelectedClient(client);
                      setApproveRejectData({ isApproved: false, rejectionReason: '' });
                      setShowApproveRejectModal(true);
                    }}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPendingClients.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">✅</span>
                <p>No pending approvals</p>
              </div>
            )}
          </div>
        )}

        {/* All Clients Tab */}
        {activeTab === 'clients' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>All Clients</h2>
              <div className="filters">
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div className="clients-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAllClients.map((client) => (
                    <tr key={client.id}>
                      <td className="company-cell">
                        <strong>{client.companyName}</strong>
                      </td>
                      <td>{client.companyEmail}</td>
                      <td>{client.companyMobileNumber}</td>
                      <td>{client.clientType}</td>
                      <td>{getClientStatusBadge(client.clientStatus, client.isApproved)}</td>
                      <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn-sm btn-outline" onClick={() => handleViewClient(client)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAllClients.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">🏢</span>
                <p>No clients found</p>
              </div>
            )}
          </div>
        )}

        {/* BDE Team Tab */}
        {activeTab === 'team' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>BDE Team Members</h2>
              <p className="team-stats">Total {bdeTeam.length} members</p>
            </div>

            <div className="emp-grid">
              {bdeTeam.map((member) => (
                <div key={member.employeeId} className="card">
                  <div className="emp-header">
                    <div className="emp-avatar verified">
                      {member.user.photoUrl ? (
                        <img src={member.user.photoUrl} alt={member.user.name} className="avatar-img" />
                      ) : (
                        member.user.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3>{member.user.name}</h3>
                      <span className="dept-badge">{member.positionName}</span>
                    </div>
                  </div>
                  <div className="emp-body">
                    <div className="emp-row">
                      <span>📧 Email</span>
                      <span>{member.user.email}</span>
                    </div>
                    <div className="emp-row">
                      <span>💰 Salary</span>
                      <span className="salary">{formatCurrency(member.salary)}</span>
                    </div>
                    <div className="emp-row">
                      <span>🔧 Skills</span>
                      <div className="skills">
                        {member.skillSet?.split(',').slice(0, 2).map((skill, idx) => (
                          <span key={idx} className="skill">{skill.trim()}</span>
                        ))}
                        {member.skillSet?.split(',').length > 2 && (
                          <span className="skill more">+{member.skillSet.split(',').length - 2}</span>
                        )}
                      </div>
                    </div>
                    <div className="emp-row">
                      <span>🏢 Department</span>
                      <span>{member.departmentRef.departmentName}</span>
                    </div>
                  </div>
                  <div className="emp-footer">
                    <span>✅ Active</span>
                    <button onClick={() => handleViewTeamMember(member)}>View Details →</button>
                  </div>
                </div>
              ))}
            </div>

            {bdeTeam.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">👥</span>
                <p>No BDE team members found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Client Detail Modal */}
      {showClientDetailModal && selectedClient && (
        <div className="modal-mask open" onClick={() => setShowClientDetailModal(false)}>
          <div className="modal-box large" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowClientDetailModal(false)}>✕</button>
            <div className="modal-header">
              <h2>{selectedClient.companyName}</h2>
              {getClientStatusBadge(selectedClient.clientStatus, selectedClient.isApproved)}
            </div>
            <div className="modal-body">
              <div className="details-section">
                <h3>Company Information</h3>
                <div className="details-grid">
                  <div className="detail-item"><label>Company Name:</label><span>{selectedClient.companyName}</span></div>
                  <div className="detail-item"><label>Email:</label><span>{selectedClient.companyEmail}</span></div>
                  <div className="detail-item"><label>Phone:</label><span>{selectedClient.companyMobileNumber}</span></div>
                  <div className="detail-item"><label>Website:</label><span>{selectedClient.clientWebsite || 'N/A'}</span></div>
                  <div className="detail-item"><label>Organization Type:</label><span>{selectedClient.orgType}</span></div>
                  <div className="detail-item"><label>Client Type:</label><span>{selectedClient.clientType}</span></div>
                  <div className="detail-item"><label>Created At:</label><span>{formatDate(selectedClient.createdAt)}</span></div>
                  {selectedClient.rejectionReason && (
                    <div className="detail-item full-width"><label>Rejection Reason:</label><span className="text-danger">{selectedClient.rejectionReason}</span></div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedClient.clientStatus === 'PENDING' && (
                <button className="btn-primary" onClick={() => {
                  setShowClientDetailModal(false);
                  setShowApproveRejectModal(true);
                }}>
                  Approve / Reject
                </button>
              )}
              <button className="btn-outline" onClick={() => setShowEditClientModal(true)}>
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditClientModal && selectedClient && (
        <div className="modal-mask open" onClick={() => setShowEditClientModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowEditClientModal(false)}>✕</button>
            <h2>Edit Client Details</h2>
            <p className="modal-subtitle">{selectedClient.companyName}</p>
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" value={editClientData.companyName || ''} onChange={(e) => setEditClientData({ ...editClientData, companyName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={editClientData.companyEmail || ''} onChange={(e) => setEditClientData({ ...editClientData, companyEmail: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={editClientData.companyMobileNumber || ''} onChange={(e) => setEditClientData({ ...editClientData, companyMobileNumber: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input type="text" value={editClientData.clientWebsite || ''} onChange={(e) => setEditClientData({ ...editClientData, clientWebsite: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Organization Type</label>
              <select value={editClientData.orgType || ''} onChange={(e) => setEditClientData({ ...editClientData, orgType: e.target.value })}>
                <option value="">Select Type</option>
                <option value="Private Limited">Private Limited</option>
                <option value="Public Limited">Public Limited</option>
                <option value="Startup">Startup</option>
                <option value="LLP">LLP</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
              </select>
            </div>
            <div className="form-group">
              <label>Client Type</label>
              <select value={editClientData.clientType || ''} onChange={(e) => setEditClientData({ ...editClientData, clientType: e.target.value })}>
                <option value="">Select Type</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Small Business">Small Business</option>
                <option value="Startup">Startup</option>
              </select>
            </div>
            <button className="btn-primary" onClick={handleEditClient} disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Approve/Reject Modal */}
      {showApproveRejectModal && selectedClient && (
        <div className="modal-mask open" onClick={() => setShowApproveRejectModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowApproveRejectModal(false)}>✕</button>
            <h2>{approveRejectData.isApproved ? 'Approve Client' : 'Reject Client'}</h2>
            <p className="modal-subtitle">{selectedClient.companyName}</p>
            {!approveRejectData.isApproved && (
              <div className="form-group">
                <label>Rejection Reason *</label>
                <textarea
                  rows={3}
                  value={approveRejectData.rejectionReason || ''}
                  onChange={(e) => setApproveRejectData({ ...approveRejectData, rejectionReason: e.target.value })}
                  placeholder="Please provide reason for rejection..."
                />
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowApproveRejectModal(false)}>Cancel</button>
              <button className={approveRejectData.isApproved ? 'btn-success' : 'btn-danger'} onClick={handleApproveClient} disabled={actionLoading}>
                {actionLoading ? 'Processing...' : (approveRejectData.isApproved ? 'Approve Client' : 'Reject Client')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Member Detail Modal */}
      {showTeamMemberModal && selectedTeamMember && (
        <div className="modal-mask open" onClick={() => setShowTeamMemberModal(false)}>
          <div className="modal-box large" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowTeamMemberModal(false)}>✕</button>
            <div className="team-profile-header">
              <div className="profile-avatar large">
                {selectedTeamMember.user.photoUrl ? (
                  <img src={selectedTeamMember.user.photoUrl} alt={selectedTeamMember.user.name} />
                ) : (
                  <div className="avatar-placeholder">{selectedTeamMember.user.name.charAt(0)}</div>
                )}
              </div>
              <div className="profile-info">
                <h2>{selectedTeamMember.user.name}</h2>
                <p>{selectedTeamMember.user.email}</p>
                <p className="position-badge">{selectedTeamMember.positionName}</p>
              </div>
            </div>
            <div className="details-grid">
              <div className="detail-item"><label>Department:</label><span>{selectedTeamMember.departmentRef.departmentName}</span></div>
              <div className="detail-item"><label>Salary:</label><span>{formatCurrency(selectedTeamMember.salary)}</span></div>
              <div className="detail-item"><label>Skills:</label><span>{selectedTeamMember.skillSet}</span></div>
              <div className="detail-item full-width"><label>Employee ID:</label><span>{selectedTeamMember.employeeId}</span></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Fraunces:wght@400;500;600;700;800;900&display=swap');

        :root {
          --bg: #f5f7fc;
          --bg2: #ffffff;
          --surface: rgba(0, 0, 0, .035);
          --border: #e0e6f0;
          --text: #0c1018;
          --text2: #1e2535;
          --muted: #5e6f8a;
          --shadow: 0 2px 16px rgba(0, 0, 0, .07);
          --shadow-lg: 0 8px 40px rgba(0, 0, 0, .11);
          --card-bg: #ffffff;
          --teal: #2ca6a4;
          --blue: #1f6da8;
          --green: #34a853;
          --orange: #f36c3d;
          --red: #e74c3c;
          --purple-l: #6a5acd;
          --g-main: linear-gradient(135deg, #34a853, #2ca6a4, #1f6da8);
          --font-h: 'Fraunces', Georgia, serif;
          --font-b: 'DM Sans', system-ui, sans-serif;
          --nav-h: 66px;
          --radius: 16px;
          --ease: cubic-bezier(.25, .46, .45, .94);
        }

        [data-theme="dark"] {
          --bg: #07090f;
          --bg2: #0d1118;
          --surface: rgba(255, 255, 255, .045);
          --border: rgba(255, 255, 255, .09);
          --text: #eef2ff;
          --text2: #c7d0e8;
          --muted: #8895b3;
          --shadow: 0 2px 16px rgba(0, 0, 0, .4);
          --shadow-lg: 0 8px 40px rgba(0, 0, 0, .5);
          --card-bg: #111820;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .bde-director-container {
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--font-b);
        }

        /* Loading Overlay */
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loader-container {
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 24px;
          text-align: center;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
        }

        .loader-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid var(--border);
          border-top-color: var(--teal);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          background: var(--bg2);
          border-right: 1px solid var(--border);
          z-index: 200;
          display: flex;
          flex-direction: column;
          transform: translateX(0);
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .logo-text {
          font-family: var(--font-h);
          font-size: 1.1rem;
          font-weight: 800;
          background: var(--g-main);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .theme-toggle-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--surface);
          border: 1px solid var(--border);
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-user {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sidebar-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--g-main);
          flex-shrink: 0;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .sidebar-user-info h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text2);
          margin-bottom: 0.2rem;
        }

        .sidebar-user-info p {
          font-size: 0.7rem;
          color: var(--muted);
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          overflow-y: auto;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          background: transparent;
          color: var(--text2);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
          width: 100%;
          text-align: left;
          position: relative;
        }

        .sidebar-nav-item:hover {
          background: var(--surface);
          color: var(--teal);
        }

        .sidebar-nav-item.active {
          background: var(--g-main);
          color: white;
        }

        .sidebar-nav-item .badge {
          position: absolute;
          right: 1rem;
          background: var(--orange);
          color: white;
          font-size: 0.7rem;
          padding: 0.15rem 0.5rem;
          border-radius: 20px;
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--border);
        }

        .sidebar-footer-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          background: transparent;
          color: var(--text2);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
          width: 100%;
          text-align: left;
        }

        .sidebar-footer-btn:hover {
          background: var(--surface);
          color: var(--teal);
        }

        .sidebar-footer-btn.logout {
          color: var(--red);
        }

        .sidebar-footer-btn.logout:hover {
          background: rgba(231, 76, 60, 0.1);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          display: none;
        }

        .mobile-menu-btn {
          display: none;
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--g-main);
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 1001;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          align-items: center;
          justify-content: center;
        }

        /* Main Content */
        .client-main {
          flex: 1;
          margin-left: 280px;
          padding: 1.5rem;
          min-height: 100vh;
        }

        .client-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-welcome h1 {
          font-family: var(--font-h);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text2);
          margin-bottom: 0.2rem;
        }

        .header-welcome p {
          color: var(--muted);
          font-size: 0.85rem;
        }

        .header-stats {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .header-stat-item {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.2rem;
        }

        .header-stat-item .stat-label {
          font-size: 0.7rem;
          color: var(--muted);
          text-transform: uppercase;
        }

        .stat-value-sm {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text2);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: var(--bg2);
          color: var(--text2);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }

        .stat-icon.blue { background: rgba(31, 109, 168, 0.1); }
        .stat-icon.green { background: rgba(52, 168, 83, 0.1); }
        .stat-icon.orange { background: rgba(245, 124, 0, 0.1); }
        .stat-icon.purple { background: rgba(106, 90, 205, 0.1); }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-family: var(--font-h);
          font-size: 2rem;
          font-weight: 900;
          color: var(--text2);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--muted);
        }

        /* Dashboard Card */
        .dashboard-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .dashboard-card.full-width {
          width: 100%;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .card-header h2 {
          font-family: var(--font-h);
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text2);
          margin: 0;
        }

        /* Charts */
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .chart-card {
          background: var(--surface);
          border-radius: 16px;
          padding: 1.2rem;
        }

        .chart-card h3 {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: var(--text2);
        }

        .distribution-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .dist-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .dist-name {
          width: 120px;
          font-size: 0.85rem;
          color: var(--text2);
        }

        .dist-bar-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dist-bar {
          height: 8px;
          border-radius: 4px;
          transition: width 0.3s;
        }

        .dist-count {
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 30px;
          color: var(--text2);
        }

        /* Clients Grid */
        .clients-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1rem;
        }

        .client-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.2rem;
          transition: all 0.2s;
        }

        .client-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow);
        }

        .client-card.pending-card {
          border-left: 4px solid var(--orange);
        }

        .client-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .client-header h3 {
          margin: 0;
          font-size: 1rem;
          color: var(--text2);
        }

        .client-details p {
          font-size: 0.8rem;
          margin: 0.3rem 0;
          color: var(--muted);
        }

        .detail-label {
          font-weight: 600;
          color: var(--text2);
        }

        .client-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        /* Table */
        .clients-table-container {
          overflow-x: auto;
          border-radius: 16px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }

        .data-table th {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--muted);
        }

        .company-cell strong {
          font-weight: 600;
          color: var(--text2);
        }

        /* Employee Grid */
        .emp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 1.3rem;
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow);
          border-color: rgba(44, 166, 164, 0.3);
        }

        .emp-header {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
        }

        .emp-avatar {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          background: var(--g-main);
          color: white;
        }

        .emp-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 14px;
          object-fit: cover;
        }

        .emp-header h3 {
          margin: 0;
          font-size: 1rem;
          color: var(--text2);
        }

        .dept-badge {
          display: inline-block;
          margin-top: 4px;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 600;
          background: rgba(44, 166, 164, 0.12);
          color: var(--teal);
        }

        .emp-body {
          margin-top: 1rem;
        }

        .emp-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
          font-size: 0.85rem;
          color: var(--text2);
        }

        .salary {
          font-weight: 700;
          background: linear-gradient(135deg, var(--green), var(--teal));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .skills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .skill {
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 0.7rem;
          background: rgba(31, 109, 168, 0.1);
          border: 1px solid rgba(31, 109, 168, 0.2);
          color: var(--blue);
        }

        .skill.more {
          background: rgba(243, 108, 61, 0.1);
          border-color: rgba(243, 108, 61, 0.2);
          color: var(--orange);
        }

        .emp-footer {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: var(--muted);
        }

        .emp-footer button {
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid var(--teal);
          background: transparent;
          color: var(--teal);
          cursor: pointer;
          transition: 0.2s;
        }

        .emp-footer button:hover {
          background: var(--teal);
          color: white;
        }

        /* Buttons */
        .btn-primary {
          background: var(--g-main);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(44, 166, 164, 0.4);
        }

        .btn-outline {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text2);
          padding: 0.5rem 1rem;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          border-color: var(--teal);
          color: var(--teal);
        }

        .btn-success {
          background: linear-gradient(135deg, #27ae60, #229954);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-danger {
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-sm {
          padding: 0.3rem 0.8rem;
          font-size: 0.7rem;
        }

        .btn-primary:disabled, .btn-success:disabled, .btn-danger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Status Badges */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .status-pending { background: rgba(245, 124, 0, 0.1); color: #f59e0b; }
        .status-approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-rejected { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        /* Search & Filters */
        .search-input, .filter-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--surface);
          font-size: 0.85rem;
          min-width: 200px;
          color: var(--text2);
        }

        .filters {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .team-stats {
          font-size: 0.85rem;
          color: var(--muted);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--muted);
        }

        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        /* Modals */
        .modal-mask {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.48);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-box {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 2rem;
          width: 100%;
          max-width: 500px;
          position: relative;
          box-shadow: var(--shadow-lg);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-box.large {
          max-width: 700px;
        }

        .m-close {
          position: absolute;
          top: 0.95rem;
          right: 0.95rem;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .m-close:hover {
          background: var(--red);
          border-color: var(--red);
          color: white;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .modal-header h2 {
          font-family: var(--font-h);
          font-size: 1.3rem;
          margin: 0;
          color: var(--text2);
        }

        .modal-body {
          margin-bottom: 1.5rem;
        }

        .modal-footer {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .modal-subtitle {
          color: var(--muted);
          margin-bottom: 1rem;
        }

        /* Form */
        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--muted);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.6rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--surface);
          font-size: 0.85rem;
          color: var(--text2);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--teal);
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-item label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--muted);
        }

        .detail-item span {
          font-size: 0.85rem;
          color: var(--text2);
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .text-danger {
          color: var(--red);
        }

        .details-section h3 {
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          color: var(--teal);
        }

        .team-profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .profile-avatar.large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--g-main);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-avatar.large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info h2 {
          font-size: 1.2rem;
          margin-bottom: 0.2rem;
          color: var(--text2);
        }

        .profile-info p {
          font-size: 0.8rem;
          color: var(--muted);
        }

        .position-badge {
          display: inline-block;
          padding: 0.2rem 0.8rem;
          background: rgba(44, 166, 164, 0.1);
          border-radius: 20px;
          font-size: 0.75rem;
          color: var(--teal);
          margin-top: 0.25rem;
        }

        /* Loader */
        .bde-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 1rem;
          background: var(--bg);
        }

        .access-denied {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: var(--bg);
        }

        .access-denied-card {
          text-align: center;
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 24px;
          max-width: 400px;
          border: 1px solid var(--border);
        }

        .access-denied-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .sidebar-overlay.open {
            display: block;
          }
          .client-main {
            margin-left: 0;
            padding: 1rem;
            padding-bottom: 80px;
          }
          .mobile-menu-btn {
            display: flex;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .charts-grid {
            grid-template-columns: 1fr;
          }
          .details-grid {
            grid-template-columns: 1fr;
          }
          .clients-grid,
          .emp-grid {
            grid-template-columns: 1fr;
          }
          .data-table {
            display: block;
            overflow-x: auto;
          }
          .client-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .header-stats {
            width: 100%;
            justify-content: space-between;
          }
          .modal-box {
            max-width: 95%;
            padding: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .filters {
            width: 100%;
          }
          .search-input, .filter-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BDEDirectorDashboard;













// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '@/contexts/AuthContext';

// // ============================================
// // TYPES (based on BDE Director API documentation)
// // ============================================

// interface Client {
//   id: number;
//   companyName: string;
//   companyMobileNumber: string;
//   companyEmail: string;
//   orgType: string;
//   clientType: string;
//   clientWebsite: string;
//   isApproved: boolean;
//   clientStatus: string;
//   createdAt: string;
//   rejectionReason?: string | null;
// }

// interface BDETeamMember {
//   employeeId: number;
//   user: {
//     userId: number;
//     name: string;
//     email: string;
//     photoUrl: string | null;
//   };
//   positionName: string;
//   salary: number;
//   skillSet: string;
//   departmentRef: {
//     departmentId: number;
//     departmentName: string;
//   };
// }

// interface DashboardKPIs {
//   totalClients: number;
//   pendingApprovals: number;
//   approvedClients: number;
//   rejectedClients: number;
//   approvalRate: number;
//   totalBDEProjects: number;
//   totalBDETeam: number;
//   clientTypeDistribution: Record<string, number>;
//   orgTypeDistribution: Record<string, number>;
// }

// interface UpdateClientData {
//   companyName?: string;
//   companyMobileNumber?: string;
//   companyEmail?: string;
//   orgType?: string;
//   clientType?: string;
//   clientWebsite?: string;
// }

// interface ApproveRejectData {
//   isApproved: boolean;
//   rejectionReason?: string | null;
// }

// // ============================================
// // API CONFIGURATION
// // ============================================

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// const apiCall = async <T,>(
//   method: string,
//   endpoint: string,
//   data?: any
// ): Promise<T> => {
//   try {
//     const config: any = {
//       method,
//       url: `${API_BASE}${endpoint}`,
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     };

//     if (data) {
//       config.data = data;
//     }

//     const response = await axios(config);
//     return response.data;
//   } catch (error: any) {
//     throw error.response?.data || error;
//   }
// };

// // ============================================
// // API FUNCTIONS
// // ============================================

// // Auth
// const checkBDEDirectorAccess = async () => {
//   return apiCall<{ success: boolean; message: string; data: boolean }>(
//     'GET',
//     '/api/bde-director/check'
//   );
// };

// // Client Management
// const getPendingClients = async () => {
//   return apiCall<{ success: boolean; message: string; data: Client[] }>(
//     'GET',
//     '/api/bde-director/client/pending'
//   );
// };

// const getAllClients = async () => {
//   return apiCall<{ success: boolean; message: string; data: Client[] }>(
//     'GET',
//     '/api/bde-director/client/all'
//   );
// };

// const getClientById = async (clientId: number) => {
//   return apiCall<{ success: boolean; message: string; data: Client }>(
//     'GET',
//     `/api/bde-director/client/${clientId}`
//   );
// };

// const approveClient = async (clientId: number, data: ApproveRejectData) => {
//   return apiCall<{ success: boolean; message: string; data: Client }>(
//     'PUT',
//     `/api/bde-director/client/approve/${clientId}`,
//     data
//   );
// };

// const updateClient = async (clientId: number, data: UpdateClientData) => {
//   return apiCall<{ success: boolean; message: string; data: Client }>(
//     'PUT',
//     `/api/bde-director/client/update/${clientId}`,
//     data
//   );
// };

// // BDE Team
// const getBDETeam = async () => {
//   return apiCall<{ success: boolean; message: string; data: BDETeamMember[] }>(
//     'GET',
//     '/api/bde-director/bde-team'
//   );
// };

// // Dashboard
// const getDashboardKPIs = async () => {
//   return apiCall<{ success: boolean; message: string; data: DashboardKPIs }>(
//     'GET',
//     '/api/bde-director/dashboard/kpis'
//   );
// };

// // ============================================
// // STATUS CONFIGURATION
// // ============================================

// const getClientStatusBadge = (status: string, isApproved: boolean) => {
//   if (status === 'PENDING') {
//     return <span className="status-badge status-pending">⏳ Pending</span>;
//   } else if (status === 'ACTIVE' && isApproved) {
//     return <span className="status-badge status-approved">✅ Active</span>;
//   } else if (status === 'REJECTED') {
//     return <span className="status-badge status-rejected">❌ Rejected</span>;
//   }
//   return <span className="status-badge status-pending">{status}</span>;
// };

// const formatDate = (dateString: string) => {
//   try {
//     return new Date(dateString).toLocaleString();
//   } catch {
//     return dateString;
//   }
// };

// const formatCurrency = (amount: number) => {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0,
//   }).format(amount);
// };

// // ============================================
// // MAIN BDE DIRECTOR COMPONENT
// // ============================================

// const BDEDirectorDashboard: React.FC = () => {
//   const { user, logout } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [hasAccess, setHasAccess] = useState(false);
//   const [accessError, setAccessError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState('dashboard');

//   // Data states
//   const [dashboardData, setDashboardData] = useState<DashboardKPIs | null>(null);
//   const [pendingClients, setPendingClients] = useState<Client[]>([]);
//   const [allClients, setAllClients] = useState<Client[]>([]);
//   const [bdeTeam, setBdeTeam] = useState<BDETeamMember[]>([]);

//   // Selected item states
//   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
//   // Modal states
//   const [showClientDetailModal, setShowClientDetailModal] = useState(false);
//   const [showEditClientModal, setShowEditClientModal] = useState(false);
//   const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
//   const [showTeamMemberModal, setShowTeamMemberModal] = useState(false);
//   const [selectedTeamMember, setSelectedTeamMember] = useState<BDETeamMember | null>(null);

//   // Form states
//   const [editClientData, setEditClientData] = useState<UpdateClientData>({});
//   const [approveRejectData, setApproveRejectData] = useState<ApproveRejectData>({
//     isApproved: true,
//     rejectionReason: null,
//   });

//   // Filter states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     checkAccessAndLoadData();
//   }, []);

//   const checkAccessAndLoadData = async () => {
//     setLoading(true);
//     try {
//       const accessRes = await checkBDEDirectorAccess();
//       if (accessRes.success && accessRes.data) {
//         setHasAccess(true);
//         await loadAllData();
//       } else {
//         setHasAccess(false);
//         setAccessError(accessRes.message || 'Access denied');
//       }
//     } catch (error: any) {
//       console.error('Access check error:', error);
//       setHasAccess(false);
//       setAccessError(error.message || 'Failed to verify access');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAllData = async () => {
//     try {
//       const [kpisRes, pendingRes, allClientsRes, teamRes] = await Promise.all([
//         getDashboardKPIs().catch(() => ({ data: null })),
//         getPendingClients().catch(() => ({ data: [] })),
//         getAllClients().catch(() => ({ data: [] })),
//         getBDETeam().catch(() => ({ data: [] })),
//       ]);

//       setDashboardData(kpisRes.data);
//       setPendingClients(pendingRes.data);
//       setAllClients(allClientsRes.data);
//       setBdeTeam(teamRes.data);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     }
//   };

//   const handleViewClient = async (client: Client) => {
//     setSelectedClient(client);
//     setEditClientData({
//       companyName: client.companyName,
//       companyMobileNumber: client.companyMobileNumber,
//       companyEmail: client.companyEmail,
//       orgType: client.orgType,
//       clientType: client.clientType,
//       clientWebsite: client.clientWebsite,
//     });
//     setShowClientDetailModal(true);
//   };

//   const handleEditClient = async () => {
//     if (!selectedClient) return;
//     try {
//       await updateClient(selectedClient.id, editClientData);
//       await loadAllData();
//       setShowEditClientModal(false);
//       setShowClientDetailModal(false);
//       alert('Client updated successfully');
//     } catch (error: any) {
//       alert(error.message || 'Failed to update client');
//     }
//   };

//   const handleApproveClient = async () => {
//     if (!selectedClient) return;
//     try {
//       await approveClient(selectedClient.id, approveRejectData);
//       await loadAllData();
//       setShowApproveRejectModal(false);
//       setShowClientDetailModal(false);
//       alert(approveRejectData.isApproved ? 'Client approved successfully' : 'Client rejected successfully');
//     } catch (error: any) {
//       alert(error.message || 'Failed to process request');
//     }
//   };

//   const handleViewTeamMember = (member: BDETeamMember) => {
//     setSelectedTeamMember(member);
//     setShowTeamMemberModal(true);
//   };

//   // Filtered data
//   const filteredPendingClients = pendingClients.filter(client => {
//     if (searchQuery && !client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         !client.companyEmail.toLowerCase().includes(searchQuery.toLowerCase())) return false;
//     return true;
//   });

//   const filteredAllClients = allClients.filter(client => {
//     if (statusFilter !== 'all' && client.clientStatus !== statusFilter) return false;
//     if (searchQuery && !client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         !client.companyEmail.toLowerCase().includes(searchQuery.toLowerCase())) return false;
//     return true;
//   });

//   if (loading) {
//     return (
//       <div className="bde-loader">
//         <div className="loader-spinner"></div>
//         <p>Verifying access...</p>
//       </div>
//     );
//   }

//   if (!hasAccess) {
//     return (
//       <div className="access-denied">
//         <div className="access-denied-card">
//           <span className="access-denied-icon">🔒</span>
//           <h2>Access Denied</h2>
//           <p>{accessError || 'You do not have permission to access this page.'}</p>
//           <button className="btn-primary" onClick={() => window.location.href = '/'}>
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bde-director-container">
//       {/* Header */}
//       <header className="bde-header">
//         <div className="header-left">
//           <h1>BDE Director Dashboard</h1>
//           <p>Manage clients, approvals, and BDE team</p>
//         </div>
//         <div className="header-right">
//           <span className="user-badge">
//             <span className="user-icon">👤</span>
//             {user?.name || 'BDE Director'}
//           </span>
//           <button className="logout-btn" onClick={logout}>Logout</button>
//         </div>
//       </header>

//       {/* Tabs */}
//       <div className="bde-tabs">
//         <button className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
//           📊 Dashboard
//         </button>
//         <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
//           ⏳ Pending Approvals ({pendingClients.length})
//         </button>
//         <button className={`tab ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>
//           🏢 All Clients
//         </button>
//         <button className={`tab ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
//           👥 BDE Team
//         </button>
//       </div>

//       {/* Dashboard Tab */}
//       {activeTab === 'dashboard' && dashboardData && (
//         <div className="dashboard-content">
//           {/* KPI Cards */}
//           <div className="kpi-grid">
//             <div className="kpi-card">
//               <div className="kpi-icon blue">🏢</div>
//               <div className="kpi-info">
//                 <span className="kpi-value">{dashboardData.totalClients}</span>
//                 <span className="kpi-label">Total Clients</span>
//               </div>
//             </div>
//             <div className="kpi-card">
//               <div className="kpi-icon orange">⏳</div>
//               <div className="kpi-info">
//                 <span className="kpi-value">{dashboardData.pendingApprovals}</span>
//                 <span className="kpi-label">Pending Approvals</span>
//               </div>
//             </div>
//             <div className="kpi-card">
//               <div className="kpi-icon green">✅</div>
//               <div className="kpi-info">
//                 <span className="kpi-value">{dashboardData.approvedClients}</span>
//                 <span className="kpi-label">Approved Clients</span>
//               </div>
//             </div>
//             <div className="kpi-card">
//               <div className="kpi-icon red">❌</div>
//               <div className="kpi-info">
//                 <span className="kpi-value">{dashboardData.rejectedClients}</span>
//                 <span className="kpi-label">Rejected Clients</span>
//               </div>
//             </div>
//             <div className="kpi-card">
//               <div className="kpi-icon purple">📈</div>
//               <div className="kpi-info">
//                 <span className="kpi-value">{dashboardData.approvalRate}%</span>
//                 <span className="kpi-label">Approval Rate</span>
//               </div>
//             </div>
//             <div className="kpi-card">
//               <div className="kpi-icon teal">👥</div>
//               <div className="kpi-info">
//                 <span className="kpi-value">{dashboardData.totalBDETeam}</span>
//                 <span className="kpi-label">BDE Team Members</span>
//               </div>
//             </div>
//           </div>

//           {/* Charts Section */}
//           <div className="charts-grid">
//             <div className="chart-card">
//               <h3>Client Type Distribution</h3>
//               <div className="distribution-list">
//                 {Object.entries(dashboardData.clientTypeDistribution).map(([type, count]) => (
//                   <div key={type} className="dist-item">
//                     <span className="dist-name">{type}</span>
//                     <div className="dist-bar-container">
//                       <div className="dist-bar" style={{ width: `${(count / dashboardData.totalClients) * 100}%`, backgroundColor: '#2ca6a4' }}></div>
//                       <span className="dist-count">{count}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="chart-card">
//               <h3>Organization Type Distribution</h3>
//               <div className="distribution-list">
//                 {Object.entries(dashboardData.orgTypeDistribution).map(([type, count]) => (
//                   <div key={type} className="dist-item">
//                     <span className="dist-name">{type}</span>
//                     <div className="dist-bar-container">
//                       <div className="dist-bar" style={{ width: `${(count / dashboardData.totalClients) * 100}%`, backgroundColor: '#34a853' }}></div>
//                       <span className="dist-count">{count}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Pending Approvals Tab */}
//       {activeTab === 'pending' && (
//         <div className="pending-content">
//           <div className="content-header">
//             <h2>Pending Client Approvals</h2>
//             <input
//               type="text"
//               placeholder="Search by company name or email..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//           </div>

//           <div className="clients-grid">
//             {filteredPendingClients.map((client) => (
//               <div key={client.id} className="client-card pending-card">
//                 <div className="client-header">
//                   <h3>{client.companyName}</h3>
//                   {getClientStatusBadge(client.clientStatus, client.isApproved)}
//                 </div>
//                 <div className="client-details">
//                   <p><span className="detail-label">📧 Email:</span> {client.companyEmail}</p>
//                   <p><span className="detail-label">📞 Phone:</span> {client.companyMobileNumber}</p>
//                   <p><span className="detail-label">🏷️ Type:</span> {client.clientType}</p>
//                   <p><span className="detail-label">🏢 Org:</span> {client.orgType}</p>
//                   <p><span className="detail-label">📅 Created:</span> {formatDate(client.createdAt)}</p>
//                 </div>
//                 <div className="client-actions">
//                   <button className="btn-sm btn-outline" onClick={() => handleViewClient(client)}>
//                     View Details
//                   </button>
//                   <button className="btn-sm btn-success" onClick={() => {
//                     setSelectedClient(client);
//                     setApproveRejectData({ isApproved: true, rejectionReason: null });
//                     setShowApproveRejectModal(true);
//                   }}>
//                     Approve
//                   </button>
//                   <button className="btn-sm btn-danger" onClick={() => {
//                     setSelectedClient(client);
//                     setApproveRejectData({ isApproved: false, rejectionReason: '' });
//                     setShowApproveRejectModal(true);
//                   }}>
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {filteredPendingClients.length === 0 && (
//             <div className="empty-state">
//               <span className="empty-icon">✅</span>
//               <p>No pending approvals</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* All Clients Tab */}
//       {activeTab === 'clients' && (
//         <div className="clients-content">
//           <div className="content-header">
//             <h2>All Clients</h2>
//             <div className="filters">
//               <input
//                 type="text"
//                 placeholder="Search clients..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-input"
//               />
//               <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
//                 <option value="all">All Status</option>
//                 <option value="ACTIVE">Active</option>
//                 <option value="PENDING">Pending</option>
//                 <option value="REJECTED">Rejected</option>
//               </select>
//             </div>
//           </div>

//           <div className="clients-table-container">
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Company Name</th>
//                   <th>Email</th>
//                   <th>Phone</th>
//                   <th>Type</th>
//                   <th>Status</th>
//                   <th>Created</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredAllClients.map((client) => (
//                   <tr key={client.id}>
//                     <td className="company-cell">
//                       <strong>{client.companyName}</strong>
//                     </td>
//                     <td>{client.companyEmail}</td>
//                     <td>{client.companyMobileNumber}</td>
//                     <td>{client.clientType}</td>
//                     <td>{getClientStatusBadge(client.clientStatus, client.isApproved)}</td>
//                     <td>{new Date(client.createdAt).toLocaleDateString()}</td>
//                     <td>
//                       <button className="btn-sm btn-outline" onClick={() => handleViewClient(client)}>
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filteredAllClients.length === 0 && (
//             <div className="empty-state">
//               <span className="empty-icon">🏢</span>
//               <p>No clients found</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* BDE Team Tab */}
//       {activeTab === 'team' && (
//         <div className="team-content">
//           <div className="content-header">
//             <h2>BDE Team Members</h2>
//             <p className="team-stats">Total {bdeTeam.length} members</p>
//           </div>

//           <div className="team-grid">
//             {bdeTeam.map((member) => (
//               <div key={member.employeeId} className="team-card">
//                 <div className="team-avatar">
//                   {member.user.photoUrl ? (
//                     <img src={member.user.photoUrl} alt={member.user.name} />
//                   ) : (
//                     <div className="avatar-placeholder">{member.user.name.charAt(0)}</div>
//                   )}
//                 </div>
//                 <div className="team-info">
//                   <h3>{member.user.name}</h3>
//                   <p className="team-email">{member.user.email}</p>
//                   <p className="team-position">{member.positionName}</p>
//                   <div className="team-meta">
//                     <span className="skill-tag">{member.skillSet?.split(',')[0]}</span>
//                     <span className="salary-tag">{formatCurrency(member.salary)}</span>
//                   </div>
//                 </div>
//                 <div className="team-actions">
//                   <button className="btn-sm btn-outline" onClick={() => handleViewTeamMember(member)}>
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {bdeTeam.length === 0 && (
//             <div className="empty-state">
//               <span className="empty-icon">👥</span>
//               <p>No BDE team members found</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Client Detail Modal */}
//       {showClientDetailModal && selectedClient && (
//         <div className="modal-overlay" onClick={() => setShowClientDetailModal(false)}>
//           <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
//             <button className="modal-close" onClick={() => setShowClientDetailModal(false)}>✕</button>
//             <div className="modal-header">
//               <h2>{selectedClient.companyName}</h2>
//               {getClientStatusBadge(selectedClient.clientStatus, selectedClient.isApproved)}
//             </div>
//             <div className="modal-body">
//               <div className="details-section">
//                 <h3>Company Information</h3>
//                 <div className="details-grid">
//                   <div className="detail-item"><label>Company Name:</label><span>{selectedClient.companyName}</span></div>
//                   <div className="detail-item"><label>Email:</label><span>{selectedClient.companyEmail}</span></div>
//                   <div className="detail-item"><label>Phone:</label><span>{selectedClient.companyMobileNumber}</span></div>
//                   <div className="detail-item"><label>Website:</label><span>{selectedClient.clientWebsite || 'N/A'}</span></div>
//                   <div className="detail-item"><label>Organization Type:</label><span>{selectedClient.orgType}</span></div>
//                   <div className="detail-item"><label>Client Type:</label><span>{selectedClient.clientType}</span></div>
//                   <div className="detail-item"><label>Created At:</label><span>{formatDate(selectedClient.createdAt)}</span></div>
//                   {selectedClient.rejectionReason && (
//                     <div className="detail-item full-width"><label>Rejection Reason:</label><span className="text-danger">{selectedClient.rejectionReason}</span></div>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               {selectedClient.clientStatus === 'PENDING' && (
//                 <>
//                   <button className="btn-primary" onClick={() => {
//                     setShowClientDetailModal(false);
//                     setShowApproveRejectModal(true);
//                   }}>
//                     Approve / Reject
//                   </button>
//                 </>
//               )}
//               <button className="btn-outline" onClick={() => {
//                 setShowEditClientModal(true);
//               }}>
//                 Edit Details
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Client Modal */}
//       {showEditClientModal && selectedClient && (
//         <div className="modal-overlay" onClick={() => setShowEditClientModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="modal-close" onClick={() => setShowEditClientModal(false)}>✕</button>
//             <h2>Edit Client Details</h2>
//             <p className="modal-subtitle">{selectedClient.companyName}</p>
//             <div className="form-group">
//               <label>Company Name</label>
//               <input type="text" value={editClientData.companyName || ''} onChange={(e) => setEditClientData({ ...editClientData, companyName: e.target.value })} />
//             </div>
//             <div className="form-group">
//               <label>Email</label>
//               <input type="email" value={editClientData.companyEmail || ''} onChange={(e) => setEditClientData({ ...editClientData, companyEmail: e.target.value })} />
//             </div>
//             <div className="form-group">
//               <label>Phone Number</label>
//               <input type="text" value={editClientData.companyMobileNumber || ''} onChange={(e) => setEditClientData({ ...editClientData, companyMobileNumber: e.target.value })} />
//             </div>
//             <div className="form-group">
//               <label>Website</label>
//               <input type="text" value={editClientData.clientWebsite || ''} onChange={(e) => setEditClientData({ ...editClientData, clientWebsite: e.target.value })} />
//             </div>
//             <div className="form-group">
//               <label>Organization Type</label>
//               <select value={editClientData.orgType || ''} onChange={(e) => setEditClientData({ ...editClientData, orgType: e.target.value })}>
//                 <option value="">Select Type</option>
//                 <option value="Private Limited">Private Limited</option>
//                 <option value="Public Limited">Public Limited</option>
//                 <option value="Startup">Startup</option>
//                 <option value="LLP">LLP</option>
//                 <option value="Sole Proprietorship">Sole Proprietorship</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label>Client Type</label>
//               <select value={editClientData.clientType || ''} onChange={(e) => setEditClientData({ ...editClientData, clientType: e.target.value })}>
//                 <option value="">Select Type</option>
//                 <option value="Enterprise">Enterprise</option>
//                 <option value="Small Business">Small Business</option>
//                 <option value="Startup">Startup</option>
//               </select>
//             </div>
//             <button className="btn-primary" onClick={handleEditClient}>Save Changes</button>
//           </div>
//         </div>
//       )}

//       {/* Approve/Reject Modal */}
//       {showApproveRejectModal && selectedClient && (
//         <div className="modal-overlay" onClick={() => setShowApproveRejectModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="modal-close" onClick={() => setShowApproveRejectModal(false)}>✕</button>
//             <h2>{approveRejectData.isApproved ? 'Approve Client' : 'Reject Client'}</h2>
//             <p className="modal-subtitle">{selectedClient.companyName}</p>
//             {!approveRejectData.isApproved && (
//               <div className="form-group">
//                 <label>Rejection Reason *</label>
//                 <textarea
//                   rows={3}
//                   value={approveRejectData.rejectionReason || ''}
//                   onChange={(e) => setApproveRejectData({ ...approveRejectData, rejectionReason: e.target.value })}
//                   placeholder="Please provide reason for rejection..."
//                 />
//               </div>
//             )}
//             <div className="modal-actions">
//               <button className="btn-outline" onClick={() => setShowApproveRejectModal(false)}>Cancel</button>
//               <button className={approveRejectData.isApproved ? 'btn-success' : 'btn-danger'} onClick={handleApproveClient}>
//                 {approveRejectData.isApproved ? 'Approve Client' : 'Reject Client'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Team Member Detail Modal */}
//       {showTeamMemberModal && selectedTeamMember && (
//         <div className="modal-overlay" onClick={() => setShowTeamMemberModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="modal-close" onClick={() => setShowTeamMemberModal(false)}>✕</button>
//             <div className="team-profile-header">
//               <div className="profile-avatar large">
//                 {selectedTeamMember.user.photoUrl ? (
//                   <img src={selectedTeamMember.user.photoUrl} alt={selectedTeamMember.user.name} />
//                 ) : (
//                   <div className="avatar-placeholder">{selectedTeamMember.user.name.charAt(0)}</div>
//                 )}
//               </div>
//               <div className="profile-info">
//                 <h2>{selectedTeamMember.user.name}</h2>
//                 <p>{selectedTeamMember.user.email}</p>
//                 <p className="position-badge">{selectedTeamMember.positionName}</p>
//               </div>
//             </div>
//             <div className="details-grid">
//               <div className="detail-item"><label>Department:</label><span>{selectedTeamMember.departmentRef.departmentName}</span></div>
//               <div className="detail-item"><label>Salary:</label><span>{formatCurrency(selectedTeamMember.salary)}</span></div>
//               <div className="detail-item"><label>Skills:</label><span>{selectedTeamMember.skillSet}</span></div>
//               <div className="detail-item full-width"><label>Employee ID:</label><span>{selectedTeamMember.employeeId}</span></div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .bde-director-container {
//           min-height: 100vh;
//           background: var(--bg, #f5f7fc);
//         }

//         .bde-header {
//           background: var(--card-bg, #ffffff);
//           border-bottom: 1px solid var(--border, #e5e7eb);
//           padding: 1rem 2rem;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           flex-wrap: wrap;
//           gap: 1rem;
//         }

//         .header-left h1 {
//           font-size: 1.5rem;
//           font-weight: 700;
//           margin: 0;
//           color: var(--text, #1f2937);
//         }

//         .header-left p {
//           font-size: 0.8rem;
//           color: var(--muted, #6b7280);
//           margin: 0.25rem 0 0;
//         }

//         .header-right {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//         }

//         .user-badge {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.5rem 1rem;
//           background: var(--surface, #f3f4f6);
//           border-radius: 40px;
//           font-size: 0.85rem;
//           font-weight: 500;
//         }

//         .logout-btn {
//           padding: 0.5rem 1rem;
//           background: transparent;
//           border: 1px solid var(--border, #e5e7eb);
//           border-radius: 40px;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .logout-btn:hover {
//           background: #ef4444;
//           color: white;
//           border-color: #ef4444;
//         }

//         .bde-tabs {
//           display: flex;
//           gap: 0.25rem;
//           padding: 0 2rem;
//           background: var(--card-bg, #ffffff);
//           border-bottom: 1px solid var(--border, #e5e7eb);
//           flex-wrap: wrap;
//         }

//         .tab {
//           padding: 0.85rem 1.5rem;
//           background: transparent;
//           border: none;
//           font-size: 0.9rem;
//           font-weight: 600;
//           color: var(--muted, #6b7280);
//           cursor: pointer;
//           transition: all 0.2s;
//           border-bottom: 2px solid transparent;
//         }

//         .tab:hover {
//           color: var(--teal, #2ca6a4);
//         }

//         .tab.active {
//           color: var(--teal, #2ca6a4);
//           border-bottom-color: var(--teal, #2ca6a4);
//         }

//         .dashboard-content,
//         .pending-content,
//         .clients-content,
//         .team-content {
//           padding: 2rem;
//         }

//         .kpi-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           gap: 1.5rem;
//           margin-bottom: 2rem;
//         }

//         .kpi-card {
//           background: var(--card-bg, #ffffff);
//           border: 1px solid var(--border, #e5e7eb);
//           border-radius: 16px;
//           padding: 1.2rem;
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           transition: all 0.2s;
//         }

//         .kpi-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//         }

//         .kpi-icon {
//           width: 48px;
//           height: 48px;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1.5rem;
//         }

//         .kpi-icon.blue { background: rgba(31, 109, 168, 0.1); }
//         .kpi-icon.orange { background: rgba(245, 124, 0, 0.1); }
//         .kpi-icon.green { background: rgba(52, 168, 83, 0.1); }
//         .kpi-icon.red { background: rgba(231, 76, 60, 0.1); }
//         .kpi-icon.purple { background: rgba(106, 90, 205, 0.1); }
//         .kpi-icon.teal { background: rgba(44, 166, 164, 0.1); }

//         .kpi-info {
//           display: flex;
//           flex-direction: column;
//         }

//         .kpi-value {
//           font-size: 2rem;
//           font-weight: 800;
//           line-height: 1;
//           color: var(--text, #1f2937);
//         }

//         .kpi-label {
//           font-size: 0.75rem;
//           color: var(--muted, #6b7280);
//         }

//         .charts-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
//           gap: 1.5rem;
//         }

//         .chart-card {
//           background: var(--card-bg, #ffffff);
//           border: 1px solid var(--border, #e5e7eb);
//           border-radius: 16px;
//           padding: 1.2rem;
//         }

//         .chart-card h3 {
//           font-size: 1rem;
//           margin-bottom: 1rem;
//           color: var(--text, #1f2937);
//         }

//         .distribution-list {
//           display: flex;
//           flex-direction: column;
//           gap: 0.75rem;
//         }

//         .dist-item {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           flex-wrap: wrap;
//         }

//         .dist-name {
//           width: 120px;
//           font-size: 0.85rem;
//         }

//         .dist-bar-container {
//           flex: 1;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .dist-bar {
//           height: 8px;
//           border-radius: 4px;
//           transition: width 0.3s;
//         }

//         .dist-count {
//           font-size: 0.75rem;
//           font-weight: 600;
//           min-width: 30px;
//         }

//         .content-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           flex-wrap: wrap;
//           gap: 1rem;
//           margin-bottom: 1.5rem;
//         }

//         .content-header h2 {
//           font-size: 1.25rem;
//           margin: 0;
//         }

//         .filters {
//           display: flex;
//           gap: 0.75rem;
//           flex-wrap: wrap;
//         }

//         .search-input, .filter-select {
//           padding: 0.5rem 0.75rem;
//           border: 1px solid var(--border, #e5e7eb);
//           border-radius: 8px;
//           background: var(--surface, #f3f4f6);
//           font-size: 0.85rem;
//           min-width: 200px;
//         }

//         .clients-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
//           gap: 1rem;
//         }

//         .client-card {
//           background: var(--card-bg, #ffffff);
//           border: 1px solid var(--border, #e5e7eb);
//           border-radius: 16px;
//           padding: 1.2rem;
//           transition: all 0.2s;
//         }

//         .client-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//         }

//         .client-card.pending-card {
//           border-left: 4px solid #f59e0b;
//         }

//         .client-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 0.75rem;
//           flex-wrap: wrap;
//           gap: 0.5rem;
//         }

//         .client-header h3 {
//           margin: 0;
//           font-size: 1rem;
//         }

//         .client-details p {
//           font-size: 0.8rem;
//           margin: 0.3rem 0;
//           color: var(--muted, #6b7280);
//         }

//         .detail-label {
//           font-weight: 600;
//           color: var(--text, #1f2937);
//         }

//         .client-actions {
//           display: flex;
//           gap: 0.5rem;
//           margin-top: 1rem;
//         }

//         .clients-table-container {
//           overflow-x: auto;
//           border-radius: 16px;
//         }

//         .data-table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         .data-table th,
//         .data-table td {
//           padding: 0.75rem;
//           text-align: left;
//           border-bottom: 1px solid var(--border, #e5e7eb);
//         }

//         .data-table th {
//           font-size: 0.75rem;
//           font-weight: 600;
//           text-transform: uppercase;
//           color: var(--muted, #6b7280);
//         }

//         .company-cell strong {
//           font-weight: 600;
//         }

//         .team-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
//           gap: 1rem;
//         }

//         .team-card {
//           background: var(--card-bg, #ffffff);
//           border: 1px solid var(--border, #e5e7eb);
//           border-radius: 16px;
//           padding: 1.2rem;
//           display: flex;
//           gap: 1rem;
//           transition: all 0.2s;
//         }

//         .team-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//         }

//         .team-avatar {
//           width: 60px;
//           height: 60px;
//           border-radius: 50%;
//           overflow: hidden;
//           flex-shrink: 0;
//         }

//         .team-avatar img,
//         .avatar-placeholder {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .avatar-placeholder {
//           background: linear-gradient(135deg, #2ca6a4, #1f6da8);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: white;
//         }

//         .team-info {
//           flex: 1;
//         }

//         .team-info h3 {
//           margin: 0 0 0.25rem;
//           font-size: 1rem;
//         }

//         .team-email {
//           font-size: 0.75rem;
//           color: var(--muted, #6b7280);
//           margin: 0 0 0.25rem;
//         }

//         .team-position {
//           font-size: 0.8rem;
//           font-weight: 500;
//           color: var(--teal, #2ca6a4);
//           margin: 0 0 0.5rem;
//         }

//         .team-meta {
//           display: flex;
//           gap: 0.5rem;
//           flex-wrap: wrap;
//         }

//         .skill-tag {
//           padding: 0.2rem 0.5rem;
//           border-radius: 12px;
//           font-size: 0.7rem;
//           background: rgba(44, 166, 164, 0.1);
//           color: var(--teal, #2ca6a4);
//         }

//         .salary-tag {
//           padding: 0.2rem 0.5rem;
//           border-radius: 12px;
//           font-size: 0.7rem;
//           background: rgba(52, 168, 83, 0.1);
//           color: var(--green, #34a853);
//         }

//         .team-actions {
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//         }

//         .team-stats {
//           font-size: 0.85rem;
//           color: var(--muted, #6b7280);
//         }

//         .btn-sm {
//           padding: 0.35rem 0.85rem;
//           border-radius: 40px;
//           font-size: 0.75rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .btn-primary {
//           background: linear-gradient(135deg, #2ca6a4, #1f6da8);
//           color: white;
//           border: none;
//           padding: 0.6rem 1.2rem;
//           border-radius: 40px;
//           font-weight: 600;
//           cursor: pointer;
//         }

//         .btn-outline {
//           background: transparent;
//           border: 1.5px solid var(--border, #e5e7eb);
//           color: var(--text, #1f2937);
//         }

//         .btn-outline:hover {
//           border-color: var(--teal, #2ca6a4);
//           color: var(--teal, #2ca6a4);
//         }

//         .btn-success {
//           background: linear-gradient(135deg, #27ae60, #229954);
//           color: white;
//           border: none;
//         }

//         .btn-danger {
//           background: linear-gradient(135deg, #e74c3c, #c0392b);
//           color: white;
//           border: none;
//         }

//         .status-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 0.25rem;
//           padding: 0.2rem 0.6rem;
//           border-radius: 20px;
//           font-size: 0.7rem;
//           font-weight: 600;
//         }

//         .status-pending { background: rgba(245, 124, 0, 0.1); color: #f59e0b; }
//         .status-approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }
//         .status-rejected { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

//         .empty-state {
//           text-align: center;
//           padding: 3rem;
//           color: var(--muted, #6b7280);
//         }

//         .empty-icon {
//           font-size: 3rem;
//           display: block;
//           margin-bottom: 1rem;
//           opacity: 0.5;
//         }

//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0, 0, 0, 0.6);
//           backdrop-filter: blur(4px);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//           padding: 1rem;
//         }

//         .modal-content {
//           background: var(--card-bg, #ffffff);
//           border-radius: 24px;
//           max-width: 500px;
//           width: 100%;
//           max-height: 90vh;
//           overflow-y: auto;
//           padding: 1.5rem;
//           position: relative;
//         }

//         .modal-content.large {
//           max-width: 700px;
//         }

//         .modal-close {
//           position: absolute;
//           top: 1rem;
//           right: 1rem;
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           background: var(--surface, #f3f4f6);
//           border: 1px solid var(--border, #e5e7eb);
//           cursor: pointer;
//         }

//         .modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1rem;
//           flex-wrap: wrap;
//           gap: 0.5rem;
//         }

//         .modal-header h2 {
//           margin: 0;
//           font-size: 1.3rem;
//         }

//         .modal-body {
//           margin-bottom: 1.5rem;
//         }

//         .details-section {
//           margin-bottom: 1rem;
//         }

//         .details-section h3 {
//           font-size: 0.9rem;
//           margin-bottom: 0.75rem;
//           color: var(--teal, #2ca6a4);
//         }

//         .details-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 0.75rem;
//         }

//         .detail-item {
//           display: flex;
//           flex-direction: column;
//         }

//         .detail-item label {
//           font-size: 0.7rem;
//           font-weight: 600;
//           color: var(--muted, #6b7280);
//         }

//         .detail-item span {
//           font-size: 0.85rem;
//         }

//         .detail-item.full-width {
//           grid-column: 1 / -1;
//         }

//         .modal-footer {
//           display: flex;
//           gap: 0.75rem;
//           justify-content: flex-end;
//           margin-top: 1rem;
//           padding-top: 1rem;
//           border-top: 1px solid var(--border, #e5e7eb);
//         }

//         .modal-actions {
//           display: flex;
//           gap: 0.75rem;
//           justify-content: flex-end;
//           margin-top: 1rem;
//         }

//         .form-group {
//           margin-bottom: 1rem;
//         }

//         .form-group label {
//           display: block;
//           font-size: 0.75rem;
//           font-weight: 600;
//           margin-bottom: 0.25rem;
//           color: var(--muted, #6b7280);
//         }

//         .form-group input,
//         .form-group select,
//         .form-group textarea {
//           width: 100%;
//           padding: 0.6rem 0.75rem;
//           border: 1px solid var(--border, #e5e7eb);
//           border-radius: 10px;
//           background: var(--surface, #f3f4f6);
//           font-size: 0.85rem;
//         }

//         .modal-subtitle {
//           color: var(--muted, #6b7280);
//           margin-bottom: 1rem;
//         }

//         .text-danger {
//           color: #ef4444;
//         }

//         .team-profile-header {
//           display: flex;
//           align-items: center;
//           gap: 1.5rem;
//           margin-bottom: 1.5rem;
//           flex-wrap: wrap;
//         }

//         .profile-avatar.large {
//           width: 80px;
//           height: 80px;
//         }

//         .position-badge {
//           display: inline-block;
//           padding: 0.2rem 0.8rem;
//           background: rgba(44, 166, 164, 0.1);
//           border-radius: 20px;
//           font-size: 0.75rem;
//           color: var(--teal, #2ca6a4);
//           margin-top: 0.25rem;
//         }

//         .bde-loader {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           min-height: 100vh;
//           gap: 1rem;
//         }

//         .loader-spinner {
//           width: 40px;
//           height: 40px;
//           border: 3px solid var(--border, #e5e7eb);
//           border-top-color: var(--teal, #2ca6a4);
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         .access-denied {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           min-height: 100vh;
//           background: var(--bg, #f5f7fc);
//         }

//         .access-denied-card {
//           text-align: center;
//           background: var(--card-bg, #ffffff);
//           padding: 2rem;
//           border-radius: 24px;
//           max-width: 400px;
//         }

//         .access-denied-icon {
//           font-size: 4rem;
//           display: block;
//           margin-bottom: 1rem;
//         }

//         @media (max-width: 768px) {
//           .bde-header, .bde-tabs, .dashboard-content,
//           .pending-content, .clients-content, .team-content {
//             padding: 1rem;
//           }
          
//           .kpi-grid {
//             grid-template-columns: repeat(2, 1fr);
//           }
          
//           .charts-grid {
//             grid-template-columns: 1fr;
//           }
          
//           .details-grid {
//             grid-template-columns: 1fr;
//           }
          
//           .clients-grid,
//           .team-grid {
//             grid-template-columns: 1fr;
//           }
          
//           .data-table {
//             display: block;
//             overflow-x: auto;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BDEDirectorDashboard;















