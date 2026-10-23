//@ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommonSidebar from './components/CommonSidebar';
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
  cost?: string;
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

interface FileItem {
  fileId: number;
  fileType: string;
  fileLink: string;
  uploaderId: number;
  uploaderName: string;
  uploadTime: string;
  departmentId: number;
  departmentName: string;
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

const getDashboardStats = async () => {
  return apiCall<{ success: boolean; message: string; data: DashboardStats }>('GET', '/api/core-director/dashboard/stats');
};

const getConsultants = async () => {
  return apiCall<{ success: boolean; message: string; data: Consultant[] }>('GET', '/api/core-director/consultants');
};

const getConsultantStatusHistory = async (id: number) => {
  return apiCall<{ success: boolean; message: string; data: StatusHistory[] }>('GET', `/api/core-director/consultants/${id}/status-history`);
};

const updateConsultantStatus = async (id: number, status: string, note: string) => {
  return apiCall<{ success: boolean; message: string; data: any }>('PUT', `/api/core-director/consultants/${id}/status`, { status, note });
};

// UPDATED: Convert to Employee API - Only positionName, salary, skillSet (No departmentId)
const convertToEmployee = async (id: number, positionName: string, salary: number, skillSet: string) => {
  return apiCall<{ success: boolean; message: string; data: null }>('POST', `/api/core-director/consultants/${id}/convert-to-employee`, { positionName, salary, skillSet });
};

const getEmployees = async () => {
  return apiCall<{ success: boolean; message: string; data: Employee[] }>('GET', '/api/core-director/employees');
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

const reassignProjectToManager = async (projectId: number, managerId: number, directorNote: string, deadline: string) => {
  return apiCall<{ success: boolean; message: string; data: any }>('PUT', `/api/core-director/projects/${projectId}/reassign`, { managerId, directorNote, deadline });
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

const assignTask = async (assignedToUserId: number, description: string, deadline: string) => {
  return apiCall<{ success: boolean; message: string; data: Task }>('POST', '/api/core-director/tasks/assign', { assignedToUserId, description, deadline });
};

const getTasks = async () => {
  return apiCall<{ success: boolean; message: string; data: Task[] }>('GET', '/api/core-director/tasks');
};

const updateTaskStatus = async (taskId: number, status: string) => {
  return apiCall<{ success: boolean; message: string; data: any }>('PUT', `/api/core-director/tasks/${taskId}/status?status=${status}`);
};

const getUserProfile = async () => {
  return apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
};

// ============================================
// AI API FUNCTIONS
// ============================================

const aiSuggestProject = async (projectName: string, projectDescription: string, projectType: string) => {
  return apiCall<{ success: boolean; message: string; data: { text: string } }>('POST', '/api/ai/suggest-new-project', { projectName, projectDescription, projectType });
};

const aiAnalyzeProject = async (projectId: number) => {
  return apiCall<{ success: boolean; message: string; data: { text: string } }>('GET', `/api/ai/analyze-project/${projectId}`);
};

// ============================================
// FILE API FUNCTIONS
// ============================================

const getProjectFiles = async (projectId: number) => {
  return apiCall<{ success: boolean; message: string; data: FileItem[] }>('GET', `/api/file/project/${projectId}`);
};

const uploadFile = async (projectId: number, file: File, fileType: string) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiCall('POST', `/api/file/upload/${projectId}?fileType=${fileType}`, formData, true);
};

const deleteFile = async (fileId: number) => {
  return apiCall('DELETE', `/api/file/delete/${fileId}`);
};

const getAccessToken = async (fileId: number) => {
  return apiCall('POST', `/api/file/access-token/${fileId}`, {});
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
  APPLIED: { label: 'Applied', class: 'status-pending', icon: '📝', color: '#F59E0B' },
  DOCUMENT_VERIFIED: { label: 'Docs Verified', class: 'status-progress', icon: '✅', color: '#3B82F6' },
  INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', class: 'status-progress', icon: '📅', color: '#8B5CF6' },
  INTERVIEW_PASSED: { label: 'Interview Passed', class: 'status-approved', icon: '🎉', color: '#10B981' },
  INTERVIEW_FAILED: { label: 'Interview Failed', class: 'status-rejected', icon: '❌', color: '#EF4444' },
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
  const [departmentName, setDepartmentName] = useState<string>('Core Director');

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
  const [showReassignManagerModal, setShowReassignManagerModal] = useState(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [showTaskUpdateModal, setShowTaskUpdateModal] = useState(false);
  const [showAIAnalyzeModal, setShowAIAnalyzeModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('overview');

  // Form states
  const [consultantStatusData, setConsultantStatusData] = useState({ status: '', note: '' });
  const [convertEmployeeData, setConvertEmployeeData] = useState({ positionName: '', salary: 0, skillSet: '' });
  const [approveProjectData, setApproveProjectData] = useState({ status: 'APPROVED', note: '' });
  const [assignManagerData, setAssignManagerData] = useState({ managerId: 0, directorNote: '', deadline: '' });
  const [assignTaskData, setAssignTaskData] = useState({ assignedToUserId: 0, description: '', deadline: '' });
  const [updateTaskStatusData, setUpdateTaskStatusData] = useState({ status: '' });

  // AI states
  const [aiSuggestionInput, setAiSuggestionInput] = useState({ projectName: '', projectDescription: '', projectType: '' });
  const [aiSuggestionResult, setAiSuggestionResult] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // History, teams, and files data
  const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);
  const [projectTeams, setProjectTeams] = useState<Team[]>([]);
  const [projectFiles, setProjectFiles] = useState<FileItem[]>([]);
  const [consultantHistory, setConsultantHistory] = useState<StatusHistory[]>([]);

  // Filter states
  const [consultantSearch, setConsultantSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('all');

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
      
      // Get department name from first consultant
      if (consultantsRes.data && consultantsRes.data.length > 0 && consultantsRes.data[0].departmentName) {
        setDepartmentName(consultantsRes.data[0].departmentName);
      }
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
      if (showConsultantDetailModal) {
        const historyRes = await getConsultantStatusHistory(selectedConsultant.consultantId);
        setConsultantHistory(historyRes.data);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  // UPDATED: Convert to Employee Handler - Only positionName, salary, skillSet
  const handleConvertToEmployee = async () => {
    if (!selectedConsultant) return;
    if (!convertEmployeeData.positionName || !convertEmployeeData.salary) {
      alert('Please fill Position Name and Salary');
      return;
    }
    try {
      const result = await convertToEmployee(
        selectedConsultant.consultantId,
        convertEmployeeData.positionName,
        convertEmployeeData.salary,
        convertEmployeeData.skillSet
      );
      alert(result.message || 'Consultant converted to employee successfully');
      const [consultantsRes, employeesRes] = await Promise.all([
        getConsultants(),
        getEmployees(),
      ]);
      setConsultants(consultantsRes.data);
      setEmployees(employeesRes.data);
      setShowConvertToEmployeeModal(false);
      setConvertEmployeeData({ positionName: '', salary: 0, skillSet: '' });
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
      if (showProjectDetailModal && selectedProject.projectId) {
        await refreshProjectDetails(selectedProject.projectId);
      }
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
      if (showProjectDetailModal && selectedProject.projectId) {
        await refreshProjectDetails(selectedProject.projectId);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to assign manager');
    }
  };

  const handleReassignManager = async () => {
    if (!selectedProject) return;
    if (!assignManagerData.managerId || !assignManagerData.deadline) {
      alert('Please select a manager and set a deadline');
      return;
    }
    try {
      await reassignProjectToManager(
        selectedProject.projectId,
        assignManagerData.managerId,
        assignManagerData.directorNote,
        assignManagerData.deadline
      );
      alert('Project reassigned to manager successfully');
      const projectsRes = await getProjects();
      setProjects(projectsRes.data);
      setShowReassignManagerModal(false);
      setAssignManagerData({ managerId: 0, directorNote: '', deadline: '' });
      if (showProjectDetailModal && selectedProject.projectId) {
        await refreshProjectDetails(selectedProject.projectId);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to reassign manager');
    }
  };

  const handleAssignTask = async () => {
    if (!assignTaskData.assignedToUserId || !assignTaskData.description || !assignTaskData.deadline) {
      alert('Please fill all fields');
      return;
    }
    try {
      await assignTask(assignTaskData.assignedToUserId, assignTaskData.description, assignTaskData.deadline);
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
      setAiSuggestionResult(res.data.text);
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
      setAiAnalysisResult(res.data.text);
      setShowAIAnalyzeModal(true);
    } catch (error: any) {
      alert(error.message || 'Failed to analyze project');
    } finally {
      setAiLoading(false);
    }
  };

  const handleViewConsultantDetails = async (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setActiveModalTab('overview');
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

  const handleFileView = async (fileId: number) => {
    try {
      const tokenRes: any = await getAccessToken(fileId);
      if (tokenRes.success && tokenRes.data) {
        window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
      } else {
        alert('Cannot view file');
      }
    } catch (error) {
      alert('Cannot view file');
    }
  };

  const handleFileUpload = async (projectId: number, file: File, fileType: string) => {
    setUploadingFile(true);
    try {
      await uploadFile(projectId, file, fileType);
      alert('File uploaded successfully');
      await refreshProjectDetails(projectId);
    } catch (error: any) {
      alert(error.message || 'Upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteFile = async (fileId: number, projectId: number) => {
    if (!confirm('Delete this file?')) return;
    try {
      await deleteFile(fileId);
      alert('File deleted successfully');
      await refreshProjectDetails(projectId);
    } catch (error: any) {
      alert(error.message || 'Delete failed');
    }
  };

  const refreshProjectDetails = async (projectId: number) => {
    try {
      const [historyRes, teamsRes, filesRes] = await Promise.all([
        getProjectHistory(projectId).catch(() => ({ data: [] })),
        getProjectTeams(projectId).catch(() => ({ data: [] })),
        getProjectFiles(projectId).catch(() => ({ data: [] })),
      ]);
      setProjectHistory(historyRes.data);
      setProjectTeams(teamsRes.data);
      setProjectFiles(filesRes.data);
    } catch (error) {
      console.error('Error refreshing project details:', error);
    }
  };

  const handleViewProjectDetails = async (project: Project) => {
    setSelectedProject(project);
    setActiveModalTab('overview');
    try {
      const [historyRes, teamsRes, filesRes] = await Promise.all([
        getProjectHistory(project.projectId).catch(() => ({ data: [] })),
        getProjectTeams(project.projectId).catch(() => ({ data: [] })),
        getProjectFiles(project.projectId).catch(() => ({ data: [] })),
      ]);
      setProjectHistory(historyRes.data);
      setProjectTeams(teamsRes.data);
      setProjectFiles(filesRes.data);
      setShowProjectDetailModal(true);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setShowProjectDetailModal(true);
    }
  };

  const filteredConsultants = consultants.filter(c =>
    c.name.toLowerCase().includes(consultantSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(consultantSearch.toLowerCase()) ||
    c.skill.toLowerCase().includes(consultantSearch.toLowerCase())
  );

  const filteredProjects = projects.filter(p => {
    if (projectStatusFilter !== 'all' && p.status !== projectStatusFilter) return false;
    return p.projectName.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.departmentName.toLowerCase().includes(projectSearch.toLowerCase());
  });

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();
  const formatRelativeTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getConsultantStatusBranch = (status: string): string => {
    const branchMap: Record<string, string> = {
      'APPLIED': 'application',
      'DOCUMENT_VERIFIED': 'document-verification',
      'INTERVIEW_SCHEDULED': 'interview',
      'INTERVIEW_PASSED': 'interview-result',
      'INTERVIEW_FAILED': 'interview-result',
      'APPROVED': 'approval',
      'REJECTED': 'rejection',
      'ACTIVE': 'active',
      'INACTIVE': 'inactive',
    };
    return branchMap[status] || 'status-update';
  };

  const getConsultantStatusIcon = (status: string): string => {
    const iconMap: Record<string, string> = {
      'APPLIED': '📝',
      'DOCUMENT_VERIFIED': '✅',
      'INTERVIEW_SCHEDULED': '📅',
      'INTERVIEW_PASSED': '🎉',
      'INTERVIEW_FAILED': '❌',
      'APPROVED': '✔️',
      'REJECTED': '🔴',
      'ACTIVE': '🟢',
      'INACTIVE': '⚪',
    };
    return iconMap[status] || '🔄';
  };

  const getConsultantStatusMessage = (status: string): string => {
    const messageMap: Record<string, string> = {
      'APPLIED': 'Application submitted',
      'DOCUMENT_VERIFIED': 'Documents verified',
      'INTERVIEW_SCHEDULED': 'Interview scheduled',
      'INTERVIEW_PASSED': 'Interview passed',
      'INTERVIEW_FAILED': 'Interview failed',
      'APPROVED': 'Consultant approved',
      'REJECTED': 'Application rejected',
      'ACTIVE': 'Status changed to Active',
      'INACTIVE': 'Status changed to Inactive',
    };
    return messageMap[status] || `Status updated to ${status.replace('_', ' ')}`;
  };

  const getCommitHash = (statusId: any, index: number): string => {
    if (!statusId) {
      return `COMMIT-${String(index + 1).padStart(2, '0')}`;
    }
    const idString = String(statusId);
    if (idString.length > 8) {
      return idString.slice(-8);
    }
    return idString.padStart(8, '0');
  };

  const getStatusBranch = (status: string): string => {
    switch(status) {
      case 'PENDING': return 'main ⚡';
      case 'IN_PROGRESS': return 'feature/in-progress';
      case 'APPROVED': return 'release/approved';
      case 'REJECTED': return 'hotfix/rejected';
      case 'COMPLETED': return 'main ✔️';
      default: return 'develop';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch(status) {
      case 'PENDING': return '⏳';
      case 'IN_PROGRESS': return '🔄';
      case 'APPROVED': return '✅';
      case 'REJECTED': return '❌';
      case 'COMPLETED': return '🎉';
      default: return '📌';
    }
  };

  const getStatusMessage = (status: string): string => {
    switch(status) {
      case 'PENDING': return 'Pending approval';
      case 'IN_PROGRESS': return 'Work in progress';
      case 'APPROVED': return 'Changes approved';
      case 'REJECTED': return 'Changes rejected';
      case 'COMPLETED': return 'Task completed';
      default: return 'Status updated';
    }
  };

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
      <CommonSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onLogout={handleLogout}
        onThemeToggle={toggleDarkMode}
        darkMode={darkMode}
        user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null}
        menuItems={menuItems}
        title="Core Director"
        logoIcon="🎯"
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>☰</button>

      <main className="client-main">
        <header className="client-header">
          <div className="header-welcome">
            <h1>Welcome, Director {user?.name?.split(' ')[0] || ''}!</h1>
            <p>{departmentName}</p>
          </div>
          <div className="header-stats">
            <div className="header-stat-item"><span className="stat-label">Total Projects</span><span className="stat-value-sm">{stats?.totalProjects || 0}</span></div>
            <div className="header-stat-item"><span className="stat-label">Pending Projects</span><span className="stat-value-sm">{stats?.pendingProjects || 0}</span></div>
            <div className="header-stat-item"><span className="stat-label">Consultants</span><span className="stat-value-sm">{stats?.totalConsultants || 0}</span></div>
          </div>
        </header>

        {/* DASHBOARD TAB */}
        {activeNav === 'dashboard' && stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-icon blue">📊</div><div className="stat-info"><span className="stat-value">{stats.totalProjects}</span><span className="stat-label">Total Projects</span></div></div>
              <div className="stat-card"><div className="stat-icon orange">⏳</div><div className="stat-info"><span className="stat-value">{stats.pendingProjects}</span><span className="stat-label">Pending Projects</span></div></div>
              <div className="stat-card"><div className="stat-icon purple">🔄</div><div className="stat-info"><span className="stat-value">{stats.inProgressProjects}</span><span className="stat-label">In Progress</span></div></div>
              <div className="stat-card"><div className="stat-icon green">✅</div><div className="stat-info"><span className="stat-value">{stats.completedProjects}</span><span className="stat-label">Completed</span></div></div>
              <div className="stat-card"><div className="stat-icon teal">👨‍💻</div><div className="stat-info"><span className="stat-value">{stats.totalConsultants}</span><span className="stat-label">Consultants</span></div></div>
              <div className="stat-card"><div className="stat-icon indigo">👥</div><div className="stat-info"><span className="stat-value">{stats.totalEmployees}</span><span className="stat-label">Employees</span></div></div>
              <div className="stat-card"><div className="stat-icon pink">🏢</div><div className="stat-info"><span className="stat-value">{stats.totalTeams}</span><span className="stat-label">Teams</span></div></div>
              <div className="stat-card"><div className="stat-icon red">📋</div><div className="stat-info"><span className="stat-value">{stats.totalTasks}</span><span className="stat-label">Total Tasks</span><span style={{ fontSize: '0.65rem', display: 'block' }}>{stats.pendingTasks} pending</span></div></div>
            </div>

            <div className="dashboard-card">
              <div className="card-header"><h2>📋 Recent Projects</h2><button className="view-all-link" onClick={() => setActiveNav('projects')}>View All →</button></div>
              <div className="projects-grid">
                {projects.slice(0, 4).map(project => (
                  <div key={project.projectId} className="project-card">
                    <div className="project-card-header"><h3>{project.projectName}</h3>{getStatusBadge(project.status)}</div>
                    <p className="project-card-desc">{project.projectDescription?.substring(0, 80) || 'No description'}</p>
                    <div className="project-card-meta"><span>🏢 {project.departmentName}</span>{project.assignedManagerName && <span>👔 {project.assignedManagerName}</span>}{project.deadline && <span>📅 Due: {new Date(project.deadline).toLocaleDateString()}</span>}</div>
                    <div className="project-card-actions">
                      <button className="btn-sm btn-primary" onClick={() => handleViewProjectDetails(project)}>View Details</button>
                      <button className="btn-sm btn-outline" onClick={() => handleAIAnalyzeProject(project.projectId)}>🤖 AI Analyze</button>
                      {project.status === 'PENDING' && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowProjectApproveModal(true); }}>Approve/Reject</button>)}
                      {project.status === 'APPROVED' && !project.assignedManagerId && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowAssignManagerModal(true); }}>Assign Manager</button>)}
                      {project.status === 'APPROVED' && project.assignedManagerId && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowReassignManagerModal(true); }}>Reassign Manager</button>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header"><h2>⏳ Pending Approvals</h2><button className="view-all-link" onClick={() => setActiveNav('pending-projects')}>View All →</button></div>
              <div className="projects-grid">
                {pendingProjects.slice(0, 3).map(project => (
                  <div key={project.projectId} className="project-card pending">
                    <div className="project-card-header"><h3>{project.projectName}</h3><span className="status-badge status-pending">⏳ Pending Approval</span></div>
                    <p className="project-card-desc">{project.projectDescription?.substring(0, 80) || 'No description'}</p>
                    <div className="project-card-meta"><span>🏢 {project.departmentName}</span><span>📱 {project.projectType || 'N/A'}</span></div>
                    <div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => { setSelectedProject(project); setShowProjectApproveModal(true); }}>Review Project</button></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header"><h2>✅ Recent Tasks</h2><button className="view-all-link" onClick={() => setActiveNav('tasks')}>View All →</button></div>
              <div className="tasks-list">
                {tasks.slice(0, 5).map(task => (
                  <div key={task.taskId} className="task-item">
                    <div className="task-icon">📋</div>
                    <div className="task-info"><div className="task-name">{task.description}</div><div className="task-meta"><span>Assigned to: {task.assignedToUserName}</span><span>Created by: {task.createdByName}</span>{task.deadline && <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>}</div></div>
                    <div className="task-status">{getStatusBadge(task.status)}</div>
                    <button className="btn-icon" onClick={() => { setSelectedTask(task); setShowTaskUpdateModal(true); }}>✏️</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* CONSULTANTS TAB */}
        {activeNav === 'consultants' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>👨‍💻 Consultant Management</h2><div><input type="text" placeholder="Search consultants..." className="search-input" value={consultantSearch} onChange={(e) => setConsultantSearch(e.target.value)} /></div></div>
            <div className="consultants-grid">
              {filteredConsultants.map(consultant => {
                const skills = consultant.skill?.split(',') || [];
                return (
                  <div key={consultant.consultantId} className="consultant-card">
                    <div className="consultant-header">
                      <div className={`consultant-avatar ${consultant.isApproved === 'APPROVED' ? 'verified' : 'pending'}`}>
                        {consultant.name.charAt(0)}
                      </div>
                      <div className="consultant-info">
                        <h3>{consultant.name}</h3>
                        <p>{consultant.email}</p>
                      </div>
                      {getStatusBadge(consultant.isApproved)}
                    </div>
                    <div className="consultant-details">
                      <div className="detail"><span className="detail-label">Skills:</span> {skills.slice(0, 3).join(', ')}{skills.length > 3 && ` +${skills.length - 3}`}</div>
                      <div className="detail"><span className="detail-label">Experience:</span> {consultant.experience}</div>
                      <div className="detail"><span className="detail-label">Department:</span> {consultant.departmentName || 'Not assigned'}</div>
                    </div>
                    <div className="consultant-actions">
                      <button className="btn-primary" onClick={() => handleViewConsultantDetails(consultant)}>View Details</button>
                      <button className="btn-outline" onClick={() => { setSelectedConsultant(consultant); setShowConsultantStatusModal(true); }}>Update Status</button>
                      <button className="btn-success" onClick={() => { setSelectedConsultant(consultant); setShowConvertToEmployeeModal(true); }}>Convert to Employee</button>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredConsultants.length === 0 && <div className="empty-state"><span className="empty-icon">👨‍💻</span><p>No consultants found</p></div>}
          </div>
        )}

        {/* EMPLOYEES TAB */}
        {activeNav === 'employees' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>👥 Employee Directory</h2><div className="user-stats-summary"><span>Total: {employees.length}</span></div></div>
            <div className="employees-table-container">
              <table className="data-table">
                <thead><tr><th>Employee</th><th>Position</th><th>Department</th><th>Salary</th><th>Skills</th><th>Status</th></tr></thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.employeeId}>
                      <td><div className="user-cell"><strong>{emp.name}</strong><small>{emp.email}</small></div></td>
                      <td>{emp.positionName}</td>
                      <td>{emp.departmentName}</td>
                      <td>₹{emp.salary?.toLocaleString()}</td>
                      <td className="skills-cell">{emp.skillSet?.substring(0, 50)}...</td>
                      <td>{emp.isDirectorVerified ? <span className="status-badge status-approved">✅ Verified</span> : <span className="status-badge status-pending">⏳ Pending</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {employees.length === 0 && <div className="empty-state"><span className="empty-icon">👥</span><p>No employees found</p></div>}
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeNav === 'projects' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>📁 All Projects</h2><div className="header-filters"><select className="filter-select" value={projectStatusFilter} onChange={(e) => setProjectStatusFilter(e.target.value)}><option value="all">All Status</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><input type="text" placeholder="Search projects..." className="search-input" value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} /></div></div>
            <div className="projects-grid">
              {filteredProjects.map(project => (
                <div key={project.projectId} className="project-card">
                  <div className="project-card-header"><h3>{project.projectName}</h3>{getStatusBadge(project.status)}</div>
                  <p className="project-card-desc">{project.projectDescription?.substring(0, 100) || 'No description'}</p>
                  <div className="project-card-meta"><span>🏢 {project.departmentName}</span><span>📱 {project.projectType || 'N/A'}</span>{project.clientName && <span>👤 {project.clientName}</span>}{project.assignedManagerName && <span>👔 {project.assignedManagerName}</span>}</div>
                  <div className="project-card-actions">
                    <button className="btn-sm btn-primary" onClick={() => handleViewProjectDetails(project)}>View Details</button>
                    <button className="btn-sm btn-outline" onClick={() => handleAIAnalyzeProject(project.projectId)}>🤖 AI Analyze</button>
                    {project.status === 'PENDING' && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowProjectApproveModal(true); }}>Approve/Reject</button>)}
                    {project.status === 'APPROVED' && !project.assignedManagerId && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowAssignManagerModal(true); }}>Assign Manager</button>)}
                    {project.status === 'APPROVED' && project.assignedManagerId && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowReassignManagerModal(true); }}>Reassign Manager</button>)}
                  </div>
                </div>
              ))}
            </div>
            {filteredProjects.length === 0 && <div className="empty-state"><span className="empty-icon">📁</span><p>No projects found</p></div>}
          </div>
        )}

        {/* PENDING PROJECTS TAB */}
        {activeNav === 'pending-projects' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>⏳ Projects Pending Approval</h2><span className="badge badge-orange">{pendingProjects.length} Pending Approvals</span></div>
            <div className="pending-projects-list">
              {pendingProjects.map(project => (
                <div key={project.projectId} className="pending-project-card">
                  <div className="pending-project-info">
                    <h3>{project.projectName}</h3>
                    <p>{project.projectDescription?.substring(0, 150) || 'No description'}</p>
                    <div className="meta-row"><span>🏢 {project.departmentName}</span><span>📱 {project.projectType || 'N/A'}</span>{project.clientName && <span>👤 {project.clientName}</span>}{project.createdAt && <span>📅 Created: {new Date(project.createdAt).toLocaleDateString()}</span>}</div>
                  </div>
                  <div className="pending-project-actions">
                    <button className="btn-success" onClick={() => { setSelectedProject(project); setApproveProjectData({ status: 'APPROVED', note: '' }); setShowProjectApproveModal(true); }}>✅ Approve</button>
                    <button className="btn-danger" onClick={() => { setSelectedProject(project); setApproveProjectData({ status: 'REJECTED', note: '' }); setShowProjectApproveModal(true); }}>❌ Reject</button>
                    <button className="btn-outline" onClick={() => handleViewProjectDetails(project)}>📋 View Details</button>
                  </div>
                </div>
              ))}
              {pendingProjects.length === 0 && <div className="empty-state"><span className="empty-icon">✅</span><p>No pending approvals</p></div>}
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {activeNav === 'tasks' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>✅ Task Management</h2><button className="btn-primary" onClick={() => setShowAssignTaskModal(true)}>+ Assign New Task</button></div>
            <div className="tasks-table-container">
              <table className="data-table">
                <thead><tr><th>Task</th><th>Assigned To</th><th>Created By</th><th>Deadline</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task.taskId}>
                      <td className="task-desc-cell">{task.description}</td>
                      <td>{task.assignedToUserName}</td>
                      <td>{task.createdByName}</td>
                      <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</td>
                      <td>{getStatusBadge(task.status)}</td>
                      <td><button className="btn-icon" onClick={() => { setSelectedTask(task); setShowTaskUpdateModal(true); }}>✏️ Update</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tasks.length === 0 && <div className="empty-state"><span className="empty-icon">✅</span><p>No tasks found</p></div>}
          </div>
        )}

        {/* AI ASSISTANT TAB */}
        {activeNav === 'ai-assistant' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>🤖 AI Assistant for Project Management</h2><span className="badge badge-blue">Powered by AI</span></div>
            <div className="ai-assistant-container">
              {!aiSuggestionResult ? (
                <div className="ai-suggest-form">
                  <div className="form-group"><label>Project Name</label><input type="text" placeholder="e.g., E-commerce Platform Development" value={aiSuggestionInput.projectName} onChange={(e) => setAiSuggestionInput({ ...aiSuggestionInput, projectName: e.target.value })} /></div>
                  <div className="form-group"><label>Project Description</label><textarea rows={4} placeholder="Describe the project goals, requirements, and expectations..." value={aiSuggestionInput.projectDescription} onChange={(e) => setAiSuggestionInput({ ...aiSuggestionInput, projectDescription: e.target.value })} /></div>
                  <div className="form-group"><label>Project Type</label><select value={aiSuggestionInput.projectType} onChange={(e) => setAiSuggestionInput({ ...aiSuggestionInput, projectType: e.target.value })}><option value="">Select Type</option><option value="Web Development">Web Development</option><option value="Mobile App">Mobile App</option><option value="AI/ML">AI/ML</option><option value="Cloud Migration">Cloud Migration</option><option value="DevOps">DevOps</option><option value="Data Analytics">Data Analytics</option></select></div>
                  <button className="btn-primary btn-large" onClick={handleAISuggestProject} disabled={aiLoading}>{aiLoading ? <><span className="loading-spinner-small"></span> Analyzing...</> : '✨ Get AI Suggestions'}</button>
                </div>
              ) : (
                <div className="ai-suggestions-content">
                  <button className="btn-outline" onClick={() => setAiSuggestionResult(null)} style={{ alignSelf: 'flex-start' }}>← New Project</button>
                  <div className="ai-section"><div className="ai-suggestion-text">{aiSuggestionResult}</div></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeNav === 'profile' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>⚙️ Profile Settings</h2><button className="btn-outline" onClick={() => alert('Profile edit coming soon')}>Edit Profile</button></div>
            <div className="profile-info"><div className="profile-avatar-large">{user?.photoUrl ? <img src={user.photoUrl} alt={user.name} /> : <div className="avatar-placeholder">{user?.name?.charAt(0) || 'D'}</div>}</div><div className="profile-details"><div className="detail-item"><label>Name</label><span>{user?.name}</span></div><div className="detail-item"><label>Email</label><span>{user?.email}</span></div><div className="detail-item"><label>Role</label><span>Core Director</span></div><div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not provided'}</span></div><div className="detail-item"><label>Address</label><span>{user?.address || 'Not provided'}</span></div></div></div>
          </div>
        )}

        <footer className="client-footer"><p>© 2026 Core Director Dashboard | Enterprise Management System</p></footer>
      </main>

      {/* CONSULTANT DETAIL MODAL */}
      {showConsultantDetailModal && selectedConsultant && (
        <div className="modal-mask open">
          <div className="modal-box large">
            <button className="m-close" onClick={() => setShowConsultantDetailModal(false)}>✕</button>
            <h2>{selectedConsultant.name}</h2>
            <p className="modal-sub">{selectedConsultant.email}</p>
            <div className="m-tabs">
              <button className={`m-tab ${activeModalTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveModalTab('overview')}>📋 Overview</button>
              <button className={`m-tab ${activeModalTab === 'history' ? 'active' : ''}`} onClick={() => setActiveModalTab('history')}>📜 Status History</button>
            </div>
            {activeModalTab === 'overview' && (
              <div className="m-tab-content">
                <div className="details-grid">
                  <div className="detail-item"><label>Department</label><span>{selectedConsultant.departmentName}</span></div>
                  <div className="detail-item"><label>Status</label>{getStatusBadge(selectedConsultant.isApproved)}</div>
                  <div className="detail-item"><label>Skills</label><span>{selectedConsultant.skill}</span></div>
                  <div className="detail-item"><label>Experience</label><span>{selectedConsultant.experience}</span></div>
                </div>
                <div className="modal-actions">
                  <button className="btn-outline" onClick={() => { setShowConsultantDetailModal(false); setShowConsultantStatusModal(true); }}>📝 Update Status</button>
                  <button className="btn-success" onClick={() => { setShowConsultantDetailModal(false); setShowConvertToEmployeeModal(true); }}>🔄 Convert to Employee</button>
                </div>
              </div>
            )}
            {activeModalTab === 'history' && (
              <div className="m-tab-content">
                {consultantHistory.length === 0 ? (
                  <div className="empty-state"><span className="empty-icon">📜</span><p>No status history available</p></div>
                ) : (
                  <div className="vscode-timeline">
                    {[...consultantHistory].reverse().map((entry, index) => (
                      <div key={entry.statusId || index} className={`timeline-entry ${index === 0 ? 'latest' : ''}`}>
                        <div className="timeline-line"><div className="timeline-connector"><div className="timeline-dot" style={{ backgroundColor: statusConfig[entry.status]?.color || '#6B7280' }}></div>{index < consultantHistory.length - 1 && <div className="timeline-vertical-line"></div>}</div></div>
                        <div className="timeline-content">
                          <div className="commit-header">
                            <div className="commit-hash"><span className="hash-text">#{entry.statusId?.toString().slice(-6) || `ST-${index + 1}`}</span></div>
                            <div className="commit-branch"><span className="branch-name">{getConsultantStatusBranch(entry.status)}</span></div>
                            <div className="commit-date"><span className="date-text">{formatRelativeTime(entry.dateTime)}</span></div>
                          </div>
                          <div className="commit-message">
                            <div className="commit-title">{getConsultantStatusIcon(entry.status)} {getConsultantStatusMessage(entry.status)}</div>
                            {entry.note && <div className="commit-description"><span className="description-text">{entry.note}</span></div>}
                          </div>
                          <div className="commit-meta"><div className="meta-author"><span className="author-name">System</span></div></div>
                          <div className="commit-stats"><span className="stat-badge"><span className="stat-text">{formatRelativeTime(entry.dateTime)}</span></span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPDATE CONSULTANT STATUS MODAL */}
      {showConsultantStatusModal && selectedConsultant && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowConsultantStatusModal(false)}>✕</button>
            <h2>Update Status</h2>
            <p>Consultant: <strong>{selectedConsultant.name}</strong></p>
            <div className="m-form">
              <div className="form-group"><label>Select Status</label><select value={consultantStatusData.status} onChange={(e) => setConsultantStatusData({ ...consultantStatusData, status: e.target.value })}><option value="">Select Status</option><option value="APPLIED">📝 Applied</option><option value="DOCUMENT_VERIFIED">✅ Document Verified</option><option value="INTERVIEW_SCHEDULED">📅 Interview Scheduled</option><option value="INTERVIEW_PASSED">🎉 Interview Passed</option><option value="INTERVIEW_FAILED">❌ Interview Failed</option><option value="APPROVED">✅ Approved</option><option value="REJECTED">❌ Rejected</option><option value="ACTIVE">🟢 Active</option><option value="INACTIVE">⚪ Inactive</option></select></div>
              <div className="form-group"><label>Note (Optional)</label><textarea rows={3} placeholder="Add a note about this status change..." value={consultantStatusData.note} onChange={(e) => setConsultantStatusData({ ...consultantStatusData, note: e.target.value })} /></div>
              <button className="btn-primary" onClick={handleUpdateConsultantStatus}>Update Status</button>
            </div>
          </div>
        </div>
      )}

      {/* CONVERT TO EMPLOYEE MODAL - UPDATED: No Department ID, Only 3 fields */}
      {showConvertToEmployeeModal && selectedConsultant && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowConvertToEmployeeModal(false)}>✕</button>
            <h2>Convert to Employee</h2>
            <p>Converting: <strong>{selectedConsultant.name}</strong></p>
            <div className="m-form">
              <div className="form-group">
                <label>Position Name *</label>
                <input type="text" placeholder="e.g., Senior Technical Manager" value={convertEmployeeData.positionName} onChange={(e) => setConvertEmployeeData({ ...convertEmployeeData, positionName: e.target.value })} />
                <small className="form-hint">Example: Senior Software Engineer, Technical Manager, Team Lead</small>
              </div>
              <div className="form-group">
                <label>Salary (per month) *</label>
                <input type="number" placeholder="e.g., 85000" value={convertEmployeeData.salary || ''} onChange={(e) => setConvertEmployeeData({ ...convertEmployeeData, salary: parseInt(e.target.value) || 0 })} />
                <small className="form-hint">Minimum recommended: ₹25,000</small>
              </div>
              <div className="form-group">
                <label>Skill Set (Optional)</label>
                <input type="text" placeholder="e.g., Java, Spring Boot, Microservices, Team Leadership" value={convertEmployeeData.skillSet} onChange={(e) => setConvertEmployeeData({ ...convertEmployeeData, skillSet: e.target.value })} />
                <small className="form-hint">Comma separated skills</small>
              </div>
              <button className="btn-primary" onClick={handleConvertToEmployee}>Convert to Employee</button>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT APPROVAL MODAL */}
      {showProjectApproveModal && selectedProject && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowProjectApproveModal(false)}>✕</button>
            <h2>Review Project</h2>
            <p><strong>{selectedProject.projectName}</strong></p>
            <div className="m-form">
              <div className="form-group"><label>Decision</label><select value={approveProjectData.status} onChange={(e) => setApproveProjectData({ ...approveProjectData, status: e.target.value })}><option value="APPROVED">✅ Approve Project</option><option value="REJECTED">❌ Reject Project</option></select></div>
              <div className="form-group"><label>Director's Note</label><textarea rows={3} placeholder="Add your review notes..." value={approveProjectData.note} onChange={(e) => setApproveProjectData({ ...approveProjectData, note: e.target.value })} /></div>
              <button className="btn-primary" onClick={handleApproveProject}>Submit Decision</button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN MANAGER MODAL */}
      {showAssignManagerModal && selectedProject && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowAssignManagerModal(false)}>✕</button>
            <h2>Assign Project Manager</h2>
            <p>Project: <strong>{selectedProject.projectName}</strong></p>
            <div className="m-form">
              <div className="form-group"><label>Select Manager</label><select value={assignManagerData.managerId} onChange={(e) => setAssignManagerData({ ...assignManagerData, managerId: parseInt(e.target.value) })}><option value="0">Select a Manager</option>{employees.filter(e => e.positionName?.toLowerCase().includes('manager')).map(emp => (<option key={emp.userId} value={emp.userId}>{emp.name} - {emp.positionName}</option>))}</select></div>
              <div className="form-group"><label>Deadline</label><input type="datetime-local" value={assignManagerData.deadline} onChange={(e) => setAssignManagerData({ ...assignManagerData, deadline: e.target.value })} /></div>
              <div className="form-group"><label>Director Note (Optional)</label><textarea rows={2} placeholder="Additional instructions for the manager..." value={assignManagerData.directorNote} onChange={(e) => setAssignManagerData({ ...assignManagerData, directorNote: e.target.value })} /></div>
              <button className="btn-primary" onClick={handleAssignManager}>Assign Manager</button>
            </div>
          </div>
        </div>
      )}

      {/* REASSIGN MANAGER MODAL */}
      {showReassignManagerModal && selectedProject && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowReassignManagerModal(false)}>✕</button>
            <h2>Reassign Project Manager</h2>
            <p>Project: <strong>{selectedProject.projectName}</strong></p>
            <p>Current Manager: <strong>{selectedProject.assignedManagerName || 'None'}</strong></p>
            <div className="m-form">
              <div className="form-group"><label>Select New Manager</label><select value={assignManagerData.managerId} onChange={(e) => setAssignManagerData({ ...assignManagerData, managerId: parseInt(e.target.value) })}><option value="0">Select a Manager</option>{employees.filter(e => e.positionName?.toLowerCase().includes('manager')).map(emp => (<option key={emp.userId} value={emp.userId}>{emp.name} - {emp.positionName}</option>))}</select></div>
              <div className="form-group"><label>New Deadline</label><input type="datetime-local" value={assignManagerData.deadline} onChange={(e) => setAssignManagerData({ ...assignManagerData, deadline: e.target.value })} /></div>
              <div className="form-group"><label>Director Note (Optional)</label><textarea rows={2} placeholder="Reason for reassignment and instructions..." value={assignManagerData.directorNote} onChange={(e) => setAssignManagerData({ ...assignManagerData, directorNote: e.target.value })} /></div>
              <button className="btn-primary" onClick={handleReassignManager}>Reassign Manager</button>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT DETAIL MODAL */}
      {showProjectDetailModal && selectedProject && (
        <div className="modal-mask open">
          <div className="modal-box large">
            <button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button>
            <h2>{selectedProject.projectName}</h2>
            {selectedProject.cost && <p className="modal-sub">💰 {selectedProject.cost}</p>}
            <div className="m-tabs">
              <button className={`m-tab ${activeModalTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveModalTab('overview')}>📋 Overview</button>
              <button className={`m-tab ${activeModalTab === 'history' ? 'active' : ''}`} onClick={() => setActiveModalTab('history')}>📜 History</button>
              <button className={`m-tab ${activeModalTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveModalTab('teams')}>👥 Teams</button>
              <button className={`m-tab ${activeModalTab === 'files' ? 'active' : ''}`} onClick={() => setActiveModalTab('files')}>📎 Files</button>
              <button className={`m-tab ${activeModalTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveModalTab('ai')}>🤖 AI Analysis</button>
            </div>

            {activeModalTab === 'overview' && (
              <div className="m-tab-content">
                <div className="details-grid">
                  <div className="detail-item"><label>Status</label>{getStatusBadge(selectedProject.status)}</div>
                  <div className="detail-item"><label>Type</label><span>{selectedProject.projectType || 'N/A'}</span></div>
                  <div className="detail-item"><label>Department</label><span>{selectedProject.departmentName}</span></div>
                  <div className="detail-item"><label>Client</label><span>{selectedProject.clientName || 'N/A'}</span></div>
                  <div className="detail-item"><label>Manager</label><span>{selectedProject.assignedManagerName || 'Not assigned'}</span></div>
                  <div className="detail-item"><label>Deadline</label><span>{selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : 'Not set'}</span></div>
                </div>
                <div className="detail-row full-width"><label>Description</label><p>{selectedProject.projectDescription || 'No description'}</p></div>
                {selectedProject.directorNote && <div className="detail-row full-width"><label>Director Note</label><p>{selectedProject.directorNote}</p></div>}
                <div className="modal-actions">
                  {selectedProject.status === 'APPROVED' && !selectedProject.assignedManagerId && (<button className="btn-primary" onClick={() => { setShowProjectDetailModal(false); setShowAssignManagerModal(true); }}>Assign Manager</button>)}
                  {selectedProject.status === 'APPROVED' && selectedProject.assignedManagerId && (<button className="btn-primary" onClick={() => { setShowProjectDetailModal(false); setShowReassignManagerModal(true); }}>Reassign Manager</button>)}
                  <button className="btn-outline" onClick={() => handleAIAnalyzeProject(selectedProject.projectId)}>🤖 Run AI Analysis</button>
                </div>
              </div>
            )}

            {activeModalTab === 'history' && (
              <div className="m-tab-content">
                {projectHistory.length === 0 ? (
                  <div className="empty-state"><span className="empty-icon">📜</span><p>No history records found</p></div>
                ) : (
                  <div className="vscode-timeline">
                    {[...projectHistory].reverse().map((entry, index) => (
                      <div key={entry.statusId || index} className={`timeline-entry ${index === 0 ? 'latest' : ''}`}>
                        <div className="timeline-line"><div className="timeline-connector"><div className="timeline-dot" style={{ backgroundColor: statusConfig[entry.status]?.color || '#6B7280' }}></div>{index < projectHistory.length - 1 && <div className="timeline-vertical-line"></div>}</div></div>
                        <div className="timeline-content">
                          <div className="commit-header">
                            <div className="commit-hash"><span className="hash-text">{getCommitHash(entry.statusId, index)}</span></div>
                            <div className="commit-branch"><span className="branch-name">{getStatusBranch(entry.status)}</span></div>
                            <div className="commit-date"><span className="date-text">{formatRelativeTime(entry.dateTime)}</span></div>
                          </div>
                          <div className="commit-message">
                            <div className="commit-title">{getStatusIcon(entry.status)} {getStatusMessage(entry.status)}</div>
                            {entry.managerNote && <div className="commit-description"><span className="description-text">{entry.managerNote}</span></div>}
                            {entry.directorNote && <div className="commit-description director"><span className="description-text">{entry.directorNote}</span></div>}
                          </div>
                          <div className="commit-meta">
                            <div className="meta-author"><span className="author-name">{entry.handledByName || 'Unknown'}</span></div>
                            {entry.assignedToName && <div className="meta-assignee"><span className="assignee-name">{entry.assignedToName}</span></div>}
                          </div>
                          <div className="commit-stats"><span className="stat-badge"><span className="stat-text">{formatRelativeTime(entry.dateTime)}</span></span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeModalTab === 'teams' && (
              <div className="m-tab-content">
                {projectTeams.length === 0 ? <div className="empty-state"><span className="empty-icon">👥</span><p>No teams assigned yet</p></div> : projectTeams.map(team => (
                  <div key={team.teamId} className="team-section">
                    <h3>{team.teamName}</h3>
                    <div className="team-manager">Manager: {team.managerName}</div>
                    <div className="team-members">
                      {team.members.map((member, idx) => (
                        <div key={idx} className="team-member">
                          <div className="member-avatar">{member.memberName.charAt(0)}</div>
                          <div><div className="member-name">{member.memberName}</div><div className="member-role">{member.role}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FILES TAB - Clean UI */}
            {activeModalTab === 'files' && (
              <div className="m-tab-content">
                <div className="upload-section">
                  <input type="file" id="fileUpload" onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(selectedProject.projectId, e.target.files[0], 'Document'); }} />
                  <button className="btn-primary" onClick={() => document.getElementById('fileUpload')?.click()} disabled={uploadingFile}>
                    {uploadingFile ? '📤 Uploading...' : '📤 Upload File'}
                  </button>
                </div>
                <div className="files-list">
                  {projectFiles.length === 0 ? (
                    <div className="empty-state"><span className="empty-icon">📁</span><p>No files uploaded yet</p></div>
                  ) : (
                    projectFiles.map(file => (
                      <div key={file.fileId} className="file-item">
                        <div className="file-icon">📄</div>
                        <div className="file-info">
                          <div className="file-name">{file.fileLink?.split('/').pop() || 'File'}</div>
                          <div className="file-meta">
                            <span className="file-type">{file.fileType}</span>
                            <span>📤 Uploaded by {file.uploaderName}</span>
                            {file.uploadTime && <span>📅 {formatDate(file.uploadTime)}</span>}
                          </div>
                        </div>
                        <div className="file-actions">
                          <button className="btn-view" onClick={() => handleFileView(file.fileId)}>👁️ View</button>
                          <button className="btn-delete" onClick={() => handleDeleteFile(file.fileId, selectedProject.projectId)}>🗑️ Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeModalTab === 'ai' && (
              <div className="m-tab-content">
                {aiLoading ? <div className="loading-spinner"></div> : aiAnalysisResult ? <div className="ai-analysis-text">{aiAnalysisResult}</div> : <div className="empty-state">Click "Run AI Analysis" in the Overview tab to get AI insights for this project.</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ASSIGN TASK MODAL */}
      {showAssignTaskModal && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowAssignTaskModal(false)}>✕</button>
            <h2>Assign New Task</h2>
            <div className="m-form">
              <div className="form-group"><label>Assign To</label><select value={assignTaskData.assignedToUserId} onChange={(e) => setAssignTaskData({ ...assignTaskData, assignedToUserId: parseInt(e.target.value) })}><option value="0">Select Employee</option>{employees.map(emp => (<option key={emp.userId} value={emp.userId}>{emp.name} - {emp.positionName}</option>))}</select></div>
              <div className="form-group"><label>Task Description</label><textarea rows={3} placeholder="Describe the task..." value={assignTaskData.description} onChange={(e) => setAssignTaskData({ ...assignTaskData, description: e.target.value })} /></div>
              <div className="form-group"><label>Deadline</label><input type="datetime-local" value={assignTaskData.deadline} onChange={(e) => setAssignTaskData({ ...assignTaskData, deadline: e.target.value })} /></div>
              <button className="btn-primary" onClick={handleAssignTask}>Assign Task</button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE TASK MODAL */}
      {showTaskUpdateModal && selectedTask && (
        <div className="modal-mask open">
          <div className="modal-box">
            <button className="m-close" onClick={() => setShowTaskUpdateModal(false)}>✕</button>
            <h2>Update Task Status</h2>
            <p><strong>{selectedTask.description}</strong></p>
            <div className="m-form">
              <div className="form-group"><label>Status</label><select value={updateTaskStatusData.status} onChange={(e) => setUpdateTaskStatusData({ status: e.target.value })}><option value="">Select Status</option><option value="PENDING">⏳ Pending</option><option value="IN_PROGRESS">🔄 In Progress</option><option value="COMPLETED">✅ Completed</option></select></div>
              <button className="btn-primary" onClick={handleUpdateTask}>Update Status</button>
            </div>
          </div>
        </div>
      )}

      {/* AI ANALYSIS MODAL */}
      {showAIAnalyzeModal && aiAnalysisResult && (
        <div className="modal-mask open">
          <div className="modal-box large ai-analysis-modal">
            <button className="m-close" onClick={() => { setShowAIAnalyzeModal(false); setAiAnalysisResult(null); }}>✕</button>
            <div className="ai-modal-header"><div className="ai-icon-spin">🤖</div><h2>AI Project Analysis</h2></div>
            <div className="ai-section"><div className="ai-analysis-text">{aiAnalysisResult}</div></div>
            <div className="modal-actions"><button className="btn-primary" onClick={() => setShowAIAnalyzeModal(false)}>Close</button></div>
          </div>
        </div>
      )}

      <style jsx>{`
        .client-container { min-height: 100vh; background: var(--bg); }
        .client-main { flex: 1; margin-left: 280px; padding: 24px 32px; min-height: 100vh; }
        @media (max-width: 768px) { .client-main { margin-left: 0; padding: 16px; } .mobile-menu-btn { display: block; position: fixed; bottom: 20px; right: 20px; z-index: 101; background: var(--g-main); border: none; border-radius: 50%; width: 50px; height: 50px; font-size: 24px; cursor: pointer; } }
        @media (min-width: 769px) { .mobile-menu-btn { display: none; } }
        
        .client-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 20px; }
        .header-welcome h1 { font-size: 28px; font-weight: 700; margin: 0 0 4px; background: linear-gradient(135deg, #2ca6a4, #34a853); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header-welcome p { color: var(--teal); font-weight: 500; margin: 0; }
        .header-stats { display: flex; gap: 24px; }
        .header-stat-item { text-align: right; }
        .header-stat-item .stat-label { font-size: 11px; text-transform: uppercase; font-weight: 600; color: var(--muted); display: block; }
        .stat-value-sm { font-size: 18px; font-weight: 700; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .stat-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .stat-icon.blue { background: rgba(59, 130, 246, 0.1); }
        .stat-icon.orange { background: rgba(245, 158, 11, 0.1); }
        .stat-icon.purple { background: rgba(139, 92, 246, 0.1); }
        .stat-icon.green { background: rgba(16, 185, 129, 0.1); }
        .stat-icon.teal { background: rgba(44, 166, 164, 0.1); }
        .stat-icon.indigo { background: rgba(99, 102, 241, 0.1); }
        .stat-icon.pink { background: rgba(236, 72, 153, 0.1); }
        .stat-icon.red { background: rgba(239, 68, 68, 0.1); }
        .stat-info .stat-value { font-size: 28px; font-weight: 800; line-height: 1; color: var(--text2); }
        .stat-info .stat-label { font-size: 12px; color: var(--muted); display: block; }
        
        .dashboard-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 24px; margin-bottom: 24px; }
        .dashboard-card.full-width { width: 100%; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .card-header h2 { font-size: 20px; font-weight: 700; margin: 0; color: var(--text2); }
        .view-all-link { color: var(--teal); background: none; border: none; cursor: pointer; font-size: 14px; }
        .view-all-link:hover { text-decoration: underline; }
        
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .project-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: all 0.2s; }
        .project-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .project-card.pending { border-left: 3px solid #f59e0b; }
        .project-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .project-card-header h3 { font-size: 16px; font-weight: 700; margin: 0; color: var(--text2); }
        .project-card-desc { font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 12px; }
        .project-card-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; color: var(--muted); margin-bottom: 16px; }
        .project-card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        
        .consultants-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .consultant-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: all 0.2s; }
        .consultant-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .consultant-header { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
        .consultant-avatar { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: white; }
        .consultant-avatar.verified { background: linear-gradient(135deg, #2ca6a4, #1e7a78); }
        .consultant-avatar.pending { background: linear-gradient(135deg, #f39c12, #e67e22); }
        .consultant-info h3 { margin: 0 0 4px; font-size: 16px; color: var(--text2); }
        .consultant-info p { margin: 0; font-size: 12px; color: var(--muted); }
        .consultant-details { margin-bottom: 16px; }
        .consultant-details .detail { font-size: 13px; margin-bottom: 6px; color: var(--text2); }
        .detail-label { font-weight: 600; color: var(--muted); margin-right: 8px; }
        .consultant-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-success { background: linear-gradient(135deg, #27ae60, #229954); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-success:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3); }
        
        .pending-projects-list { display: flex; flex-direction: column; gap: 16px; }
        .pending-project-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 20px; transition: all 0.3s ease; position: relative; overflow: hidden; flex-wrap: wrap; }
        .pending-project-card::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(135deg, #f39c12, #e67e22); border-radius: 20px 0 0 20px; }
        .pending-project-card:hover { transform: translateX(4px); box-shadow: var(--shadow); }
        .pending-project-info { flex: 2; min-width: 200px; }
        .pending-project-info h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; color: var(--text2); }
        .pending-project-info p { font-size: 13px; color: var(--muted); margin-bottom: 12px; }
        .meta-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
        .meta-row span { font-size: 11px; padding: 4px 10px; background: var(--surface); border-radius: 20px; color: var(--muted); }
        .pending-project-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn-danger { background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-danger:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3); }
        
        .tasks-list { display: flex; flex-direction: column; gap: 12px; }
        .task-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--surface); border-radius: 12px; border: 1px solid var(--border); flex-wrap: wrap; }
        .task-icon { font-size: 24px; }
        .task-info { flex: 1; }
        .task-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; color: var(--text2); }
        .task-meta { display: flex; gap: 16px; font-size: 11px; color: var(--muted); flex-wrap: wrap; }
        .task-status { min-width: 100px; }
        
        .status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .status-pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-rejected { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .status-progress { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .status-completed { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        
        .search-input { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); min-width: 200px; color: var(--text2); }
        .filter-select { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); cursor: pointer; color: var(--text2); }
        .btn-primary { padding: 8px 16px; background: linear-gradient(135deg, #2ca6a4, #1a7a78); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(44, 166, 164, 0.3); }
        .btn-outline { background: transparent; border: 1.5px solid var(--border); padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; color: var(--text2); }
        .btn-outline:hover { border-color: var(--teal); color: var(--teal); }
        .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 6px; }
        .btn-icon { padding: 6px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all 0.2s; font-size: 14px; }
        .btn-icon:hover { background: var(--bg); border-color: var(--teal); }
        
        /* File Action Buttons - Clean Design */
        .btn-view { padding: 6px 14px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.2s; }
        .btn-view:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3); }
        .btn-delete { padding: 6px 14px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.2s; }
        .btn-delete:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3); }
        
        /* Info Note for Convert Modal */
        .info-note { display: flex; align-items: center; gap: 10px; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 10px; border-left: 3px solid #3b82f6; font-size: 12px; color: var(--text2); }
        .info-icon { font-size: 16px; }
        .form-hint { display: block; font-size: 10px; color: var(--muted); margin-top: 4px; }
        
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
        .data-table th { background: var(--surface); font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .data-table td { font-size: 13px; color: var(--text2); }
        .task-desc-cell { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-cell strong { display: block; }
        .user-cell small { font-size: 11px; color: var(--muted); }
        .skills-cell { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-orange { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .badge-blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .header-filters { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .user-stats-summary { display: flex; gap: 16px; font-size: 13px; }
        .user-stats-summary span { padding: 4px 12px; background: var(--surface); border-radius: 20px; color: var(--muted); }
        
        .ai-assistant-container { padding: 16px 0; }
        .ai-suggest-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 8px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px 16px; background: var(--surface); border: 1.5px solid var(--border); border-radius: 12px; font-size: 14px; color: var(--text2); font-family: inherit; transition: all 0.2s; outline: none; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--teal); }
        .btn-large { padding: 14px 24px; font-size: 16px; width: 100%; }
        .loading-spinner-small { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: white; animation: spin 0.6s linear infinite; margin-right: 8px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .ai-section { background: var(--surface); border-radius: 16px; padding: 20px; margin-top: 20px; border: 1px solid var(--border); }
        .ai-suggestion-text, .ai-analysis-text { font-size: 14px; line-height: 1.6; color: var(--text2); white-space: pre-wrap; }
        
        .profile-info { display: flex; gap: 32px; flex-wrap: wrap; margin-top: 16px; }
        .profile-avatar-large { width: 100px; height: 100px; border-radius: 24px; overflow: hidden; background: linear-gradient(135deg, #2ca6a4, #34a853); display: flex; align-items: center; justify-content: center; }
        .profile-avatar-large img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-placeholder { font-size: 48px; font-weight: 700; color: white; }
        .profile-details { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
        .detail-item { display: flex; flex-direction: column; gap: 4px; }
        .detail-item label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--muted); letter-spacing: 0.5px; }
        .detail-item span { font-size: 14px; color: var(--text2); word-break: break-word; }
        
        .empty-state { text-align: center; padding: 48px; color: var(--muted); }
        .empty-icon { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.5; }
        .client-footer { text-align: center; padding: 24px 0; margin-top: 32px; border-top: 1px solid var(--border); font-size: 13px; color: var(--muted); }
        .client-loader { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 16px; }
        .loader-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--teal); border-radius: 50%; animation: spin 0.8s linear infinite; }
        
        .modal-mask { display: flex; position: fixed; inset: 0; z-index: 2000; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 20px; }
        .modal-box { background: var(--card-bg); border-radius: 24px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding: 28px; position: relative; }
        .modal-box.large { max-width: 800px; }
        .m-close { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .m-close:hover { background: var(--red); border-color: var(--red); color: white; }
        .modal-box h2 { font-size: 22px; font-weight: 800; margin-bottom: 8px; color: var(--text2); }
        .modal-sub { font-size: 13px; color: var(--muted); margin-bottom: 16px; }
        .m-tabs { display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px; flex-wrap: wrap; }
        .m-tab { padding: 8px 16px; background: none; border: none; cursor: pointer; font-weight: 600; color: var(--muted); border-radius: 8px; transition: all 0.2s; }
        .m-tab.active { background: linear-gradient(135deg, #2ca6a4, #1a7a78); color: white; }
        .m-tab:hover:not(.active) { background: var(--surface); color: var(--teal); }
        .m-tab-content { padding: 16px 0; }
        .m-form { display: flex; flex-direction: column; gap: 16px; }
        .details-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .detail-item.full-width { grid-column: 1 / -1; }
        .detail-row { margin-bottom: 16px; }
        .detail-row label { font-weight: 600; color: var(--muted); min-width: 100px; display: inline-block; font-size: 12px; }
        .detail-row p { margin-top: 8px; color: var(--text2); font-size: 14px; }
        .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); flex-wrap: wrap; }
        
        .team-section { margin-bottom: 24px; }
        .team-section h3 { font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--teal); }
        .team-manager { font-size: 13px; color: var(--teal); margin-bottom: 12px; }
        .team-members { display: flex; flex-direction: column; gap: 8px; }
        .team-member { display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--surface); border-radius: 10px; }
        .member-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #2ca6a4, #34a853); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px; }
        .member-name { font-weight: 600; font-size: 14px; color: var(--text2); }
        .member-role { font-size: 11px; color: var(--teal); }
        
        .upload-section { display: flex; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); flex-wrap: wrap; align-items: center; }
        .upload-section input { padding: 8px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text2); }
        .files-list { display: flex; flex-direction: column; gap: 12px; }
        .file-item { display: flex; align-items: center; gap: 16px; padding: 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; transition: all 0.2s; flex-wrap: wrap; }
        .file-item:hover { transform: translateX(4px); border-color: var(--teal); }
        .file-icon { font-size: 24px; }
        .file-info { flex: 1; }
        .file-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; color: var(--text2); word-break: break-all; }
        .file-meta { display: flex; gap: 16px; flex-wrap: wrap; font-size: 11px; color: var(--muted); }
        .file-type { color: var(--teal); text-transform: uppercase; }
        .file-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        
        .vscode-timeline { max-height: 500px; overflow-y: auto; padding: 16px 0; }
        .timeline-entry { display: flex; gap: 16px; position: relative; }
        .timeline-line { width: 40px; flex-shrink: 0; }
        .timeline-connector { display: flex; flex-direction: column; align-items: center; min-height: 100%; }
        .timeline-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--card-bg); z-index: 2; }
        .timeline-vertical-line { width: 2px; flex: 1; background: var(--border); margin: 4px 0; min-height: 40px; }
        .timeline-content { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
        .commit-header { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
        .commit-hash { display: flex; align-items: center; gap: 4px; font-size: 11px; }
        .hash-text { color: var(--teal); font-weight: 500; font-family: monospace; }
        .commit-branch { display: flex; align-items: center; gap: 4px; font-size: 11px; }
        .branch-name { color: var(--text2); font-weight: 500; }
        .commit-date { display: flex; align-items: center; gap: 4px; font-size: 11px; }
        .date-text { color: var(--muted); }
        .commit-message { margin-bottom: 12px; }
        .commit-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text2); }
        .commit-description { display: flex; gap: 8px; padding: 8px 12px; background: var(--bg2); border-left: 2px solid var(--teal); border-radius: 6px; margin-top: 8px; font-size: 12px; }
        .commit-description.director { border-left-color: var(--orange); }
        .commit-meta { display: flex; gap: 16px; flex-wrap: wrap; font-size: 11px; padding: 8px 0; }
        .commit-stats { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
        .stat-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: var(--surface); border-radius: 4px; font-size: 10px; color: var(--muted); }
        
        .ai-analysis-modal { max-width: 700px; }
        .ai-modal-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid var(--border); }
        .ai-icon-spin { font-size: 40px; animation: spinIcon 4s linear infinite; }
        @keyframes spinIcon { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .projects-grid { grid-template-columns: 1fr; }
          .consultants-grid { grid-template-columns: 1fr; }
          .pending-project-card { flex-direction: column; align-items: flex-start; }
          .pending-project-actions { width: 100%; justify-content: flex-end; }
          .m-tabs { flex-direction: column; }
          .m-tab { text-align: center; }
          .modal-actions { flex-direction: column; }
          .modal-actions button { width: 100%; }
          .file-actions { width: 100%; justify-content: flex-end; }
        }
        
        :root { --bg: #f5f7fc; --bg2: #ffffff; --surface: rgba(0,0,0,0.035); --border: #e0e6f0; --text: #0c1018; --text2: #1e2535; --muted: #5e6f8a; --shadow: 0 2px 16px rgba(0,0,0,0.07); --g-main: linear-gradient(135deg, #34A853, #2CA6A4, #1F6DA8); --teal: #2CA6A4; --green: #34A853; --blue: #1F6DA8; --orange: #F36C3D; --red: #E74C3C; --purple: #6A5ACD; --card-bg: #ffffff; }
        [data-theme="dark"] { --bg: #07090f; --bg2: #0d1118; --surface: rgba(255,255,255,0.045); --border: rgba(255,255,255,0.09); --text: #eef2ff; --text2: #c7d0e8; --muted: #8895b3; --shadow: 0 2px 16px rgba(0,0,0,0.4); --card-bg: #111820; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', system-ui, sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; transition: background 0.3s, color 0.3s; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default CoreDirectorDashboard;
















// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '@/contexts/AuthContext';

// // ============================================
// // TYPES
// // ============================================

// interface UserProfile {
//   userId: number;
//   uid: string;
//   name: string;
//   email: string;
//   photoUrl: string | null;
//   phoneNumber?: string;
//   address?: string;
//   gender?: string;
//   dob?: string;
// }

// interface DashboardStats {
//   totalProjects: number;
//   pendingProjects: number;
//   inProgressProjects: number;
//   completedProjects: number;
//   totalConsultants: number;
//   totalEmployees: number;
//   totalTeams: number;
//   totalTasks: number;
//   pendingTasks: number;
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

// interface StatusHistory {
//   statusId: number;
//   status: string;
//   note: string;
//   dateTime: string;
// }

// interface Employee {
//   employeeId: number;
//   userId: number;
//   name: string;
//   email: string;
//   photoUrl: string | null;
//   phoneNumber: string | null;
//   address: string | null;
//   gender: string | null;
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
//   projectDescription?: string;
//   projectType?: string;
//   status: string;
//   departmentId: number;
//   departmentName: string;
//   clientName?: string;
//   clientEmail?: string;
//   assignedManagerId?: number;
//   assignedManagerName?: string;
//   deadline?: string;
//   directorNote?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface ProjectHistory {
//   statusId: number;
//   status: string;
//   dateTime: string;
//   handledByName: string;
//   assignedToName: string | null;
//   directorNote: string;
//   managerNote: string;
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
//   deadline: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// interface FileItem {
//   fileId: number;
//   fileType: string;
//   fileLink: string;
//   uploaderId: number;
//   uploaderName: string;
//   uploadTime: string;
//   departmentId: number;
//   departmentName: string;
// }

// // ============================================
// // API CONFIGURATION
// // ============================================

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// const apiCall = async <T,>(
//   method: string,
//   endpoint: string,
//   data?: any,
//   isFormData: boolean = false
// ): Promise<T> => {
//   try {
//     const config: any = {
//       method,
//       url: `${API_BASE}${endpoint}`,
//       withCredentials: true,
//     };

//     if (isFormData) {
//       config.data = data;
//       config.headers = { 'Content-Type': 'multipart/form-data' };
//     } else if (data) {
//       config.data = data;
//       config.headers = { 'Content-Type': 'application/json' };
//     }

//     const response = await axios(config);
//     return response.data;
//   } catch (error: any) {
//     throw error.response?.data || error;
//   }
// };

// // ============================================
// // CORE DIRECTOR API FUNCTIONS
// // ============================================

// const getDashboardStats = async () => {
//   return apiCall<{ success: boolean; message: string; data: DashboardStats }>('GET', '/api/core-director/dashboard/stats');
// };

// const getConsultants = async () => {
//   return apiCall<{ success: boolean; message: string; data: Consultant[] }>('GET', '/api/core-director/consultants');
// };

// const getConsultantStatusHistory = async (id: number) => {
//   return apiCall<{ success: boolean; message: string; data: StatusHistory[] }>('GET', `/api/core-director/consultants/${id}/status-history`);
// };

// const updateConsultantStatus = async (id: number, status: string, note: string) => {
//   return apiCall<{ success: boolean; message: string; data: any }>('PUT', `/api/core-director/consultants/${id}/status`, { status, note });
// };

// const convertToEmployee = async (id: number, positionName: string, salary: number, skillSet: string) => {
//   return apiCall<{ success: boolean; message: string; data: Employee | null }>('POST', `/api/core-director/consultants/${id}/convert-to-employee`, { positionName, salary, skillSet });
// };

// const getEmployees = async () => {
//   return apiCall<{ success: boolean; message: string; data: Employee[] }>('GET', '/api/core-director/employees');
// };

// const getProjects = async () => {
//   return apiCall<{ success: boolean; message: string; data: Project[] }>('GET', '/api/core-director/projects');
// };

// const getPendingProjects = async () => {
//   return apiCall<{ success: boolean; message: string; data: Project[] }>('GET', '/api/core-director/projects/pending');
// };

// const approveProject = async (projectId: number, status: string, note: string) => {
//   return apiCall<{ success: boolean; message: string; data: any }>('PUT', `/api/core-director/projects/${projectId}/approve?status=${status}&note=${encodeURIComponent(note)}`);
// };

// const assignProjectToManager = async (projectId: number, managerId: number, directorNote: string, deadline: string) => {
//   return apiCall<{ success: boolean; message: string; data: any }>('PUT', `/api/core-director/projects/${projectId}/assign`, { managerId, directorNote, deadline });
// };

// const reassignProjectToManager = async (projectId: number, managerId: number, directorNote: string, deadline: string) => {
//   return apiCall<{ success: boolean; message: string; data: any }>('PUT', `/api/core-director/projects/${projectId}/reassign`, { managerId, directorNote, deadline });
// };

// const getProjectById = async (id: number) => {
//   return apiCall<{ success: boolean; message: string; data: Project }>('GET', `/api/core-director/projects/${id}`);
// };

// const getProjectHistory = async (projectId: number) => {
//   return apiCall<{ success: boolean; message: string; data: ProjectHistory[] }>('GET', `/api/core-director/projects/${projectId}/history`);
// };

// const getProjectTeams = async (projectId: number) => {
//   return apiCall<{ success: boolean; message: string; data: Team[] }>('GET', `/api/core-director/projects/${projectId}/teams`);
// };

// const assignTask = async (assignedToUserId: number, description: string, deadline: string) => {
//   return apiCall<{ success: boolean; message: string; data: Task }>('POST', '/api/core-director/tasks/assign', { assignedToUserId, description, deadline });
// };

// const getTasks = async () => {
//   return apiCall<{ success: boolean; message: string; data: Task[] }>('GET', '/api/core-director/tasks');
// };

// const updateTaskStatus = async (taskId: number, status: string) => {
//   return apiCall<{ success: boolean; message: string; data: any }>('PUT', `/api/core-director/tasks/${taskId}/status?status=${status}`);
// };

// const getUserProfile = async () => {
//   return apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
// };

// // ============================================
// // AI API FUNCTIONS
// // ============================================

// const aiSuggestProject = async (projectName: string, projectDescription: string, projectType: string) => {
//   return apiCall<{ success: boolean; message: string; data: { text: string } }>('POST', '/api/ai/suggest-new-project', { projectName, projectDescription, projectType });
// };

// const aiAnalyzeProject = async (projectId: number) => {
//   return apiCall<{ success: boolean; message: string; data: { text: string } }>('GET', `/api/ai/analyze-project/${projectId}`);
// };

// // ============================================
// // FILE API FUNCTIONS
// // ============================================

// const getProjectFiles = async (projectId: number) => {
//   return apiCall<{ success: boolean; message: string; data: FileItem[] }>('GET', `/api/file/project/${projectId}`);
// };

// const uploadFile = async (projectId: number, file: File, fileType: string) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   return apiCall('POST', `/api/file/upload/${projectId}?fileType=${fileType}`, formData, true);
// };

// const deleteFile = async (fileId: number) => {
//   return apiCall('DELETE', `/api/file/delete/${fileId}`);
// };

// const getAccessToken = async (fileId: number) => {
//   return apiCall('POST', `/api/file/access-token/${fileId}`, {});
// };

// // ============================================
// // SIDEBAR MENU ITEMS
// // ============================================

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//   { id: 'consultants', label: 'Consultants', icon: '👨‍💻' },
//   { id: 'employees', label: 'Employees', icon: '👥' },
//   { id: 'projects', label: 'Projects', icon: '📁' },
//   { id: 'pending-projects', label: 'Pending Approval', icon: '⏳' },
//   { id: 'tasks', label: 'Tasks', icon: '✅' },
//   { id: 'ai-assistant', label: 'AI Assistant', icon: '🤖' },
//   { id: 'profile', label: 'Profile', icon: '👤' },
// ];

// // ============================================
// // STATUS CONFIGURATION
// // ============================================

// const statusConfig: Record<string, { label: string; class: string; icon: string; color: string }> = {
//   PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳', color: '#F59E0B' },
//   APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅', color: '#10B981' },
//   REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '❌', color: '#EF4444' },
//   IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄', color: '#3B82F6' },
//   COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️', color: '#10B981' },
//   ACTIVE: { label: 'Active', class: 'status-approved', icon: '🟢', color: '#10B981' },
//   INACTIVE: { label: 'Inactive', class: 'status-rejected', icon: '⚪', color: '#6B7280' },
// };

// const getStatusBadge = (status: string) => {
//   const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌', color: '#6B7280' };
//   return <span className={`status-badge ${config.class}`}>{config.icon} {config.label}</span>;
// };

// // ============================================
// // MAIN CORE DIRECTOR COMPONENT
// // ============================================

// const CoreDirectorDashboard: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('dashboard');
//   const [loading, setLoading] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [darkMode, setDarkMode] = useState(false);

//   // Data states
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [consultants, setConsultants] = useState<Consultant[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
//   const [tasks, setTasks] = useState<Task[]>([]);

//   // Selected item states
//   const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);

//   // Modal states
//   const [showConsultantDetailModal, setShowConsultantDetailModal] = useState(false);
//   const [showConsultantStatusModal, setShowConsultantStatusModal] = useState(false);
//   const [showConvertToEmployeeModal, setShowConvertToEmployeeModal] = useState(false);
//   const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
//   const [showProjectApproveModal, setShowProjectApproveModal] = useState(false);
//   const [showAssignManagerModal, setShowAssignManagerModal] = useState(false);
//   const [showReassignManagerModal, setShowReassignManagerModal] = useState(false);
//   const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
//   const [showTaskUpdateModal, setShowTaskUpdateModal] = useState(false);
//   const [showAIAnalyzeModal, setShowAIAnalyzeModal] = useState(false);
//   const [activeModalTab, setActiveModalTab] = useState('overview');

//   // Form states
//   const [consultantStatusData, setConsultantStatusData] = useState({ status: '', note: '' });
//   const [convertEmployeeData, setConvertEmployeeData] = useState({ positionName: '', salary: 0, skillSet: '' });
//   const [approveProjectData, setApproveProjectData] = useState({ status: 'APPROVED', note: '' });
//   const [assignManagerData, setAssignManagerData] = useState({ managerId: 0, directorNote: '', deadline: '' });
//   const [assignTaskData, setAssignTaskData] = useState({ assignedToUserId: 0, description: '', deadline: '' });
//   const [updateTaskStatusData, setUpdateTaskStatusData] = useState({ status: '' });

//   // AI states
//   const [aiSuggestionInput, setAiSuggestionInput] = useState({ projectName: '', projectDescription: '', projectType: '' });
//   const [aiSuggestionResult, setAiSuggestionResult] = useState<string | null>(null);
//   const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
//   const [aiLoading, setAiLoading] = useState(false);

//   // History, teams, and files data
//   const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);
//   const [projectTeams, setProjectTeams] = useState<Team[]>([]);
//   const [projectFiles, setProjectFiles] = useState<FileItem[]>([]);
//   const [consultantHistory, setConsultantHistory] = useState<StatusHistory[]>([]);

//   // Filter states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   const { logout } = useAuth();

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.setAttribute('data-theme', 'dark');
//     }
//     loadAllData();
//   }, []);

//   const loadAllData = async () => {
//     setLoading(true);
//     try {
//       const [profileRes, statsRes, consultantsRes, employeesRes, projectsRes, pendingRes, tasksRes] = await Promise.all([
//         getUserProfile().catch(() => ({ data: null })),
//         getDashboardStats().catch(() => ({ data: null })),
//         getConsultants().catch(() => ({ data: [] })),
//         getEmployees().catch(() => ({ data: [] })),
//         getProjects().catch(() => ({ data: [] })),
//         getPendingProjects().catch(() => ({ data: [] })),
//         getTasks().catch(() => ({ data: [] })),
//       ]);

//       setUser(profileRes.data);
//       setStats(statsRes.data);
//       setConsultants(consultantsRes.data);
//       setEmployees(employeesRes.data);
//       setProjects(projectsRes.data);
//       setPendingProjects(pendingRes.data);
//       setTasks(tasksRes.data);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       window.location.href = '/';
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   const handleUpdateConsultantStatus = async () => {
//     if (!selectedConsultant || !consultantStatusData.status) {
//       alert('Please select a status');
//       return;
//     }
//     try {
//       await updateConsultantStatus(selectedConsultant.consultantId, consultantStatusData.status, consultantStatusData.note);
//       alert('Status updated successfully');
//       const consultantsRes = await getConsultants();
//       setConsultants(consultantsRes.data);
//       setShowConsultantStatusModal(false);
//       setConsultantStatusData({ status: '', note: '' });
//     } catch (error: any) {
//       alert(error.message || 'Failed to update status');
//     }
//   };

//   const handleConvertToEmployee = async () => {
//     if (!selectedConsultant) return;
//     if (!convertEmployeeData.positionName || !convertEmployeeData.salary) {
//       alert('Please fill Position Name and Salary');
//       return;
//     }
//     try {
//       const result = await convertToEmployee(
//         selectedConsultant.consultantId,
//         convertEmployeeData.positionName,
//         convertEmployeeData.salary,
//         convertEmployeeData.skillSet
//       );
//       alert(result.message || 'Consultant converted to employee successfully');
//       const [consultantsRes, employeesRes] = await Promise.all([
//         getConsultants(),
//         getEmployees(),
//       ]);
//       setConsultants(consultantsRes.data);
//       setEmployees(employeesRes.data);
//       setShowConvertToEmployeeModal(false);
//       setConvertEmployeeData({ positionName: '', salary: 0, skillSet: '' });
//     } catch (error: any) {
//       alert(error.message || 'Failed to convert to employee');
//     }
//   };

//   const handleApproveProject = async () => {
//     if (!selectedProject) return;
//     try {
//       await approveProject(selectedProject.projectId, approveProjectData.status, approveProjectData.note);
//       alert(`Project ${approveProjectData.status.toLowerCase()} successfully`);
//       const [projectsRes, pendingRes] = await Promise.all([
//         getProjects(),
//         getPendingProjects(),
//       ]);
//       setProjects(projectsRes.data);
//       setPendingProjects(pendingRes.data);
//       setShowProjectApproveModal(false);
//       setApproveProjectData({ status: 'APPROVED', note: '' });
//     } catch (error: any) {
//       alert(error.message || 'Failed to approve/reject project');
//     }
//   };

//   const handleAssignManager = async () => {
//     if (!selectedProject) return;
//     if (!assignManagerData.managerId || !assignManagerData.deadline) {
//       alert('Please select a manager and set a deadline');
//       return;
//     }
//     try {
//       await assignProjectToManager(
//         selectedProject.projectId,
//         assignManagerData.managerId,
//         assignManagerData.directorNote,
//         assignManagerData.deadline
//       );
//       alert('Project assigned to manager successfully');
//       const projectsRes = await getProjects();
//       setProjects(projectsRes.data);
//       setShowAssignManagerModal(false);
//       setAssignManagerData({ managerId: 0, directorNote: '', deadline: '' });
//     } catch (error: any) {
//       alert(error.message || 'Failed to assign manager');
//     }
//   };

//   const handleReassignManager = async () => {
//     if (!selectedProject) return;
//     if (!assignManagerData.managerId || !assignManagerData.deadline) {
//       alert('Please select a manager and set a deadline');
//       return;
//     }
//     try {
//       await reassignProjectToManager(
//         selectedProject.projectId,
//         assignManagerData.managerId,
//         assignManagerData.directorNote,
//         assignManagerData.deadline
//       );
//       alert('Project reassigned to manager successfully');
//       const projectsRes = await getProjects();
//       setProjects(projectsRes.data);
//       setShowReassignManagerModal(false);
//       setAssignManagerData({ managerId: 0, directorNote: '', deadline: '' });
//       if (showProjectDetailModal) {
//         await refreshProjectDetails(selectedProject.projectId);
//       }
//     } catch (error: any) {
//       alert(error.message || 'Failed to reassign manager');
//     }
//   };

//   const handleAssignTask = async () => {
//     if (!assignTaskData.assignedToUserId || !assignTaskData.description || !assignTaskData.deadline) {
//       alert('Please fill all fields');
//       return;
//     }
//     try {
//       await assignTask(assignTaskData.assignedToUserId, assignTaskData.description, assignTaskData.deadline);
//       alert('Task assigned successfully');
//       const tasksRes = await getTasks();
//       setTasks(tasksRes.data);
//       setShowAssignTaskModal(false);
//       setAssignTaskData({ assignedToUserId: 0, description: '', deadline: '' });
//     } catch (error: any) {
//       alert(error.message || 'Failed to assign task');
//     }
//   };

//   const handleUpdateTask = async () => {
//     if (!selectedTask || !updateTaskStatusData.status) {
//       alert('Please select a status');
//       return;
//     }
//     try {
//       await updateTaskStatus(selectedTask.taskId, updateTaskStatusData.status);
//       alert('Task status updated successfully');
//       const tasksRes = await getTasks();
//       setTasks(tasksRes.data);
//       setShowTaskUpdateModal(false);
//       setUpdateTaskStatusData({ status: '' });
//       setSelectedTask(null);
//     } catch (error: any) {
//       alert(error.message || 'Failed to update task status');
//     }
//   };

//   const handleAISuggestProject = async () => {
//     if (!aiSuggestionInput.projectName || !aiSuggestionInput.projectDescription) {
//       alert('Please enter project name and description');
//       return;
//     }
//     setAiLoading(true);
//     try {
//       const res = await aiSuggestProject(
//         aiSuggestionInput.projectName,
//         aiSuggestionInput.projectDescription,
//         aiSuggestionInput.projectType || 'General'
//       );
//       setAiSuggestionResult(res.data.text);
//     } catch (error: any) {
//       alert(error.message || 'Failed to get AI suggestions');
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const handleAIAnalyzeProject = async (projectId: number) => {
//     setAiLoading(true);
//     try {
//       const res = await aiAnalyzeProject(projectId);
//       setAiAnalysisResult(res.data.text);
//       setShowAIAnalyzeModal(true);
//     } catch (error: any) {
//       alert(error.message || 'Failed to analyze project');
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const handleViewConsultantDetails = async (consultant: Consultant) => {
//     setSelectedConsultant(consultant);
//     try {
//       const historyRes = await getConsultantStatusHistory(consultant.consultantId);
//       setConsultantHistory(historyRes.data);
//       setShowConsultantDetailModal(true);
//     } catch (error) {
//       console.error('Error fetching consultant history:', error);
//       setConsultantHistory([]);
//       setShowConsultantDetailModal(true);
//     }
//   };

//   const handleFileView = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) {
//         window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
//       } else {
//         alert('Cannot view file');
//       }
//     } catch (error) {
//       alert('Cannot view file');
//     }
//   };

//   const handleFileDownload = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) {
//         window.open(`${API_BASE}${tokenRes.data.downloadUrl}`, '_blank');
//       } else {
//         alert('Cannot download file');
//       }
//     } catch (error) {
//       alert('Download failed');
//     }
//   };

//   const handleFileUpload = async (projectId: number, file: File, fileType: string) => {
//     try {
//       await uploadFile(projectId, file, fileType);
//       alert('File uploaded successfully');
//       await refreshProjectDetails(projectId);
//     } catch (error: any) {
//       alert(error.message || 'Upload failed');
//     }
//   };

//   const handleDeleteFile = async (fileId: number, projectId: number) => {
//     if (!confirm('Delete this file?')) return;
//     try {
//       await deleteFile(fileId);
//       alert('File deleted successfully');
//       await refreshProjectDetails(projectId);
//     } catch (error: any) {
//       alert(error.message || 'Delete failed');
//     }
//   };

//   const refreshProjectDetails = async (projectId: number) => {
//     try {
//       const [historyRes, teamsRes, filesRes] = await Promise.all([
//         getProjectHistory(projectId).catch(() => ({ data: [] })),
//         getProjectTeams(projectId).catch(() => ({ data: [] })),
//         getProjectFiles(projectId).catch(() => ({ data: [] })),
//       ]);
//       setProjectHistory(historyRes.data);
//       setProjectTeams(teamsRes.data);
//       setProjectFiles(filesRes.data);
//     } catch (error) {
//       console.error('Error refreshing project details:', error);
//     }
//   };

//   const handleViewProjectDetails = async (project: Project) => {
//     setSelectedProject(project);
//     setActiveModalTab('overview');
//     try {
//       const [historyRes, teamsRes, filesRes] = await Promise.all([
//         getProjectHistory(project.projectId).catch(() => ({ data: [] })),
//         getProjectTeams(project.projectId).catch(() => ({ data: [] })),
//         getProjectFiles(project.projectId).catch(() => ({ data: [] })),
//       ]);
//       setProjectHistory(historyRes.data);
//       setProjectTeams(teamsRes.data);
//       setProjectFiles(filesRes.data);
//       setShowProjectDetailModal(true);
//     } catch (error) {
//       console.error('Error fetching project details:', error);
//       setShowProjectDetailModal(true);
//     }
//   };

//   const filteredConsultants = consultants.filter(c =>
//     c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     c.skill.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredProjects = projects.filter(p => {
//     if (statusFilter !== 'all' && p.status !== statusFilter) return false;
//     return p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       p.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
//   });

//   const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

//   if (loading) {
//     return (
//       <div className="client-loader">
//         <div className="loader-spinner"></div>
//         <p>Loading Director Dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="client-container">
//       {/* Sidebar */}
//       <aside className={`sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
//         <div className="sidebar-header">
//           <div className="sidebar-logo">
//             <span className="logo-icon">🎯</span>
//             <span className="logo-text">Core Director</span>
//           </div>
//           <button className="theme-toggle-btn" onClick={toggleDarkMode}>
//             {darkMode ? '☀️' : '🌙'}
//           </button>
//         </div>

//         <div className="sidebar-user">
//           <div className="sidebar-avatar">
//             {user?.photoUrl ? (
//               <img src={user.photoUrl} alt={user.name} />
//             ) : (
//               <div className="avatar-placeholder">{user?.name?.charAt(0) || 'D'}</div>
//             )}
//           </div>
//           <div className="sidebar-user-info">
//             <h4>{user?.name || 'Director'}</h4>
//             <p>Core Director</p>
//           </div>
//         </div>

//         <nav className="sidebar-nav">
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
//               onClick={() => setActiveNav(item.id)}
//             >
//               <span className="nav-icon">{item.icon}</span>
//               <span>{item.label}</span>
//             </button>
//           ))}
//         </nav>

//         <div className="sidebar-footer">
//           <button className="sidebar-footer-btn logout" onClick={handleLogout}>
//             <span className="nav-icon">🚪</span>
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       <div className="sidebar-overlay" onClick={() => setMobileSidebarOpen(false)}></div>
//       <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>☰</button>

//       {/* Main Content */}
//       <main className="client-main">
//         <header className="client-header">
//           <div className="header-welcome">
//             <h1>Core Director Dashboard</h1>
//             <p>Manage projects, consultants, employees, and tasks</p>
//           </div>
//           <div className="header-stats">
//             <div className="header-stat-item">
//               <span className="stat-label">Projects</span>
//               <span className="stat-value-sm">{stats?.totalProjects || 0}</span>
//             </div>
//             <div className="header-stat-item">
//               <span className="stat-label">Consultants</span>
//               <span className="stat-value-sm">{stats?.totalConsultants || 0}</span>
//             </div>
//             <div className="header-stat-item">
//               <span className="stat-label">Employees</span>
//               <span className="stat-value-sm">{stats?.totalEmployees || 0}</span>
//             </div>
//             <div className="header-stat-item">
//               <span className="stat-label">Pending Tasks</span>
//               <span className="stat-value-sm">{stats?.pendingTasks || 0}</span>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Tab */}
//         {activeNav === 'dashboard' && stats && (
//           <>
//             <div className="stats-grid">
//               <div className="stat-card"><div className="stat-icon blue">📊</div><div className="stat-info"><span className="stat-value">{stats.totalProjects}</span><span className="stat-label">Total Projects</span></div></div>
//               <div className="stat-card"><div className="stat-icon orange">⏳</div><div className="stat-info"><span className="stat-value">{stats.pendingProjects}</span><span className="stat-label">Pending Projects</span></div></div>
//               <div className="stat-card"><div className="stat-icon green">🔄</div><div className="stat-info"><span className="stat-value">{stats.inProgressProjects}</span><span className="stat-label">In Progress</span></div></div>
//               <div className="stat-card"><div className="stat-icon purple">✅</div><div className="stat-info"><span className="stat-value">{stats.completedProjects}</span><span className="stat-label">Completed</span></div></div>
//               <div className="stat-card"><div className="stat-icon teal">👨‍💻</div><div className="stat-info"><span className="stat-value">{stats.totalConsultants}</span><span className="stat-label">Consultants</span></div></div>
//               <div className="stat-card"><div className="stat-icon blue">👥</div><div className="stat-info"><span className="stat-value">{stats.totalEmployees}</span><span className="stat-label">Employees</span></div></div>
//               <div className="stat-card"><div className="stat-icon orange">👥</div><div className="stat-info"><span className="stat-value">{stats.totalTeams}</span><span className="stat-label">Teams</span></div></div>
//               <div className="stat-card"><div className="stat-icon purple">✅</div><div className="stat-info"><span className="stat-value">{stats.totalTasks}</span><span className="stat-label">Total Tasks</span><span className="stat-label" style={{ fontSize: '0.65rem' }}>{stats.pendingTasks} pending</span></div></div>
//             </div>

//             <div className="dashboard-card">
//               <div className="card-header"><h2>📋 Recent Projects</h2><button className="view-all-link" onClick={() => setActiveNav('projects')}>View All →</button></div>
//               <div className="projects-grid">
//                 {projects.slice(0, 4).map(project => (
//                   <div key={project.projectId} className="project-card">
//                     <div className="project-card-header"><h3>{project.projectName}</h3>{getStatusBadge(project.status)}</div>
//                     <p className="project-card-desc">{project.projectDescription?.substring(0, 80) || 'No description'}</p>
//                     <div className="project-card-meta"><span>🏢 {project.departmentName}</span>{project.assignedManagerName && <span>👔 {project.assignedManagerName}</span>}{project.deadline && <span>📅 Due: {new Date(project.deadline).toLocaleDateString()}</span>}</div>
//                     <div className="project-card-actions">
//                       <button className="btn-sm btn-primary" onClick={() => handleViewProjectDetails(project)}>View Details</button>
//                       <button className="btn-sm btn-outline" onClick={() => handleAIAnalyzeProject(project.projectId)}>🤖 AI Analyze</button>
//                       {project.status === 'PENDING' && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowProjectApproveModal(true); }}>Approve/Reject</button>)}
//                       {project.status === 'APPROVED' && !project.assignedManagerId && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowAssignManagerModal(true); }}>Assign Manager</button>)}
//                       {project.status === 'APPROVED' && project.assignedManagerId && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowReassignManagerModal(true); }}>Reassign Manager</button>)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="dashboard-card">
//               <div className="card-header"><h2>⏳ Pending Approvals</h2><button className="view-all-link" onClick={() => setActiveNav('pending-projects')}>View All →</button></div>
//               <div className="projects-grid">
//                 {pendingProjects.slice(0, 3).map(project => (
//                   <div key={project.projectId} className="project-card pending">
//                     <div className="project-card-header"><h3>{project.projectName}</h3><span className="status-badge status-pending">⏳ Pending Approval</span></div>
//                     <p className="project-card-desc">{project.projectDescription?.substring(0, 80) || 'No description'}</p>
//                     <div className="project-card-meta"><span>🏢 {project.departmentName}</span><span>📱 {project.projectType || 'N/A'}</span></div>
//                     <div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => { setSelectedProject(project); setShowProjectApproveModal(true); }}>Review Project</button></div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="dashboard-card">
//               <div className="card-header"><h2>✅ Recent Tasks</h2><button className="view-all-link" onClick={() => setActiveNav('tasks')}>View All →</button></div>
//               <div className="tasks-list">
//                 {tasks.slice(0, 5).map(task => (
//                   <div key={task.taskId} className="file-item">
//                     <div className="file-icon">📋</div>
//                     <div className="file-info"><div className="file-name">{task.description}</div><div className="file-meta"><span>Assigned to: {task.assignedToUserName}</span><span>Created by: {task.createdByName}</span>{task.deadline && <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>}</div></div>
//                     <div className="file-actions">{getStatusBadge(task.status)}<button className="btn-icon" onClick={() => { setSelectedTask(task); setShowTaskUpdateModal(true); }}>✏️</button></div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}

//         {/* Consultants Tab */}
//         {activeNav === 'consultants' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>👨‍💻 Consultants Management</h2><input type="text" placeholder="Search consultants..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" /></div>
//             <div className="emp-grid">
//               {filteredConsultants.map(consultant => (
//                 <div key={consultant.consultantId} className="card">
//                   <div className="emp-header"><div className={`emp-avatar ${consultant.isApproved === 'APPROVED' ? 'verified' : 'pending'}`}>{consultant.photoUrl ? <img src={consultant.photoUrl} alt={consultant.name} className="avatar-img" /> : consultant.name.charAt(0)}</div><div><h3>{consultant.name}</h3><span className="dept-badge">{consultant.departmentName}</span></div></div>
//                   <div className="emp-body"><div className="emp-row"><span>📧 Email:</span><span>{consultant.email}</span></div><div className="emp-row"><span>🔧 Skills:</span><span className="skills">{consultant.skill.split(',').slice(0, 3).map((s, i) => (<span key={i} className="skill">{s.trim()}</span>))}</span></div><div className="emp-row"><span>📅 Experience:</span><span>{consultant.experience}</span></div><div className="emp-row"><span>📊 Status:</span>{getStatusBadge(consultant.isApproved)}</div></div>
//                   <div className="emp-footer"><button className="btn-outline-sm" onClick={() => handleViewConsultantDetails(consultant)}>View Details</button><div className="footer-actions"><button className="btn-icon-small" onClick={() => { setSelectedConsultant(consultant); setShowConsultantStatusModal(true); }}>📝 Update Status</button><button className="btn-icon-small success" onClick={() => { setSelectedConsultant(consultant); setShowConvertToEmployeeModal(true); }}>🔄 Convert to Employee</button></div></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Employees Tab */}
//         {activeNav === 'employees' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>👥 Employees Directory</h2><input type="text" placeholder="Search employees..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" /></div>
//             <div className="emp-grid">
//               {employees.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map(employee => (
//                 <div key={employee.employeeId} className="card">
//                   <div className="emp-header"><div className="emp-avatar verified">{employee.photoUrl ? <img src={employee.photoUrl} alt={employee.name} className="avatar-img" /> : employee.name.charAt(0)}</div><div><h3>{employee.name}</h3><span className="dept-badge">{employee.departmentName}</span></div></div>
//                   <div className="emp-body"><div className="emp-row"><span>📧 Email:</span><span>{employee.email}</span></div><div className="emp-row"><span>💼 Position:</span><span>{employee.positionName}</span></div><div className="emp-row"><span>💰 Salary:</span><span className="salary">₹{employee.salary.toLocaleString()}</span></div><div className="emp-row"><span>🔧 Skills:</span><span className="skills">{employee.skillSet?.split(',').slice(0, 3).map((s, i) => (<span key={i} className="skill">{s.trim()}</span>))}</span></div></div>
//                   <div className="emp-footer"><button className="btn-outline-sm" onClick={() => alert(`Employee: ${employee.name}\nEmail: ${employee.email}\nPosition: ${employee.positionName}\nSalary: ₹${employee.salary.toLocaleString()}\nSkills: ${employee.skillSet}`)}>View Details</button></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Projects Tab */}
//         {activeNav === 'projects' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>📁 All Projects</h2><div className="header-filters"><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select"><option value="all">All Status</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><input type="text" placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" /></div></div>
//             <div className="projects-grid">
//               {filteredProjects.map(project => (
//                 <div key={project.projectId} className="project-card">
//                   <div className="project-card-header"><h3>{project.projectName}</h3>{getStatusBadge(project.status)}</div>
//                   <p className="project-card-desc">{project.projectDescription?.substring(0, 100) || 'No description'}</p>
//                   <div className="project-card-meta"><span>🏢 {project.departmentName}</span><span>📱 {project.projectType || 'N/A'}</span>{project.clientName && <span>👤 {project.clientName}</span>}{project.assignedManagerName && <span>👔 {project.assignedManagerName}</span>}</div>
//                   <div className="project-card-actions">
//                     <button className="btn-sm btn-primary" onClick={() => handleViewProjectDetails(project)}>View Details</button>
//                     <button className="btn-sm btn-outline" onClick={() => handleAIAnalyzeProject(project.projectId)}>🤖 AI Analyze</button>
//                     {project.status === 'PENDING' && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowProjectApproveModal(true); }}>Approve/Reject</button>)}
//                     {project.status === 'APPROVED' && !project.assignedManagerId && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowAssignManagerModal(true); }}>Assign Manager</button>)}
//                     {project.status === 'APPROVED' && project.assignedManagerId && (<button className="btn-sm btn-outline" onClick={() => { setSelectedProject(project); setShowReassignManagerModal(true); }}>Reassign Manager</button>)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Pending Projects Tab */}
//         {activeNav === 'pending-projects' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>⏳ Projects Pending Approval</h2></div>
//             <div className="pending-projects-list">
//               {pendingProjects.map(project => (
//                 <div key={project.projectId} className="pending-project-card">
//                   <div className="pending-project-info"><h3>{project.projectName}</h3><p>{project.projectDescription?.substring(0, 150) || 'No description'}</p><div className="meta-row"><span>🏢 {project.departmentName}</span><span>📱 {project.projectType || 'N/A'}</span>{project.clientName && <span>👤 {project.clientName}</span>}{project.createdAt && <span>📅 Created: {new Date(project.createdAt).toLocaleDateString()}</span>}</div></div>
//                   <div className="pending-project-actions"><button className="btn-success" onClick={() => { setSelectedProject(project); setApproveProjectData({ status: 'APPROVED', note: '' }); setShowProjectApproveModal(true); }}>✅ Approve</button><button className="btn-danger" onClick={() => { setSelectedProject(project); setApproveProjectData({ status: 'REJECTED', note: '' }); setShowProjectApproveModal(true); }}>❌ Reject</button><button className="btn-outline" onClick={() => handleViewProjectDetails(project)}>📋 View Details</button></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Tasks Tab */}
//         {activeNav === 'tasks' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>✅ Task Management</h2><button className="btn-primary" onClick={() => setShowAssignTaskModal(true)}>+ Assign New Task</button></div>
//             <div className="tasks-table-container"><table className="data-table"><thead><tr><th>Task</th><th>Assigned To</th><th>Created By</th><th>Deadline</th><th>Status</th><th>Actions</th></tr></thead><tbody>{tasks.map(task => (<tr key={task.taskId}><td className="task-desc-cell">{task.description}</td><td>{task.assignedToUserName}</td><td>{task.createdByName}</td><td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</td><td>{getStatusBadge(task.status)}</td><td><div className="task-actions"><button className="btn-icon" onClick={() => { setSelectedTask(task); setShowTaskUpdateModal(true); }}>✏️</button></div></td></tr>))}</tbody></table></div>
//           </div>
//         )}

//         {/* AI Assistant Tab */}
//         {activeNav === 'ai-assistant' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>🤖 AI Assistant for Project Management</h2></div>
//             <div className="ai-assistant-container">
//               {!aiSuggestionResult ? (
//                 <div className="ai-suggest-form"><div className="form-group"><label>Project Name</label><input type="text" placeholder="e.g., E-commerce Platform Development" value={aiSuggestionInput.projectName} onChange={(e) => setAiSuggestionInput({ ...aiSuggestionInput, projectName: e.target.value })} /></div><div className="form-group"><label>Project Description</label><textarea rows={4} placeholder="Describe the project goals, requirements, and expectations..." value={aiSuggestionInput.projectDescription} onChange={(e) => setAiSuggestionInput({ ...aiSuggestionInput, projectDescription: e.target.value })} /></div><div className="form-group"><label>Project Type</label><select value={aiSuggestionInput.projectType} onChange={(e) => setAiSuggestionInput({ ...aiSuggestionInput, projectType: e.target.value })}><option value="">Select Type</option><option value="Web Development">Web Development</option><option value="Mobile App">Mobile App</option><option value="AI/ML">AI/ML</option><option value="Cloud Migration">Cloud Migration</option><option value="DevOps">DevOps</option><option value="Data Analytics">Data Analytics</option></select></div><button className="btn-primary" onClick={handleAISuggestProject} disabled={aiLoading}>{aiLoading ? <span className="loading-spinner"></span> : '🤖 Generate AI Suggestions'}</button></div>
//               ) : (<div className="ai-suggestions-content"><button className="btn-outline" onClick={() => setAiSuggestionResult(null)} style={{ alignSelf: 'flex-start' }}>← New Project</button><div className="ai-section"><div className="ai-suggestion-text">{aiSuggestionResult}</div></div></div>)}
//             </div>
//           </div>
//         )}

//         {/* Profile Tab */}
//         {activeNav === 'profile' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>Profile Information</h2><button className="btn-outline" onClick={() => alert('Profile edit coming soon')}>✏️ Edit Profile</button></div>
//             <div className="profile-info"><div className="profile-avatar-large">{user?.photoUrl ? <img src={user.photoUrl} alt={user.name} /> : <div className="avatar-placeholder">{user?.name?.charAt(0) || 'D'}</div>}</div><div className="profile-details"><div className="detail-item"><label>Full Name</label><span>{user?.name}</span></div><div className="detail-item"><label>Email</label><span>{user?.email}</span></div><div className="detail-item"><label>Role</label><span>Core Director</span></div><div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not provided'}</span></div><div className="detail-item"><label>Address</label><span>{user?.address || 'Not provided'}</span></div></div></div>
//           </div>
//         )}

//         <footer className="client-footer"><p>© 2026 Core Director Dashboard | Enterprise Management System</p></footer>
//       </main>

//       {/* Consultant Detail Modal */}
//       {showConsultantDetailModal && selectedConsultant && (
//         <div className="modal-mask open"><div className="modal-box large"><button className="m-close" onClick={() => setShowConsultantDetailModal(false)}>✕</button><h2>{selectedConsultant.name}</h2><div className="m-tabs"><button className={`m-tab ${activeModalTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveModalTab('overview')}>Overview</button><button className={`m-tab ${activeModalTab === 'history' ? 'active' : ''}`} onClick={() => setActiveModalTab('history')}>Status History</button></div><div className="m-tab-content" style={{ display: activeModalTab === 'overview' ? 'block' : 'none' }}><div className="project-detail-section"><div className="detail-row"><label>Email:</label><span>{selectedConsultant.email}</span></div><div className="detail-row"><label>Department:</label><span>{selectedConsultant.departmentName}</span></div><div className="detail-row"><label>Skills:</label><span className="skills-tags">{selectedConsultant.skill.split(',').map((s, i) => (<span key={i} className="skill-tag">{s.trim()}</span>))}</span></div><div className="detail-row"><label>Experience:</label><span>{selectedConsultant.experience}</span></div><div className="detail-row"><label>Status:</label>{getStatusBadge(selectedConsultant.isApproved)}</div></div></div><div className="m-tab-content" style={{ display: activeModalTab === 'history' ? 'block' : 'none' }}><div className="vscode-timeline">{consultantHistory.length === 0 ? <div className="empty-state-small">No status history available</div> : consultantHistory.map((entry, idx) => (<div key={entry.statusId} className="timeline-entry"><div className="timeline-line"><div className="timeline-connector"><div className="timeline-dot" style={{ backgroundColor: statusConfig[entry.status]?.color || '#6B7280' }}></div>{idx < consultantHistory.length - 1 && <div className="timeline-vertical-line"></div>}</div></div><div className="timeline-content"><div className="commit-header"><div className="commit-date"><span className="date-icon">📅</span><span className="date-text">{formatDate(entry.dateTime)}</span></div></div><div className="commit-message"><div className="commit-title">Status: {statusConfig[entry.status]?.label || entry.status}</div>{entry.note && <div className="commit-description"><span className="description-icon">📝</span><span className="description-text">{entry.note}</span></div>}</div></div></div>))}</div></div></div></div>
//       )}

//       {/* Update Consultant Status Modal */}
//       {showConsultantStatusModal && selectedConsultant && (
//         <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowConsultantStatusModal(false)}>✕</button><h2>Update Status - {selectedConsultant.name}</h2><div className="m-form"><div className="form-field"><label>Select Status</label><select value={consultantStatusData.status} onChange={(e) => setConsultantStatusData({ ...consultantStatusData, status: e.target.value })}><option value="">Select Status</option><option value="APPROVED">✅ Approved</option><option value="REJECTED">❌ Rejected</option><option value="ACTIVE">🟢 Active</option><option value="INACTIVE">⚪ Inactive</option><option value="BLOCKED">🔴 Blocked</option></select></div><div className="form-field"><label>Note (Optional)</label><textarea rows={3} placeholder="Add a note about this status change..." value={consultantStatusData.note} onChange={(e) => setConsultantStatusData({ ...consultantStatusData, note: e.target.value })} /></div><button className="btn-msub" onClick={handleUpdateConsultantStatus}>Update Status</button></div></div></div>
//       )}

//       {/* Convert to Employee Modal */}
//       {showConvertToEmployeeModal && selectedConsultant && (
//         <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowConvertToEmployeeModal(false)}>✕</button><h2>Convert to Employee</h2><p>Converting: <strong>{selectedConsultant.name}</strong></p><div className="m-form"><div className="form-field"><label>Position Name *</label><input type="text" placeholder="e.g., Project Manager" value={convertEmployeeData.positionName} onChange={(e) => setConvertEmployeeData({ ...convertEmployeeData, positionName: e.target.value })} /></div><div className="form-field"><label>Salary (per month) *</label><input type="number" placeholder="e.g., 85000" value={convertEmployeeData.salary || ''} onChange={(e) => setConvertEmployeeData({ ...convertEmployeeData, salary: parseInt(e.target.value) || 0 })} /></div><div className="form-field"><label>Skillset (Optional)</label><input type="text" placeholder="e.g., Project Management, Agile, Java" value={convertEmployeeData.skillSet} onChange={(e) => setConvertEmployeeData({ ...convertEmployeeData, skillSet: e.target.value })} /></div><button className="btn-msub" onClick={handleConvertToEmployee}>Convert to Employee</button></div></div></div>
//       )}

//       {/* Project Approval Modal */}
//       {showProjectApproveModal && selectedProject && (
//         <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowProjectApproveModal(false)}>✕</button><h2>Review Project</h2><p><strong>{selectedProject.projectName}</strong></p><div className="m-form"><div className="form-field"><label>Decision</label><select value={approveProjectData.status} onChange={(e) => setApproveProjectData({ ...approveProjectData, status: e.target.value })}><option value="APPROVED">✅ Approve Project</option><option value="REJECTED">❌ Reject Project</option></select></div><div className="form-field"><label>Director's Note</label><textarea rows={3} placeholder="Add your review notes..." value={approveProjectData.note} onChange={(e) => setApproveProjectData({ ...approveProjectData, note: e.target.value })} /></div><button className="btn-msub" onClick={handleApproveProject}>Submit Decision</button></div></div></div>
//       )}

//       {/* Assign Manager Modal */}
//       {showAssignManagerModal && selectedProject && (
//         <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowAssignManagerModal(false)}>✕</button><h2>Assign Project Manager</h2><p>Project: <strong>{selectedProject.projectName}</strong></p><div className="m-form"><div className="form-field"><label>Select Manager</label><select value={assignManagerData.managerId} onChange={(e) => setAssignManagerData({ ...assignManagerData, managerId: parseInt(e.target.value) || 0 })}><option value="0">Select a Manager</option>{employees.filter(e => e.positionName?.toLowerCase().includes('manager')).map(emp => (<option key={emp.userId} value={emp.userId}>{emp.name} - {emp.positionName}</option>))}</select></div><div className="form-field"><label>Deadline</label><input type="datetime-local" value={assignManagerData.deadline} onChange={(e) => setAssignManagerData({ ...assignManagerData, deadline: e.target.value })} /></div><div className="form-field"><label>Director Note (Optional)</label><textarea rows={2} placeholder="Additional instructions for the manager..." value={assignManagerData.directorNote} onChange={(e) => setAssignManagerData({ ...assignManagerData, directorNote: e.target.value })} /></div><button className="btn-msub" onClick={handleAssignManager}>Assign Manager</button></div></div></div>
//       )}

//       {/* Reassign Manager Modal */}
//       {showReassignManagerModal && selectedProject && (
//         <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowReassignManagerModal(false)}>✕</button><h2>Reassign Project Manager</h2><p>Project: <strong>{selectedProject.projectName}</strong></p><p>Current Manager: <strong>{selectedProject.assignedManagerName || 'None'}</strong></p><div className="m-form"><div className="form-field"><label>Select New Manager</label><select value={assignManagerData.managerId} onChange={(e) => setAssignManagerData({ ...assignManagerData, managerId: parseInt(e.target.value) || 0 })}><option value="0">Select a Manager</option>{employees.filter(e => e.positionName?.toLowerCase().includes('manager')).map(emp => (<option key={emp.userId} value={emp.userId}>{emp.name} - {emp.positionName}</option>))}</select></div><div className="form-field"><label>New Deadline</label><input type="datetime-local" value={assignManagerData.deadline} onChange={(e) => setAssignManagerData({ ...assignManagerData, deadline: e.target.value })} /></div><div className="form-field"><label>Director Note (Optional)</label><textarea rows={2} placeholder="Reason for reassignment and instructions..." value={assignManagerData.directorNote} onChange={(e) => setAssignManagerData({ ...assignManagerData, directorNote: e.target.value })} /></div><button className="btn-msub" onClick={handleReassignManager}>Reassign Manager</button></div></div></div>
//       )}

//       {/* Project Detail Modal with Files, Teams, AI Analysis, Reassign */}
//       {showProjectDetailModal && selectedProject && (
//         <div className="modal-mask open"><div className="modal-box large"><button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button><h2>{selectedProject.projectName}</h2><div className="m-tabs"><button className={`m-tab ${activeModalTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveModalTab('overview')}>Overview</button><button className={`m-tab ${activeModalTab === 'history' ? 'active' : ''}`} onClick={() => setActiveModalTab('history')}>History</button><button className={`m-tab ${activeModalTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveModalTab('teams')}>Teams</button><button className={`m-tab ${activeModalTab === 'files' ? 'active' : ''}`} onClick={() => setActiveModalTab('files')}>Files</button><button className={`m-tab ${activeModalTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveModalTab('ai')}>AI Analysis</button></div>

//           <div className="m-tab-content" style={{ display: activeModalTab === 'overview' ? 'block' : 'none' }}><div className="project-detail-section"><div className="detail-row"><label>Status:</label>{getStatusBadge(selectedProject.status)}</div><div className="detail-row"><label>Description:</label><p>{selectedProject.projectDescription || 'No description'}</p></div><div className="detail-grid"><div><label>Type:</label> {selectedProject.projectType || 'N/A'}</div><div><label>Department:</label> {selectedProject.departmentName}</div><div><label>Client:</label> {selectedProject.clientName || 'N/A'}</div><div><label>Manager:</label> {selectedProject.assignedManagerName || 'Not assigned'}</div><div><label>Deadline:</label> {selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : 'Not set'}</div></div>{selectedProject.directorNote && <div className="detail-row"><label>Director Note:</label><p>{selectedProject.directorNote}</p></div>}<div className="modal-actions">{selectedProject.status === 'APPROVED' && !selectedProject.assignedManagerId && (<button className="btn-primary" onClick={() => { setShowProjectDetailModal(false); setShowAssignManagerModal(true); }}>Assign Manager</button>)}{selectedProject.status === 'APPROVED' && selectedProject.assignedManagerId && (<button className="btn-primary" onClick={() => { setShowProjectDetailModal(false); setShowReassignManagerModal(true); }}>Reassign Manager</button>)}<button className="btn-outline" onClick={() => handleAIAnalyzeProject(selectedProject.projectId)}>🤖 Run AI Analysis</button></div></div></div>

//           <div className="m-tab-content" style={{ display: activeModalTab === 'history' ? 'block' : 'none' }}><div className="vscode-timeline">{projectHistory.length === 0 ? <div className="empty-state-small">No history available</div> : projectHistory.map((entry, idx) => (<div key={entry.statusId} className="timeline-entry"><div className="timeline-line"><div className="timeline-connector"><div className="timeline-dot" style={{ backgroundColor: statusConfig[entry.status]?.color || '#6B7280' }}></div>{idx < projectHistory.length - 1 && <div className="timeline-vertical-line"></div>}</div></div><div className="timeline-content"><div className="commit-header"><div className="commit-date"><span className="date-icon">📅</span><span className="date-text">{formatDate(entry.dateTime)}</span></div></div><div className="commit-message"><div className="commit-title">Status: {statusConfig[entry.status]?.label || entry.status}</div><div className="commit-meta"><span className="meta-author">👤 Handled by: {entry.handledByName}</span>{entry.assignedToName && <span className="meta-assignee">📌 Assigned to: {entry.assignedToName}</span>}</div>{entry.directorNote && <div className="commit-description director"><span className="description-icon">🎯</span><span className="description-text"><strong>Director Note:</strong> {entry.directorNote}</span></div>}{entry.managerNote && <div className="commit-description"><span className="description-icon">📝</span><span className="description-text"><strong>Manager Note:</strong> {entry.managerNote}</span></div>}</div></div></div>))}</div></div>

//           <div className="m-tab-content" style={{ display: activeModalTab === 'teams' ? 'block' : 'none' }}>{projectTeams.length === 0 ? <div className="empty-state-small">No teams assigned yet</div> : projectTeams.map(team => (<div key={team.teamId} className="team-section"><h3>{team.teamName}</h3><div className="team-manager">Manager: {team.managerName}</div><div className="team-members">{team.members.map((member, idx) => (<div key={idx} className="team-member"><div className="member-avatar">{member.memberName.charAt(0)}</div><div className="member-info"><div className="member-name">{member.memberName}</div><div className="member-role">{member.role}</div><div className="member-email">{member.memberEmail}</div></div></div>))}</div></div>))}</div>

//           <div className="m-tab-content" style={{ display: activeModalTab === 'files' ? 'block' : 'none' }}><div className="upload-section"><input type="file" id="fileUpload" onChange={(e) => { if (e.target.files?.[0]) handleFileUpload(selectedProject.projectId, e.target.files[0], 'Document'); }} /><button className="btn-primary" onClick={() => document.getElementById('fileUpload')?.click()}>📤 Upload File</button><select id="fileTypeSelect"><option value="Document">📄 Document</option><option value="Image">🖼️ Image</option><option value="Code">💻 Code</option><option value="Report">📊 Report</option></select></div><div className="files-list">{projectFiles.length === 0 ? <div className="empty-state-small">No files uploaded yet</div> : projectFiles.map(file => (<div key={file.fileId} className="file-item"><div className="file-icon">📄</div><div className="file-info"><div className="file-name">{file.fileLink?.split('/').pop() || 'File'}</div><div className="file-meta"><span className="file-type">{file.fileType}</span><span>Uploaded by {file.uploaderName}</span>{file.uploadTime && <span>{formatDate(file.uploadTime)}</span>}</div></div><div className="file-actions"><button className="btn-icon" onClick={() => handleFileView(file.fileId)}>👁️ View</button><button className="btn-icon" onClick={() => handleFileDownload(file.fileId)}>📥 Download</button><button className="btn-icon danger" onClick={() => handleDeleteFile(file.fileId, selectedProject.projectId)}>🗑️ Delete</button></div></div>))}</div></div>

//           <div className="m-tab-content" style={{ display: activeModalTab === 'ai' ? 'block' : 'none' }}><div className="ai-section">{aiLoading ? <div className="loading-spinner"></div> : aiAnalysisResult ? <div className="ai-analysis-text">{aiAnalysisResult}</div> : <div className="empty-state-small">Click "Run AI Analysis" in the Overview tab to get AI insights for this project.</div>}</div></div>
//         </div></div>
//       )}

//       {/* Assign Task Modal */}
//       {showAssignTaskModal && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowAssignTaskModal(false)}>✕</button><h2>Assign New Task</h2><div className="m-form"><div className="form-field"><label>Assign To</label><select value={assignTaskData.assignedToUserId} onChange={(e) => setAssignTaskData({ ...assignTaskData, assignedToUserId: parseInt(e.target.value) || 0 })}><option value="0">Select Employee</option>{employees.map(emp => (<option key={emp.userId} value={emp.userId}>{emp.name} - {emp.positionName}</option>))}</select></div><div className="form-field"><label>Task Description</label><textarea rows={3} placeholder="Describe the task..." value={assignTaskData.description} onChange={(e) => setAssignTaskData({ ...assignTaskData, description: e.target.value })} /></div><div className="form-field"><label>Deadline</label><input type="datetime-local" value={assignTaskData.deadline} onChange={(e) => setAssignTaskData({ ...assignTaskData, deadline: e.target.value })} /></div><button className="btn-msub" onClick={handleAssignTask}>Assign Task</button></div></div></div>)}

//       {/* Update Task Modal */}
//       {showTaskUpdateModal && selectedTask && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowTaskUpdateModal(false)}>✕</button><h2>Update Task Status</h2><p><strong>{selectedTask.description}</strong></p><div className="m-form"><div className="form-field"><label>Current Status</label><select value={updateTaskStatusData.status} onChange={(e) => setUpdateTaskStatusData({ status: e.target.value })}><option value="">Select Status</option><option value="PENDING">⏳ Pending</option><option value="IN_PROGRESS">🔄 In Progress</option><option value="COMPLETED">✅ Completed</option></select></div><button className="btn-msub" onClick={handleUpdateTask}>Update Status</button></div></div></div>)}

//       {/* AI Analyze Modal */}
//       {showAIAnalyzeModal && aiAnalysisResult && (<div className="modal-mask open"><div className="modal-box large ai-analysis-modal"><button className="m-close" onClick={() => { setShowAIAnalyzeModal(false); setAiAnalysisResult(null); }}>✕</button><div className="ai-modal-header"><div className="ai-icon-spin">🤖</div><h2>AI Project Analysis</h2></div><div className="ai-section"><div className="ai-analysis-text">{aiAnalysisResult}</div></div><div className="modal-actions"><button className="btn-primary" onClick={() => setShowAIAnalyzeModal(false)}>Close</button></div></div></div>)}

//       <style jsx>{`
//         .pending-project-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; transition: all 0.3s ease; position: relative; overflow: hidden; }
//         .pending-project-card::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(135deg, #f39c12, #e67e22); border-radius: 20px 0 0 20px; }
//         .pending-project-card:hover { transform: translateX(4px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
//         .pending-project-info { flex: 2; }
//         .pending-project-info h3 { font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem; }
//         .pending-project-info p { font-size: 0.85rem; color: var(--muted); margin-bottom: 0.8rem; }
//         .meta-row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; }
//         .meta-row span { font-size: 0.75rem; padding: 0.25rem 0.6rem; background: var(--surface); border-radius: 20px; }
//         .pending-project-actions { display: flex; gap: 0.8rem; }
//         .btn-success { background: linear-gradient(135deg, #27ae60, #229954); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.3s; }
//         .btn-success:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(39,174,96,0.3); }
//         .tasks-list { display: flex; flex-direction: column; gap: 0.5rem; }
//         .client-loader { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 1rem; }
//         .loader-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--teal); border-radius: 50%; animation: spin 0.8s linear infinite; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         .client-main { flex: 1; margin-left: 280px; padding: 1.5rem; min-height: 100vh; }
//         @media (max-width: 768px) { .client-main { margin-left: 0; padding: 1rem; } .sidebar { transform: translateX(-100%); } .sidebar.open { transform: translateX(0); } .mobile-menu-btn { display: flex; } .pending-project-card { flex-direction: column; align-items: flex-start; } .pending-project-actions { width: 100%; justify-content: flex-end; } }
//         .btn-outline-sm { padding: 0.3rem 0.8rem; border-radius: 40px; border: 1px solid var(--border); background: transparent; font-size: 0.7rem; cursor: pointer; transition: 0.2s; }
//         .btn-outline-sm:hover { border-color: var(--teal); color: var(--teal); }
//         .btn-icon { padding: 0.3rem 0.6rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; font-size: 0.7rem; transition: 0.2s; }
//         .btn-icon:hover { background: var(--bg); border-color: var(--teal); }
//         .full-width { grid-column: 1 / -1; }
//         .vscode-timeline { max-height: 500px; overflow-y: auto; padding: 1rem 0; }
//         .timeline-entry { display: flex; gap: 1rem; position: relative; }
//         .timeline-line { width: 40px; flex-shrink: 0; }
//         .timeline-connector { display: flex; flex-direction: column; align-items: center; min-height: 100%; }
//         .timeline-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--card-bg); z-index: 2; }
//         .timeline-vertical-line { width: 2px; flex: 1; background: var(--border); margin: 4px 0; min-height: 40px; }
//         .timeline-content { flex: 1; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 0.9rem; margin-bottom: 0.8rem; }
//         .commit-header { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 0.6rem; padding-bottom: 0.6rem; border-bottom: 1px solid var(--border); }
//         .commit-date { font-size: 0.75rem; color: var(--muted); }
//         .commit-title { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; }
//         .commit-meta { display: flex; gap: 0.8rem; flex-wrap: wrap; font-size: 0.7rem; }
//               .commit-description { display: flex; gap: 0.4rem; padding: 0.5rem 0.6rem; background: var(--surface); border-left: 2px solid var(--teal); border-radius: 4px; margin-top: 0.4rem; font-size: 0.75rem; }
//         .commit-description.director { border-left-color: var(--orange); }
//         .skills-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
//         .skill-tag { background: rgba(44, 166, 164, 0.1); padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.7rem; }
//         .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
//         .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 1.2rem; display: flex; align-items: center; gap: 1rem; transition: transform 0.2s; }
//         .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
//         .stat-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; }
//         .stat-icon.blue { background: rgba(31, 109, 168, 0.1); }
//         .stat-icon.orange { background: rgba(245, 124, 0, 0.1); }
//         .stat-icon.green { background: rgba(52, 168, 83, 0.1); }
//         .stat-icon.purple { background: rgba(106, 90, 205, 0.1); }
//         .stat-icon.teal { background: rgba(44, 166, 164, 0.1); }
//         .stat-info .stat-value { font-size: 2rem; font-weight: 800; line-height: 1; color: var(--text2); }
//         .stat-info .stat-label { font-size: 0.75rem; color: var(--muted); display: block; }
//         .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
//         .project-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 1rem; transition: all 0.2s; }
//         .project-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
//         .project-card-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem; }
//         .project-card-header h3 { font-size: 1rem; font-weight: 700; color: var(--text2); margin: 0; }
//         .project-card-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.8rem; }
//         .project-card-meta { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 0.6rem; font-size: 0.7rem; color: var(--muted); }
//         .project-card-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
//         .btn-sm { padding: 0.4rem 0.9rem; border-radius: 40px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: 0.2s; border: none; }
//         .btn-primary { background: var(--g-main); color: white; }
//         .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(44, 166, 164, 0.4); }
//         .btn-outline { background: transparent; border: 1.5px solid var(--border); color: var(--text2); }
//         .btn-outline:hover { border-color: var(--teal); color: var(--teal); }
//         .btn-danger { background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.3s; }
//         .btn-danger:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(231,76,60,0.3); }
//         .status-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
//         .status-pending { background: rgba(245, 124, 0, 0.1); color: var(--orange); }
//         .status-approved { background: rgba(52, 168, 83, 0.1); color: var(--green); }
//         .status-rejected { background: rgba(231, 76, 60, 0.1); color: var(--red); }
//         .status-progress { background: rgba(44, 166, 164, 0.1); color: var(--teal); }
//         .status-completed { background: rgba(52, 168, 83, 0.1); color: var(--green); }
//         .dashboard-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; }
//         .dashboard-card.full-width { width: 100%; }
//         .card-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
//         .card-header h2 { font-size: 1.2rem; font-weight: 800; margin: 0; color: var(--text2); }
//         .view-all-link { margin-top: 0; color: var(--teal); background: none; border: none; cursor: pointer; font-size: 0.8rem; }
//         .view-all-link:hover { text-decoration: underline; }
//         .search-input, .filter-select { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); font-size: 0.8rem; color: var(--text2); outline: none; transition: 0.2s; }
//         .search-input:focus, .filter-select:focus { border-color: var(--teal); }
//         .header-filters { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
//         .emp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
//         .card { background: var(--bg2); border: 1px solid var(--border); border-radius: 18px; padding: 1.3rem; transition: all 0.3s ease; position: relative; overflow: hidden; }
//         .card:hover { transform: translateY(-6px); box-shadow: 0 14px 28px rgba(0,0,0,0.08); border-color: rgba(44,166,164,0.3); }
//         .card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--g-main); opacity: 0; transition: 0.3s; }
//         .card:hover::before { opacity: 1; }
//         .emp-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
//         .emp-avatar { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: white; }
//         .emp-avatar.verified { background: linear-gradient(135deg, #2ca6a4, #1e7a78); }
//         .emp-avatar.pending { background: linear-gradient(135deg, #f39c12, #e67e22); }
//         .avatar-img { width: 100%; height: 100%; border-radius: 14px; object-fit: cover; }
//         .emp-header h3 { margin: 0; font-size: 1rem; color: var(--text2); }
//         .dept-badge { display: inline-block; margin-top: 4px; padding: 3px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; background: rgba(44,166,164,0.12); color: var(--teal); }
//         .emp-body { margin-top: 1rem; }
//         .emp-row { display: flex; justify-content: space-between; align-items: center; margin: 10px 0; font-size: 0.85rem; color: var(--text2); }
//         .skills { display: flex; gap: 6px; flex-wrap: wrap; }
//         .skill { padding: 4px 8px; border-radius: 999px; font-size: 0.7rem; background: rgba(31,109,168,0.1); color: var(--blue); }
//         .salary { font-weight: 700; background: linear-gradient(135deg, var(--green), var(--teal)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
//         .emp-footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; }
//         .footer-actions { display: flex; gap: 0.5rem; }
//         .btn-icon-small { background: transparent; border: 1px solid var(--border); border-radius: 8px; padding: 0.3rem 0.6rem; cursor: pointer; font-size: 0.7rem; transition: 0.2s; color: var(--text); }
//         .btn-icon-small:hover { background: var(--surface); transform: scale(1.05); }
//         .btn-icon-small.success:hover { background: #2ca6a4; border-color: #2ca6a4; color: white; }
//         .data-table { width: 100%; border-collapse: collapse; }
//         .data-table th, .data-table td { padding: 0.8rem; text-align: left; border-bottom: 1px solid var(--border); }
//         .data-table th { font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; background: var(--surface); }
//         .task-desc-cell { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .task-actions { display: flex; gap: 0.5rem; }
//         .ai-assistant-container { padding: 1rem 0; }
//         .ai-suggest-form { display: flex; flex-direction: column; gap: 1.5rem; }
//         .form-group { margin-bottom: 1.2rem; }
//         .form-group label { display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
//         .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.7rem 1rem; background: var(--surface); border: 1.5px solid var(--border); border-radius: 12px; font-size: 0.85rem; color: var(--text2); font-family: inherit; transition: 0.2s; }
//         .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--teal); }
//         .ai-section { background: var(--surface); border-radius: 16px; padding: 1.25rem; margin-bottom: 1.25rem; border: 1px solid var(--border); transition: all 0.3s ease; }
//         .ai-suggestion-text, .ai-analysis-text { font-size: 0.9rem; line-height: 1.6; color: var(--text2); white-space: pre-wrap; }
//         .profile-info { display: flex; gap: 2rem; flex-wrap: wrap; margin-top: 1rem; }
//         .profile-avatar-large { width: 100px; height: 100px; border-radius: 24px; overflow: hidden; background: var(--g-main); display: flex; align-items: center; justify-content: center; }
//         .profile-avatar-large img { width: 100%; height: 100%; object-fit: cover; }
//         .avatar-placeholder { font-size: 2.5rem; font-weight: 900; color: white; }
//         .profile-details { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
//         .detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
//         .detail-item label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--muted); letter-spacing: 0.5px; }
//         .detail-item span { font-size: 0.9rem; color: var(--text2); word-break: break-word; }
//         .modal-mask { display: flex; position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 1rem; }
//         .modal-box { background: var(--card-bg); border-radius: 24px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding: 1.5rem; position: relative; }
//         .modal-box.large { max-width: 800px; }
//         .m-close { position: absolute; top: 1rem; right: 1rem; width: 32px; height: 32px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
//         .m-close:hover { background: var(--red); border-color: var(--red); color: white; }
//         .modal-box h2 { font-family: var(--font-h); font-size: 1.3rem; font-weight: 900; margin-bottom: 0.5rem; color: var(--text2); }
//         .m-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; flex-wrap: wrap; }
//         .m-tab { padding: 0.5rem 1rem; background: none; border: none; cursor: pointer; font-weight: 600; color: var(--muted); border-radius: 8px; transition: 0.2s; }
//         .m-tab.active { background: var(--g-main); color: white; }
//         .m-tab:hover:not(.active) { background: var(--surface); color: var(--teal); }
//         .m-tab-content { padding: 1rem 0; }
//         .btn-msub { padding: 0.75rem; background: var(--g-main); color: white; border: none; border-radius: 40px; font-weight: 700; cursor: pointer; width: 100%; margin-top: 1rem; transition: 0.2s; }
//         .btn-msub:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(44,166,164,0.38); }
//         .form-field { margin-bottom: 1rem; }
//         .form-field label { display: block; font-size: 0.7rem; font-weight: 600; margin-bottom: 0.3rem; color: var(--muted); text-transform: uppercase; }
//         .form-field input, .form-field select, .form-field textarea { width: 100%; padding: 0.6rem 0.8rem; background: var(--surface); border: 1.5px solid var(--border); border-radius: 10px; font-size: 0.85rem; color: var(--text2); font-family: inherit; }
//         .detail-row { margin-bottom: 0.8rem; }
//         .detail-row label { font-weight: 600; color: var(--muted); min-width: 100px; display: inline-block; font-size: 0.75rem; }
//         .detail-row p { margin-top: 0.2rem; color: var(--text2); font-size: 0.85rem; }
//         .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.8rem; margin-top: 0.5rem; }
//         .detail-grid div label { font-size: 0.7rem; font-weight: 600; color: var(--muted); display: block; margin-bottom: 0.2rem; text-transform: uppercase; }
//         .detail-grid div span { font-size: 0.85rem; color: var(--text2); }
//         .team-section { margin-bottom: 1.5rem; }
//         .team-section h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--teal); }
//         .team-manager { font-size: 0.8rem; color: var(--teal); margin-bottom: 0.8rem; }
//         .team-members { display: flex; flex-direction: column; gap: 0.5rem; }
//         .team-member { display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: var(--surface); border-radius: 10px; }
//         .member-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--g-main); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.2rem; }
//         .member-info { flex: 1; }
//         .member-name { font-weight: 600; font-size: 0.85rem; color: var(--text2); }
//         .member-role { font-size: 0.7rem; color: var(--teal); }
//         .member-email { font-size: 0.65rem; color: var(--muted); }
//         .upload-section { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); align-items: center; }
//         .upload-section input, .upload-section select { padding: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text2); }
//         .files-list { display: flex; flex-direction: column; gap: 0.5rem; }
//         .file-item { display: flex; align-items: center; gap: 1rem; padding: 0.8rem; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; transition: all 0.2s; }
//         .file-item:hover { transform: translateX(4px); }
//         .file-icon { font-size: 1.5rem; }
//         .file-info { flex: 1; }
//         .file-name { font-weight: 600; font-size: 0.85rem; color: var(--text2); margin-bottom: 0.2rem; }
//         .file-meta { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.7rem; color: var(--muted); }
//         .file-type { color: var(--teal); text-transform: uppercase; }
//         .file-actions { display: flex; gap: 0.3rem; }
//         .btn-icon.danger:hover { border-color: var(--red); color: var(--red); }
//         .empty-state { text-align: center; padding: 3rem; color: var(--muted); }
//         .empty-state-small { text-align: center; padding: 1rem; color: var(--muted); font-size: 0.8rem; }
//         .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; opacity: 0.5; }
//         .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border); }
//         .loading-spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.6s linear infinite; margin-right: 8px; }
//         .client-footer { margin-top: 2rem; padding: 1.5rem; border-top: 1px solid var(--border); text-align: center; color: var(--muted); font-size: 0.8rem; }
//         .mobile-menu-btn { display: none; position: fixed; bottom: 1.5rem; right: 1.5rem; width: 50px; height: 50px; border-radius: 50%; background: var(--g-main); border: none; color: white; font-size: 1.5rem; cursor: pointer; z-index: 1001; box-shadow: 0 4px 12px rgba(0,0,0,0.15); align-items: center; justify-content: center; transition: all 0.2s; }
//         .mobile-menu-btn:hover { transform: scale(1.05); }
//         @media (max-width: 768px) { .mobile-menu-btn { display: flex; } .stats-grid { grid-template-columns: repeat(2, 1fr); } .projects-grid { grid-template-columns: 1fr; } .emp-grid { grid-template-columns: 1fr; } .m-tabs { flex-direction: column; } .m-tab { text-align: center; } .upload-section { flex-direction: column; } .upload-section input, .upload-section select, .upload-section button { width: 100%; } }
//         .sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 280px; background: var(--bg2); border-right: 1px solid var(--border); z-index: 200; display: flex; flex-direction: column; transition: transform 0.3s ease; }
//         @media (max-width: 768px) { .sidebar { transform: translateX(-100%); } .sidebar.open { transform: translateX(0); } .sidebar-overlay { display: block; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 199; } }
//         .sidebar-header { padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
//         .sidebar-logo { display: flex; align-items: center; gap: 0.75rem; }
//         .logo-icon { font-size: 1.5rem; }
//         .logo-text { font-family: var(--font-h); font-size: 1.1rem; font-weight: 800; background: var(--g-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
//         .theme-toggle-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
//         .theme-toggle-btn:hover { background: var(--teal); border-color: var(--teal); color: white; }
//         .sidebar-user { padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 1rem; }
//         .sidebar-avatar { width: 48px; height: 48px; border-radius: 50%; overflow: hidden; background: var(--g-main); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
//         .sidebar-avatar img { width: 100%; height: 100%; object-fit: cover; }
//         .sidebar-avatar .avatar-placeholder { color: white; font-size: 1.2rem; font-weight: bold; }
//         .sidebar-user-info h4 { font-size: 0.9rem; font-weight: 700; color: var(--text2); margin-bottom: 0.2rem; }
//         .sidebar-user-info p { font-size: 0.7rem; color: var(--muted); }
//         .sidebar-nav { flex: 1; padding: 1rem; display: flex; flex-direction: column; gap: 0.3rem; overflow-y: auto; }
//         .sidebar-nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 12px; background: transparent; color: var(--text2); font-size: 0.9rem; font-weight: 500; transition: 0.2s; cursor: pointer; width: 100%; text-align: left; }
//         .sidebar-nav-item:hover { background: var(--surface); color: var(--teal); }
//         .sidebar-nav-item.active { background: var(--g-main); color: white; }
//         .nav-icon { font-size: 1.2rem; }
//         .sidebar-footer { padding: 1rem; border-top: 1px solid var(--border); }
//         .sidebar-footer-btn { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 12px; background: transparent; color: var(--text2); font-size: 0.9rem; font-weight: 500; transition: 0.2s; cursor: pointer; width: 100%; text-align: left; }
//         .sidebar-footer-btn:hover { background: var(--surface); color: var(--teal); }
//         .sidebar-footer-btn.logout { color: var(--red); }
//         .sidebar-footer-btn.logout:hover { background: rgba(231,76,60,0.1); }
//         .client-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 1rem; }
//         .header-welcome h1 { font-family: var(--font-h); font-size: 1.5rem; font-weight: 800; color: var(--text2); margin-bottom: 0.2rem; }
//         .header-welcome p { color: var(--muted); font-size: 0.85rem; }
//         .header-stats { display: flex; gap: 1.5rem; flex-wrap: wrap; }
//         .header-stat-item { display: flex; flex-direction: column; align-items: flex-end; gap: 0.2rem; }
//         .header-stat-item .stat-label { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; }
//         .stat-value-sm { font-size: 0.9rem; font-weight: 600; color: var(--text2); }
//         .client-container { min-height: 100vh; background: var(--bg); display: flex; }
//         :root { --bg: #f5f7fc; --bg2: #ffffff; --surface: rgba(0,0,0,0.035); --border: #e0e6f0; --text: #0c1018; --text2: #1e2535; --muted: #5e6f8a; --shadow: 0 2px 16px rgba(0,0,0,0.07); --g-main: linear-gradient(135deg, #34A853, #2CA6A4, #1F6DA8); --teal: #2CA6A4; --green: #34A853; --blue: #1F6DA8; --orange: #F36C3D; --red: #E74C3C; --purple: #6A5ACD; --font-h: 'Fraunces', Georgia, serif; --font-b: 'DM Sans', system-ui, sans-serif; }
//         [data-theme="dark"] { --bg: #07090f; --bg2: #0d1118; --surface: rgba(255,255,255,0.045); --border: rgba(255,255,255,0.09); --text: #eef2ff; --text2: #c7d0e8; --muted: #8895b3; --shadow: 0 2px 16px rgba(0,0,0,0.4); }
//         * { margin: 0; padding: 0; box-sizing: border-box; }
//         body { font-family: var(--font-b); background: var(--bg); color: var(--text); overflow-x: hidden; transition: background 0.3s, color 0.3s; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: var(--bg); }
//         ::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 2px; }
//       `}</style>
//     </div>
//   );
// };

// export default CoreDirectorDashboard;