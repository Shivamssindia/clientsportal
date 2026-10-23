'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// TYPES
// ============================================

interface UserProfile {
  userId: number;
  uid: string;
  name: string;
  email: string;
  photoUrl: string | null;
  emailVerified: boolean;
  isProfileCompleted: boolean;
  phoneNumber?: string;
  address?: string;
  gender?: string;
  dob?: string;
}

interface DashboardStats {
  totalProjects: number;
  pendingProjects: number;
  inProgressProjects: number;
  completedProjects: number;
  totalConsultants: number;
  totalEmployees: number;
  totalTeams: number;
  totalTasks: number;
  pendingTasks: number;
}

interface Consultant {
  consultantId: number;
  userId: number;
  name: string;
  email: string;
  photoUrl: string | null;
  skill: string;
  experience: string;
  currentStatus: string;
  departmentId: number;
  departmentName: string;
  isApproved: string;
}

interface StatusHistory {
  statusId: number;
  status: string;
  note: string;
  dateTime: string;
}

interface UpdateStatusResponse {
  statusId: number;
  consultantId: number;
  consultantName: string;
  status: string;
  note: string;
  dateTime: string;
}

interface Employee {
  employeeId: number;
  userId: number;
  name: string;
  email: string;
  photoUrl: string | null;
  phoneNumber: string | null;
  address: string | null;
  gender: string | null;
  isDirectorVerified: boolean;
  positionName: string;
  salary: number;
  department: string;
  skillSet: string;
  departmentId: number;
  departmentName: string;
}

interface Project {
  projectId: number;
  projectName: string;
  projectDescription?: string;
  projectType?: string;
  status: string;
  departmentId: number;
  departmentName: string;
  clientName?: string;
  clientEmail?: string;
  assignedManagerId?: number;
  assignedManagerName?: string;
  deadline?: string;
  directorNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectHistory {
  statusId: number;
  status: string;
  dateTime: string;
  handledByName: string;
  assignedToName: string | null;
  directorNote: string;
  managerNote: string;
}

interface TeamMember {
  memberId: number;
  memberName: string;
  memberEmail: string;
  photoUrl: string | null;
  role: string;
  description: string | null;
}

interface Team {
  teamId: number;
  teamName: string;
  projectId: number;
  projectName: string;
  managerId: number;
  managerName: string;
  members: TeamMember[];
  createdAt: string;
}

interface Task {
  taskId: number;
  description: string;
  status: string;
  assignedToUserId: number;
  assignedToUserName: string;
  createdByUserId: number;
  createdByName: string;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AssignTaskInput {
  assignedToUserId: number;
  description: string;
  deadline: string;
}

interface ConvertToEmployeeInput {
  positionName: string;
  salary: number;
  skillSet: string;
  departmentId: number;
}

interface AIProjectSuggestion {
  projectAnalysis: {
    projectType: string;
    domain: string;
    complexity: 'Low' | 'Medium' | 'High';
    estimatedDuration: string;
    keyTechnologies: string;
    recommendedTeamSize: string;
  };
  suggestedDepartment: {
    departmentId: number;
    departmentName: string;
    reason: string;
    confidenceScore: number;
  };
  suggestedManager: {
    managerId: number;
    managerName: string;
    performanceScore: number;
    projectsCompleted: number;
    averageRating: number;
    reason: string;
  };
  suggestedConsultants: Array<{
    consultantId: number;
    name: string;
    email: string;
    skill: string;
    experience: string;
    rating: number;
    currentLoad: number;
    reason: string;
  }>;
  suggestedTasks: Array<{
    taskName: string;
    description: string;
    estimatedHours: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  timeline: {
    totalWeeks: number;
    phases: Array<{ phase: string; weeks: number }>;
  };
  costEstimation: {
    totalCost: number;
    breakdown: {
      development: number;
      design: number;
      testing: number;
      projectManagement: number;
    };
  };
  risks: {
    risks: Array<{
      risk: string;
      level: 'HIGH' | 'MEDIUM' | 'LOW';
      mitigation: string;
    }>;
  };
  rawAIResponse: string;
}

interface AIProjectAnalysis {
  projectAnalysis: {
    projectType: string;
    complexity: string;
    estimatedDuration: string;
    keyTechnologies: string;
  };
  suggestedManager: {
    managerId: number;
    managerName: string;
    reason: string;
  };
  suggestedConsultants: Array<{
    consultantId: number;
    name: string;
    skill: string;
    rating: number;
    reason: string;
  }>;
  risks: {
    risks: Array<{
      risk: string;
      level: 'HIGH' | 'MEDIUM' | 'LOW';
      mitigation: string;
    }>;
  };
  rawAIResponse: string;
}

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiCall = async <T,>(
  method: string,
  endpoint: string,
  data?: any,
  isFormData: boolean = false
): Promise<T> => {
  try {
    const config: any = {
      method,
      url: `${API_BASE}${endpoint}`,
      withCredentials: true,
    };

    if (isFormData) {
      config.data = data;
      config.headers = { 'Content-Type': 'multipart/form-data' };
    } else if (data) {
      config.data = data;
      config.headers = { 'Content-Type': 'application/json' };
    }

    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// ============================================
// CORE DIRECTOR API FUNCTIONS
// ============================================

const checkCoreDirector = async () => {
  return apiCall<{ success: boolean; data: boolean }>('GET', '/api/core-director/check');
};

const getDashboardStats = async () => {
  return apiCall<{ success: boolean; message: string; data: DashboardStats }>('GET', '/api/core-director/dashboard/stats');
};

const getConsultants = async () => {
  return apiCall<{ success: boolean; message: string; data: Consultant[] }>('GET', '/api/core-director/consultants');
};

const getConsultantById = async (id: number) => {
  return apiCall<{ success: boolean; message: string; data: Consultant }>('GET', `/api/core-director/consultants/${id}`);
};

const getConsultantStatusHistory = async (id: number) => {
  return apiCall<{ success: boolean; message: string; data: StatusHistory[] }>('GET', `/api/core-director/consultants/${id}/status-history`);
};

const updateConsultantStatus = async (id: number, status: string, note: string) => {
  return apiCall<{ success: boolean; message: string; data: UpdateStatusResponse }>('PUT', `/api/core-director/consultants/${id}/status`, { status, note });
};

const convertToEmployee = async (id: number, data: ConvertToEmployeeInput) => {
  return apiCall<{ success: boolean; message: string; data: Employee | null }>('POST', `/api/core-director/consultants/${id}/convert-to-employee`, data);
};

const getEmployees = async () => {
  return apiCall<{ success: boolean; message: string; data: Employee[] }>('GET', '/api/core-director/employees');
};

const getEmployeeById = async (id: number) => {
  return apiCall<{ success: boolean; message: string; data: Employee }>('GET', `/api/core-director/employees/${id}`);
};

const getProjects = async () => {
  return apiCall<{ success: boolean; message: string; data: Project[] }>('GET', '/api/core-director/projects');
};

const getPendingProjects = async () => {
  return apiCall<{ success: boolean; message: string; data: Project[] }>('GET', '/api/core-director/projects/pending');
};

const approveProject = async (projectId: number, status: string, note: string) => {
  return apiCall<{ success: boolean; message: string; data: any }>('PUT', `/api/core-director/projects/${projectId}/approve?status=${status}&note=${encodeURIComponent(note)}`);
};

const assignProjectToManager = async (projectId: number, managerId: number, directorNote: string, deadline: string) => {
  return apiCall<{ success: boolean; message: string; data: any }>('PUT', `/api/core-director/projects/${projectId}/assign`, { managerId, directorNote, deadline });
};

const getProjectById = async (id: number) => {
  return apiCall<{ success: boolean; message: string; data: Project }>('GET', `/api/core-director/projects/${id}`);
};

const getProjectHistory = async (projectId: number) => {
  return apiCall<{ success: boolean; message: string; data: ProjectHistory[] }>('GET', `/api/core-director/projects/${projectId}/history`);
};

const getProjectTeams = async (projectId: number) => {
  return apiCall<{ success: boolean; message: string; data: Team[] }>('GET', `/api/core-director/projects/${projectId}/teams`);
};

const assignTask = async (data: AssignTaskInput) => {
  return apiCall<{ success: boolean; message: string; data: Task }>('POST', '/api/core-director/tasks/assign', data);
};

const getTasks = async () => {
  return apiCall<{ success: boolean; message: string; data: Task[] }>('GET', '/api/core-director/tasks');
};

const updateTaskStatus = async (taskId: number, status: string) => {
  return apiCall<{ success: boolean; message: string; data: { taskId: number; status: string } }>('PUT', `/api/core-director/tasks/${taskId}/status?status=${status}`);
};

const getUserProfile = async () => {
  return apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
};

const updateUserProfile = async (data: Partial<UserProfile>) => {
  return apiCall('PUT', '/api/users/profile', data);
};

// ============================================
// AI API FUNCTIONS
// ============================================

const aiSuggestProject = async (projectName: string, projectDescription: string, projectType: string) => {
  return apiCall<{ success: boolean; message: string; data: AIProjectSuggestion }>('POST', '/api/ai/suggest-new-project', { projectName, projectDescription, projectType });
};

const aiAnalyzeProject = async (projectId: number) => {
  return apiCall<{ success: boolean; message: string; data: AIProjectAnalysis }>('GET', `/api/ai/analyze-project/${projectId}`);
};

const aiSuggestConsultantForTask = async (taskName: string, taskDescription: string, projectId: number) => {
  return apiCall('POST', '/api/ai/suggest-consultant-for-task', { taskName, taskDescription, projectId });
};

// ============================================
// SIDEBAR MENU ITEMS
// ============================================

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'consultants', label: 'Consultants', icon: '👨‍💻' },
  { id: 'employees', label: 'Employees', icon: '👥' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'pending-projects', label: 'Pending Approval', icon: '⏳' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: '🤖' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

// ============================================
// STATUS CONFIGURATION
// ============================================

const statusConfig: Record<string, { label: string; class: string; icon: string; color: string }> = {
  PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳', color: '#F59E0B' },
  APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅', color: '#10B981' },
  REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '❌', color: '#EF4444' },
  IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄', color: '#3B82F6' },
  COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️', color: '#10B981' },
  ACTIVE: { label: 'Active', class: 'status-approved', icon: '🟢', color: '#10B981' },
  INACTIVE: { label: 'Inactive', class: 'status-rejected', icon: '⚪', color: '#6B7280' },
};

const getStatusBadge = (status: string) => {
  const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌', color: '#6B7280' };
  return <span className={`status-badge ${config.class}`}>{config.icon} {config.label}</span>;
};

// ============================================
// MAIN CORE DIRECTOR COMPONENT
// ============================================

const CoreDirectorDashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Selected item states
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Modal states
  const [showConsultantDetailModal, setShowConsultantDetailModal] = useState(false);
  const [showConsultantStatusModal, setShowConsultantStatusModal] = useState(false);
  const [showConvertToEmployeeModal, setShowConvertToEmployeeModal] = useState(false);
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
  const [showProjectApproveModal, setShowProjectApproveModal] = useState(false);
  const [showAssignManagerModal, setShowAssignManagerModal] = useState(false);
  const [showProjectHistoryModal, setShowProjectHistoryModal] = useState(false);
  const [showProjectTeamsModal, setShowProjectTeamsModal] = useState(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [showTaskUpdateModal, setShowTaskUpdateModal] = useState(false);
  const [showAISuggestModal, setShowAISuggestModal] = useState(false);
  const [showAIAnalyzeModal, setShowAIAnalyzeModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('overview');

  // Form states
  const [consultantStatusData, setConsultantStatusData] = useState({ status: '', note: '' });
  const [convertEmployeeData, setConvertEmployeeData] = useState<ConvertToEmployeeInput>({
    positionName: '',
    salary: 0,
    skillSet: '',
    departmentId: 0,
  });
  const [approveProjectData, setApproveProjectData] = useState({ status: 'APPROVED', note: '' });
  const [assignManagerData, setAssignManagerData] = useState({ managerId: 0, directorNote: '', deadline: '' });
  const [assignTaskData, setAssignTaskData] = useState<AssignTaskInput>({
    assignedToUserId: 0,
    description: '',
    deadline: '',
  });
  const [updateTaskStatusData, setUpdateTaskStatusData] = useState({ status: '' });

  // AI states
  const [aiSuggestionInput, setAiSuggestionInput] = useState({ projectName: '', projectDescription: '', projectType: '' });
  const [aiSuggestionResult, setAiSuggestionResult] = useState<AIProjectSuggestion | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIProjectAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTaskSuggestion, setAiTaskSuggestion] = useState<any>(null);

  // History and teams data
  const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);
  const [projectTeams, setProjectTeams] = useState<Team[]>([]);
  const [consultantHistory, setConsultantHistory] = useState<StatusHistory[]>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { logout } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [profileRes, statsRes, consultantsRes, employeesRes, projectsRes, pendingRes, tasksRes] = await Promise.all([
        getUserProfile().catch(() => ({ data: null })),
        getDashboardStats().catch(() => ({ data: null })),
        getConsultants().catch(() => ({ data: [] })),
        getEmployees().catch(() => ({ data: [] })),
        getProjects().catch(() => ({ data: [] })),
        getPendingProjects().catch(() => ({ data: [] })),
        getTasks().catch(() => ({ data: [] })),
      ]);

      setUser(profileRes.data);
      setStats(statsRes.data);
      setConsultants(consultantsRes.data);
      setEmployees(employeesRes.data);
      setProjects(projectsRes.data);
      setPendingProjects(pendingRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleUpdateConsultantStatus = async () => {
    if (!selectedConsultant || !consultantStatusData.status) {
      alert('Please select a status');
      return;
    }
    try {
      await updateConsultantStatus(selectedConsultant.consultantId, consultantStatusData.status, consultantStatusData.note);
      alert('Status updated successfully');
      const consultantsRes = await getConsultants();
      setConsultants(consultantsRes.data);
      setShowConsultantStatusModal(false);
      setConsultantStatusData({ status: '', note: '' });
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  const handleConvertToEmployee = async () => {
    if (!selectedConsultant) return;
    if (!convertEmployeeData.positionName || !convertEmployeeData.salary || !convertEmployeeData.departmentId) {
      alert('Please fill all required fields');
      return;
    }
    try {
      await convertToEmployee(selectedConsultant.consultantId, convertEmployeeData);
      alert('Consultant converted to employee successfully');
      const [consultantsRes, employeesRes] = await Promise.all([
        getConsultants(),
        getEmployees(),
      ]);
      setConsultants(consultantsRes.data);
      setEmployees(employeesRes.data);
      setShowConvertToEmployeeModal(false);
      setConvertEmployeeData({ positionName: '', salary: 0, skillSet: '', departmentId: 0 });
    } catch (error: any) {
      alert(error.message || 'Failed to convert to employee');
    }
  };

  const handleApproveProject = async () => {
    if (!selectedProject) return;
    try {
      await approveProject(selectedProject.projectId, approveProjectData.status, approveProjectData.note);
      alert(`Project ${approveProjectData.status.toLowerCase()} successfully`);
      const [projectsRes, pendingRes] = await Promise.all([
        getProjects(),
        getPendingProjects(),
      ]);
      setProjects(projectsRes.data);
      setPendingProjects(pendingRes.data);
      setShowProjectApproveModal(false);
      setApproveProjectData({ status: 'APPROVED', note: '' });
    } catch (error: any) {
      alert(error.message || 'Failed to approve/reject project');
    }
  };

  const handleAssignManager = async () => {
    if (!selectedProject) return;
    if (!assignManagerData.managerId || !assignManagerData.deadline) {
      alert('Please select a manager and set a deadline');
      return;
    }
    try {
      await assignProjectToManager(
        selectedProject.projectId,
        assignManagerData.managerId,
        assignManagerData.directorNote,
        assignManagerData.deadline
      );
      alert('Project assigned to manager successfully');
      const projectsRes = await getProjects();
      setProjects(projectsRes.data);
      setShowAssignManagerModal(false);
      setAssignManagerData({ managerId: 0, directorNote: '', deadline: '' });
    } catch (error: any) {
      alert(error.message || 'Failed to assign manager');
    }
  };

  const handleAssignTask = async () => {
    if (!assignTaskData.assignedToUserId || !assignTaskData.description || !assignTaskData.deadline) {
      alert('Please fill all fields');
      return;
    }
    try {
      await assignTask(assignTaskData);
      alert('Task assigned successfully');
      const tasksRes = await getTasks();
      setTasks(tasksRes.data);
      setShowAssignTaskModal(false);
      setAssignTaskData({ assignedToUserId: 0, description: '', deadline: '' });
    } catch (error: any) {
      alert(error.message || 'Failed to assign task');
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask || !updateTaskStatusData.status) {
      alert('Please select a status');
      return;
    }
    try {
      await updateTaskStatus(selectedTask.taskId, updateTaskStatusData.status);
      alert('Task status updated successfully');
      const tasksRes = await getTasks();
      setTasks(tasksRes.data);
      setShowTaskUpdateModal(false);
      setUpdateTaskStatusData({ status: '' });
      setSelectedTask(null);
    } catch (error: any) {
      alert(error.message || 'Failed to update task status');
    }
  };

  const handleAISuggestProject = async () => {
    if (!aiSuggestionInput.projectName || !aiSuggestionInput.projectDescription) {
      alert('Please enter project name and description');
      return;
    }
    setAiLoading(true);
    try {
      const res = await aiSuggestProject(
        aiSuggestionInput.projectName,
        aiSuggestionInput.projectDescription,
        aiSuggestionInput.projectType || 'General'
      );
      setAiSuggestionResult(res.data);
    } catch (error: any) {
      alert(error.message || 'Failed to get AI suggestions');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIAnalyzeProject = async (projectId: number) => {
    setAiLoading(true);
    try {
      const res = await aiAnalyzeProject(projectId);
      setAiAnalysisResult(res.data);
      setShowAIAnalyzeModal(true);
    } catch (error: any) {
      alert(error.message || 'Failed to analyze project');
    } finally {
      setAiLoading(false);
    }
  };

  const handleViewConsultantDetails = async (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    try {
      const historyRes = await getConsultantStatusHistory(consultant.consultantId);
      setConsultantHistory(historyRes.data);
      setShowConsultantDetailModal(true);
    } catch (error) {
      console.error('Error fetching consultant history:', error);
      setConsultantHistory([]);
      setShowConsultantDetailModal(true);
    }
  };

  const handleViewProjectDetails = async (project: Project) => {
    setSelectedProject(project);
    setActiveModalTab('overview');
    try {
      const [historyRes, teamsRes] = await Promise.all([
        getProjectHistory(project.projectId).catch(() => ({ data: [] })),
        getProjectTeams(project.projectId).catch(() => ({ data: [] })),
      ]);
      setProjectHistory(historyRes.data);
      setProjectTeams(teamsRes.data);
      setShowProjectDetailModal(true);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setShowProjectDetailModal(true);
    }
  };

  const filteredConsultants = consultants.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projects.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  if (loading) {
    return (
      <div className="client-loader">
        <div className="loader-spinner"></div>
        <p>Loading Director Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="client-container">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Core Director</span>
          </div>
          <button className="theme-toggle-btn" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">{user?.name?.charAt(0) || 'D'}</div>
            )}
          </div>
          <div className="sidebar-user-info">
            <h4>{user?.name || 'Director'}</h4>
            <p>Core Director</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-footer-btn logout" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="sidebar-overlay" onClick={() => setMobileSidebarOpen(false)}></div>
      <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>☰</button>

      {/* Main Content */}
      <main className="client-main">
        <header className="client-header">
          <div className="header-welcome">
            <h1>Core Director Dashboard</h1>
            <p>Manage projects, consultants, employees, and tasks</p>
          </div>
          <div className="header-stats">
            <div className="header-stat-item">
              <span className="stat-label">Projects</span>
              <span className="stat-value-sm">{stats?.totalProjects || 0}</span>
            </div>
            <div className="header-stat-item">
              <span className="stat-label">Consultants</span>
              <span className="stat-value-sm">{stats?.totalConsultants || 0}</span>
            </div>
            <div className="header-stat-item">
              <span className="stat-label">Employees</span>
              <span className="stat-value-sm">{stats?.totalEmployees || 0}</span>
            </div>
            <div className="header-stat-item">
              <span className="stat-label">Pending Tasks</span>
              <span className="stat-value-sm">{stats?.pendingTasks || 0}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Tab */}
        {activeNav === 'dashboard' && stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">📊</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalProjects}</span>
                  <span className="stat-label">Total Projects</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">⏳</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.pendingProjects}</span>
                  <span className="stat-label">Pending Projects</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">🔄</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.inProgressProjects}</span>
                  <span className="stat-label">In Progress</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">✅</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.completedProjects}</span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon teal">👨‍💻</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalConsultants}</span>
                  <span className="stat-label">Consultants</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue">👥</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalEmployees}</span>
                  <span className="stat-label">Employees</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">👥</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalTeams}</span>
                  <span className="stat-label">Teams</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">✅</div>
                <div className="stat-info">
                  <span className="stat-value">{stats.totalTasks}</span>
                  <span className="stat-label">Total Tasks</span>
                  <span className="stat-label" style={{ fontSize: '0.65rem' }}>{stats.pendingTasks} pending</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h2>📋 Recent Projects</h2>
                <button className="view-all-link" onClick={() => setActiveNav('projects')}>View All →</button>
              </div>
              <div className="projects-grid">
                {projects.slice(0, 4).map(project => (
                  <div key={project.projectId} className="project-card">
                    <div className="project-card-header">
                      <h3>{project.projectName}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="project-card-desc">{project.projectDescription?.substring(0, 80) || 'No description'}</p>
                    <div className="project-card-meta">
                      <span>🏢 {project.departmentName}</span>
                      {project.assignedManagerName && <span>👔 {project.assignedManagerName}</span>}
                      {project.deadline && <span>📅 Due: {new Date(project.deadline).toLocaleDateString()}</span>}
                    </div>
                    <div className="project-card-actions">
                      <button className="btn-sm btn-primary" onClick={() => handleViewProjectDetails(project)}>View Details</button>
                      {project.status === 'PENDING' && (
                        <button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowProjectApproveModal(true); }}>Approve/Reject</button>
                      )}
                      {project.status === 'APPROVED' && !project.assignedManagerId && (
                        <button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowAssignManagerModal(true); }}>Assign Manager</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h2>⏳ Pending Approvals</h2>
                <button className="view-all-link" onClick={() => setActiveNav('pending-projects')}>View All →</button>
              </div>
              <div className="projects-grid">
                {pendingProjects.slice(0, 3).map(project => (
                  <div key={project.projectId} className="project-card pending">
                    <div className="project-card-header">
                      <h3>{project.projectName}</h3>
                      <span className="status-badge status-pending">⏳ Pending Approval</span>
                    </div>
                    <p className="project-card-desc">{project.projectDescription?.substring(0, 80) || 'No description'}</p>
                    <div className="project-card-meta">
                      <span>🏢 {project.departmentName}</span>
                      <span>📱 {project.projectType || 'N/A'}</span>
                    </div>
                    <div className="project-card-actions">
                      <button className="btn-sm btn-primary" onClick={() => { setSelectedProject(project); setShowProjectApproveModal(true); }}>Review Project</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h2>✅ Recent Tasks</h2>
                <button className="view-all-link" onClick={() => setActiveNav('tasks')}>View All →</button>
              </div>
              <div className="tasks-list">
                {tasks.slice(0, 5).map(task => (
                  <div key={task.taskId} className="file-item">
                    <div className="file-icon">📋</div>
                    <div className="file-info">
                      <div className="file-name">{task.description}</div>
                      <div className="file-meta">
                        <span>Assigned to: {task.assignedToUserName}</span>
                        <span>Created by: {task.createdByName}</span>
                        {task.deadline && <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="file-actions">
                      {getStatusBadge(task.status)}
                      <button className="btn-icon" onClick={() => { setSelectedTask(task); setShowTaskUpdateModal(true); }}>✏️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Consultants Tab */}
        {activeNav === 'consultants' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>👨‍💻 Consultants Management</h2>
              <div className="header-filters">
                <input
                  type="text"
                  placeholder="Search consultants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="emp-grid">
              {filteredConsultants.map(consultant => (
                <div key={consultant.consultantId} className="card">
                  <div className="emp-header">
                    <div className={`emp-avatar ${consultant.isApproved === 'APPROVED' ? 'verified' : 'pending'}`}>
                      {consultant.photoUrl ? (
                        <img src={consultant.photoUrl} alt={consultant.name} className="avatar-img" />
                      ) : (
                        consultant.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3>{consultant.name}</h3>
                      <span className="dept-badge">{consultant.departmentName}</span>
                    </div>
                  </div>
                  <div className="emp-body">
                    <div className="emp-row">
                      <span>📧 Email:</span>
                      <span>{consultant.email}</span>
                    </div>
                    <div className="emp-row">
                      <span>🔧 Skills:</span>
                      <span className="skills">
                        {consultant.skill.split(',').slice(0, 3).map((s, i) => (
                          <span key={i} className="skill">{s.trim()}</span>
                        ))}
                        {consultant.skill.split(',').length > 3 && <span className="skill more">+{consultant.skill.split(',').length - 3}</span>}
                      </span>
                    </div>
                    <div className="emp-row">
                      <span>📅 Experience:</span>
                      <span>{consultant.experience}</span>
                    </div>
                    <div className="emp-row">
                      <span>📊 Status:</span>
                      {getStatusBadge(consultant.isApproved)}
                    </div>
                    <div className="emp-row">
                      <span>🔄 Current Status:</span>
                      <span className={`status ${consultant.currentStatus === 'ACTIVE' ? 'ok' : 'pending'}`}>
                        {consultant.currentStatus || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="emp-footer">
                    <button className="btn-outline-sm" onClick={() => handleViewConsultantDetails(consultant)}>View Details</button>
                    <div className="footer-actions">
                      <button className="btn-icon-small" onClick={() => { setSelectedConsultant(consultant); setShowConsultantStatusModal(true); }}>📝 Update Status</button>
                      <button className="btn-icon-small success" onClick={() => { setSelectedConsultant(consultant); setShowConvertToEmployeeModal(true); }}>🔄 Convert to Employee</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredConsultants.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">👨‍💻</span>
                <p>No consultants found</p>
              </div>
            )}
          </div>
        )}

        {/* Employees Tab */}
        {activeNav === 'employees' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>👥 Employees Directory</h2>
              <div className="header-filters">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="emp-grid">
              {employees.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map(employee => (
                <div key={employee.employeeId} className="card">
                  <div className="emp-header">
                    <div className="emp-avatar verified">
                      {employee.photoUrl ? (
                        <img src={employee.photoUrl} alt={employee.name} className="avatar-img" />
                      ) : (
                        employee.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3>{employee.name}</h3>
                      <span className="dept-badge">{employee.departmentName}</span>
                    </div>
                  </div>
                  <div className="emp-body">
                    <div className="emp-row">
                      <span>📧 Email:</span>
                      <span>{employee.email}</span>
                    </div>
                    <div className="emp-row">
                      <span>💼 Position:</span>
                      <span>{employee.positionName}</span>
                    </div>
                    <div className="emp-row">
                      <span>💰 Salary:</span>
                      <span className="salary">₹{employee.salary.toLocaleString()}</span>
                    </div>
                    <div className="emp-row">
                      <span>🔧 Skills:</span>
                      <span className="skills">
                        {employee.skillSet?.split(',').slice(0, 3).map((s, i) => (
                          <span key={i} className="skill">{s.trim()}</span>
                        ))}
                      </span>
                    </div>
                    <div className="emp-row">
                      <span>✅ Verified:</span>
                      <span>{employee.isDirectorVerified ? '✓ Verified' : '⏳ Pending'}</span>
                    </div>
                  </div>
                  <div className="emp-footer">
                    <button className="btn-outline-sm" onClick={() => alert(`Employee: ${employee.name}\nEmail: ${employee.email}\nPosition: ${employee.positionName}\nSalary: ₹${employee.salary.toLocaleString()}\nSkills: ${employee.skillSet}`)}>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeNav === 'projects' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>📁 All Projects</h2>
              <div className="header-filters">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="projects-grid">
              {filteredProjects.map(project => (
                <div key={project.projectId} className="project-card">
                  <div className="project-card-header">
                    <h3>{project.projectName}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  <p className="project-card-desc">{project.projectDescription?.substring(0, 100) || 'No description'}</p>
                  <div className="project-card-meta">
                    <span>🏢 {project.departmentName}</span>
                    <span>📱 {project.projectType || 'N/A'}</span>
                    {project.clientName && <span>👤 {project.clientName}</span>}
                    {project.assignedManagerName && <span>👔 {project.assignedManagerName}</span>}
                  </div>
                  <div className="project-card-actions">
                    <button className="btn-sm btn-primary" onClick={() => handleViewProjectDetails(project)}>View Details</button>
                    <button className="btn-sm btn-outline" onClick={() => handleAIAnalyzeProject(project.projectId)}>🤖 AI Analyze</button>
                    {project.status === 'PENDING' && (
                      <button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowProjectApproveModal(true); }}>Approve/Reject</button>
                    )}
                    {project.status === 'APPROVED' && !project.assignedManagerId && (
                      <button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowAssignManagerModal(true); }}>Assign Manager</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Projects Tab */}
        {activeNav === 'pending-projects' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>⏳ Projects Pending Approval</h2>
            </div>
            <div className="pending-projects-list">
              {pendingProjects.map(project => (
                <div key={project.projectId} className="pending-project-card">
                  <div className="pending-project-info">
                    <h3>{project.projectName}</h3>
                    <p>{project.projectDescription?.substring(0, 150) || 'No description'}</p>
                    <div className="meta-row">
                      <span>🏢 {project.departmentName}</span>
                      <span>📱 {project.projectType || 'N/A'}</span>
                      {project.clientName && <span>👤 {project.clientName}</span>}
                      {project.createdAt && <span>📅 Created: {new Date(project.createdAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="pending-project-actions">
                    <button className="btn-success" onClick={() => { setSelectedProject(project); setApproveProjectData({ status: 'APPROVED', note: '' }); setShowProjectApproveModal(true); }}>✅ Approve</button>
                    <button className="btn-danger" onClick={() => { setSelectedProject(project); setApproveProjectData({ status: 'REJECTED', note: '' }); setShowProjectApproveModal(true); }}>❌ Reject</button>
                    <button className="btn-outline" onClick={() => handleViewProjectDetails(project)}>📋 View Details</button>
                  </div>
                </div>
              ))}
              {pendingProjects.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">✨</span>
                  <p>No pending projects to review</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeNav === 'tasks' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>✅ Task Management</h2>
              <button className="btn-primary" onClick={() => setShowAssignTaskModal(true)}>+ Assign New Task</button>
            </div>
            <div className="tasks-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assigned To</th>
                    <th>Created By</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.taskId}>
                      <td className="task-desc-cell">{task.description}</td>
                      <td>{task.assignedToUserName}</td>
                      <td>{task.createdByName}</td>
                      <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</td>
                      <td>{getStatusBadge(task.status)}</td>
                      <td>
                        <div className="task-actions">
                          <button className="btn-icon" onClick={() => { setSelectedTask(task); setShowTaskUpdateModal(true); }}>✏️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Assistant Tab */}
        {activeNav === 'ai-assistant' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>🤖 AI Assistant for Project Management</h2>
            </div>
            <div className="ai-assistant-container">
              <div className="ai-tabs">
                <button className={`ai-tab ${!aiSuggestionResult ? 'active' : ''}`} onClick={() => setAiSuggestionResult(null)}>Suggest New Project</button>
                <button className={`ai-tab ${aiSuggestionResult ? 'active' : ''}`} onClick={() => {}}>View Suggestions</button>
              </div>

              {!aiSuggestionResult ? (
                <div className="ai-suggest-form">
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      placeholder="e.g., E-commerce Platform Development"
                      value={aiSuggestionInput.projectName}
                      onChange={(e) => setAiSuggestionInput({ ...aiSuggestionInput, projectName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe the project goals, requirements, and expectations..."
                      value={aiSuggestionInput.projectDescription}
                      onChange={(e) => setAiSuggestionInput({ ...aiSuggestionInput, projectDescription: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Project Type</label>
                    <select value={aiSuggestionInput.projectType} onChange={(e) => setAiSuggestionInput({ ...aiSuggestionInput, projectType: e.target.value })}>
                      <option value="">Select Type</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Cloud Migration">Cloud Migration</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Data Analytics">Data Analytics</option>
                    </select>
                  </div>
                  <button className="btn-primary" onClick={handleAISuggestProject} disabled={aiLoading}>
                    {aiLoading ? <span className="loading-spinner"></span> : '🤖 Generate AI Suggestions'}
                  </button>
                </div>
              ) : (
                <div className="ai-suggestions-content">
                  <button className="btn-outline" onClick={() => setAiSuggestionResult(null)} style={{ alignSelf: 'flex-start' }}>← New Project</button>

                  {/* Project Analysis */}
                  <div className="ai-section">
                    <h3 className="section-title teal">📊 Project Analysis</h3>
                    <div className="analysis-grid">
                      <div className="analysis-item"><label>Type</label><span>{aiSuggestionResult.projectAnalysis.projectType}</span></div>
                      <div className="analysis-item"><label>Domain</label><span>{aiSuggestionResult.projectAnalysis.domain}</span></div>
                      <div className="analysis-item"><label>Complexity</label><span className={`complexity-${aiSuggestionResult.projectAnalysis.complexity.toLowerCase()}`}>{aiSuggestionResult.projectAnalysis.complexity}</span></div>
                      <div className="analysis-item"><label>Duration</label><span>{aiSuggestionResult.projectAnalysis.estimatedDuration}</span></div>
                      <div className="analysis-item"><label>Key Tech</label><span>{aiSuggestionResult.projectAnalysis.keyTechnologies}</span></div>
                      <div className="analysis-item"><label>Team Size</label><span>{aiSuggestionResult.projectAnalysis.recommendedTeamSize}</span></div>
                    </div>
                  </div>

                  {/* Suggested Department */}
                  <div className="ai-section">
                    <h3 className="section-title green">🏢 Suggested Department</h3>
                    <div className="suggestion-card">
                      <div className="suggestion-header">
                        <strong>{aiSuggestionResult.suggestedDepartment.departmentName}</strong>
                        <span className="confidence-badge">Confidence: {(aiSuggestionResult.suggestedDepartment.confidenceScore * 100).toFixed(0)}%</span>
                      </div>
                      <p className="reason">{aiSuggestionResult.suggestedDepartment.reason}</p>
                    </div>
                  </div>

                  {/* Suggested Manager */}
                  <div className="ai-section">
                    <h3 className="section-title blue">👔 Suggested Project Manager</h3>
                    <div className="suggestion-card">
                      <div className="suggestion-header">
                        <strong>{aiSuggestionResult.suggestedManager.managerName}</strong>
                        <div className="manager-stats">
                          <span>⭐ {aiSuggestionResult.suggestedManager.averageRating}/5</span>
                          <span>📁 {aiSuggestionResult.suggestedManager.projectsCompleted} completed</span>
                        </div>
                      </div>
                      <p className="reason">{aiSuggestionResult.suggestedManager.reason}</p>
                    </div>
                  </div>

                  {/* Suggested Consultants */}
                  <div className="ai-section">
                    <h3 className="section-title orange">👨‍💻 Suggested Consultants</h3>
                    <div className="consultants-suggestions">
                      {aiSuggestionResult.suggestedConsultants.map((c, idx) => (
                        <div key={idx} className="consultant-suggestion-card">
                          <div className="consultant-header">
                            <strong>{c.name}</strong>
                            <span>⭐ {c.rating}/5</span>
                          </div>
                          <div className="consultant-details">
                            <span>🔧 {c.skill}</span>
                            <span>📅 {c.experience}</span>
                            <span>📊 Load: {c.currentLoad}%</span>
                          </div>
                          <p className="reason">{c.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Tasks */}
                  <div className="ai-section">
                    <h3 className="section-title purple">📋 Suggested Tasks</h3>
                    <div className="tasks-suggestions">
                      {aiSuggestionResult.suggestedTasks.map((task, idx) => (
                        <div key={idx} className="task-suggestion-card">
                          <div className="task-header">
                            <strong>{task.taskName}</strong>
                            <span className={`priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                          </div>
                          <p className="task-desc">{task.description}</p>
                          <div className="task-meta">⏱️ Estimated: {task.estimatedHours} hours</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline & Cost */}
                  <div className="ai-section">
                    <h3 className="section-title green">💰 Timeline & Cost Estimation</h3>
                    <div className="cost-timeline-grid">
                      <div className="cost-card">
                        <div className="total-cost">₹{aiSuggestionResult.costEstimation.totalCost.toLocaleString()}</div>
                        <div className="cost-breakdown">
                          <div className="cost-item"><span>Development</span><span>₹{aiSuggestionResult.costEstimation.breakdown.development.toLocaleString()}</span></div>
                          <div className="cost-item"><span>Design</span><span>₹{aiSuggestionResult.costEstimation.breakdown.design.toLocaleString()}</span></div>
                          <div className="cost-item"><span>Testing</span><span>₹{aiSuggestionResult.costEstimation.breakdown.testing.toLocaleString()}</span></div>
                          <div className="cost-item"><span>Project Management</span><span>₹{aiSuggestionResult.costEstimation.breakdown.projectManagement.toLocaleString()}</span></div>
                        </div>
                      </div>
                      <div className="timeline-card">
                        <div className="total-weeks">📅 {aiSuggestionResult.timeline.totalWeeks} Weeks</div>
                        <div className="phases">
                          {aiSuggestionResult.timeline.phases.map((phase, idx) => (
                            <div key={idx} className="phase-item"><span>{phase.phase}</span><span>{phase.weeks} weeks</span></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risks */}
                  <div className="ai-section">
                    <h3 className="section-title red">⚠️ Risk Assessment</h3>
                    <div className="risks-list">
                      {aiSuggestionResult.risks.risks.map((risk, idx) => (
                        <div key={idx} className={`risk-card ${risk.level.toLowerCase()}`}>
                          <div className="risk-header">
                            <strong>{risk.risk}</strong>
                            <span className={`risk-level ${risk.level.toLowerCase()}`}>{risk.level}</span>
                          </div>
                          <div className="mitigation">🛡️ {risk.mitigation}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button className="btn-primary" onClick={() => { setAiSuggestionResult(null); alert('Use these suggestions to create a new project!'); }}>Create Project from Suggestions</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeNav === 'profile' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>Profile Information</h2>
              <button className="btn-outline" onClick={() => alert('Profile edit coming soon')}>✏️ Edit Profile</button>
            </div>
            <div className="profile-info">
              <div className="profile-avatar-large">
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">{user?.name?.charAt(0) || 'D'}</div>
                )}
              </div>
              <div className="profile-details">
                <div className="detail-item"><label>Full Name</label><span>{user?.name}</span></div>
                <div className="detail-item"><label>Email</label><span>{user?.email}</span></div>
                <div className="detail-item"><label>Role</label><span>Core Director</span></div>
                <div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not provided'}</span></div>
                <div className="detail-item"><label>Address</label><span>{user?.address || 'Not provided'}</span></div>
                <div className="detail-item"><label>Email Verified</label><span>{user?.emailVerified ? '✓ Yes' : '✗ No'}</span></div>
              </div>
            </div>
          </div>
        )}

        <footer className="client-footer"><p>© 2026 Gaurion Bharat | Developed by <a href='https://softmax.in' style={{ color: 'skyblue' }}>Softmax.in</a></p></footer>
      </main>

      {/* Consultant Detail Modal */}
      {showConsultantDetailModal && selectedConsultant && (
        <div className="modal-mask open">
          <div className="modal-box large">
            <button className="m-close" onClick={() => setShowConsultantDetailModal(false)}>✕</button>
            <h2>{selectedConsultant.name}</h2>
            <div className="m-tabs">
              <button className={`m-tab ${activeModalTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveModalTab('overview')}>Overview</button>
              <button className={`m-tab ${activeModalTab === 'history' ? 'active' : ''}`} onClick={() => setActiveModalTab('history')}>Status History</button>
            </div>
            <div className="m-tab-content" style={{ display: activeModalTab === 'overview' ? 'block' : 'none' }}>
              <div className="project-detail-section">
                <div className="detail-row"><label>Email:</label><span>{selectedConsultant.email}</span></div>
                <div className="detail-row"><label>Department:</label><span>{selectedConsultant.departmentName}</span></div>
                <div className="detail-row"><label>Skills:</label><span className="skills-tags">{selectedConsultant.skill.split(',').map((s, i) => (<span key={i} className="skill-tag">{s.trim()}</span>))}</span></div>
                <div className="detail-row"><label>Experience:</label><span>{selectedConsultant.experience}</span></div>
                <div className="detail-row"><label>Status:</label>{getStatusBadge(selectedConsultant.isApproved)}</div>
                <div className="detail-row"><label>Current Status:</label><span>{selectedConsultant.currentStatus || 'N/A'}</span></div>
              </div>
            </div>
            <div className="m-tab-content" style={{ display: activeModalTab === 'history' ? 'block' : 'none' }}>
              <div className="vscode-timeline">
                {consultantHistory.length === 0 ? (
                  <div className="empty-state-small">No status history available</div>
                ) : (
                  consultantHistory.map((entry, idx) => (
                    <div key={entry.statusId} className="timeline-entry">
                      <div className="timeline-line">
                        <div className="timeline-connector">
                          <div className="timeline-dot" style={{ backgroundColor: statusConfig[entry.status]?.color || '#6B7280' }}></div>
                          {idx < consultantHistory.length - 1 && <div className="timeline-vertical-line"></div>}
                        </div>
                      </div>
                      <div className="timeline-content">
                        <div className="commit-header">
                          <div className="commit-date"><span className="date-icon">📅</span><span className="date-text">{formatDate(entry.dateTime)}</span></div>
                        </div>
                        <div className="commit-message">
                          <div className="commit-title">Status: {statusConfig[entry.status]?.label || entry.status}</div>
                          {entry.note && <div className="commit-description"><span className="description-icon">📝</span><span className="description-text">{entry.note}</span></div>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Consultant Status Modal */}
      {showConsultantStatusModal && selectedConsultant && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowConsultantStatusModal(false)}>✕</button>
            <h2>Update Status - {selectedConsultant.name}</h2>
            <div className="m-form">
              <div className="form-field">
                <label>Select Status</label>
                <select value={consultantStatusData.status} onChange={(e) => setConsultantStatusData({ ...consultantStatusData, status: e.target.value })}>
                  <option value="">Select Status</option>
                  <option value="APPROVED">✅ Approved</option>
                  <option value="REJECTED">❌ Rejected</option>
                  <option value="ACTIVE">🟢 Active</option>
                  <option value="INACTIVE">⚪ Inactive</option>
                  <option value="BLOCKED">🔴 Blocked</option>
                </select>
              </div>
              <div className="form-field">
                <label>Note (Optional)</label>
                <textarea rows={3} placeholder="Add a note about this status change..." value={consultantStatusData.note} onChange={(e) => setConsultantStatusData({ ...consultantStatusData, note: e.target.value })} />
              </div>
              <button className="btn-msub" onClick={handleUpdateConsultantStatus}>Update Status</button>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Employee Modal */}
      {showConvertToEmployeeModal && selectedConsultant && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowConvertToEmployeeModal(false)}>✕</button>
            <h2>Convert to Employee</h2>
            <p>Converting: <strong>{selectedConsultant.name}</strong></p>
            <div className="m-form">
              <div className="form-field"><label>Position Name *</label><input type="text" placeholder="e.g., Senior Software Engineer" value={convertEmployeeData.positionName} onChange={(e) => setConvertEmployeeData({ ...convertEmployeeData, positionName: e.target.value })} /></div>
              <div className="form-field"><label>Salary (per month) *</label><input type="number" placeholder="e.g., 75000" value={convertEmployeeData.salary || ''} onChange={(e) => setConvertEmployeeData({ ...convertEmployeeData, salary: parseInt(e.target.value) || 0 })} /></div>
              <div className="form-field"><label>Skillset</label><input type="text" placeholder="Comma separated skills" value={convertEmployeeData.skillSet} onChange={(e) => setConvertEmployeeData({ ...convertEmployeeData, skillSet: e.target.value })} /></div>
              <div className="form-field"><label>Department ID *</label><input type="number" placeholder="Department ID" value={convertEmployeeData.departmentId || ''} onChange={(e) => setConvertEmployeeData({ ...convertEmployeeData, departmentId: parseInt(e.target.value) || 0 })} /></div>
              <button className="btn-msub" onClick={handleConvertToEmployee}>Convert to Employee</button>
            </div>
          </div>
        </div>
      )}

      {/* Project Approval Modal */}
      {showProjectApproveModal && selectedProject && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowProjectApproveModal(false)}>✕</button>
            <h2>Review Project</h2>
            <p><strong>{selectedProject.projectName}</strong></p>
            <div className="m-form">
              <div className="form-field">
                <label>Decision</label>
                <select value={approveProjectData.status} onChange={(e) => setApproveProjectData({ ...approveProjectData, status: e.target.value })}>
                  <option value="APPROVED">✅ Approve Project</option>
                  <option value="REJECTED">❌ Reject Project</option>
                </select>
              </div>
              <div className="form-field">
                <label>Director's Note</label>
                <textarea rows={3} placeholder="Add your review notes..." value={approveProjectData.note} onChange={(e) => setApproveProjectData({ ...approveProjectData, note: e.target.value })} />
              </div>
              <button className="btn-msub" onClick={handleApproveProject}>Submit Decision</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Manager Modal */}
      {showAssignManagerModal && selectedProject && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowAssignManagerModal(false)}>✕</button>
            <h2>Assign Project Manager</h2>
            <p>Project: <strong>{selectedProject.projectName}</strong></p>
            <div className="m-form">
              <div className="form-field">
                <label>Manager ID</label>
                <input type="number" placeholder="Enter Manager User ID" value={assignManagerData.managerId || ''} onChange={(e) => setAssignManagerData({ ...assignManagerData, managerId: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="form-field">
                <label>Deadline</label>
                <input type="datetime-local" value={assignManagerData.deadline} onChange={(e) => setAssignManagerData({ ...assignManagerData, deadline: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Director Note (Optional)</label>
                <textarea rows={2} placeholder="Additional instructions for the manager..." value={assignManagerData.directorNote} onChange={(e) => setAssignManagerData({ ...assignManagerData, directorNote: e.target.value })} />
              </div>
              <button className="btn-msub" onClick={handleAssignManager}>Assign Manager</button>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {showProjectDetailModal && selectedProject && (
        <div className="modal-mask open">
          <div className="modal-box large">
            <button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button>
            <h2>{selectedProject.projectName}</h2>
            <div className="m-tabs">
              <button className={`m-tab ${activeModalTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveModalTab('overview')}>Overview</button>
              <button className={`m-tab ${activeModalTab === 'history' ? 'active' : ''}`} onClick={() => setActiveModalTab('history')}>History</button>
              <button className={`m-tab ${activeModalTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveModalTab('teams')}>Teams</button>
            </div>
            <div className="m-tab-content" style={{ display: activeModalTab === 'overview' ? 'block' : 'none' }}>
              <div className="project-detail-section">
                <div className="detail-row"><label>Status:</label>{getStatusBadge(selectedProject.status)}</div>
                <div className="detail-row"><label>Description:</label><p>{selectedProject.projectDescription || 'No description'}</p></div>
                <div className="detail-grid">
                  <div><label>Type:</label> {selectedProject.projectType || 'N/A'}</div>
                  <div><label>Department:</label> {selectedProject.departmentName}</div>
                  <div><label>Client:</label> {selectedProject.clientName || 'N/A'}</div>
                  <div><label>Manager:</label> {selectedProject.assignedManagerName || 'Not assigned'}</div>
                  <div><label>Deadline:</label> {selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : 'Not set'}</div>
                  {selectedProject.directorNote && <div className="full-width"><label>Director Note:</label><p>{selectedProject.directorNote}</p></div>}
                </div>
              </div>
            </div>
            <div className="m-tab-content" style={{ display: activeModalTab === 'history' ? 'block' : 'none' }}>
              <div className="vscode-timeline">
                {projectHistory.length === 0 ? (
                  <div className="empty-state-small">No history available</div>
                ) : (
                  projectHistory.map((entry, idx) => (
                    <div key={entry.statusId} className="timeline-entry">
                      <div className="timeline-line"><div className="timeline-connector"><div className="timeline-dot" style={{ backgroundColor: statusConfig[entry.status]?.color || '#6B7280' }}></div>{idx < projectHistory.length - 1 && <div className="timeline-vertical-line"></div>}</div></div>
                      <div className="timeline-content">
                        <div className="commit-header"><div className="commit-date"><span className="date-icon">📅</span><span className="date-text">{formatDate(entry.dateTime)}</span></div></div>
                        <div className="commit-message"><div className="commit-title">Status: {statusConfig[entry.status]?.label || entry.status}</div><div className="commit-meta"><span className="meta-author">👤 Handled by: {entry.handledByName}</span>{entry.assignedToName && <span className="meta-assignee">📌 Assigned to: {entry.assignedToName}</span>}</div>{entry.directorNote && <div className="commit-description director"><span className="description-icon">🎯</span><span className="description-text"><strong>Director Note:</strong> {entry.directorNote}</span></div>}{entry.managerNote && <div className="commit-description"><span className="description-icon">📝</span><span className="description-text"><strong>Manager Note:</strong> {entry.managerNote}</span></div>}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="m-tab-content" style={{ display: activeModalTab === 'teams' ? 'block' : 'none' }}>
              {projectTeams.length === 0 ? <div className="empty-state-small">No teams assigned yet</div> : projectTeams.map(team => (
                <div key={team.teamId} className="team-section">
                  <h3>{team.teamName}</h3>
                  <div className="team-manager">Manager: {team.managerName}</div>
                  <div className="team-members">
                    {team.members.map((member, idx) => (
                      <div key={idx} className="team-member">
                        <div className="member-avatar">{member.memberName.charAt(0)}</div>
                        <div className="member-info"><div className="member-name">{member.memberName}</div><div className="member-role">{member.role}</div><div className="member-email">{member.memberEmail}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssignTaskModal && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowAssignTaskModal(false)}>✕</button>
            <h2>Assign New Task</h2>
            <div className="m-form">
              <div className="form-field"><label>Assign To (User ID)</label><input type="number" placeholder="User ID" value={assignTaskData.assignedToUserId || ''} onChange={(e) => setAssignTaskData({ ...assignTaskData, assignedToUserId: parseInt(e.target.value) || 0 })} /></div>
              <div className="form-field"><label>Task Description</label><textarea rows={3} placeholder="Describe the task..." value={assignTaskData.description} onChange={(e) => setAssignTaskData({ ...assignTaskData, description: e.target.value })} /></div>
              <div className="form-field"><label>Deadline</label><input type="datetime-local" value={assignTaskData.deadline} onChange={(e) => setAssignTaskData({ ...assignTaskData, deadline: e.target.value })} /></div>
              <button className="btn-msub" onClick={handleAssignTask}>Assign Task</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Task Modal */}
      {showTaskUpdateModal && selectedTask && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowTaskUpdateModal(false)}>✕</button>
            <h2>Update Task Status</h2>
            <p><strong>{selectedTask.description}</strong></p>
            <div className="m-form">
              <div className="form-field"><label>Current Status</label><select value={updateTaskStatusData.status} onChange={(e) => setUpdateTaskStatusData({ status: e.target.value })}><option value="">Select Status</option><option value="PENDING">⏳ Pending</option><option value="IN_PROGRESS">🔄 In Progress</option><option value="COMPLETED">✅ Completed</option></select></div>
              <button className="btn-msub" onClick={handleUpdateTask}>Update Status</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Analyze Modal */}
      {showAIAnalyzeModal && aiAnalysisResult && (
        <div className="modal-mask open">
          <div className="modal-box large ai-analysis-modal">
            <button className="m-close" onClick={() => { setShowAIAnalyzeModal(false); setAiAnalysisResult(null); }}>✕</button>
            <div className="ai-modal-header"><div className="ai-icon-spin">🤖</div><h2>AI Project Analysis</h2></div>
            <div className="analysis-summary">
              <div className="summary-item"><label>Type</label><span>{aiAnalysisResult.projectAnalysis.projectType}</span></div>
              <div className="summary-item"><label>Complexity</label><span className={`complexity-${aiAnalysisResult.projectAnalysis.complexity.toLowerCase()}`}>{aiAnalysisResult.projectAnalysis.complexity}</span></div>
              <div className="summary-item"><label>Duration</label><span>{aiAnalysisResult.projectAnalysis.estimatedDuration}</span></div>
              <div className="summary-item full-width"><label>Key Technologies</label><span>{aiAnalysisResult.projectAnalysis.keyTechnologies}</span></div>
            </div>
            <div className="ai-section"><h3 className="section-title blue">👔 Suggested Manager</h3><div className="suggestion-card"><div className="suggestion-header"><strong>{aiAnalysisResult.suggestedManager.managerName}</strong></div><p className="reason">{aiAnalysisResult.suggestedManager.reason}</p></div></div>
            <div className="ai-section"><h3 className="section-title orange">👨‍💻 Suggested Consultants</h3><div className="consultants-suggestions">{aiAnalysisResult.suggestedConsultants.map((c, idx) => (<div key={idx} className="consultant-suggestion-card"><div className="consultant-header"><strong>{c.name}</strong><span>⭐ {c.rating}/5</span></div><div className="consultant-details"><span>🔧 {c.skill}</span></div><p className="reason">{c.reason}</p></div>))}</div></div>
            <div className="ai-section"><h3 className="section-title red">⚠️ Risks</h3><div className="risks-list">{aiAnalysisResult.risks.risks.map((risk, idx) => (<div key={idx} className={`risk-card ${risk.level.toLowerCase()}`}><div className="risk-header"><strong>{risk.risk}</strong><span className={`risk-level ${risk.level.toLowerCase()}`}>{risk.level}</span></div><div className="mitigation">🛡️ {risk.mitigation}</div></div>))}</div></div>
            <div className="modal-actions"><button className="btn-primary" onClick={() => setShowAIAnalyzeModal(false)}>Close</button></div>
          </div>
        </div>
      )}

      <style jsx>{`
        .pending-project-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .pending-project-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(135deg, #f39c12, #e67e22);
          border-radius: 20px 0 0 20px;
        }
        .pending-project-card:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }
        .pending-project-info { flex: 2; }
        .pending-project-info h3 { font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem; }
        .pending-project-info p { font-size: 0.85rem; color: var(--muted); margin-bottom: 0.8rem; }
        .meta-row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
        .meta-row span { font-size: 0.75rem; padding: 0.25rem 0.6rem; background: var(--surface); border-radius: 20px; }
        .pending-project-actions { display: flex; gap: 0.8rem; }
        .btn-success { background: linear-gradient(135deg, #27ae60, #229954); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .btn-success:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3); }
        .tasks-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .client-loader { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 1rem; }
        .loader-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--teal); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .client-main { flex: 1; margin-left: 280px; padding: 1.5rem; min-height: 100vh; }
        @media (max-width: 768px) { .client-main { margin-left: 0; padding: 1rem; } .sidebar { transform: translateX(-100%); } .sidebar.open { transform: translateX(0); } .mobile-menu-btn { display: flex; } .pending-project-card { flex-direction: column; align-items: flex-start; } .pending-project-actions { width: 100%; justify-content: flex-end; } }
        .btn-outline-sm { padding: 0.3rem 0.8rem; border-radius: 40px; border: 1px solid var(--border); background: transparent; font-size: 0.7rem; cursor: pointer; transition: 0.2s; }
        .btn-outline-sm:hover { border-color: var(--teal); color: var(--teal); }
        .btn-icon { padding: 0.3rem 0.6rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; font-size: 0.7rem; transition: 0.2s; }
        .btn-icon:hover { background: var(--bg); border-color: var(--teal); }
        .full-width { grid-column: 1 / -1; }
        .vscode-timeline { max-height: 500px; overflow-y: auto; padding: 1rem 0; }
        .timeline-entry { display: flex; gap: 1rem; position: relative; }
        .timeline-line { width: 40px; flex-shrink: 0; }
        .timeline-connector { display: flex; flex-direction: column; align-items: center; min-height: 100%; }
        .timeline-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--card-bg); z-index: 2; }
        .timeline-vertical-line { width: 2px; flex: 1; background: var(--border); margin: 4px 0; min-height: 40px; }
        .timeline-content { flex: 1; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 0.9rem; margin-bottom: 0.8rem; }
        .commit-header { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 0.6rem; padding-bottom: 0.6rem; border-bottom: 1px solid var(--border); }
        .commit-date { font-size: 0.75rem; color: var(--muted); }
        .commit-title { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; }
        .commit-meta { display: flex; gap: 0.8rem; flex-wrap: wrap; font-size: 0.7rem; }
        .commit-description { display: flex; gap: 0.4rem; padding: 0.5rem 0.6rem; background: var(--surface); border-left: 2px solid var(--teal); border-radius: 4px; margin-top: 0.4rem; font-size: 0.75rem; }
        .commit-description.director { border-left-color: var(--orange); }
        .skills-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
        .skill-tag { background: rgba(44, 166, 164, 0.1); padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.7rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 1.2rem; display: flex; align-items: center; gap: 1rem; }
        .stat-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; }
        .stat-info .stat-value { font-size: 2rem; font-weight: 800; line-height: 1; }
        .stat-info .stat-label { font-size: 0.75rem; color: var(--muted); }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
        .project-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 1rem; transition: all 0.2s; }
        .project-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .project-card-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem; }
        .project-card-header h3 { font-size: 1rem; font-weight: 700; }
        .project-card-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.8rem; }
        .project-card-meta { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 0.6rem; font-size: 0.7rem; color: var(--muted); }
        .project-card-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .btn-sm { padding: 0.4rem 0.9rem; border-radius: 40px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: 0.2s; border: none; }
        .btn-primary { background: var(--g-main); color: white; }
        .btn-outline { background: transparent; border: 1.5px solid var(--border); color: var(--text2); }
        .btn-outline:hover { border-color: var(--teal); color: var(--teal); }
        .status-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
        .dashboard-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .card-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
        .card-header h2 { font-size: 1.2rem; font-weight: 800; margin: 0; }
        .search-input, .filter-select { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); font-size: 0.8rem; }
        .emp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        .card { background: var(--bg2); border: 1px solid var(--border); border-radius: 18px; padding: 1.3rem; transition: all 0.3s ease; position: relative; overflow: hidden; }
        .card:hover { transform: translateY(-6px); box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08); border-color: rgba(44, 166, 164, 0.3); }
        .emp-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
        .emp-avatar { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .emp-avatar.verified { background: rgba(52, 168, 83, 0.15); border: 1px solid rgba(52, 168, 83, 0.3); }
        .emp-avatar.pending { background: rgba(243, 108, 61, 0.15); border: 1px solid rgba(243, 108, 61, 0.3); }
        .avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .emp-body { margin-top: 1rem; }
        .emp-row { display: flex; justify-content: space-between; align-items: center; margin: 10px 0; font-size: 0.85rem; }
        .skills { display: flex; gap: 6px; flex-wrap: wrap; }
        .skill { padding: 4px 8px; border-radius: 999px; font-size: 0.7rem; background: rgba(31, 109, 168, 0.1); }
        .emp-footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; }
        .footer-actions { display: flex; gap: 0.5rem; }
        .btn-icon-small { background: transparent; border: 1px solid var(--border); border-radius: 8px; padding: 0.3rem 0.6rem; cursor: pointer; font-size: 0.7rem; transition: 0.2s; }
        .btn-icon-small.success:hover { background: #2ca6a4; border-color: #2ca6a4; color: white; }
        .dept-badge { background: rgba(44, 166, 164, 0.12); padding: 3px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; color: var(--teal); display: inline-block; margin-top: 4px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: 0.8rem; text-align: left; border-bottom: 1px solid var(--border); }
        .data-table th { font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; }
        .task-desc-cell { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .task-actions { display: flex; gap: 0.5rem; }
        .ai-assistant-container { padding: 1rem 0; }
        .ai-tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; }
        .ai-tab { padding: 0.75rem 1.5rem; background: transparent; border: none; color: var(--muted); font-weight: 600; cursor: pointer; border-radius: 8px; }
        .ai-tab.active { color: var(--teal); background: linear-gradient(135deg, rgba(44, 166, 164, 0.1), transparent); border-bottom: 2px solid var(--teal); }
        .form-group { margin-bottom: 1.2rem; }
        .form-group label { display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--muted); }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.7rem 1rem; background: var(--surface); border: 1.5px solid var(--border); border-radius: 12px; font-size: 0.85rem; }
        .ai-section { background: var(--surface); border-radius: 16px; padding: 1.25rem; margin-bottom: 1.25rem; border: 1px solid var(--border); transition: all 0.3s ease; }
        .section-title { position: relative; display: inline-block; margin-bottom: 1rem; padding-bottom: 0.5rem; font-size: 1rem; font-weight: 700; }
        .section-title::after { content: ''; position: absolute; bottom: 0; left: 0; width: 50px; height: 3px; background: linear-gradient(90deg, var(--teal), transparent); border-radius: 3px; }
        .analysis-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
        .analysis-item { display: flex; flex-direction: column; gap: 0.25rem; }
        .analysis-item label { font-size: 0.7rem; font-weight: 600; color: var(--muted); text-transform: uppercase; }
        .suggestion-card { background: var(--card-bg); border-radius: 12px; padding: 1rem; border: 1px solid var(--border); }
        .confidence-badge { padding: 0.2rem 0.6rem; background: rgba(52, 168, 83, 0.1); border-radius: 20px; font-size: 0.75rem; font-weight: 600; color: var(--green); }
        .consultant-suggestion-card, .task-suggestion-card { background: var(--card-bg); border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem; border-left: 3px solid var(--teal); }
        .cost-timeline-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .cost-card, .timeline-card { background: var(--card-bg); border-radius: 12px; padding: 1rem; }
        .total-cost { font-size: 1.5rem; font-weight: 900; color: var(--green); }
        .risk-card { background: var(--card-bg); border-radius: 10px; padding: 0.875rem; border-left: 3px solid; margin-bottom: 0.75rem; }
        .risk-card.high { border-left-color: var(--red); }
        .risk-card.medium { border-left-color: var(--orange); }
        .risk-card.low { border-left-color: var(--green); }
        .modal-mask { display: flex; position: fixed; inset: 0; z-index: 2000; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 1rem; }
        .modal-box { background: var(--card-bg); border-radius: 24px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding: 1.5rem; position: relative; }
        .modal-box.large { max-width: 800px; }
        .m-close { position: absolute; top: 1rem; right: 1rem; width: 32px; height: 32px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
        .m-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
        .m-tab { padding: 0.5rem 1rem; background: none; border: none; cursor: pointer; font-weight: 600; color: var(--muted); border-radius: 8px; }
        .m-tab.active { background: var(--g-main); color: white; }
        .m-tab-content { padding: 1rem 0; }
        .btn-msub { padding: 0.75rem; background: var(--g-main); color: white; border: none; border-radius: 40px; font-weight: 700; cursor: pointer; width: 100%; margin-top: 1rem; }
        .form-field { margin-bottom: 1rem; }
        .detail-row { margin-bottom: 0.8rem; }
        .detail-row label { font-weight: 600; color: var(--muted); display: inline-block; min-width: 100px; }
        .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.8rem; margin-top: 1rem; }
        .team-section { margin-bottom: 1.5rem; }
        .team-member { display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: var(--surface); border-radius: 10px; margin-bottom: 0.5rem; }
        .member-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--g-main); display: flex; align-items: center; justify-content: center; color: white; }
        .member-info .member-name { font-weight: 600; font-size: 0.85rem; }
        .member-info .member-role { font-size: 0.7rem; color: var(--teal); }
      `}</style>
    </div>
  );
};

export default CoreDirectorDashboard;

// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import CommonSidebar from './components/CommonSidebar';

// // ============================================
// // TYPES
// // ============================================

// interface DashboardStats {
//   totalProjects: number;
//   pendingProjects: number;
//   inProgressProjects: number;
//   completedProjects: number;
//   totalConsultants: number;
//   totalEmployees: number;
//   totalTeams: number;
// }

// interface Consultant {
//   consultantId: number;
//   userId: number;
//   name: string;
//   email: string;
//   photoUrl: string | null;
//   skill: string;
//   experience: string;
//   currentStatus: string;
//   departmentId: number;
//   departmentName: string;
//   isApproved: string;
// }

// interface Employee {
//   employeeId: number;
//   userId?: number;
//   name?: string;
//   email?: string;
//   isDirectorVerified: boolean;
//   positionName: string;
//   salary: number;
//   department: string;
//   skillSet: string;
//   departmentId: number;
//   departmentName: string;
// }

// interface Project {
//   projectId: number;
//   projectName: string;
//   projectDescription: string;
//   projectType: string;
//   status: string;
//   departmentId: number;
//   departmentName: string;
//   clientId: number;
//   clientName: string;
//   clientEmail: string;
//   assignedManagerId: number | null;
//   assignedManagerName: string | null;
//   deadline: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// interface TeamMember {
//   memberId: number;
//   memberName: string;
//   memberEmail: string;
//   photoUrl: string | null;
//   role: string;
//   description: string | null;
// }

// interface Team {
//   teamId: number;
//   teamName: string;
//   projectId: number;
//   projectName: string;
//   managerId: number;
//   managerName: string;
//   members: TeamMember[];
//   createdAt: string;
// }

// interface Task {
//   taskId: number;
//   description: string;
//   status: string;
//   assignedToUserId: number;
//   assignedToUserName: string;
//   createdByUserId: number;
//   createdByName: string;
//   deadline: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Payment {
//   paymentId: number;
//   transactionId: string;
//   userName: string;
//   userEmail: string;
//   userType: string;
//   type: string;
//   amount: number;
//   paymentNote: string;
//   dateTime: string;
// }

// interface DepartmentBudget {
//   departmentId: number;
//   departmentName: string;
//   allocatedBudget: number;
//   spentAmount: number;
//   remainingBudget: number;
//   utilizationPercentage: number;
// }

// interface FinancialDashboardKPIs {
//   financialOverview: {
//     totalRevenue: number;
//     totalExpenses: number;
//     netProfit: number;
//     profitMargin: number;
//     totalTransactions: number;
//     averageTransactionValue: number;
//   };
//   recentTransactions: Payment[];
//   departmentBudgets: DepartmentBudget[];
//   monthlyTrends: Array<{
//     month: string;
//     revenue: number;
//     expenses: number;
//     profit: number;
//   }>;
//   revenueExpenseBreakdown: {
//     revenueByType: Record<string, number>;
//     expenseByType: Record<string, number>;
//   };
// }

// interface EmailRecipient {
//   userId: number;
//   name: string;
//   email: string;
//   role: string;
// }

// interface UserProfile {
//   userId: number;
//   uid: string;
//   name: string;
//   email: string;
//   photoUrl: string | null;
//   emailVerified: boolean;
//   isProfileCompleted: boolean;
//   phoneNumber?: string;
//   address?: string;
//   gender?: string;
//   dob?: string;
// }

// // ============================================
// // API CONFIGURATION
// // ============================================

// const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// const apiCall = async <T,>(
//   method: string,
//   endpoint: string,
//   data?: any
// ): Promise<T> => {
//   const response = await axios({
//     method,
//     url: `${API_BASE}${endpoint}`,
//     data,
//     withCredentials: true,
//     headers: { 'Content-Type': 'application/json' },
//   });
//   return response.data;
// };

// // ============================================
// // FINANCIAL DIRECTOR APIs
// // ============================================

// const financialDirectorApi = {
//   // Core Director APIs (for Finance Department)
//   checkCoreDirector: () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/core-director/check'),
//   getStats: () => apiCall<{ success: boolean; data: DashboardStats }>('GET', '/api/core-director/dashboard/stats'),
//   getConsultants: () => apiCall<{ success: boolean; data: Consultant[] }>('GET', '/api/core-director/consultants'),
//   getEmployees: () => apiCall<{ success: boolean; data: Employee[] }>('GET', '/api/core-director/employees'),
//   getProjects: () => apiCall<{ success: boolean; data: Project[] }>('GET', '/api/core-director/projects'),
//   assignProjectToManager: (projectId: number, managerId: number, directorNote: string, deadline: string) =>
//     apiCall('PUT', `/api/core-director/projects/${projectId}/assign`, { managerId, directorNote, deadline }),
//   getProjectTeams: (projectId: number) =>
//     apiCall<{ success: boolean; data: Team[] }>('GET', `/api/core-director/projects/${projectId}/teams`),
//   assignTask: (assignedToUserId: number, description: string, deadline: string) =>
//     apiCall<{ success: boolean; data: Task }>('POST', '/api/core-director/tasks/assign', { assignedToUserId, description, deadline }),

//   // Financial Director Specific APIs
//   checkFinancialDirector: () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/financial-director/check'),
//   getAllPayments: () => apiCall<{ success: boolean; data: Payment[] }>('GET', '/api/financial-director/payments'),
//   getPaymentById: (paymentId: number) => apiCall<{ success: boolean; data: Payment }>('GET', `/api/financial-director/payments/${paymentId}`),
//   getPaymentsByUser: (userId: number) => apiCall<{ success: boolean; data: Payment[] }>('GET', `/api/financial-director/payments/user/${userId}`),
//   getPaymentsByType: (type: string) => apiCall<{ success: boolean; data: Payment[] }>('GET', `/api/financial-director/payments/type/${type}`),
//   getPaymentsByDateRange: (start: string, end: string) =>
//     apiCall<{ success: boolean; data: Payment[] }>('GET', `/api/financial-director/payments/date-range?start=${start}&end=${end}`),
//   getDepartmentBudgets: () => apiCall<{ success: boolean; data: DepartmentBudget[] }>('GET', '/api/financial-director/department-budgets'),
//   getFinancialDashboardKPIs: () => apiCall<{ success: boolean; data: FinancialDashboardKPIs }>('GET', '/api/financial-director/dashboard/kpis'),

//   // Email APIs
//   getAllEmailRecipients: () => apiCall<{ success: boolean; data: EmailRecipient[] }>('GET', '/api/email/recipients/all-users'),
//   sendEmail: (userIds: number[], subject: string, message: string, messageType: string) =>
//     apiCall('POST', '/api/email/send', { userIds, subject, message, messageType }),

//   // User Profile
//   getUserProfile: () => apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile'),
//   updateUserProfile: (data: any) => apiCall('PUT', '/api/users/profile', data),
// };

// // ============================================
// // STATUS CONFIGURATION
// // ============================================

// const getStatusBadge = (status: string): JSX.Element => {
//   const config: Record<string, { class: string; label: string }> = {
//     PENDING: { class: 'status-pending', label: 'Pending' },
//     ASSIGNED: { class: 'status-assigned', label: 'Assigned' },
//     IN_PROGRESS: { class: 'status-progress', label: 'In Progress' },
//     COMPLETED: { class: 'status-completed', label: 'Completed' },
//     REJECTED: { class: 'status-rejected', label: 'Rejected' },
//     APPROVED: { class: 'status-approved', label: 'Approved' },
//     ACTIVE: { class: 'status-active', label: 'Active' },
//     INACTIVE: { class: 'status-inactive', label: 'Inactive' },
//   };
//   const c = config[status] || { class: 'status-pending', label: status.replace('_', ' ') };
//   return <span className={`status-badge ${c.class}`}>{c.label}</span>;
// };

// const getPaymentTypeBadge = (type: string): JSX.Element => {
//   if (type === 'CREDIT') {
//     return <span className="status-badge status-approved">💰 Credit</span>;
//   }
//   return <span className="status-badge status-rejected">💸 Debit</span>;
// };

// // ============================================
// // SIDEBAR MENU ITEMS
// // ============================================

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//   { id: 'payments', label: 'All Payments', icon: '💰' },
//   { id: 'budgets', label: 'Department Budgets', icon: '📋' },
//   { id: 'projects', label: 'Finance Projects', icon: '📁' },
//   { id: 'consultants', label: 'Consultants', icon: '👨‍💻' },
//   { id: 'employees', label: 'Employees', icon: '👥' },
//   { id: 'tasks', label: 'Assign Task', icon: '✓' },
//   { id: 'email', label: 'Send Email', icon: '✉️' },
//   { id: 'profile', label: 'Profile', icon: '👤' },
// ];

// // ============================================
// // MAIN COMPONENT
// // ============================================

// const FinancialDirectorDashboard: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('dashboard');
//   const [loading, setLoading] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
  
//   // Data states
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [financialKpis, setFinancialKpis] = useState<FinancialDashboardKPIs | null>(null);
//   const [consultants, setConsultants] = useState<Consultant[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [departmentBudgets, setDepartmentBudgets] = useState<DepartmentBudget[]>([]);
//   const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);
  
//   // Modal states
//   const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [projectTeams, setProjectTeams] = useState<Team[]>([]);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showProjectModal, setShowProjectModal] = useState(false);
//   const [showAssignProjectModal, setShowAssignProjectModal] = useState(false);
//   const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState<{ show: boolean; action: () => void; message: string }>({ show: false, action: () => {}, message: '' });
//   const [activeModalTab, setActiveModalTab] = useState('overview');
//   const [actionLoading, setActionLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
//   // Form states
//   const [taskData, setTaskData] = useState({ assignedToUserId: 0, description: '', deadline: '' });
//   const [assignProjectData, setAssignProjectData] = useState({ managerId: 0, directorNote: '', deadline: '' });
//   const [emailData, setEmailData] = useState({ userIds: [] as number[], subject: '', message: '', messageType: 'INFORMATION' });
//   const [profileData, setProfileData] = useState({ name: '', phoneNumber: '', address: '', gender: '', dob: '' });
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [paymentFilter, setPaymentFilter] = useState({ type: 'all', userType: 'all' });

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.setAttribute('data-theme', 'dark');
//     }
//     loadDashboardData();
//   }, []);

//   const showMessage = (type: 'success' | 'error', text: string) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), 5000);
//   };

//   const showConfirmation = (message: string, action: () => void) => {
//     setShowConfirmModal({ show: true, action, message });
//   };

//   const loadDashboardData = async () => {
//     setLoading(true);
//     try {
//       const [
//         profileRes,
//         statsRes,
//         kpisRes,
//         consultantsRes,
//         employeesRes,
//         projectsRes,
//         paymentsRes,
//         budgetsRes,
//       ] = await Promise.all([
//         financialDirectorApi.getUserProfile().catch(() => ({ data: null })),
//         financialDirectorApi.getStats().catch(() => ({ data: null })),
//         financialDirectorApi.getFinancialDashboardKPIs().catch(() => ({ data: null })),
//         financialDirectorApi.getConsultants().catch(() => ({ data: [] })),
//         financialDirectorApi.getEmployees().catch(() => ({ data: [] })),
//         financialDirectorApi.getProjects().catch(() => ({ data: [] })),
//         financialDirectorApi.getAllPayments().catch(() => ({ data: [] })),
//         financialDirectorApi.getDepartmentBudgets().catch(() => ({ data: [] })),
//       ]);

//       setUser(profileRes.data);
//       setStats(statsRes.data);
//       setFinancialKpis(kpisRes.data);
//       setConsultants(consultantsRes.data);
//       setEmployees(employeesRes.data);
//       setProjects(projectsRes.data);
//       setPayments(paymentsRes.data);
//       setDepartmentBudgets(budgetsRes.data);
//     } catch (error) {
//       console.error('Error loading dashboard:', error);
//       showMessage('error', 'Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadEmailRecipients = async () => {
//     try {
//       const res = await financialDirectorApi.getAllEmailRecipients();
//       setEmailRecipients(res.data);
//     } catch (error) {
//       console.error('Error loading recipients:', error);
//     }
//   };

//   const handleAssignTask = async () => {
//     if (!taskData.assignedToUserId || !taskData.description) {
//       showMessage('error', 'Please fill all required fields');
//       return;
//     }
//     setActionLoading(true);
//     try {
//       await financialDirectorApi.assignTask(taskData.assignedToUserId, taskData.description, taskData.deadline);
//       showMessage('success', 'Task assigned successfully');
//       setShowAssignTaskModal(false);
//       setTaskData({ assignedToUserId: 0, description: '', deadline: '' });
//       loadDashboardData();
//     } catch (error) {
//       console.error('Error assigning task:', error);
//       showMessage('error', 'Failed to assign task');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleAssignProject = async (projectId: number) => {
//     if (!assignProjectData.managerId) {
//       showMessage('error', 'Please select a manager');
//       return;
//     }
//     setActionLoading(true);
//     try {
//       await financialDirectorApi.assignProjectToManager(
//         projectId,
//         assignProjectData.managerId,
//         assignProjectData.directorNote,
//         assignProjectData.deadline
//       );
//       showMessage('success', 'Project assigned to manager successfully');
//       setShowAssignProjectModal(false);
//       setAssignProjectData({ managerId: 0, directorNote: '', deadline: '' });
//       loadDashboardData();
//     } catch (error) {
//       console.error('Error assigning project:', error);
//       showMessage('error', 'Failed to assign project');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleViewProject = async (project: Project) => {
//     setSelectedProject(project);
//     setActiveModalTab('overview');
//     try {
//       const teamsRes = await financialDirectorApi.getProjectTeams(project.projectId).catch(() => ({ data: [] }));
//       setProjectTeams(teamsRes.data);
//     } catch (error) {
//       console.error('Error loading project details:', error);
//     }
//     setShowProjectModal(true);
//   };

//   const handleViewPayment = async (payment: Payment) => {
//     try {
//       const paymentRes = await financialDirectorApi.getPaymentById(payment.paymentId);
//       setSelectedPayment(paymentRes.data);
//     } catch (error) {
//       console.error('Error loading payment details:', error);
//       setSelectedPayment(payment);
//     }
//     setShowPaymentModal(true);
//   };

//   const handleSendEmail = async () => {
//     if (emailData.userIds.length === 0) {
//       showMessage('error', 'Please select at least one recipient');
//       return;
//     }
//     if (!emailData.subject || !emailData.message) {
//       showMessage('error', 'Please fill subject and message');
//       return;
//     }
//     setActionLoading(true);
//     try {
//       await financialDirectorApi.sendEmail(emailData.userIds, emailData.subject, emailData.message, emailData.messageType);
//       showMessage('success', `Email sent to ${emailData.userIds.length} recipients`);
//       setShowEmailModal(false);
//       setEmailData({ userIds: [], subject: '', message: '', messageType: 'INFORMATION' });
//     } catch (error) {
//       console.error('Error sending email:', error);
//       showMessage('error', 'Failed to send email');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     setActionLoading(true);
//     try {
//       await financialDirectorApi.updateUserProfile(profileData);
//       const profileRes = await financialDirectorApi.getUserProfile();
//       setUser(profileRes.data);
//       setShowProfileModal(false);
//       showMessage('success', 'Profile updated successfully');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       showMessage('error', 'Failed to update profile');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleFilterPaymentsByDate = async () => {
//     if (!dateRange.start || !dateRange.end) {
//       showMessage('error', 'Please select both start and end dates');
//       return;
//     }
//     setActionLoading(true);
//     try {
//       const res = await financialDirectorApi.getPaymentsByDateRange(dateRange.start, dateRange.end);
//       setPayments(res.data);
//       showMessage('success', `Found ${res.data.length} payments in selected date range`);
//     } catch (error) {
//       console.error('Error filtering payments:', error);
//       showMessage('error', 'Failed to filter payments');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const resetPayments = async () => {
//     setActionLoading(true);
//     try {
//       const res = await financialDirectorApi.getAllPayments();
//       setPayments(res.data);
//       setDateRange({ start: '', end: '' });
//       showMessage('success', 'Reset to all payments');
//     } catch (error) {
//       console.error('Error resetting payments:', error);
//       showMessage('error', 'Failed to reset payments');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     if (newMode) {
//       document.documentElement.setAttribute('data-theme', 'dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.setAttribute('data-theme', 'light');
//       localStorage.setItem('theme', 'light');
//     }
//   };

//   // Filter payments
//   const filteredPayments = payments.filter(payment => {
//     if (paymentFilter.type !== 'all' && payment.type !== paymentFilter.type) return false;
//     if (paymentFilter.userType !== 'all' && payment.userType !== paymentFilter.userType) return false;
//     return true;
//   });

//   if (loading) {
//     return (
//       <div className="client-loader">
//         {/* <div className="loader-spinner"></div> */}
//         <p className='loader'><img src="https://cdn.pixabay.com/animation/2025/05/05/15/47/15-47-41-779_512.gif" alt="" /></p>
//       </div>
//     );
//   }

//   return (
//     <div className="client-container">
//       {/* Message Toast */}
//       {message && (
//         <div className={`toast-message ${message.type}`}>
//           {message.type === 'success' ? '✅' : '❌'} {message.text}
//         </div>
//       )}

//       {/* Confirmation Modal */}
//       {showConfirmModal.show && (
//         <div className="modal-mask open">
//           <div className="modal-box" style={{ maxWidth: '400px' }}>
//             <h2>Confirm Action</h2>
//             <p style={{ margin: '1rem 0' }}>{showConfirmModal.message}</p>
//             <div className="modal-actions" style={{ justifyContent: 'center' }}>
//               <button className="btn-outline" onClick={() => setShowConfirmModal({ show: false, action: () => {}, message: '' })}>
//                 Cancel
//               </button>
//               <button className="btn-primary" onClick={() => {
//                 showConfirmModal.action();
//                 setShowConfirmModal({ show: false, action: () => {}, message: '' });
//               }}>
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <CommonSidebar
//         activeNav={activeNav}
//         setActiveNav={setActiveNav}
//         onLogout={() => window.location.href = '/login'}
//         onThemeToggle={toggleDarkMode}
//         darkMode={darkMode}
//         user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null}
//         menuItems={menuItems}
//         title="Financial Director"
//         logoIcon="💰"
//         isOpen={mobileSidebarOpen}
//         onClose={() => setMobileSidebarOpen(false)}
//       />

//       <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
//         ☰
//       </button>

//       <main className="client-main">
//         {/* Dashboard Tab */}
//         {activeNav === 'dashboard' && (
//           <>
//             <header className="client-header">
//               <div className="header-welcome">
//                 <h1>Welcome back, {user?.name?.split(' ')[0] || 'Financial Director'}!</h1>
//                 <p>Finance Department Dashboard</p>
//               </div>
//               <div className="header-stats">
//                 <div className="header-stat-item">
//                   <span className="stat-label">Department</span>
//                   <span className="stat-value-sm">Finance</span>
//                 </div>
//               </div>
//             </header>

//             {/* Core Director Stats */}
//             {stats && (
//               <div className="stats-grid">
//                 <div className="stat-card"><div className="stat-icon blue">📊</div><div className="stat-info"><span className="stat-value">{stats.totalProjects}</span><span className="stat-label">Finance Projects</span></div></div>
//                 <div className="stat-card"><div className="stat-icon orange">⏳</div><div className="stat-info"><span className="stat-value">{stats.pendingProjects}</span><span className="stat-label">Pending</span></div></div>
//                 <div className="stat-card"><div className="stat-icon purple">🔄</div><div className="stat-info"><span className="stat-value">{stats.inProgressProjects}</span><span className="stat-label">In Progress</span></div></div>
//                 <div className="stat-card"><div className="stat-icon green">✅</div><div className="stat-info"><span className="stat-value">{stats.completedProjects}</span><span className="stat-label">Completed</span></div></div>
//                 <div className="stat-card"><div className="stat-icon cyan">👨‍💻</div><div className="stat-info"><span className="stat-value">{stats.totalConsultants}</span><span className="stat-label">Consultants</span></div></div>
//                 <div className="stat-card"><div className="stat-icon teal">👥</div><div className="stat-info"><span className="stat-value">{stats.totalEmployees}</span><span className="stat-label">Employees</span></div></div>
//                 <div className="stat-card"><div className="stat-icon indigo">🏢</div><div className="stat-info"><span className="stat-value">{stats.totalTeams}</span><span className="stat-label">Teams</span></div></div>
//               </div>
//             )}

//             {/* Financial KPIs */}
//             {financialKpis && (
//               <>
//                 <div className="dashboard-card">
//                   <div className="card-header"><h2>💰 Financial Overview</h2></div>
//                   <div className="stats-grid">
//                     <div className="stat-card"><div className="stat-icon green">📈</div><div className="stat-info"><span className="stat-value">₹{financialKpis.financialOverview.totalRevenue.toLocaleString()}</span><span className="stat-label">Total Revenue</span></div></div>
//                     <div className="stat-card"><div className="stat-icon red">📉</div><div className="stat-info"><span className="stat-value">₹{financialKpis.financialOverview.totalExpenses.toLocaleString()}</span><span className="stat-label">Total Expenses</span></div></div>
//                     <div className="stat-card"><div className="stat-icon purple">💵</div><div className="stat-info"><span className="stat-value">₹{financialKpis.financialOverview.netProfit.toLocaleString()}</span><span className="stat-label">Net Profit</span></div></div>
//                     <div className="stat-card"><div className="stat-icon blue">📊</div><div className="stat-info"><span className="stat-value">{financialKpis.financialOverview.profitMargin}%</span><span className="stat-label">Profit Margin</span></div></div>
//                     <div className="stat-card"><div className="stat-icon cyan">🔄</div><div className="stat-info"><span className="stat-value">{financialKpis.financialOverview.totalTransactions}</span><span className="stat-label">Transactions</span></div></div>
//                     <div className="stat-card"><div className="stat-icon teal">⭐</div><div className="stat-info"><span className="stat-value">₹{financialKpis.financialOverview.averageTransactionValue.toLocaleString()}</span><span className="stat-label">Avg Transaction</span></div></div>
//                   </div>
//                 </div>

//                 {/* Department Budgets Summary */}
//                 <div className="dashboard-card">
//                   <div className="card-header"><h2>📋 Department Budgets</h2></div>
//                   <div className="budgets-table">
//                     <table className="data-table">
//                       <thead>
//                         <tr><th>Department</th><th>Allocated</th><th>Spent</th><th>Remaining</th><th>Utilization</th></tr>
//                       </thead>
//                       <tbody>
//                         {departmentBudgets.map(budget => (
//                           <tr key={budget.departmentId}>
//                             <td><strong>{budget.departmentName}</strong></td>
//                             <td>₹{budget.allocatedBudget.toLocaleString()}</td>
//                             <td>₹{budget.spentAmount.toLocaleString()}</td>
//                             <td>₹{budget.remainingBudget.toLocaleString()}</td>
//                             <td>
//                               <div className="progress-bar">
//                                 <div className="progress-fill" style={{ width: `${budget.utilizationPercentage}%`, background: budget.utilizationPercentage > 80 ? 'var(--red)' : 'var(--green)' }}></div>
//                                 <span>{budget.utilizationPercentage}%</span>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Revenue/Expense Breakdown */}
//                 <div className="dashboard-card">
//                   <div className="card-header"><h2>📊 Revenue & Expense Breakdown</h2></div>
//                   <div className="stats-grid">
//                     <div className="breakdown-section">
//                       <h3>Revenue by Type</h3>
//                       {Object.entries(financialKpis.revenueExpenseBreakdown.revenueByType).map(([type, amount]) => (
//                         <div key={type} className="breakdown-item">
//                           <span>{type.replace('_', ' ')}</span>
//                           <span className="stat-value-sm">₹{amount.toLocaleString()}</span>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="breakdown-section">
//                       <h3>Expense by Type</h3>
//                       {Object.entries(financialKpis.revenueExpenseBreakdown.expenseByType).map(([type, amount]) => (
//                         <div key={type} className="breakdown-item">
//                           <span>{type.replace('_', ' ')}</span>
//                           <span className="stat-value-sm">₹{amount.toLocaleString()}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Recent Transactions */}
//                 <div className="dashboard-card">
//                   <div className="card-header"><h2>🔄 Recent Transactions</h2></div>
//                   <div className="transactions-list">
//                     {financialKpis.recentTransactions.slice(0, 5).map(transaction => (
//                       <div key={transaction.paymentId} className="transaction-item">
//                         <div className="transaction-info">
//                           <span className="transaction-user">{transaction.userName}</span>
//                           <span className="transaction-id">{transaction.transactionId}</span>
//                           <span className="transaction-date">{new Date(transaction.dateTime).toLocaleDateString()}</span>
//                         </div>
//                         <div className="transaction-amount">
//                           {getPaymentTypeBadge(transaction.type)}
//                           <span className={transaction.type === 'CREDIT' ? 'text-success' : 'text-danger'}>
//                             ₹{transaction.amount.toLocaleString()}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Monthly Trends */}
//                 <div className="dashboard-card">
//                   <div className="card-header"><h2>📈 Monthly Trends</h2></div>
//                   <div className="monthly-trends">
//                     <table className="data-table">
//                       <thead>
//                         <tr><th>Month</th><th>Revenue</th><th>Expenses</th><th>Profit</th><th>Margin</th></tr>
//                       </thead>
//                       <tbody>
//                         {financialKpis.monthlyTrends.map(trend => {
//                           const margin = (trend.profit / trend.revenue) * 100;
//                           return (
//                             <tr key={trend.month}>
//                               <td>{trend.month}</td>
//                               <td className="text-success">₹{trend.revenue.toLocaleString()}</td>
//                               <td className="text-danger">₹{trend.expenses.toLocaleString()}</td>
//                               <td className="text-purple">₹{trend.profit.toLocaleString()}</td>
//                               <td>{margin.toFixed(1)}%</td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </>
//             )}
//           </>
//         )}

//         {/* Payments Tab */}
//         {activeNav === 'payments' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>All Payments ({filteredPayments.length})</h2>
//               <div className="header-filters">
//                 <select value={paymentFilter.type} onChange={e => setPaymentFilter({ ...paymentFilter, type: e.target.value })} className="filter-select">
//                   <option value="all">All Types</option>
//                   <option value="CREDIT">Credit</option>
//                   <option value="DEBIT">Debit</option>
//                 </select>
//                 <select value={paymentFilter.userType} onChange={e => setPaymentFilter({ ...paymentFilter, userType: e.target.value })} className="filter-select">
//                   <option value="all">All Users</option>
//                   <option value="CLIENT">Clients</option>
//                   <option value="EMP">Employees</option>
//                   <option value="CONSULTANT">Consultants</option>
//                 </select>
//                 <input type="date" placeholder="Start Date" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} className="filter-input" />
//                 <input type="date" placeholder="End Date" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} className="filter-input" />
//                 <button className="btn-outline btn-sm" onClick={handleFilterPaymentsByDate} disabled={actionLoading}>Filter Date</button>
//                 <button className="btn-outline btn-sm" onClick={resetPayments} disabled={actionLoading}>Reset</button>
//               </div>
//             </div>
//             <div className="payments-table">
//               <table className="data-table">
//                 <thead>
//                   <tr><th>Transaction ID</th><th>User</th><th>Type</th><th>Amount</th><th>Note</th><th>Date</th><th>Actions</th></tr>
//                 </thead>
//                 <tbody>
//                   {filteredPayments.map(payment => (
//                     <tr key={payment.paymentId}>
//                       <td className="txn-id">{payment.transactionId}</td>
//                       <td><strong>{payment.userName}</strong><br /><small>{payment.userEmail}</small></td>
//                       <td>{getPaymentTypeBadge(payment.type)}</td>
//                       <td className={payment.type === 'CREDIT' ? 'text-success' : 'text-danger'}>₹{payment.amount.toLocaleString()}</td>
//                       <td>{payment.paymentNote?.substring(0, 30)}...</td>
//                       <td>{new Date(payment.dateTime).toLocaleDateString()}</td>
//                       <td><button className="btn-icon" onClick={() => handleViewPayment(payment)}>👁️</button></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Budgets Tab */}
//         {activeNav === 'budgets' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>Department Budgets</h2></div>
//             <div className="budgets-list">
//               {departmentBudgets.map(budget => (
//                 <div key={budget.departmentId} className="budget-card">
//                   <div className="budget-header">
//                     <h3>{budget.departmentName}</h3>
//                     <span className={`budget-utilization ${budget.utilizationPercentage > 80 ? 'warning' : 'normal'}`}>
//                       {budget.utilizationPercentage}% Utilized
//                     </span>
//                   </div>
//                   <div className="budget-stats">
//                     <div className="budget-stat"><label>Allocated</label><span>₹{budget.allocatedBudget.toLocaleString()}</span></div>
//                     <div className="budget-stat"><label>Spent</label><span>₹{budget.spentAmount.toLocaleString()}</span></div>
//                     <div className="budget-stat"><label>Remaining</label><span>₹{budget.remainingBudget.toLocaleString()}</span></div>
//                   </div>
//                   <div className="progress-bar">
//                     <div className="progress-fill" style={{ width: `${budget.utilizationPercentage}%`, background: budget.utilizationPercentage > 80 ? 'var(--red)' : 'var(--green)' }}></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Projects Tab */}
//         {activeNav === 'projects' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>Finance Department Projects</h2>
//               <button className="btn-primary" onClick={() => setShowAssignProjectModal(true)}>+ Assign Project</button>
//             </div>
//             <div className="projects-grid">
//               {projects.map(project => (
//                 <div key={project.projectId} className="project-card">
//                   <div className="project-card-header"><h3>{project.projectName}</h3>{getStatusBadge(project.status)}</div>
//                   <p className="project-card-desc">{project.projectDescription?.substring(0, 80)}...</p>
//                   <div className="project-card-meta">
//                     <span>👥 {project.clientName}</span>
//                     <span>📱 {project.projectType}</span>
//                     {project.deadline && <span>📅 Due: {new Date(project.deadline).toLocaleDateString()}</span>}
//                   </div>
//                   <div className="project-card-actions">
//                     <button className="btn-sm btn-primary" onClick={() => handleViewProject(project)}>View Details</button>
//                     {project.status === 'PENDING' && (
//                       <button className="btn-sm btn-outline" onClick={() => {
//                         setSelectedProject(project);
//                         setShowAssignProjectModal(true);
//                       }}>Assign Manager</button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Consultants Tab */}
//         {activeNav === 'consultants' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>Finance Consultants</h2></div>
//             <div className="consultants-table">
//               <table className="data-table">
//                 <thead><tr><th>Name</th><th>Email</th><th>Skills</th><th>Experience</th><th>Status</th></tr></thead>
//                 <tbody>
//                   {consultants.map(consultant => (
//                     <tr key={consultant.consultantId}>
//                       <td><strong>{consultant.name}</strong></td>
//                       <td>{consultant.email}</td>
//                       <td className="skills-cell">{consultant.skill?.substring(0, 50)}...</td>
//                       <td>{consultant.experience}</td>
//                       <td>{getStatusBadge(consultant.currentStatus)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Employees Tab */}
//         {activeNav === 'employees' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>Finance Employees</h2>
//               <button className="btn-primary" onClick={() => setShowAssignTaskModal(true)}>+ Assign Task</button>
//             </div>
//             <div className="employees-grid">
//               {employees.map(employee => (
//                 <div key={employee.employeeId} className="employee-card">
//                   <div className="employee-header">
//                     <div className="employee-icon">👔</div>
//                     <div>
//                       <h3>{employee.positionName}</h3>
//                       <p>{employee.departmentName}</p>
//                     </div>
//                   </div>
//                   <div className="employee-details">
//                     <div className="detail-row"><label>Salary</label><span>₹{employee.salary?.toLocaleString()}</span></div>
//                     <div className="detail-row"><label>Skills</label><span>{employee.skillSet}</span></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Tasks Tab */}
//         {activeNav === 'tasks' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>Assign New Task</h2></div>
//             <div className="task-form">
//               <div className="form-group">
//                 <label>Assign To (Employee/Consultant)</label>
//                 <select value={taskData.assignedToUserId} onChange={e => setTaskData({ ...taskData, assignedToUserId: parseInt(e.target.value) })}>
//                   <option value={0}>Select Employee/Consultant</option>
//                   {employees.map(emp => <option key={emp.employeeId} value={emp.employeeId}>{emp.positionName} (Employee)</option>)}
//                   {consultants.filter(c => c.currentStatus === 'ACTIVE').map(cons => <option key={cons.consultantId} value={cons.userId}>{cons.name} (Consultant)</option>)}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Task Description</label>
//                 <textarea rows={3} value={taskData.description} onChange={e => setTaskData({ ...taskData, description: e.target.value })} placeholder="Describe the task..." />
//               </div>
//               <div className="form-group">
//                 <label>Deadline</label>
//                 <input type="date" value={taskData.deadline} onChange={e => setTaskData({ ...taskData, deadline: e.target.value })} />
//               </div>
//               <button className="btn-primary btn-large" onClick={() => showConfirmation('Assign this task?', handleAssignTask)} disabled={actionLoading}>
//                 {actionLoading ? 'Assigning...' : '📋 Assign Task'}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Email Tab */}
//         {activeNav === 'email' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>Send Email to Anyone</h2>
//               <button className="btn-primary" onClick={() => { loadEmailRecipients(); setShowEmailModal(true); }}>✉️ Compose Email</button>
//             </div>
//             <div className="email-info">
//               <p>As Financial Director, you can send emails to:</p>
//               <ul>
//                 <li>✅ All Directors (Head, HR, Finance, BDE)</li>
//                 <li>✅ All Managers</li>
//                 <li>✅ All Employees</li>
//                 <li>✅ All Consultants</li>
//                 <li>✅ All Clients</li>
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* Profile Tab */}
//         {activeNav === 'profile' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>Profile Information</h2>
//               <button className="btn-outline" onClick={() => {
//                 setProfileData({
//                   name: user?.name || '',
//                   phoneNumber: user?.phoneNumber || '',
//                   address: user?.address || '',
//                   gender: user?.gender || '',
//                   dob: user?.dob?.split('T')[0] || '',
//                 });
//                 setShowProfileModal(true);
//               }}>✏️ Edit Profile</button>
//             </div>
//             <div className="profile-info">
//               <div className="profile-avatar-large">
//                 {user?.photoUrl ? <img src={user.photoUrl} alt={user.name} /> : <div className="avatar-placeholder">{user?.name?.charAt(0) || 'F'}</div>}
//               </div>
//               <div className="profile-details">
//                 <div className="detail-item"><label>Full Name</label><span>{user?.name}</span></div>
//                 <div className="detail-item"><label>Email</label><span>{user?.email}</span></div>
//                 <div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not provided'}</span></div>
//                 <div className="detail-item"><label>Address</label><span>{user?.address || 'Not provided'}</span></div>
//                 <div className="detail-item"><label>Gender</label><span>{user?.gender || 'Not provided'}</span></div>
//                 <div className="detail-item"><label>Role</label><span>Financial Director - Finance Department</span></div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Payment Detail Modal */}
//       {showPaymentModal && selectedPayment && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => { setShowPaymentModal(false); setSelectedPayment(null); }}>✕</button>
//             <h2>Payment Details</h2>
//             <p className="modal-sub">Transaction ID: {selectedPayment.transactionId}</p>
//             <div className="detail-grid">
//               <div><label>User Name</label><span>{selectedPayment.userName}</span></div>
//               <div><label>User Email</label><span>{selectedPayment.userEmail}</span></div>
//               <div><label>User Type</label><span>{selectedPayment.userType}</span></div>
//               <div><label>Type</label>{getPaymentTypeBadge(selectedPayment.type)}</div>
//               <div><label>Amount</label><span className={selectedPayment.type === 'CREDIT' ? 'text-success' : 'text-danger'}>₹{selectedPayment.amount.toLocaleString()}</span></div>
//               <div><label>Note</label><span>{selectedPayment.paymentNote}</span></div>
//               <div><label>Date & Time</label><span>{new Date(selectedPayment.dateTime).toLocaleString()}</span></div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Project Detail Modal */}
//       {showProjectModal && selectedProject && (
//         <div className="modal-mask open">
//           <div className="modal-box large">
//             <button className="m-close" onClick={() => { setShowProjectModal(false); setSelectedProject(null); }}>✕</button>
//             <h2>{selectedProject.projectName}</h2>
//             <div className="m-tabs">
//               <button className={`m-tab ${activeModalTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveModalTab('overview')}>Overview</button>
//               <button className={`m-tab ${activeModalTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveModalTab('teams')}>Teams</button>
//             </div>
//             {activeModalTab === 'overview' && (
//               <div className="m-tab-content">
//                 <div className="detail-grid">
//                   <div><label>Client</label><span>{selectedProject.clientName}</span></div>
//                   <div><label>Email</label><span>{selectedProject.clientEmail}</span></div>
//                   <div><label>Type</label><span>{selectedProject.projectType}</span></div>
//                   <div><label>Status</label>{getStatusBadge(selectedProject.status)}</div>
//                   <div><label>Manager</label><span>{selectedProject.assignedManagerName || 'Not assigned'}</span></div>
//                   <div><label>Deadline</label><span>{selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : 'Not set'}</span></div>
//                 </div>
//                 <div className="description-box"><label>Description</label><p>{selectedProject.projectDescription}</p></div>
//               </div>
//             )}
//             {activeModalTab === 'teams' && (
//               <div className="m-tab-content">
//                 {projectTeams.length === 0 ? <div className="empty-state">No teams assigned yet</div> :
//                   projectTeams.map(team => (
//                     <div key={team.teamId} className="team-section">
//                       <h3>{team.teamName}</h3>
//                       <div className="team-manager">Manager: {team.managerName}</div>
//                       <div className="team-members">
//                         {team.members.map(member => (
//                           <div key={member.memberId} className="team-member">
//                             <div className="member-avatar">{member.memberName.charAt(0)}</div>
//                             <div><div className="member-name">{member.memberName}</div><div className="member-role">{member.role}</div></div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Assign Project Modal */}
//       {showAssignProjectModal && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => { setShowAssignProjectModal(false); setSelectedProject(null); setAssignProjectData({ managerId: 0, directorNote: '', deadline: '' }); }}>✕</button>
//             <h2>Assign Project to Manager</h2>
//             <p>{selectedProject?.projectName}</p>
//             <div className="m-form">
//               <select value={assignProjectData.managerId} onChange={e => setAssignProjectData({ ...assignProjectData, managerId: parseInt(e.target.value) })}>
//                 <option value={0}>Select Manager</option>
//                 {employees.filter(e => e.positionName?.includes('Manager')).map(emp => (
//                   <option key={emp.employeeId} value={emp.employeeId}>{emp.positionName}</option>
//                 ))}
//               </select>
//               <input type="date" value={assignProjectData.deadline} onChange={e => setAssignProjectData({ ...assignProjectData, deadline: e.target.value })} />
//               <textarea rows={3} placeholder="Director Note" value={assignProjectData.directorNote} onChange={e => setAssignProjectData({ ...assignProjectData, directorNote: e.target.value })} />
//               <button className="btn-msub" onClick={() => showConfirmation(`Assign ${selectedProject?.projectName} to selected manager?`, () => selectedProject && handleAssignProject(selectedProject.projectId))} disabled={actionLoading}>
//                 {actionLoading ? 'Assigning...' : 'Assign Project'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Assign Task Modal */}
//       {showAssignTaskModal && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => { setShowAssignTaskModal(false); setTaskData({ assignedToUserId: 0, description: '', deadline: '' }); }}>✕</button>
//             <h2>Assign Task</h2>
//             <div className="m-form">
//               <select value={taskData.assignedToUserId} onChange={e => setTaskData({ ...taskData, assignedToUserId: parseInt(e.target.value) })}>
//                 <option value={0}>Select Employee/Consultant</option>
//                 {employees.map(emp => <option key={emp.employeeId} value={emp.employeeId}>{emp.positionName}</option>)}
//                 {consultants.map(cons => <option key={cons.consultantId} value={cons.userId}>{cons.name} (Consultant)</option>)}
//               </select>
//               <textarea rows={3} placeholder="Task Description" value={taskData.description} onChange={e => setTaskData({ ...taskData, description: e.target.value })} />
//               <input type="date" value={taskData.deadline} onChange={e => setTaskData({ ...taskData, deadline: e.target.value })} />
//               <button className="btn-msub" onClick={() => showConfirmation('Assign this task?', handleAssignTask)} disabled={actionLoading}>
//                 {actionLoading ? 'Assigning...' : 'Assign Task'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Send Email Modal */}
//       {showEmailModal && (
//         <div className="modal-mask open">
//           <div className="modal-box large">
//             <button className="m-close" onClick={() => { setShowEmailModal(false); setEmailData({ userIds: [], subject: '', message: '', messageType: 'INFORMATION' }); }}>✕</button>
//             <h2>Send Email</h2>
//             <div className="m-form">
//               <select multiple size={5} value={emailData.userIds.map(String)} onChange={e => {
//                 const selected = Array.from(e.target.selectedOptions, opt => parseInt(opt.value));
//                 setEmailData({ ...emailData, userIds: selected });
//               }}>
//                 {emailRecipients.map(recipient => (
//                   <option key={recipient.userId} value={recipient.userId}>
//                     {recipient.name} - {recipient.email} ({recipient.role})
//                   </option>
//                 ))}
//               </select>
//               <p className="muted-text">Hold Ctrl/Cmd to select multiple recipients</p>
//               <input placeholder="Subject" value={emailData.subject} onChange={e => setEmailData({ ...emailData, subject: e.target.value })} />
//               <textarea rows={5} placeholder="Message" value={emailData.message} onChange={e => setEmailData({ ...emailData, message: e.target.value })} />
//               <select value={emailData.messageType} onChange={e => setEmailData({ ...emailData, messageType: e.target.value })}>
//                 <option value="INFORMATION">Information</option>
//                 <option value="IMPORTANT">Important</option>
//                 <option value="URGENT">Urgent</option>
//                 <option value="ALERT">Alert</option>
//               </select>
//               <button className="btn-msub" onClick={() => showConfirmation(`Send email to ${emailData.userIds.length} recipient(s)?`, handleSendEmail)} disabled={actionLoading}>
//                 {actionLoading ? 'Sending...' : '✉️ Send Email'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Profile Modal */}
//       {showProfileModal && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => setShowProfileModal(false)}>✕</button>
//             <h2>Edit Profile</h2>
//             <div className="m-form">
//               <input placeholder="Full Name" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
//               <input placeholder="Phone Number" value={profileData.phoneNumber} onChange={e => setProfileData({ ...profileData, phoneNumber: e.target.value })} />
//               <textarea placeholder="Address" rows={2} value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })} />
//               <select value={profileData.gender} onChange={e => setProfileData({ ...profileData, gender: e.target.value })}>
//                 <option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
//               </select>
//               <input type="date" value={profileData.dob} onChange={e => setProfileData({ ...profileData, dob: e.target.value })} />
//               <button className="btn-msub" onClick={() => showConfirmation('Save profile changes?', handleUpdateProfile)} disabled={actionLoading}>
//                 {actionLoading ? 'Saving...' : 'Save Changes'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FinancialDirectorDashboard;