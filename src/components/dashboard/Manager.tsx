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
  emailVerified: boolean;
  isProfileCompleted: boolean;
  phoneNumber?: string;
  address?: string;
  gender?: string;
  dob?: string;
}

interface Employee {
  employeeId: number;
  isDirectorVerified: boolean;
  positionName: string;
  salary: number;
  department: string;
  skillSet: string;
  departmentId: number;
  departmentName: string;
}

interface MyDetails {
  user: UserProfile;
  roles: Role[];
  employee: Employee | null;
}

interface Role {
  id: number;
  ptype: string;
  stype: string;
  isApproved: string;
  createdAt: string;
}

interface Project {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectType: string;
  status: string;
  departmentId: number;
  departmentName: string;
  clientId: number;
  clientName: string;
  clientEmail: string;
  assignedManagerId: number;
  assignedManagerName: string;
  deadline: string;
  cost: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectHistory {
  statusId: number;
  projectId: number;
  projectName: string;
  status: string;
  dateTime: string;
  handledById: number;
  handledByName: string;
  assignedToId: number | null;
  assignedToName: string | null;
  directorNote: string | null;
  managerNote: string | null;
  deadline: string | null;
}

interface Task {
  taskId: number;
  projectId: number;
  projectName: string;
  assignedToUserId: number;
  assignedToUserName: string;
  assignedToUserPhoto: string | null;
  taskDetails: string;
  description: string;
  taskStatus: string;
  createdById: number;
  createdByName: string;
  deadline: string;
  managerNote: string | null;
  createdAt: string;
  updatedAt: string;
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

interface TeamMember {
  memberId: number;
  memberName: string;
  memberEmail: string;
  photoUrl: string | null;
  role: string;
  description: string | null;
}

interface ConsultantRequest {
  requestId: number;
  projectId: number;
  projectName: string;
  consultantId: number;
  consultantName: string;
  consultantEmail: string;
  consultantPhoto: string | null;
  skill: string;
  experience: string;
  marks10: number;
  marks12: number;
  graduationMarks: number;
  resumeLink: string;
  averageRating: number;
  totalReviews: number;
  requestedAt: string;
}

interface ConsultantWithRating {
  consultantId: number;
  userId: number;
  name: string;
  email: string;
  photoUrl: string | null;
  skill: string;
  experience: string;
  averageRating: number;
  totalReviews: number;
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
  projectId?: number;
  projectName?: string;
}

interface EmployeeTask {
  taskId: number;
  description: string;
  status: string;
  priority: string;
  createdByUserId: number;
  createdByName: string;
  createdByPhoto: string | null;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

interface EmailRecipient {
  userId: number;
  name: string;
  email: string;
  role: string;
  department: string;
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
// ALL MANAGER APIs
// ============================================

// Auth APIs
const checkIsManager = async () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/project/check/manager');
const getUserProfile = async () => apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
const updateUserProfile = async (data: any) => apiCall('PUT', '/api/users/profile', data);
const deleteAccount = async () => apiCall('DELETE', '/api/users/account');
const getMyDetails = async () => apiCall<{ success: boolean; data: MyDetails }>('GET', '/api/getmydetails');

// Project APIs
const getMyAssignedProjects = async () => apiCall<{ success: boolean; data: Project[] }>('GET', '/api/project/manager/my-projects');
const updateProjectStatus = async (projectId: number, status: string, note?: string) => {
  let url = `/api/project/manager/update-status/${projectId}?status=${status}`;
  if (note) url += `&note=${encodeURIComponent(note)}`;
  return apiCall('PUT', url);
};
const getProjectById = async (projectId: number) => apiCall<{ success: boolean; data: Project }>('GET', `/api/project/${projectId}`);
const getProjectHistory = async (projectId: number) => apiCall<{ success: boolean; data: ProjectHistory[] }>('GET', `/api/project/${projectId}/history`);
const getProjectTeams = async (projectId: number) => apiCall<{ success: boolean; data: Team[] }>('GET', `/api/team/project/${projectId}`);
const getProjectFiles = async (projectId: number) => apiCall<{ success: boolean; data: FileItem[] }>('GET', `/api/file/project/${projectId}`);

// Task APIs with datetime
const createTask = async (data: { projectId: number; assignedToUserId: number; taskDetails: string; description: string; deadline: string }) => apiCall('POST', '/api/task/create', data);
const updateTask = async (taskId: number, data: any) => apiCall('PUT', `/api/task/update/${taskId}`, data);
const deleteTask = async (taskId: number) => apiCall('DELETE', `/api/task/delete/${taskId}`);
const getMyCreatedTasks = async () => apiCall<{ success: boolean; data: Task[] }>('GET', '/api/task/my-created-tasks');
const getProjectTasks = async (projectId: number) => apiCall<{ success: boolean; data: Task[] }>('GET', `/api/task/project/${projectId}`);

// Team APIs - Full CRUD
const createTeam = async (data: { projectId: number; teamName: string; memberIds: number[]; memberRoles: string[] }) => apiCall('POST', '/api/team/create', data);
const addMemberToTeam = async (teamId: number, memberId: number, role: string) => apiCall('POST', `/api/team/${teamId}/add-member?memberId=${memberId}&role=${encodeURIComponent(role)}`);
const removeMemberFromTeam = async (teamId: number, memberId: number) => apiCall('DELETE', `/api/team/${teamId}/remove-member/${memberId}`);
const deleteTeam = async (teamId: number) => apiCall('DELETE', `/api/team/delete/${teamId}`);
const getMyTeams = async () => apiCall<{ success: boolean; data: Team[] }>('GET', '/api/team/my-teams');

// Consultant APIs
const getConsultantRequests = async () => apiCall<{ success: boolean; data: ConsultantRequest[] }>('GET', '/api/consultant-project/manager/requests');
const getMyDepartmentConsultants = async () => apiCall<{ success: boolean; data: ConsultantWithRating[] }>('GET', '/api/consultant-project/manager/my-department-consultants');
const rateConsultant = async (data: { consultantId: number; rating: number; feedback: string }) => apiCall('POST', '/api/consultant-project/manager/rate', data);
const getAIConsultantProfile = async (consultantId: number) => apiCall('GET', `/api/ai/consultant/profile?consultantId=${consultantId}`);

// Employee Tasks APIs
const getEmployeeTasks = async () => apiCall<{ success: boolean; data: EmployeeTask[] }>('GET', '/api/employee/my-tasks');
const updateEmployeeTaskStatus = async (taskId: number, status: string, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/status`, { status, note });
const completeEmployeeTask = async (taskId: number, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/complete`, { note });

// Email APIs
const getEmailRecipients = async () => apiCall<{ success: boolean; data: EmailRecipient[] }>('GET', '/api/email/recipients/my-department-consultants');
const sendEmail = async (data: { userIds: number[]; subject: string; message: string; messageType: string }) => apiCall('POST', '/api/email/send', data);

// AI APIs
const getAISuggestConsultant = async (data: { taskName: string; taskDescription: string; projectId: number }) => apiCall('POST', '/api/ai/suggest-consultant-for-task', data);

// File APIs
const uploadFile = async (projectId: number, file: File, fileType: string) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiCall('POST', `/api/file/upload/${projectId}?fileType=${fileType}`, formData, true);
};
const getMyUploads = async () => apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/my-uploads');
const deleteFile = async (fileId: number) => apiCall('DELETE', `/api/file/delete/${fileId}`);
const getAccessToken = async (fileId: number) => apiCall('POST', `/api/file/access-token/${fileId}`, {});

// ============================================
// SIDEBAR MENU ITEMS
// ============================================

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'my-projects', label: 'My Projects', icon: '📁' },
  { id: 'consultant-requests', label: 'Consultant Requests', icon: '📨' },
  { id: 'consultants', label: 'Consultants', icon: '👥' },
  { id: 'my-teams', label: 'My Teams', icon: '👥' },
  { id: 'my-tasks', label: 'My Created Tasks', icon: '✅' },
  { id: 'assigned-tasks', label: 'Assigned to Me', icon: '📋' },
  { id: 'ai-suggest', label: 'AI Suggest', icon: '🤖' },
  { id: 'email', label: 'Email Consultants', icon: '✉️' },
  { id: 'uploads', label: 'Uploads', icon: '📎' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

const statusConfig: Record<string, { label: string; class: string; icon: string }> = {
  PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳' },
  ASSIGNED: { label: 'Assigned', class: 'status-assigned', icon: '👥' },
  IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄' },
  COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️' },
  REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '❌' },
  APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅' },
};

const getStatusBadge = (status: string) => {
  const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌' };
  return React.createElement('span', { className: `status-badge ${config.class}` },
    React.createElement('span', { className: 'status-icon' }, config.icon),
    config.label
  );
};

// Loading Button Component
const LoadingButton: React.FC<{ onClick: () => Promise<void>; children: React.ReactNode; className?: string; disabled?: boolean }> = ({ onClick, children, className = '', disabled = false }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };
  return React.createElement('button', { className, onClick: handleClick, disabled: loading || disabled },
    loading ? React.createElement('span', { className: 'loading-spinner-small' }) : children
  );
};

// Shimmer Loader
const ShimmerLoader: React.FC = () => (
  React.createElement('div', { className: 'shimmer-wrapper' },
    React.createElement('div', { className: 'shimmer-card' },
      React.createElement('div', { className: 'shimmer-line shimmer-line-lg' }),
      React.createElement('div', { className: 'shimmer-line shimmer-line-md' }),
      React.createElement('div', { className: 'shimmer-line shimmer-line-sm' })
    ),
    React.createElement('div', { className: 'shimmer-card' },
      React.createElement('div', { className: 'shimmer-line shimmer-line-lg' }),
      React.createElement('div', { className: 'shimmer-line shimmer-line-md' }),
      React.createElement('div', { className: 'shimmer-line shimmer-line-sm' })
    )
  )
);

// AI Profile Modal
const AIConsultantProfileModal: React.FC<{ consultant: ConsultantWithRating; onClose: () => void }> = ({ consultant, onClose }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAIConsultantProfile(consultant.consultantId)
      .then(result => { setProfile(result); setLoading(false); })
      .catch(err => { setError(err.message || 'Failed to fetch AI profile'); setLoading(false); });
  }, [consultant.consultantId]);

  return React.createElement('div', { className: 'modal-mask open' },
    React.createElement('div', { className: 'modal-box ai-profile-modal-box' },
      React.createElement('button', { className: 'm-close', onClick: onClose }, '✕'),
      React.createElement('div', { className: 'ai-profile-header' },
        React.createElement('div', { className: 'ai-glow-icon' }, '🧠'),
        React.createElement('h2', null, 'AI Consultant Intelligence')
      ),
      React.createElement('div', { className: 'ai-profile-consultant' },
        React.createElement('div', { className: 'ai-profile-avatar' }, consultant.name.charAt(0)),
        React.createElement('div', null,
          React.createElement('h3', null, consultant.name),
          React.createElement('p', null, consultant.skill),
          React.createElement('div', { className: 'rating-badge' }, `⭐ ${consultant.averageRating.toFixed(1)} / 5 (${consultant.totalReviews} reviews)`)
        )
      ),
      loading ? React.createElement('div', { className: 'ai-loading-state' },
        React.createElement('div', { className: 'ai-wave-animation' }),
        React.createElement('p', null, 'Analyzing...')
      ) : error ? React.createElement('div', { className: 'ai-error-state' },
        React.createElement('span', null, '⚠️'),
        React.createElement('p', null, error)
      ) : profile && profile.status === 'success' ? React.createElement('div', { className: 'ai-result-card' },
        React.createElement('div', { className: 'ai-result-icon' }, '🤖'),
        React.createElement('div', { className: 'ai-result-text' },
          React.createElement('h4', null, 'AI Analysis'),
          React.createElement('p', null, profile.data.text)
        )
      ) : React.createElement('div', { className: 'ai-error-state' },
        React.createElement('span', null, '❌'),
        React.createElement('p', null, 'No data available')
      ),
      React.createElement('div', { className: 'modal-actions' },
        React.createElement('button', { className: 'btn-primary', onClick: onClose }, 'Close')
      )
    )
  );
};

// Timeline History Component
const TimelineHistory: React.FC<{ history: ProjectHistory[] }> = ({ history }) => {
  const sorted = [...history].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  return React.createElement('div', { className: 'timeline-container' },
    sorted.map((entry, idx) => React.createElement('div', { key: entry.statusId, className: `timeline-item ${idx === 0 ? 'latest' : ''}` },
      React.createElement('div', { className: 'timeline-dot' }),
      React.createElement('div', { className: 'timeline-content' },
        React.createElement('div', { className: 'timeline-header' },
          React.createElement('span', { className: 'timeline-status' }, getStatusBadge(entry.status)),
          React.createElement('span', { className: 'timeline-date' }, new Date(entry.dateTime).toLocaleString())
        ),
        React.createElement('div', { className: 'timeline-body' },
          React.createElement('div', { className: 'timeline-actor' }, React.createElement('span', null, '👤'), ' ', entry.handledByName),
          entry.managerNote && React.createElement('div', { className: 'timeline-note' }, React.createElement('span', null, '📝'), ' ', entry.managerNote),
          entry.directorNote && React.createElement('div', { className: 'timeline-note director' }, React.createElement('span', null, '👔'), ' Director: ', entry.directorNote),
          entry.assignedToName && React.createElement('div', { className: 'timeline-assigned' }, React.createElement('span', null, '👥'), ' Assigned to: ', entry.assignedToName),
          entry.deadline && React.createElement('div', { className: 'timeline-deadline' }, React.createElement('span', null, '📅'), ' Deadline: ', new Date(entry.deadline).toLocaleString())
        )
      )
    ))
  );
};

// Main Component
const Manager: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [myDetails, setMyDetails] = useState<MyDetails | null>(null);
  const [isManager, setIsManager] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { logout } = useAuth();

  // Data states
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [consultantRequests, setConsultantRequests] = useState<ConsultantRequest[]>([]);
  const [consultants, setConsultants] = useState<ConsultantWithRating[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [myCreatedTasks, setMyCreatedTasks] = useState<Task[]>([]);
  const [employeeTasks, setEmployeeTasks] = useState<EmployeeTask[]>([]);
  const [myUploads, setMyUploads] = useState<FileItem[]>([]);
  const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Modal states
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
  const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showRateConsultantModal, setShowRateConsultantModal] = useState(false);
  const [showAIProfileModal, setShowAIProfileModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEmployeeTaskModal, setShowEmployeeTaskModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('overview');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedTeamForMember, setSelectedTeamForMember] = useState<Team | null>(null);

  // Selected items
  const [selectedProjectFiles, setSelectedProjectFiles] = useState<FileItem[]>([]);
  const [selectedProjectHistory, setSelectedProjectHistory] = useState<ProjectHistory[]>([]);
  const [selectedProjectTeams, setSelectedProjectTeams] = useState<Team[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<ConsultantWithRating | null>(null);
  const [selectedEmployeeTask, setSelectedEmployeeTask] = useState<EmployeeTask | null>(null);
  const [selectedConsultantForAI, setSelectedConsultantForAI] = useState<ConsultantWithRating | null>(null);

  // Form states
  const [updateProjectData, setUpdateProjectData] = useState({ status: '', note: '' });
  const [createTaskData, setCreateTaskData] = useState({ projectId: 0, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
  const [editTaskData, setEditTaskData] = useState({ taskDetails: '', description: '', managerNote: '', taskStatus: '' });
  const [createTeamData, setCreateTeamData] = useState({ projectId: 0, teamName: '', memberIds: [] as number[], memberRoles: [] as string[] });
  const [rateConsultantData, setRateConsultantData] = useState({ rating: 0, feedback: '' });
  const [uploadFileData, setUploadFileData] = useState({ file: null as File | null, fileType: '', projectId: 0 });
  const [employeeTaskNote, setEmployeeTaskNote] = useState('');
  const [employeeTaskStatus, setEmployeeTaskStatus] = useState('');
  const [aiSuggestData, setAiSuggestData] = useState({ taskName: '', taskDescription: '', projectId: 0 });
  const [aiSuggestResult, setAiSuggestResult] = useState('');
  const [emailData, setEmailData] = useState({ userIds: [] as number[], subject: '', message: '', messageType: 'INFORMATION' });
  const [taskFilter, setTaskFilter] = useState('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Add member form states
  const [addMemberConsultantId, setAddMemberConsultantId] = useState(0);
  const [addMemberRole, setAddMemberRole] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') { setDarkMode(true); document.documentElement.setAttribute('data-theme', 'dark'); }
    loadInitialData();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const getFormattedDateTime = () => new Date().toISOString().slice(0, 16);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [profileRes, detailsRes, managerCheckRes] = await Promise.all([
        getUserProfile().catch(() => ({ data: null })),
        getMyDetails().catch(() => ({ data: null })),
        checkIsManager().catch(() => ({ data: false })),
      ]);
      setUser(profileRes.data);
      setMyDetails(detailsRes.data);
      setIsManager(managerCheckRes.data || false);
      if (managerCheckRes.data) await loadAllData();
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const loadAllData = async () => {
    try {
      const [projectsRes, requestsRes, consultantsRes, teamsRes, tasksRes, empTasksRes, uploadsRes, emailRes] = await Promise.all([
        getMyAssignedProjects().catch(() => ({ data: [] })),
        getConsultantRequests().catch(() => ({ data: [] })),
        getMyDepartmentConsultants().catch(() => ({ data: [] })),
        getMyTeams().catch(() => ({ data: [] })),
        getMyCreatedTasks().catch(() => ({ data: [] })),
        getEmployeeTasks().catch(() => ({ data: [] })),
        getMyUploads().catch(() => ({ data: [] })),
        getEmailRecipients().catch(() => ({ data: [] })),
      ]);
      setMyProjects(projectsRes.data);
      setConsultantRequests(requestsRes.data);
      setConsultants(consultantsRes.data);
      setMyTeams(teamsRes.data);
      setMyCreatedTasks(tasksRes.data);
      setEmployeeTasks(empTasksRes.data);
      setMyUploads(uploadsRes.data);
      setEmailRecipients(emailRes.data);
      if (projectsRes.data.length > 0 && selectedProjectId === 0) {
        setSelectedProjectId(projectsRes.data[0].projectId);
        setSelectedProject(projectsRes.data[0]);
      }
    } catch (error) { console.error(error); }
  };

  const handleProjectChange = async (projectId: number) => {
    setSelectedProjectId(projectId);
    const project = myProjects.find(p => p.projectId === projectId);
    setSelectedProject(project || null);
    if (projectId) {
      const teamsRes = await getProjectTeams(projectId).catch(() => ({ data: [] }));
      setSelectedProjectTeams(teamsRes.data);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleUpdateProjectStatus = async () => {
    if (!selectedProject || !updateProjectData.status) return;
    try {
      await updateProjectStatus(selectedProject.projectId, updateProjectData.status, updateProjectData.note);
      await loadAllData();
      setShowUpdateProjectModal(false);
      showToast('success', 'Project status updated');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleCreateTask = async () => {
    if (!createTaskData.projectId || !createTaskData.assignedToUserId || !createTaskData.taskDetails || !createTaskData.deadline) {
      showToast('error', 'Fill all fields'); return;
    }
    try {
      await createTask(createTaskData);
      await loadAllData();
      setShowCreateTaskModal(false);
      setCreateTaskData({ projectId: selectedProjectId, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
      showToast('success', 'Task created');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    try {
      await updateTask(selectedTask.taskId, editTaskData);
      await loadAllData();
      setShowEditTaskModal(false);
      showToast('success', 'Task updated');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm('Delete task?')) {
      try { await deleteTask(taskId); await loadAllData(); showToast('success', 'Task deleted'); } 
      catch (error: any) { showToast('error', error.message); }
    }
  };

  const handleCreateTeam = async () => {
    if (!createTeamData.projectId || !createTeamData.teamName || createTeamData.memberIds.length === 0) {
      showToast('error', 'Fill all fields and select members'); return;
    }
    const roles = [...createTeamData.memberRoles];
    while (roles.length < createTeamData.memberIds.length) roles.push('Member');
    try {
      await createTeam({ projectId: createTeamData.projectId, teamName: createTeamData.teamName, memberIds: createTeamData.memberIds, memberRoles: roles.slice(0, createTeamData.memberIds.length) });
      await loadAllData();
      setShowCreateTeamModal(false);
      setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] });
      showToast('success', 'Team created');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleAddMember = async () => {
    if (!selectedTeamForMember) return;
    if (!addMemberConsultantId || !addMemberRole.trim()) {
      showToast('error', 'Please select consultant and enter role');
      return;
    }
    try {
      await addMemberToTeam(selectedTeamForMember.teamId, addMemberConsultantId, addMemberRole);
      await loadAllData();
      setShowAddMemberModal(false);
      setSelectedTeamForMember(null);
      setAddMemberConsultantId(0);
      setAddMemberRole('');
      showToast('success', 'Member added successfully');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleRemoveMember = async (teamId: number, memberId: number) => {
    if (confirm('Remove this member from team?')) {
      try { await removeMemberFromTeam(teamId, memberId); await loadAllData(); showToast('success', 'Member removed'); } 
      catch (error: any) { showToast('error', error.message); }
    }
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (confirm('Delete this team permanently?')) {
      try { await deleteTeam(teamId); await loadAllData(); showToast('success', 'Team deleted'); } 
      catch (error: any) { showToast('error', error.message); }
    }
  };

  const handleRateConsultant = async () => {
    if (!selectedConsultant) return;
    if (!rateConsultantData.rating || rateConsultantData.rating < 1 || rateConsultantData.rating > 5) {
      showToast('error', 'Rating 1-5'); return;
    }
    if (!rateConsultantData.feedback.trim()) {
      showToast('error', 'Please provide feedback'); return;
    }
    try {
      await rateConsultant({ consultantId: selectedConsultant.consultantId, rating: rateConsultantData.rating, feedback: rateConsultantData.feedback });
      await loadAllData();
      setShowRateConsultantModal(false);
      setRateConsultantData({ rating: 0, feedback: '' });
      showToast('success', 'Rating submitted');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleUpdateEmployeeTask = async () => {
    if (!selectedEmployeeTask) return;
    try {
      await updateEmployeeTaskStatus(selectedEmployeeTask.taskId, employeeTaskStatus, employeeTaskNote);
      await loadAllData();
      setShowEmployeeTaskModal(false);
      showToast('success', 'Task updated');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleCompleteEmployeeTask = async () => {
    if (!selectedEmployeeTask) return;
    try {
      await completeEmployeeTask(selectedEmployeeTask.taskId, employeeTaskNote);
      await loadAllData();
      setShowEmployeeTaskModal(false);
      showToast('success', 'Task completed');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleAISuggest = async () => {
    if (!aiSuggestData.taskName || !aiSuggestData.taskDescription || !aiSuggestData.projectId) {
      showToast('error', 'Fill all fields'); return;
    }
    try {
      const res = await getAISuggestConsultant(aiSuggestData);
      setAiSuggestResult(res.data);
      showToast('success', 'AI suggestion ready');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleSendEmail = async () => {
    if (emailData.userIds.length === 0 || !emailData.subject || !emailData.message) {
      showToast('error', 'Select recipients and fill subject/message'); return;
    }
    try {
      await sendEmail(emailData);
      setShowEmailModal(false);
      setEmailData({ userIds: [], subject: '', message: '', messageType: 'INFORMATION' });
      showToast('success', 'Email sent');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleUploadFile = async () => {
    if (!uploadFileData.projectId || !uploadFileData.file || !uploadFileData.fileType) {
      showToast('error', 'Select project, file and type'); return;
    }
    try {
      await uploadFile(uploadFileData.projectId, uploadFileData.file, uploadFileData.fileType);
      if (selectedProject && selectedProject.projectId === uploadFileData.projectId) {
        const filesRes = await getProjectFiles(uploadFileData.projectId);
        setSelectedProjectFiles(filesRes.data);
      }
      const uploadsRes = await getMyUploads();
      setMyUploads(uploadsRes.data);
      setUploadFileData({ file: null, fileType: '', projectId: 0 });
      showToast('success', 'File uploaded');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (confirm('Delete file?')) {
      try { await deleteFile(fileId); await loadAllData(); showToast('success', 'File deleted'); } 
      catch (error: any) { showToast('error', error.message); }
    }
  };

  const handleViewProject = async (projectId: number) => {
    setActiveModalTab('overview');
    try {
      const [projectRes, historyRes, teamsRes, filesRes] = await Promise.all([
        getProjectById(projectId),
        getProjectHistory(projectId).catch(() => ({ data: [] })),
        getProjectTeams(projectId).catch(() => ({ data: [] })),
        getProjectFiles(projectId).catch(() => ({ data: [] })),
      ]);
      setSelectedProject(projectRes.data);
      setSelectedProjectHistory(historyRes.data);
      setSelectedProjectTeams(teamsRes.data);
      setSelectedProjectFiles(filesRes.data);
      setShowProjectDetailModal(true);
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleViewFile = async (fileId: number) => {
    try {
      const tokenRes = await getAccessToken(fileId);
      if (tokenRes.success && tokenRes.data) window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
      else showToast('error', 'Cannot view');
    } catch { showToast('error', 'Cannot view'); }
  };

  const handleDownloadFile = async (fileId: number) => {
    try {
      const tokenRes = await getAccessToken(fileId);
      if (tokenRes.success && tokenRes.data) window.open(`${API_BASE}${tokenRes.data.downloadUrl}`, '_blank');
      else showToast('error', 'Cannot download');
    } catch { showToast('error', 'Download failed'); }
  };

  const handleUpdateProfile = async (data: any) => {
    try {
      await updateUserProfile(data);
      const profileRes = await getUserProfile();
      setUser(profileRes.data);
      setShowProfileModal(false);
      showToast('success', 'Profile updated');
    } catch (error: any) { showToast('error', error.message); }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Delete account permanently?')) {
      try { await deleteAccount(); await logout(); window.location.href = '/'; } 
      catch (error: any) { showToast('error', error.message); }
    }
  };

  const filteredProjects = myProjects.filter(p => p.projectName.toLowerCase().includes(projectSearch.toLowerCase()));
  const filteredTasks = myCreatedTasks.filter(t => {
    if (taskFilter === 'pending') return t.taskStatus === 'PENDING';
    if (taskFilter === 'in_progress') return t.taskStatus === 'IN_PROGRESS';
    if (taskFilter === 'completed') return t.taskStatus === 'COMPLETED';
    return true;
  });
  const formatDate = (date: string) => date ? new Date(date).toLocaleString() : 'N/A';

  if (loading) return React.createElement(ShimmerLoader, null);

  if (!isManager) {
    return React.createElement('div', { className: 'client-container' },
      React.createElement(CommonSidebar, { activeNav, setActiveNav, onLogout: async () => await logout(), onThemeToggle: toggleDarkMode, darkMode, user: user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null, menuItems: [], title: 'Access Denied', logoIcon: '🚫', isOpen: mobileSidebarOpen, onClose: () => setMobileSidebarOpen(false) }),
      React.createElement('main', { className: 'client-main' },
        React.createElement('div', { className: 'dashboard-card access-denied' },
          React.createElement('div', { className: 'access-denied-icon' }, '🚫'),
          React.createElement('h2', null, 'Access Denied'),
          React.createElement('p', null, 'Manager permissions required.')
        )
      )
    );
  }

  return React.createElement('div', { className: 'client-container' },
    toast && React.createElement('div', { className: `toast-notification ${toast.type}` },
      React.createElement('span', null, toast.type === 'success' ? '✅' : '❌'),
      React.createElement('span', null, toast.message),
      React.createElement('button', { onClick: () => setToast(null) }, '✕')
    ),
    React.createElement(CommonSidebar, { activeNav, setActiveNav, onLogout: async () => await logout(), onThemeToggle: toggleDarkMode, darkMode, user: user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null, menuItems, title: 'Manager Portal', logoIcon: '👔', isOpen: mobileSidebarOpen, onClose: () => setMobileSidebarOpen(false) }),
    React.createElement('button', { className: 'mobile-menu-btn', onClick: () => setMobileSidebarOpen(!mobileSidebarOpen) }, '☰'),
    React.createElement('main', { className: 'client-main' },
      React.createElement('header', { className: 'client-header' },
        React.createElement('div', { className: 'header-welcome' },
          React.createElement('h1', null, `Welcome, ${user?.name?.split(' ')[0] || 'Manager'}!`),
          React.createElement('p', null, 'Manager Dashboard')
        ),
        React.createElement('div', { className: 'header-stats' },
          React.createElement('div', { className: 'header-stat-item' }, React.createElement('span', { className: 'stat-label' }, 'Projects'), React.createElement('span', { className: 'stat-value-sm' }, myProjects.length)),
          React.createElement('div', { className: 'header-stat-item' }, React.createElement('span', { className: 'stat-label' }, 'Teams'), React.createElement('span', { className: 'stat-value-sm' }, myTeams.length)),
          React.createElement('div', { className: 'header-stat-item' }, React.createElement('span', { className: 'stat-label' }, 'Active Tasks'), React.createElement('span', { className: 'stat-value-sm' }, myCreatedTasks.filter(t => t.taskStatus !== 'COMPLETED').length))
        )
      ),
      React.createElement('div', { className: 'project-selector-bar' },
        React.createElement('div', { className: 'project-selector-left' },
          React.createElement('label', null, '📁 Select Project:'),
          React.createElement('div', { className: 'project-search-wrapper' },
            React.createElement('input', { type: 'text', placeholder: 'Search...', value: projectSearch, onChange: (e) => setProjectSearch(e.target.value), className: 'project-search-input' }),
            React.createElement('select', { value: selectedProjectId, onChange: (e) => handleProjectChange(parseInt(e.target.value)), className: 'project-select' },
              React.createElement('option', { value: 0 }, '-- Select Project --'),
              filteredProjects.map(p => React.createElement('option', { key: p.projectId, value: p.projectId }, `${p.projectName} - ${p.status}`))
            )
          )
        ),
        selectedProject && React.createElement('div', { className: 'project-selector-actions' },
          React.createElement(LoadingButton, { className: 'action-btn primary', onClick: async () => { setUpdateProjectData({ status: selectedProject.status, note: '' }); setShowUpdateProjectModal(true); } }, '📝 Update Status'),
          React.createElement(LoadingButton, { className: 'action-btn success', onClick: async () => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId, assignedToUserId: 0, deadline: getFormattedDateTime() }); setShowCreateTaskModal(true); } }, '➕ Create Task'),
          React.createElement(LoadingButton, { className: 'action-btn info', onClick: async () => { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] }); setShowCreateTeamModal(true); } }, '👥 Create Team'),
          React.createElement(LoadingButton, { className: 'action-btn outline', onClick: async () => handleViewProject(selectedProjectId) }, '📋 View Details')
        )
      ),
      activeNav === 'dashboard' && React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'stats-grid' },
          React.createElement('div', { className: 'stat-card' }, React.createElement('div', { className: 'stat-icon blue' }, '📁'), React.createElement('div', { className: 'stat-info' }, React.createElement('span', { className: 'stat-value' }, myProjects.length), React.createElement('span', { className: 'stat-label' }, 'Projects'))),
          React.createElement('div', { className: 'stat-card' }, React.createElement('div', { className: 'stat-icon green' }, '👥'), React.createElement('div', { className: 'stat-info' }, React.createElement('span', { className: 'stat-value' }, myTeams.length), React.createElement('span', { className: 'stat-label' }, 'Teams'))),
          React.createElement('div', { className: 'stat-card' }, React.createElement('div', { className: 'stat-icon orange' }, '📨'), React.createElement('div', { className: 'stat-info' }, React.createElement('span', { className: 'stat-value' }, consultantRequests.length), React.createElement('span', { className: 'stat-label' }, 'Requests'))),
          React.createElement('div', { className: 'stat-card' }, React.createElement('div', { className: 'stat-icon purple' }, '✅'), React.createElement('div', { className: 'stat-info' }, React.createElement('span', { className: 'stat-value' }, myCreatedTasks.length), React.createElement('span', { className: 'stat-label' }, 'Tasks')))
        ),
        selectedProject && React.createElement('div', { className: 'dashboard-card current-project' },
          React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, `Current: ${selectedProject.projectName}`), getStatusBadge(selectedProject.status)),
          React.createElement('p', null, selectedProject.projectDescription),
          React.createElement('div', { className: 'project-meta' },
            React.createElement('span', null, `🏢 ${selectedProject.departmentName}`),
            React.createElement('span', null, `👤 ${selectedProject.clientName}`),
            React.createElement('span', null, `📅 Due: ${formatDate(selectedProject.deadline)}`),
            selectedProject.cost && React.createElement('span', null, `💰 ₹${selectedProject.cost}`)
          )
        ),
        React.createElement('div', { className: 'dashboard-card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Recent Tasks'), React.createElement('button', { className: 'view-all-link', onClick: () => setActiveNav('my-tasks') }, 'View All →')),
          React.createElement('div', { className: 'projects-grid' }, myCreatedTasks.slice(0, 3).map(t => React.createElement('div', { key: t.taskId, className: 'project-card' },
            React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, t.taskDetails), getStatusBadge(t.taskStatus)),
            React.createElement('p', null, t.description?.substring(0, 60)),
            React.createElement('div', { className: 'project-card-meta' },
              React.createElement('span', null, `📁 ${t.projectName}`),
              React.createElement('span', null, `👤 ${t.assignedToUserName}`),
              React.createElement('span', null, `📅 Due: ${formatDate(t.deadline)}`)
            )
          )))
        ),
        React.createElement('div', { className: 'dashboard-card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Assigned to Me'), React.createElement('button', { className: 'view-all-link', onClick: () => setActiveNav('assigned-tasks') }, 'View All →')),
          React.createElement('div', { className: 'projects-grid' }, employeeTasks.slice(0, 3).map(t => React.createElement('div', { key: t.taskId, className: 'project-card' },
            React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, t.description?.substring(0, 40)), getStatusBadge(t.status)),
            React.createElement('div', { className: 'project-card-meta' },
              React.createElement('span', null, `🔥 ${t.priority}`),
              React.createElement('span', null, `📅 Due: ${formatDate(t.deadline)}`),
              React.createElement('span', null, `👤 By: ${t.createdByName}`)
            ),
            React.createElement('button', { className: 'btn-sm btn-primary', onClick: () => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); } }, 'Update')
          )))
        )
      ),
      activeNav === 'my-projects' && React.createElement('div', { className: 'dashboard-card full-width' },
        React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'My Projects')),
        React.createElement('div', { className: 'projects-grid' }, myProjects.map(p => React.createElement('div', { key: p.projectId, className: 'project-card' },
          React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, p.projectName), getStatusBadge(p.status)),
          React.createElement('p', null, p.projectDescription?.substring(0, 80)),
          React.createElement('div', { className: 'project-card-meta' },
            React.createElement('span', null, `📅 Deadline: ${formatDate(p.deadline)}`),
            React.createElement('span', null, `🏢 ${p.departmentName}`),
            React.createElement('span', null, `👤 ${p.clientName}`),
            p.cost && React.createElement('span', null, `💰 ₹${p.cost}`)
          ),
          React.createElement('div', { className: 'project-card-actions' },
            React.createElement('button', { className: 'btn-sm btn-primary', onClick: () => handleViewProject(p.projectId) }, 'Details'),
            React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => { setSelectedProject(p); setUpdateProjectData({ status: p.status, note: '' }); setShowUpdateProjectModal(true); } }, 'Update Status'),
            React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => { setCreateTaskData({ ...createTaskData, projectId: p.projectId, assignedToUserId: 0, deadline: getFormattedDateTime() }); setShowCreateTaskModal(true); } }, 'Create Task')
          )
        )))
      ),
      activeNav === 'consultant-requests' && React.createElement('div', { className: 'dashboard-card full-width' },
        React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Consultant Join Requests')),
        React.createElement('div', { className: 'projects-grid' }, consultantRequests.map(r => React.createElement('div', { key: r.requestId, className: 'project-card' },
          React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, r.consultantName), React.createElement('span', { className: 'status-badge status-pending' }, '⏳ Requested')),
          React.createElement('div', { className: 'project-card-meta' },
            React.createElement('span', null, `📁 ${r.projectName}`),
            React.createElement('span', null, `⭐ ${r.averageRating.toFixed(1)}/5`),
            React.createElement('span', null, `💼 ${r.experience}`)
          ),
          React.createElement('p', null, React.createElement('strong', null, 'Skills: '), r.skill),
          React.createElement('div', { className: 'project-card-actions' },
            React.createElement('button', { className: 'btn-sm btn-primary', onClick: () => { setCreateTeamData({ projectId: r.projectId, teamName: `${r.projectName} Team`, memberIds: [r.consultantId], memberRoles: ['Consultant'] }); setShowCreateTeamModal(true); } }, 'Add to Team'),
            React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => window.open(r.resumeLink, '_blank') }, 'Resume')
          )
        )))
      ),
      activeNav === 'consultants' && React.createElement('div', { className: 'dashboard-card full-width' },
        React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Consultants')),
        React.createElement('div', { className: 'emp-grid' }, consultants.map(c => React.createElement('div', { key: c.consultantId, className: 'emp-card' },
          React.createElement('div', { className: 'emp-header' },
            React.createElement('div', { className: 'emp-avatar verified' }, c.photoUrl ? React.createElement('img', { src: c.photoUrl, alt: c.name, className: 'avatar-img' }) : c.name.charAt(0)),
            React.createElement('div', null, React.createElement('h3', null, c.name), React.createElement('div', { className: 'dept-badge' }, c.skill?.substring(0, 40)))
          ),
          React.createElement('div', { className: 'emp-body' },
            React.createElement('div', { className: 'emp-row' }, React.createElement('span', null, '📧 Email:'), React.createElement('span', null, c.email)),
            React.createElement('div', { className: 'emp-row' }, React.createElement('span', null, '💼 Experience:'), React.createElement('span', null, c.experience)),
            React.createElement('div', { className: 'emp-row' }, React.createElement('span', null, '⭐ Rating:'), React.createElement('span', null, `${c.averageRating.toFixed(1)}/5 (${c.totalReviews} reviews)`))
          ),
          React.createElement('div', { className: 'emp-footer' },
            React.createElement('button', { className: 'btn-sm', onClick: () => { setSelectedConsultant(c); setRateConsultantData({ rating: 0, feedback: '' }); setShowRateConsultantModal(true); } }, '⭐ Rate'),
            React.createElement('button', { className: 'btn-sm btn-ai', onClick: () => { setSelectedConsultantForAI(c); setShowAIProfileModal(true); } }, '🧠 AI Profile'),
            React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => { if (selectedProjectId) { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [c.userId], memberRoles: ['Member'] }); setShowCreateTeamModal(true); } else { showToast('error', 'Select project first'); } } }, 'Add to Team')
          )
        )))
      ),
      activeNav === 'my-teams' && React.createElement('div', { className: 'dashboard-card full-width' },
        React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'My Teams'), React.createElement('button', { className: 'btn-primary btn-sm', onClick: () => { setCreateTeamData({ projectId: selectedProjectId || myProjects[0]?.projectId || 0, teamName: '', memberIds: [], memberRoles: [] }); setShowCreateTeamModal(true); } }, '➕ Create Team')),
        React.createElement('div', { className: 'teams-grid' }, myTeams.map(team => React.createElement('div', { key: team.teamId, className: 'team-card' },
          React.createElement('div', { className: 'team-card-header' }, React.createElement('h3', null, team.teamName), React.createElement('span', { className: 'team-project' }, `📁 ${team.projectName}`)),
          React.createElement('div', { className: 'team-manager' }, `👔 Manager: ${team.managerName}`),
          React.createElement('div', { className: 'team-members-list' },
            React.createElement('div', { className: 'members-title' }, `Members (${team.members.length})`),
            team.members.map(m => React.createElement('div', { key: m.memberId, className: 'team-member-row' },
              React.createElement('div', { className: 'member-avatar-small' }, m.memberName.charAt(0)),
              React.createElement('div', { className: 'member-info' },
                React.createElement('div', { className: 'member-name' }, m.memberName),
                React.createElement('div', { className: 'member-role' }, m.role),
                React.createElement('div', { className: 'member-email' }, m.memberEmail)
              ),
              React.createElement('button', { className: 'btn-icon-small danger', onClick: () => handleRemoveMember(team.teamId, m.memberId) }, '🗑️ Remove')
            ))
          ),
          React.createElement('div', { className: 'team-actions' },
            React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => { setSelectedTeamForMember(team); setAddMemberConsultantId(0); setAddMemberRole(''); setShowAddMemberModal(true); } }, '👥 Add Member'),
            React.createElement('button', { className: 'btn-sm btn-danger', onClick: () => handleDeleteTeam(team.teamId) }, '🗑️ Delete Team')
          )
        )))
      ),
      activeNav === 'my-tasks' && React.createElement('div', { className: 'dashboard-card full-width' },
        React.createElement('div', { className: 'card-header' },
          React.createElement('h2', null, 'My Created Tasks'),
          React.createElement('div', { className: 'header-filters' },
            React.createElement('select', { value: taskFilter, onChange: (e) => setTaskFilter(e.target.value) },
              React.createElement('option', { value: 'all' }, 'All'),
              React.createElement('option', { value: 'pending' }, 'Pending'),
              React.createElement('option', { value: 'in_progress' }, 'In Progress'),
              React.createElement('option', { value: 'completed' }, 'Completed')
            ),
            React.createElement('button', { className: 'btn-primary btn-sm', onClick: () => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId || myProjects[0]?.projectId || 0, assignedToUserId: 0, deadline: getFormattedDateTime() }); setShowCreateTaskModal(true); } }, '+ Create Task')
          )
        ),
        React.createElement('div', { className: 'projects-grid' }, filteredTasks.map(t => React.createElement('div', { key: t.taskId, className: 'project-card' },
          React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, t.taskDetails), getStatusBadge(t.taskStatus)),
          React.createElement('p', null, t.description?.substring(0, 80)),
          React.createElement('div', { className: 'project-card-meta' },
            React.createElement('span', null, `📁 ${t.projectName}`),
            React.createElement('span', null, `👤 ${t.assignedToUserName}`),
            React.createElement('span', null, `📅 Due: ${formatDate(t.deadline)}`)
          ),
          React.createElement('div', { className: 'project-card-actions' },
            React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => { setSelectedTask(t); setEditTaskData({ taskDetails: t.taskDetails, description: t.description || '', managerNote: t.managerNote || '', taskStatus: t.taskStatus }); setShowEditTaskModal(true); } }, 'Edit'),
            React.createElement('button', { className: 'btn-sm btn-danger', onClick: () => handleDeleteTask(t.taskId) }, 'Delete')
          )
        )))
      ),
      activeNav === 'assigned-tasks' && React.createElement('div', { className: 'dashboard-card full-width' },
        React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Assigned to Me')),
        React.createElement('div', { className: 'projects-grid' }, employeeTasks.map(t => React.createElement('div', { key: t.taskId, className: 'project-card' },
          React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, t.description?.substring(0, 50)), getStatusBadge(t.status)),
          React.createElement('div', { className: 'project-card-meta' },
            React.createElement('span', null, `🔥 ${t.priority}`),
            React.createElement('span', null, `📅 Due: ${formatDate(t.deadline)}`),
            React.createElement('span', null, `👤 By: ${t.createdByName}`)
          ),
          React.createElement('button', { className: 'btn-sm btn-primary', onClick: () => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); } }, 'Update')
        )))
      ),
      activeNav === 'ai-suggest' && React.createElement('div', { className: 'dashboard-card full-width' },
        React.createElement('h2', null, '🤖 AI Consultant Suggestion'),
        React.createElement('div', { className: 'ai-suggest-form' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Project'),
            React.createElement('select', { value: aiSuggestData.projectId, onChange: (e) => setAiSuggestData({ ...aiSuggestData, projectId: parseInt(e.target.value) }) },
              React.createElement('option', { value: 0 }, 'Select Project'),
              myProjects.map(p => React.createElement('option', { key: p.projectId, value: p.projectId }, p.projectName))
            )
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Task Name'),
            React.createElement('input', { placeholder: 'Task name', value: aiSuggestData.taskName, onChange: (e) => setAiSuggestData({ ...aiSuggestData, taskName: e.target.value }) })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Description'),
            React.createElement('textarea', { rows: 4, placeholder: 'Describe task...', value: aiSuggestData.taskDescription, onChange: (e) => setAiSuggestData({ ...aiSuggestData, taskDescription: e.target.value }) })
          ),
          React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleAISuggest }, 'Get Suggestion'),
          aiSuggestResult && React.createElement('div', { className: 'ai-suggestion-result' },
            React.createElement('div', { className: 'ai-suggestion-header' }, React.createElement('span', null, '🤖'), React.createElement('strong', null, 'Recommendation')),
            React.createElement('p', null, aiSuggestResult)
          )
        )
      ),
      activeNav === 'email' && React.createElement('div', { className: 'dashboard-card full-width' },
        React.createElement('h2', null, '✉️ Email Consultants'),
        React.createElement('div', { className: 'email-form' },
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Recipients'),
            React.createElement('div', { className: 'recipients-list' }, emailRecipients.map(r => React.createElement('label', { key: r.userId, className: 'recipient-checkbox' },
              React.createElement('input', { type: 'checkbox', checked: emailData.userIds.includes(r.userId), onChange: () => { const ids = emailData.userIds.includes(r.userId) ? emailData.userIds.filter(id => id !== r.userId) : [...emailData.userIds, r.userId]; setEmailData({ ...emailData, userIds: ids }); } }),
              React.createElement('span', null, React.createElement('strong', null, r.name), ' - ', r.email)
            )))
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Subject'),
            React.createElement('input', { placeholder: 'Subject', value: emailData.subject, onChange: (e) => setEmailData({ ...emailData, subject: e.target.value }) })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Message'),
            React.createElement('textarea', { rows: 5, placeholder: 'Message...', value: emailData.message, onChange: (e) => setEmailData({ ...emailData, message: e.target.value }) })
          ),
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Type'),
            React.createElement('select', { value: emailData.messageType, onChange: (e) => setEmailData({ ...emailData, messageType: e.target.value }) },
              React.createElement('option', { value: 'INFORMATION' }, '📢 Info'),
              React.createElement('option', { value: 'ALERT' }, '⚠️ Alert'),
              React.createElement('option', { value: 'TASK' }, '✅ Task'),
              React.createElement('option', { value: 'MEETING' }, '📅 Meeting')
            )
          ),
          React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleSendEmail }, 'Send Email')
        )
      ),
      activeNav === 'uploads' && React.createElement('div', { className: 'dashboard-card full-width' },
        React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'My Uploads')),
        React.createElement('div', { className: 'upload-section' },
          React.createElement('select', { value: uploadFileData.projectId, onChange: (e) => setUploadFileData({ ...uploadFileData, projectId: parseInt(e.target.value) }) },
            React.createElement('option', { value: 0 }, 'Select Project'),
            myProjects.map(p => React.createElement('option', { key: p.projectId, value: p.projectId }, p.projectName))
          ),
          React.createElement('input', { type: 'file', onChange: (e) => setUploadFileData({ ...uploadFileData, file: e.target.files?.[0] || null }) }),
          React.createElement('select', { value: uploadFileData.fileType, onChange: (e) => setUploadFileData({ ...uploadFileData, fileType: e.target.value }) },
            React.createElement('option', { value: '' }, 'Type'),
            React.createElement('option', { value: 'Document' }, '📄 Document'),
            React.createElement('option', { value: 'Code' }, '💻 Code'),
            React.createElement('option', { value: 'Image' }, '🖼️ Image'),
            React.createElement('option', { value: 'PDF' }, '📕 PDF')
          ),
          React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleUploadFile }, 'Upload')
        ),
        React.createElement('div', { className: 'uploads-list' }, myUploads.map(f => React.createElement('div', { key: f.fileId, className: 'file-item' },
          React.createElement('div', { className: 'file-icon' }, '📄'),
          React.createElement('div', { className: 'file-info' },
            React.createElement('div', { className: 'file-name' }, f.fileLink?.split('/').pop()),
            React.createElement('div', { className: 'file-meta' },
              React.createElement('span', null, f.fileType),
              React.createElement('span', null, `📁 ${f.projectName}`),
              React.createElement('span', null, formatDate(f.uploadTime))
            )
          ),
          React.createElement('div', { className: 'file-actions' },
            React.createElement('button', { className: 'btn-icon', onClick: () => handleViewFile(f.fileId) }, 'View'),
            React.createElement('button', { className: 'btn-icon', onClick: () => handleDownloadFile(f.fileId) }, 'Download'),
            React.createElement(LoadingButton, { className: 'btn-icon danger', onClick: async () => handleDeleteFile(f.fileId) }, 'Delete')
          )
        )))
      ),
      activeNav === 'profile' && React.createElement('div', { className: 'dashboard-card full-width' },
        React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Profile'), React.createElement('button', { className: 'btn-outline', onClick: () => setShowProfileModal(true) }, 'Edit')),
        React.createElement('div', { className: 'profile-info' },
          React.createElement('div', { className: 'profile-avatar-large' }, React.createElement('div', { className: 'avatar-placeholder' }, user?.name?.charAt(0))),
          React.createElement('div', { className: 'profile-details' },
            React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Name'), React.createElement('span', null, user?.name)),
            React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Email'), React.createElement('span', null, user?.email)),
            React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Role'), React.createElement('span', null, 'Manager')),
            React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Dept'), React.createElement('span', null, myDetails?.employee?.departmentName || 'N/A')),
            React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Phone'), React.createElement('span', null, user?.phoneNumber || 'Not set')),
            React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Address'), React.createElement('span', null, user?.address || 'Not set'))
          )
        ),
        React.createElement('div', { className: 'setting-item danger' },
          React.createElement('div', null, React.createElement('div', { className: 'setting-label' }, 'Delete Account'), React.createElement('div', { className: 'setting-desc' }, 'Permanently delete')),
          React.createElement('button', { className: 'btn-danger', onClick: handleDeleteAccount }, 'Delete')
        )
      ),
      React.createElement('footer', { className: 'client-footer' }, React.createElement('p', null, "© 2026 Manager Portal |<a href='https://softmax.in' style={{ color: 'skyblue' }}>Softmax.in</a>Softmax.in"))
    ),
    showUpdateProjectModal && selectedProject && React.createElement('div', { className: 'modal-mask open' },
      React.createElement('div', { className: 'modal-box' },
        React.createElement('button', { className: 'm-close', onClick: () => setShowUpdateProjectModal(false) }, '✕'),
        React.createElement('h2', null, `Update Status - ${selectedProject.projectName}`),
        React.createElement('div', { className: 'm-form' },
          React.createElement('select', { value: updateProjectData.status, onChange: (e) => setUpdateProjectData({ ...updateProjectData, status: e.target.value }) },
            React.createElement('option', { value: 'PENDING' }, 'Pending'),
            React.createElement('option', { value: 'ASSIGNED' }, 'Assigned'),
            React.createElement('option', { value: 'IN_PROGRESS' }, 'In Progress'),
            React.createElement('option', { value: 'COMPLETED' }, 'Completed'),
            React.createElement('option', { value: 'REJECTED' }, 'Rejected')
          ),
          React.createElement('textarea', { placeholder: 'Note', value: updateProjectData.note, onChange: (e) => setUpdateProjectData({ ...updateProjectData, note: e.target.value }), rows: 3 }),
          React.createElement(LoadingButton, { className: 'btn-msub', onClick: handleUpdateProjectStatus }, 'Update')
        )
      )
    ),
    showCreateTaskModal && React.createElement('div', { className: 'modal-mask open' },
      React.createElement('div', { className: 'modal-box' },
        React.createElement('button', { className: 'm-close', onClick: () => setShowCreateTaskModal(false) }, '✕'),
        React.createElement('h2', null, 'Create Task'),
        React.createElement('div', { className: 'm-form' },
          React.createElement('select', { value: createTaskData.projectId, onChange: (e) => setCreateTaskData({ ...createTaskData, projectId: parseInt(e.target.value) }) },
            React.createElement('option', { value: 0 }, 'Select Project'),
            myProjects.map(p => React.createElement('option', { key: p.projectId, value: p.projectId }, p.projectName))
          ),
          React.createElement('select', { value: createTaskData.assignedToUserId, onChange: (e) => setCreateTaskData({ ...createTaskData, assignedToUserId: parseInt(e.target.value) }) },
            React.createElement('option', { value: 0 }, 'Select Consultant'),
            consultants.map(c => React.createElement('option', { key: c.userId, value: c.userId }, `${c.name} (⭐${c.averageRating.toFixed(1)})`))
          ),
          React.createElement('input', { placeholder: 'Task Title', value: createTaskData.taskDetails, onChange: (e) => setCreateTaskData({ ...createTaskData, taskDetails: e.target.value }) }),
          React.createElement('textarea', { placeholder: 'Description', value: createTaskData.description, onChange: (e) => setCreateTaskData({ ...createTaskData, description: e.target.value }), rows: 3 }),
          React.createElement('label', null, 'Deadline (with time)'),
          React.createElement('input', { type: 'datetime-local', value: createTaskData.deadline, onChange: (e) => setCreateTaskData({ ...createTaskData, deadline: e.target.value }), min: getFormattedDateTime() }),
          React.createElement(LoadingButton, { className: 'btn-msub', onClick: handleCreateTask }, 'Create')
        )
      )
    ),
    showEditTaskModal && selectedTask && React.createElement('div', { className: 'modal-mask open' },
      React.createElement('div', { className: 'modal-box' },
        React.createElement('button', { className: 'm-close', onClick: () => setShowEditTaskModal(false) }, '✕'),
        React.createElement('h2', null, 'Edit Task'),
        React.createElement('div', { className: 'm-form' },
          React.createElement('input', { value: editTaskData.taskDetails, onChange: (e) => setEditTaskData({ ...editTaskData, taskDetails: e.target.value }) }),
          React.createElement('textarea', { value: editTaskData.description, onChange: (e) => setEditTaskData({ ...editTaskData, description: e.target.value }), rows: 3 }),
          React.createElement('textarea', { placeholder: 'Manager Note', value: editTaskData.managerNote, onChange: (e) => setEditTaskData({ ...editTaskData, managerNote: e.target.value }), rows: 2 }),
          React.createElement('select', { value: editTaskData.taskStatus, onChange: (e) => setEditTaskData({ ...editTaskData, taskStatus: e.target.value }) },
            React.createElement('option', { value: 'PENDING' }, 'Pending'),
            React.createElement('option', { value: 'IN_PROGRESS' }, 'In Progress'),
            React.createElement('option', { value: 'COMPLETED' }, 'Completed')
          ),
          React.createElement(LoadingButton, { className: 'btn-msub', onClick: handleUpdateTask }, 'Save')
        )
      )
    ),
    showCreateTeamModal && React.createElement('div', { className: 'modal-mask open' },
      React.createElement('div', { className: 'modal-box large' },
        React.createElement('button', { className: 'm-close', onClick: () => setShowCreateTeamModal(false) }, '✕'),
        React.createElement('h2', null, 'Create Team'),
        React.createElement('div', { className: 'm-form' },
          React.createElement('select', { value: createTeamData.projectId, onChange: (e) => setCreateTeamData({ ...createTeamData, projectId: parseInt(e.target.value) }) },
            React.createElement('option', { value: 0 }, 'Select Project'),
            myProjects.map(p => React.createElement('option', { key: p.projectId, value: p.projectId }, p.projectName))
          ),
          React.createElement('input', { placeholder: 'Team Name', value: createTeamData.teamName, onChange: (e) => setCreateTeamData({ ...createTeamData, teamName: e.target.value }) }),
          React.createElement('div', { className: 'consultants-list' }, consultants.map(c => React.createElement('label', { key: c.consultantId, className: 'consultant-checkbox' },
            React.createElement('input', { type: 'checkbox', checked: createTeamData.memberIds.includes(c.userId), onChange: () => { const ids = createTeamData.memberIds.includes(c.userId) ? createTeamData.memberIds.filter(id => id !== c.userId) : [...createTeamData.memberIds, c.userId]; setCreateTeamData({ ...createTeamData, memberIds: ids }); } }),
            React.createElement('span', null, `${c.name} - ${c.skill} (⭐${c.averageRating.toFixed(1)})`)
          ))),
          React.createElement('input', { placeholder: 'Roles (comma separated, order matches selected consultants)', value: createTeamData.memberRoles.join(','), onChange: (e) => setCreateTeamData({ ...createTeamData, memberRoles: e.target.value.split(',').map(s => s.trim()) }) }),
          React.createElement(LoadingButton, { className: 'btn-msub', onClick: handleCreateTeam }, 'Create Team')
        )
      )
    ),
    showRateConsultantModal && selectedConsultant && React.createElement('div', { className: 'modal-mask open' },
      React.createElement('div', { className: 'modal-box' },
        React.createElement('button', { className: 'm-close', onClick: () => setShowRateConsultantModal(false) }, '✕'),
        React.createElement('h2', null, `Rate ${selectedConsultant.name}`),
        React.createElement('div', { className: 'm-form' },
          React.createElement('div', { className: 'stars-input' }, [1, 2, 3, 4, 5].map(i => React.createElement('button', { key: i, type: 'button', className: `star-btn ${rateConsultantData.rating >= i ? 'active' : ''}`, onClick: () => setRateConsultantData({ ...rateConsultantData, rating: i }) }, i <= rateConsultantData.rating ? '⭐' : '☆'))),
          React.createElement('textarea', { placeholder: 'Feedback', value: rateConsultantData.feedback, onChange: (e) => setRateConsultantData({ ...rateConsultantData, feedback: e.target.value }), rows: 4 }),
          React.createElement(LoadingButton, { className: 'btn-msub', onClick: handleRateConsultant }, 'Submit')
        )
      )
    ),
    showAIProfileModal && selectedConsultantForAI && React.createElement(AIConsultantProfileModal, { consultant: selectedConsultantForAI, onClose: () => setShowAIProfileModal(false) }),
    showEmployeeTaskModal && selectedEmployeeTask && React.createElement('div', { className: 'modal-mask open' },
      React.createElement('div', { className: 'modal-box' },
        React.createElement('button', { className: 'm-close', onClick: () => setShowEmployeeTaskModal(false) }, '✕'),
        React.createElement('h2', null, 'Update Task'),
        React.createElement('p', null, React.createElement('strong', null, selectedEmployeeTask.description)),
        React.createElement('p', null, `Priority: ${selectedEmployeeTask.priority} | Current: ${selectedEmployeeTask.status}`),
        React.createElement('select', { value: employeeTaskStatus, onChange: (e) => setEmployeeTaskStatus(e.target.value) },
          React.createElement('option', { value: 'PENDING' }, 'Pending'),
          React.createElement('option', { value: 'IN_PROGRESS' }, 'In Progress'),
          React.createElement('option', { value: 'COMPLETED' }, 'Completed')
        ),
        React.createElement('textarea', { placeholder: 'Note', value: employeeTaskNote, onChange: (e) => setEmployeeTaskNote(e.target.value), rows: 3 }),
        React.createElement('div', { className: 'modal-actions' },
          React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleUpdateEmployeeTask }, 'Update'),
          React.createElement(LoadingButton, { className: 'btn-success', onClick: handleCompleteEmployeeTask }, 'Complete')
        )
      )
    ),
    showAddMemberModal && selectedTeamForMember && React.createElement('div', { className: 'modal-mask open' },
      React.createElement('div', { className: 'modal-box' },
        React.createElement('button', { className: 'm-close', onClick: () => { setShowAddMemberModal(false); setSelectedTeamForMember(null); } }, '✕'),
        React.createElement('h2', null, `Add Member to ${selectedTeamForMember.teamName}`),
        React.createElement('div', { className: 'm-form' },
          React.createElement('select', { value: addMemberConsultantId, onChange: (e) => setAddMemberConsultantId(parseInt(e.target.value)) },
            React.createElement('option', { value: 0 }, '-- Select Consultant --'),
            consultants.filter(c => !selectedTeamForMember.members.some(m => m.memberId === c.userId)).map(c => React.createElement('option', { key: c.userId, value: c.userId }, `${c.name} - ${c.skill} (⭐${c.averageRating.toFixed(1)})`))
          ),
          React.createElement('input', { placeholder: 'Role (e.g., Lead Developer, Tester, UI Designer)', value: addMemberRole, onChange: (e) => setAddMemberRole(e.target.value) }),
          React.createElement('div', { className: 'modal-actions' },
            React.createElement('button', { className: 'btn-outline', onClick: () => { setShowAddMemberModal(false); setSelectedTeamForMember(null); } }, 'Cancel'),
            React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleAddMember }, 'Add Member')
          )
        )
      )
    ),
    showProjectDetailModal && selectedProject && React.createElement('div', { className: 'modal-mask open' },
      React.createElement('div', { className: 'modal-box large project-detail-modal' },
        React.createElement('button', { className: 'm-close', onClick: () => setShowProjectDetailModal(false) }, '✕'),
        React.createElement('h2', null, selectedProject.projectName),
        selectedProject.cost && React.createElement('p', { className: 'project-cost' }, `💰 ₹${selectedProject.cost}`),
        React.createElement('div', { className: 'm-tabs' },
          React.createElement('button', { className: `m-tab ${activeModalTab === 'overview' ? 'active' : ''}`, onClick: () => setActiveModalTab('overview') }, '📋 Overview'),
          React.createElement('button', { className: `m-tab ${activeModalTab === 'teams' ? 'active' : ''}`, onClick: () => setActiveModalTab('teams') }, `👥 Teams (${selectedProjectTeams.length})`),
          React.createElement('button', { className: `m-tab ${activeModalTab === 'files' ? 'active' : ''}`, onClick: () => setActiveModalTab('files') }, `📎 Files (${selectedProjectFiles.length})`),
          React.createElement('button', { className: `m-tab ${activeModalTab === 'history' ? 'active' : ''}`, onClick: () => setActiveModalTab('history') }, `📜 History (${selectedProjectHistory.length})`)
        ),
        React.createElement('div', { className: 'm-tab-content' }, activeModalTab === 'overview' && React.createElement('div', null,
          React.createElement('div', { className: 'detail-row' }, React.createElement('label', null, 'Status:'), getStatusBadge(selectedProject.status)),
          React.createElement('div', { className: 'detail-row' }, React.createElement('label', null, 'Description:'), React.createElement('p', null, selectedProject.projectDescription)),
          React.createElement('div', { className: 'detail-grid' },
            React.createElement('div', null, React.createElement('label', null, 'Type:'), ' ', selectedProject.projectType),
            React.createElement('div', null, React.createElement('label', null, 'Client:'), ' ', selectedProject.clientName),
            React.createElement('div', null, React.createElement('label', null, 'Email:'), ' ', selectedProject.clientEmail),
            React.createElement('div', null, React.createElement('label', null, 'Department:'), ' ', selectedProject.departmentName),
            React.createElement('div', null, React.createElement('label', null, 'Manager:'), ' ', selectedProject.assignedManagerName || 'Not assigned'),
            React.createElement('div', null, React.createElement('label', null, 'Deadline:'), ' ', formatDate(selectedProject.deadline)),
            React.createElement('div', null, React.createElement('label', null, 'Created:'), ' ', formatDate(selectedProject.createdAt))
          )
        )),
        React.createElement('div', { className: 'm-tab-content', style: { display: activeModalTab === 'teams' ? 'block' : 'none' } },
          selectedProjectTeams.length === 0 ? React.createElement('div', { className: 'empty-state' }, React.createElement('span', null, '👥'), React.createElement('p', null, 'No teams yet')) :
          selectedProjectTeams.map(team => React.createElement('div', { key: team.teamId, className: 'team-detail-card' },
            React.createElement('div', { className: 'team-detail-header' }, React.createElement('h3', null, team.teamName), React.createElement('span', { className: 'team-manager-badge' }, `👔 ${team.managerName}`)),
            React.createElement('div', { className: 'team-members-list' }, team.members.map(m => React.createElement('div', { key: m.memberId, className: 'team-member-row' },
              React.createElement('div', { className: 'member-avatar-small' }, m.memberName.charAt(0)),
              React.createElement('div', null,
                React.createElement('div', { className: 'member-name' }, m.memberName),
                React.createElement('div', { className: 'member-role' }, m.role),
                React.createElement('div', { className: 'member-email' }, m.memberEmail)
              )
            )))
          ))
        ),
        React.createElement('div', { className: 'm-tab-content', style: { display: activeModalTab === 'files' ? 'block' : 'none' } },
          React.createElement('div', { className: 'upload-section' },
            React.createElement('input', { type: 'file', onChange: (e) => setUploadFileData({ ...uploadFileData, file: e.target.files?.[0] || null, projectId: selectedProject.projectId }) }),
            React.createElement('select', { value: uploadFileData.fileType, onChange: (e) => setUploadFileData({ ...uploadFileData, fileType: e.target.value }) },
              React.createElement('option', { value: '' }, 'Type'),
              React.createElement('option', { value: 'Document' }, 'Document'),
              React.createElement('option', { value: 'Code' }, 'Code'),
              React.createElement('option', { value: 'Image' }, 'Image'),
              React.createElement('option', { value: 'PDF' }, 'PDF')
            ),
            React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleUploadFile }, 'Upload')
          ),
          React.createElement('div', { className: 'files-grid' }, selectedProjectFiles.map(f => React.createElement('div', { key: f.fileId, className: 'file-card', onClick: () => handleViewFile(f.fileId) },
            React.createElement('div', { className: 'file-card-icon' }, '📄'),
            React.createElement('div', { className: 'file-card-info' },
              React.createElement('div', { className: 'file-card-name' }, f.fileLink?.split('/').pop()?.substring(0, 25)),
              React.createElement('div', { className: 'file-card-meta' },
                React.createElement('span', null, f.fileType),
                React.createElement('span', null, f.uploaderName),
                React.createElement('span', null, formatDate(f.uploadTime))
              )
            ),
            React.createElement('button', { className: 'btn-icon', onClick: (e) => { e.stopPropagation(); handleDownloadFile(f.fileId); } }, '⬇️')
          )))
        ),
        React.createElement('div', { className: 'm-tab-content', style: { display: activeModalTab === 'history' ? 'block' : 'none' } }, React.createElement(TimelineHistory, { history: selectedProjectHistory }))
      )
    ),
    showProfileModal && React.createElement('div', { className: 'modal-mask open' },
      React.createElement('div', { className: 'modal-box' },
        React.createElement('button', { className: 'm-close', onClick: () => setShowProfileModal(false) }, '✕'),
        React.createElement('h2', null, 'Edit Profile'),
        React.createElement('form', { onSubmit: (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleUpdateProfile({ name: fd.get('name'), phoneNumber: fd.get('phoneNumber'), address: fd.get('address'), gender: fd.get('gender'), dob: fd.get('dob') }); } },
          React.createElement('div', { className: 'm-form' },
            React.createElement('input', { name: 'name', defaultValue: user?.name }),
            React.createElement('input', { name: 'phoneNumber', defaultValue: user?.phoneNumber }),
            React.createElement('input', { name: 'gender', defaultValue: user?.gender }),
            React.createElement('input', { name: 'dob', type: 'date', defaultValue: user?.dob }),
            React.createElement('textarea', { name: 'address', rows: 2, defaultValue: user?.address }),
            React.createElement('button', { type: 'submit', className: 'btn-msub' }, 'Save')
          )
        )
      )
    ),
    React.createElement('style', { dangerouslySetInnerHTML: { __html: `
      .client-container { position: relative; }
      .toast-notification { position: fixed; top: 80px; right: 20px; z-index: 10000; display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 12px; background: var(--card-bg); border-left: 4px solid; box-shadow: var(--shadow-lg); animation: slideInRight 0.3s ease; }
      .toast-notification.success { border-left-color: var(--green); }
      .toast-notification.error { border-left-color: var(--red); }
      @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      .project-selector-bar { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
      .project-selector-left { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
      .project-search-input { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); width: 200px; }
      .project-select { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); min-width: 250px; }
      .action-btn { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 500; cursor: pointer; border: none; }
      .action-btn.primary { background: var(--teal); color: white; }
      .action-btn.success { background: var(--green); color: white; }
      .action-btn.info { background: var(--blue); color: white; }
      .action-btn.outline { background: transparent; border: 1px solid var(--teal); color: var(--teal); }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
      .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; display: flex; align-items: center; gap: 1rem; }
      .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
      .stat-info .stat-value { font-size: 1.8rem; font-weight: 700; line-height: 1; }
      .dashboard-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; }
      .dashboard-card.full-width { width: 100%; }
      .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
      .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
      .project-card { background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; transition: all 0.2s; }
      .project-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem; }
      .project-card-header h3 { font-size: 1rem; font-weight: 600; margin: 0; }
      .project-card-meta { display: flex; gap: 0.8rem; flex-wrap: wrap; font-size: 0.7rem; color: var(--muted); }
      .project-card-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; }
      .emp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
      .emp-card { background: var(--bg); border: 1px solid var(--border); border-radius: 18px; padding: 1.3rem; transition: all 0.3s ease; }
      .emp-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
      .emp-avatar { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: rgba(44, 166, 164, 0.1); }
      .emp-body { margin-top: 0.75rem; }
      .emp-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 0.8rem; }
      .emp-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.5rem; flex-wrap: wrap; }
      .teams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1.5rem; }
      .team-card { background: var(--bg); border: 1px solid var(--border); border-radius: 18px; padding: 1.3rem; transition: all 0.3s ease; }
      .team-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; }
      .team-card-header h3 { font-size: 1rem; font-weight: 600; margin: 0; }
      .team-project { font-size: 0.7rem; background: var(--surface); padding: 0.2rem 0.5rem; border-radius: 12px; }
      .team-manager { font-size: 0.8rem; color: var(--teal); margin-bottom: 0.8rem; }
      .team-members-list { max-height: 300px; overflow-y: auto; margin-bottom: 1rem; }
      .members-title { font-size: 0.7rem; font-weight: 600; color: var(--muted); margin-bottom: 0.5rem; }
      .team-member-row { display: flex; align-items: center; gap: 0.8rem; padding: 0.5rem; background: var(--surface); border-radius: 8px; margin-bottom: 0.5rem; }
      .member-avatar-small { width: 36px; height: 36px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
      .member-info { flex: 1; }
      .member-name { font-weight: 600; font-size: 0.8rem; }
      .member-role { font-size: 0.7rem; color: var(--teal); }
      .member-email { font-size: 0.65rem; color: var(--muted); }
      .team-actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem; }
      .btn-sm { padding: 0.3rem 0.8rem; font-size: 0.7rem; border-radius: 20px; cursor: pointer; }
      .btn-primary { background: var(--teal); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
      .btn-outline { background: transparent; border: 1px solid var(--teal); color: var(--teal); }
      .btn-danger { background: var(--red); color: white; border: none; }
      .btn-success { background: var(--green); color: white; border: none; }
      .btn-ai { background: linear-gradient(135deg, #6c5ce7, #a463f5); color: white; }
      .btn-msub { padding: 0.75rem; border-radius: 40px; background: var(--teal); color: white; font-weight: 600; width: 100%; cursor: pointer; }
      .btn-icon { padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); cursor: pointer; }
      .btn-icon-small { padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); cursor: pointer; font-size: 0.7rem; }
      .form-group { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
      .form-group label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--muted); }
      .form-group input, .form-group select, .form-group textarea { padding: 0.6rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); }
      .m-form { display: flex; flex-direction: column; gap: 1rem; }
      .stars-input { display: flex; gap: 0.5rem; margin: 0.5rem 0; }
      .star-btn { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; }
      .consultants-list { max-height: 250px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem; }
      .consultant-checkbox { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; cursor: pointer; border-bottom: 1px solid var(--border); }
      .recipients-list { max-height: 200px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem; }
      .recipient-checkbox { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; cursor: pointer; }
      .profile-info { display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
      .profile-avatar-large { width: 100px; height: 100px; border-radius: 24px; background: linear-gradient(135deg, var(--teal), var(--green)); display: flex; align-items: center; justify-content: center; }
      .avatar-placeholder { font-size: 2.5rem; font-weight: 700; color: white; }
      .profile-details { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
      .detail-item { display: flex; flex-direction: column; gap: 0.2rem; }
      .detail-item label { font-size: 0.65rem; font-weight: 600; color: var(--muted); }
      .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--surface); border-radius: 12px; margin-top: 1rem; }
      .ai-suggestion-result { margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, rgba(44, 166, 164, 0.1), rgba(31, 109, 168, 0.05)); border-radius: 12px; }
      .timeline-container { display: flex; flex-direction: column; gap: 0.8rem; max-height: 500px; overflow-y: auto; }
      .timeline-item { display: flex; gap: 1rem; }
      .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--teal); margin-top: 0.3rem; flex-shrink: 0; }
      .timeline-content { flex: 1; background: var(--surface); border-radius: 10px; padding: 0.6rem; }
      .timeline-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 0.3rem; }
      .timeline-date { font-size: 0.65rem; color: var(--muted); }
      .timeline-body { font-size: 0.75rem; }
      .team-detail-card { background: var(--surface); border-radius: 12px; padding: 1rem; margin-bottom: 1rem; }
      .team-detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
      .team-manager-badge { font-size: 0.7rem; background: rgba(44, 166, 164, 0.1); padding: 0.2rem 0.6rem; border-radius: 20px; color: var(--teal); }
      .files-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
      .file-card { width: 180px; padding: 0.8rem; background: var(--surface); border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
      .file-card-icon { font-size: 2rem; margin-bottom: 0.3rem; }
      .file-card-name { font-size: 0.7rem; font-weight: 500; word-break: break-all; }
      .project-detail-modal { max-width: 850px; width: 90%; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; }
      .m-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
      .m-tab { padding: 0.5rem 1rem; background: transparent; border: none; cursor: pointer; color: var(--muted); border-radius: 8px 8px 0 0; transition: all 0.2s; }
      .m-tab.active { color: var(--teal); border-bottom: 2px solid var(--teal); }
      .m-tab-content { padding: 0.5rem; overflow-y: auto; max-height: 60vh; }
      .detail-row { margin-bottom: 1rem; }
      .detail-row label { font-weight: 600; color: var(--muted); min-width: 100px; display: inline-block; }
      .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
      .empty-state { text-align: center; padding: 2rem; color: var(--muted); }
      .modal-mask { display: none; position: fixed; inset: 0; z-index: 2000; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); align-items: center; justify-content: center; padding: 1rem; }
      .modal-mask.open { display: flex; }
      .modal-box { background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px; padding: 1.5rem; width: 100%; max-width: 500px; position: relative; max-height: 90vh; overflow-y: auto; }
      .modal-box.large { max-width: 700px; }
      .m-close { position: absolute; top: 0.8rem; right: 0.8rem; width: 32px; height: 32px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
      .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }
      .ai-profile-modal-box { max-width: 550px; }
      .ai-profile-header { text-align: center; margin-bottom: 1rem; }
      .ai-glow-icon { font-size: 2.5rem; animation: pulse 1s infinite; }
      .ai-profile-consultant { display: flex; gap: 1rem; align-items: center; padding: 1rem; background: linear-gradient(135deg, rgba(44, 166, 164, 0.1), rgba(31, 109, 168, 0.05)); border-radius: 16px; margin-bottom: 1rem; }
      .ai-profile-avatar { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--teal), var(--green)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white; }
      .rating-badge { font-size: 0.8rem; color: #f59e0b; margin-top: 0.25rem; }
      .ai-loading-state { text-align: center; padding: 2rem; }
      .ai-wave-animation { width: 50px; height: 50px; margin: 0 auto 1rem; background: linear-gradient(135deg, var(--teal), var(--green)); border-radius: 50%; animation: wave 1s ease-in-out infinite; }
      .ai-error-state { text-align: center; padding: 1rem; background: rgba(231, 76, 60, 0.1); border-radius: 12px; color: var(--red); }
      .ai-result-card { display: flex; gap: 1rem; padding: 1rem; background: var(--surface); border-radius: 12px; border-left: 3px solid var(--teal); }
      .ai-result-icon { font-size: 1.5rem; }
      .ai-result-text h4 { font-size: 0.8rem; margin-bottom: 0.3rem; color: var(--teal); }
      .ai-result-text p { font-size: 0.75rem; color: var(--muted); line-height: 1.5; }
      .status-badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
      .status-pending { background: rgba(243, 156, 18, 0.15); color: #f39c12; }
      .status-assigned { background: rgba(31, 109, 168, 0.15); color: #1f6da8; }
      .status-progress { background: rgba(44, 166, 164, 0.15); color: #2ca6a4; }
      .status-completed { background: rgba(52, 168, 83, 0.15); color: #34a853; }
      .loading-spinner-small { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.6s linear infinite; margin-right: 0.3rem; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .shimmer-wrapper { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }
      .shimmer-card { background: var(--surface); border-radius: 16px; padding: 1rem; }
      .shimmer-line { background: linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; margin: 0.5rem 0; }
      @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      .client-footer { margin-top: 2rem; padding: 1rem; text-align: center; border-top: 1px solid var(--border); color: var(--muted); font-size: 0.75rem; }
      .access-denied { text-align: center; padding: 3rem; }
      .access-denied-icon { font-size: 4rem; margin-bottom: 1rem; }
      .view-all-link { color: var(--teal); background: none; border: none; cursor: pointer; font-size: 0.8rem; }
      .header-stats { display: flex; gap: 1.5rem; }
      .header-stat-item { text-align: right; }
      .stat-value-sm { font-size: 0.9rem; font-weight: 600; }
      @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
      @keyframes wave { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); opacity: 0.5; } }
      @media (max-width: 768px) {
        .client-main { margin-left: 0; padding: 1rem; padding-bottom: 80px; }
        .mobile-menu-btn { display: flex; position: fixed; bottom: 1.5rem; right: 1.5rem; width: 50px; height: 50px; border-radius: 50%; background: var(--teal); color: white; border: none; font-size: 1.5rem; cursor: pointer; z-index: 1000; align-items: center; justify-content: center; }
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
        .projects-grid, .emp-grid, .teams-grid { grid-template-columns: 1fr; }
        .project-selector-bar { flex-direction: column; align-items: stretch; }
        .project-selector-left { flex-direction: column; align-items: stretch; }
        .project-search-wrapper { flex-direction: column; }
        .m-tabs { flex-direction: column; }
        .m-tab.active { border-bottom: none; background: var(--teal); color: white; border-radius: 8px; }
        .project-detail-modal { width: 95%; }
        .detail-grid { grid-template-columns: 1fr; }
      }
    ` } })
  );
};

export default Manager;






// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import CommonSidebar from './components/CommonSidebar';
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
//   emailVerified: boolean;
//   isProfileCompleted: boolean;
//   phoneNumber?: string;
//   address?: string;
//   gender?: string;
//   dob?: string;
// }

// interface Employee {
//   employeeId: number;
//   isDirectorVerified: boolean;
//   positionName: string;
//   salary: number;
//   department: string;
//   skillSet: string;
//   departmentId: number;
//   departmentName: string;
// }

// interface MyDetails {
//   user: UserProfile;
//   roles: Role[];
//   employee: Employee | null;
// }

// interface Role {
//   id: number;
//   ptype: string;
//   stype: string;
//   isApproved: string;
//   createdAt: string;
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
//   assignedManagerId: number;
//   assignedManagerName: string;
//   deadline: string;
//   cost: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ProjectHistory {
//   statusId: number;
//   projectId: number;
//   projectName: string;
//   status: string;
//   dateTime: string;
//   handledById: number;
//   handledByName: string;
//   assignedToId: number | null;
//   assignedToName: string | null;
//   directorNote: string | null;
//   managerNote: string | null;
//   deadline: string | null;
// }

// interface Task {
//   taskId: number;
//   projectId: number;
//   projectName: string;
//   assignedToUserId: number;
//   assignedToUserName: string;
//   assignedToUserPhoto: string | null;
//   taskDetails: string;
//   description: string;
//   taskStatus: string;
//   createdById: number;
//   createdByName: string;
//   deadline: string;
//   managerNote: string | null;
//   createdAt: string;
//   updatedAt: string;
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

// interface TeamMember {
//   memberId: number;
//   memberName: string;
//   memberEmail: string;
//   photoUrl: string | null;
//   role: string;
//   description: string | null;
// }

// interface ConsultantRequest {
//   requestId: number;
//   projectId: number;
//   projectName: string;
//   consultantId: number;
//   consultantName: string;
//   consultantEmail: string;
//   consultantPhoto: string | null;
//   skill: string;
//   experience: string;
//   marks10: number;
//   marks12: number;
//   graduationMarks: number;
//   resumeLink: string;
//   averageRating: number;
//   totalReviews: number;
//   requestedAt: string;
// }

// interface ConsultantWithRating {
//   consultantId: number;
//   userId: number;
//   name: string;
//   email: string;
//   photoUrl: string | null;
//   skill: string;
//   experience: string;
//   averageRating: number;
//   totalReviews: number;
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
//   projectId?: number;
//   projectName?: string;
// }

// interface EmployeeTask {
//   taskId: number;
//   description: string;
//   status: string;
//   priority: string;
//   createdByUserId: number;
//   createdByName: string;
//   createdByPhoto: string | null;
//   deadline: string;
//   createdAt: string;
//   updatedAt: string;
//   completedAt: string | null;
// }

// interface EmailRecipient {
//   userId: number;
//   name: string;
//   email: string;
//   role: string;
//   department: string;
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
// // ALL MANAGER APIs
// // ============================================

// // Auth APIs
// const checkIsManager = async () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/project/check/manager');
// const getUserProfile = async () => apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
// const updateUserProfile = async (data: any) => apiCall('PUT', '/api/users/profile', data);
// const deleteAccount = async () => apiCall('DELETE', '/api/users/account');
// const getMyDetails = async () => apiCall<{ success: boolean; data: MyDetails }>('GET', '/api/getmydetails');

// // Project APIs
// const getMyAssignedProjects = async () => apiCall<{ success: boolean; data: Project[] }>('GET', '/api/project/manager/my-projects');
// const updateProjectStatus = async (projectId: number, status: string, note?: string) => {
//   let url = `/api/project/manager/update-status/${projectId}?status=${status}`;
//   if (note) url += `&note=${encodeURIComponent(note)}`;
//   return apiCall('PUT', url);
// };
// const getProjectById = async (projectId: number) => apiCall<{ success: boolean; data: Project }>('GET', `/api/project/${projectId}`);
// const getProjectHistory = async (projectId: number) => apiCall<{ success: boolean; data: ProjectHistory[] }>('GET', `/api/project/${projectId}/history`);
// const getProjectTeams = async (projectId: number) => apiCall<{ success: boolean; data: Team[] }>('GET', `/api/team/project/${projectId}`);
// const getProjectFiles = async (projectId: number) => apiCall<{ success: boolean; data: FileItem[] }>('GET', `/api/file/project/${projectId}`);

// // Task APIs with datetime
// const createTask = async (data: { projectId: number; assignedToUserId: number; taskDetails: string; description: string; deadline: string }) => apiCall('POST', '/api/task/create', data);
// const updateTask = async (taskId: number, data: any) => apiCall('PUT', `/api/task/update/${taskId}`, data);
// const deleteTask = async (taskId: number) => apiCall('DELETE', `/api/task/delete/${taskId}`);
// const getMyCreatedTasks = async () => apiCall<{ success: boolean; data: Task[] }>('GET', '/api/task/my-created-tasks');
// const getProjectTasks = async (projectId: number) => apiCall<{ success: boolean; data: Task[] }>('GET', `/api/task/project/${projectId}`);

// // Team APIs - Full CRUD
// const createTeam = async (data: { projectId: number; teamName: string; memberIds: number[]; memberRoles: string[] }) => apiCall('POST', '/api/team/create', data);
// const addMemberToTeam = async (teamId: number, memberId: number, role: string) => apiCall('POST', `/api/team/${teamId}/add-member?memberId=${memberId}&role=${encodeURIComponent(role)}`);
// const removeMemberFromTeam = async (teamId: number, memberId: number) => apiCall('DELETE', `/api/team/${teamId}/remove-member/${memberId}`);
// const deleteTeam = async (teamId: number) => apiCall('DELETE', `/api/team/delete/${teamId}`);
// const getMyTeams = async () => apiCall<{ success: boolean; data: Team[] }>('GET', '/api/team/my-teams');

// // Consultant APIs
// const getConsultantRequests = async () => apiCall<{ success: boolean; data: ConsultantRequest[] }>('GET', '/api/consultant-project/manager/requests');
// const getMyDepartmentConsultants = async () => apiCall<{ success: boolean; data: ConsultantWithRating[] }>('GET', '/api/consultant-project/manager/my-department-consultants');
// const rateConsultant = async (data: { consultantId: number; rating: number; feedback: string }) => apiCall('POST', '/api/consultant-project/manager/rate', data);
// const getAIConsultantProfile = async (consultantId: number) => apiCall('GET', `/api/ai/consultant/profile?consultantId=${consultantId}`);

// // Employee Tasks APIs
// const getEmployeeTasks = async () => apiCall<{ success: boolean; data: EmployeeTask[] }>('GET', '/api/employee/my-tasks');
// const updateEmployeeTaskStatus = async (taskId: number, status: string, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/status`, { status, note });
// const completeEmployeeTask = async (taskId: number, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/complete`, { note });

// // Email APIs
// const getEmailRecipients = async () => apiCall<{ success: boolean; data: EmailRecipient[] }>('GET', '/api/email/recipients/my-department-consultants');
// const sendEmail = async (data: { userIds: number[]; subject: string; message: string; messageType: string }) => apiCall('POST', '/api/email/send', data);

// // AI APIs
// const getAISuggestConsultant = async (data: { taskName: string; taskDescription: string; projectId: number }) => apiCall('POST', '/api/ai/suggest-consultant-for-task', data);

// // File APIs
// const uploadFile = async (projectId: number, file: File, fileType: string) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   return apiCall('POST', `/api/file/upload/${projectId}?fileType=${fileType}`, formData, true);
// };
// const getMyUploads = async () => apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/my-uploads');
// const deleteFile = async (fileId: number) => apiCall('DELETE', `/api/file/delete/${fileId}`);
// const getAccessToken = async (fileId: number) => apiCall('POST', `/api/file/access-token/${fileId}`, {});

// // ============================================
// // SIDEBAR MENU ITEMS
// // ============================================

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//   { id: 'my-projects', label: 'My Projects', icon: '📁' },
//   { id: 'consultant-requests', label: 'Consultant Requests', icon: '📨' },
//   { id: 'consultants', label: 'Consultants', icon: '👥' },
//   { id: 'my-teams', label: 'My Teams', icon: '👥' },
//   { id: 'my-tasks', label: 'My Created Tasks', icon: '✅' },
//   { id: 'assigned-tasks', label: 'Assigned to Me', icon: '📋' },
//   { id: 'ai-suggest', label: 'AI Suggest', icon: '🤖' },
//   { id: 'email', label: 'Email Consultants', icon: '✉️' },
//   { id: 'uploads', label: 'Uploads', icon: '📎' },
//   { id: 'profile', label: 'Profile', icon: '👤' },
// ];

// const statusConfig: Record<string, { label: string; class: string; icon: string }> = {
//   PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳' },
//   ASSIGNED: { label: 'Assigned', class: 'status-assigned', icon: '👥' },
//   IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄' },
//   COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️' },
//   REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '❌' },
//   APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅' },
// };

// const getStatusBadge = (status: string) => {
//   const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌' };
//   return React.createElement('span', { className: `status-badge ${config.class}` },
//     React.createElement('span', { className: 'status-icon' }, config.icon),
//     config.label
//   );
// };

// // Loading Button Component
// const LoadingButton: React.FC<{ onClick: () => Promise<void>; children: React.ReactNode; className?: string; disabled?: boolean }> = ({ onClick, children, className = '', disabled = false }) => {
//   const [loading, setLoading] = useState(false);
//   const handleClick = async () => {
//     if (loading || disabled) return;
//     setLoading(true);
//     try {
//       await onClick();
//     } finally {
//       setLoading(false);
//     }
//   };
//   return React.createElement('button', { className, onClick: handleClick, disabled: loading || disabled },
//     loading ? React.createElement('span', { className: 'loading-spinner-small' }) : children
//   );
// };

// // Shimmer Loader
// const ShimmerLoader: React.FC = () => (
//   React.createElement('div', { className: 'shimmer-wrapper' },
//     React.createElement('div', { className: 'shimmer-card' },
//       React.createElement('div', { className: 'shimmer-line shimmer-line-lg' }),
//       React.createElement('div', { className: 'shimmer-line shimmer-line-md' }),
//       React.createElement('div', { className: 'shimmer-line shimmer-line-sm' })
//     ),
//     React.createElement('div', { className: 'shimmer-card' },
//       React.createElement('div', { className: 'shimmer-line shimmer-line-lg' }),
//       React.createElement('div', { className: 'shimmer-line shimmer-line-md' }),
//       React.createElement('div', { className: 'shimmer-line shimmer-line-sm' })
//     )
//   )
// );

// // AI Profile Modal
// const AIConsultantProfileModal: React.FC<{ consultant: ConsultantWithRating; onClose: () => void }> = ({ consultant, onClose }) => {
//   const [profile, setProfile] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     getAIConsultantProfile(consultant.consultantId)
//       .then(result => { setProfile(result); setLoading(false); })
//       .catch(err => { setError(err.message || 'Failed to fetch AI profile'); setLoading(false); });
//   }, [consultant.consultantId]);

//   return React.createElement('div', { className: 'modal-mask open' },
//     React.createElement('div', { className: 'modal-box ai-profile-modal-box' },
//       React.createElement('button', { className: 'm-close', onClick: onClose }, '✕'),
//       React.createElement('div', { className: 'ai-profile-header' },
//         React.createElement('div', { className: 'ai-glow-icon' }, '🧠'),
//         React.createElement('h2', null, 'AI Consultant Intelligence')
//       ),
//       React.createElement('div', { className: 'ai-profile-consultant' },
//         React.createElement('div', { className: 'ai-profile-avatar' }, consultant.name.charAt(0)),
//         React.createElement('div', null,
//           React.createElement('h3', null, consultant.name),
//           React.createElement('p', null, consultant.skill),
//           React.createElement('div', { className: 'rating-badge' }, `⭐ ${consultant.averageRating.toFixed(1)} / 5 (${consultant.totalReviews} reviews)`)
//         )
//       ),
//       loading ? React.createElement('div', { className: 'ai-loading-state' },
//         React.createElement('div', { className: 'ai-wave-animation' }),
//         React.createElement('p', null, 'Analyzing...')
//       ) : error ? React.createElement('div', { className: 'ai-error-state' },
//         React.createElement('span', null, '⚠️'),
//         React.createElement('p', null, error)
//       ) : profile && profile.status === 'success' ? React.createElement('div', { className: 'ai-result-card' },
//         React.createElement('div', { className: 'ai-result-icon' }, '🤖'),
//         React.createElement('div', { className: 'ai-result-text' },
//           React.createElement('h4', null, 'AI Analysis'),
//           React.createElement('p', null, profile.data.text)
//         )
//       ) : React.createElement('div', { className: 'ai-error-state' },
//         React.createElement('span', null, '❌'),
//         React.createElement('p', null, 'No data available')
//       ),
//       React.createElement('div', { className: 'modal-actions' },
//         React.createElement('button', { className: 'btn-primary', onClick: onClose }, 'Close')
//       )
//     )
//   );
// };

// // Timeline History Component
// const TimelineHistory: React.FC<{ history: ProjectHistory[] }> = ({ history }) => {
//   const sorted = [...history].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
//   return React.createElement('div', { className: 'timeline-container' },
//     sorted.map((entry, idx) => React.createElement('div', { key: entry.statusId, className: `timeline-item ${idx === 0 ? 'latest' : ''}` },
//       React.createElement('div', { className: 'timeline-dot' }),
//       React.createElement('div', { className: 'timeline-content' },
//         React.createElement('div', { className: 'timeline-header' },
//           React.createElement('span', { className: 'timeline-status' }, getStatusBadge(entry.status)),
//           React.createElement('span', { className: 'timeline-date' }, new Date(entry.dateTime).toLocaleString())
//         ),
//         React.createElement('div', { className: 'timeline-body' },
//           React.createElement('div', { className: 'timeline-actor' }, React.createElement('span', null, '👤'), ' ', entry.handledByName),
//           entry.managerNote && React.createElement('div', { className: 'timeline-note' }, React.createElement('span', null, '📝'), ' ', entry.managerNote),
//           entry.directorNote && React.createElement('div', { className: 'timeline-note director' }, React.createElement('span', null, '👔'), ' Director: ', entry.directorNote),
//           entry.assignedToName && React.createElement('div', { className: 'timeline-assigned' }, React.createElement('span', null, '👥'), ' Assigned to: ', entry.assignedToName),
//           entry.deadline && React.createElement('div', { className: 'timeline-deadline' }, React.createElement('span', null, '📅'), ' Deadline: ', new Date(entry.deadline).toLocaleString())
//         )
//       )
//     ))
//   );
// };

// // Main Component
// const Manager: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('dashboard');
//   const [loading, setLoading] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [myDetails, setMyDetails] = useState<MyDetails | null>(null);
//   const [isManager, setIsManager] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const { logout } = useAuth();

//   // Data states
//   const [myProjects, setMyProjects] = useState<Project[]>([]);
//   const [consultantRequests, setConsultantRequests] = useState<ConsultantRequest[]>([]);
//   const [consultants, setConsultants] = useState<ConsultantWithRating[]>([]);
//   const [myTeams, setMyTeams] = useState<Team[]>([]);
//   const [myCreatedTasks, setMyCreatedTasks] = useState<Task[]>([]);
//   const [employeeTasks, setEmployeeTasks] = useState<EmployeeTask[]>([]);
//   const [myUploads, setMyUploads] = useState<FileItem[]>([]);
//   const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);

//   const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
//   // Modal states
//   const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
//   const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);
//   const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
//   const [showEditTaskModal, setShowEditTaskModal] = useState(false);
//   const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
//   const [showRateConsultantModal, setShowRateConsultantModal] = useState(false);
//   const [showAIProfileModal, setShowAIProfileModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showEmployeeTaskModal, setShowEmployeeTaskModal] = useState(false);
//   const [activeModalTab, setActiveModalTab] = useState('overview');
//   const [showAddMemberModal, setShowAddMemberModal] = useState(false);
//   const [selectedTeamForMember, setSelectedTeamForMember] = useState<Team | null>(null);

//   // Selected items
//   const [selectedProjectFiles, setSelectedProjectFiles] = useState<FileItem[]>([]);
//   const [selectedProjectHistory, setSelectedProjectHistory] = useState<ProjectHistory[]>([]);
//   const [selectedProjectTeams, setSelectedProjectTeams] = useState<Team[]>([]);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [selectedConsultant, setSelectedConsultant] = useState<ConsultantWithRating | null>(null);
//   const [selectedEmployeeTask, setSelectedEmployeeTask] = useState<EmployeeTask | null>(null);
//   const [selectedConsultantForAI, setSelectedConsultantForAI] = useState<ConsultantWithRating | null>(null);

//   // Form states
//   const [updateProjectData, setUpdateProjectData] = useState({ status: '', note: '' });
//   const [createTaskData, setCreateTaskData] = useState({ projectId: 0, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
//   const [editTaskData, setEditTaskData] = useState({ taskDetails: '', description: '', managerNote: '', taskStatus: '' });
//   const [createTeamData, setCreateTeamData] = useState({ projectId: 0, teamName: '', memberIds: [] as number[], memberRoles: [] as string[] });
//   const [rateConsultantData, setRateConsultantData] = useState({ rating: 0, feedback: '' });
//   const [uploadFileData, setUploadFileData] = useState({ file: null as File | null, fileType: '', projectId: 0 });
//   const [employeeTaskNote, setEmployeeTaskNote] = useState('');
//   const [employeeTaskStatus, setEmployeeTaskStatus] = useState('');
//   const [aiSuggestData, setAiSuggestData] = useState({ taskName: '', taskDescription: '', projectId: 0 });
//   const [aiSuggestResult, setAiSuggestResult] = useState('');
//   const [emailData, setEmailData] = useState({ userIds: [] as number[], subject: '', message: '', messageType: 'INFORMATION' });
//   const [taskFilter, setTaskFilter] = useState('all');
//   const [projectSearch, setProjectSearch] = useState('');
//   const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
//   // Add member form states
//   const [addMemberConsultantId, setAddMemberConsultantId] = useState(0);
//   const [addMemberRole, setAddMemberRole] = useState('');

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') { setDarkMode(true); document.documentElement.setAttribute('data-theme', 'dark'); }
//     loadInitialData();
//   }, []);

//   const showToast = (type: 'success' | 'error', message: string) => {
//     setToast({ type, message });
//     setTimeout(() => setToast(null), 5000);
//   };

//   const getFormattedDateTime = () => new Date().toISOString().slice(0, 16);

//   const loadInitialData = async () => {
//     setLoading(true);
//     try {
//       const [profileRes, detailsRes, managerCheckRes] = await Promise.all([
//         getUserProfile().catch(() => ({ data: null })),
//         getMyDetails().catch(() => ({ data: null })),
//         checkIsManager().catch(() => ({ data: false })),
//       ]);
//       setUser(profileRes.data);
//       setMyDetails(detailsRes.data);
//       setIsManager(managerCheckRes.data || false);
//       if (managerCheckRes.data) await loadAllData();
//     } catch (error) { console.error(error); } finally { setLoading(false); }
//   };

//   const loadAllData = async () => {
//     try {
//       const [projectsRes, requestsRes, consultantsRes, teamsRes, tasksRes, empTasksRes, uploadsRes, emailRes] = await Promise.all([
//         getMyAssignedProjects().catch(() => ({ data: [] })),
//         getConsultantRequests().catch(() => ({ data: [] })),
//         getMyDepartmentConsultants().catch(() => ({ data: [] })),
//         getMyTeams().catch(() => ({ data: [] })),
//         getMyCreatedTasks().catch(() => ({ data: [] })),
//         getEmployeeTasks().catch(() => ({ data: [] })),
//         getMyUploads().catch(() => ({ data: [] })),
//         getEmailRecipients().catch(() => ({ data: [] })),
//       ]);
//       setMyProjects(projectsRes.data);
//       setConsultantRequests(requestsRes.data);
//       setConsultants(consultantsRes.data);
//       setMyTeams(teamsRes.data);
//       setMyCreatedTasks(tasksRes.data);
//       setEmployeeTasks(empTasksRes.data);
//       setMyUploads(uploadsRes.data);
//       setEmailRecipients(emailRes.data);
//       if (projectsRes.data.length > 0 && selectedProjectId === 0) {
//         setSelectedProjectId(projectsRes.data[0].projectId);
//         setSelectedProject(projectsRes.data[0]);
//       }
//     } catch (error) { console.error(error); }
//   };

//   const handleProjectChange = async (projectId: number) => {
//     setSelectedProjectId(projectId);
//     const project = myProjects.find(p => p.projectId === projectId);
//     setSelectedProject(project || null);
//     if (projectId) {
//       const teamsRes = await getProjectTeams(projectId).catch(() => ({ data: [] }));
//       setSelectedProjectTeams(teamsRes.data);
//     }
//   };

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//   };

//   const handleUpdateProjectStatus = async () => {
//     if (!selectedProject || !updateProjectData.status) return;
//     try {
//       await updateProjectStatus(selectedProject.projectId, updateProjectData.status, updateProjectData.note);
//       await loadAllData();
//       setShowUpdateProjectModal(false);
//       showToast('success', 'Project status updated');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleCreateTask = async () => {
//     if (!createTaskData.projectId || !createTaskData.assignedToUserId || !createTaskData.taskDetails || !createTaskData.deadline) {
//       showToast('error', 'Fill all fields'); return;
//     }
//     try {
//       await createTask(createTaskData);
//       await loadAllData();
//       setShowCreateTaskModal(false);
//       setCreateTaskData({ projectId: selectedProjectId, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
//       showToast('success', 'Task created');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleUpdateTask = async () => {
//     if (!selectedTask) return;
//     try {
//       await updateTask(selectedTask.taskId, editTaskData);
//       await loadAllData();
//       setShowEditTaskModal(false);
//       showToast('success', 'Task updated');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleDeleteTask = async (taskId: number) => {
//     if (confirm('Delete task?')) {
//       try { await deleteTask(taskId); await loadAllData(); showToast('success', 'Task deleted'); } 
//       catch (error: any) { showToast('error', error.message); }
//     }
//   };

//   const handleCreateTeam = async () => {
//     if (!createTeamData.projectId || !createTeamData.teamName || createTeamData.memberIds.length === 0) {
//       showToast('error', 'Fill all fields and select members'); return;
//     }
//     const roles = [...createTeamData.memberRoles];
//     while (roles.length < createTeamData.memberIds.length) roles.push('Member');
//     try {
//       await createTeam({ projectId: createTeamData.projectId, teamName: createTeamData.teamName, memberIds: createTeamData.memberIds, memberRoles: roles.slice(0, createTeamData.memberIds.length) });
//       await loadAllData();
//       setShowCreateTeamModal(false);
//       setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] });
//       showToast('success', 'Team created');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleAddMember = async () => {
//     if (!selectedTeamForMember) return;
//     if (!addMemberConsultantId || !addMemberRole.trim()) {
//       showToast('error', 'Please select consultant and enter role');
//       return;
//     }
//     try {
//       await addMemberToTeam(selectedTeamForMember.teamId, addMemberConsultantId, addMemberRole);
//       await loadAllData();
//       setShowAddMemberModal(false);
//       setSelectedTeamForMember(null);
//       setAddMemberConsultantId(0);
//       setAddMemberRole('');
//       showToast('success', 'Member added successfully');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleRemoveMember = async (teamId: number, memberId: number) => {
//     if (confirm('Remove this member from team?')) {
//       try { await removeMemberFromTeam(teamId, memberId); await loadAllData(); showToast('success', 'Member removed'); } 
//       catch (error: any) { showToast('error', error.message); }
//     }
//   };

//   const handleDeleteTeam = async (teamId: number) => {
//     if (confirm('Delete this team permanently?')) {
//       try { await deleteTeam(teamId); await loadAllData(); showToast('success', 'Team deleted'); } 
//       catch (error: any) { showToast('error', error.message); }
//     }
//   };

//   const handleRateConsultant = async () => {
//     if (!selectedConsultant) return;
//     if (!rateConsultantData.rating || rateConsultantData.rating < 1 || rateConsultantData.rating > 5) {
//       showToast('error', 'Rating 1-5'); return;
//     }
//     if (!rateConsultantData.feedback.trim()) {
//       showToast('error', 'Please provide feedback'); return;
//     }
//     try {
//       await rateConsultant({ consultantId: selectedConsultant.consultantId, rating: rateConsultantData.rating, feedback: rateConsultantData.feedback });
//       await loadAllData();
//       setShowRateConsultantModal(false);
//       setRateConsultantData({ rating: 0, feedback: '' });
//       showToast('success', 'Rating submitted');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleUpdateEmployeeTask = async () => {
//     if (!selectedEmployeeTask) return;
//     try {
//       await updateEmployeeTaskStatus(selectedEmployeeTask.taskId, employeeTaskStatus, employeeTaskNote);
//       await loadAllData();
//       setShowEmployeeTaskModal(false);
//       showToast('success', 'Task updated');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleCompleteEmployeeTask = async () => {
//     if (!selectedEmployeeTask) return;
//     try {
//       await completeEmployeeTask(selectedEmployeeTask.taskId, employeeTaskNote);
//       await loadAllData();
//       setShowEmployeeTaskModal(false);
//       showToast('success', 'Task completed');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleAISuggest = async () => {
//     if (!aiSuggestData.taskName || !aiSuggestData.taskDescription || !aiSuggestData.projectId) {
//       showToast('error', 'Fill all fields'); return;
//     }
//     try {
//       const res = await getAISuggestConsultant(aiSuggestData);
//       setAiSuggestResult(res.data);
//       showToast('success', 'AI suggestion ready');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleSendEmail = async () => {
//     if (emailData.userIds.length === 0 || !emailData.subject || !emailData.message) {
//       showToast('error', 'Select recipients and fill subject/message'); return;
//     }
//     try {
//       await sendEmail(emailData);
//       setShowEmailModal(false);
//       setEmailData({ userIds: [], subject: '', message: '', messageType: 'INFORMATION' });
//       showToast('success', 'Email sent');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleUploadFile = async () => {
//     if (!uploadFileData.projectId || !uploadFileData.file || !uploadFileData.fileType) {
//       showToast('error', 'Select project, file and type'); return;
//     }
//     try {
//       await uploadFile(uploadFileData.projectId, uploadFileData.file, uploadFileData.fileType);
//       if (selectedProject && selectedProject.projectId === uploadFileData.projectId) {
//         const filesRes = await getProjectFiles(uploadFileData.projectId);
//         setSelectedProjectFiles(filesRes.data);
//       }
//       const uploadsRes = await getMyUploads();
//       setMyUploads(uploadsRes.data);
//       setUploadFileData({ file: null, fileType: '', projectId: 0 });
//       showToast('success', 'File uploaded');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleDeleteFile = async (fileId: number) => {
//     if (confirm('Delete file?')) {
//       try { await deleteFile(fileId); await loadAllData(); showToast('success', 'File deleted'); } 
//       catch (error: any) { showToast('error', error.message); }
//     }
//   };

//   const handleViewProject = async (projectId: number) => {
//     setActiveModalTab('overview');
//     try {
//       const [projectRes, historyRes, teamsRes, filesRes] = await Promise.all([
//         getProjectById(projectId),
//         getProjectHistory(projectId).catch(() => ({ data: [] })),
//         getProjectTeams(projectId).catch(() => ({ data: [] })),
//         getProjectFiles(projectId).catch(() => ({ data: [] })),
//       ]);
//       setSelectedProject(projectRes.data);
//       setSelectedProjectHistory(historyRes.data);
//       setSelectedProjectTeams(teamsRes.data);
//       setSelectedProjectFiles(filesRes.data);
//       setShowProjectDetailModal(true);
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleViewFile = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
//       else showToast('error', 'Cannot view');
//     } catch { showToast('error', 'Cannot view'); }
//   };

//   const handleDownloadFile = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) window.open(`${API_BASE}${tokenRes.data.downloadUrl}`, '_blank');
//       else showToast('error', 'Cannot download');
//     } catch { showToast('error', 'Download failed'); }
//   };

//   const handleUpdateProfile = async (data: any) => {
//     try {
//       await updateUserProfile(data);
//       const profileRes = await getUserProfile();
//       setUser(profileRes.data);
//       setShowProfileModal(false);
//       showToast('success', 'Profile updated');
//     } catch (error: any) { showToast('error', error.message); }
//   };

//   const handleDeleteAccount = async () => {
//     if (confirm('Delete account permanently?')) {
//       try { await deleteAccount(); await logout(); window.location.href = '/'; } 
//       catch (error: any) { showToast('error', error.message); }
//     }
//   };

//   const filteredProjects = myProjects.filter(p => p.projectName.toLowerCase().includes(projectSearch.toLowerCase()));
//   const filteredTasks = myCreatedTasks.filter(t => {
//     if (taskFilter === 'pending') return t.taskStatus === 'PENDING';
//     if (taskFilter === 'in_progress') return t.taskStatus === 'IN_PROGRESS';
//     if (taskFilter === 'completed') return t.taskStatus === 'COMPLETED';
//     return true;
//   });
//   const formatDate = (date: string) => date ? new Date(date).toLocaleString() : 'N/A';

//   if (loading) return React.createElement(ShimmerLoader, null);

//   if (!isManager) {
//     return React.createElement('div', { className: 'client-container' },
//       React.createElement(CommonSidebar, { activeNav, setActiveNav, onLogout: async () => await logout(), onThemeToggle: toggleDarkMode, darkMode, user: user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null, menuItems: [], title: 'Access Denied', logoIcon: '🚫', isOpen: mobileSidebarOpen, onClose: () => setMobileSidebarOpen(false) }),
//       React.createElement('main', { className: 'client-main' },
//         React.createElement('div', { className: 'dashboard-card access-denied' },
//           React.createElement('div', { className: 'access-denied-icon' }, '🚫'),
//           React.createElement('h2', null, 'Access Denied'),
//           React.createElement('p', null, 'Manager permissions required.')
//         )
//       )
//     );
//   }

//   return React.createElement('div', { className: 'client-container' },
//     toast && React.createElement('div', { className: `toast-notification ${toast.type}` },
//       React.createElement('span', null, toast.type === 'success' ? '✅' : '❌'),
//       React.createElement('span', null, toast.message),
//       React.createElement('button', { onClick: () => setToast(null) }, '✕')
//     ),
//     React.createElement(CommonSidebar, { activeNav, setActiveNav, onLogout: async () => await logout(), onThemeToggle: toggleDarkMode, darkMode, user: user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null, menuItems, title: 'Manager Portal', logoIcon: '👔', isOpen: mobileSidebarOpen, onClose: () => setMobileSidebarOpen(false) }),
//     React.createElement('button', { className: 'mobile-menu-btn', onClick: () => setMobileSidebarOpen(!mobileSidebarOpen) }, '☰'),
//     React.createElement('main', { className: 'client-main' },
//       React.createElement('header', { className: 'client-header' },
//         React.createElement('div', { className: 'header-welcome' },
//           React.createElement('h1', null, `Welcome, ${user?.name?.split(' ')[0] || 'Manager'}!`),
//           React.createElement('p', null, 'Manager Dashboard')
//         ),
//         React.createElement('div', { className: 'header-stats' },
//           React.createElement('div', { className: 'header-stat-item' }, React.createElement('span', { className: 'stat-label' }, 'Projects'), React.createElement('span', { className: 'stat-value-sm' }, myProjects.length)),
//           React.createElement('div', { className: 'header-stat-item' }, React.createElement('span', { className: 'stat-label' }, 'Teams'), React.createElement('span', { className: 'stat-value-sm' }, myTeams.length)),
//           React.createElement('div', { className: 'header-stat-item' }, React.createElement('span', { className: 'stat-label' }, 'Active Tasks'), React.createElement('span', { className: 'stat-value-sm' }, myCreatedTasks.filter(t => t.taskStatus !== 'COMPLETED').length))
//         )
//       ),
//       React.createElement('div', { className: 'project-selector-bar' },
//         React.createElement('div', { className: 'project-selector-left' },
//           React.createElement('label', null, '📁 Select Project:'),
//           React.createElement('div', { className: 'project-search-wrapper' },
//             React.createElement('input', { type: 'text', placeholder: 'Search...', value: projectSearch, onChange: (e) => setProjectSearch(e.target.value), className: 'project-search-input' }),
//             React.createElement('select', { value: selectedProjectId, onChange: (e) => handleProjectChange(parseInt(e.target.value)), className: 'project-select' },
//               React.createElement('option', { value: 0 }, '-- Select Project --'),
//               filteredProjects.map(p => React.createElement('option', { key: p.projectId, value: p.projectId }, `${p.projectName} - ${p.status}`))
//             )
//           )
//         ),
//         selectedProject && React.createElement('div', { className: 'project-selector-actions' },
//           React.createElement(LoadingButton, { className: 'action-btn primary', onClick: async () => { setUpdateProjectData({ status: selectedProject.status, note: '' }); setShowUpdateProjectModal(true); } }, '📝 Update Status'),
//           React.createElement(LoadingButton, { className: 'action-btn success', onClick: async () => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId, assignedToUserId: 0, deadline: getFormattedDateTime() }); setShowCreateTaskModal(true); } }, '➕ Create Task'),
//           React.createElement(LoadingButton, { className: 'action-btn info', onClick: async () => { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] }); setShowCreateTeamModal(true); } }, '👥 Create Team'),
//           React.createElement(LoadingButton, { className: 'action-btn outline', onClick: async () => handleViewProject(selectedProjectId) }, '📋 View Details')
//         )
//       ),
//       activeNav === 'dashboard' && React.createElement(React.Fragment, null,
//         React.createElement('div', { className: 'stats-grid' },
//           React.createElement('div', { className: 'stat-card' }, React.createElement('div', { className: 'stat-icon blue' }, '📁'), React.createElement('div', { className: 'stat-info' }, React.createElement('span', { className: 'stat-value' }, myProjects.length), React.createElement('span', { className: 'stat-label' }, 'Projects'))),
//           React.createElement('div', { className: 'stat-card' }, React.createElement('div', { className: 'stat-icon green' }, '👥'), React.createElement('div', { className: 'stat-info' }, React.createElement('span', { className: 'stat-value' }, myTeams.length), React.createElement('span', { className: 'stat-label' }, 'Teams'))),
//           React.createElement('div', { className: 'stat-card' }, React.createElement('div', { className: 'stat-icon orange' }, '📨'), React.createElement('div', { className: 'stat-info' }, React.createElement('span', { className: 'stat-value' }, consultantRequests.length), React.createElement('span', { className: 'stat-label' }, 'Requests'))),
//           React.createElement('div', { className: 'stat-card' }, React.createElement('div', { className: 'stat-icon purple' }, '✅'), React.createElement('div', { className: 'stat-info' }, React.createElement('span', { className: 'stat-value' }, myCreatedTasks.length), React.createElement('span', { className: 'stat-label' }, 'Tasks')))
//         ),
//         selectedProject && React.createElement('div', { className: 'dashboard-card current-project' },
//           React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, `Current: ${selectedProject.projectName}`), getStatusBadge(selectedProject.status)),
//           React.createElement('p', null, selectedProject.projectDescription),
//           React.createElement('div', { className: 'project-meta' },
//             React.createElement('span', null, `🏢 ${selectedProject.departmentName}`),
//             React.createElement('span', null, `👤 ${selectedProject.clientName}`),
//             React.createElement('span', null, `📅 Due: ${formatDate(selectedProject.deadline)}`),
//             selectedProject.cost && React.createElement('span', null, `💰 ₹${selectedProject.cost}`)
//           )
//         ),
//         React.createElement('div', { className: 'dashboard-card' },
//           React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Recent Tasks'), React.createElement('button', { className: 'view-all-link', onClick: () => setActiveNav('my-tasks') }, 'View All →')),
//           React.createElement('div', { className: 'projects-grid' }, myCreatedTasks.slice(0, 3).map(t => React.createElement('div', { key: t.taskId, className: 'project-card' },
//             React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, t.taskDetails), getStatusBadge(t.taskStatus)),
//             React.createElement('p', null, t.description?.substring(0, 60)),
//             React.createElement('div', { className: 'project-card-meta' },
//               React.createElement('span', null, `📁 ${t.projectName}`),
//               React.createElement('span', null, `👤 ${t.assignedToUserName}`),
//               React.createElement('span', null, `📅 Due: ${formatDate(t.deadline)}`)
//             )
//           )))
//         ),
//         React.createElement('div', { className: 'dashboard-card' },
//           React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Assigned to Me'), React.createElement('button', { className: 'view-all-link', onClick: () => setActiveNav('assigned-tasks') }, 'View All →')),
//           React.createElement('div', { className: 'projects-grid' }, employeeTasks.slice(0, 3).map(t => React.createElement('div', { key: t.taskId, className: 'project-card' },
//             React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, t.description?.substring(0, 40)), getStatusBadge(t.status)),
//             React.createElement('div', { className: 'project-card-meta' },
//               React.createElement('span', null, `🔥 ${t.priority}`),
//               React.createElement('span', null, `📅 Due: ${formatDate(t.deadline)}`),
//               React.createElement('span', null, `👤 By: ${t.createdByName}`)
//             ),
//             React.createElement('button', { className: 'btn-sm btn-primary', onClick: () => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); } }, 'Update')
//           )))
//         )
//       ),
//       activeNav === 'my-projects' && React.createElement('div', { className: 'dashboard-card full-width' },
//         React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'My Projects')),
//         React.createElement('div', { className: 'projects-grid' }, myProjects.map(p => React.createElement('div', { key: p.projectId, className: 'project-card' },
//           React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, p.projectName), getStatusBadge(p.status)),
//           React.createElement('p', null, p.projectDescription?.substring(0, 80)),
//           React.createElement('div', { className: 'project-card-meta' },
//             React.createElement('span', null, `📅 Deadline: ${formatDate(p.deadline)}`),
//             React.createElement('span', null, `🏢 ${p.departmentName}`),
//             React.createElement('span', null, `👤 ${p.clientName}`),
//             p.cost && React.createElement('span', null, `💰 ₹${p.cost}`)
//           ),
//           React.createElement('div', { className: 'project-card-actions' },
//             React.createElement('button', { className: 'btn-sm btn-primary', onClick: () => handleViewProject(p.projectId) }, 'Details'),
//             React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => { setSelectedProject(p); setUpdateProjectData({ status: p.status, note: '' }); setShowUpdateProjectModal(true); } }, 'Update Status'),
//             React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => { setCreateTaskData({ ...createTaskData, projectId: p.projectId, assignedToUserId: 0, deadline: getFormattedDateTime() }); setShowCreateTaskModal(true); } }, 'Create Task')
//           )
//         )))
//       ),
//       activeNav === 'consultant-requests' && React.createElement('div', { className: 'dashboard-card full-width' },
//         React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Consultant Join Requests')),
//         React.createElement('div', { className: 'projects-grid' }, consultantRequests.map(r => React.createElement('div', { key: r.requestId, className: 'project-card' },
//           React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, r.consultantName), React.createElement('span', { className: 'status-badge status-pending' }, '⏳ Requested')),
//           React.createElement('div', { className: 'project-card-meta' },
//             React.createElement('span', null, `📁 ${r.projectName}`),
//             React.createElement('span', null, `⭐ ${r.averageRating.toFixed(1)}/5`),
//             React.createElement('span', null, `💼 ${r.experience}`)
//           ),
//           React.createElement('p', null, React.createElement('strong', null, 'Skills: '), r.skill),
//           React.createElement('div', { className: 'project-card-actions' },
//             React.createElement('button', { className: 'btn-sm btn-primary', onClick: () => { setCreateTeamData({ projectId: r.projectId, teamName: `${r.projectName} Team`, memberIds: [r.consultantId], memberRoles: ['Consultant'] }); setShowCreateTeamModal(true); } }, 'Add to Team'),
//             React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => window.open(r.resumeLink, '_blank') }, 'Resume')
//           )
//         )))
//       ),
//       activeNav === 'consultants' && React.createElement('div', { className: 'dashboard-card full-width' },
//         React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Consultants')),
//         React.createElement('div', { className: 'emp-grid' }, consultants.map(c => React.createElement('div', { key: c.consultantId, className: 'emp-card' },
//           React.createElement('div', { className: 'emp-header' },
//             React.createElement('div', { className: 'emp-avatar verified' }, c.photoUrl ? React.createElement('img', { src: c.photoUrl, alt: c.name, className: 'avatar-img' }) : c.name.charAt(0)),
//             React.createElement('div', null, React.createElement('h3', null, c.name), React.createElement('div', { className: 'dept-badge' }, c.skill?.substring(0, 40)))
//           ),
//           React.createElement('div', { className: 'emp-body' },
//             React.createElement('div', { className: 'emp-row' }, React.createElement('span', null, '📧 Email:'), React.createElement('span', null, c.email)),
//             React.createElement('div', { className: 'emp-row' }, React.createElement('span', null, '💼 Experience:'), React.createElement('span', null, c.experience)),
//             React.createElement('div', { className: 'emp-row' }, React.createElement('span', null, '⭐ Rating:'), React.createElement('span', null, `${c.averageRating.toFixed(1)}/5 (${c.totalReviews} reviews)`))
//           ),
//           React.createElement('div', { className: 'emp-footer' },
//             React.createElement('button', { className: 'btn-sm', onClick: () => { setSelectedConsultant(c); setRateConsultantData({ rating: 0, feedback: '' }); setShowRateConsultantModal(true); } }, '⭐ Rate'),
//             React.createElement('button', { className: 'btn-sm btn-ai', onClick: () => { setSelectedConsultantForAI(c); setShowAIProfileModal(true); } }, '🧠 AI Profile'),
//             React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => { if (selectedProjectId) { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [c.userId], memberRoles: ['Member'] }); setShowCreateTeamModal(true); } else { showToast('error', 'Select project first'); } } }, 'Add to Team')
//           )
//         )))
//       ),
//       activeNav === 'my-teams' && React.createElement('div', { className: 'dashboard-card full-width' },
//         React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'My Teams'), React.createElement('button', { className: 'btn-primary btn-sm', onClick: () => { setCreateTeamData({ projectId: selectedProjectId || myProjects[0]?.projectId || 0, teamName: '', memberIds: [], memberRoles: [] }); setShowCreateTeamModal(true); } }, '➕ Create Team')),
//         React.createElement('div', { className: 'teams-grid' }, myTeams.map(team => React.createElement('div', { key: team.teamId, className: 'team-card' },
//           React.createElement('div', { className: 'team-card-header' }, React.createElement('h3', null, team.teamName), React.createElement('span', { className: 'team-project' }, `📁 ${team.projectName}`)),
//           React.createElement('div', { className: 'team-manager' }, `👔 Manager: ${team.managerName}`),
//           React.createElement('div', { className: 'team-members-list' },
//             React.createElement('div', { className: 'members-title' }, `Members (${team.members.length})`),
//             team.members.map(m => React.createElement('div', { key: m.memberId, className: 'team-member-row' },
//               React.createElement('div', { className: 'member-avatar-small' }, m.memberName.charAt(0)),
//               React.createElement('div', { className: 'member-info' },
//                 React.createElement('div', { className: 'member-name' }, m.memberName),
//                 React.createElement('div', { className: 'member-role' }, m.role),
//                 React.createElement('div', { className: 'member-email' }, m.memberEmail)
//               ),
//               React.createElement('button', { className: 'btn-icon-small danger', onClick: () => handleRemoveMember(team.teamId, m.memberId) }, '🗑️ Remove')
//             ))
//           ),
//           React.createElement('div', { className: 'team-actions' },
//             React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => { setSelectedTeamForMember(team); setAddMemberConsultantId(0); setAddMemberRole(''); setShowAddMemberModal(true); } }, '👥 Add Member'),
//             React.createElement('button', { className: 'btn-sm btn-danger', onClick: () => handleDeleteTeam(team.teamId) }, '🗑️ Delete Team')
//           )
//         )))
//       ),
//       activeNav === 'my-tasks' && React.createElement('div', { className: 'dashboard-card full-width' },
//         React.createElement('div', { className: 'card-header' },
//           React.createElement('h2', null, 'My Created Tasks'),
//           React.createElement('div', { className: 'header-filters' },
//             React.createElement('select', { value: taskFilter, onChange: (e) => setTaskFilter(e.target.value) },
//               React.createElement('option', { value: 'all' }, 'All'),
//               React.createElement('option', { value: 'pending' }, 'Pending'),
//               React.createElement('option', { value: 'in_progress' }, 'In Progress'),
//               React.createElement('option', { value: 'completed' }, 'Completed')
//             ),
//             React.createElement('button', { className: 'btn-primary btn-sm', onClick: () => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId || myProjects[0]?.projectId || 0, assignedToUserId: 0, deadline: getFormattedDateTime() }); setShowCreateTaskModal(true); } }, '+ Create Task')
//           )
//         ),
//         React.createElement('div', { className: 'projects-grid' }, filteredTasks.map(t => React.createElement('div', { key: t.taskId, className: 'project-card' },
//           React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, t.taskDetails), getStatusBadge(t.taskStatus)),
//           React.createElement('p', null, t.description?.substring(0, 80)),
//           React.createElement('div', { className: 'project-card-meta' },
//             React.createElement('span', null, `📁 ${t.projectName}`),
//             React.createElement('span', null, `👤 ${t.assignedToUserName}`),
//             React.createElement('span', null, `📅 Due: ${formatDate(t.deadline)}`)
//           ),
//           React.createElement('div', { className: 'project-card-actions' },
//             React.createElement('button', { className: 'btn-sm btn-outline', onClick: () => { setSelectedTask(t); setEditTaskData({ taskDetails: t.taskDetails, description: t.description || '', managerNote: t.managerNote || '', taskStatus: t.taskStatus }); setShowEditTaskModal(true); } }, 'Edit'),
//             React.createElement('button', { className: 'btn-sm btn-danger', onClick: () => handleDeleteTask(t.taskId) }, 'Delete')
//           )
//         )))
//       ),
//       activeNav === 'assigned-tasks' && React.createElement('div', { className: 'dashboard-card full-width' },
//         React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Assigned to Me')),
//         React.createElement('div', { className: 'projects-grid' }, employeeTasks.map(t => React.createElement('div', { key: t.taskId, className: 'project-card' },
//           React.createElement('div', { className: 'project-card-header' }, React.createElement('h3', null, t.description?.substring(0, 50)), getStatusBadge(t.status)),
//           React.createElement('div', { className: 'project-card-meta' },
//             React.createElement('span', null, `🔥 ${t.priority}`),
//             React.createElement('span', null, `📅 Due: ${formatDate(t.deadline)}`),
//             React.createElement('span', null, `👤 By: ${t.createdByName}`)
//           ),
//           React.createElement('button', { className: 'btn-sm btn-primary', onClick: () => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); } }, 'Update')
//         )))
//       ),
//       activeNav === 'ai-suggest' && React.createElement('div', { className: 'dashboard-card full-width' },
//         React.createElement('h2', null, '🤖 AI Consultant Suggestion'),
//         React.createElement('div', { className: 'ai-suggest-form' },
//           React.createElement('div', { className: 'form-group' },
//             React.createElement('label', null, 'Project'),
//             React.createElement('select', { value: aiSuggestData.projectId, onChange: (e) => setAiSuggestData({ ...aiSuggestData, projectId: parseInt(e.target.value) }) },
//               React.createElement('option', { value: 0 }, 'Select Project'),
//               myProjects.map(p => React.createElement('option', { key: p.projectId, value: p.projectId }, p.projectName))
//             )
//           ),
//           React.createElement('div', { className: 'form-group' },
//             React.createElement('label', null, 'Task Name'),
//             React.createElement('input', { placeholder: 'Task name', value: aiSuggestData.taskName, onChange: (e) => setAiSuggestData({ ...aiSuggestData, taskName: e.target.value }) })
//           ),
//           React.createElement('div', { className: 'form-group' },
//             React.createElement('label', null, 'Description'),
//             React.createElement('textarea', { rows: 4, placeholder: 'Describe task...', value: aiSuggestData.taskDescription, onChange: (e) => setAiSuggestData({ ...aiSuggestData, taskDescription: e.target.value }) })
//           ),
//           React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleAISuggest }, 'Get Suggestion'),
//           aiSuggestResult && React.createElement('div', { className: 'ai-suggestion-result' },
//             React.createElement('div', { className: 'ai-suggestion-header' }, React.createElement('span', null, '🤖'), React.createElement('strong', null, 'Recommendation')),
//             React.createElement('p', null, aiSuggestResult)
//           )
//         )
//       ),
//       activeNav === 'email' && React.createElement('div', { className: 'dashboard-card full-width' },
//         React.createElement('h2', null, '✉️ Email Consultants'),
//         React.createElement('div', { className: 'email-form' },
//           React.createElement('div', { className: 'form-group' },
//             React.createElement('label', null, 'Recipients'),
//             React.createElement('div', { className: 'recipients-list' }, emailRecipients.map(r => React.createElement('label', { key: r.userId, className: 'recipient-checkbox' },
//               React.createElement('input', { type: 'checkbox', checked: emailData.userIds.includes(r.userId), onChange: () => { const ids = emailData.userIds.includes(r.userId) ? emailData.userIds.filter(id => id !== r.userId) : [...emailData.userIds, r.userId]; setEmailData({ ...emailData, userIds: ids }); } }),
//               React.createElement('span', null, React.createElement('strong', null, r.name), ' - ', r.email)
//             )))
//           ),
//           React.createElement('div', { className: 'form-group' },
//             React.createElement('label', null, 'Subject'),
//             React.createElement('input', { placeholder: 'Subject', value: emailData.subject, onChange: (e) => setEmailData({ ...emailData, subject: e.target.value }) })
//           ),
//           React.createElement('div', { className: 'form-group' },
//             React.createElement('label', null, 'Message'),
//             React.createElement('textarea', { rows: 5, placeholder: 'Message...', value: emailData.message, onChange: (e) => setEmailData({ ...emailData, message: e.target.value }) })
//           ),
//           React.createElement('div', { className: 'form-group' },
//             React.createElement('label', null, 'Type'),
//             React.createElement('select', { value: emailData.messageType, onChange: (e) => setEmailData({ ...emailData, messageType: e.target.value }) },
//               React.createElement('option', { value: 'INFORMATION' }, '📢 Info'),
//               React.createElement('option', { value: 'ALERT' }, '⚠️ Alert'),
//               React.createElement('option', { value: 'TASK' }, '✅ Task'),
//               React.createElement('option', { value: 'MEETING' }, '📅 Meeting')
//             )
//           ),
//           React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleSendEmail }, 'Send Email')
//         )
//       ),
//       activeNav === 'uploads' && React.createElement('div', { className: 'dashboard-card full-width' },
//         React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'My Uploads')),
//         React.createElement('div', { className: 'upload-section' },
//           React.createElement('select', { value: uploadFileData.projectId, onChange: (e) => setUploadFileData({ ...uploadFileData, projectId: parseInt(e.target.value) }) },
//             React.createElement('option', { value: 0 }, 'Select Project'),
//             myProjects.map(p => React.createElement('option', { key: p.projectId, value: p.projectId }, p.projectName))
//           ),
//           React.createElement('input', { type: 'file', onChange: (e) => setUploadFileData({ ...uploadFileData, file: e.target.files?.[0] || null }) }),
//           React.createElement('select', { value: uploadFileData.fileType, onChange: (e) => setUploadFileData({ ...uploadFileData, fileType: e.target.value }) },
//             React.createElement('option', { value: '' }, 'Type'),
//             React.createElement('option', { value: 'Document' }, '📄 Document'),
//             React.createElement('option', { value: 'Code' }, '💻 Code'),
//             React.createElement('option', { value: 'Image' }, '🖼️ Image'),
//             React.createElement('option', { value: 'PDF' }, '📕 PDF')
//           ),
//           React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleUploadFile }, 'Upload')
//         ),
//         React.createElement('div', { className: 'uploads-list' }, myUploads.map(f => React.createElement('div', { key: f.fileId, className: 'file-item' },
//           React.createElement('div', { className: 'file-icon' }, '📄'),
//           React.createElement('div', { className: 'file-info' },
//             React.createElement('div', { className: 'file-name' }, f.fileLink?.split('/').pop()),
//             React.createElement('div', { className: 'file-meta' },
//               React.createElement('span', null, f.fileType),
//               React.createElement('span', null, `📁 ${f.projectName}`),
//               React.createElement('span', null, formatDate(f.uploadTime))
//             )
//           ),
//           React.createElement('div', { className: 'file-actions' },
//             React.createElement('button', { className: 'btn-icon', onClick: () => handleViewFile(f.fileId) }, 'View'),
//             React.createElement('button', { className: 'btn-icon', onClick: () => handleDownloadFile(f.fileId) }, 'Download'),
//             React.createElement(LoadingButton, { className: 'btn-icon danger', onClick: async () => handleDeleteFile(f.fileId) }, 'Delete')
//           )
//         )))
//       ),
//       activeNav === 'profile' && React.createElement('div', { className: 'dashboard-card full-width' },
//         React.createElement('div', { className: 'card-header' }, React.createElement('h2', null, 'Profile'), React.createElement('button', { className: 'btn-outline', onClick: () => setShowProfileModal(true) }, 'Edit')),
//         React.createElement('div', { className: 'profile-info' },
//           React.createElement('div', { className: 'profile-avatar-large' }, React.createElement('div', { className: 'avatar-placeholder' }, user?.name?.charAt(0))),
//           React.createElement('div', { className: 'profile-details' },
//             React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Name'), React.createElement('span', null, user?.name)),
//             React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Email'), React.createElement('span', null, user?.email)),
//             React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Role'), React.createElement('span', null, 'Manager')),
//             React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Dept'), React.createElement('span', null, myDetails?.employee?.departmentName || 'N/A')),
//             React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Phone'), React.createElement('span', null, user?.phoneNumber || 'Not set')),
//             React.createElement('div', { className: 'detail-item' }, React.createElement('label', null, 'Address'), React.createElement('span', null, user?.address || 'Not set'))
//           )
//         ),
//         React.createElement('div', { className: 'setting-item danger' },
//           React.createElement('div', null, React.createElement('div', { className: 'setting-label' }, 'Delete Account'), React.createElement('div', { className: 'setting-desc' }, 'Permanently delete')),
//           React.createElement('button', { className: 'btn-danger', onClick: handleDeleteAccount }, 'Delete')
//         )
//       ),
//       React.createElement('footer', { className: 'client-footer' }, React.createElement('p', null, '© 2026 Manager Portal | Softmax.in'))
//     ),
//     showUpdateProjectModal && selectedProject && React.createElement('div', { className: 'modal-mask open' },
//       React.createElement('div', { className: 'modal-box' },
//         React.createElement('button', { className: 'm-close', onClick: () => setShowUpdateProjectModal(false) }, '✕'),
//         React.createElement('h2', null, `Update Status - ${selectedProject.projectName}`),
//         React.createElement('div', { className: 'm-form' },
//           React.createElement('select', { value: updateProjectData.status, onChange: (e) => setUpdateProjectData({ ...updateProjectData, status: e.target.value }) },
//             React.createElement('option', { value: 'PENDING' }, 'Pending'),
//             React.createElement('option', { value: 'ASSIGNED' }, 'Assigned'),
//             React.createElement('option', { value: 'IN_PROGRESS' }, 'In Progress'),
//             React.createElement('option', { value: 'COMPLETED' }, 'Completed'),
//             React.createElement('option', { value: 'REJECTED' }, 'Rejected')
//           ),
//           React.createElement('textarea', { placeholder: 'Note', value: updateProjectData.note, onChange: (e) => setUpdateProjectData({ ...updateProjectData, note: e.target.value }), rows: 3 }),
//           React.createElement(LoadingButton, { className: 'btn-msub', onClick: handleUpdateProjectStatus }, 'Update')
//         )
//       )
//     ),
//     showCreateTaskModal && React.createElement('div', { className: 'modal-mask open' },
//       React.createElement('div', { className: 'modal-box' },
//         React.createElement('button', { className: 'm-close', onClick: () => setShowCreateTaskModal(false) }, '✕'),
//         React.createElement('h2', null, 'Create Task'),
//         React.createElement('div', { className: 'm-form' },
//           React.createElement('select', { value: createTaskData.projectId, onChange: (e) => setCreateTaskData({ ...createTaskData, projectId: parseInt(e.target.value) }) },
//             React.createElement('option', { value: 0 }, 'Select Project'),
//             myProjects.map(p => React.createElement('option', { key: p.projectId, value: p.projectId }, p.projectName))
//           ),
//           React.createElement('select', { value: createTaskData.assignedToUserId, onChange: (e) => setCreateTaskData({ ...createTaskData, assignedToUserId: parseInt(e.target.value) }) },
//             React.createElement('option', { value: 0 }, 'Select Consultant'),
//             consultants.map(c => React.createElement('option', { key: c.userId, value: c.userId }, `${c.name} (⭐${c.averageRating.toFixed(1)})`))
//           ),
//           React.createElement('input', { placeholder: 'Task Title', value: createTaskData.taskDetails, onChange: (e) => setCreateTaskData({ ...createTaskData, taskDetails: e.target.value }) }),
//           React.createElement('textarea', { placeholder: 'Description', value: createTaskData.description, onChange: (e) => setCreateTaskData({ ...createTaskData, description: e.target.value }), rows: 3 }),
//           React.createElement('label', null, 'Deadline (with time)'),
//           React.createElement('input', { type: 'datetime-local', value: createTaskData.deadline, onChange: (e) => setCreateTaskData({ ...createTaskData, deadline: e.target.value }), min: getFormattedDateTime() }),
//           React.createElement(LoadingButton, { className: 'btn-msub', onClick: handleCreateTask }, 'Create')
//         )
//       )
//     ),
//     showEditTaskModal && selectedTask && React.createElement('div', { className: 'modal-mask open' },
//       React.createElement('div', { className: 'modal-box' },
//         React.createElement('button', { className: 'm-close', onClick: () => setShowEditTaskModal(false) }, '✕'),
//         React.createElement('h2', null, 'Edit Task'),
//         React.createElement('div', { className: 'm-form' },
//           React.createElement('input', { value: editTaskData.taskDetails, onChange: (e) => setEditTaskData({ ...editTaskData, taskDetails: e.target.value }) }),
//           React.createElement('textarea', { value: editTaskData.description, onChange: (e) => setEditTaskData({ ...editTaskData, description: e.target.value }), rows: 3 }),
//           React.createElement('textarea', { placeholder: 'Manager Note', value: editTaskData.managerNote, onChange: (e) => setEditTaskData({ ...editTaskData, managerNote: e.target.value }), rows: 2 }),
//           React.createElement('select', { value: editTaskData.taskStatus, onChange: (e) => setEditTaskData({ ...editTaskData, taskStatus: e.target.value }) },
//             React.createElement('option', { value: 'PENDING' }, 'Pending'),
//             React.createElement('option', { value: 'IN_PROGRESS' }, 'In Progress'),
//             React.createElement('option', { value: 'COMPLETED' }, 'Completed')
//           ),
//           React.createElement(LoadingButton, { className: 'btn-msub', onClick: handleUpdateTask }, 'Save')
//         )
//       )
//     ),
//     showCreateTeamModal && React.createElement('div', { className: 'modal-mask open' },
//       React.createElement('div', { className: 'modal-box large' },
//         React.createElement('button', { className: 'm-close', onClick: () => setShowCreateTeamModal(false) }, '✕'),
//         React.createElement('h2', null, 'Create Team'),
//         React.createElement('div', { className: 'm-form' },
//           React.createElement('select', { value: createTeamData.projectId, onChange: (e) => setCreateTeamData({ ...createTeamData, projectId: parseInt(e.target.value) }) },
//             React.createElement('option', { value: 0 }, 'Select Project'),
//             myProjects.map(p => React.createElement('option', { key: p.projectId, value: p.projectId }, p.projectName))
//           ),
//           React.createElement('input', { placeholder: 'Team Name', value: createTeamData.teamName, onChange: (e) => setCreateTeamData({ ...createTeamData, teamName: e.target.value }) }),
//           React.createElement('div', { className: 'consultants-list' }, consultants.map(c => React.createElement('label', { key: c.consultantId, className: 'consultant-checkbox' },
//             React.createElement('input', { type: 'checkbox', checked: createTeamData.memberIds.includes(c.userId), onChange: () => { const ids = createTeamData.memberIds.includes(c.userId) ? createTeamData.memberIds.filter(id => id !== c.userId) : [...createTeamData.memberIds, c.userId]; setCreateTeamData({ ...createTeamData, memberIds: ids }); } }),
//             React.createElement('span', null, `${c.name} - ${c.skill} (⭐${c.averageRating.toFixed(1)})`)
//           ))),
//           React.createElement('input', { placeholder: 'Roles (comma separated, order matches selected consultants)', value: createTeamData.memberRoles.join(','), onChange: (e) => setCreateTeamData({ ...createTeamData, memberRoles: e.target.value.split(',').map(s => s.trim()) }) }),
//           React.createElement(LoadingButton, { className: 'btn-msub', onClick: handleCreateTeam }, 'Create Team')
//         )
//       )
//     ),
//     showRateConsultantModal && selectedConsultant && React.createElement('div', { className: 'modal-mask open' },
//       React.createElement('div', { className: 'modal-box' },
//         React.createElement('button', { className: 'm-close', onClick: () => setShowRateConsultantModal(false) }, '✕'),
//         React.createElement('h2', null, `Rate ${selectedConsultant.name}`),
//         React.createElement('div', { className: 'm-form' },
//           React.createElement('div', { className: 'stars-input' }, [1, 2, 3, 4, 5].map(i => React.createElement('button', { key: i, type: 'button', className: `star-btn ${rateConsultantData.rating >= i ? 'active' : ''}`, onClick: () => setRateConsultantData({ ...rateConsultantData, rating: i }) }, i <= rateConsultantData.rating ? '⭐' : '☆'))),
//           React.createElement('textarea', { placeholder: 'Feedback', value: rateConsultantData.feedback, onChange: (e) => setRateConsultantData({ ...rateConsultantData, feedback: e.target.value }), rows: 4 }),
//           React.createElement(LoadingButton, { className: 'btn-msub', onClick: handleRateConsultant }, 'Submit')
//         )
//       )
//     ),
//     showAIProfileModal && selectedConsultantForAI && React.createElement(AIConsultantProfileModal, { consultant: selectedConsultantForAI, onClose: () => setShowAIProfileModal(false) }),
//     showEmployeeTaskModal && selectedEmployeeTask && React.createElement('div', { className: 'modal-mask open' },
//       React.createElement('div', { className: 'modal-box' },
//         React.createElement('button', { className: 'm-close', onClick: () => setShowEmployeeTaskModal(false) }, '✕'),
//         React.createElement('h2', null, 'Update Task'),
//         React.createElement('p', null, React.createElement('strong', null, selectedEmployeeTask.description)),
//         React.createElement('p', null, `Priority: ${selectedEmployeeTask.priority} | Current: ${selectedEmployeeTask.status}`),
//         React.createElement('select', { value: employeeTaskStatus, onChange: (e) => setEmployeeTaskStatus(e.target.value) },
//           React.createElement('option', { value: 'PENDING' }, 'Pending'),
//           React.createElement('option', { value: 'IN_PROGRESS' }, 'In Progress'),
//           React.createElement('option', { value: 'COMPLETED' }, 'Completed')
//         ),
//         React.createElement('textarea', { placeholder: 'Note', value: employeeTaskNote, onChange: (e) => setEmployeeTaskNote(e.target.value), rows: 3 }),
//         React.createElement('div', { className: 'modal-actions' },
//           React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleUpdateEmployeeTask }, 'Update'),
//           React.createElement(LoadingButton, { className: 'btn-success', onClick: handleCompleteEmployeeTask }, 'Complete')
//         )
//       )
//     ),
//     showAddMemberModal && selectedTeamForMember && React.createElement('div', { className: 'modal-mask open' },
//       React.createElement('div', { className: 'modal-box' },
//         React.createElement('button', { className: 'm-close', onClick: () => { setShowAddMemberModal(false); setSelectedTeamForMember(null); } }, '✕'),
//         React.createElement('h2', null, `Add Member to ${selectedTeamForMember.teamName}`),
//         React.createElement('div', { className: 'm-form' },
//           React.createElement('select', { value: addMemberConsultantId, onChange: (e) => setAddMemberConsultantId(parseInt(e.target.value)) },
//             React.createElement('option', { value: 0 }, '-- Select Consultant --'),
//             consultants.filter(c => !selectedTeamForMember.members.some(m => m.memberId === c.userId)).map(c => React.createElement('option', { key: c.userId, value: c.userId }, `${c.name} - ${c.skill} (⭐${c.averageRating.toFixed(1)})`))
//           ),
//           React.createElement('input', { placeholder: 'Role (e.g., Lead Developer, Tester, UI Designer)', value: addMemberRole, onChange: (e) => setAddMemberRole(e.target.value) }),
//           React.createElement('div', { className: 'modal-actions' },
//             React.createElement('button', { className: 'btn-outline', onClick: () => { setShowAddMemberModal(false); setSelectedTeamForMember(null); } }, 'Cancel'),
//             React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleAddMember }, 'Add Member')
//           )
//         )
//       )
//     ),
//     showProjectDetailModal && selectedProject && React.createElement('div', { className: 'modal-mask open' },
//       React.createElement('div', { className: 'modal-box large project-detail-modal' },
//         React.createElement('button', { className: 'm-close', onClick: () => setShowProjectDetailModal(false) }, '✕'),
//         React.createElement('h2', null, selectedProject.projectName),
//         selectedProject.cost && React.createElement('p', { className: 'project-cost' }, `💰 ₹${selectedProject.cost}`),
//         React.createElement('div', { className: 'm-tabs' },
//           React.createElement('button', { className: `m-tab ${activeModalTab === 'overview' ? 'active' : ''}`, onClick: () => setActiveModalTab('overview') }, '📋 Overview'),
//           React.createElement('button', { className: `m-tab ${activeModalTab === 'teams' ? 'active' : ''}`, onClick: () => setActiveModalTab('teams') }, `👥 Teams (${selectedProjectTeams.length})`),
//           React.createElement('button', { className: `m-tab ${activeModalTab === 'files' ? 'active' : ''}`, onClick: () => setActiveModalTab('files') }, `📎 Files (${selectedProjectFiles.length})`),
//           React.createElement('button', { className: `m-tab ${activeModalTab === 'history' ? 'active' : ''}`, onClick: () => setActiveModalTab('history') }, `📜 History (${selectedProjectHistory.length})`)
//         ),
//         React.createElement('div', { className: 'm-tab-content' }, activeModalTab === 'overview' && React.createElement('div', null,
//           React.createElement('div', { className: 'detail-row' }, React.createElement('label', null, 'Status:'), getStatusBadge(selectedProject.status)),
//           React.createElement('div', { className: 'detail-row' }, React.createElement('label', null, 'Description:'), React.createElement('p', null, selectedProject.projectDescription)),
//           React.createElement('div', { className: 'detail-grid' },
//             React.createElement('div', null, React.createElement('label', null, 'Type:'), ' ', selectedProject.projectType),
//             React.createElement('div', null, React.createElement('label', null, 'Client:'), ' ', selectedProject.clientName),
//             React.createElement('div', null, React.createElement('label', null, 'Email:'), ' ', selectedProject.clientEmail),
//             React.createElement('div', null, React.createElement('label', null, 'Department:'), ' ', selectedProject.departmentName),
//             React.createElement('div', null, React.createElement('label', null, 'Manager:'), ' ', selectedProject.assignedManagerName || 'Not assigned'),
//             React.createElement('div', null, React.createElement('label', null, 'Deadline:'), ' ', formatDate(selectedProject.deadline)),
//             React.createElement('div', null, React.createElement('label', null, 'Created:'), ' ', formatDate(selectedProject.createdAt))
//           )
//         )),
//         React.createElement('div', { className: 'm-tab-content', style: { display: activeModalTab === 'teams' ? 'block' : 'none' } },
//           selectedProjectTeams.length === 0 ? React.createElement('div', { className: 'empty-state' }, React.createElement('span', null, '👥'), React.createElement('p', null, 'No teams yet')) :
//           selectedProjectTeams.map(team => React.createElement('div', { key: team.teamId, className: 'team-detail-card' },
//             React.createElement('div', { className: 'team-detail-header' }, React.createElement('h3', null, team.teamName), React.createElement('span', { className: 'team-manager-badge' }, `👔 ${team.managerName}`)),
//             React.createElement('div', { className: 'team-members-list' }, team.members.map(m => React.createElement('div', { key: m.memberId, className: 'team-member-row' },
//               React.createElement('div', { className: 'member-avatar-small' }, m.memberName.charAt(0)),
//               React.createElement('div', null,
//                 React.createElement('div', { className: 'member-name' }, m.memberName),
//                 React.createElement('div', { className: 'member-role' }, m.role),
//                 React.createElement('div', { className: 'member-email' }, m.memberEmail)
//               )
//             )))
//           ))
//         ),
//         React.createElement('div', { className: 'm-tab-content', style: { display: activeModalTab === 'files' ? 'block' : 'none' } },
//           React.createElement('div', { className: 'upload-section' },
//             React.createElement('input', { type: 'file', onChange: (e) => setUploadFileData({ ...uploadFileData, file: e.target.files?.[0] || null, projectId: selectedProject.projectId }) }),
//             React.createElement('select', { value: uploadFileData.fileType, onChange: (e) => setUploadFileData({ ...uploadFileData, fileType: e.target.value }) },
//               React.createElement('option', { value: '' }, 'Type'),
//               React.createElement('option', { value: 'Document' }, 'Document'),
//               React.createElement('option', { value: 'Code' }, 'Code'),
//               React.createElement('option', { value: 'Image' }, 'Image'),
//               React.createElement('option', { value: 'PDF' }, 'PDF')
//             ),
//             React.createElement(LoadingButton, { className: 'btn-primary', onClick: handleUploadFile }, 'Upload')
//           ),
//           React.createElement('div', { className: 'files-grid' }, selectedProjectFiles.map(f => React.createElement('div', { key: f.fileId, className: 'file-card', onClick: () => handleViewFile(f.fileId) },
//             React.createElement('div', { className: 'file-card-icon' }, '📄'),
//             React.createElement('div', { className: 'file-card-info' },
//               React.createElement('div', { className: 'file-card-name' }, f.fileLink?.split('/').pop()?.substring(0, 25)),
//               React.createElement('div', { className: 'file-card-meta' },
//                 React.createElement('span', null, f.fileType),
//                 React.createElement('span', null, f.uploaderName),
//                 React.createElement('span', null, formatDate(f.uploadTime))
//               )
//             ),
//             React.createElement('button', { className: 'btn-icon', onClick: (e) => { e.stopPropagation(); handleDownloadFile(f.fileId); } }, '⬇️')
//           )))
//         ),
//         React.createElement('div', { className: 'm-tab-content', style: { display: activeModalTab === 'history' ? 'block' : 'none' } }, React.createElement(TimelineHistory, { history: selectedProjectHistory }))
//       )
//     ),
//     showProfileModal && React.createElement('div', { className: 'modal-mask open' },
//       React.createElement('div', { className: 'modal-box' },
//         React.createElement('button', { className: 'm-close', onClick: () => setShowProfileModal(false) }, '✕'),
//         React.createElement('h2', null, 'Edit Profile'),
//         React.createElement('form', { onSubmit: (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleUpdateProfile({ name: fd.get('name'), phoneNumber: fd.get('phoneNumber'), address: fd.get('address'), gender: fd.get('gender'), dob: fd.get('dob') }); } },
//           React.createElement('div', { className: 'm-form' },
//             React.createElement('input', { name: 'name', defaultValue: user?.name }),
//             React.createElement('input', { name: 'phoneNumber', defaultValue: user?.phoneNumber }),
//             React.createElement('input', { name: 'gender', defaultValue: user?.gender }),
//             React.createElement('input', { name: 'dob', type: 'date', defaultValue: user?.dob }),
//             React.createElement('textarea', { name: 'address', rows: 2, defaultValue: user?.address }),
//             React.createElement('button', { type: 'submit', className: 'btn-msub' }, 'Save')
//           )
//         )
//       )
//     ),
//     React.createElement('style', { jsx: true, dangerouslySetInnerHTML: { __html: `
//       .client-container { position: relative; }
//       .toast-notification { position: fixed; top: 80px; right: 20px; z-index: 10000; display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 12px; background: var(--card-bg); border-left: 4px solid; box-shadow: var(--shadow-lg); animation: slideInRight 0.3s ease; }
//       .toast-notification.success { border-left-color: var(--green); }
//       .toast-notification.error { border-left-color: var(--red); }
//       @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
//       .project-selector-bar { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
//       .project-selector-left { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
//       .project-search-input { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); width: 200px; }
//       .project-select { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); min-width: 250px; }
//       .action-btn { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 500; cursor: pointer; border: none; }
//       .action-btn.primary { background: var(--teal); color: white; }
//       .action-btn.success { background: var(--green); color: white; }
//       .action-btn.info { background: var(--blue); color: white; }
//       .action-btn.outline { background: transparent; border: 1px solid var(--teal); color: var(--teal); }
//       .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
//       .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; display: flex; align-items: center; gap: 1rem; }
//       .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
//       .stat-info .stat-value { font-size: 1.8rem; font-weight: 700; line-height: 1; }
//       .dashboard-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; }
//       .dashboard-card.full-width { width: 100%; }
//       .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
//       .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
//       .project-card { background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; transition: all 0.2s; }
//       .project-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem; }
//       .project-card-header h3 { font-size: 1rem; font-weight: 600; margin: 0; }
//       .project-card-meta { display: flex; gap: 0.8rem; flex-wrap: wrap; font-size: 0.7rem; color: var(--muted); }
//       .project-card-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; }
//       .emp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
//       .emp-card { background: var(--bg); border: 1px solid var(--border); border-radius: 18px; padding: 1.3rem; transition: all 0.3s ease; }
//       .emp-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
//       .emp-avatar { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: rgba(44, 166, 164, 0.1); }
//       .emp-body { margin-top: 0.75rem; }
//       .emp-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 0.8rem; }
//       .emp-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.5rem; flex-wrap: wrap; }
//       .teams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1.5rem; }
//       .team-card { background: var(--bg); border: 1px solid var(--border); border-radius: 18px; padding: 1.3rem; transition: all 0.3s ease; }
//       .team-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; }
//       .team-card-header h3 { font-size: 1rem; font-weight: 600; margin: 0; }
//       .team-project { font-size: 0.7rem; background: var(--surface); padding: 0.2rem 0.5rem; border-radius: 12px; }
//       .team-manager { font-size: 0.8rem; color: var(--teal); margin-bottom: 0.8rem; }
//       .team-members-list { max-height: 300px; overflow-y: auto; margin-bottom: 1rem; }
//       .members-title { font-size: 0.7rem; font-weight: 600; color: var(--muted); margin-bottom: 0.5rem; }
//       .team-member-row { display: flex; align-items: center; gap: 0.8rem; padding: 0.5rem; background: var(--surface); border-radius: 8px; margin-bottom: 0.5rem; }
//       .member-avatar-small { width: 36px; height: 36px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
//       .member-info { flex: 1; }
//       .member-name { font-weight: 600; font-size: 0.8rem; }
//       .member-role { font-size: 0.7rem; color: var(--teal); }
//       .member-email { font-size: 0.65rem; color: var(--muted); }
//       .team-actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem; }
//       .btn-sm { padding: 0.3rem 0.8rem; font-size: 0.7rem; border-radius: 20px; cursor: pointer; }
//       .btn-primary { background: var(--teal); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
//       .btn-outline { background: transparent; border: 1px solid var(--teal); color: var(--teal); }
//       .btn-danger { background: var(--red); color: white; border: none; }
//       .btn-success { background: var(--green); color: white; border: none; }
//       .btn-ai { background: linear-gradient(135deg, #6c5ce7, #a463f5); color: white; }
//       .btn-msub { padding: 0.75rem; border-radius: 40px; background: var(--teal); color: white; font-weight: 600; width: 100%; cursor: pointer; }
//       .btn-icon { padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); cursor: pointer; }
//       .btn-icon-small { padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); cursor: pointer; font-size: 0.7rem; }
//       .form-group { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
//       .form-group label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--muted); }
//       .form-group input, .form-group select, .form-group textarea { padding: 0.6rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); }
//       .m-form { display: flex; flex-direction: column; gap: 1rem; }
//       .stars-input { display: flex; gap: 0.5rem; margin: 0.5rem 0; }
//       .star-btn { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; }
//       .consultants-list { max-height: 250px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem; }
//       .consultant-checkbox { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; cursor: pointer; border-bottom: 1px solid var(--border); }
//       .recipients-list { max-height: 200px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem; }
//       .recipient-checkbox { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; cursor: pointer; }
//       .profile-info { display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
//       .profile-avatar-large { width: 100px; height: 100px; border-radius: 24px; background: linear-gradient(135deg, var(--teal), var(--green)); display: flex; align-items: center; justify-content: center; }
//       .avatar-placeholder { font-size: 2.5rem; font-weight: 700; color: white; }
//       .profile-details { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
//       .detail-item { display: flex; flex-direction: column; gap: 0.2rem; }
//       .detail-item label { font-size: 0.65rem; font-weight: 600; color: var(--muted); }
//       .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--surface); border-radius: 12px; margin-top: 1rem; }
//       .ai-suggestion-result { margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, rgba(44, 166, 164, 0.1), rgba(31, 109, 168, 0.05)); border-radius: 12px; }
//       .timeline-container { display: flex; flex-direction: column; gap: 0.8rem; max-height: 500px; overflow-y: auto; }
//       .timeline-item { display: flex; gap: 1rem; }
//       .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--teal); margin-top: 0.3rem; flex-shrink: 0; }
//       .timeline-content { flex: 1; background: var(--surface); border-radius: 10px; padding: 0.6rem; }
//       .timeline-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 0.3rem; }
//       .timeline-date { font-size: 0.65rem; color: var(--muted); }
//       .timeline-body { font-size: 0.75rem; }
//       .team-detail-card { background: var(--surface); border-radius: 12px; padding: 1rem; margin-bottom: 1rem; }
//       .team-detail-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
//       .team-manager-badge { font-size: 0.7rem; background: rgba(44, 166, 164, 0.1); padding: 0.2rem 0.6rem; border-radius: 20px; color: var(--teal); }
//       .files-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
//       .file-card { width: 180px; padding: 0.8rem; background: var(--surface); border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
//       .file-card-icon { font-size: 2rem; margin-bottom: 0.3rem; }
//       .file-card-name { font-size: 0.7rem; font-weight: 500; word-break: break-all; }
//       .project-detail-modal { max-width: 850px; width: 90%; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; }
//       .m-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
//       .m-tab { padding: 0.5rem 1rem; background: transparent; border: none; cursor: pointer; color: var(--muted); border-radius: 8px 8px 0 0; transition: all 0.2s; }
//       .m-tab.active { color: var(--teal); border-bottom: 2px solid var(--teal); }
//       .m-tab-content { padding: 0.5rem; overflow-y: auto; max-height: 60vh; }
//       .detail-row { margin-bottom: 1rem; }
//       .detail-row label { font-weight: 600; color: var(--muted); min-width: 100px; display: inline-block; }
//       .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
//       .empty-state { text-align: center; padding: 2rem; color: var(--muted); }
//       .modal-mask { display: none; position: fixed; inset: 0; z-index: 2000; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); align-items: center; justify-content: center; padding: 1rem; }
//       .modal-mask.open { display: flex; }
//       .modal-box { background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px; padding: 1.5rem; width: 100%; max-width: 500px; position: relative; max-height: 90vh; overflow-y: auto; }
//       .modal-box.large { max-width: 700px; }
//       .m-close { position: absolute; top: 0.8rem; right: 0.8rem; width: 32px; height: 32px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
//       .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }
//       .ai-profile-modal-box { max-width: 550px; }
//       .ai-profile-header { text-align: center; margin-bottom: 1rem; }
//       .ai-glow-icon { font-size: 2.5rem; animation: pulse 1s infinite; }
//       .ai-profile-consultant { display: flex; gap: 1rem; align-items: center; padding: 1rem; background: linear-gradient(135deg, rgba(44, 166, 164, 0.1), rgba(31, 109, 168, 0.05)); border-radius: 16px; margin-bottom: 1rem; }
//       .ai-profile-avatar { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, var(--teal), var(--green)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white; }
//       .rating-badge { font-size: 0.8rem; color: #f59e0b; margin-top: 0.25rem; }
//       .ai-loading-state { text-align: center; padding: 2rem; }
//       .ai-wave-animation { width: 50px; height: 50px; margin: 0 auto 1rem; background: linear-gradient(135deg, var(--teal), var(--green)); border-radius: 50%; animation: wave 1s ease-in-out infinite; }
//       .ai-error-state { text-align: center; padding: 1rem; background: rgba(231, 76, 60, 0.1); border-radius: 12px; color: var(--red); }
//       .ai-result-card { display: flex; gap: 1rem; padding: 1rem; background: var(--surface); border-radius: 12px; border-left: 3px solid var(--teal); }
//       .ai-result-icon { font-size: 1.5rem; }
//       .ai-result-text h4 { font-size: 0.8rem; margin-bottom: 0.3rem; color: var(--teal); }
//       .ai-result-text p { font-size: 0.75rem; color: var(--muted); line-height: 1.5; }
//       .status-badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
//       .status-pending { background: rgba(243, 156, 18, 0.15); color: #f39c12; }
//       .status-assigned { background: rgba(31, 109, 168, 0.15); color: #1f6da8; }
//       .status-progress { background: rgba(44, 166, 164, 0.15); color: #2ca6a4; }
//       .status-completed { background: rgba(52, 168, 83, 0.15); color: #34a853; }
//       .loading-spinner-small { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.6s linear infinite; margin-right: 0.3rem; }
//       @keyframes spin { to { transform: rotate(360deg); } }
//       .shimmer-wrapper { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }
//       .shimmer-card { background: var(--surface); border-radius: 16px; padding: 1rem; }
//       .shimmer-line { background: linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; margin: 0.5rem 0; }
//       @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
//       .client-footer { margin-top: 2rem; padding: 1rem; text-align: center; border-top: 1px solid var(--border); color: var(--muted); font-size: 0.75rem; }
//       .access-denied { text-align: center; padding: 3rem; }
//       .access-denied-icon { font-size: 4rem; margin-bottom: 1rem; }
//       .view-all-link { color: var(--teal); background: none; border: none; cursor: pointer; font-size: 0.8rem; }
//       .header-stats { display: flex; gap: 1.5rem; }
//       .header-stat-item { text-align: right; }
//       .stat-value-sm { font-size: 0.9rem; font-weight: 600; }
//       @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
//       @keyframes wave { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); opacity: 0.5; } }
//       @media (max-width: 768px) {
//         .client-main { margin-left: 0; padding: 1rem; padding-bottom: 80px; }
//         .mobile-menu-btn { display: flex; position: fixed; bottom: 1.5rem; right: 1.5rem; width: 50px; height: 50px; border-radius: 50%; background: var(--teal); color: white; border: none; font-size: 1.5rem; cursor: pointer; z-index: 1000; align-items: center; justify-content: center; }
//         .stats-grid { grid-template-columns: repeat(2, 1fr); }
//         .projects-grid, .emp-grid, .teams-grid { grid-template-columns: 1fr; }
//         .project-selector-bar { flex-direction: column; align-items: stretch; }
//         .project-selector-left { flex-direction: column; align-items: stretch; }
//         .project-search-wrapper { flex-direction: column; }
//         .m-tabs { flex-direction: column; }
//         .m-tab.active { border-bottom: none; background: var(--teal); color: white; border-radius: 8px; }
//         .project-detail-modal { width: 95%; }
//         .detail-grid { grid-template-columns: 1fr; }
//       }
//     ` } })
//   );
// };

// export default Manager;



// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import CommonSidebar from './components/CommonSidebar';
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
//   emailVerified: boolean;
//   isProfileCompleted: boolean;
//   phoneNumber?: string;
//   address?: string;
//   gender?: string;
//   dob?: string;
// }

// interface Employee {
//   employeeId: number;
//   isDirectorVerified: boolean;
//   positionName: string;
//   salary: number;
//   department: string;
//   skillSet: string;
//   departmentId: number;
//   departmentName: string;
// }

// interface MyDetails {
//   user: UserProfile;
//   roles: Role[];
//   employee: Employee | null;
// }

// interface Role {
//   id: number;
//   ptype: string;
//   stype: string;
//   isApproved: string;
//   createdAt: string;
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
//   assignedManagerId: number;
//   assignedManagerName: string;
//   deadline: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ProjectHistory {
//   statusId: number;
//   projectId: number;
//   projectName: string;
//   status: string;
//   dateTime: string;
//   handledById: number;
//   handledByName: string;
//   assignedToId: number | null;
//   assignedToName: string | null;
//   directorNote: string | null;
//   managerNote: string | null;
//   deadline: string | null;
// }

// interface Task {
//   taskId: number;
//   projectId: number;
//   projectName: string;
//   assignedToUserId: number;
//   assignedToUserName: string;
//   assignedToUserPhoto: string | null;
//   taskDetails: string;
//   description: string;
//   taskStatus: string;
//   createdById: number;
//   createdByName: string;
//   deadline: string;
//   managerNote: string | null;
//   createdAt: string;
//   updatedAt: string;
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

// interface TeamMember {
//   memberId: number;
//   memberName: string;
//   memberEmail: string;
//   photoUrl: string | null;
//   role: string;
//   description: string | null;
// }

// interface ConsultantRequest {
//   requestId: number;
//   projectId: number;
//   projectName: string;
//   consultantId: number;
//   consultantName: string;
//   consultantEmail: string;
//   consultantPhoto: string | null;
//   skill: string;
//   experience: string;
//   marks10: number;
//   marks12: number;
//   graduationMarks: number;
//   resumeLink: string;
//   averageRating: number;
//   totalReviews: number;
//   requestedAt: string;
// }

// interface ConsultantWithRating {
//   consultantId: number;
//   userId: number;
//   name: string;
//   email: string;
//   photoUrl: string | null;
//   skill: string;
//   experience: string;
//   averageRating: number;
//   totalReviews: number;
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
//   projectId?: number;
//   projectName?: string;
// }

// interface EmployeeTask {
//   taskId: number;
//   description: string;
//   status: string;
//   priority: string;
//   createdByUserId: number;
//   createdByName: string;
//   createdByPhoto: string | null;
//   deadline: string;
//   createdAt: string;
//   updatedAt: string;
//   completedAt: string | null;
// }

// interface EmailRecipient {
//   userId: number;
//   name: string;
//   email: string;
//   role: string;
//   department: string;
// }

// interface RateConsultantRequest {
//   consultantId: number;
//   rating: number;
//   feedback: string;
// }

// interface RateConsultantResponse {
//   success: boolean;
//   message: string;
//   data: {
//     reviewId: number;
//     consultantId: number;
//     consultantName: string;
//     reviewerId: number;
//     reviewerName: string;
//     reviewMarks: number;
//     reviewNote: string;
//     createdAt: string;
//   };
// }

// interface AIReviewConsultantRequest {
//   consultantId: number;
//   projectId: number;
//   taskId: number;
//   rating: number;
//   feedback: string;
// }

// interface AIReviewConsultantResponse {
//   status: string;
//   data: {
//     text: string;
//     reviewId: number;
//     consultantId: number;
//     consultantName: string;
//     rating: number;
//     averageRating: number;
//     totalReviews: number;
//   };
//   message: string;
// }

// interface AIConsultantProfileResponse {
//   status: string;
//   data: {
//     text: string;
//     consultantId: number;
//     consultantName: string;
//   };
//   message: string;
// }

// interface AISuggestConsultantResponse {
//   success: boolean;
//   data: string;
//   message: string;
// }

// interface CreateTeamRequest {
//   projectId: number;
//   teamName: string;
//   memberIds: number[];
//   memberRoles: string[];
// }

// interface AddMemberRequest {
//   memberId: number;
//   role: string;
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
// // ALL MANAGER APIs
// // ============================================

// // Auth & User APIs
// const checkIsManager = async () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/project/check/manager');
// const getUserProfile = async () => apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
// const updateUserProfile = async (data: any) => apiCall('PUT', '/api/users/profile', data);
// const deleteAccount = async () => apiCall('DELETE', '/api/users/account');
// const getMyDetails = async () => apiCall<{ success: boolean; data: MyDetails }>('GET', '/api/getmydetails');

// // Project APIs
// const getMyAssignedProjects = async () => apiCall<{ success: boolean; data: Project[] }>('GET', '/api/project/manager/my-projects');
// const updateProjectStatus = async (projectId: number, status: string, note?: string) => {
//   let url = `/api/project/manager/update-status/${projectId}?status=${status}`;
//   if (note) url += `&note=${encodeURIComponent(note)}`;
//   return apiCall('PUT', url);
// };
// const getProjectById = async (projectId: number) => apiCall<{ success: boolean; data: Project }>('GET', `/api/project/${projectId}`);
// const getProjectHistory = async (projectId: number) => apiCall<{ success: boolean; data: ProjectHistory[] }>('GET', `/api/project/${projectId}/history`);
// const getProjectTeams = async (projectId: number) => apiCall<{ success: boolean; data: Team[] }>('GET', `/api/team/project/${projectId}`);
// const getProjectFiles = async (projectId: number) => apiCall<{ success: boolean; data: FileItem[] }>('GET', `/api/file/project/${projectId}`);

// // Task APIs (with datetime for deadline)
// const createTask = async (data: { projectId: number; assignedToUserId: number; taskDetails: string; description: string; deadline: string }) => apiCall('POST', '/api/task/create', data);
// const updateTask = async (taskId: number, data: any) => apiCall('PUT', `/api/task/update/${taskId}`, data);
// const deleteTask = async (taskId: number) => apiCall('DELETE', `/api/task/delete/${taskId}`);
// const getMyCreatedTasks = async () => apiCall<{ success: boolean; data: Task[] }>('GET', '/api/task/my-created-tasks');
// const getProjectTasks = async (projectId: number) => apiCall<{ success: boolean; data: Task[] }>('GET', `/api/task/project/${projectId}`);

// // Team APIs - Full CRUD operations for Manager
// const createTeam = async (data: CreateTeamRequest) => apiCall('POST', '/api/team/create', data);
// const addMemberToTeam = async (teamId: number, memberId: number, role: string) => apiCall('POST', `/api/team/${teamId}/add-member?memberId=${memberId}&role=${encodeURIComponent(role)}`);
// const removeMemberFromTeam = async (teamId: number, memberId: number) => apiCall('DELETE', `/api/team/${teamId}/remove-member/${memberId}`);
// const deleteTeam = async (teamId: number) => apiCall('DELETE', `/api/team/delete/${teamId}`);
// const getMyTeams = async () => apiCall<{ success: boolean; data: Team[] }>('GET', '/api/team/my-teams');

// // Consultant APIs
// const getConsultantRequests = async () => apiCall<{ success: boolean; data: ConsultantRequest[] }>('GET', '/api/consultant-project/manager/requests');
// const getMyDepartmentConsultants = async () => apiCall<{ success: boolean; data: ConsultantWithRating[] }>('GET', '/api/consultant-project/manager/my-department-consultants');
// const rateConsultant = async (data: RateConsultantRequest): Promise<RateConsultantResponse> => 
//   apiCall<RateConsultantResponse>('POST', '/api/consultant-project/manager/rate', data);
// const aiReviewConsultant = async (data: AIReviewConsultantRequest): Promise<AIReviewConsultantResponse> => 
//   apiCall<AIReviewConsultantResponse>('POST', '/api/ai/consultant/review', data);
// const getAIConsultantProfile = async (consultantId: number): Promise<AIConsultantProfileResponse> => 
//   apiCall<AIConsultantProfileResponse>('GET', `/api/ai/consultant/profile?consultantId=${consultantId}`);

// // Employee Tasks APIs
// const getEmployeeTasks = async () => apiCall<{ success: boolean; data: EmployeeTask[] }>('GET', '/api/employee/my-tasks');
// const updateEmployeeTaskStatus = async (taskId: number, status: string, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/status`, { status, note });
// const completeEmployeeTask = async (taskId: number, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/complete`, { note });

// // Email APIs
// const getEmailRecipients = async () => apiCall<{ success: boolean; data: EmailRecipient[] }>('GET', '/api/email/recipients/my-department-consultants');
// const sendEmail = async (data: { userIds: number[]; subject: string; message: string; messageType: string }) => apiCall('POST', '/api/email/send', data);

// // AI APIs
// const getAISuggestConsultant = async (data: { taskName: string; taskDescription: string; projectId: number }): Promise<AISuggestConsultantResponse> => 
//   apiCall<AISuggestConsultantResponse>('POST', '/api/ai/suggest-consultant-for-task', data);

// // File APIs
// const uploadFile = async (projectId: number, file: File, fileType: string) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   return apiCall('POST', `/api/file/upload/${projectId}?fileType=${fileType}`, formData, true);
// };
// const getMyUploads = async () => apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/my-uploads');
// const deleteFile = async (fileId: number) => apiCall('DELETE', `/api/file/delete/${fileId}`);
// const getAccessToken = async (fileId: number) => apiCall('POST', `/api/file/access-token/${fileId}`, {});

// // ============================================
// // SIDEBAR MENU ITEMS
// // ============================================

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//   { id: 'my-projects', label: 'My Projects', icon: '📁' },
//   { id: 'consultant-requests', label: 'Consultant Requests', icon: '📨' },
//   { id: 'consultants', label: 'Consultants', icon: '👥' },
//   { id: 'my-teams', label: 'My Teams', icon: '👥' },
//   { id: 'my-tasks', label: 'My Created Tasks', icon: '✅' },
//   { id: 'assigned-tasks', label: 'Assigned to Me', icon: '📋' },
//   { id: 'ai-suggest', label: 'AI Suggest', icon: '🤖' },
//   { id: 'email', label: 'Email Consultants', icon: '✉️' },
//   { id: 'uploads', label: 'Uploads', icon: '📎' },
//   { id: 'profile', label: 'Profile', icon: '👤' },
// ];

// const statusConfig: Record<string, { label: string; class: string; icon: string }> = {
//   PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳' },
//   ASSIGNED: { label: 'Assigned', class: 'status-assigned', icon: '👥' },
//   IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄' },
//   COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️' },
//   REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '❌' },
//   APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅' },
// };

// const getStatusBadge = (status: string) => {
//   const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌' };
//   return <span className={`status-badge ${config.class}`}><span className="status-icon">{config.icon}</span>{config.label}</span>;
// };

// // Loading Button Component
// const LoadingButton: React.FC<{ onClick: () => Promise<void>; children: React.ReactNode; className?: string; disabled?: boolean }> = ({ onClick, children, className = '', disabled = false }) => {
//   const [loading, setLoading] = useState(false);
//   const handleClick = async () => {
//     if (loading || disabled) return;
//     setLoading(true);
//     try {
//       await onClick();
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <button className={className} onClick={handleClick} disabled={loading || disabled}>
//       {loading ? <span className="loading-spinner-small"></span> : children}
//     </button>
//   );
// };

// // Shimmer Loader Component
// const ShimmerLoader: React.FC = () => (
//   <div className="shimmer-wrapper">
//     <div className="shimmer-card">
//       <div className="shimmer-line shimmer-line-lg"></div>
//       <div className="shimmer-line shimmer-line-md"></div>
//       <div className="shimmer-line shimmer-line-sm"></div>
//     </div>
//     <div className="shimmer-card">
//       <div className="shimmer-line shimmer-line-lg"></div>
//       <div className="shimmer-line shimmer-line-md"></div>
//       <div className="shimmer-line shimmer-line-sm"></div>
//     </div>
//     <div className="shimmer-card">
//       <div className="shimmer-line shimmer-line-lg"></div>
//       <div className="shimmer-line shimmer-line-md"></div>
//       <div className="shimmer-line shimmer-line-sm"></div>
//     </div>
//   </div>
// );

// // AI Consultant Profile Modal - Beautiful Glowing Popup
// const AIConsultantProfileModal: React.FC<{ consultant: ConsultantWithRating; onClose: () => void }> = ({ consultant, onClose }) => {
//   const [profile, setProfile] = useState<AIConsultantProfileResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [animation, setAnimation] = useState(false);

//   useEffect(() => {
//     setAnimation(true);
//     getAIConsultantProfile(consultant.consultantId)
//       .then(result => {
//         setProfile(result);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(err.message || 'Failed to fetch AI profile');
//         setLoading(false);
//       });
//   }, [consultant.consultantId]);

//   return (
//     <div className="modal-mask open ai-profile-modal">
//       <div className="modal-box ai-profile-modal-box">
//         <button className="m-close" onClick={onClose}>✕</button>
        
//         <div className={`ai-profile-content ${animation ? 'animate-in' : ''}`}>
//           <div className="ai-profile-header">
//             <div className="ai-glow-icon">🧠</div>
//             <h2>AI Consultant Intelligence</h2>
//             <div className="ai-shine-badge">✨ Powered by Advanced AI</div>
//           </div>

//           <div className="ai-profile-consultant">
//             <div className="ai-profile-avatar">
//               {consultant.name.charAt(0)}
//             </div>
//             <div className="ai-profile-info">
//               <h3>{consultant.name}</h3>
//               <p>{consultant.skill}</p>
//               <div className="rating-badge">
//                 ⭐ {consultant.averageRating.toFixed(1)} / 5 ({consultant.totalReviews} reviews)
//               </div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="ai-loading-state">
//               <div className="ai-wave-animation"></div>
//               <p>AI is analyzing consultant profile...</p>
//             </div>
//           ) : error ? (
//             <div className="ai-error-state">
//               <span className="error-icon">⚠️</span>
//               <p>{error}</p>
//             </div>
//           ) : profile && profile.status === 'success' ? (
//             <div className="ai-result-card">
//               <div className="ai-result-icon">🤖</div>
//               <div className="ai-result-text">
//                 <h4>AI Generated Analysis</h4>
//                 <p>{profile.data.text}</p>
//               </div>
//             </div>
//           ) : (
//             <div className="ai-error-state">
//               <span className="error-icon">❌</span>
//               <p>No profile data available</p>
//             </div>
//           )}
//         </div>

//         <div className="ai-profile-footer">
//           <button className="btn-primary" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // AI Review Consultant Modal
// const AIReviewConsultantModal: React.FC<{ consultant: ConsultantWithRating; projectId: number; taskId: number; onClose: () => void; onSuccess: () => void }> = ({ consultant, projectId, taskId, onClose, onSuccess }) => {
//   const [rating, setRating] = useState(0);
//   const [feedback, setFeedback] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<AIReviewConsultantResponse | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async () => {
//     if (rating === 0) {
//       setError('Please select a rating');
//       return;
//     }
//     if (!feedback.trim()) {
//       setError('Please provide feedback');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await aiReviewConsultant({
//         consultantId: consultant.consultantId,
//         projectId,
//         taskId,
//         rating,
//         feedback,
//       });
//       setResult(response);
//       setTimeout(() => {
//         onSuccess();
//         onClose();
//       }, 2000);
//     } catch (err: any) {
//       setError(err.message || 'Failed to submit review');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-mask open">
//       <div className="modal-box ai-review-box">
//         <button className="m-close" onClick={onClose}>✕</button>
//         <div className="ai-review-header">
//           <div className="ai-review-icon">✨</div>
//           <h2>AI Consultant Review</h2>
//           <div className="ai-review-subtitle">Powered by Neural AI</div>
//         </div>

//         <div className="ai-review-consultant">
//           <div className="review-avatar">{consultant.name.charAt(0)}</div>
//           <div>
//             <h3>{consultant.name}</h3>
//             <p>{consultant.skill}</p>
//             <div className="current-rating">⭐ Current: {consultant.averageRating.toFixed(1)}/5</div>
//           </div>
//         </div>

//         {result ? (
//           <div className="ai-review-result success">
//             <div className="result-text">{result.data.text}</div>
//             <div className="result-stats">
//               <span>📝 Review ID: #{result.data.reviewId}</span>
//               <span>⭐ New Rating: {result.data.rating}/5</span>
//               <span>📊 Average: {result.data.averageRating}/5</span>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="rating-section">
//               <label>Rating (1-5)</label>
//               <div className="stars-input">
//                 {[1, 2, 3, 4, 5].map(star => (
//                   <button
//                     key={star}
//                     type="button"
//                     className={`star-btn ${rating >= star ? 'active' : ''}`}
//                     onClick={() => setRating(star)}
//                   >
//                     {star <= rating ? '⭐' : '☆'}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="feedback-section">
//               <label>Feedback</label>
//               <textarea
//                 rows={4}
//                 placeholder="Describe the consultant's performance..."
//                 value={feedback}
//                 onChange={(e) => setFeedback(e.target.value)}
//               />
//             </div>

//             {error && <div className="error-message">{error}</div>}

//             <div className="modal-actions">
//               <button className="btn-outline" onClick={onClose}>Cancel</button>
//               <LoadingButton className="btn-primary" onClick={handleSubmit} disabled={loading}>
//                 {loading ? 'Submitting...' : 'Submit AI Review'}
//               </LoadingButton>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // Add Member Modal
// const AddMemberModal: React.FC<{ team: Team; consultants: ConsultantWithRating[]; onClose: () => void; onAdd: (memberId: number, role: string) => Promise<void> }> = ({ team, consultants, onClose, onAdd }) => {
//   const [selectedConsultantId, setSelectedConsultantId] = useState(0);
//   const [role, setRole] = useState('Member');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!selectedConsultantId) {
//       alert('Please select a consultant');
//       return;
//     }
//     setLoading(true);
//     await onAdd(selectedConsultantId, role);
//     setLoading(false);
//     onClose();
//   };

//   const availableConsultants = consultants.filter(c => !team.members.some(m => m.memberId === c.userId));

//   return (
//     <div className="modal-mask open">
//       <div className="modal-box">
//         <button className="m-close" onClick={onClose}>✕</button>
//         <h2>Add Member to {team.teamName}</h2>
//         <div className="m-form">
//           <select value={selectedConsultantId} onChange={(e) => setSelectedConsultantId(parseInt(e.target.value))}>
//             <option value="0">Select Consultant</option>
//             {availableConsultants.map(c => (
//               <option key={c.userId} value={c.userId}>{c.name} - {c.skill}</option>
//             ))}
//           </select>
//           <input placeholder="Role (e.g., Developer, Tester, Lead)" value={role} onChange={(e) => setRole(e.target.value)} />
//           <div className="modal-actions">
//             <button className="btn-outline" onClick={onClose}>Cancel</button>
//             <LoadingButton className="btn-primary" onClick={handleSubmit} disabled={loading}>Add Member</LoadingButton>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const Manager: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('dashboard');
//   const [loading, setLoading] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [myDetails, setMyDetails] = useState<MyDetails | null>(null);
//   const [isManager, setIsManager] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const { logout } = useAuth();

//   // Data states
//   const [myProjects, setMyProjects] = useState<Project[]>([]);
//   const [consultantRequests, setConsultantRequests] = useState<ConsultantRequest[]>([]);
//   const [consultants, setConsultants] = useState<ConsultantWithRating[]>([]);
//   const [myTeams, setMyTeams] = useState<Team[]>([]);
//   const [myCreatedTasks, setMyCreatedTasks] = useState<Task[]>([]);
//   const [employeeTasks, setEmployeeTasks] = useState<EmployeeTask[]>([]);
//   const [myUploads, setMyUploads] = useState<FileItem[]>([]);
//   const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);

//   const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
//   // Modal states
//   const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
//   const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);
//   const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
//   const [showEditTaskModal, setShowEditTaskModal] = useState(false);
//   const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
//   const [showRateConsultantModal, setShowRateConsultantModal] = useState(false);
//   const [showAIReviewModal, setShowAIReviewModal] = useState(false);
//   const [showAIProfileModal, setShowAIProfileModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showEmployeeTaskModal, setShowEmployeeTaskModal] = useState(false);
//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [showAddMemberModal, setShowAddMemberModal] = useState(false);
//   const [activeModalTab, setActiveModalTab] = useState('overview');

//   // Selected items
//   const [selectedProjectFiles, setSelectedProjectFiles] = useState<FileItem[]>([]);
//   const [selectedProjectHistory, setSelectedProjectHistory] = useState<ProjectHistory[]>([]);
//   const [selectedProjectTeams, setSelectedProjectTeams] = useState<Team[]>([]);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [selectedConsultant, setSelectedConsultant] = useState<ConsultantWithRating | null>(null);
//   const [selectedEmployeeTask, setSelectedEmployeeTask] = useState<EmployeeTask | null>(null);
//   const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
//   const [selectedConsultantForAI, setSelectedConsultantForAI] = useState<ConsultantWithRating | null>(null);

//   // Form states
//   const [updateProjectData, setUpdateProjectData] = useState({ status: '', note: '' });
//   const [createTaskData, setCreateTaskData] = useState({ projectId: 0, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
//   const [editTaskData, setEditTaskData] = useState({ taskDetails: '', description: '', managerNote: '', taskStatus: '' });
//   const [createTeamData, setCreateTeamData] = useState({ projectId: 0, teamName: '', memberIds: [] as number[], memberRoles: [] as string[] });
//   const [rateConsultantData, setRateConsultantData] = useState({ rating: 0, feedback: '' });
//   const [uploadFileData, setUploadFileData] = useState({ file: null as File | null, fileType: '', projectId: 0 });
//   const [employeeTaskNote, setEmployeeTaskNote] = useState('');
//   const [employeeTaskStatus, setEmployeeTaskStatus] = useState('');
//   const [aiSuggestData, setAiSuggestData] = useState({ taskName: '', taskDescription: '', projectId: 0 });
//   const [aiSuggestResult, setAiSuggestResult] = useState('');
//   const [emailData, setEmailData] = useState({ userIds: [] as number[], subject: '', message: '', messageType: 'INFORMATION' });

//   const [taskFilter, setTaskFilter] = useState('all');
//   const [projectSearch, setProjectSearch] = useState('');
//   const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.setAttribute('data-theme', 'dark');
//     }
//     loadInitialData();
//   }, []);

//   const showToast = (type: 'success' | 'error' | 'info', message: string) => {
//     setToast({ type, message });
//     setTimeout(() => setToast(null), 5000);
//   };

//   const loadInitialData = async () => {
//     setLoading(true);
//     try {
//       const [profileRes, detailsRes, managerCheckRes] = await Promise.all([
//         getUserProfile().catch(() => ({ data: null })),
//         getMyDetails().catch(() => ({ data: null })),
//         checkIsManager().catch(() => ({ data: false })),
//       ]);

//       setUser(profileRes.data);
//       setMyDetails(detailsRes.data);
//       setIsManager(managerCheckRes.data || false);

//       if (managerCheckRes.data) {
//         await loadAllData();
//       }
//     } catch (error) {
//       console.error('Error loading initial data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAllData = async () => {
//     try {
//       const [projectsRes, requestsRes, consultantsRes, teamsRes, tasksRes, empTasksRes, uploadsRes, emailRes] = await Promise.all([
//         getMyAssignedProjects().catch(() => ({ data: [] })),
//         getConsultantRequests().catch(() => ({ data: [] })),
//         getMyDepartmentConsultants().catch(() => ({ data: [] })),
//         getMyTeams().catch(() => ({ data: [] })),
//         getMyCreatedTasks().catch(() => ({ data: [] })),
//         getEmployeeTasks().catch(() => ({ data: [] })),
//         getMyUploads().catch(() => ({ data: [] })),
//         getEmailRecipients().catch(() => ({ data: [] })),
//       ]);

//       setMyProjects(projectsRes.data);
//       setConsultantRequests(requestsRes.data);
//       setConsultants(consultantsRes.data);
//       setMyTeams(teamsRes.data);
//       setMyCreatedTasks(tasksRes.data);
//       setEmployeeTasks(empTasksRes.data);
//       setMyUploads(uploadsRes.data);
//       setEmailRecipients(emailRes.data);
      
//       if (projectsRes.data.length > 0 && selectedProjectId === 0) {
//         setSelectedProjectId(projectsRes.data[0].projectId);
//         setSelectedProject(projectsRes.data[0]);
//       }
//     } catch (error) {
//       console.error('Error loading data:', error);
//     }
//   };

//   const getFormattedDateTime = () => {
//     const now = new Date();
//     return now.toISOString().slice(0, 16);
//   };

//   const handleProjectChange = async (projectId: number) => {
//     setSelectedProjectId(projectId);
//     const project = myProjects.find(p => p.projectId === projectId);
//     setSelectedProject(project || null);
    
//     if (projectId) {
//       try {
//         const [teamsRes] = await Promise.all([
//           getProjectTeams(projectId).catch(() => ({ data: [] })),
//         ]);
//         setSelectedProjectTeams(teamsRes.data);
//       } catch (error) {
//         console.error('Error loading project data:', error);
//       }
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

//   const handleUpdateProjectStatus = async () => {
//     if (!selectedProject || !updateProjectData.status) return;
//     try {
//       await updateProjectStatus(selectedProject.projectId, updateProjectData.status, updateProjectData.note);
//       await loadAllData();
//       setShowUpdateProjectModal(false);
//       setUpdateProjectData({ status: '', note: '' });
//       showToast('success', 'Project status updated successfully');
//     } catch (error: any) {
//       showToast('error', error.message || 'Failed to update project status');
//     }
//   };

//   const handleCreateTask = async () => {
//     if (!createTaskData.projectId || !createTaskData.assignedToUserId || !createTaskData.taskDetails || !createTaskData.deadline) {
//       showToast('error', 'Please fill all required fields');
//       return;
//     }
//     try {
//       await createTask(createTaskData);
//       await loadAllData();
//       setShowCreateTaskModal(false);
//       setCreateTaskData({ projectId: selectedProjectId, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
//       showToast('success', 'Task created successfully');
//     } catch (error: any) {
//       showToast('error', error.message || 'Failed to create task');
//     }
//   };

//   const handleUpdateTask = async () => {
//     if (!selectedTask) return;
//     try {
//       await updateTask(selectedTask.taskId, editTaskData);
//       await loadAllData();
//       setShowEditTaskModal(false);
//       setSelectedTask(null);
//       showToast('success', 'Task updated successfully');
//     } catch (error: any) {
//       showToast('error', error.message || 'Failed to update task');
//     }
//   };

//   const handleDeleteTask = async (taskId: number) => {
//     if (confirm('Delete this task?')) {
//       try {
//         await deleteTask(taskId);
//         await loadAllData();
//         showToast('success', 'Task deleted successfully');
//       } catch (error: any) {
//         showToast('error', error.message || 'Failed to delete task');
//       }
//     }
//   };

//   const handleCreateTeam = async () => {
//     if (!createTeamData.projectId || !createTeamData.teamName || createTeamData.memberIds.length === 0) {
//       showToast('error', 'Please fill all fields and select at least one consultant');
//       return;
//     }
//     const roles = [...createTeamData.memberRoles];
//     while (roles.length < createTeamData.memberIds.length) roles.push('Member');
    
//     try {
//       await createTeam({
//         projectId: createTeamData.projectId,
//         teamName: createTeamData.teamName,
//         memberIds: createTeamData.memberIds,
//         memberRoles: roles.slice(0, createTeamData.memberIds.length),
//       });
//       await loadAllData();
//       setShowCreateTeamModal(false);
//       setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] });
//       showToast('success', 'Team created successfully');
//     } catch (error: any) {
//       showToast('error', error.message || 'Failed to create team');
//     }
//   };

//   const handleAddMemberToTeam = async (teamId: number, memberId: number, role: string) => {
//     try {
//       await addMemberToTeam(teamId, memberId, role);
//       await loadAllData();
//       showToast('success', 'Member added successfully');
//     } catch (error: any) {
//       showToast('error', error.message || 'Failed to add member');
//     }
//   };

//   const handleRemoveMember = async (teamId: number, memberId: number) => {
//     if (confirm('Remove this member from team?')) {
//       try {
//         await removeMemberFromTeam(teamId, memberId);
//         await loadAllData();
//         showToast('success', 'Member removed successfully');
//       } catch (error: any) {
//         showToast('error', error.message || 'Failed to remove member');
//       }
//     }
//   };

//   const handleDeleteTeam = async (teamId: number) => {
//     if (confirm('Delete this team permanently?')) {
//       try {
//         await deleteTeam(teamId);
//         await loadAllData();
//         showToast('success', 'Team deleted successfully');
//       } catch (error: any) {
//         showToast('error', error.message || 'Failed to delete team');
//       }
//     }
//   };

//   const handleRateConsultant = async () => {
//     if (!selectedConsultant) return;
//     if (!rateConsultantData.rating || rateConsultantData.rating < 1 || rateConsultantData.rating > 5) {
//       showToast('error', 'Please provide rating between 1 and 5');
//       return;
//     }
//     if (!rateConsultantData.feedback.trim()) {
//       showToast('error', 'Please provide feedback');
//       return;
//     }
//     try {
//       const response = await rateConsultant({ 
//         consultantId: selectedConsultant.consultantId, 
//         rating: rateConsultantData.rating, 
//         feedback: rateConsultantData.feedback 
//       });
//       await loadAllData();
//       setShowRateConsultantModal(false);
//       setSelectedConsultant(null);
//       setRateConsultantData({ rating: 0, feedback: '' });
//       showToast('success', response.message || 'Rating submitted successfully');
//     } catch (error: any) {
//       showToast('error', error.message || 'Failed to submit rating');
//     }
//   };

//   const handleUpdateEmployeeTask = async () => {
//     if (!selectedEmployeeTask) return;
//     try {
//       await updateEmployeeTaskStatus(selectedEmployeeTask.taskId, employeeTaskStatus, employeeTaskNote);
//       await loadAllData();
//       setShowEmployeeTaskModal(false);
//       setSelectedEmployeeTask(null);
//       setEmployeeTaskNote('');
//       setEmployeeTaskStatus('');
//       showToast('success', 'Task status updated');
//     } catch (error: any) {
//       showToast('error', error.message || 'Failed to update task');
//     }
//   };

//   const handleCompleteEmployeeTask = async () => {
//     if (!selectedEmployeeTask) return;
//     try {
//       await completeEmployeeTask(selectedEmployeeTask.taskId, employeeTaskNote);
//       await loadAllData();
//       setShowEmployeeTaskModal(false);
//       setSelectedEmployeeTask(null);
//       setEmployeeTaskNote('');
//       showToast('success', 'Task completed');
//     } catch (error: any) {
//       showToast('error', error.message || 'Failed to complete task');
//     }
//   };

//   const handleAISuggest = async () => {
//     if (!aiSuggestData.taskName || !aiSuggestData.taskDescription || !aiSuggestData.projectId) {
//       showToast('error', 'Please fill all fields');
//       return;
//     }
//     try {
//       const res = await getAISuggestConsultant(aiSuggestData);
//       setAiSuggestResult(res.data);
//       showToast('success', 'AI suggestion generated');
//     } catch (error: any) {
//       showToast('error', error.message || 'Failed to get suggestion');
//     }
//   };

//   const handleSendEmail = async () => {
//     if (emailData.userIds.length === 0 || !emailData.subject || !emailData.message) {
//       showToast('error', 'Please select recipients, enter subject and message');
//       return;
//     }
//     try {
//       await sendEmail(emailData);
//       setShowEmailModal(false);
//       setEmailData({ userIds: [], subject: '', message: '', messageType: 'INFORMATION' });
//       showToast('success', 'Email sent successfully');
//     } catch (error: any) {
//       showToast('error', error.message || 'Failed to send email');
//     }
//   };

//   const handleUploadFile = async () => {
//     if (!uploadFileData.projectId || !uploadFileData.file || !uploadFileData.fileType) {
//       showToast('error', 'Please select project, file and file type');
//       return;
//     }
//     try {
//       await uploadFile(uploadFileData.projectId, uploadFileData.file, uploadFileData.fileType);
//       if (selectedProject && selectedProject.projectId === uploadFileData.projectId) {
//         const filesRes = await getProjectFiles(uploadFileData.projectId);
//         setSelectedProjectFiles(filesRes.data);
//       }
//       const uploadsRes = await getMyUploads();
//       setMyUploads(uploadsRes.data);
//       setUploadFileData({ file: null, fileType: '', projectId: 0 });
//       showToast('success', 'File uploaded successfully');
//     } catch (error: any) {
//       showToast('error', error.message || 'Upload failed');
//     }
//   };

//   const handleDeleteFile = async (fileId: number) => {
//     if (confirm('Delete this file?')) {
//       try {
//         await deleteFile(fileId);
//         if (selectedProject) {
//           const filesRes = await getProjectFiles(selectedProject.projectId);
//           setSelectedProjectFiles(filesRes.data);
//         }
//         const uploadsRes = await getMyUploads();
//         setMyUploads(uploadsRes.data);
//         showToast('success', 'File deleted');
//       } catch (error: any) {
//         showToast('error', error.message || 'Delete failed');
//       }
//     }
//   };

//   const handleViewProject = async (projectId: number) => {
//     setActiveModalTab('overview');
//     try {
//       const [projectRes, historyRes, teamsRes, filesRes] = await Promise.all([
//         getProjectById(projectId),
//         getProjectHistory(projectId).catch(() => ({ data: [] })),
//         getProjectTeams(projectId).catch(() => ({ data: [] })),
//         getProjectFiles(projectId).catch(() => ({ data: [] })),
//       ]);
//       setSelectedProject(projectRes.data);
//       setSelectedProjectHistory(historyRes.data);
//       setSelectedProjectTeams(teamsRes.data);
//       setSelectedProjectFiles(filesRes.data);
//       setShowProjectDetailModal(true);
//     } catch (error: any) {
//       showToast('error', error.message || 'Failed to load project');
//     }
//   };

//   const handleViewFile = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) {
//         window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
//       } else {
//         showToast('error', 'Cannot view file');
//       }
//     } catch { 
//       showToast('error', 'Cannot view file'); 
//     }
//   };

//   const handleDownloadFile = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) {
//         window.open(`${API_BASE}${tokenRes.data.downloadUrl}`, '_blank');
//       } else {
//         showToast('error', 'Cannot download');
//       }
//     } catch { 
//       showToast('error', 'Download failed'); 
//     }
//   };

//   const handleUpdateProfile = async (data: any) => {
//     try {
//       await updateUserProfile(data);
//       const profileRes = await getUserProfile();
//       setUser(profileRes.data);
//       setShowProfileModal(false);
//       showToast('success', 'Profile updated');
//     } catch (error: any) {
//       showToast('error', error.message || 'Update failed');
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (confirm('Delete account permanently? This action cannot be undone.')) {
//       try {
//         await deleteAccount();
//         await logout();
//         window.location.href = '/';
//       } catch (error: any) {
//         showToast('error', error.message || 'Delete failed');
//       }
//     }
//   };

//   const filteredProjects = myProjects.filter(p => 
//     p.projectName.toLowerCase().includes(projectSearch.toLowerCase())
//   );

//   const filteredTasks = myCreatedTasks.filter(t => {
//     if (taskFilter === 'pending') return t.taskStatus === 'PENDING';
//     if (taskFilter === 'in_progress') return t.taskStatus === 'IN_PROGRESS';
//     if (taskFilter === 'completed') return t.taskStatus === 'COMPLETED';
//     return true;
//   });

//   const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

//   if (loading) return <ShimmerLoader />;

//   if (!isManager) {
//     return (
//       <div className="client-container">
//         <CommonSidebar activeNav={activeNav} setActiveNav={setActiveNav} onLogout={async () => await logout()} onThemeToggle={toggleDarkMode} darkMode={darkMode} user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null} menuItems={[]} title="Access Denied" logoIcon="🚫" isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
//         <main className="client-main">
//           <div className="dashboard-card access-denied">
//             <div className="access-denied-icon">🚫</div>
//             <h2>Access Denied</h2>
//             <p>Manager permissions required to access this portal.</p>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="client-container">
//       {toast && (
//         <div className={`toast-notification ${toast.type}`}>
//           <span className="toast-icon">{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
//           <span className="toast-message">{toast.message}</span>
//           <button className="toast-close" onClick={() => setToast(null)}>✕</button>
//         </div>
//       )}

//       <CommonSidebar activeNav={activeNav} setActiveNav={setActiveNav} onLogout={async () => await logout()} onThemeToggle={toggleDarkMode} darkMode={darkMode} user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null} menuItems={menuItems} title="Manager Portal" logoIcon="👔" isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
//       <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>☰</button>

//       <main className="client-main">
//         <header className="client-header">
//           <div className="header-welcome">
//             <h1>Welcome, {user?.name?.split(' ')[0] || 'Manager'}!</h1>
//             <p>Manager Dashboard - Full Control Panel</p>
//           </div>
//           <div className="header-stats">
//             <div className="header-stat-item"><span className="stat-label">Projects</span><span className="stat-value-sm">{myProjects.length}</span></div>
//             <div className="header-stat-item"><span className="stat-label">Teams</span><span className="stat-value-sm">{myTeams.length}</span></div>
//             <div className="header-stat-item"><span className="stat-label">Active Tasks</span><span className="stat-value-sm">{myCreatedTasks.filter(t => t.taskStatus !== 'COMPLETED').length}</span></div>
//           </div>
//         </header>

//         {/* PROJECT SELECTION BAR */}
//         <div className="project-selector-bar">
//           <div className="project-selector-left">
//             <label>📁 Select Project:</label>
//             <div className="project-search-wrapper">
//               <input type="text" placeholder="Search projects..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} className="project-search-input" />
//               <select value={selectedProjectId} onChange={(e) => handleProjectChange(parseInt(e.target.value))} className="project-select">
//                 <option value="0">-- Select a Project --</option>
//                 {filteredProjects.map(p => (
//                   <option key={p.projectId} value={p.projectId}>{p.projectName} - {p.status}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="project-selector-actions">
//             {selectedProject && (
//               <>
//                 <LoadingButton className="action-btn primary" onClick={async () => { setUpdateProjectData({ status: selectedProject.status, note: '' }); setShowUpdateProjectModal(true); }}>📝 Update Status</LoadingButton>
//                 <LoadingButton className="action-btn success" onClick={async () => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId, assignedToUserId: 0, deadline: getFormattedDateTime() }); setShowCreateTaskModal(true); }}>➕ Create Task</LoadingButton>
//                 <LoadingButton className="action-btn info" onClick={async () => { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] }); setShowCreateTeamModal(true); }}>👥 Create Team</LoadingButton>
//                 <LoadingButton className="action-btn outline" onClick={async () => handleViewProject(selectedProjectId)}>📋 View Details</LoadingButton>
//               </>
//             )}
//           </div>
//         </div>

//         {/* DASHBOARD */}
//         {activeNav === 'dashboard' && (
//           <>
//             <div className="stats-grid">
//               <div className="stat-card"><div className="stat-icon blue">📁</div><div className="stat-info"><span className="stat-value">{myProjects.length}</span><span className="stat-label">Projects</span></div></div>
//               <div className="stat-card"><div className="stat-icon green">👥</div><div className="stat-info"><span className="stat-value">{myTeams.length}</span><span className="stat-label">Teams</span></div></div>
//               <div className="stat-card"><div className="stat-icon orange">📨</div><div className="stat-info"><span className="stat-value">{consultantRequests.length}</span><span className="stat-label">Requests</span></div></div>
//               <div className="stat-card"><div className="stat-icon purple">✅</div><div className="stat-info"><span className="stat-value">{myCreatedTasks.length}</span><span className="stat-label">Tasks</span></div></div>
//             </div>
            
//             {selectedProject && (
//               <div className="dashboard-card current-project">
//                 <div className="card-header"><h2>Current Project: {selectedProject.projectName}</h2>{getStatusBadge(selectedProject.status)}</div>
//                 <p className="project-card-desc">{selectedProject.projectDescription}</p>
//                 <div className="project-card-meta"><span>🏢 {selectedProject.departmentName}</span><span>👤 {selectedProject.clientName}</span><span>📅 Due: {formatDate(selectedProject.deadline)}</span></div>
//               </div>
//             )}

//             <div className="dashboard-card"><div className="card-header"><h2>Recent Tasks</h2><button className="view-all-link" onClick={() => setActiveNav('my-tasks')}>View All →</button></div><div className="projects-grid">{myCreatedTasks.slice(0, 3).map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.taskDetails}</h3>{getStatusBadge(t.taskStatus)}</div><p className="project-card-desc">{t.description?.substring(0, 60)}</p><div className="project-card-meta"><span>📁 {t.projectName}</span><span>👤 {t.assignedToUserName}</span><span>📅 Due: {formatDate(t.deadline)}</span></div></div>))}</div></div>
//             <div className="dashboard-card"><div className="card-header"><h2>Assigned to Me</h2><button className="view-all-link" onClick={() => setActiveNav('assigned-tasks')}>View All →</button></div><div className="projects-grid">{employeeTasks.slice(0, 3).map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.description?.substring(0, 40)}</h3>{getStatusBadge(t.status)}</div><div className="project-card-meta"><span>🔥 {t.priority}</span><span>📅 Due: {formatDate(t.deadline)}</span><span>👤 By: {t.createdByName}</span></div><button className="btn-sm btn-primary" onClick={() => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); }}>Update</button></div>))}</div></div>
//           </>
//         )}

//         {/* MY PROJECTS */}
//         {activeNav === 'my-projects' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>My Projects</h2></div><div className="projects-grid">{myProjects.map(p => (<div key={p.projectId} className="project-card"><div className="project-card-header"><h3>{p.projectName}</h3>{getStatusBadge(p.status)}</div><p className="project-card-desc">{p.projectDescription?.substring(0, 80)}</p><div className="project-card-meta"><span>📅 Deadline: {formatDate(p.deadline)}</span><span>🏢 {p.departmentName}</span><span>👤 {p.clientName}</span></div><div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => handleViewProject(p.projectId)}>Details</button><button className="btn-sm btn-outline" onClick={() => { setSelectedProject(p); setUpdateProjectData({ status: p.status, note: '' }); setShowUpdateProjectModal(true); }}>Update Status</button><button className="btn-sm btn-outline" onClick={() => { setCreateTaskData({ ...createTaskData, projectId: p.projectId, assignedToUserId: 0, deadline: getFormattedDateTime() }); setShowCreateTaskModal(true); }}>Create Task</button></div></div>))}</div></div>
//         )}

//         {/* CONSULTANT REQUESTS */}
//         {activeNav === 'consultant-requests' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Consultant Join Requests</h2></div><div className="projects-grid">{consultantRequests.map(r => (<div key={r.requestId} className="project-card"><div className="project-card-header"><h3>{r.consultantName}</h3><span className="status-badge status-pending">⏳ Requested</span></div><div className="project-card-meta"><span>📁 {r.projectName}</span><span>⭐ {r.averageRating.toFixed(1)}/5</span><span>💼 {r.experience}</span></div><p className="project-card-desc"><strong>Skills:</strong> {r.skill}</p><div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => { setCreateTeamData({ projectId: r.projectId, teamName: `${r.projectName} Team`, memberIds: [r.consultantId], memberRoles: ['Consultant'] }); setShowCreateTeamModal(true); }}>Add to Team</button><button className="btn-sm btn-outline" onClick={() => window.open(r.resumeLink, '_blank')}>Resume</button></div></div>))}</div></div>
//         )}

//         {/* CONSULTANTS */}
//         {activeNav === 'consultants' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Department Consultants with Ratings</h2></div><div className="emp-grid">{consultants.map(c => (<div key={c.consultantId} className="emp-card"><div className="emp-header"><div className="emp-avatar verified">{c.photoUrl ? <img src={c.photoUrl} alt={c.name} className="avatar-img" /> : c.name.charAt(0)}</div><div><h3>{c.name}</h3><div className="dept-badge">{c.skill?.substring(0, 40)}</div></div></div><div className="emp-body"><div className="emp-row"><span>📧 Email:</span><span>{c.email}</span></div><div className="emp-row"><span>💼 Experience:</span><span>{c.experience}</span></div><div className="emp-row"><span>⭐ Rating:</span><span>{c.averageRating.toFixed(1)}/5 ({c.totalReviews} reviews)</span></div></div><div className="emp-footer"><button className="btn-sm" onClick={() => { setSelectedConsultant(c); setRateConsultantData({ rating: 0, feedback: '' }); setShowRateConsultantModal(true); }}>⭐ Rate</button><button className="btn-sm btn-ai" onClick={() => { setSelectedConsultantForAI(c); setShowAIProfileModal(true); }}>🧠 AI Profile</button><button className="btn-sm btn-outline" onClick={() => { if (selectedProjectId) { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [c.userId], memberRoles: ['Member'] }); setShowCreateTeamModal(true); } else { showToast('error', 'Please select a project first'); } }}>Add to Team</button></div></div>))}</div></div>
//         )}

//         {/* MY TEAMS - Full CRUD Operations */}
//         {activeNav === 'my-teams' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>My Teams</h2><button className="btn-primary btn-sm" onClick={() => { setCreateTeamData({ projectId: selectedProjectId || myProjects[0]?.projectId || 0, teamName: '', memberIds: [], memberRoles: [] }); setShowCreateTeamModal(true); }}>➕ Create Team</button></div><div className="teams-grid">{myTeams.map(team => (<div key={team.teamId} className="team-card"><div className="team-card-header"><h3>{team.teamName}</h3><span className="team-project">📁 {team.projectName}</span></div><div className="team-manager-info">👔 Manager: <strong>{team.managerName}</strong></div><div className="team-members-list"><div className="members-title">Members ({team.members.length})</div>{team.members.map(m => (<div key={m.memberId} className="team-member-row"><div className="member-avatar-small">{m.memberName.charAt(0)}</div><div className="member-info"><div className="member-name">{m.memberName}</div><div className="member-role">{m.role}</div><div className="member-email">{m.memberEmail}</div></div><div className="member-actions"><button className="btn-icon-small danger" onClick={() => handleRemoveMember(team.teamId, m.memberId)}>🗑️ Remove</button></div></div>))}</div><div className="team-actions"><button className="btn-sm btn-outline" onClick={() => { setSelectedTeam(team); setShowAddMemberModal(true); }}>👥 Add Member</button><button className="btn-sm btn-danger" onClick={() => handleDeleteTeam(team.teamId)}>🗑️ Delete Team</button></div></div>))}</div></div>
//         )}

//         {/* MY CREATED TASKS */}
//         {activeNav === 'my-tasks' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Tasks Created by Me</h2><div className="header-filters"><select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}><option value="all">All</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select><button className="btn-primary btn-sm" onClick={() => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId || myProjects[0]?.projectId || 0, assignedToUserId: 0, deadline: getFormattedDateTime() }); setShowCreateTaskModal(true); }}>+ Create Task</button></div></div><div className="projects-grid">{filteredTasks.map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.taskDetails}</h3>{getStatusBadge(t.taskStatus)}</div><p className="project-card-desc">{t.description?.substring(0, 80)}</p><div className="project-card-meta"><span>📁 {t.projectName}</span><span>👤 {t.assignedToUserName}</span><span>📅 Due: {formatDate(t.deadline)}</span></div><div className="project-card-actions"><button className="btn-sm btn-outline" onClick={() => { setSelectedTask(t); setEditTaskData({ taskDetails: t.taskDetails, description: t.description || '', managerNote: t.managerNote || '', taskStatus: t.taskStatus }); setShowEditTaskModal(true); }}>Edit</button><button className="btn-sm btn-danger" onClick={() => handleDeleteTask(t.taskId)}>Delete</button></div></div>))}</div></div>
//         )}

//         {/* ASSIGNED TO ME */}
//         {activeNav === 'assigned-tasks' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Tasks Assigned to Me</h2></div><div className="projects-grid">{employeeTasks.map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.description?.substring(0, 50)}</h3>{getStatusBadge(t.status)}</div><div className="project-card-meta"><span>🔥 Priority: {t.priority}</span><span>📅 Deadline: {formatDate(t.deadline)}</span><span>👤 By: {t.createdByName}</span></div><button className="btn-sm btn-primary" onClick={() => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); }}>Update Status</button></div>))}</div></div>
//         )}

//         {/* AI SUGGEST */}
//         {activeNav === 'ai-suggest' && (
//           <div className="dashboard-card full-width"><h2>🤖 AI Consultant Suggestion</h2><div className="ai-suggest-form"><div className="form-group"><label>Project</label><select value={aiSuggestData.projectId} onChange={(e) => setAiSuggestData({ ...aiSuggestData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-group"><label>Task Name</label><input placeholder="Enter task name" value={aiSuggestData.taskName} onChange={(e) => setAiSuggestData({ ...aiSuggestData, taskName: e.target.value })} /></div><div className="form-group"><label>Task Description</label><textarea rows={4} placeholder="Describe the task..." value={aiSuggestData.taskDescription} onChange={(e) => setAiSuggestData({ ...aiSuggestData, taskDescription: e.target.value })} /></div><LoadingButton className="btn-primary btn-large" onClick={handleAISuggest}>Get Suggestion</LoadingButton>{aiSuggestResult && (<div className="ai-suggestion-result"><div className="ai-suggestion-header"><span className="ai-suggestion-icon">🤖</span><strong>AI Recommendation</strong></div><p>{aiSuggestResult}</p></div>)}</div></div>
//         )}

//         {/* EMAIL CONSULTANTS */}
//         {activeNav === 'email' && (
//           <div className="dashboard-card full-width"><h2>✉️ Email Department Consultants</h2><div className="email-form"><div className="form-group"><label>Select Recipients</label><div className="recipients-list">{emailRecipients.map(r => (<label key={r.userId} className="recipient-checkbox"><input type="checkbox" checked={emailData.userIds.includes(r.userId)} onChange={() => { const ids = emailData.userIds.includes(r.userId) ? emailData.userIds.filter(id => id !== r.userId) : [...emailData.userIds, r.userId]; setEmailData({ ...emailData, userIds: ids }); }} /><span><strong>{r.name}</strong> - {r.email}</span></label>))}</div></div><div className="form-group"><label>Subject</label><input placeholder="Email Subject" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} /></div><div className="form-group"><label>Message</label><textarea rows={5} placeholder="Type your message..." value={emailData.message} onChange={(e) => setEmailData({ ...emailData, message: e.target.value })} /></div><div className="form-group"><label>Message Type</label><select value={emailData.messageType} onChange={(e) => setEmailData({ ...emailData, messageType: e.target.value })}><option value="INFORMATION">📢 Information</option><option value="ALERT">⚠️ Alert</option><option value="TASK">✅ Task Assignment</option><option value="MEETING">📅 Meeting Invite</option></select></div><LoadingButton className="btn-primary btn-large" onClick={handleSendEmail}>Send Email</LoadingButton></div></div>
//         )}

//         {/* UPLOADS */}
//         {activeNav === 'uploads' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>My Uploads</h2></div><div className="upload-section"><select value={uploadFileData.projectId} onChange={(e) => setUploadFileData({ ...uploadFileData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select><input type="file" onChange={(e) => setUploadFileData({ ...uploadFileData, file: e.target.files?.[0] || null })} /><select value={uploadFileData.fileType} onChange={(e) => setUploadFileData({ ...uploadFileData, fileType: e.target.value })}><option value="">Select Type</option><option value="Document">📄 Document</option><option value="Code">💻 Code</option><option value="Image">🖼️ Image</option><option value="PDF">📕 PDF</option><option value="Report">📊 Report</option></select><LoadingButton className="btn-primary" onClick={handleUploadFile}>Upload</LoadingButton></div><div className="uploads-list">{myUploads.map(f => (<div key={f.fileId} className="file-item"><div className="file-icon">📄</div><div className="file-info"><div className="file-name">{f.fileLink?.split('/').pop()}</div><div className="file-meta"><span>{f.fileType}</span><span>📁 {f.projectName}</span><span>📅 {formatDate(f.uploadTime)}</span></div></div><div className="file-actions"><button className="btn-icon" onClick={() => handleViewFile(f.fileId)}>View</button><button className="btn-icon" onClick={() => handleDownloadFile(f.fileId)}>Download</button><LoadingButton className="btn-icon danger" onClick={async () => handleDeleteFile(f.fileId)}>Delete</LoadingButton></div></div>))}</div></div>
//         )}

//         {/* PROFILE */}
//         {activeNav === 'profile' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Profile</h2><button className="btn-outline" onClick={() => setShowProfileModal(true)}>Edit</button></div><div className="profile-info"><div className="profile-avatar-large"><div className="avatar-placeholder">{user?.name?.charAt(0)}</div></div><div className="profile-details"><div className="detail-item"><label>Name</label><span>{user?.name}</span></div><div className="detail-item"><label>Email</label><span>{user?.email}</span></div><div className="detail-item"><label>Role</label><span>Manager</span></div><div className="detail-item"><label>Department</label><span>{myDetails?.employee?.departmentName || 'N/A'}</span></div><div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not set'}</span></div><div className="detail-item"><label>Address</label><span>{user?.address || 'Not set'}</span></div></div></div><div className="setting-item danger"><div><div className="setting-label">Delete Account</div><div className="setting-desc">Permanently delete your account</div></div><button className="btn-danger" onClick={handleDeleteAccount}>Delete</button></div></div>
//         )}

//         <footer className="client-footer"><p>© 2026 Manager Portal | Developed by Softmax.in</p></footer>
//       </main>

//       {/* MODALS */}

//       {/* Update Project Status Modal */}
//       {showUpdateProjectModal && selectedProject && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowUpdateProjectModal(false)}>✕</button><h2>Update Status - {selectedProject.projectName}</h2><div className="m-form"><select value={updateProjectData.status} onChange={(e) => setUpdateProjectData({ ...updateProjectData, status: e.target.value })}><option value="PENDING">Pending</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="REJECTED">Rejected</option></select><textarea placeholder="Note (optional)" value={updateProjectData.note} onChange={(e) => setUpdateProjectData({ ...updateProjectData, note: e.target.value })} rows={3} /><LoadingButton className="btn-msub" onClick={handleUpdateProjectStatus}>Update Status</LoadingButton></div></div></div>)}

//       {/* Create Task Modal with datetime-local */}
//       {showCreateTaskModal && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowCreateTaskModal(false)}>✕</button><h2>Create Task</h2><div className="m-form"><div className="form-field"><label>Project</label><select value={createTaskData.projectId} onChange={(e) => setCreateTaskData({ ...createTaskData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-field"><label>Assign To Consultant</label><select value={createTaskData.assignedToUserId} onChange={(e) => setCreateTaskData({ ...createTaskData, assignedToUserId: parseInt(e.target.value) })}><option value="0">Select Consultant</option>{consultants.map(c => <option key={c.userId} value={c.userId}>{c.name} (⭐ {c.averageRating.toFixed(1)}) - {c.skill}</option>)}</select></div><div className="form-field"><label>Task Details</label><input placeholder="Task title" value={createTaskData.taskDetails} onChange={(e) => setCreateTaskData({ ...createTaskData, taskDetails: e.target.value })} /></div><div className="form-field"><label>Description</label><textarea placeholder="Description" value={createTaskData.description} onChange={(e) => setCreateTaskData({ ...createTaskData, description: e.target.value })} rows={3} /></div><div className="form-field"><label>Deadline (with time)</label><input type="datetime-local" value={createTaskData.deadline} onChange={(e) => setCreateTaskData({ ...createTaskData, deadline: e.target.value })} min={getFormattedDateTime()} /></div><LoadingButton className="btn-msub" onClick={handleCreateTask}>Create Task</LoadingButton></div></div></div>)}

//       {/* Edit Task Modal */}
//       {showEditTaskModal && selectedTask && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowEditTaskModal(false)}>✕</button><h2>Edit Task</h2><div className="m-form"><input value={editTaskData.taskDetails} onChange={(e) => setEditTaskData({ ...editTaskData, taskDetails: e.target.value })} /><textarea value={editTaskData.description} onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })} rows={3} /><textarea placeholder="Manager Note" value={editTaskData.managerNote} onChange={(e) => setEditTaskData({ ...editTaskData, managerNote: e.target.value })} rows={2} /><select value={editTaskData.taskStatus} onChange={(e) => setEditTaskData({ ...editTaskData, taskStatus: e.target.value })}><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><LoadingButton className="btn-msub" onClick={handleUpdateTask}>Save Changes</LoadingButton></div></div></div>)}

//       {/* Create Team Modal */}
//       {showCreateTeamModal && (<div className="modal-mask open"><div className="modal-box large"><button className="m-close" onClick={() => setShowCreateTeamModal(false)}>✕</button><h2>Create Team</h2><div className="m-form"><div className="form-field"><label>Project</label><select value={createTeamData.projectId} onChange={(e) => setCreateTeamData({ ...createTeamData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-field"><label>Team Name</label><input placeholder="Team Name" value={createTeamData.teamName} onChange={(e) => setCreateTeamData({ ...createTeamData, teamName: e.target.value })} /></div><div className="form-field"><label>Select Consultants</label><div className="consultants-checkbox-list">{consultants.map(c => (<label key={c.consultantId} className="consultant-checkbox"><input type="checkbox" checked={createTeamData.memberIds.includes(c.userId)} onChange={() => { const ids = createTeamData.memberIds.includes(c.userId) ? createTeamData.memberIds.filter(id => id !== c.userId) : [...createTeamData.memberIds, c.userId]; setCreateTeamData({ ...createTeamData, memberIds: ids }); }} /><span><strong>{c.name}</strong> - {c.skill} (⭐ {c.averageRating.toFixed(1)})</span></label>))}</div></div><div className="form-field"><label>Roles (comma separated for selected consultants)</label><input placeholder="e.g., Lead, Developer, Tester" value={createTeamData.memberRoles.join(',')} onChange={(e) => setCreateTeamData({ ...createTeamData, memberRoles: e.target.value.split(',').map(s => s.trim()) })} /></div><LoadingButton className="btn-msub" onClick={handleCreateTeam}>Create Team</LoadingButton></div></div></div>)}

//       {/* Add Member Modal */}
//       {showAddMemberModal && selectedTeam && (<AddMemberModal team={selectedTeam} consultants={consultants} onClose={() => setShowAddMemberModal(false)} onAdd={(memberId, role) => handleAddMemberToTeam(selectedTeam.teamId, memberId, role)} />)}

//       {/* Rate Consultant Modal */}
//       {showRateConsultantModal && selectedConsultant && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowRateConsultantModal(false)}>✕</button><h2>Rate {selectedConsultant.name}</h2><div className="m-form"><div className="rating-input"><label>Rating (1-5)</label><div className="stars-input">{Array(5).fill(0).map((_, i) => (<button key={i} type="button" className={`star-btn ${rateConsultantData.rating >= i + 1 ? 'active' : ''}`} onClick={() => setRateConsultantData({ ...rateConsultantData, rating: i + 1 })}>{i + 1 <= rateConsultantData.rating ? '⭐' : '☆'}</button>))}</div></div><textarea placeholder="Feedback" value={rateConsultantData.feedback} onChange={(e) => setRateConsultantData({ ...rateConsultantData, feedback: e.target.value })} rows={4} /><LoadingButton className="btn-msub" onClick={handleRateConsultant}>Submit Rating</LoadingButton></div></div></div>)}

//       {/* AI Profile Modal */}
//       {showAIProfileModal && selectedConsultantForAI && (<AIConsultantProfileModal consultant={selectedConsultantForAI} onClose={() => setShowAIProfileModal(false)} />)}

//       {/* Employee Task Modal */}
//       {showEmployeeTaskModal && selectedEmployeeTask && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowEmployeeTaskModal(false)}>✕</button><h2>Update Task</h2><p><strong>{selectedEmployeeTask.description}</strong></p><p>Priority: {selectedEmployeeTask.priority} | Current: {selectedEmployeeTask.status}</p><div className="m-form"><select value={employeeTaskStatus} onChange={(e) => setEmployeeTaskStatus(e.target.value)}><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><textarea placeholder="Add note..." value={employeeTaskNote} onChange={(e) => setEmployeeTaskNote(e.target.value)} rows={3} /><div className="modal-actions"><LoadingButton className="btn-primary" onClick={handleUpdateEmployeeTask}>Update Status</LoadingButton><LoadingButton className="btn-success" onClick={handleCompleteEmployeeTask}>Complete Task</LoadingButton></div></div></div></div>)}

//       {/* Project Detail Modal */}
//       {showProjectDetailModal && selectedProject && (<div className="modal-mask open"><div className="modal-box large project-detail-modal"><button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button><h2>{selectedProject.projectName}</h2><div className="m-tabs"><button className={`m-tab ${activeModalTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveModalTab('overview')}>📋 Overview</button><button className={`m-tab ${activeModalTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveModalTab('teams')}>👥 Teams ({selectedProjectTeams.length})</button><button className={`m-tab ${activeModalTab === 'files' ? 'active' : ''}`} onClick={() => setActiveModalTab('files')}>📎 Files ({selectedProjectFiles.length})</button><button className={`m-tab ${activeModalTab === 'history' ? 'active' : ''}`} onClick={() => setActiveModalTab('history')}>📜 History ({selectedProjectHistory.length})</button></div><div className="m-tab-content">{activeModalTab === 'overview' && (<div><div className="detail-row"><label>Status:</label>{getStatusBadge(selectedProject.status)}</div><div className="detail-row"><label>Description:</label><p>{selectedProject.projectDescription}</p></div><div className="detail-grid"><div><label>Type:</label> {selectedProject.projectType}</div><div><label>Client:</label> {selectedProject.clientName}</div><div><label>Department:</label> {selectedProject.departmentName}</div><div><label>Manager:</label> {selectedProject.assignedManagerName}</div><div><label>Deadline:</label> {formatDate(selectedProject.deadline)}</div></div></div>)}</div></div></div>)}

//       {/* Profile Modal */}
//       {showProfileModal && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowProfileModal(false)}>✕</button><h2>Edit Profile</h2><form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleUpdateProfile({ name: fd.get('name'), phoneNumber: fd.get('phoneNumber'), address: fd.get('address'), gender: fd.get('gender'), dob: fd.get('dob') }); }}><div className="m-form"><input name="name" defaultValue={user?.name} placeholder="Full Name" /><input name="phoneNumber" defaultValue={user?.phoneNumber} placeholder="Phone Number" /><input name="gender" defaultValue={user?.gender} placeholder="Gender" /><input name="dob" type="date" defaultValue={user?.dob} /><textarea name="address" rows={2} defaultValue={user?.address} placeholder="Address" /><button type="submit" className="btn-msub">Save Changes</button></div></form></div></div>)}

//       {/* Global Styles */}
//       <style jsx>{`
//         .client-container { position: relative; }
//         .toast-notification { position: fixed; top: 80px; right: 20px; z-index: 10000; display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 12px; background: var(--card-bg); border-left: 4px solid; box-shadow: var(--shadow-lg); animation: slideInRight 0.3s ease; }
//         .toast-notification.success { border-left-color: var(--green); }
//         .toast-notification.error { border-left-color: var(--red); }
//         .toast-notification.info { border-left-color: var(--teal); }
//         @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        
//         .project-selector-bar { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
//         .project-selector-left { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
//         .project-search-input { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); width: 200px; }
//         .project-select { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); min-width: 250px; }
//         .action-btn { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 500; cursor: pointer; border: none; }
//         .action-btn.primary { background: var(--teal); color: white; }
//         .action-btn.success { background: var(--green); color: white; }
//         .action-btn.info { background: var(--blue); color: white; }
//         .action-btn.outline { background: transparent; border: 1px solid var(--teal); color: var(--teal); }
        
//         .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
//         .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; display: flex; align-items: center; gap: 1rem; }
//         .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
//         .stat-info .stat-value { font-size: 1.8rem; font-weight: 700; line-height: 1; }
        
//         .dashboard-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; }
//         .dashboard-card.full-width { width: 100%; }
//         .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
        
//         .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
//         .project-card { background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; transition: all 0.2s; }
        
//         .emp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
//         .emp-card { background: var(--bg); border: 1px solid var(--border); border-radius: 18px; padding: 1.3rem; transition: all 0.3s ease; }
//         .emp-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
//         .emp-avatar { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: rgba(44, 166, 164, 0.1); }
//         .emp-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.5rem; flex-wrap: wrap; }
        
//         .teams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1.5rem; }
//         .team-card { background: var(--bg); border: 1px solid var(--border); border-radius: 18px; padding: 1.3rem; transition: all 0.3s ease; }
//         .team-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
//         .team-manager-info { font-size: 0.8rem; color: var(--teal); margin-bottom: 0.8rem; }
//         .team-members-list { max-height: 300px; overflow-y: auto; margin-bottom: 1rem; }
//         .team-member-row { display: flex; align-items: center; gap: 0.8rem; padding: 0.5rem; background: var(--surface); border-radius: 8px; margin-bottom: 0.5rem; }
//         .member-avatar-small { width: 36px; height: 36px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
//         .member-actions { display: flex; gap: 0.3rem; }
//         .team-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
        
//         .btn-sm { padding: 0.3rem 0.8rem; font-size: 0.7rem; border-radius: 20px; cursor: pointer; }
//         .btn-primary { background: var(--teal); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
//         .btn-outline { background: transparent; border: 1px solid var(--teal); color: var(--teal); }
//         .btn-danger { background: var(--red); color: white; border: none; }
//         .btn-success { background: var(--green); color: white; border: none; }
//         .btn-ai { background: linear-gradient(135deg, #6c5ce7, #a463f5); color: white; }
//         .btn-msub { padding: 0.75rem; border-radius: 40px; background: var(--teal); color: white; font-weight: 600; width: 100%; cursor: pointer; }
        
//         .form-group { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
//         .form-group label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--muted); }
//         .form-group input, .form-group select, .form-group textarea { padding: 0.6rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); }
//         .m-form { display: flex; flex-direction: column; gap: 1rem; }
//         .form-field { display: flex; flex-direction: column; gap: 0.25rem; }
        
//         .stars-input { display: flex; gap: 0.5rem; margin: 0.5rem 0; }
//         .star-btn { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; }
//         .star-btn.active { transform: scale(1.1); }
        
//         .recipients-list { max-height: 200px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem; }
//         .recipient-checkbox { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; cursor: pointer; }
//         .consultants-checkbox-list { max-height: 250px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem; }
//         .consultant-checkbox { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; cursor: pointer; }
        
//         .upload-section { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1rem; align-items: center; }
//         .uploads-list { display: flex; flex-direction: column; gap: 0.5rem; }
//         .file-item { display: flex; align-items: center; gap: 1rem; padding: 0.6rem; background: var(--surface); border-radius: 10px; }
//         .file-actions { display: flex; gap: 0.3rem; }
//         .btn-icon { padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); cursor: pointer; }
        
//         .ai-suggestion-result { margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, rgba(44, 166, 164, 0.1), rgba(31, 109, 168, 0.05)); border-radius: 12px; border: 1px solid rgba(44, 166, 164, 0.3); }
//         .ai-suggestion-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        
//         .profile-info { display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
//         .profile-avatar-large { width: 100px; height: 100px; border-radius: 24px; background: linear-gradient(135deg, var(--teal), var(--green)); display: flex; align-items: center; justify-content: center; }
//         .avatar-placeholder { font-size: 2.5rem; font-weight: 700; color: white; }
//         .profile-details { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
//         .detail-item { display: flex; flex-direction: column; gap: 0.2rem; }
//         .detail-item label { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; color: var(--muted); }
//         .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: var(--surface); border-radius: 12px; margin-top: 1rem; }
//         .setting-item.danger { border: 1px solid rgba(231, 76, 60, 0.3); background: rgba(231, 76, 60, 0.05); }
        
//         .modal-mask { display: none; position: fixed; inset: 0; z-index: 2000; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); align-items: center; justify-content: center; padding: 1rem; }
//         .modal-mask.open { display: flex; }
//         .modal-box { background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px; padding: 1.5rem; width: 100%; max-width: 500px; position: relative; max-height: 90vh; overflow-y: auto; }
//         .modal-box.large { max-width: 700px; }
//         .m-close { position: absolute; top: 0.8rem; right: 0.8rem; width: 32px; height: 32px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
//         .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; }
//         .m-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
//         .m-tab { padding: 0.5rem 1rem; background: transparent; border: none; cursor: pointer; color: var(--muted); }
//         .m-tab.active { color: var(--teal); border-bottom: 2px solid var(--teal); }
//         .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
        
//         .status-badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
//         .status-pending { background: rgba(243, 156, 18, 0.15); color: #f39c12; }
//         .status-assigned { background: rgba(31, 109, 168, 0.15); color: #1f6da8; }
//         .status-progress { background: rgba(44, 166, 164, 0.15); color: #2ca6a4; }
//         .status-completed { background: rgba(52, 168, 83, 0.15); color: #34a853; }
        
//         .loading-spinner-small { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.6s linear infinite; margin-right: 0.3rem; }
//         @keyframes spin { to { transform: rotate(360deg); } }
        
//         @media (max-width: 768px) {
//           .client-main { padding: 1rem; padding-bottom: 80px; }
//           .mobile-menu-btn { display: flex; position: fixed; bottom: 1.5rem; right: 1.5rem; width: 50px; height: 50px; border-radius: 50%; background: var(--teal); color: white; border: none; font-size: 1.5rem; cursor: pointer; z-index: 1000; align-items: center; justify-content: center; }
//           .stats-grid { grid-template-columns: repeat(2, 1fr); }
//           .projects-grid, .emp-grid, .teams-grid { grid-template-columns: 1fr; }
//           .project-selector-bar { flex-direction: column; align-items: stretch; }
//           .project-selector-left { flex-direction: column; align-items: stretch; }
//           .project-search-wrapper { flex-direction: column; }
//           .m-tabs { flex-direction: column; }
//           .m-tab.active { background: var(--teal); color: white; border-bottom: none; }
//         }
//       `}</style>
//     </div>
//   );  
// };

// export default Manager;







// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import CommonSidebar from './components/CommonSidebar';
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
//   emailVerified: boolean;
//   isProfileCompleted: boolean;
//   phoneNumber?: string;
//   address?: string;
//   gender?: string;
//   dob?: string;
// }

// interface Employee {
//   employeeId: number;
//   isDirectorVerified: boolean;
//   positionName: string;
//   salary: number;
//   department: string;
//   skillSet: string;
//   departmentId: number;
//   departmentName: string;
// }

// interface MyDetails {
//   user: UserProfile;
//   roles: Role[];
//   employee: Employee | null;
// }

// interface Role {
//   id: number;
//   ptype: string;
//   stype: string;
//   isApproved: string;
//   createdAt: string;
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
//   assignedManagerId: number;
//   assignedManagerName: string;
//   deadline: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ProjectHistory {
//   statusId: number;
//   projectId: number;
//   projectName: string;
//   status: string;
//   dateTime: string;
//   handledById: number;
//   handledByName: string;
//   assignedToId: number | null;
//   assignedToName: string | null;
//   directorNote: string | null;
//   managerNote: string | null;
//   deadline: string | null;
// }

// interface Task {
//   taskId: number;
//   projectId: number;
//   projectName: string;
//   assignedToUserId: number;
//   assignedToUserName: string;
//   assignedToUserPhoto: string | null;
//   taskDetails: string;
//   description: string;
//   taskStatus: string;
//   createdById: number;
//   createdByName: string;
//   deadline: string;
//   managerNote: string | null;
//   createdAt: string;
//   updatedAt: string;
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

// interface TeamMember {
//   memberId: number;
//   memberName: string;
//   memberEmail: string;
//   photoUrl: string | null;
//   role: string;
//   description: string | null;
// }

// interface ConsultantRequest {
//   requestId: number;
//   projectId: number;
//   projectName: string;
//   consultantId: number;
//   consultantName: string;
//   consultantEmail: string;
//   consultantPhoto: string | null;
//   skill: string;
//   experience: string;
//   marks10: number;
//   marks12: number;
//   graduationMarks: number;
//   resumeLink: string;
//   averageRating: number;
//   totalReviews: number;
//   requestedAt: string;
// }

// interface ConsultantWithRating {
//   consultantId: number;
//   userId: number;
//   name: string;
//   email: string;
//   photoUrl: string | null;
//   skill: string;
//   experience: string;
//   averageRating: number;
//   totalReviews: number;
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
//   projectId?: number;
//   projectName?: string;
// }

// interface EmployeeTask {
//   taskId: number;
//   description: string;
//   status: string;
//   priority: string;
//   createdByUserId: number;
//   createdByName: string;
//   createdByPhoto: string | null;
//   deadline: string;
//   createdAt: string;
//   updatedAt: string;
//   completedAt: string | null;
// }

// interface EmailRecipient {
//   userId: number;
//   name: string;
//   email: string;
//   role: string;
//   department: string;
// }

// interface AIProfileResponse {
//   status: string;
//   data: {
//     text: string;
//     consultantId: number;
//     consultantName: string;
//   };
//   message: string;
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
// // ALL MANAGER APIs
// // ============================================

// const checkIsManager = async () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/project/check/manager');
// const getMyAssignedProjects = async () => apiCall<{ success: boolean; data: Project[] }>('GET', '/api/project/manager/my-projects');
// const updateProjectStatus = async (projectId: number, status: string, note?: string) => {
//   let url = `/api/project/manager/update-status/${projectId}?status=${status}`;
//   if (note) url += `&note=${encodeURIComponent(note)}`;
//   return apiCall('PUT', url);
// };
// const createTask = async (data: { projectId: number; assignedToUserId: number; taskDetails: string; description: string; deadline: string }) => apiCall('POST', '/api/task/create', data);
// const updateTask = async (taskId: number, data: any) => apiCall('PUT', `/api/task/update/${taskId}`, data);
// const deleteTask = async (taskId: number) => apiCall('DELETE', `/api/task/delete/${taskId}`);
// const getMyCreatedTasks = async () => apiCall<{ success: boolean; data: Task[] }>('GET', '/api/task/my-created-tasks');
// const getProjectTasks = async (projectId: number) => apiCall<{ success: boolean; data: Task[] }>('GET', `/api/task/project/${projectId}`);
// const createTeam = async (data: { projectId: number; teamName: string; memberIds: number[]; memberRoles: string[] }) => apiCall('POST', '/api/team/create', data);
// const addMemberToTeam = async (teamId: number, memberId: number, role: string) => apiCall('POST', `/api/team/${teamId}/add-member?memberId=${memberId}&role=${encodeURIComponent(role)}`);
// const removeMemberFromTeam = async (teamId: number, memberId: number) => apiCall('DELETE', `/api/team/${teamId}/remove-member/${memberId}`);
// const deleteTeam = async (teamId: number) => apiCall('DELETE', `/api/team/delete/${teamId}`);
// const getMyTeams = async () => apiCall<{ success: boolean; data: Team[] }>('GET', '/api/team/my-teams');
// const getProjectTeams = async (projectId: number) => apiCall<{ success: boolean; data: Team[] }>('GET', `/api/team/project/${projectId}`);
// const getConsultantRequests = async () => apiCall<{ success: boolean; data: ConsultantRequest[] }>('GET', '/api/consultant-project/manager/requests');
// const rateConsultant = async (data: { consultantId: number; rating: number; feedback: string }) => apiCall('POST', '/manager/consultant/rate', data);
// const uploadFile = async (projectId: number, file: File, fileType: string) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   return apiCall('POST', `/api/file/upload/${projectId}?fileType=${fileType}`, formData, true);
// };
// const getProjectFiles = async (projectId: number) => apiCall<{ success: boolean; data: FileItem[] }>('GET', `/api/file/project/${projectId}`);
// const getMyUploads = async () => apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/my-uploads');
// const deleteFile = async (fileId: number) => apiCall('DELETE', `/api/file/delete/${fileId}`);
// const getProjectById = async (projectId: number) => apiCall<{ success: boolean; data: Project }>('GET', `/api/project/${projectId}`);
// const getProjectHistory = async (projectId: number) => apiCall<{ success: boolean; data: ProjectHistory[] }>('GET', `/api/project/${projectId}/history`);
// const getUserProfile = async () => apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
// const updateUserProfile = async (data: any) => apiCall('PUT', '/api/users/profile', data);
// const deleteAccount = async () => apiCall('DELETE', '/api/users/account');
// const getMyDetails = async () => apiCall<{ success: boolean; data: MyDetails }>('GET', '/api/getmydetails');
// const getAccessToken = async (fileId: number) => apiCall('POST', `/api/file/access-token/${fileId}`, {});
// const getMyDepartmentConsultants = async () => apiCall<{ success: boolean; data: ConsultantWithRating[] }>('GET', '/api/consultant-project/manager/my-department-consultants');
// const getEmployeeTasks = async () => apiCall<{ success: boolean; data: EmployeeTask[] }>('GET', '/api/employee/my-tasks');
// const updateEmployeeTaskStatus = async (taskId: number, status: string, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/status`, { status, note });
// const completeEmployeeTask = async (taskId: number, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/complete`, { note });
// const getEmailRecipients = async () => apiCall<{ success: boolean; data: EmailRecipient[] }>('GET', '/api/email/recipients/my-department-consultants');
// const sendEmail = async (data: { userIds: number[]; subject: string; message: string; messageType: string }) => apiCall('POST', '/api/email/send', data);
// const getAISuggestConsultant = async (data: { taskName: string; taskDescription: string; projectId: number }) => apiCall('POST', '/api/ai/suggest-consultant-for-task', data);
// const getAIConsultantProfile = async (consultantId: number) => apiCall<AIProfileResponse>('GET', `/api/ai/consultant/profile/${consultantId}`);

// // ============================================
// // SIDEBAR MENU ITEMS
// // ============================================

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//   { id: 'my-projects', label: 'My Projects', icon: '📁' },
//   { id: 'consultant-requests', label: 'Consultant Requests', icon: '📨' },
//   { id: 'consultants', label: 'Consultants', icon: '👥' },
//   { id: 'my-teams', label: 'My Teams', icon: '👥' },
//   { id: 'my-tasks', label: 'My Created Tasks', icon: '✅' },
//   { id: 'assigned-tasks', label: 'Assigned to Me', icon: '📋' },
//   { id: 'ai-suggest', label: 'AI Suggest', icon: '🤖' },
//   { id: 'email', label: 'Email Consultants', icon: '✉️' },
//   { id: 'uploads', label: 'Uploads', icon: '📎' },
//   { id: 'profile', label: 'Profile', icon: '👤' },
// ];

// const statusConfig: Record<string, { label: string; class: string; icon: string }> = {
//   PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳' },
//   ASSIGNED: { label: 'Assigned', class: 'status-assigned', icon: '👥' },
//   IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄' },
//   COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️' },
//   REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '❌' },
//   APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅' },
// };

// const getStatusBadge = (status: string) => {
//   const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌' };
//   return <span className={`status-badge ${config.class}`}><span className="status-icon">{config.icon}</span>{config.label}</span>;
// };

// // Loading Button Component
// const LoadingButton: React.FC<{ onClick: () => Promise<void>; children: React.ReactNode; className?: string; disabled?: boolean }> = ({ onClick, children, className = '', disabled = false }) => {
//   const [loading, setLoading] = useState(false);
//   const handleClick = async () => {
//     if (loading || disabled) return;
//     setLoading(true);
//     try {
//       await onClick();
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <button className={className} onClick={handleClick} disabled={loading || disabled}>
//       {loading ? <span className="loading-spinner-small"></span> : children}
//     </button>
//   );
// };

// // Shimmer Loader Component
// const ShimmerLoader: React.FC = () => (
//   <div className="shimmer-wrapper">
//     <div className="shimmer-card">
//       <div className="shimmer-line shimmer-line-lg"></div>
//       <div className="shimmer-line shimmer-line-md"></div>
//       <div className="shimmer-line shimmer-line-sm"></div>
//     </div>
//     <div className="shimmer-card">
//       <div className="shimmer-line shimmer-line-lg"></div>
//       <div className="shimmer-line shimmer-line-md"></div>
//       <div className="shimmer-line shimmer-line-sm"></div>
//     </div>
//     <div className="shimmer-card">
//       <div className="shimmer-line shimmer-line-lg"></div>
//       <div className="shimmer-line shimmer-line-md"></div>
//       <div className="shimmer-line shimmer-line-sm"></div>
//     </div>
//   </div>
// );

// // AI Profile Modal Component
// const AIProfileModal: React.FC<{ consultant: ConsultantWithRating; onClose: () => void }> = ({ consultant, onClose }) => {
//   const [profile, setProfile] = useState<AIProfileResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     getAIConsultantProfile(consultant.consultantId)
//       .then(result => {
//         setProfile(result);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(err.message || 'Failed to fetch AI profile');
//         setLoading(false);
//       });
//   }, [consultant.consultantId]);

//   return (
//     <div className="modal-mask open ai-modal-mask">
//       <div className="modal-box ai-analysis-modal-box">
//         <button className="m-close" onClick={onClose}>✕</button>
//         <div className="ai-modal-content">
//           <div className="ai-header-glow">
//             <div className="ai-icon-pulse">🧠</div>
//             <h2>AI Consultant Intelligence</h2>
//             <div className="ai-badge-shine">Powered by Advanced AI</div>
//           </div>
          
//           <div className="ai-consultant-info">
//             <div className="ai-avatar">{consultant.name.charAt(0)}</div>
//             <div>
//               <h3>{consultant.name}</h3>
//               <p>{consultant.skill}</p>
//               <div className="ai-rating">⭐ {consultant.averageRating.toFixed(1)} / 5 ({consultant.totalReviews} reviews)</div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="ai-loading">
//               <div className="ai-wave"></div>
//               <p>AI is analyzing consultant profile...</p>
//             </div>
//           ) : error ? (
//             <div className="ai-error-state">
//               <span className="error-icon">⚠️</span>
//               <p>{error}</p>
//             </div>
//           ) : profile && profile.status === 'success' ? (
//             <div className="ai-results">
//               <div className="ai-card">
//                 <div className="ai-card-icon">🤖</div>
//                 <div className="ai-card-content">
//                   <h4>AI Generated Analysis</h4>
//                   <p>{profile.data.text}</p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="ai-error-state">
//               <span className="error-icon">❌</span>
//               <p>No data available</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Improved Timeline History Component with Scroll
// const TimelineHistory: React.FC<{ history: ProjectHistory[] }> = ({ history }) => {
//   const sortedHistory = [...history].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
//   return (
//     <div className="timeline-scroll-container">
//       {sortedHistory.length === 0 ? (
//         <div className="empty-state"><span className="empty-icon">📭</span><p>No history records found</p></div>
//       ) : (
//         <div className="timeline-timeline">
//           {sortedHistory.map((entry, idx) => (
//             <div key={entry.statusId} className={`timeline-entry-card ${idx === 0 ? 'latest' : ''}`}>
//               <div className="timeline-entry-badge">{getStatusBadge(entry.status)}</div>
//               <div className="timeline-entry-date">{new Date(entry.dateTime).toLocaleString()}</div>
//               <div className="timeline-entry-actor">👤 <strong>{entry.handledByName}</strong></div>
//               {entry.managerNote && <div className="timeline-entry-note">📝 {entry.managerNote}</div>}
//               {entry.directorNote && <div className="timeline-entry-note director">👔 Director: {entry.directorNote}</div>}
//               {entry.assignedToName && <div className="timeline-entry-assigned">👥 Assigned to: {entry.assignedToName}</div>}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Improved Teams Component for Modal
// const TeamsList: React.FC<{ teams: Team[] }> = ({ teams }) => {
//   return (
//     <div className="teams-scroll-container">
//       {teams.length === 0 ? (
//         <div className="empty-state"><span className="empty-icon">👥</span><p>No teams created for this project yet.</p></div>
//       ) : (
//         <div className="teams-list">
//           {teams.map(team => (
//             <div key={team.teamId} className="team-card-detail">
//               <div className="team-card-header">
//                 <h4>{team.teamName}</h4>
//                 <span className="team-manager-badge">👔 {team.managerName}</span>
//               </div>
//               <div className="team-members-list">
//                 <p className="members-title">Team Members ({team.members.length})</p>
//                 {team.members.map((member, idx) => (
//                   <div key={idx} className="team-member-row">
//                     <div className="member-avatar-small">{member.memberName.charAt(0)}</div>
//                     <div className="member-info">
//                       <div className="member-name">{member.memberName}</div>
//                       <div className="member-role">{member.role}</div>
//                       <div className="member-email">{member.memberEmail}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Improved Files Component for Modal
// const FilesList: React.FC<{ files: FileItem[]; onView: (id: number) => void; onDownload: (id: number) => void; onDelete: (id: number) => void; userName?: string }> = ({ files, onView, onDownload, onDelete, userName }) => {
//   return (
//     <div className="files-scroll-container">
//       {files.length === 0 ? (
//         <div className="empty-state"><span className="empty-icon">📁</span><p>No files uploaded yet</p></div>
//       ) : (
//         <div className="files-grid-list">
//           {files.map(file => (
//             <div key={file.fileId} className="file-card-item">
//               <div className="file-card-icon">📄</div>
//               <div className="file-card-info">
//                 <div className="file-card-name">{file.fileLink?.split('/').pop()?.substring(0, 30)}</div>
//                 <div className="file-card-meta">
//                   <span className="file-type-badge">{file.fileType}</span>
//                   <span>By {file.uploaderName}</span>
//                   <span>{new Date(file.uploadTime).toLocaleDateString()}</span>
//                 </div>
//               </div>
//               <div className="file-card-actions">
//                 <button className="btn-icon-small" onClick={() => onView(file.fileId)}>👁️</button>
//                 <button className="btn-icon-small" onClick={() => onDownload(file.fileId)}>⬇️</button>
//                 {(file.uploaderName === userName) && (
//                   <button className="btn-icon-small danger" onClick={() => onDelete(file.fileId)}>🗑️</button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // ============================================
// // MAIN MANAGER COMPONENT
// // ============================================

// const Manager: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('dashboard');
//   const [loading, setLoading] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [myDetails, setMyDetails] = useState<MyDetails | null>(null);
//   const [isManager, setIsManager] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const { logout } = useAuth();

//   // Data states
//   const [myProjects, setMyProjects] = useState<Project[]>([]);
//   const [consultantRequests, setConsultantRequests] = useState<ConsultantRequest[]>([]);
//   const [consultants, setConsultants] = useState<ConsultantWithRating[]>([]);
//   const [myTeams, setMyTeams] = useState<Team[]>([]);
//   const [myCreatedTasks, setMyCreatedTasks] = useState<Task[]>([]);
//   const [employeeTasks, setEmployeeTasks] = useState<EmployeeTask[]>([]);
//   const [myUploads, setMyUploads] = useState<FileItem[]>([]);
//   const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);

//   const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
//   // Modal states
//   const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
//   const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);
//   const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
//   const [showEditTaskModal, setShowEditTaskModal] = useState(false);
//   const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
//   const [showRateConsultantModal, setShowRateConsultantModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showEmployeeTaskModal, setShowEmployeeTaskModal] = useState(false);
//   const [showAIProfileModal, setShowAIProfileModal] = useState(false);
//   const [selectedConsultantForAI, setSelectedConsultantForAI] = useState<ConsultantWithRating | null>(null);
//   const [activeModalTab, setActiveModalTab] = useState('overview');

//   // Selected items
//   const [selectedProjectFiles, setSelectedProjectFiles] = useState<FileItem[]>([]);
//   const [selectedProjectHistory, setSelectedProjectHistory] = useState<ProjectHistory[]>([]);
//   const [selectedProjectTeams, setSelectedProjectTeams] = useState<Team[]>([]);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [selectedConsultant, setSelectedConsultant] = useState<ConsultantWithRating | null>(null);
//   const [selectedEmployeeTask, setSelectedEmployeeTask] = useState<EmployeeTask | null>(null);

//   // Form states
//   const [updateProjectData, setUpdateProjectData] = useState({ status: '', note: '' });
//   const [createTaskData, setCreateTaskData] = useState({ projectId: 0, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
//   const [editTaskData, setEditTaskData] = useState({ taskDetails: '', description: '', managerNote: '', taskStatus: '' });
//   const [createTeamData, setCreateTeamData] = useState({ projectId: 0, teamName: '', memberIds: [] as number[], memberRoles: [] as string[] });
//   const [rateConsultantData, setRateConsultantData] = useState({ rating: 0, feedback: '' });
//   const [uploadFileData, setUploadFileData] = useState({ file: null as File | null, fileType: '', projectId: 0 });
//   const [employeeTaskNote, setEmployeeTaskNote] = useState('');
//   const [employeeTaskStatus, setEmployeeTaskStatus] = useState('');
//   const [aiSuggestData, setAiSuggestData] = useState({ taskName: '', taskDescription: '', projectId: 0 });
//   const [aiSuggestResult, setAiSuggestResult] = useState('');
//   const [emailData, setEmailData] = useState({ userIds: [] as number[], subject: '', message: '', messageType: 'INFORMATION' });

//   const [taskFilter, setTaskFilter] = useState('all');
//   const [projectSearch, setProjectSearch] = useState('');

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.setAttribute('data-theme', 'dark');
//     }
//     loadInitialData();
//   }, []);

//   const loadInitialData = async () => {
//     setLoading(true);
//     try {
//       const [profileRes, detailsRes, managerCheckRes] = await Promise.all([
//         getUserProfile().catch(() => ({ data: null })),
//         getMyDetails().catch(() => ({ data: null })),
//         checkIsManager().catch(() => ({ data: false })),
//       ]);

//       setUser(profileRes.data);
//       setMyDetails(detailsRes.data);
//       setIsManager(managerCheckRes.data || false);

//       if (managerCheckRes.data) {
//         await loadAllData();
//       }
//     } catch (error) {
//       console.error('Error loading initial data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAllData = async () => {
//     try {
//       const [projectsRes, requestsRes, consultantsRes, teamsRes, tasksRes, empTasksRes, uploadsRes, emailRes] = await Promise.all([
//         getMyAssignedProjects().catch(() => ({ data: [] })),
//         getConsultantRequests().catch(() => ({ data: [] })),
//         getMyDepartmentConsultants().catch(() => ({ data: [] })),
//         getMyTeams().catch(() => ({ data: [] })),
//         getMyCreatedTasks().catch(() => ({ data: [] })),
//         getEmployeeTasks().catch(() => ({ data: [] })),
//         getMyUploads().catch(() => ({ data: [] })),
//         getEmailRecipients().catch(() => ({ data: [] })),
//       ]);

//       setMyProjects(projectsRes.data);
//       setConsultantRequests(requestsRes.data);
//       setConsultants(consultantsRes.data);
//       setMyTeams(teamsRes.data);
//       setMyCreatedTasks(tasksRes.data);
//       setEmployeeTasks(empTasksRes.data);
//       setMyUploads(uploadsRes.data);
//       setEmailRecipients(emailRes.data);
      
//       if (projectsRes.data.length > 0 && selectedProjectId === 0) {
//         setSelectedProjectId(projectsRes.data[0].projectId);
//         setSelectedProject(projectsRes.data[0]);
//       }
//     } catch (error) {
//       console.error('Error loading data:', error);
//     }
//   };

//   const handleProjectChange = async (projectId: number) => {
//     setSelectedProjectId(projectId);
//     const project = myProjects.find(p => p.projectId === projectId);
//     setSelectedProject(project || null);
    
//     if (projectId) {
//       try {
//         const [teamsRes] = await Promise.all([
//           getProjectTeams(projectId).catch(() => ({ data: [] })),
//         ]);
//         setSelectedProjectTeams(teamsRes.data);
//       } catch (error) {
//         console.error('Error loading project data:', error);
//       }
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

//   const handleUpdateProjectStatus = async () => {
//     if (!selectedProject || !updateProjectData.status) return;
//     await updateProjectStatus(selectedProject.projectId, updateProjectData.status, updateProjectData.note);
//     await loadAllData();
//     setShowUpdateProjectModal(false);
//     setUpdateProjectData({ status: '', note: '' });
//     alert('Project status updated');
//   };

//   const handleCreateTask = async () => {
//     if (!createTaskData.projectId || !createTaskData.assignedToUserId || !createTaskData.taskDetails || !createTaskData.deadline) {
//       alert('Please fill all required fields');
//       return;
//     }
//     await createTask(createTaskData);
//     await loadAllData();
//     setShowCreateTaskModal(false);
//     setCreateTaskData({ projectId: selectedProjectId, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
//     alert('Task created successfully');
//   };

//   const handleUpdateTask = async () => {
//     if (!selectedTask) return;
//     await updateTask(selectedTask.taskId, editTaskData);
//     await loadAllData();
//     setShowEditTaskModal(false);
//     setSelectedTask(null);
//     alert('Task updated');
//   };

//   const handleDeleteTask = async (taskId: number) => {
//     if (confirm('Delete this task?')) {
//       await deleteTask(taskId);
//       await loadAllData();
//       alert('Task deleted');
//     }
//   };

//   const handleCreateTeam = async () => {
//     if (!createTeamData.projectId || !createTeamData.teamName || createTeamData.memberIds.length === 0) {
//       alert('Please fill all fields and select at least one consultant');
//       return;
//     }
//     const roles = createTeamData.memberRoles;
//     while (roles.length < createTeamData.memberIds.length) roles.push('Member');
    
//     await createTeam({
//       projectId: createTeamData.projectId,
//       teamName: createTeamData.teamName,
//       memberIds: createTeamData.memberIds,
//       memberRoles: roles.slice(0, createTeamData.memberIds.length),
//     });
//     await loadAllData();
//     setShowCreateTeamModal(false);
//     setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] });
//     alert('Team created successfully');
//   };

//   const handleRateConsultant = async () => {
//     if (!selectedConsultant) return;
//     if (!rateConsultantData.rating || rateConsultantData.rating < 1 || rateConsultantData.rating > 5) {
//       alert('Please provide rating 1-5');
//       return;
//     }
//     await rateConsultant({ consultantId: selectedConsultant.consultantId, rating: rateConsultantData.rating, feedback: rateConsultantData.feedback });
//     await loadAllData();
//     setShowRateConsultantModal(false);
//     setSelectedConsultant(null);
//     setRateConsultantData({ rating: 0, feedback: '' });
//     alert('Rating submitted successfully');
//   };

//   const handleUpdateEmployeeTask = async () => {
//     if (!selectedEmployeeTask) return;
//     await updateEmployeeTaskStatus(selectedEmployeeTask.taskId, employeeTaskStatus, employeeTaskNote);
//     await loadAllData();
//     setShowEmployeeTaskModal(false);
//     setSelectedEmployeeTask(null);
//     setEmployeeTaskNote('');
//     setEmployeeTaskStatus('');
//     alert('Task status updated');
//   };

//   const handleCompleteEmployeeTask = async () => {
//     if (!selectedEmployeeTask) return;
//     await completeEmployeeTask(selectedEmployeeTask.taskId, employeeTaskNote);
//     await loadAllData();
//     setShowEmployeeTaskModal(false);
//     setSelectedEmployeeTask(null);
//     setEmployeeTaskNote('');
//     alert('Task completed');
//   };

//   const handleAISuggest = async () => {
//     if (!aiSuggestData.taskName || !aiSuggestData.taskDescription || !aiSuggestData.projectId) {
//       alert('Please fill all fields');
//       return;
//     }
//     const res = await getAISuggestConsultant(aiSuggestData);
//     setAiSuggestResult(res.data);
//   };

//   const handleSendEmail = async () => {
//     if (emailData.userIds.length === 0 || !emailData.subject || !emailData.message) {
//       alert('Please select recipients, enter subject and message');
//       return;
//     }
//     await sendEmail(emailData);
//     setShowEmailModal(false);
//     setEmailData({ userIds: [], subject: '', message: '', messageType: 'INFORMATION' });
//     alert('Email sent successfully');
//   };

//   const handleUploadFile = async () => {
//     if (!uploadFileData.projectId || !uploadFileData.file || !uploadFileData.fileType) {
//       alert('Please select project, file and file type');
//       return;
//     }
//     await uploadFile(uploadFileData.projectId, uploadFileData.file, uploadFileData.fileType);
//     if (selectedProject && selectedProject.projectId === uploadFileData.projectId) {
//       const filesRes = await getProjectFiles(uploadFileData.projectId);
//       setSelectedProjectFiles(filesRes.data);
//     }
//     const uploadsRes = await getMyUploads();
//     setMyUploads(uploadsRes.data);
//     setUploadFileData({ file: null, fileType: '', projectId: 0 });
//     alert('File uploaded');
//   };

//   const handleDeleteFile = async (fileId: number) => {
//     if (confirm('Delete this file?')) {
//       await deleteFile(fileId);
//       if (selectedProject) {
//         const filesRes = await getProjectFiles(selectedProject.projectId);
//         setSelectedProjectFiles(filesRes.data);
//       }
//       const uploadsRes = await getMyUploads();
//       setMyUploads(uploadsRes.data);
//       alert('File deleted');
//     }
//   };

//   const handleViewProject = async (projectId: number) => {
//     setActiveModalTab('overview');
//     const [projectRes, historyRes, teamsRes, filesRes] = await Promise.all([
//       getProjectById(projectId),
//       getProjectHistory(projectId).catch(() => ({ data: [] })),
//       getProjectTeams(projectId).catch(() => ({ data: [] })),
//       getProjectFiles(projectId).catch(() => ({ data: [] })),
//     ]);
//     setSelectedProject(projectRes.data);
//     setSelectedProjectHistory(historyRes.data);
//     setSelectedProjectTeams(teamsRes.data);
//     setSelectedProjectFiles(filesRes.data);
//     setShowProjectDetailModal(true);
//   };

//   const handleViewFile = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) {
//         window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
//       } else {
//         alert('Cannot view file');
//       }
//     } catch { alert('Cannot view file'); }
//   };

//   const handleDownloadFile = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) {
//         window.open(`${API_BASE}${tokenRes.data.downloadUrl}`, '_blank');
//       } else {
//         alert('Cannot download');
//       }
//     } catch { alert('Download failed'); }
//   };

//   const handleUpdateProfile = async (data: any) => {
//     await updateUserProfile(data);
//     const profileRes = await getUserProfile();
//     setUser(profileRes.data);
//     setShowProfileModal(false);
//     alert('Profile updated');
//   };

//   const handleDeleteAccount = async () => {
//     if (confirm('Delete account permanently?')) {
//       await deleteAccount();
//       await logout();
//       window.location.href = '/';
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     window.location.href = '/';
//   };

//   const filteredProjects = myProjects.filter(p => p.projectName.toLowerCase().includes(projectSearch.toLowerCase()));
//   const filteredTasks = myCreatedTasks.filter(t => {
//     if (taskFilter === 'pending') return t.taskStatus === 'PENDING';
//     if (taskFilter === 'in_progress') return t.taskStatus === 'IN_PROGRESS';
//     if (taskFilter === 'completed') return t.taskStatus === 'COMPLETED';
//     return true;
//   });

//   const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

//   if (loading) return <ShimmerLoader />;

//   if (!isManager) {
//     return (
//       <div className="client-container">
//         <CommonSidebar activeNav={activeNav} setActiveNav={setActiveNav} onLogout={handleLogout} onThemeToggle={toggleDarkMode} darkMode={darkMode} user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null} menuItems={[]} title="Access Denied" logoIcon="🚫" isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
//         <main className="client-main"><div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}><h2>Access Denied</h2><p>Manager permissions required.</p></div></main>
//       </div>
//     );
//   }

//   return (
//     <div className="client-container">
//       <CommonSidebar activeNav={activeNav} setActiveNav={setActiveNav} onLogout={handleLogout} onThemeToggle={toggleDarkMode} darkMode={darkMode} user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null} menuItems={menuItems} title="Manager Portal" logoIcon="👔" isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
//       <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>☰</button>

//       <main className="client-main">
//         <header className="client-header">
//           <div className="header-welcome"><h1>Welcome, {user?.name?.split(' ')[0] || 'Manager'}!</h1><p>Manager Dashboard - Full Control Panel</p></div>
//           <div className="header-stats">
//             <div className="header-stat-item"><span className="stat-label">Projects</span><span className="stat-value-sm">{myProjects.length}</span></div>
//             <div className="header-stat-item"><span className="stat-label">Teams</span><span className="stat-value-sm">{myTeams.length}</span></div>
//             <div className="header-stat-item"><span className="stat-label">Active Tasks</span><span className="stat-value-sm">{myCreatedTasks.filter(t => t.taskStatus !== 'COMPLETED').length}</span></div>
//           </div>
//         </header>

//         {/* PROJECT SELECTION BAR */}
//         <div className="project-selector-bar">
//           <div className="project-selector-left">
//             <label>📁 Select Project:</label>
//             <div className="project-search-wrapper">
//               <input type="text" placeholder="Search projects..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} className="project-search-input" />
//               <select value={selectedProjectId} onChange={(e) => handleProjectChange(parseInt(e.target.value))} className="project-select">
//                 <option value="0">-- Select a Project --</option>
//                 {filteredProjects.map(p => (
//                   <option key={p.projectId} value={p.projectId}>{p.projectName} - {p.status}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="project-selector-actions">
//             {selectedProject && (
//               <>
//                 <LoadingButton className="action-btn primary" onClick={async () => { setUpdateProjectData({ status: selectedProject.status, note: '' }); setShowUpdateProjectModal(true); }}>📝 Update Status</LoadingButton>
//                 <LoadingButton className="action-btn success" onClick={async () => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId, assignedToUserId: 0 }); setShowCreateTaskModal(true); }}>➕ Create Task</LoadingButton>
//                 <LoadingButton className="action-btn info" onClick={async () => { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] }); setShowCreateTeamModal(true); }}>👥 Create Team</LoadingButton>
//                 <LoadingButton className="action-btn outline" onClick={async () => handleViewProject(selectedProjectId)}>📋 View Details</LoadingButton>
//               </>
//             )}
//           </div>
//         </div>

//         {/* DASHBOARD */}
//         {activeNav === 'dashboard' && (
//           <>
//             <div className="stats-grid">
//               <div className="stat-card"><div className="stat-icon blue">📁</div><div className="stat-info"><span className="stat-value">{myProjects.length}</span><span className="stat-label">Projects</span></div></div>
//               <div className="stat-card"><div className="stat-icon green">👥</div><div className="stat-info"><span className="stat-value">{myTeams.length}</span><span className="stat-label">Teams</span></div></div>
//               <div className="stat-card"><div className="stat-icon orange">📨</div><div className="stat-info"><span className="stat-value">{consultantRequests.length}</span><span className="stat-label">Requests</span></div></div>
//               <div className="stat-card"><div className="stat-icon purple">✅</div><div className="stat-info"><span className="stat-value">{myCreatedTasks.length}</span><span className="stat-label">Tasks</span></div></div>
//             </div>
            
//             {selectedProject && (
//               <div className="dashboard-card">
//                 <div className="card-header"><h2>Current Project: {selectedProject.projectName}</h2>{getStatusBadge(selectedProject.status)}</div>
//                 <p className="project-card-desc">{selectedProject.projectDescription}</p>
//                 <div className="project-card-meta"><span>🏢 {selectedProject.departmentName}</span><span>👤 {selectedProject.clientName}</span><span>📅 Due: {formatDate(selectedProject.deadline)}</span></div>
//               </div>
//             )}

//             <div className="dashboard-card"><div className="card-header"><h2>Recent Tasks</h2><button className="view-all-link" onClick={() => setActiveNav('my-tasks')}>View All →</button></div><div className="projects-grid">{myCreatedTasks.slice(0, 3).map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.taskDetails}</h3>{getStatusBadge(t.taskStatus)}</div><p className="project-card-desc">{t.description?.substring(0, 60)}</p><div className="project-card-meta"><span>📁 {t.projectName}</span><span>👤 {t.assignedToUserName}</span><span>📅 Due: {formatDate(t.deadline)}</span></div></div>))}</div></div>

//             <div className="dashboard-card"><div className="card-header"><h2>Assigned to Me</h2><button className="view-all-link" onClick={() => setActiveNav('assigned-tasks')}>View All →</button></div><div className="projects-grid">{employeeTasks.slice(0, 3).map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.description?.substring(0, 40)}</h3>{getStatusBadge(t.status)}</div><div className="project-card-meta"><span>🔥 {t.priority}</span><span>📅 Due: {formatDate(t.deadline)}</span><span>👤 By: {t.createdByName}</span></div><button className="btn-sm btn-primary" onClick={() => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); }}>Update</button></div>))}</div></div>
//           </>
//         )}

//         {/* MY PROJECTS */}
//         {activeNav === 'my-projects' && (
//           <div className="dashboard-card full-width"><h2>My Projects</h2><div className="projects-grid">{myProjects.map(p => (<div key={p.projectId} className="project-card"><div className="project-card-header"><h3>{p.projectName}</h3>{getStatusBadge(p.status)}</div><p className="project-card-desc">{p.projectDescription?.substring(0, 80)}</p><div className="project-card-meta"><span>📅 Deadline: {formatDate(p.deadline)}</span><span>🏢 {p.departmentName}</span><span>👤 {p.clientName}</span></div><div className="project-card-actions"><LoadingButton className="btn-sm btn-primary" onClick={async () => handleViewProject(p.projectId)}>Details</LoadingButton><LoadingButton className="btn-sm btn-outline" onClick={async () => { setSelectedProject(p); setUpdateProjectData({ status: p.status, note: '' }); setShowUpdateProjectModal(true); }}>Update Status</LoadingButton><LoadingButton className="btn-sm btn-outline" onClick={async () => { setCreateTaskData({ ...createTaskData, projectId: p.projectId, assignedToUserId: 0 }); setShowCreateTaskModal(true); }}>Create Task</LoadingButton></div></div>))}</div></div>
//         )}

//         {/* CONSULTANT REQUESTS */}
//         {activeNav === 'consultant-requests' && (
//           <div className="dashboard-card full-width"><h2>Consultant Join Requests</h2><div className="projects-grid">{consultantRequests.map(r => (<div key={r.requestId} className="project-card"><div className="project-card-header"><h3>{r.consultantName}</h3><span className="status-badge status-pending">⏳ Requested</span></div><div className="project-card-meta"><span>📁 {r.projectName}</span><span>⭐ {r.averageRating.toFixed(1)}/5</span><span>💼 {r.experience}</span></div><p className="project-card-desc"><strong>Skills:</strong> {r.skill}</p><div className="project-card-actions"><LoadingButton className="btn-sm btn-primary" onClick={async () => { setCreateTeamData({ projectId: r.projectId, teamName: `${r.projectName} Team`, memberIds: [r.consultantId], memberRoles: ['Consultant'] }); setShowCreateTeamModal(true); }}>Add to Team</LoadingButton><button className="btn-sm btn-outline" onClick={() => window.open(r.resumeLink, '_blank')}>Resume</button></div></div>))}</div></div>
//         )}

//         {/* CONSULTANTS */}
//         {activeNav === 'consultants' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Department Consultants with Ratings</h2></div><div className="emp-grid">{consultants.map(c => (<div key={c.consultantId} className="emp-card"><div className="emp-header"><div className="emp-avatar verified">{c.photoUrl ? <img src={c.photoUrl} alt={c.name} className="avatar-img" /> : c.name.charAt(0)}</div><div><h3>{c.name}</h3><div className="dept-badge">{c.skill?.substring(0, 40)}</div></div></div><div className="emp-body"><div className="emp-row"><span>📧 Email:</span><span>{c.email}</span></div><div className="emp-row"><span>💼 Experience:</span><span>{c.experience}</span></div><div className="emp-row"><span>⭐ Rating:</span><span>{c.averageRating.toFixed(1)}/5 ({c.totalReviews} reviews)</span></div></div><div className="emp-footer"><LoadingButton className="btn-sm" onClick={async () => { setSelectedConsultant(c); setRateConsultantData({ rating: 0, feedback: '' }); setShowRateConsultantModal(true); }}>Rate</LoadingButton><LoadingButton className="btn-sm btn-outline" onClick={async () => { if (selectedProjectId) { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [c.userId], memberRoles: ['Member'] }); setShowCreateTeamModal(true); } else { alert('Please select a project first'); } }}>Add to Team</LoadingButton><button className="btn-sm btn-ai" onClick={() => { setSelectedConsultantForAI(c); setShowAIProfileModal(true); }}>🧠 AI Profile</button></div></div>))}</div></div>
//         )}

//         {/* MY TEAMS */}
//         {activeNav === 'my-teams' && (
//           <div className="dashboard-card full-width"><h2>My Teams</h2><div className="projects-grid">{myTeams.map(team => (<div key={team.teamId} className="project-card"><div className="project-card-header"><h3>{team.teamName}</h3><span className="status-badge status-approved">Active</span></div><div className="project-card-meta"><span>📁 {team.projectName}</span><span>👥 {team.members.length} members</span></div><div className="team-members"><h4>Members:</h4>{team.members.slice(0, 3).map((m, i) => (<div key={i} className="team-member"><div className="member-avatar">{m.memberName.charAt(0)}</div><div><div className="member-name">{m.memberName}</div><div className="member-role">{m.role}</div></div></div>))}{team.members.length > 3 && <small>+{team.members.length - 3} more</small>}</div><div className="project-card-actions"><LoadingButton className="btn-sm btn-danger" onClick={async () => { await deleteTeam(team.teamId); await loadAllData(); }}>Delete</LoadingButton></div></div>))}</div></div>
//         )}

//         {/* MY CREATED TASKS */}
//         {activeNav === 'my-tasks' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Tasks Created by Me</h2><div className="header-filters"><select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}><option value="all">All</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select><LoadingButton className="btn-primary" onClick={async () => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId, assignedToUserId: 0 }); setShowCreateTaskModal(true); }}>+ Create Task</LoadingButton></div></div><div className="projects-grid">{filteredTasks.map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.taskDetails}</h3>{getStatusBadge(t.taskStatus)}</div><p className="project-card-desc">{t.description?.substring(0, 80)}</p><div className="project-card-meta"><span>📁 {t.projectName}</span><span>👤 {t.assignedToUserName}</span><span>📅 Due: {formatDate(t.deadline)}</span></div><div className="project-card-actions"><LoadingButton className="btn-sm btn-outline" onClick={async () => { setSelectedTask(t); setEditTaskData({ taskDetails: t.taskDetails, description: t.description || '', managerNote: t.managerNote || '', taskStatus: t.taskStatus }); setShowEditTaskModal(true); }}>Edit</LoadingButton><LoadingButton className="btn-sm btn-danger" onClick={async () => handleDeleteTask(t.taskId)}>Delete</LoadingButton></div></div>))}</div></div>
//         )}

//         {/* ASSIGNED TO ME */}
//         {activeNav === 'assigned-tasks' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Tasks Assigned to Me</h2></div><div className="projects-grid">{employeeTasks.map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.description?.substring(0, 50)}</h3>{getStatusBadge(t.status)}</div><div className="project-card-meta"><span>🔥 Priority: {t.priority}</span><span>📅 Deadline: {formatDate(t.deadline)}</span><span>👤 By: {t.createdByName}</span></div><LoadingButton className="btn-sm btn-primary" onClick={async () => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); }}>Update Status</LoadingButton></div>))}</div></div>
//         )}

//         {/* AI SUGGEST */}
//         {activeNav === 'ai-suggest' && (
//           <div className="dashboard-card full-width"><h2>AI Consultant Suggestion 🤖</h2><div className="task-form"><div className="form-group"><label>Project</label><select value={aiSuggestData.projectId} onChange={(e) => setAiSuggestData({ ...aiSuggestData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-group"><label>Task Name</label><input placeholder="Enter task name" value={aiSuggestData.taskName} onChange={(e) => setAiSuggestData({ ...aiSuggestData, taskName: e.target.value })} /></div><div className="form-group"><label>Task Description</label><textarea rows={4} placeholder="Describe the task..." value={aiSuggestData.taskDescription} onChange={(e) => setAiSuggestData({ ...aiSuggestData, taskDescription: e.target.value })} /></div><LoadingButton className="btn-primary" onClick={handleAISuggest}>Get Suggestion</LoadingButton>{aiSuggestResult && <div className="ai-section" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface)', borderRadius: '12px' }}><strong>🤖 AI Recommendation:</strong><p style={{ marginTop: '0.5rem' }}>{aiSuggestResult}</p></div>}</div></div>
//         )}

//         {/* EMAIL CONSULTANTS */}
//         {activeNav === 'email' && (
//           <div className="dashboard-card full-width"><h2>Email Department Consultants</h2><div className="task-form"><div className="form-group"><label>Select Recipients</label><div className="emp-grid" style={{ maxHeight: '200px', overflow: 'auto' }}>{emailRecipients.map(r => (<label key={r.userId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderBottom: '1px solid var(--border)' }}><input type="checkbox" checked={emailData.userIds.includes(r.userId)} onChange={() => { const ids = emailData.userIds.includes(r.userId) ? emailData.userIds.filter(id => id !== r.userId) : [...emailData.userIds, r.userId]; setEmailData({ ...emailData, userIds: ids }); }} /><span><strong>{r.name}</strong> - {r.email}</span></label>))}</div></div><div className="form-group"><label>Subject</label><input placeholder="Email Subject" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} /></div><div className="form-group"><label>Message</label><textarea rows={5} placeholder="Type your message..." value={emailData.message} onChange={(e) => setEmailData({ ...emailData, message: e.target.value })} /></div><div className="form-group"><label>Message Type</label><select value={emailData.messageType} onChange={(e) => setEmailData({ ...emailData, messageType: e.target.value })}><option value="INFORMATION">📢 Information</option><option value="ALERT">⚠️ Alert</option><option value="TASK">✅ Task Assignment</option><option value="MEETING">📅 Meeting Invite</option></select></div><LoadingButton className="btn-primary" onClick={handleSendEmail}>Send Email</LoadingButton></div></div>
//         )}

//         {/* UPLOADS */}
//         {activeNav === 'uploads' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>My Uploads</h2></div><div className="upload-section"><select value={uploadFileData.projectId} onChange={(e) => setUploadFileData({ ...uploadFileData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select><input type="file" onChange={(e) => setUploadFileData({ ...uploadFileData, file: e.target.files?.[0] || null })} /><select value={uploadFileData.fileType} onChange={(e) => setUploadFileData({ ...uploadFileData, fileType: e.target.value })}><option value="">Type</option><option value="Document">📄 Document</option><option value="Code">💻 Code</option><option value="Image">🖼️ Image</option><option value="PDF">📕 PDF</option><option value="Report">📊 Report</option></select><LoadingButton className="btn-primary" onClick={handleUploadFile}>Upload</LoadingButton></div><div className="uploads-list">{myUploads.map(f => (<div key={f.fileId} className="file-item"><div className="file-icon">📄</div><div className="file-info"><div className="file-name">{f.fileLink?.split('/').pop()}</div><div className="file-meta"><span>{f.fileType}</span><span>📁 {f.projectName}</span><span>📅 {formatDate(f.uploadTime)}</span></div></div><div className="file-actions"><button className="btn-icon" onClick={() => handleViewFile(f.fileId)}>View</button><button className="btn-icon" onClick={() => handleDownloadFile(f.fileId)}>Download</button><LoadingButton className="btn-icon danger" onClick={async () => handleDeleteFile(f.fileId)}>Delete</LoadingButton></div></div>))}</div></div>
//         )}

//         {/* PROFILE */}
//         {activeNav === 'profile' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Profile</h2><button className="btn-outline" onClick={() => setShowProfileModal(true)}>Edit</button></div><div className="profile-info"><div className="profile-avatar-large"><div className="avatar-placeholder">{user?.name?.charAt(0)}</div></div><div className="profile-details"><div className="detail-item"><label>Name</label><span>{user?.name}</span></div><div className="detail-item"><label>Email</label><span>{user?.email}</span></div><div className="detail-item"><label>Role</label><span>Manager</span></div><div className="detail-item"><label>Department</label><span>{myDetails?.employee?.departmentName || 'N/A'}</span></div><div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not set'}</span></div><div className="detail-item"><label>Address</label><span>{user?.address || 'Not set'}</span></div></div></div><div className="setting-item danger"><div><div className="setting-label">Delete Account</div><div className="setting-desc">Permanently delete your account</div></div><LoadingButton className="btn-danger" onClick={handleDeleteAccount}>Delete</LoadingButton></div></div>
//         )}

//         <footer className="client-footer"><p>© 2026 Manager Portal | Softmax.in</p></footer>
//       </main>

//       {/* MODALS */}
//       {showUpdateProjectModal && selectedProject && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowUpdateProjectModal(false)}>✕</button><h2>Update Status - {selectedProject.projectName}</h2><div className="m-form"><select value={updateProjectData.status} onChange={(e) => setUpdateProjectData({ ...updateProjectData, status: e.target.value })}><option value="PENDING">Pending</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="REJECTED">Rejected</option></select><textarea placeholder="Note" value={updateProjectData.note} onChange={(e) => setUpdateProjectData({ ...updateProjectData, note: e.target.value })} rows={3} /><LoadingButton className="btn-msub" onClick={handleUpdateProjectStatus}>Update</LoadingButton></div></div></div>)}

//       {showCreateTaskModal && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowCreateTaskModal(false)}>✕</button><h2>Create Task</h2><div className="m-form"><div className="form-group"><label>Project</label><select value={createTaskData.projectId} onChange={(e) => setCreateTaskData({ ...createTaskData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-group"><label>Assign To Consultant</label><select value={createTaskData.assignedToUserId} onChange={(e) => setCreateTaskData({ ...createTaskData, assignedToUserId: parseInt(e.target.value) })}><option value="0">Select Consultant</option>{consultants.map(c => <option key={c.userId} value={c.userId}>{c.name} (⭐ {c.averageRating.toFixed(1)}) - {c.skill}</option>)}</select></div><div className="form-group"><label>Task Details</label><input placeholder="Task title" value={createTaskData.taskDetails} onChange={(e) => setCreateTaskData({ ...createTaskData, taskDetails: e.target.value })} /></div><div className="form-group"><label>Description</label><textarea placeholder="Description" value={createTaskData.description} onChange={(e) => setCreateTaskData({ ...createTaskData, description: e.target.value })} rows={3} /></div><div className="form-group"><label>Deadline (with time)</label><input type="datetime-local" value={createTaskData.deadline} onChange={(e) => setCreateTaskData({ ...createTaskData, deadline: e.target.value })} /></div><LoadingButton className="btn-msub" onClick={handleCreateTask}>Create Task</LoadingButton></div></div></div>)}

//       {showEditTaskModal && selectedTask && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowEditTaskModal(false)}>✕</button><h2>Edit Task</h2><div className="m-form"><input value={editTaskData.taskDetails} onChange={(e) => setEditTaskData({ ...editTaskData, taskDetails: e.target.value })} /><textarea value={editTaskData.description} onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })} rows={3} /><textarea placeholder="Manager Note" value={editTaskData.managerNote} onChange={(e) => setEditTaskData({ ...editTaskData, managerNote: e.target.value })} rows={2} /><select value={editTaskData.taskStatus} onChange={(e) => setEditTaskData({ ...editTaskData, taskStatus: e.target.value })}><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><LoadingButton className="btn-msub" onClick={handleUpdateTask}>Save</LoadingButton></div></div></div>)}

//       {showCreateTeamModal && (<div className="modal-mask open"><div className="modal-box large"><button className="m-close" onClick={() => setShowCreateTeamModal(false)}>✕</button><h2>Create Team</h2><div className="m-form"><div className="form-group"><label>Project</label><select value={createTeamData.projectId} onChange={(e) => setCreateTeamData({ ...createTeamData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-group"><label>Team Name</label><input placeholder="Team Name" value={createTeamData.teamName} onChange={(e) => setCreateTeamData({ ...createTeamData, teamName: e.target.value })} /></div><div className="form-group"><label>Select Consultants</label><div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem' }}>{consultants.map(c => (<label key={c.consultantId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}><input type="checkbox" checked={createTeamData.memberIds.includes(c.userId)} onChange={() => { const ids = createTeamData.memberIds.includes(c.userId) ? createTeamData.memberIds.filter(id => id !== c.userId) : [...createTeamData.memberIds, c.userId]; setCreateTeamData({ ...createTeamData, memberIds: ids }); }} /><span><strong>{c.name}</strong> - {c.skill} (⭐ {c.averageRating.toFixed(1)})</span></label>))}</div></div><LoadingButton className="btn-msub" onClick={handleCreateTeam}>Create Team</LoadingButton></div></div></div>)}

//       {showRateConsultantModal && selectedConsultant && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowRateConsultantModal(false)}>✕</button><h2>Rate {selectedConsultant.name}</h2><div className="m-form"><select value={rateConsultantData.rating} onChange={(e) => setRateConsultantData({ ...rateConsultantData, rating: parseFloat(e.target.value) })}><option value="0">Select Rating</option><option value="1">⭐ 1 - Poor</option><option value="2">⭐⭐ 2 - Fair</option><option value="3">⭐⭐⭐ 3 - Good</option><option value="4">⭐⭐⭐⭐ 4 - Very Good</option><option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option></select><textarea placeholder="Feedback" value={rateConsultantData.feedback} onChange={(e) => setRateConsultantData({ ...rateConsultantData, feedback: e.target.value })} rows={3} /><LoadingButton className="btn-msub" onClick={handleRateConsultant}>Submit Rating</LoadingButton></div></div></div>)}

//       {showEmployeeTaskModal && selectedEmployeeTask && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowEmployeeTaskModal(false)}>✕</button><h2>Update Task</h2><p><strong>{selectedEmployeeTask.description}</strong></p><p>Priority: {selectedEmployeeTask.priority} | Current: {selectedEmployeeTask.status}</p><select value={employeeTaskStatus} onChange={(e) => setEmployeeTaskStatus(e.target.value)}><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><textarea placeholder="Add note..." value={employeeTaskNote} onChange={(e) => setEmployeeTaskNote(e.target.value)} rows={3} /><div className="modal-actions"><LoadingButton className="btn-primary" onClick={handleUpdateEmployeeTask}>Update Status</LoadingButton><LoadingButton className="btn-success" onClick={handleCompleteEmployeeTask}>Complete Task</LoadingButton></div></div></div>)}

//       {/* Project Detail Modal - Improved with Scroll */}
//       {showProjectDetailModal && selectedProject && (
//         <div className="modal-mask open">
//           <div className="modal-box large project-detail-modal">
//             <button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button>
//             <h2>{selectedProject.projectName}</h2>
            
//             <div className="m-tabs">
//               <button className={`m-tab ${activeModalTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveModalTab('overview')}>📋 Overview</button>
//               <button className={`m-tab ${activeModalTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveModalTab('teams')}>👥 Teams ({selectedProjectTeams.length})</button>
//               <button className={`m-tab ${activeModalTab === 'files' ? 'active' : ''}`} onClick={() => setActiveModalTab('files')}>📎 Files ({selectedProjectFiles.length})</button>
//               <button className={`m-tab ${activeModalTab === 'history' ? 'active' : ''}`} onClick={() => setActiveModalTab('history')}>📜 History ({selectedProjectHistory.length})</button>
//             </div>

//             <div className="m-tab-content-modal">
//               {activeModalTab === 'overview' && (
//                 <div className="project-overview">
//                   <div className="detail-row"><label>Status:</label>{getStatusBadge(selectedProject.status)}</div>
//                   <div className="detail-row"><label>Description:</label><p>{selectedProject.projectDescription}</p></div>
//                   <div className="detail-grid">
//                     <div><label>Type:</label> {selectedProject.projectType}</div>
//                     <div><label>Client:</label> {selectedProject.clientName}</div>
//                     <div><label>Department:</label> {selectedProject.departmentName}</div>
//                     <div><label>Manager:</label> {selectedProject.assignedManagerName}</div>
//                     <div><label>Deadline:</label> {formatDate(selectedProject.deadline)}</div>
//                   </div>
//                 </div>
//               )}
              
//               {activeModalTab === 'teams' && <TeamsList teams={selectedProjectTeams} />}
              
//               {activeModalTab === 'files' && (
//                 <FilesList 
//                   files={selectedProjectFiles} 
//                   onView={handleViewFile} 
//                   onDownload={handleDownloadFile} 
//                   onDelete={handleDeleteFile}
//                   userName={user?.name}
//                 />
//               )}
              
//               {activeModalTab === 'history' && <TimelineHistory history={selectedProjectHistory} />}
//             </div>
//           </div>
//         </div>
//       )}

//       {showProfileModal && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowProfileModal(false)}>✕</button><h2>Edit Profile</h2><form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleUpdateProfile({ name: fd.get('name'), phoneNumber: fd.get('phoneNumber'), address: fd.get('address'), gender: fd.get('gender'), dob: fd.get('dob') }); }}><div className="m-form"><input name="name" defaultValue={user?.name} placeholder="Name" /><input name="phoneNumber" defaultValue={user?.phoneNumber} placeholder="Phone" /><input name="gender" defaultValue={user?.gender} placeholder="Gender" /><input name="dob" type="date" defaultValue={user?.dob} /><textarea name="address" rows={2} defaultValue={user?.address} placeholder="Address" /><button type="submit" className="btn-msub">Save</button></div></form></div></div>)}

//       {showAIProfileModal && selectedConsultantForAI && <AIProfileModal consultant={selectedConsultantForAI} onClose={() => setShowAIProfileModal(false)} />}

//       <style jsx>{`
//         .project-selector-bar { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
//         .project-selector-left { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
//         .project-selector-left label { font-weight: 600; color: var(--teal); }
//         .project-search-wrapper { display: flex; gap: 0.5rem; flex-wrap: wrap; }
//         .project-search-input { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); width: 200px; }
//         .project-select { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); min-width: 250px; }
//         .project-selector-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
//         .action-btn { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.2s; border: none; }
//         .action-btn.primary { background: var(--teal); color: white; }
//         .action-btn.success { background: var(--green); color: white; }
//         .action-btn.info { background: var(--blue); color: white; }
//         .action-btn.outline { background: transparent; border: 1px solid var(--teal); color: var(--teal); }
//         .action-btn:hover:not(:disabled) { transform: translateY(-2px); }
//         .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
//         .emp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
//         .emp-card { background: var(--bg); border: 1px solid var(--border); border-radius: 18px; padding: 1.3rem; transition: all 0.3s ease; }
//         .emp-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); border-color: rgba(44, 166, 164, 0.3); }
//         .emp-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
//         .emp-avatar { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: rgba(44, 166, 164, 0.1); }
//         .emp-avatar.verified { background: rgba(52, 168, 83, 0.15); }
//         .avatar-img { width: 100%; height: 100%; border-radius: 14px; object-fit: cover; }
//         .emp-card h3 { font-size: 1rem; margin: 0 0 0.25rem; }
//         .dept-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; background: rgba(44, 166, 164, 0.12); color: var(--teal); }
//         .emp-body { margin-top: 0.75rem; }
//         .emp-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 0.8rem; }
//         .emp-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.5rem; flex-wrap: wrap; }
//         .btn-ai { background: linear-gradient(135deg, #6c5ce7, #a463f5); color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 20px; cursor: pointer; font-size: 0.7rem; transition: all 0.3s; }
//         .btn-ai:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(108, 92, 231, 0.5); }
        
//         .header-filters { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
//         .form-group { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.75rem; }
//         .form-group label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--muted); }
//         .form-group input, .form-group select, .form-group textarea { padding: 0.6rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); }
        
//         .team-member { display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: var(--surface); border-radius: 10px; margin-bottom: 0.5rem; }
//         .member-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
        
//         .upload-section { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1rem; }
//         .uploads-list { display: flex; flex-direction: column; gap: 0.5rem; }
//         .file-item { display: flex; align-items: center; gap: 1rem; padding: 0.6rem; background: var(--surface); border-radius: 10px; }
//         .file-actions { display: flex; gap: 0.3rem; }
//         .btn-icon { padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); cursor: pointer; }
        
//         /* Project Detail Modal Styles with Scroll */
//         .project-detail-modal { max-width: 850px; width: 90%; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; }
//         .project-detail-modal h2 { flex-shrink: 0; padding-right: 2rem; }
//         .m-tabs { flex-shrink: 0; display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
//         .m-tab { padding: 0.5rem 1rem; background: transparent; border: none; cursor: pointer; color: var(--muted); border-radius: 8px 8px 0 0; transition: all 0.2s; }
//         .m-tab.active { color: var(--teal); border-bottom: 2px solid var(--teal); background: transparent; }
//         .m-tab:hover:not(.active) { background: var(--surface); color: var(--text); }
//         .m-tab-content-modal { flex: 1; overflow-y: auto; padding-right: 0.5rem; min-height: 300px; }
//         .m-tab-content-modal::-webkit-scrollbar { width: 6px; }
//         .m-tab-content-modal::-webkit-scrollbar-track { background: var(--surface); border-radius: 3px; }
//         .m-tab-content-modal::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 3px; }
        
//         /* Teams Scroll Styles */
//         .teams-scroll-container { max-height: 500px; overflow-y: auto; padding-right: 0.5rem; }
//         .teams-scroll-container::-webkit-scrollbar { width: 6px; }
//         .teams-scroll-container::-webkit-scrollbar-track { background: var(--surface); border-radius: 3px; }
//         .teams-scroll-container::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 3px; }
//         .teams-list { display: flex; flex-direction: column; gap: 1rem; }
//         .team-card-detail { background: var(--surface); border-radius: 14px; padding: 1rem; border: 1px solid var(--border); }
//         .team-card-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 0.8rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); }
//         .team-card-header h4 { font-size: 1rem; font-weight: 700; margin: 0; }
//         .team-manager-badge { font-size: 0.75rem; background: rgba(44, 166, 164, 0.1); color: var(--teal); padding: 0.2rem 0.6rem; border-radius: 20px; }
//         .team-members-list .members-title { font-size: 0.75rem; font-weight: 600; color: var(--muted); margin-bottom: 0.5rem; }
//         .team-member-row { display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: var(--bg); border-radius: 10px; margin-bottom: 0.5rem; }
//         .member-avatar-small { width: 32px; height: 32px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
//         .member-info { flex: 1; }
//         .member-name { font-weight: 600; font-size: 0.85rem; }
//         .member-role { font-size: 0.7rem; color: var(--teal); }
//         .member-email { font-size: 0.65rem; color: var(--muted); }
        
//         /* Files Scroll Styles */
//         .files-scroll-container { max-height: 500px; overflow-y: auto; padding-right: 0.5rem; }
//         .files-scroll-container::-webkit-scrollbar { width: 6px; }
//         .files-scroll-container::-webkit-scrollbar-track { background: var(--surface); border-radius: 3px; }
//         .files-scroll-container::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 3px; }
//         .files-grid-list { display: flex; flex-direction: column; gap: 0.5rem; }
//         .file-card-item { display: flex; align-items: center; gap: 1rem; padding: 0.8rem; background: var(--surface); border-radius: 12px; transition: all 0.2s; }
//         .file-card-item:hover { background: var(--bg); transform: translateX(4px); }
//         .file-card-icon { font-size: 1.8rem; }
//         .file-card-info { flex: 1; }
//         .file-card-name { font-weight: 500; font-size: 0.85rem; word-break: break-all; }
//         .file-card-meta { display: flex; gap: 0.8rem; flex-wrap: wrap; font-size: 0.65rem; color: var(--muted); margin-top: 0.2rem; }
//         .file-type-badge { background: rgba(44, 166, 164, 0.1); color: var(--teal); padding: 0.15rem 0.5rem; border-radius: 12px; }
//         .file-card-actions { display: flex; gap: 0.3rem; }
//         .btn-icon-small { padding: 0.3rem 0.6rem; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; font-size: 0.75rem; transition: all 0.2s; }
//         .btn-icon-small:hover { background: var(--teal); border-color: var(--teal); color: white; }
//         .btn-icon-small.danger:hover { background: var(--red); border-color: var(--red); }
        
//         /* Timeline Scroll Styles */
//         .timeline-scroll-container { max-height: 500px; overflow-y: auto; padding-right: 0.5rem; }
//         .timeline-scroll-container::-webkit-scrollbar { width: 6px; }
//         .timeline-scroll-container::-webkit-scrollbar-track { background: var(--surface); border-radius: 3px; }
//         .timeline-scroll-container::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 3px; }
//         .timeline-timeline { display: flex; flex-direction: column; gap: 0.75rem; }
//         .timeline-entry-card { background: var(--surface); border-radius: 12px; padding: 0.8rem; border-left: 3px solid var(--teal); transition: all 0.2s; }
//         .timeline-entry-card:hover { transform: translateX(4px); background: var(--bg); }
//         .timeline-entry-card.latest { border-left-color: var(--green); background: linear-gradient(135deg, var(--surface), rgba(52, 168, 83, 0.05)); }
//         .timeline-entry-badge { margin-bottom: 0.3rem; }
//         .timeline-entry-date { font-size: 0.65rem; color: var(--muted); margin-bottom: 0.3rem; }
//         .timeline-entry-actor { font-size: 0.75rem; margin-bottom: 0.3rem; }
//         .timeline-entry-note { font-size: 0.7rem; color: var(--muted); margin-top: 0.3rem; padding-left: 0.5rem; border-left: 2px solid var(--teal); }
//         .timeline-entry-note.director { border-left-color: var(--orange); }
//         .timeline-entry-assigned { font-size: 0.7rem; color: var(--teal); margin-top: 0.3rem; }
        
//         .project-overview { padding: 0.5rem 0; }
//         .detail-row { margin-bottom: 1rem; }
//         .detail-row label { font-weight: 600; color: var(--muted); min-width: 100px; display: inline-block; }
//         .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
        
//         .shimmer-wrapper { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }
//         .shimmer-card { background: var(--surface); border-radius: 16px; padding: 1rem; }
//         .shimmer-line { background: linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; margin: 0.5rem 0; }
//         .shimmer-line-lg { height: 60px; width: 100%; }
//         .shimmer-line-md { height: 40px; width: 80%; }
//         .shimmer-line-sm { height: 20px; width: 60%; }
//         @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        
//         .loading-spinner-small { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.6s linear infinite; }
//         @keyframes spin { to { transform: rotate(360deg); } }
        
//         /* AI Modal Styles */
//         .ai-modal-mask { z-index: 2000; }
//         .ai-analysis-modal-box { max-width: 600px; width: 90%; background: linear-gradient(135deg, var(--bg), var(--surface)); border: 1px solid rgba(108, 92, 231, 0.3); box-shadow: 0 0 40px rgba(108, 92, 231, 0.2); max-height: 90vh; overflow-y: auto; }
//         .ai-modal-content { animation: aiFadeIn 0.5s ease; }
//         .ai-header-glow { text-align: center; margin-bottom: 1.5rem; }
//         .ai-icon-pulse { font-size: 3rem; animation: aiPulse 1s infinite; display: inline-block; }
//         .ai-header-glow h2 { background: linear-gradient(135deg, #6c5ce7, #a463f5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.5rem; }
//         .ai-badge-shine { display: inline-block; padding: 0.2rem 0.8rem; background: linear-gradient(135deg, #6c5ce7, #a463f5); border-radius: 20px; font-size: 0.7rem; color: white; margin-top: 0.5rem; animation: shine 2s infinite; }
//         .ai-consultant-info { display: flex; gap: 1rem; align-items: center; padding: 1rem; background: linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(164, 99, 245, 0.05)); border-radius: 16px; margin-bottom: 1rem; }
//         .ai-avatar { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #6c5ce7, #a463f5); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: white; }
//         .ai-rating { font-size: 0.8rem; color: #f59e0b; }
//         .ai-loading { text-align: center; padding: 2rem; }
//         .ai-wave { width: 50px; height: 50px; margin: 0 auto 1rem; background: linear-gradient(135deg, #6c5ce7, #a463f5); border-radius: 50%; animation: aiWave 1s ease-in-out infinite; }
//         .ai-results { display: flex; flex-direction: column; gap: 0.8rem; max-height: 400px; overflow-y: auto; }
//         .ai-card { display: flex; gap: 0.8rem; padding: 0.8rem; background: var(--bg); border-radius: 12px; border-left: 3px solid #6c5ce7; }
//         .ai-card-icon { font-size: 1.5rem; }
//         .ai-card-content h4 { font-size: 0.8rem; margin-bottom: 0.3rem; color: #6c5ce7; }
//         .ai-card-content p { font-size: 0.75rem; color: var(--muted); line-height: 1.5; }
//         .ai-error-state { text-align: center; padding: 2rem; background: rgba(231, 76, 60, 0.1); border-radius: 12px; }
//         .error-icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
//         @keyframes aiPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
//         @keyframes aiWave { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); opacity: 0.5; } }
//         @keyframes shine { 0% { opacity: 0.6; } 50% { opacity: 1; box-shadow: 0 0 10px rgba(108, 92, 231, 0.5); } 100% { opacity: 0.6; } }
//         @keyframes aiFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
//         .btn-success { background: linear-gradient(135deg, #27ae60, #229954); color: white; border: none; padding: 0.5rem 1rem; border-radius: 40px; cursor: pointer; }
//         .btn-sm { padding: 0.3rem 0.8rem; font-size: 0.7rem; border-radius: 20px; }
//         .btn-outline { background: transparent; border: 1px solid var(--teal); color: var(--teal); }
//         .btn-primary { background: var(--teal); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
//         .btn-danger { background: var(--red); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
//         .btn-msub { padding: 0.6rem; border-radius: 40px; background: var(--teal); color: white; font-weight: 600; width: 100%; cursor: pointer; }
        
//         .empty-state { text-align: center; padding: 2rem; color: var(--muted); }
//         .empty-icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; opacity: 0.5; }
//         .view-all-link { color: var(--teal); background: none; border: none; cursor: pointer; font-size: 0.8rem; }
        
//         @media (max-width: 768px) { 
//           .project-selector-bar { flex-direction: column; align-items: stretch; } 
//           .project-selector-left { flex-direction: column; align-items: stretch; } 
//           .project-search-wrapper { flex-direction: column; } 
//           .project-selector-actions { justify-content: center; } 
//           .emp-grid { grid-template-columns: 1fr; }
//           .m-tabs { flex-direction: column; border-bottom: none; }
//           .m-tab { border-bottom: none; border-radius: 8px; }
//           .m-tab.active { border-bottom: none; background: var(--teal); color: white; }
//           .project-detail-modal { width: 95%; max-height: 90vh; }
//           .detail-grid { grid-template-columns: 1fr; }
//           .team-card-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Manager;


// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import CommonSidebar from './components/CommonSidebar';
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
//   emailVerified: boolean;
//   isProfileCompleted: boolean;
//   phoneNumber?: string;
//   address?: string;
//   gender?: string;
//   dob?: string;
// }

// interface Employee {
//   employeeId: number;
//   isDirectorVerified: boolean;
//   positionName: string;
//   salary: number;
//   department: string;
//   skillSet: string;
//   departmentId: number;
//   departmentName: string;
// }

// interface MyDetails {
//   user: UserProfile;
//   roles: Role[];
//   employee: Employee | null;
// }

// interface Role {
//   id: number;
//   ptype: string;
//   stype: string;
//   isApproved: string;
//   createdAt: string;
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
//   assignedManagerId: number;
//   assignedManagerName: string;
//   deadline: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ProjectHistory {
//   statusId: number;
//   projectId: number;
//   projectName: string;
//   status: string;
//   dateTime: string;
//   handledById: number;
//   handledByName: string;
//   assignedToId: number | null;
//   assignedToName: string | null;
//   directorNote: string | null;
//   managerNote: string | null;
//   deadline: string | null;
// }

// interface Task {
//   taskId: number;
//   projectId: number;
//   projectName: string;
//   assignedToUserId: number;
//   assignedToUserName: string;
//   assignedToUserPhoto: string | null;
//   taskDetails: string;
//   description: string;
//   taskStatus: string;
//   createdById: number;
//   createdByName: string;
//   deadline: string;
//   managerNote: string | null;
//   createdAt: string;
//   updatedAt: string;
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

// interface TeamMember {
//   memberId: number;
//   memberName: string;
//   memberEmail: string;
//   photoUrl: string | null;
//   role: string;
//   description: string | null;
// }

// interface ConsultantRequest {
//   requestId: number;
//   projectId: number;
//   projectName: string;
//   consultantId: number;
//   consultantName: string;
//   consultantEmail: string;
//   consultantPhoto: string | null;
//   skill: string;
//   experience: string;
//   marks10: number;
//   marks12: number;
//   graduationMarks: number;
//   resumeLink: string;
//   averageRating: number;
//   totalReviews: number;
//   requestedAt: string;
// }

// interface ConsultantWithRating {
//   consultantId: number;
//   userId: number;
//   name: string;
//   email: string;
//   photoUrl: string | null;
//   skill: string;
//   experience: string;
//   averageRating: number;
//   totalReviews: number;
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
//   projectId?: number;
//   projectName?: string;
// }

// interface EmployeeTask {
//   taskId: number;
//   description: string;
//   status: string;
//   priority: string;
//   createdByUserId: number;
//   createdByName: string;
//   createdByPhoto: string | null;
//   deadline: string;
//   createdAt: string;
//   updatedAt: string;
//   completedAt: string | null;
// }

// interface EmailRecipient {
//   userId: number;
//   name: string;
//   email: string;
//   role: string;
//   department: string;
// }

// interface AIAnalysisResponse {
//   summary: string;
//   strengths: string[];
//   weaknesses: string[];
//   recommendations: string[];
//   performance: string;
//   nextSteps: string[];
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
// // ALL MANAGER APIs
// // ============================================

// const checkIsManager = async () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/project/check/manager');
// const getMyAssignedProjects = async () => apiCall<{ success: boolean; data: Project[] }>('GET', '/api/project/manager/my-projects');
// const updateProjectStatus = async (projectId: number, status: string, note?: string) => {
//   let url = `/api/project/manager/update-status/${projectId}?status=${status}`;
//   if (note) url += `&note=${encodeURIComponent(note)}`;
//   return apiCall('PUT', url);
// };
// const createTask = async (data: { projectId: number; assignedToUserId: number; taskDetails: string; description: string; deadline: string }) => apiCall('POST', '/api/task/create', data);
// const updateTask = async (taskId: number, data: any) => apiCall('PUT', `/api/task/update/${taskId}`, data);
// const deleteTask = async (taskId: number) => apiCall('DELETE', `/api/task/delete/${taskId}`);
// const getMyCreatedTasks = async () => apiCall<{ success: boolean; data: Task[] }>('GET', '/api/task/my-created-tasks');
// const getProjectTasks = async (projectId: number) => apiCall<{ success: boolean; data: Task[] }>('GET', `/api/task/project/${projectId}`);
// const createTeam = async (data: { projectId: number; teamName: string; memberIds: number[]; memberRoles: string[] }) => apiCall('POST', '/api/team/create', data);
// const addMemberToTeam = async (teamId: number, memberId: number, role: string) => apiCall('POST', `/api/team/${teamId}/add-member?memberId=${memberId}&role=${encodeURIComponent(role)}`);
// const removeMemberFromTeam = async (teamId: number, memberId: number) => apiCall('DELETE', `/api/team/${teamId}/remove-member/${memberId}`);
// const deleteTeam = async (teamId: number) => apiCall('DELETE', `/api/team/delete/${teamId}`);
// const getMyTeams = async () => apiCall<{ success: boolean; data: Team[] }>('GET', '/api/team/my-teams');
// const getProjectTeams = async (projectId: number) => apiCall<{ success: boolean; data: Team[] }>('GET', `/api/team/project/${projectId}`);
// const getConsultantRequests = async () => apiCall<{ success: boolean; data: ConsultantRequest[] }>('GET', '/api/consultant-project/manager/requests');
// const rateConsultant = async (data: { userId: number; rating: number; feedback: string }) => apiCall('POST', '/api/consultant-project/manager/rate', data);
// const uploadFile = async (projectId: number, file: File, fileType: string) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   return apiCall('POST', `/api/file/upload/${projectId}?fileType=${fileType}`, formData, true);
// };
// const getProjectFiles = async (projectId: number) => apiCall<{ success: boolean; data: FileItem[] }>('GET', `/api/file/project/${projectId}`);
// const getMyUploads = async () => apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/my-uploads');
// const deleteFile = async (fileId: number) => apiCall('DELETE', `/api/file/delete/${fileId}`);
// const getProjectById = async (projectId: number) => apiCall<{ success: boolean; data: Project }>('GET', `/api/project/${projectId}`);
// const getProjectHistory = async (projectId: number) => apiCall<{ success: boolean; data: ProjectHistory[] }>('GET', `/api/project/${projectId}/history`);
// const getUserProfile = async () => apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
// const updateUserProfile = async (data: any) => apiCall('PUT', '/api/users/profile', data);
// const deleteAccount = async () => apiCall('DELETE', '/api/users/account');
// const getMyDetails = async () => apiCall<{ success: boolean; data: MyDetails }>('GET', '/api/getmydetails');
// const getAccessToken = async (fileId: number) => apiCall('POST', `/api/file/access-token/${fileId}`, {});
// const getMyDepartmentConsultants = async () => apiCall<{ success: boolean; data: ConsultantWithRating[] }>('GET', '/api/consultant-project/manager/my-department-consultants');
// const getEmployeeTasks = async () => apiCall<{ success: boolean; data: EmployeeTask[] }>('GET', '/api/employee/my-tasks');
// const updateEmployeeTaskStatus = async (taskId: number, status: string, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/status`, { status, note });
// const completeEmployeeTask = async (taskId: number, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/complete`, { note });
// const getEmailRecipients = async () => apiCall<{ success: boolean; data: EmailRecipient[] }>('GET', '/api/email/recipients/my-department-consultants');
// const sendEmail = async (data: { userIds: number[]; subject: string; message: string; messageType: string }) => apiCall('POST', '/api/email/send', data);
// const getAISuggestConsultant = async (data: { taskName: string; taskDescription: string; projectId: number }) => apiCall('POST', '/api/ai/suggest-consultant-for-task', data);

// // Simulated AI analysis for consultant (since no real API)
// const getAIConsultantAnalysis = async (consultant: ConsultantWithRating): Promise<AIAnalysisResponse> => {
//   await new Promise(resolve => setTimeout(resolve, 1500));
//   return {
//     summary: `${consultant.name} is a ${consultant.experience} experienced professional with expertise in ${consultant.skill.substring(0, 50)}. Current rating: ${consultant.averageRating.toFixed(1)}/5 from ${consultant.totalReviews} reviews.`,
//     strengths: consultant.skill.split(',').slice(0, 3).map(s => s.trim()),
//     weaknesses: consultant.totalReviews < 3 ? ['Limited number of reviews', 'Recently joined'] : ['Room for improvement in complex scenarios'],
//     recommendations: [`Assign ${consultant.name} to tasks requiring ${consultant.skill.split(',')[0]}`, 'Provide regular feedback for growth'],
//     performance: consultant.averageRating >= 4.5 ? 'Excellent performer with consistent high ratings' : consultant.averageRating >= 3.5 ? 'Good performer with positive trajectory' : 'Needs improvement, consider mentoring',
//     nextSteps: ['Schedule monthly review', 'Assign challenging tasks', 'Track progress regularly']
//   };
// };

// // ============================================
// // SIDEBAR MENU ITEMS
// // ============================================

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//   { id: 'my-projects', label: 'My Projects', icon: '📁' },
//   { id: 'consultant-requests', label: 'Consultant Requests', icon: '📨' },
//   { id: 'consultants', label: 'Consultants', icon: '👥' },
//   { id: 'my-teams', label: 'My Teams', icon: '👥' },
//   { id: 'my-tasks', label: 'My Created Tasks', icon: '✅' },
//   { id: 'assigned-tasks', label: 'Assigned to Me', icon: '📋' },
//   { id: 'ai-suggest', label: 'AI Suggest', icon: '🤖' },
//   { id: 'email', label: 'Email Consultants', icon: '✉️' },
//   { id: 'uploads', label: 'Uploads', icon: '📎' },
//   { id: 'profile', label: 'Profile', icon: '👤' },
// ];

// const statusConfig: Record<string, { label: string; class: string; icon: string }> = {
//   PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳' },
//   ASSIGNED: { label: 'Assigned', class: 'status-assigned', icon: '👥' },
//   IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄' },
//   COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️' },
//   REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '❌' },
//   APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅' },
// };

// const getStatusBadge = (status: string) => {
//   const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌' };
//   return <span className={`status-badge ${config.class}`}><span className="status-icon">{config.icon}</span>{config.label}</span>;
// };

// // Loading Button Component
// const LoadingButton: React.FC<{ onClick: () => Promise<void>; children: React.ReactNode; className?: string; disabled?: boolean }> = ({ onClick, children, className = '', disabled = false }) => {
//   const [loading, setLoading] = useState(false);
//   const handleClick = async () => {
//     if (loading || disabled) return;
//     setLoading(true);
//     try {
//       await onClick();
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <button className={className} onClick={handleClick} disabled={loading || disabled}>
//       {loading ? <span className="loading-spinner-small"></span> : children}
//     </button>
//   );
// };

// // Shimmer Loader Component
// const ShimmerLoader: React.FC = () => (
//   <div className="shimmer-wrapper">
//     <div className="shimmer-card">
//       <div className="shimmer-line shimmer-line-lg"></div>
//       <div className="shimmer-line shimmer-line-md"></div>
//       <div className="shimmer-line shimmer-line-sm"></div>
//     </div>
//     <div className="shimmer-card">
//       <div className="shimmer-line shimmer-line-lg"></div>
//       <div className="shimmer-line shimmer-line-md"></div>
//       <div className="shimmer-line shimmer-line-sm"></div>
//     </div>
//     <div className="shimmer-card">
//       <div className="shimmer-line shimmer-line-lg"></div>
//       <div className="shimmer-line shimmer-line-md"></div>
//       <div className="shimmer-line shimmer-line-sm"></div>
//     </div>
//   </div>
// );

// // AI Analysis Modal Component
// const AIAnalysisModal: React.FC<{ consultant: ConsultantWithRating; onClose: () => void }> = ({ consultant, onClose }) => {
//   const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [animate, setAnimate] = useState(false);

//   useEffect(() => {
//     setAnimate(true);
//     getAIConsultantAnalysis(consultant).then(result => {
//       setAnalysis(result);
//       setLoading(false);
//     });
//   }, [consultant]);

//   return (
//     <div className="modal-mask open ai-modal-mask">
//       <div className="modal-box ai-analysis-modal-box">
//         <button className="m-close" onClick={onClose}>✕</button>
//         <div className={`ai-modal-content ${animate ? 'ai-animate-in' : ''}`}>
//           <div className="ai-header-glow">
//             <div className="ai-icon-pulse">🤖</div>
//             <h2>AI Performance Analysis</h2>
//             <div className="ai-badge-shine">Powered by Neural AI</div>
//           </div>
          
//           <div className="ai-consultant-info">
//             <div className="ai-avatar">{consultant.name.charAt(0)}</div>
//             <div>
//               <h3>{consultant.name}</h3>
//               <p>{consultant.skill}</p>
//               <div className="ai-rating">⭐ {consultant.averageRating.toFixed(1)} / 5 ({consultant.totalReviews} reviews)</div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="ai-loading">
//               <div className="ai-wave"></div>
//               <p>Analyzing performance data...</p>
//             </div>
//           ) : analysis && (
//             <div className="ai-results">
//               <div className="ai-card">
//                 <div className="ai-card-icon">📊</div>
//                 <div className="ai-card-content">
//                   <h4>Executive Summary</h4>
//                   <p>{analysis.summary}</p>
//                 </div>
//               </div>

//               <div className="ai-card">
//                 <div className="ai-card-icon">💪</div>
//                 <div className="ai-card-content">
//                   <h4>Core Strengths</h4>
//                   <div className="ai-tags">{analysis.strengths.map((s, i) => <span key={i} className="ai-tag strength">{s}</span>)}</div>
//                 </div>
//               </div>

//               <div className="ai-card">
//                 <div className="ai-card-icon">⚠️</div>
//                 <div className="ai-card-content">
//                   <h4>Development Areas</h4>
//                   <div className="ai-tags">{analysis.weaknesses.map((w, i) => <span key={i} className="ai-tag weakness">{w}</span>)}</div>
//                 </div>
//               </div>

//               <div className="ai-card">
//                 <div className="ai-card-icon">🎯</div>
//                 <div className="ai-card-content">
//                   <h4>Performance Assessment</h4>
//                   <p>{analysis.performance}</p>
//                 </div>
//               </div>

//               <div className="ai-card">
//                 <div className="ai-card-icon">📋</div>
//                 <div className="ai-card-content">
//                   <h4>AI Recommendations</h4>
//                   <ul>{analysis.recommendations.map((r, i) => <li key={i}>✓ {r}</li>)}</ul>
//                 </div>
//               </div>

//               <div className="ai-card">
//                 <div className="ai-card-icon">🚀</div>
//                 <div className="ai-card-content">
//                   <h4>Next Steps</h4>
//                   <ul>{analysis.nextSteps.map((s, i) => <li key={i}>→ {s}</li>)}</ul>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Timeline History Component
// const TimelineHistory: React.FC<{ history: ProjectHistory[] }> = ({ history }) => {
//   const sortedHistory = [...history].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
//   return (
//     <div className="timeline-container">
//       {sortedHistory.map((entry, idx) => (
//         <div key={entry.statusId} className={`timeline-item ${idx === 0 ? 'latest' : ''}`}>
//           <div className="timeline-dot"></div>
//           <div className="timeline-content">
//             <div className="timeline-header">
//               <span className="timeline-status">{getStatusBadge(entry.status)}</span>
//               <span className="timeline-date">{new Date(entry.dateTime).toLocaleString()}</span>
//             </div>
//             <div className="timeline-body">
//               <div className="timeline-actor"><span>👤</span> {entry.handledByName}</div>
//               {entry.managerNote && <div className="timeline-note"><span>📝</span> {entry.managerNote}</div>}
//               {entry.directorNote && <div className="timeline-note director"><span>👔</span> Director: {entry.directorNote}</div>}
//               {entry.assignedToName && <div className="timeline-assigned"><span>👥</span> Assigned to: {entry.assignedToName}</div>}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// // ============================================
// // MAIN MANAGER COMPONENT
// // ============================================

// const Manager: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('dashboard');
//   const [loading, setLoading] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [myDetails, setMyDetails] = useState<MyDetails | null>(null);
//   const [isManager, setIsManager] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const { logout } = useAuth();

//   // Data states
//   const [myProjects, setMyProjects] = useState<Project[]>([]);
//   const [consultantRequests, setConsultantRequests] = useState<ConsultantRequest[]>([]);
//   const [consultants, setConsultants] = useState<ConsultantWithRating[]>([]);
//   const [myTeams, setMyTeams] = useState<Team[]>([]);
//   const [myCreatedTasks, setMyCreatedTasks] = useState<Task[]>([]);
//   const [employeeTasks, setEmployeeTasks] = useState<EmployeeTask[]>([]);
//   const [myUploads, setMyUploads] = useState<FileItem[]>([]);
//   const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);

//   const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
//   // Modal states
//   const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
//   const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);
//   const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
//   const [showEditTaskModal, setShowEditTaskModal] = useState(false);
//   const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
//   const [showRateConsultantModal, setShowRateConsultantModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showEmployeeTaskModal, setShowEmployeeTaskModal] = useState(false);
//   const [showAISuggestModal, setShowAISuggestModal] = useState(false);
//   const [showAIAnalysisModal, setShowAIAnalysisModal] = useState(false);
//   const [selectedConsultantForAI, setSelectedConsultantForAI] = useState<ConsultantWithRating | null>(null);

//   // Selected items
//   const [selectedProjectFiles, setSelectedProjectFiles] = useState<FileItem[]>([]);
//   const [selectedProjectHistory, setSelectedProjectHistory] = useState<ProjectHistory[]>([]);
//   const [selectedProjectTeams, setSelectedProjectTeams] = useState<Team[]>([]);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [selectedConsultant, setSelectedConsultant] = useState<ConsultantWithRating | null>(null);
//   const [selectedEmployeeTask, setSelectedEmployeeTask] = useState<EmployeeTask | null>(null);

//   // Form states
//   const [updateProjectData, setUpdateProjectData] = useState({ status: '', note: '' });
//   const [createTaskData, setCreateTaskData] = useState({ projectId: 0, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
//   const [editTaskData, setEditTaskData] = useState({ taskDetails: '', description: '', managerNote: '', taskStatus: '' });
//   const [createTeamData, setCreateTeamData] = useState({ projectId: 0, teamName: '', memberIds: [] as number[], memberRoles: [] as string[] });
//   const [rateConsultantData, setRateConsultantData] = useState({ rating: 0, feedback: '' });
//   const [uploadFileData, setUploadFileData] = useState({ file: null as File | null, fileType: '', projectId: 0 });
//   const [employeeTaskNote, setEmployeeTaskNote] = useState('');
//   const [employeeTaskStatus, setEmployeeTaskStatus] = useState('');
//   const [aiSuggestData, setAiSuggestData] = useState({ taskName: '', taskDescription: '', projectId: 0 });
//   const [aiSuggestResult, setAiSuggestResult] = useState('');
//   const [emailData, setEmailData] = useState({ userIds: [] as number[], subject: '', message: '', messageType: 'INFORMATION' });

//   const [taskFilter, setTaskFilter] = useState('all');
//   const [projectSearch, setProjectSearch] = useState('');

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.setAttribute('data-theme', 'dark');
//     }
//     loadInitialData();
//   }, []);

//   const loadInitialData = async () => {
//     setLoading(true);
//     try {
//       const [profileRes, detailsRes, managerCheckRes] = await Promise.all([
//         getUserProfile().catch(() => ({ data: null })),
//         getMyDetails().catch(() => ({ data: null })),
//         checkIsManager().catch(() => ({ data: false })),
//       ]);

//       setUser(profileRes.data);
//       setMyDetails(detailsRes.data);
//       setIsManager(managerCheckRes.data || false);

//       if (managerCheckRes.data) {
//         await loadAllData();
//       }
//     } catch (error) {
//       console.error('Error loading initial data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAllData = async () => {
//     try {
//       const [projectsRes, requestsRes, consultantsRes, teamsRes, tasksRes, empTasksRes, uploadsRes, emailRes] = await Promise.all([
//         getMyAssignedProjects().catch(() => ({ data: [] })),
//         getConsultantRequests().catch(() => ({ data: [] })),
//         getMyDepartmentConsultants().catch(() => ({ data: [] })),
//         getMyTeams().catch(() => ({ data: [] })),
//         getMyCreatedTasks().catch(() => ({ data: [] })),
//         getEmployeeTasks().catch(() => ({ data: [] })),
//         getMyUploads().catch(() => ({ data: [] })),
//         getEmailRecipients().catch(() => ({ data: [] })),
//       ]);

//       setMyProjects(projectsRes.data);
//       setConsultantRequests(requestsRes.data);
//       setConsultants(consultantsRes.data);
//       setMyTeams(teamsRes.data);
//       setMyCreatedTasks(tasksRes.data);
//       setEmployeeTasks(empTasksRes.data);
//       setMyUploads(uploadsRes.data);
//       setEmailRecipients(emailRes.data);
      
//       if (projectsRes.data.length > 0 && selectedProjectId === 0) {
//         setSelectedProjectId(projectsRes.data[0].projectId);
//         setSelectedProject(projectsRes.data[0]);
//       }
//     } catch (error) {
//       console.error('Error loading data:', error);
//     }
//   };

//   const handleProjectChange = async (projectId: number) => {
//     setSelectedProjectId(projectId);
//     const project = myProjects.find(p => p.projectId === projectId);
//     setSelectedProject(project || null);
    
//     if (projectId) {
//       try {
//         const [teamsRes] = await Promise.all([
//           getProjectTeams(projectId).catch(() => ({ data: [] })),
//         ]);
//         setSelectedProjectTeams(teamsRes.data);
//       } catch (error) {
//         console.error('Error loading project data:', error);
//       }
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

//   const getFormattedDateTime = () => {
//     const now = new Date();
//     return now.toISOString().slice(0, 16);
//   };

//   const handleUpdateProjectStatus = async () => {
//     if (!selectedProject || !updateProjectData.status) return;
//     await updateProjectStatus(selectedProject.projectId, updateProjectData.status, updateProjectData.note);
//     await loadAllData();
//     setShowUpdateProjectModal(false);
//     setUpdateProjectData({ status: '', note: '' });
//     alert('Project status updated');
//   };

//   const handleCreateTask = async () => {
//     if (!createTaskData.projectId || !createTaskData.assignedToUserId || !createTaskData.taskDetails || !createTaskData.deadline) {
//       alert('Please fill all required fields');
//       return;
//     }
//     await createTask(createTaskData);
//     await loadAllData();
//     setShowCreateTaskModal(false);
//     setCreateTaskData({ projectId: selectedProjectId, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
//     alert('Task created successfully');
//   };

//   const handleUpdateTask = async () => {
//     if (!selectedTask) return;
//     await updateTask(selectedTask.taskId, editTaskData);
//     await loadAllData();
//     setShowEditTaskModal(false);
//     setSelectedTask(null);
//     alert('Task updated');
//   };

//   const handleDeleteTask = async (taskId: number) => {
//     if (confirm('Delete this task?')) {
//       await deleteTask(taskId);
//       await loadAllData();
//       alert('Task deleted');
//     }
//   };

//   const handleCreateTeam = async () => {
//     if (!createTeamData.projectId || !createTeamData.teamName || createTeamData.memberIds.length === 0) {
//       alert('Please fill all fields and select at least one consultant');
//       return;
//     }
//     const roles = createTeamData.memberRoles;
//     while (roles.length < createTeamData.memberIds.length) roles.push('Member');
    
//     await createTeam({
//       projectId: createTeamData.projectId,
//       teamName: createTeamData.teamName,
//       memberIds: createTeamData.memberIds,
//       memberRoles: roles.slice(0, createTeamData.memberIds.length),
//     });
//     await loadAllData();
//     setShowCreateTeamModal(false);
//     setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] });
//     alert('Team created successfully');
//   };

//   const handleRateConsultant = async () => {
//     if (!selectedConsultant) return;
//     if (!rateConsultantData.rating || rateConsultantData.rating < 1 || rateConsultantData.rating > 5) {
//       alert('Please provide rating 1-5');
//       return;
//     }
//     await rateConsultant({ userId: selectedConsultant.userId, rating: rateConsultantData.rating, feedback: rateConsultantData.feedback });
//     await loadAllData();
//     setShowRateConsultantModal(false);
//     setSelectedConsultant(null);
//     setRateConsultantData({ rating: 0, feedback: '' });
//     alert('Rating submitted');
//   };

//   const handleUpdateEmployeeTask = async () => {
//     if (!selectedEmployeeTask) return;
//     await updateEmployeeTaskStatus(selectedEmployeeTask.taskId, employeeTaskStatus, employeeTaskNote);
//     await loadAllData();
//     setShowEmployeeTaskModal(false);
//     setSelectedEmployeeTask(null);
//     setEmployeeTaskNote('');
//     setEmployeeTaskStatus('');
//     alert('Task status updated');
//   };

//   const handleCompleteEmployeeTask = async () => {
//     if (!selectedEmployeeTask) return;
//     await completeEmployeeTask(selectedEmployeeTask.taskId, employeeTaskNote);
//     await loadAllData();
//     setShowEmployeeTaskModal(false);
//     setSelectedEmployeeTask(null);
//     setEmployeeTaskNote('');
//     alert('Task completed');
//   };

//   const handleAISuggest = async () => {
//     if (!aiSuggestData.taskName || !aiSuggestData.taskDescription || !aiSuggestData.projectId) {
//       alert('Please fill all fields');
//       return;
//     }
//     const res = await getAISuggestConsultant(aiSuggestData);
//     setAiSuggestResult(res.data);
//   };

//   const handleSendEmail = async () => {
//     if (emailData.userIds.length === 0 || !emailData.subject || !emailData.message) {
//       alert('Please select recipients, enter subject and message');
//       return;
//     }
//     await sendEmail(emailData);
//     setShowEmailModal(false);
//     setEmailData({ userIds: [], subject: '', message: '', messageType: 'INFORMATION' });
//     alert('Email sent successfully');
//   };

//   const handleUploadFile = async () => {
//     if (!uploadFileData.projectId || !uploadFileData.file || !uploadFileData.fileType) {
//       alert('Please select project, file and file type');
//       return;
//     }
//     await uploadFile(uploadFileData.projectId, uploadFileData.file, uploadFileData.fileType);
//     if (selectedProject && selectedProject.projectId === uploadFileData.projectId) {
//       const filesRes = await getProjectFiles(uploadFileData.projectId);
//       setSelectedProjectFiles(filesRes.data);
//     }
//     const uploadsRes = await getMyUploads();
//     setMyUploads(uploadsRes.data);
//     setUploadFileData({ file: null, fileType: '', projectId: 0 });
//     alert('File uploaded');
//   };

//   const handleDeleteFile = async (fileId: number) => {
//     if (confirm('Delete this file?')) {
//       await deleteFile(fileId);
//       if (selectedProject) {
//         const filesRes = await getProjectFiles(selectedProject.projectId);
//         setSelectedProjectFiles(filesRes.data);
//       }
//       const uploadsRes = await getMyUploads();
//       setMyUploads(uploadsRes.data);
//       alert('File deleted');
//     }
//   };

//   const handleViewProject = async (projectId: number) => {
//     const [projectRes, historyRes, teamsRes, filesRes] = await Promise.all([
//       getProjectById(projectId),
//       getProjectHistory(projectId).catch(() => ({ data: [] })),
//       getProjectTeams(projectId).catch(() => ({ data: [] })),
//       getProjectFiles(projectId).catch(() => ({ data: [] })),
//     ]);
//     setSelectedProject(projectRes.data);
//     setSelectedProjectHistory(historyRes.data);
//     setSelectedProjectTeams(teamsRes.data);
//     setSelectedProjectFiles(filesRes.data);
//     setShowProjectDetailModal(true);
//   };

//   const handleViewFile = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) {
//         window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
//       } else {
//         alert('Cannot view file');
//       }
//     } catch { alert('Cannot view file'); }
//   };

//   const handleDownloadFile = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) {
//         window.open(`${API_BASE}${tokenRes.data.downloadUrl}`, '_blank');
//       } else {
//         alert('Cannot download');
//       }
//     } catch { alert('Download failed'); }
//   };

//   const handleUpdateProfile = async (data: any) => {
//     await updateUserProfile(data);
//     const profileRes = await getUserProfile();
//     setUser(profileRes.data);
//     setShowProfileModal(false);
//     alert('Profile updated');
//   };

//   const handleDeleteAccount = async () => {
//     if (confirm('Delete account permanently?')) {
//       await deleteAccount();
//       await logout();
//       window.location.href = '/';
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     window.location.href = '/';
//   };

//   const filteredProjects = myProjects.filter(p => p.projectName.toLowerCase().includes(projectSearch.toLowerCase()));
//   const filteredTasks = myCreatedTasks.filter(t => {
//     if (taskFilter === 'pending') return t.taskStatus === 'PENDING';
//     if (taskFilter === 'in_progress') return t.taskStatus === 'IN_PROGRESS';
//     if (taskFilter === 'completed') return t.taskStatus === 'COMPLETED';
//     return true;
//   });

//   const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

//   if (loading) return <ShimmerLoader />;

//   if (!isManager) {
//     return (
//       <div className="client-container">
//         <CommonSidebar activeNav={activeNav} setActiveNav={setActiveNav} onLogout={handleLogout} onThemeToggle={toggleDarkMode} darkMode={darkMode} user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null} menuItems={[]} title="Access Denied" logoIcon="🚫" isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
//         <main className="client-main"><div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}><h2>Access Denied</h2><p>Manager permissions required.</p></div></main>
//       </div>
//     );
//   }

//   return (
//     <div className="client-container">
//       <CommonSidebar activeNav={activeNav} setActiveNav={setActiveNav} onLogout={handleLogout} onThemeToggle={toggleDarkMode} darkMode={darkMode} user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null} menuItems={menuItems} title="Manager Portal" logoIcon="👔" isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
//       <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>☰</button>

//       <main className="client-main">
//         <header className="client-header">
//           <div className="header-welcome"><h1>Welcome, {user?.name?.split(' ')[0] || 'Manager'}!</h1><p>Manager Dashboard - Full Control Panel</p></div>
//           <div className="header-stats">
//             <div className="header-stat-item"><span className="stat-label">Projects</span><span className="stat-value-sm">{myProjects.length}</span></div>
//             <div className="header-stat-item"><span className="stat-label">Teams</span><span className="stat-value-sm">{myTeams.length}</span></div>
//             <div className="header-stat-item"><span className="stat-label">Active Tasks</span><span className="stat-value-sm">{myCreatedTasks.filter(t => t.taskStatus !== 'COMPLETED').length}</span></div>
//           </div>
//         </header>

//         {/* PROJECT SELECTION BAR */}
//         <div className="project-selector-bar">
//           <div className="project-selector-left">
//             <label>📁 Select Project:</label>
//             <div className="project-search-wrapper">
//               <input type="text" placeholder="Search projects..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} className="project-search-input" />
//               <select value={selectedProjectId} onChange={(e) => handleProjectChange(parseInt(e.target.value))} className="project-select">
//                 <option value="0">-- Select a Project --</option>
//                 {filteredProjects.map(p => (
//                   <option key={p.projectId} value={p.projectId}>{p.projectName} - {p.status}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="project-selector-actions">
//             {selectedProject && (
//               <>
//                 <LoadingButton className="action-btn primary" onClick={async () => { setUpdateProjectData({ status: selectedProject.status, note: '' }); setShowUpdateProjectModal(true); }}>📝 Update Status</LoadingButton>
//                 <LoadingButton className="action-btn success" onClick={async () => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId, assignedToUserId: 0 }); setShowCreateTaskModal(true); }}>➕ Create Task</LoadingButton>
//                 <LoadingButton className="action-btn info" onClick={async () => { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] }); setShowCreateTeamModal(true); }}>👥 Create Team</LoadingButton>
//                 <LoadingButton className="action-btn outline" onClick={async () => handleViewProject(selectedProjectId)}>📋 View Details</LoadingButton>
//               </>
//             )}
//           </div>
//         </div>

//         {/* DASHBOARD */}
//         {activeNav === 'dashboard' && (
//           <>
//             <div className="stats-grid">
//               <div className="stat-card"><div className="stat-icon blue">📁</div><div className="stat-info"><span className="stat-value">{myProjects.length}</span><span className="stat-label">Projects</span></div></div>
//               <div className="stat-card"><div className="stat-icon green">👥</div><div className="stat-info"><span className="stat-value">{myTeams.length}</span><span className="stat-label">Teams</span></div></div>
//               <div className="stat-card"><div className="stat-icon orange">📨</div><div className="stat-info"><span className="stat-value">{consultantRequests.length}</span><span className="stat-label">Requests</span></div></div>
//               <div className="stat-card"><div className="stat-icon purple">✅</div><div className="stat-info"><span className="stat-value">{myCreatedTasks.length}</span><span className="stat-label">Tasks</span></div></div>
//             </div>
            
//             {selectedProject && (
//               <div className="dashboard-card">
//                 <div className="card-header"><h2>Current Project: {selectedProject.projectName}</h2>{getStatusBadge(selectedProject.status)}</div>
//                 <p className="project-card-desc">{selectedProject.projectDescription}</p>
//                 <div className="project-card-meta"><span>🏢 {selectedProject.departmentName}</span><span>👤 {selectedProject.clientName}</span><span>📅 Due: {formatDate(selectedProject.deadline)}</span></div>
//               </div>
//             )}

//             <div className="dashboard-card"><div className="card-header"><h2>Recent Tasks</h2><button className="view-all-link" onClick={() => setActiveNav('my-tasks')}>View All →</button></div><div className="projects-grid">{myCreatedTasks.slice(0, 3).map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.taskDetails}</h3>{getStatusBadge(t.taskStatus)}</div><p className="project-card-desc">{t.description?.substring(0, 60)}</p><div className="project-card-meta"><span>📁 {t.projectName}</span><span>👤 {t.assignedToUserName}</span><span>📅 Due: {formatDate(t.deadline)}</span></div></div>))}</div></div>

//             <div className="dashboard-card"><div className="card-header"><h2>Assigned to Me</h2><button className="view-all-link" onClick={() => setActiveNav('assigned-tasks')}>View All →</button></div><div className="projects-grid">{employeeTasks.slice(0, 3).map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.description?.substring(0, 40)}</h3>{getStatusBadge(t.status)}</div><div className="project-card-meta"><span>🔥 {t.priority}</span><span>📅 Due: {formatDate(t.deadline)}</span><span>👤 By: {t.createdByName}</span></div><button className="btn-sm btn-primary" onClick={() => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); }}>Update</button></div>))}</div></div>
//           </>
//         )}

//         {/* MY PROJECTS */}
//         {activeNav === 'my-projects' && (
//           <div className="dashboard-card full-width"><h2>My Projects</h2><div className="projects-grid">{myProjects.map(p => (<div key={p.projectId} className="project-card"><div className="project-card-header"><h3>{p.projectName}</h3>{getStatusBadge(p.status)}</div><p className="project-card-desc">{p.projectDescription?.substring(0, 80)}</p><div className="project-card-meta"><span>📅 Deadline: {formatDate(p.deadline)}</span><span>🏢 {p.departmentName}</span><span>👤 {p.clientName}</span></div><div className="project-card-actions"><LoadingButton className="btn-sm btn-primary" onClick={async () => handleViewProject(p.projectId)}>Details</LoadingButton><LoadingButton className="btn-sm btn-outline" onClick={async () => { setSelectedProject(p); setUpdateProjectData({ status: p.status, note: '' }); setShowUpdateProjectModal(true); }}>Update Status</LoadingButton><LoadingButton className="btn-sm btn-outline" onClick={async () => { setCreateTaskData({ ...createTaskData, projectId: p.projectId, assignedToUserId: 0 }); setShowCreateTaskModal(true); }}>Create Task</LoadingButton></div></div>))}</div></div>
//         )}

//         {/* CONSULTANT REQUESTS */}
//         {activeNav === 'consultant-requests' && (
//           <div className="dashboard-card full-width"><h2>Consultant Join Requests</h2><div className="projects-grid">{consultantRequests.map(r => (<div key={r.requestId} className="project-card"><div className="project-card-header"><h3>{r.consultantName}</h3><span className="status-badge status-pending">⏳ Requested</span></div><div className="project-card-meta"><span>📁 {r.projectName}</span><span>⭐ {r.averageRating.toFixed(1)}/5</span><span>💼 {r.experience}</span></div><p className="project-card-desc"><strong>Skills:</strong> {r.skill}</p><div className="project-card-actions"><LoadingButton className="btn-sm btn-primary" onClick={async () => { setCreateTeamData({ projectId: r.projectId, teamName: `${r.projectName} Team`, memberIds: [r.consultantId], memberRoles: ['Consultant'] }); setShowCreateTeamModal(true); }}>Add to Team</LoadingButton><button className="btn-sm btn-outline" onClick={() => window.open(r.resumeLink, '_blank')}>Resume</button></div></div>))}</div></div>
//         )}

//         {/* CONSULTANTS */}
//         {activeNav === 'consultants' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Department Consultants with Ratings</h2></div><div className="emp-grid">{consultants.map(c => (<div key={c.consultantId} className="emp-card"><div className="emp-header"><div className="emp-avatar verified">{c.photoUrl ? <img src={c.photoUrl} alt={c.name} className="avatar-img" /> : c.name.charAt(0)}</div><div><h3>{c.name}</h3><div className="dept-badge">{c.skill?.substring(0, 40)}</div></div></div><div className="emp-body"><div className="emp-row"><span>📧 Email:</span><span>{c.email}</span></div><div className="emp-row"><span>💼 Experience:</span><span>{c.experience}</span></div><div className="emp-row"><span>⭐ Rating:</span><span>{c.averageRating.toFixed(1)}/5 ({c.totalReviews} reviews)</span></div></div><div className="emp-footer"><LoadingButton className="btn-sm" onClick={async () => { setSelectedConsultant(c); setRateConsultantData({ rating: 0, feedback: '' }); setShowRateConsultantModal(true); }}>Rate</LoadingButton><LoadingButton className="btn-sm btn-outline" onClick={async () => { if (selectedProjectId) { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [c.userId], memberRoles: ['Member'] }); setShowCreateTeamModal(true); } else { alert('Please select a project first'); } }}>Add to Team</LoadingButton><button className="btn-sm btn-ai" onClick={() => { setSelectedConsultantForAI(c); setShowAIAnalysisModal(true); }}>🤖 AI Analyze</button></div></div>))}</div></div>
//         )}

//         {/* MY TEAMS */}
//         {activeNav === 'my-teams' && (
//           <div className="dashboard-card full-width"><h2>My Teams</h2><div className="projects-grid">{myTeams.map(team => (<div key={team.teamId} className="project-card"><div className="project-card-header"><h3>{team.teamName}</h3><span className="status-badge status-approved">Active</span></div><div className="project-card-meta"><span>📁 {team.projectName}</span><span>👥 {team.members.length} members</span></div><div className="team-members"><h4>Members:</h4>{team.members.slice(0, 3).map((m, i) => (<div key={i} className="team-member"><div className="member-avatar">{m.memberName.charAt(0)}</div><div><div className="member-name">{m.memberName}</div><div className="member-role">{m.role}</div></div></div>))}{team.members.length > 3 && <small>+{team.members.length - 3} more</small>}</div><div className="project-card-actions"><LoadingButton className="btn-sm btn-danger" onClick={async () => { await deleteTeam(team.teamId); await loadAllData(); }}>Delete</LoadingButton></div></div>))}</div></div>
//         )}

//         {/* MY CREATED TASKS */}
//         {activeNav === 'my-tasks' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Tasks Created by Me</h2><div className="header-filters"><select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}><option value="all">All</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select><LoadingButton className="btn-primary" onClick={async () => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId, assignedToUserId: 0 }); setShowCreateTaskModal(true); }}>+ Create Task</LoadingButton></div></div><div className="projects-grid">{filteredTasks.map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.taskDetails}</h3>{getStatusBadge(t.taskStatus)}</div><p className="project-card-desc">{t.description?.substring(0, 80)}</p><div className="project-card-meta"><span>📁 {t.projectName}</span><span>👤 {t.assignedToUserName}</span><span>📅 Due: {formatDate(t.deadline)}</span></div><div className="project-card-actions"><LoadingButton className="btn-sm btn-outline" onClick={async () => { setSelectedTask(t); setEditTaskData({ taskDetails: t.taskDetails, description: t.description || '', managerNote: t.managerNote || '', taskStatus: t.taskStatus }); setShowEditTaskModal(true); }}>Edit</LoadingButton><LoadingButton className="btn-sm btn-danger" onClick={async () => handleDeleteTask(t.taskId)}>Delete</LoadingButton></div></div>))}</div></div>
//         )}

//         {/* ASSIGNED TO ME */}
//         {activeNav === 'assigned-tasks' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Tasks Assigned to Me</h2></div><div className="projects-grid">{employeeTasks.map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.description?.substring(0, 50)}</h3>{getStatusBadge(t.status)}</div><div className="project-card-meta"><span>🔥 Priority: {t.priority}</span><span>📅 Deadline: {formatDate(t.deadline)}</span><span>👤 By: {t.createdByName}</span></div><LoadingButton className="btn-sm btn-primary" onClick={async () => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); }}>Update Status</LoadingButton></div>))}</div></div>
//         )}

//         {/* AI SUGGEST */}
//         {activeNav === 'ai-suggest' && (
//           <div className="dashboard-card full-width"><h2>AI Consultant Suggestion 🤖</h2><div className="task-form"><div className="form-group"><label>Project</label><select value={aiSuggestData.projectId} onChange={(e) => setAiSuggestData({ ...aiSuggestData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-group"><label>Task Name</label><input placeholder="Enter task name" value={aiSuggestData.taskName} onChange={(e) => setAiSuggestData({ ...aiSuggestData, taskName: e.target.value })} /></div><div className="form-group"><label>Task Description</label><textarea rows={4} placeholder="Describe the task..." value={aiSuggestData.taskDescription} onChange={(e) => setAiSuggestData({ ...aiSuggestData, taskDescription: e.target.value })} /></div><LoadingButton className="btn-primary" onClick={handleAISuggest}>Get Suggestion</LoadingButton>{aiSuggestResult && <div className="ai-section" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface)', borderRadius: '12px' }}><strong>🤖 AI Recommendation:</strong><p style={{ marginTop: '0.5rem' }}>{aiSuggestResult}</p></div>}</div></div>
//         )}

//         {/* EMAIL CONSULTANTS */}
//         {activeNav === 'email' && (
//           <div className="dashboard-card full-width"><h2>Email Department Consultants</h2><div className="task-form"><div className="form-group"><label>Select Recipients</label><div className="emp-grid" style={{ maxHeight: '200px', overflow: 'auto' }}>{emailRecipients.map(r => (<label key={r.userId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderBottom: '1px solid var(--border)' }}><input type="checkbox" checked={emailData.userIds.includes(r.userId)} onChange={() => { const ids = emailData.userIds.includes(r.userId) ? emailData.userIds.filter(id => id !== r.userId) : [...emailData.userIds, r.userId]; setEmailData({ ...emailData, userIds: ids }); }} /><span><strong>{r.name}</strong> - {r.email}</span></label>))}</div></div><div className="form-group"><label>Subject</label><input placeholder="Email Subject" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} /></div><div className="form-group"><label>Message</label><textarea rows={5} placeholder="Type your message..." value={emailData.message} onChange={(e) => setEmailData({ ...emailData, message: e.target.value })} /></div><div className="form-group"><label>Message Type</label><select value={emailData.messageType} onChange={(e) => setEmailData({ ...emailData, messageType: e.target.value })}><option value="INFORMATION">📢 Information</option><option value="ALERT">⚠️ Alert</option><option value="TASK">✅ Task Assignment</option><option value="MEETING">📅 Meeting Invite</option></select></div><LoadingButton className="btn-primary" onClick={handleSendEmail}>Send Email</LoadingButton></div></div>
//         )}

//         {/* UPLOADS */}
//         {activeNav === 'uploads' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>My Uploads</h2></div><div className="upload-section"><select value={uploadFileData.projectId} onChange={(e) => setUploadFileData({ ...uploadFileData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select><input type="file" onChange={(e) => setUploadFileData({ ...uploadFileData, file: e.target.files?.[0] || null })} /><select value={uploadFileData.fileType} onChange={(e) => setUploadFileData({ ...uploadFileData, fileType: e.target.value })}><option value="">Type</option><option value="Document">📄 Document</option><option value="Code">💻 Code</option><option value="Image">🖼️ Image</option><option value="PDF">📕 PDF</option><option value="Report">📊 Report</option></select><LoadingButton className="btn-primary" onClick={handleUploadFile}>Upload</LoadingButton></div><div className="uploads-list">{myUploads.map(f => (<div key={f.fileId} className="file-item"><div className="file-icon">📄</div><div className="file-info"><div className="file-name">{f.fileLink?.split('/').pop()}</div><div className="file-meta"><span>{f.fileType}</span><span>📁 {f.projectName}</span><span>📅 {formatDate(f.uploadTime)}</span></div></div><div className="file-actions"><button className="btn-icon" onClick={() => handleViewFile(f.fileId)}>View</button><button className="btn-icon" onClick={() => handleDownloadFile(f.fileId)}>Download</button><LoadingButton className="btn-icon danger" onClick={async () => handleDeleteFile(f.fileId)}>Delete</LoadingButton></div></div>))}</div></div>
//         )}

//         {/* PROFILE */}
//         {activeNav === 'profile' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Profile</h2><button className="btn-outline" onClick={() => setShowProfileModal(true)}>Edit</button></div><div className="profile-info"><div className="profile-avatar-large"><div className="avatar-placeholder">{user?.name?.charAt(0)}</div></div><div className="profile-details"><div className="detail-item"><label>Name</label><span>{user?.name}</span></div><div className="detail-item"><label>Email</label><span>{user?.email}</span></div><div className="detail-item"><label>Role</label><span>Manager</span></div><div className="detail-item"><label>Department</label><span>{myDetails?.employee?.departmentName || 'N/A'}</span></div><div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not set'}</span></div><div className="detail-item"><label>Address</label><span>{user?.address || 'Not set'}</span></div></div></div><div className="setting-item danger"><div><div className="setting-label">Delete Account</div><div className="setting-desc">Permanently delete your account</div></div><LoadingButton className="btn-danger" onClick={handleDeleteAccount}>Delete</LoadingButton></div></div>
//         )}

//         <footer className="client-footer"><p>© 2026 Manager Portal | Softmax.in</p></footer>
//       </main>

//       {/* MODALS */}
//       {showUpdateProjectModal && selectedProject && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowUpdateProjectModal(false)}>✕</button><h2>Update Status - {selectedProject.projectName}</h2><div className="m-form"><select value={updateProjectData.status} onChange={(e) => setUpdateProjectData({ ...updateProjectData, status: e.target.value })}><option value="PENDING">Pending</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="REJECTED">Rejected</option></select><textarea placeholder="Note" value={updateProjectData.note} onChange={(e) => setUpdateProjectData({ ...updateProjectData, note: e.target.value })} rows={3} /><LoadingButton className="btn-msub" onClick={handleUpdateProjectStatus}>Update</LoadingButton></div></div></div>)}

//       {showCreateTaskModal && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowCreateTaskModal(false)}>✕</button><h2>Create Task</h2><div className="m-form"><div className="form-field"><label>Project</label><select value={createTaskData.projectId} onChange={(e) => setCreateTaskData({ ...createTaskData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-field"><label>Assign To Consultant</label><select value={createTaskData.assignedToUserId} onChange={(e) => setCreateTaskData({ ...createTaskData, assignedToUserId: parseInt(e.target.value) })}><option value="0">Select Consultant</option>{consultants.map(c => <option key={c.userId} value={c.userId}>{c.name} (⭐ {c.averageRating.toFixed(1)}) - {c.skill}</option>)}</select></div><div className="form-field"><label>Task Details</label><input placeholder="Task title" value={createTaskData.taskDetails} onChange={(e) => setCreateTaskData({ ...createTaskData, taskDetails: e.target.value })} /></div><div className="form-field"><label>Description</label><textarea placeholder="Description" value={createTaskData.description} onChange={(e) => setCreateTaskData({ ...createTaskData, description: e.target.value })} rows={3} /></div><div className="form-field"><label>Deadline (with time)</label><input type="datetime-local" value={createTaskData.deadline} onChange={(e) => setCreateTaskData({ ...createTaskData, deadline: e.target.value })} /></div><LoadingButton className="btn-msub" onClick={handleCreateTask}>Create Task</LoadingButton></div></div></div>)}

//       {showEditTaskModal && selectedTask && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowEditTaskModal(false)}>✕</button><h2>Edit Task</h2><div className="m-form"><input value={editTaskData.taskDetails} onChange={(e) => setEditTaskData({ ...editTaskData, taskDetails: e.target.value })} /><textarea value={editTaskData.description} onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })} rows={3} /><textarea placeholder="Manager Note" value={editTaskData.managerNote} onChange={(e) => setEditTaskData({ ...editTaskData, managerNote: e.target.value })} rows={2} /><select value={editTaskData.taskStatus} onChange={(e) => setEditTaskData({ ...editTaskData, taskStatus: e.target.value })}><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><LoadingButton className="btn-msub" onClick={handleUpdateTask}>Save</LoadingButton></div></div></div>)}

//       {showCreateTeamModal && (<div className="modal-mask open"><div className="modal-box large"><button className="m-close" onClick={() => setShowCreateTeamModal(false)}>✕</button><h2>Create Team</h2><div className="m-form"><div className="form-field"><label>Project</label><select value={createTeamData.projectId} onChange={(e) => setCreateTeamData({ ...createTeamData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-field"><label>Team Name</label><input placeholder="Team Name" value={createTeamData.teamName} onChange={(e) => setCreateTeamData({ ...createTeamData, teamName: e.target.value })} /></div><div className="form-field"><label>Select Consultants</label><div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem' }}>{consultants.map(c => (<label key={c.consultantId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}><input type="checkbox" checked={createTeamData.memberIds.includes(c.userId)} onChange={() => { const ids = createTeamData.memberIds.includes(c.userId) ? createTeamData.memberIds.filter(id => id !== c.userId) : [...createTeamData.memberIds, c.userId]; setCreateTeamData({ ...createTeamData, memberIds: ids }); }} /><span><strong>{c.name}</strong> - {c.skill} (⭐ {c.averageRating.toFixed(1)})</span></label>))}</div></div><LoadingButton className="btn-msub" onClick={handleCreateTeam}>Create Team</LoadingButton></div></div></div>)}

//       {showRateConsultantModal && selectedConsultant && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowRateConsultantModal(false)}>✕</button><h2>Rate {selectedConsultant.name}</h2><div className="m-form"><select value={rateConsultantData.rating} onChange={(e) => setRateConsultantData({ ...rateConsultantData, rating: parseFloat(e.target.value) })}><option value="0">Select Rating</option><option value="1">⭐ 1 - Poor</option><option value="2">⭐⭐ 2 - Fair</option><option value="3">⭐⭐⭐ 3 - Good</option><option value="4">⭐⭐⭐⭐ 4 - Very Good</option><option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option></select><textarea placeholder="Feedback" value={rateConsultantData.feedback} onChange={(e) => setRateConsultantData({ ...rateConsultantData, feedback: e.target.value })} rows={3} /><LoadingButton className="btn-msub" onClick={handleRateConsultant}>Submit Rating</LoadingButton></div></div></div>)}

//       {showEmployeeTaskModal && selectedEmployeeTask && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowEmployeeTaskModal(false)}>✕</button><h2>Update Task</h2><p><strong>{selectedEmployeeTask.description}</strong></p><p>Priority: {selectedEmployeeTask.priority} | Current: {selectedEmployeeTask.status}</p><select value={employeeTaskStatus} onChange={(e) => setEmployeeTaskStatus(e.target.value)}><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><textarea placeholder="Add note..." value={employeeTaskNote} onChange={(e) => setEmployeeTaskNote(e.target.value)} rows={3} /><div className="modal-actions"><LoadingButton className="btn-primary" onClick={handleUpdateEmployeeTask}>Update Status</LoadingButton><LoadingButton className="btn-success" onClick={handleCompleteEmployeeTask}>Complete Task</LoadingButton></div></div></div>)}

//       {showProjectDetailModal && selectedProject && (<div className="modal-mask open"><div className="modal-box large"><button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button><h2>{selectedProject.projectName}</h2><div className="m-tabs"><button className="m-tab active" onClick={() => { document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none'); document.getElementById('overview-tab')!.style.display = 'block'; }}>Overview</button><button className="m-tab" onClick={() => { document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none'); document.getElementById('teams-tab')!.style.display = 'block'; }}>Teams</button><button className="m-tab" onClick={() => { document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none'); document.getElementById('files-tab')!.style.display = 'block'; }}>Files</button><button className="m-tab" onClick={() => { document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none'); document.getElementById('history-tab')!.style.display = 'block'; }}>History</button></div>
//       <div id="overview-tab" className="m-tab-content"><div><label>Status:</label>{getStatusBadge(selectedProject.status)}</div><div><label>Description:</label><p>{selectedProject.projectDescription}</p></div><div className="detail-grid"><div><label>Type:</label>{selectedProject.projectType}</div><div><label>Client:</label>{selectedProject.clientName}</div><div><label>Department:</label>{selectedProject.departmentName}</div><div><label>Deadline:</label>{formatDate(selectedProject.deadline)}</div></div></div>
//       <div id="teams-tab" className="m-tab-content" style={{ display: 'none' }}>{selectedProjectTeams.length === 0 ? <p className="empty-state">No teams created for this project yet.</p> : selectedProjectTeams.map(team => (<div key={team.teamId} className="team-detail-card"><div className="team-detail-header"><h3>{team.teamName}</h3><span className="team-detail-manager">👔 Manager: {team.managerName}</span></div><div className="team-detail-members"><h4>Team Members ({team.members.length})</h4>{team.members.map((m, i) => (<div key={i} className="team-member-detail"><div className="member-avatar-detail">{m.memberName.charAt(0)}</div><div><div className="member-name-detail">{m.memberName}</div><div className="member-role-detail">{m.role}</div><div className="member-email-detail">{m.memberEmail}</div></div></div>))}</div></div>))}</div>
//       <div id="files-tab" className="m-tab-content" style={{ display: 'none' }}><div className="upload-section"><input type="file" onChange={(e) => setUploadFileData({ ...uploadFileData, file: e.target.files?.[0] || null, projectId: selectedProject.projectId })} /><select value={uploadFileData.fileType} onChange={(e) => setUploadFileData({ ...uploadFileData, fileType: e.target.value })}><option value="">Type</option><option value="Document">Document</option><option value="Code">Code</option><option value="Image">Image</option><option value="PDF">PDF</option></select><LoadingButton className="btn-primary" onClick={handleUploadFile}>Upload</LoadingButton></div><div className="folder-view"><div className="files-grid">{selectedProjectFiles.map(f => (<div key={f.fileId} className="folder-item" onClick={() => handleViewFile(f.fileId)}><div className="folder-icon">📄</div><div className="folder-name">{f.fileLink?.split('/').pop()?.substring(0, 25)}</div><div className="folder-meta"><span>{f.fileType}</span><span>{new Date(f.uploadTime).toLocaleDateString()}</span></div><button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleDownloadFile(f.fileId); }}>⬇️</button></div>))}</div></div></div>
//       <div id="history-tab" className="m-tab-content" style={{ display: 'none' }}><TimelineHistory history={selectedProjectHistory} /></div></div></div>)}

//       {showProfileModal && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowProfileModal(false)}>✕</button><h2>Edit Profile</h2><form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleUpdateProfile({ name: fd.get('name'), phoneNumber: fd.get('phoneNumber'), address: fd.get('address'), gender: fd.get('gender'), dob: fd.get('dob') }); }}><div className="m-form"><input name="name" defaultValue={user?.name} placeholder="Name" /><input name="phoneNumber" defaultValue={user?.phoneNumber} placeholder="Phone" /><input name="gender" defaultValue={user?.gender} placeholder="Gender" /><input name="dob" type="date" defaultValue={user?.dob} /><textarea name="address" rows={2} defaultValue={user?.address} placeholder="Address" /><button type="submit" className="btn-msub">Save</button></div></form></div></div>)}

//       {showAIAnalysisModal && selectedConsultantForAI && <AIAnalysisModal consultant={selectedConsultantForAI} onClose={() => setShowAIAnalysisModal(false)} />}

//       <style jsx>{`
//         .project-selector-bar { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
//         .project-selector-left { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
//         .project-selector-left label { font-weight: 600; color: var(--teal); }
//         .project-search-wrapper { display: flex; gap: 0.5rem; }
//         .project-search-input { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); width: 200px; }
//         .project-select { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); min-width: 250px; }
//         .project-selector-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
//         .action-btn { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.2s; border: none; }
//         .action-btn.primary { background: var(--teal); color: white; }
//         .action-btn.success { background: var(--green); color: white; }
//         .action-btn.info { background: var(--blue); color: white; }
//         .action-btn.outline { background: transparent; border: 1px solid var(--teal); color: var(--teal); }
//         .action-btn:hover:not(:disabled) { transform: translateY(-2px); }
//         .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
//         .emp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
//         .emp-card { background: var(--bg); border: 1px solid var(--border); border-radius: 18px; padding: 1.3rem; transition: all 0.3s ease; }
//         .emp-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); border-color: rgba(44, 166, 164, 0.3); }
//         .emp-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
//         .emp-avatar { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: rgba(44, 166, 164, 0.1); }
//         .emp-avatar.verified { background: rgba(52, 168, 83, 0.15); }
//         .avatar-img { width: 100%; height: 100%; border-radius: 14px; object-fit: cover; }
//         .emp-card h3 { font-size: 1rem; margin: 0 0 0.25rem; }
//         .dept-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; background: rgba(44, 166, 164, 0.12); color: var(--teal); }
//         .emp-body { margin-top: 0.75rem; }
//         .emp-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 0.8rem; }
//         .emp-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.5rem; }
//         .btn-ai { background: linear-gradient(135deg, #6c5ce7, #a463f5); color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 20px; cursor: pointer; font-size: 0.7rem; transition: all 0.3s; }
//         .btn-ai:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(108, 92, 231, 0.5); }
        
//         .header-filters { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
//         .form-field { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.75rem; }
//         .form-field label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--muted); }
//         .form-field input, .form-field select, .form-field textarea { padding: 0.6rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); }
        
//         .team-member { display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: var(--surface); border-radius: 10px; margin-bottom: 0.5rem; }
//         .member-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
        
//         .upload-section { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1rem; }
//         .uploads-list { display: flex; flex-direction: column; gap: 0.5rem; }
//         .file-item { display: flex; align-items: center; gap: 1rem; padding: 0.6rem; background: var(--surface); border-radius: 10px; }
//         .file-actions { display: flex; gap: 0.3rem; }
//         .btn-icon { padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); cursor: pointer; }
        
//         .timeline-container { display: flex; flex-direction: column; gap: 1rem; max-height: 500px; overflow-y: auto; padding: 0.5rem; }
//         .timeline-item { display: flex; gap: 1rem; position: relative; }
//         .timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--teal); margin-top: 0.5rem; flex-shrink: 0; }
//         .timeline-item.latest .timeline-dot { background: var(--green); box-shadow: 0 0 0 3px rgba(52, 168, 83, 0.2); animation: pulse 1.5s infinite; }
//         .timeline-content { flex: 1; background: var(--surface); border-radius: 12px; padding: 0.8rem; }
//         .timeline-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; }
//         .timeline-date { font-size: 0.7rem; color: var(--muted); }
//         .timeline-body { font-size: 0.8rem; }
//         .timeline-actor, .timeline-note, .timeline-assigned { display: flex; gap: 0.5rem; align-items: center; margin-top: 0.3rem; }
//         .timeline-note.director { color: var(--orange); }
        
//         .team-detail-card { background: var(--surface); border-radius: 16px; padding: 1rem; margin-bottom: 1rem; }
//         .team-detail-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 0.8rem; }
//         .team-detail-manager { font-size: 0.8rem; color: var(--teal); }
//         .team-detail-members h4 { font-size: 0.8rem; margin-bottom: 0.5rem; color: var(--muted); }
//         .team-member-detail { display: flex; align-items: center; gap: 0.8rem; padding: 0.5rem; background: var(--bg); border-radius: 10px; margin-bottom: 0.5rem; }
//         .member-avatar-detail { width: 36px; height: 36px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
//         .member-name-detail { font-weight: 600; font-size: 0.85rem; }
//         .member-role-detail { font-size: 0.7rem; color: var(--teal); }
//         .member-email-detail { font-size: 0.65rem; color: var(--muted); }
        
//         .files-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
//         .folder-item { width: 150px; padding: 0.8rem; background: var(--surface); border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
//         .folder-item:hover { transform: translateY(-4px); box-shadow: var(--shadow); background: var(--bg); }
//         .folder-icon { font-size: 2rem; margin-bottom: 0.3rem; }
//         .folder-name { font-size: 0.7rem; font-weight: 500; word-break: break-all; }
//         .folder-meta { font-size: 0.6rem; color: var(--muted); margin-top: 0.2rem; display: flex; justify-content: center; gap: 0.5rem; }
        
//         .shimmer-wrapper { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }
//         .shimmer-card { background: var(--surface); border-radius: 16px; padding: 1rem; }
//         .shimmer-line { background: linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; margin: 0.5rem 0; }
//         .shimmer-line-lg { height: 60px; width: 100%; }
//         .shimmer-line-md { height: 40px; width: 80%; }
//         .shimmer-line-sm { height: 20px; width: 60%; }
//         @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
//         @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(52, 168, 83, 0.4); } 50% { box-shadow: 0 0 0 6px rgba(52, 168, 83, 0); } }
        
//         .loading-spinner-small { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.6s linear infinite; }
//         @keyframes spin { to { transform: rotate(360deg); } }
        
//         .ai-modal-mask { z-index: 2000; }
//         .ai-analysis-modal-box { max-width: 600px; width: 90%; background: linear-gradient(135deg, var(--bg), var(--surface)); border: 1px solid rgba(108, 92, 231, 0.3); box-shadow: 0 0 40px rgba(108, 92, 231, 0.2); }
//         .ai-modal-content { animation: aiFadeIn 0.5s ease; }
//         .ai-header-glow { text-align: center; margin-bottom: 1.5rem; position: relative; }
//         .ai-icon-pulse { font-size: 3rem; animation: aiPulse 1s infinite; display: inline-block; }
//         .ai-header-glow h2 { background: linear-gradient(135deg, #6c5ce7, #a463f5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.5rem; }
//         .ai-badge-shine { display: inline-block; padding: 0.2rem 0.8rem; background: linear-gradient(135deg, #6c5ce7, #a463f5); border-radius: 20px; font-size: 0.7rem; color: white; margin-top: 0.5rem; animation: shine 2s infinite; }
//         .ai-consultant-info { display: flex; gap: 1rem; align-items: center; padding: 1rem; background: linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(164, 99, 245, 0.05)); border-radius: 16px; margin-bottom: 1rem; }
//         .ai-avatar { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #6c5ce7, #a463f5); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: white; }
//         .ai-rating { font-size: 0.8rem; color: #f59e0b; }
//         .ai-loading { text-align: center; padding: 2rem; }
//         .ai-wave { width: 50px; height: 50px; margin: 0 auto 1rem; background: linear-gradient(135deg, #6c5ce7, #a463f5); border-radius: 50%; animation: aiWave 1s ease-in-out infinite; }
//         .ai-results { display: flex; flex-direction: column; gap: 0.8rem; max-height: 400px; overflow-y: auto; }
//         .ai-card { display: flex; gap: 0.8rem; padding: 0.8rem; background: var(--bg); border-radius: 12px; border-left: 3px solid #6c5ce7; }
//         .ai-card-icon { font-size: 1.5rem; }
//         .ai-card-content h4 { font-size: 0.8rem; margin-bottom: 0.3rem; color: #6c5ce7; }
//         .ai-card-content p, .ai-card-content li { font-size: 0.75rem; color: var(--muted); line-height: 1.4; }
//         .ai-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.3rem; }
//         .ai-tag { padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.7rem; }
//         .ai-tag.strength { background: rgba(52, 168, 83, 0.15); color: var(--green); }
//         .ai-tag.weakness { background: rgba(231, 76, 60, 0.15); color: var(--red); }
//         .ai-card-content ul { margin: 0; padding-left: 1rem; }
//         @keyframes aiPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }
//         @keyframes aiWave { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); opacity: 0.5; } }
//         @keyframes shine { 0% { opacity: 0.6; } 50% { opacity: 1; box-shadow: 0 0 10px rgba(108, 92, 231, 0.5); } 100% { opacity: 0.6; } }
//         @keyframes aiFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
//         .btn-success { background: linear-gradient(135deg, #27ae60, #229954); color: white; border: none; padding: 0.5rem 1rem; border-radius: 40px; cursor: pointer; }
//         .btn-sm { padding: 0.3rem 0.8rem; font-size: 0.7rem; border-radius: 20px; }
//         .btn-outline { background: transparent; border: 1px solid var(--teal); color: var(--teal); }
//         .btn-primary { background: var(--teal); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
//         .btn-danger { background: var(--red); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
//         .btn-msub { padding: 0.6rem; border-radius: 40px; background: var(--teal); color: white; font-weight: 600; width: 100%; cursor: pointer; }
        
//         .m-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); }
//         .m-tab { padding: 0.5rem 1rem; background: transparent; border: none; cursor: pointer; color: var(--muted); }
//         .m-tab.active { color: var(--teal); border-bottom: 2px solid var(--teal); }
//         .m-tab-content { padding: 1rem 0; }
//         .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.8rem; margin-top: 1rem; }
        
//         @media (max-width: 768px) { .project-selector-bar { flex-direction: column; align-items: stretch; } .project-selector-left { flex-direction: column; align-items: stretch; } .project-search-wrapper { flex-direction: column; } .project-selector-actions { justify-content: center; } .emp-grid { grid-template-columns: 1fr; } }
//       `}</style>
//     </div>
//   );
// };

// export default Manager;











// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import CommonSidebar from './components/CommonSidebar';
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
//   emailVerified: boolean;
//   isProfileCompleted: boolean;
//   phoneNumber?: string;
//   address?: string;
//   gender?: string;
//   dob?: string;
// }

// interface Employee {
//   employeeId: number;
//   isDirectorVerified: boolean;
//   positionName: string;
//   salary: number;
//   department: string;
//   skillSet: string;
//   departmentId: number;
//   departmentName: string;
// }

// interface MyDetails {
//   user: UserProfile;
//   roles: Role[];
//   employee: Employee | null;
// }

// interface Role {
//   id: number;
//   ptype: string;
//   stype: string;
//   isApproved: string;
//   createdAt: string;
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
//   assignedManagerId: number;
//   assignedManagerName: string;
//   deadline: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ProjectHistory {
//   statusId: number;
//   projectId: number;
//   projectName: string;
//   status: string;
//   dateTime: string;
//   handledById: number;
//   handledByName: string;
//   assignedToId: number | null;
//   assignedToName: string | null;
//   directorNote: string | null;
//   managerNote: string | null;
//   deadline: string | null;
// }

// interface Task {
//   taskId: number;
//   projectId: number;
//   projectName: string;
//   assignedToUserId: number;
//   assignedToUserName: string;
//   assignedToUserPhoto: string | null;
//   taskDetails: string;
//   description: string;
//   taskStatus: string;
//   createdById: number;
//   createdByName: string;
//   deadline: string;
//   managerNote: string | null;
//   createdAt: string;
//   updatedAt: string;
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

// interface TeamMember {
//   memberId: number;
//   memberName: string;
//   memberEmail: string;
//   photoUrl: string | null;
//   role: string;
//   description: string | null;
// }

// interface ConsultantRequest {
//   requestId: number;
//   projectId: number;
//   projectName: string;
//   consultantId: number;
//   consultantName: string;
//   consultantEmail: string;
//   consultantPhoto: string | null;
//   skill: string;
//   experience: string;
//   marks10: number;
//   marks12: number;
//   graduationMarks: number;
//   resumeLink: string;
//   averageRating: number;
//   totalReviews: number;
//   requestedAt: string;
// }

// interface ConsultantWithRating {
//   consultantId: number;
//   userId: number;
//   name: string;
//   email: string;
//   photoUrl: string | null;
//   skill: string;
//   experience: string;
//   averageRating: number;
//   totalReviews: number;
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
//   projectId?: number;
//   projectName?: string;
// }

// interface EmployeeTask {
//   taskId: number;
//   description: string;
//   status: string;
//   priority: string;
//   createdByUserId: number;
//   createdByName: string;
//   createdByPhoto: string | null;
//   deadline: string;
//   createdAt: string;
//   updatedAt: string;
//   completedAt: string | null;
// }

// interface EmailRecipient {
//   userId: number;
//   name: string;
//   email: string;
//   role: string;
//   department: string;
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
// // ALL MANAGER APIs
// // ============================================

// // Existing APIs
// const checkIsManager = async () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/project/check/manager');
// const getMyAssignedProjects = async () => apiCall<{ success: boolean; data: Project[] }>('GET', '/api/project/manager/my-projects');
// const updateProjectStatus = async (projectId: number, status: string, note?: string) => {
//   let url = `/api/project/manager/update-status/${projectId}?status=${status}`;
//   if (note) url += `&note=${encodeURIComponent(note)}`;
//   return apiCall('PUT', url);
// };
// const createTask = async (data: { projectId: number; assignedToUserId: number; taskDetails: string; description: string; deadline: string }) => apiCall('POST', '/api/task/create', data);
// const updateTask = async (taskId: number, data: any) => apiCall('PUT', `/api/task/update/${taskId}`, data);
// const deleteTask = async (taskId: number) => apiCall('DELETE', `/api/task/delete/${taskId}`);
// const getMyCreatedTasks = async () => apiCall<{ success: boolean; data: Task[] }>('GET', '/api/task/my-created-tasks');
// const getProjectTasks = async (projectId: number) => apiCall<{ success: boolean; data: Task[] }>('GET', `/api/task/project/${projectId}`);
// const createTeam = async (data: { projectId: number; teamName: string; memberIds: number[]; memberRoles: string[] }) => apiCall('POST', '/api/team/create', data);
// const addMemberToTeam = async (teamId: number, memberId: number, role: string) => apiCall('POST', `/api/team/${teamId}/add-member?memberId=${memberId}&role=${encodeURIComponent(role)}`);
// const removeMemberFromTeam = async (teamId: number, memberId: number) => apiCall('DELETE', `/api/team/${teamId}/remove-member/${memberId}`);
// const deleteTeam = async (teamId: number) => apiCall('DELETE', `/api/team/delete/${teamId}`);
// const getMyTeams = async () => apiCall<{ success: boolean; data: Team[] }>('GET', '/api/team/my-teams');
// const getProjectTeams = async (projectId: number) => apiCall<{ success: boolean; data: Team[] }>('GET', `/api/team/project/${projectId}`);
// const getConsultantRequests = async () => apiCall<{ success: boolean; data: ConsultantRequest[] }>('GET', '/api/consultant-project/manager/requests');
// const rateConsultant = async (data: { consultantId: number; rating: number; feedback: string }) => apiCall('POST', '/api/consultant-project/manager/rate', data);
// const uploadFile = async (projectId: number, file: File, fileType: string) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   return apiCall('POST', `/api/file/upload/${projectId}?fileType=${fileType}`, formData, true);
// };
// const getProjectFiles = async (projectId: number) => apiCall<{ success: boolean; data: FileItem[] }>('GET', `/api/file/project/${projectId}`);
// const getMyUploads = async () => apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/my-uploads');
// const deleteFile = async (fileId: number) => apiCall('DELETE', `/api/file/delete/${fileId}`);
// const getProjectById = async (projectId: number) => apiCall<{ success: boolean; data: Project }>('GET', `/api/project/${projectId}`);
// const getProjectHistory = async (projectId: number) => apiCall<{ success: boolean; data: ProjectHistory[] }>('GET', `/api/project/${projectId}/history`);
// const getUserProfile = async () => apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
// const updateUserProfile = async (data: any) => apiCall('PUT', '/api/users/profile', data);
// const deleteAccount = async () => apiCall('DELETE', '/api/users/account');
// const getMyDetails = async () => apiCall<{ success: boolean; data: MyDetails }>('GET', '/api/getmydetails');
// const getAccessToken = async (fileId: number) => apiCall('POST', `/api/file/access-token/${fileId}`, {});

// // NEW APIs
// const getMyDepartmentConsultants = async () => apiCall<{ success: boolean; data: ConsultantWithRating[] }>('GET', '/api/consultant-project/manager/my-department-consultants');
// const getEmployeeTasks = async () => apiCall<{ success: boolean; data: EmployeeTask[] }>('GET', '/api/employee/my-tasks');
// const updateEmployeeTaskStatus = async (taskId: number, status: string, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/status`, { status, note });
// const completeEmployeeTask = async (taskId: number, note?: string) => apiCall('PUT', `/api/employee/tasks/${taskId}/complete`, { note });
// const getEmailRecipients = async () => apiCall<{ success: boolean; data: EmailRecipient[] }>('GET', '/api/email/recipients/my-department-consultants');
// const sendEmail = async (data: { userIds: number[]; subject: string; message: string; messageType: string }) => apiCall('POST', '/api/email/send', data);
// const getAISuggestConsultant = async (data: { taskName: string; taskDescription: string; projectId: number }) => apiCall('POST', '/api/ai/suggest-consultant-for-task', data);

// // ============================================
// // SIDEBAR MENU ITEMS
// // ============================================

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//   { id: 'my-projects', label: 'My Projects', icon: '📁' },
//   { id: 'consultant-requests', label: 'Consultant Requests', icon: '📨' },
//   { id: 'consultants', label: 'Consultants', icon: '👥' },
//   { id: 'my-teams', label: 'My Teams', icon: '👥' },
//   { id: 'my-tasks', label: 'My Created Tasks', icon: '✅' },
//   { id: 'assigned-tasks', label: 'Assigned to Me', icon: '📋' },
//   { id: 'ai-suggest', label: 'AI Suggest', icon: '🤖' },
//   { id: 'email', label: 'Email Consultants', icon: '✉️' },
//   { id: 'uploads', label: 'Uploads', icon: '📎' },
//   { id: 'profile', label: 'Profile', icon: '👤' },
// ];

// const statusConfig: Record<string, { label: string; class: string; icon: string }> = {
//   PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳' },
//   ASSIGNED: { label: 'Assigned', class: 'status-assigned', icon: '👥' },
//   IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄' },
//   COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️' },
//   REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '❌' },
//   APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅' },
// };

// const getStatusBadge = (status: string) => {
//   const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌' };
//   return <span className={`status-badge ${config.class}`}><span className="status-icon">{config.icon}</span>{config.label}</span>;
// };

// // ============================================
// // MAIN MANAGER COMPONENT
// // ============================================

// const Manager: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('dashboard');
//   const [loading, setLoading] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [myDetails, setMyDetails] = useState<MyDetails | null>(null);
//   const [isManager, setIsManager] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const { logout } = useAuth();

//   // Data states
//   const [myProjects, setMyProjects] = useState<Project[]>([]);
//   const [consultantRequests, setConsultantRequests] = useState<ConsultantRequest[]>([]);
//   const [consultants, setConsultants] = useState<ConsultantWithRating[]>([]);
//   const [myTeams, setMyTeams] = useState<Team[]>([]);
//   const [myCreatedTasks, setMyCreatedTasks] = useState<Task[]>([]);
//   const [employeeTasks, setEmployeeTasks] = useState<EmployeeTask[]>([]);
//   const [myUploads, setMyUploads] = useState<FileItem[]>([]);
//   const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);

//   // Selected project for unified actions
//   const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
//   // Modal states
//   const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
//   const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);
//   const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
//   const [showEditTaskModal, setShowEditTaskModal] = useState(false);
//   const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
//   const [showRateConsultantModal, setShowRateConsultantModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showEmployeeTaskModal, setShowEmployeeTaskModal] = useState(false);
//   const [showAISuggestModal, setShowAISuggestModal] = useState(false);
//   const [showEmailModal, setShowEmailModal] = useState(false);

//   // Selected items
//   const [selectedProjectFiles, setSelectedProjectFiles] = useState<FileItem[]>([]);
//   const [selectedProjectHistory, setSelectedProjectHistory] = useState<ProjectHistory[]>([]);
//   const [selectedProjectTeams, setSelectedProjectTeams] = useState<Team[]>([]);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [selectedConsultant, setSelectedConsultant] = useState<ConsultantWithRating | null>(null);
//   const [selectedEmployeeTask, setSelectedEmployeeTask] = useState<EmployeeTask | null>(null);

//   // Form states
//   const [updateProjectData, setUpdateProjectData] = useState({ status: '', note: '' });
//   const [createTaskData, setCreateTaskData] = useState({ projectId: 0, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
//   const [editTaskData, setEditTaskData] = useState({ taskDetails: '', description: '', managerNote: '', taskStatus: '' });
//   const [createTeamData, setCreateTeamData] = useState({ projectId: 0, teamName: '', memberIds: [] as number[], memberRoles: [] as string[] });
//   const [rateConsultantData, setRateConsultantData] = useState({ rating: 0, feedback: '' });
//   const [uploadFileData, setUploadFileData] = useState({ file: null as File | null, fileType: '', projectId: 0 });
//   const [employeeTaskNote, setEmployeeTaskNote] = useState('');
//   const [employeeTaskStatus, setEmployeeTaskStatus] = useState('');
//   const [aiSuggestData, setAiSuggestData] = useState({ taskName: '', taskDescription: '', projectId: 0 });
//   const [aiSuggestResult, setAiSuggestResult] = useState('');
//   const [emailData, setEmailData] = useState({ userIds: [] as number[], subject: '', message: '', messageType: 'INFORMATION' });

//   // Filter states
//   const [taskFilter, setTaskFilter] = useState('all');
//   const [projectSearch, setProjectSearch] = useState('');

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.setAttribute('data-theme', 'dark');
//     }
//     loadInitialData();
//   }, []);

//   const loadInitialData = async () => {
//     setLoading(true);
//     try {
//       const [profileRes, detailsRes, managerCheckRes] = await Promise.all([
//         getUserProfile().catch(() => ({ data: null })),
//         getMyDetails().catch(() => ({ data: null })),
//         checkIsManager().catch(() => ({ data: false })),
//       ]);

//       setUser(profileRes.data);
//       setMyDetails(detailsRes.data);
//       setIsManager(managerCheckRes.data || false);

//       if (managerCheckRes.data) {
//         await loadAllData();
//       }
//     } catch (error) {
//       console.error('Error loading initial data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAllData = async () => {
//     try {
//       const [projectsRes, requestsRes, consultantsRes, teamsRes, tasksRes, empTasksRes, uploadsRes, emailRes] = await Promise.all([
//         getMyAssignedProjects().catch(() => ({ data: [] })),
//         getConsultantRequests().catch(() => ({ data: [] })),
//         getMyDepartmentConsultants().catch(() => ({ data: [] })),
//         getMyTeams().catch(() => ({ data: [] })),
//         getMyCreatedTasks().catch(() => ({ data: [] })),
//         getEmployeeTasks().catch(() => ({ data: [] })),
//         getMyUploads().catch(() => ({ data: [] })),
//         getEmailRecipients().catch(() => ({ data: [] })),
//       ]);

//       setMyProjects(projectsRes.data);
//       setConsultantRequests(requestsRes.data);
//       setConsultants(consultantsRes.data);
//       setMyTeams(teamsRes.data);
//       setMyCreatedTasks(tasksRes.data);
//       setEmployeeTasks(empTasksRes.data);
//       setMyUploads(uploadsRes.data);
//       setEmailRecipients(emailRes.data);
      
//       if (projectsRes.data.length > 0 && selectedProjectId === 0) {
//         setSelectedProjectId(projectsRes.data[0].projectId);
//         setSelectedProject(projectsRes.data[0]);
//       }
//     } catch (error) {
//       console.error('Error loading data:', error);
//     }
//   };

//   const handleProjectChange = async (projectId: number) => {
//     setSelectedProjectId(projectId);
//     const project = myProjects.find(p => p.projectId === projectId);
//     setSelectedProject(project || null);
    
//     // Load project-specific data
//     if (projectId) {
//       try {
//         const [teamsRes, tasksRes] = await Promise.all([
//           getProjectTeams(projectId).catch(() => ({ data: [] })),
//           getProjectTasks(projectId).catch(() => ({ data: [] })),
//         ]);
//         setSelectedProjectTeams(teamsRes.data);
//         // Update tasks view for this project
//       } catch (error) {
//         console.error('Error loading project data:', error);
//       }
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

//   const handleUpdateProjectStatus = async () => {
//     if (!selectedProject || !updateProjectData.status) return;
//     try {
//       await updateProjectStatus(selectedProject.projectId, updateProjectData.status, updateProjectData.note);
//       await loadAllData();
//       setShowUpdateProjectModal(false);
//       setUpdateProjectData({ status: '', note: '' });
//       alert('Project status updated');
//     } catch (error: any) {
//       alert(error.message || 'Failed to update project status');
//     }
//   };

//   const handleCreateTask = async () => {
//     if (!createTaskData.projectId || !createTaskData.assignedToUserId || !createTaskData.taskDetails || !createTaskData.deadline) {
//       alert('Please fill all required fields');
//       return;
//     }
//     try {
//       await createTask(createTaskData);
//       await loadAllData();
//       setShowCreateTaskModal(false);
//       setCreateTaskData({ projectId: selectedProjectId, assignedToUserId: 0, taskDetails: '', description: '', deadline: '' });
//       alert('Task created successfully');
//     } catch (error: any) {
//       alert(error.message || 'Failed to create task');
//     }
//   };

//   const handleUpdateTask = async () => {
//     if (!selectedTask) return;
//     try {
//       await updateTask(selectedTask.taskId, editTaskData);
//       await loadAllData();
//       setShowEditTaskModal(false);
//       setSelectedTask(null);
//       alert('Task updated');
//     } catch (error: any) {
//       alert(error.message || 'Failed to update task');
//     }
//   };

//   const handleDeleteTask = async (taskId: number) => {
//     if (confirm('Delete this task?')) {
//       try {
//         await deleteTask(taskId);
//         await loadAllData();
//         alert('Task deleted');
//       } catch (error: any) {
//         alert(error.message || 'Failed to delete task');
//       }
//     }
//   };

//   const handleCreateTeam = async () => {
//     if (!createTeamData.projectId || !createTeamData.teamName || createTeamData.memberIds.length === 0) {
//       alert('Please select project, enter team name, and select at least one consultant');
//       return;
//     }
//     const roles = createTeamData.memberRoles;
//     while (roles.length < createTeamData.memberIds.length) roles.push('Member');
    
//     try {
//       await createTeam({
//         projectId: createTeamData.projectId,
//         teamName: createTeamData.teamName,
//         memberIds: createTeamData.memberIds,
//         memberRoles: roles.slice(0, createTeamData.memberIds.length),
//       });
//       await loadAllData();
//       setShowCreateTeamModal(false);
//       setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] });
//       alert('Team created successfully');
//     } catch (error: any) {
//       alert(error.message || 'Failed to create team');
//     }
//   };

//   const handleRateConsultant = async () => {
//     if (!selectedConsultant) return;
//     if (!rateConsultantData.rating || rateConsultantData.rating < 1 || rateConsultantData.rating > 5) {
//       alert('Please provide rating 1-5');
//       return;
//     }
//     try {
//       await rateConsultant({ consultantId: selectedConsultant.consultantId, rating: rateConsultantData.rating, feedback: rateConsultantData.feedback });
//       await loadAllData();
//       setShowRateConsultantModal(false);
//       setSelectedConsultant(null);
//       setRateConsultantData({ rating: 0, feedback: '' });
//       alert('Rating submitted');
//     } catch (error: any) {
//       alert(error.message || 'Failed to submit rating');
//     }
//   };

//   const handleUpdateEmployeeTask = async () => {
//     if (!selectedEmployeeTask) return;
//     try {
//       await updateEmployeeTaskStatus(selectedEmployeeTask.taskId, employeeTaskStatus, employeeTaskNote);
//       await loadAllData();
//       setShowEmployeeTaskModal(false);
//       setSelectedEmployeeTask(null);
//       setEmployeeTaskNote('');
//       setEmployeeTaskStatus('');
//       alert('Task status updated');
//     } catch (error: any) {
//       alert(error.message || 'Failed to update task');
//     }
//   };

//   const handleCompleteEmployeeTask = async () => {
//     if (!selectedEmployeeTask) return;
//     try {
//       await completeEmployeeTask(selectedEmployeeTask.taskId, employeeTaskNote);
//       await loadAllData();
//       setShowEmployeeTaskModal(false);
//       setSelectedEmployeeTask(null);
//       setEmployeeTaskNote('');
//       alert('Task completed');
//     } catch (error: any) {
//       alert(error.message || 'Failed to complete task');
//     }
//   };

//   const handleAISuggest = async () => {
//     if (!aiSuggestData.taskName || !aiSuggestData.taskDescription || !aiSuggestData.projectId) {
//       alert('Please fill all fields');
//       return;
//     }
//     try {
//       const res = await getAISuggestConsultant(aiSuggestData);
//       setAiSuggestResult(res.data);
//     } catch (error: any) {
//       alert(error.message || 'Failed to get suggestion');
//     }
//   };

//   const handleSendEmail = async () => {
//     if (emailData.userIds.length === 0 || !emailData.subject || !emailData.message) {
//       alert('Please select recipients, enter subject and message');
//       return;
//     }
//     try {
//       await sendEmail(emailData);
//       setShowEmailModal(false);
//       setEmailData({ userIds: [], subject: '', message: '', messageType: 'INFORMATION' });
//       alert('Email sent successfully');
//     } catch (error: any) {
//       alert(error.message || 'Failed to send email');
//     }
//   };

//   const handleUploadFile = async () => {
//     if (!uploadFileData.projectId || !uploadFileData.file || !uploadFileData.fileType) {
//       alert('Please select project, file and file type');
//       return;
//     }
//     try {
//       await uploadFile(uploadFileData.projectId, uploadFileData.file, uploadFileData.fileType);
//       if (selectedProject && selectedProject.projectId === uploadFileData.projectId) {
//         const filesRes = await getProjectFiles(uploadFileData.projectId);
//         setSelectedProjectFiles(filesRes.data);
//       }
//       const uploadsRes = await getMyUploads();
//       setMyUploads(uploadsRes.data);
//       setUploadFileData({ file: null, fileType: '', projectId: 0 });
//       alert('File uploaded');
//     } catch (error: any) {
//       alert(error.message || 'Upload failed');
//     }
//   };

//   const handleDeleteFile = async (fileId: number) => {
//     if (confirm('Delete this file?')) {
//       try {
//         await deleteFile(fileId);
//         if (selectedProject) {
//           const filesRes = await getProjectFiles(selectedProject.projectId);
//           setSelectedProjectFiles(filesRes.data);
//         }
//         const uploadsRes = await getMyUploads();
//         setMyUploads(uploadsRes.data);
//         alert('File deleted');
//       } catch (error: any) {
//         alert(error.message || 'Delete failed');
//       }
//     }
//   };

//   const handleViewProject = async (projectId: number) => {
//     try {
//       const [projectRes, historyRes, teamsRes, filesRes] = await Promise.all([
//         getProjectById(projectId),
//         getProjectHistory(projectId).catch(() => ({ data: [] })),
//         getProjectTeams(projectId).catch(() => ({ data: [] })),
//         getProjectFiles(projectId).catch(() => ({ data: [] })),
//       ]);
//       setSelectedProject(projectRes.data);
//       setSelectedProjectHistory(historyRes.data);
//       setSelectedProjectTeams(teamsRes.data);
//       setSelectedProjectFiles(filesRes.data);
//       setShowProjectDetailModal(true);
//     } catch (error: any) {
//       alert(error.message || 'Failed to load project');
//     }
//   };

//   const handleViewFile = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) {
//         window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
//       } else {
//         alert('Cannot view file');
//       }
//     } catch { alert('Cannot view file'); }
//   };

//   const handleDownloadFile = async (fileId: number) => {
//     try {
//       const tokenRes = await getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) {
//         window.open(`${API_BASE}${tokenRes.data.downloadUrl}`, '_blank');
//       } else {
//         alert('Cannot download');
//       }
//     } catch { alert('Download failed'); }
//   };

//   const handleUpdateProfile = async (data: any) => {
//     try {
//       await updateUserProfile(data);
//       const profileRes = await getUserProfile();
//       setUser(profileRes.data);
//       setShowProfileModal(false);
//       alert('Profile updated');
//     } catch (error: any) {
//       alert(error.message || 'Update failed');
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (confirm('Delete account permanently?')) {
//       try {
//         await deleteAccount();
//         await logout();
//         window.location.href = '/';
//       } catch (error: any) {
//         alert(error.message || 'Delete failed');
//       }
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     window.location.href = '/';
//   };

//   const filteredProjects = myProjects.filter(p => 
//     p.projectName.toLowerCase().includes(projectSearch.toLowerCase())
//   );

//   const filteredTasks = myCreatedTasks.filter(t => {
//     if (taskFilter === 'pending') return t.taskStatus === 'PENDING';
//     if (taskFilter === 'in_progress') return t.taskStatus === 'IN_PROGRESS';
//     if (taskFilter === 'completed') return t.taskStatus === 'COMPLETED';
//     return true;
//   });

//   const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

//   if (loading) return <div className="client-loader"><div className="loader-spinner"></div></div>;

//   if (!isManager) {
//     return (
//       <div className="client-container">
//         <CommonSidebar activeNav={activeNav} setActiveNav={setActiveNav} onLogout={handleLogout} onThemeToggle={toggleDarkMode} darkMode={darkMode} user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null} menuItems={[]} title="Access Denied" logoIcon="🚫" isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
//         <main className="client-main"><div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}><h2>Access Denied</h2><p>Manager permissions required.</p></div></main>
//       </div>
//     );
//   }

//   return (
//     <div className="client-container">
//       <CommonSidebar activeNav={activeNav} setActiveNav={setActiveNav} onLogout={handleLogout} onThemeToggle={toggleDarkMode} darkMode={darkMode} user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null} menuItems={menuItems} title="Manager Portal" logoIcon="👔" isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
//       <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>☰</button>

//       <main className="client-main">
//         <header className="client-header">
//           <div className="header-welcome"><h1>Welcome, {user?.name?.split(' ')[0] || 'Manager'}!</h1><p>Manager Dashboard - Full Control Panel</p></div>
//           <div className="header-stats">
//             <div className="header-stat-item"><span className="stat-label">Projects</span><span className="stat-value-sm">{myProjects.length}</span></div>
//             <div className="header-stat-item"><span className="stat-label">Teams</span><span className="stat-value-sm">{myTeams.length}</span></div>
//             <div className="header-stat-item"><span className="stat-label">Active Tasks</span><span className="stat-value-sm">{myCreatedTasks.filter(t => t.taskStatus !== 'COMPLETED').length}</span></div>
//           </div>
//         </header>

//         {/* PROJECT SELECTION BAR - Unified for all actions */}
//         <div className="project-selector-bar">
//           <div className="project-selector-left">
//             <label>📁 Select Project:</label>
//             <div className="project-search-wrapper">
//               <input type="text" placeholder="Search projects..." value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} className="project-search-input" />
//               <select value={selectedProjectId} onChange={(e) => handleProjectChange(parseInt(e.target.value))} className="project-select">
//                 <option value="0">-- Select a Project --</option>
//                 {filteredProjects.map(p => (
//                   <option key={p.projectId} value={p.projectId}>
//                     {p.projectName} - {p.status}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="project-selector-actions">
//             {selectedProject && (
//               <>
//                 <button className="action-btn primary" onClick={() => { setUpdateProjectData({ status: selectedProject.status, note: '' }); setShowUpdateProjectModal(true); }}>📝 Update Status</button>
//                 <button className="action-btn success" onClick={() => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId, assignedToUserId: 0 }); setShowCreateTaskModal(true); }}>➕ Create Task</button>
//                 <button className="action-btn info" onClick={() => { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [], memberRoles: [] }); setShowCreateTeamModal(true); }}>👥 Create Team</button>
//                 <button className="action-btn outline" onClick={() => handleViewProject(selectedProjectId)}>📋 View Details</button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* DASHBOARD */}
//         {activeNav === 'dashboard' && (
//           <>
//             <div className="stats-grid">
//               <div className="stat-card"><div className="stat-icon blue">📁</div><div className="stat-info"><span className="stat-value">{myProjects.length}</span><span className="stat-label">Projects</span></div></div>
//               <div className="stat-card"><div className="stat-icon green">👥</div><div className="stat-info"><span className="stat-value">{myTeams.length}</span><span className="stat-label">Teams</span></div></div>
//               <div className="stat-card"><div className="stat-icon orange">📨</div><div className="stat-info"><span className="stat-value">{consultantRequests.length}</span><span className="stat-label">Requests</span></div></div>
//               <div className="stat-card"><div className="stat-icon purple">✅</div><div className="stat-info"><span className="stat-value">{myCreatedTasks.length}</span><span className="stat-label">Tasks</span></div></div>
//             </div>
            
//             {selectedProject && (
//               <div className="dashboard-card">
//                 <div className="card-header"><h2>Current Project: {selectedProject.projectName}</h2>{getStatusBadge(selectedProject.status)}</div>
//                 <p className="project-card-desc">{selectedProject.projectDescription}</p>
//                 <div className="project-card-meta"><span>🏢 {selectedProject.departmentName}</span><span>👤 {selectedProject.clientName}</span><span>📅 Due: {formatDate(selectedProject.deadline)}</span></div>
//               </div>
//             )}

//             <div className="dashboard-card"><div className="card-header"><h2>Recent Tasks</h2><button className="view-all-link" onClick={() => setActiveNav('my-tasks')}>View All →</button></div><div className="projects-grid">{myCreatedTasks.slice(0, 3).map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.taskDetails}</h3>{getStatusBadge(t.taskStatus)}</div><p className="project-card-desc">{t.description?.substring(0, 60)}</p><div className="project-card-meta"><span>📁 {t.projectName}</span><span>👤 {t.assignedToUserName}</span><span>📅 Due: {formatDate(t.deadline)}</span></div></div>))}</div></div>

//             <div className="dashboard-card"><div className="card-header"><h2>Assigned to Me</h2><button className="view-all-link" onClick={() => setActiveNav('assigned-tasks')}>View All →</button></div><div className="projects-grid">{employeeTasks.slice(0, 3).map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.description?.substring(0, 40)}</h3>{getStatusBadge(t.status)}</div><div className="project-card-meta"><span>🔥 {t.priority}</span><span>📅 Due: {formatDate(t.deadline)}</span><span>👤 By: {t.createdByName}</span></div><button className="btn-sm btn-primary" onClick={() => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); }}>Update</button></div>))}</div></div>
//           </>
//         )}

//         {/* MY PROJECTS */}
//         {activeNav === 'my-projects' && (
//           <div className="dashboard-card full-width"><h2>My Projects</h2><div className="projects-grid">{myProjects.map(p => (<div key={p.projectId} className="project-card"><div className="project-card-header"><h3>{p.projectName}</h3>{getStatusBadge(p.status)}</div><p className="project-card-desc">{p.projectDescription?.substring(0, 80)}</p><div className="project-card-meta"><span>📅 Deadline: {formatDate(p.deadline)}</span><span>🏢 {p.departmentName}</span><span>👤 {p.clientName}</span></div><div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => handleViewProject(p.projectId)}>Details</button><button className="btn-sm btn-outline" onClick={() => { setSelectedProject(p); setUpdateProjectData({ status: p.status, note: '' }); setShowUpdateProjectModal(true); }}>Update Status</button><button className="btn-sm btn-outline" onClick={() => { setCreateTaskData({ ...createTaskData, projectId: p.projectId, assignedToUserId: 0 }); setShowCreateTaskModal(true); }}>Create Task</button></div></div>))}</div></div>
//         )}

//         {/* CONSULTANT REQUESTS */}
//         {activeNav === 'consultant-requests' && (
//           <div className="dashboard-card full-width"><h2>Consultant Join Requests</h2><div className="projects-grid">{consultantRequests.map(r => (<div key={r.requestId} className="project-card"><div className="project-card-header"><h3>{r.consultantName}</h3><span className="status-badge status-pending">⏳ Requested</span></div><div className="project-card-meta"><span>📁 {r.projectName}</span><span>⭐ {r.averageRating.toFixed(1)}/5</span><span>💼 {r.experience}</span></div><p className="project-card-desc"><strong>Skills:</strong> {r.skill}</p><div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => { setCreateTeamData({ projectId: r.projectId, teamName: `${r.projectName} Team`, memberIds: [r.consultantId], memberRoles: ['Consultant'] }); setShowCreateTeamModal(true); }}>Add to Team</button><button className="btn-sm btn-outline" onClick={() => window.open(r.resumeLink, '_blank')}>Resume</button></div></div>))}</div></div>
//         )}

//         {/* CONSULTANTS */}
//         {activeNav === 'consultants' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Department Consultants with Ratings</h2></div><div className="emp-grid">{consultants.map(c => (<div key={c.consultantId} className="emp-card"><div className="emp-header"><div className="emp-avatar verified">{c.photoUrl ? <img src={c.photoUrl} alt={c.name} className="avatar-img" /> : c.name.charAt(0)}</div><div><h3>{c.name}</h3><div className="dept-badge">{c.skill?.substring(0, 40)}</div></div></div><div className="emp-body"><div className="emp-row"><span>📧 Email:</span><span>{c.email}</span></div><div className="emp-row"><span>💼 Experience:</span><span>{c.experience}</span></div><div className="emp-row"><span>⭐ Rating:</span><span>{c.averageRating.toFixed(1)}/5 ({c.totalReviews} reviews)</span></div></div><div className="emp-footer"><button onClick={() => { setSelectedConsultant(c); setRateConsultantData({ rating: 0, feedback: '' }); setShowRateConsultantModal(true); }}>Rate</button><button className="btn-outline" onClick={() => { if (selectedProjectId) { setCreateTeamData({ projectId: selectedProjectId, teamName: '', memberIds: [c.userId], memberRoles: ['Member'] }); setShowCreateTeamModal(true); } else { alert('Please select a project first from the top bar'); } }}>Add to Team</button></div></div>))}</div></div>
//         )}

//         {/* MY TEAMS */}
//         {activeNav === 'my-teams' && (
//           <div className="dashboard-card full-width"><h2>My Teams</h2><div className="projects-grid">{myTeams.map(team => (<div key={team.teamId} className="project-card"><div className="project-card-header"><h3>{team.teamName}</h3><span className="status-badge status-approved">Active</span></div><div className="project-card-meta"><span>📁 {team.projectName}</span><span>👥 {team.members.length} members</span></div><div className="team-members"><h4>Members:</h4>{team.members.slice(0, 3).map((m, i) => (<div key={i} className="team-member"><div className="member-avatar">{m.memberName.charAt(0)}</div><div><div className="member-name">{m.memberName}</div><div className="member-role">{m.role}</div></div></div>))}{team.members.length > 3 && <small>+{team.members.length - 3} more</small>}</div><div className="project-card-actions"><button className="btn-sm btn-danger" onClick={() => deleteTeam(team.teamId).then(loadAllData)}>Delete</button></div></div>))}</div></div>
//         )}

//         {/* MY CREATED TASKS */}
//         {activeNav === 'my-tasks' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Tasks Created by Me</h2><div className="header-filters"><select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}><option value="all">All</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select><button className="btn-primary" onClick={() => { setCreateTaskData({ ...createTaskData, projectId: selectedProjectId, assignedToUserId: 0 }); setShowCreateTaskModal(true); }}>+ Create Task</button></div></div><div className="projects-grid">{filteredTasks.map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.taskDetails}</h3>{getStatusBadge(t.taskStatus)}</div><p className="project-card-desc">{t.description?.substring(0, 80)}</p><div className="project-card-meta"><span>📁 {t.projectName}</span><span>👤 {t.assignedToUserName}</span><span>📅 Due: {formatDate(t.deadline)}</span></div><div className="project-card-actions"><button className="btn-sm btn-outline" onClick={() => { setSelectedTask(t); setEditTaskData({ taskDetails: t.taskDetails, description: t.description || '', managerNote: t.managerNote || '', taskStatus: t.taskStatus }); setShowEditTaskModal(true); }}>Edit</button><button className="btn-sm btn-danger" onClick={() => handleDeleteTask(t.taskId)}>Delete</button></div></div>))}</div></div>
//         )}

//         {/* ASSIGNED TO ME */}
//         {activeNav === 'assigned-tasks' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Tasks Assigned to Me</h2></div><div className="projects-grid">{employeeTasks.map(t => (<div key={t.taskId} className="project-card"><div className="project-card-header"><h3>{t.description?.substring(0, 50)}</h3>{getStatusBadge(t.status)}</div><div className="project-card-meta"><span>🔥 Priority: {t.priority}</span><span>📅 Deadline: {formatDate(t.deadline)}</span><span>👤 By: {t.createdByName}</span></div><button className="btn-sm btn-primary" onClick={() => { setSelectedEmployeeTask(t); setEmployeeTaskStatus(t.status); setShowEmployeeTaskModal(true); }}>Update Status</button></div>))}</div></div>
//         )}

//         {/* AI SUGGEST */}
//         {activeNav === 'ai-suggest' && (
//           <div className="dashboard-card full-width"><h2>AI Consultant Suggestion 🤖</h2><div className="task-form"><div className="form-group"><label>Project</label><select value={aiSuggestData.projectId} onChange={(e) => setAiSuggestData({ ...aiSuggestData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-group"><label>Task Name</label><input placeholder="Enter task name" value={aiSuggestData.taskName} onChange={(e) => setAiSuggestData({ ...aiSuggestData, taskName: e.target.value })} /></div><div className="form-group"><label>Task Description</label><textarea rows={4} placeholder="Describe the task..." value={aiSuggestData.taskDescription} onChange={(e) => setAiSuggestData({ ...aiSuggestData, taskDescription: e.target.value })} /></div><button className="btn-primary" onClick={handleAISuggest}>Get Suggestion</button>{aiSuggestResult && <div className="ai-section" style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface)', borderRadius: '12px' }}><strong>🤖 AI Recommendation:</strong><p style={{ marginTop: '0.5rem' }}>{aiSuggestResult}</p></div>}</div></div>
//         )}

//         {/* EMAIL CONSULTANTS */}
//         {activeNav === 'email' && (
//           <div className="dashboard-card full-width"><h2>Email Department Consultants</h2><div className="task-form"><div className="form-group"><label>Select Recipients</label><div className="emp-grid" style={{ maxHeight: '200px', overflow: 'auto' }}>{emailRecipients.map(r => (<label key={r.userId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderBottom: '1px solid var(--border)' }}><input type="checkbox" checked={emailData.userIds.includes(r.userId)} onChange={() => { const ids = emailData.userIds.includes(r.userId) ? emailData.userIds.filter(id => id !== r.userId) : [...emailData.userIds, r.userId]; setEmailData({ ...emailData, userIds: ids }); }} /><span><strong>{r.name}</strong> - {r.email}</span></label>))}</div></div><div className="form-group"><label>Subject</label><input placeholder="Email Subject" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} /></div><div className="form-group"><label>Message</label><textarea rows={5} placeholder="Type your message..." value={emailData.message} onChange={(e) => setEmailData({ ...emailData, message: e.target.value })} /></div><div className="form-group"><label>Message Type</label><select value={emailData.messageType} onChange={(e) => setEmailData({ ...emailData, messageType: e.target.value })}><option value="INFORMATION">📢 Information</option><option value="ALERT">⚠️ Alert</option><option value="TASK">✅ Task Assignment</option><option value="MEETING">📅 Meeting Invite</option></select></div><button className="btn-primary" onClick={handleSendEmail}>Send Email</button></div></div>
//         )}

//         {/* UPLOADS */}
//         {activeNav === 'uploads' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>My Uploads</h2></div><div className="upload-section"><select value={uploadFileData.projectId} onChange={(e) => setUploadFileData({ ...uploadFileData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select><input type="file" onChange={(e) => setUploadFileData({ ...uploadFileData, file: e.target.files?.[0] || null })} /><select value={uploadFileData.fileType} onChange={(e) => setUploadFileData({ ...uploadFileData, fileType: e.target.value })}><option value="">Type</option><option value="Document">📄 Document</option><option value="Code">💻 Code</option><option value="Image">🖼️ Image</option><option value="PDF">📕 PDF</option><option value="Report">📊 Report</option></select><button className="btn-primary" onClick={handleUploadFile}>Upload</button></div><div className="uploads-list">{myUploads.map(f => (<div key={f.fileId} className="file-item"><div className="file-icon">📄</div><div className="file-info"><div className="file-name">{f.fileLink?.split('/').pop()}</div><div className="file-meta"><span>{f.fileType}</span><span>📁 {f.projectName}</span><span>📅 {formatDate(f.uploadTime)}</span></div></div><div className="file-actions"><button className="btn-icon" onClick={() => handleViewFile(f.fileId)}>View</button><button className="btn-icon" onClick={() => handleDownloadFile(f.fileId)}>Download</button><button className="btn-icon danger" onClick={() => handleDeleteFile(f.fileId)}>Delete</button></div></div>))}</div></div>
//         )}

//         {/* PROFILE */}
//         {activeNav === 'profile' && (
//           <div className="dashboard-card full-width"><div className="card-header"><h2>Profile</h2><button className="btn-outline" onClick={() => setShowProfileModal(true)}>Edit</button></div><div className="profile-info"><div className="profile-avatar-large"><div className="avatar-placeholder">{user?.name?.charAt(0)}</div></div><div className="profile-details"><div className="detail-item"><label>Name</label><span>{user?.name}</span></div><div className="detail-item"><label>Email</label><span>{user?.email}</span></div><div className="detail-item"><label>Role</label><span>Manager</span></div><div className="detail-item"><label>Department</label><span>{myDetails?.employee?.departmentName || 'N/A'}</span></div><div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not set'}</span></div><div className="detail-item"><label>Address</label><span>{user?.address || 'Not set'}</span></div></div></div><div className="setting-item danger"><div><div className="setting-label">Delete Account</div><div className="setting-desc">Permanently delete your account</div></div><button className="btn-danger" onClick={handleDeleteAccount}>Delete</button></div></div>
//         )}

//         <footer className="client-footer"><p>© 2026 Manager Portal | Softmax.in</p></footer>
//       </main>

//       {/* MODALS */}
//       {showUpdateProjectModal && selectedProject && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowUpdateProjectModal(false)}>✕</button><h2>Update Status - {selectedProject.projectName}</h2><div className="m-form"><select value={updateProjectData.status} onChange={(e) => setUpdateProjectData({ ...updateProjectData, status: e.target.value })}><option value="PENDING">Pending</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="REJECTED">Rejected</option></select><textarea placeholder="Note" value={updateProjectData.note} onChange={(e) => setUpdateProjectData({ ...updateProjectData, note: e.target.value })} rows={3} /><button className="btn-msub" onClick={handleUpdateProjectStatus}>Update</button></div></div></div>)}

//       {showCreateTaskModal && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowCreateTaskModal(false)}>✕</button><h2>Create Task</h2><div className="m-form"><div className="form-field"><label>Project</label><select value={createTaskData.projectId} onChange={(e) => setCreateTaskData({ ...createTaskData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-field"><label>Assign To Consultant (use userId)</label><select value={createTaskData.assignedToUserId} onChange={(e) => setCreateTaskData({ ...createTaskData, assignedToUserId: parseInt(e.target.value) })}><option value="0">Select Consultant</option>{consultants.map(c => <option key={c.userId} value={c.userId}>{c.name} (⭐ {c.averageRating.toFixed(1)}) - {c.skill}</option>)}</select></div><div className="form-field"><label>Task Details</label><input placeholder="Task title" value={createTaskData.taskDetails} onChange={(e) => setCreateTaskData({ ...createTaskData, taskDetails: e.target.value })} /></div><div className="form-field"><label>Description</label><textarea placeholder="Description" value={createTaskData.description} onChange={(e) => setCreateTaskData({ ...createTaskData, description: e.target.value })} rows={3} /></div><div className="form-field"><label>Deadline</label><input type="date" value={createTaskData.deadline} onChange={(e) => setCreateTaskData({ ...createTaskData, deadline: e.target.value })} /></div><button className="btn-msub" onClick={handleCreateTask}>Create Task</button></div></div></div>)}

//       {showEditTaskModal && selectedTask && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowEditTaskModal(false)}>✕</button><h2>Edit Task</h2><div className="m-form"><input value={editTaskData.taskDetails} onChange={(e) => setEditTaskData({ ...editTaskData, taskDetails: e.target.value })} /><textarea value={editTaskData.description} onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })} rows={3} /><textarea placeholder="Manager Note" value={editTaskData.managerNote} onChange={(e) => setEditTaskData({ ...editTaskData, managerNote: e.target.value })} rows={2} /><select value={editTaskData.taskStatus} onChange={(e) => setEditTaskData({ ...editTaskData, taskStatus: e.target.value })}><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><button className="btn-msub" onClick={handleUpdateTask}>Save</button></div></div></div>)}

//       {showCreateTeamModal && (<div className="modal-mask open"><div className="modal-box large"><button className="m-close" onClick={() => setShowCreateTeamModal(false)}>✕</button><h2>Create Team</h2><div className="m-form"><div className="form-field"><label>Project</label><select value={createTeamData.projectId} onChange={(e) => setCreateTeamData({ ...createTeamData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myProjects.map(p => <option key={p.projectId} value={p.projectId}>{p.projectName}</option>)}</select></div><div className="form-field"><label>Team Name</label><input placeholder="Team Name" value={createTeamData.teamName} onChange={(e) => setCreateTeamData({ ...createTeamData, teamName: e.target.value })} /></div><div className="form-field"><label>Select Consultants (use userId)</label><div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem' }}>{consultants.map(c => (<label key={c.consultantId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}><input type="checkbox" checked={createTeamData.memberIds.includes(c.userId)} onChange={() => { const ids = createTeamData.memberIds.includes(c.userId) ? createTeamData.memberIds.filter(id => id !== c.userId) : [...createTeamData.memberIds, c.userId]; setCreateTeamData({ ...createTeamData, memberIds: ids }); }} /><span><strong>{c.name}</strong> - {c.skill} (⭐ {c.averageRating.toFixed(1)})</span></label>))}</div></div><button className="btn-msub" onClick={handleCreateTeam}>Create Team</button></div></div></div>)}

//       {showRateConsultantModal && selectedConsultant && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowRateConsultantModal(false)}>✕</button><h2>Rate {selectedConsultant.name}</h2><div className="m-form"><select value={rateConsultantData.rating} onChange={(e) => setRateConsultantData({ ...rateConsultantData, rating: parseFloat(e.target.value) })}><option value="0">Select Rating</option><option value="1">⭐ 1 - Poor</option><option value="2">⭐⭐ 2 - Fair</option><option value="3">⭐⭐⭐ 3 - Good</option><option value="4">⭐⭐⭐⭐ 4 - Very Good</option><option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option></select><textarea placeholder="Feedback" value={rateConsultantData.feedback} onChange={(e) => setRateConsultantData({ ...rateConsultantData, feedback: e.target.value })} rows={3} /><button className="btn-msub" onClick={handleRateConsultant}>Submit</button></div></div></div>)}

//       {showEmployeeTaskModal && selectedEmployeeTask && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowEmployeeTaskModal(false)}>✕</button><h2>Update Task</h2><p><strong>{selectedEmployeeTask.description}</strong></p><p>Priority: {selectedEmployeeTask.priority} | Current: {selectedEmployeeTask.status}</p><select value={employeeTaskStatus} onChange={(e) => setEmployeeTaskStatus(e.target.value)}><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select><textarea placeholder="Add note..." value={employeeTaskNote} onChange={(e) => setEmployeeTaskNote(e.target.value)} rows={3} /><div className="modal-actions"><button className="btn-primary" onClick={handleUpdateEmployeeTask}>Update Status</button><button className="btn-success" onClick={handleCompleteEmployeeTask}>Complete Task</button></div></div></div>)}

//       {showProjectDetailModal && selectedProject && (<div className="modal-mask open"><div className="modal-box large"><button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button><h2>{selectedProject.projectName}</h2><div className="m-tabs"><button className="m-tab active" onClick={() => { document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none'); document.getElementById('overview-tab')!.style.display = 'block'; }}>Overview</button><button className="m-tab" onClick={() => { document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none'); document.getElementById('teams-tab')!.style.display = 'block'; }}>Teams</button><button className="m-tab" onClick={() => { document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none'); document.getElementById('files-tab')!.style.display = 'block'; }}>Files</button><button className="m-tab" onClick={() => { document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none'); document.getElementById('history-tab')!.style.display = 'block'; }}>History</button></div><div id="overview-tab" className="m-tab-content"><div><label>Status:</label>{getStatusBadge(selectedProject.status)}</div><div><label>Description:</label><p>{selectedProject.projectDescription}</p></div><div className="detail-grid"><div><label>Type:</label>{selectedProject.projectType}</div><div><label>Client:</label>{selectedProject.clientName}</div><div><label>Department:</label>{selectedProject.departmentName}</div><div><label>Deadline:</label>{formatDate(selectedProject.deadline)}</div></div></div><div id="teams-tab" className="m-tab-content" style={{ display: 'none' }}>{selectedProjectTeams.map(team => (<div key={team.teamId} style={{ marginBottom: '1rem' }}><h3>{team.teamName}</h3>{team.members.map((m, i) => (<div key={i} className="team-member"><div className="member-avatar">{m.memberName.charAt(0)}</div><div><div className="member-name">{m.memberName}</div><div className="member-role">{m.role}</div></div></div>))}</div>))}</div><div id="files-tab" className="m-tab-content" style={{ display: 'none' }}><div className="upload-section"><input type="file" onChange={(e) => setUploadFileData({ ...uploadFileData, file: e.target.files?.[0] || null, projectId: selectedProject.projectId })} /><select value={uploadFileData.fileType} onChange={(e) => setUploadFileData({ ...uploadFileData, fileType: e.target.value })}><option value="">Type</option><option value="Document">Document</option><option value="Code">Code</option><option value="Image">Image</option><option value="PDF">PDF</option></select><button className="btn-primary" onClick={handleUploadFile}>Upload</button></div><div className="folder-view"><div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>{selectedProjectFiles.map(f => (<div key={f.fileId} className="folder-item" style={{ width: '150px', padding: '0.8rem', background: 'var(--surface)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }} onClick={() => handleViewFile(f.fileId)}><div style={{ fontSize: '2rem' }}>📄</div><div style={{ fontSize: '0.7rem', fontWeight: 500 }}>{f.fileLink?.split('/').pop()?.substring(0, 20)}</div><div style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{f.fileType}</div><button className="btn-icon" style={{ marginTop: '0.3rem' }} onClick={(e) => { e.stopPropagation(); handleDownloadFile(f.fileId); }}>⬇️</button></div>))}</div></div></div><div id="history-tab" className="m-tab-content" style={{ display: 'none' }}>{selectedProjectHistory.map(entry => (<div key={entry.statusId} className="history-entry"><div className="history-time">{formatDate(entry.dateTime)}</div><div>{getStatusBadge(entry.status)}</div><div><div>By: {entry.handledByName}</div>{entry.managerNote && <div className="history-note">{entry.managerNote}</div>}</div></div>))}</div></div></div>)}

//       {showProfileModal && (<div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowProfileModal(false)}>✕</button><h2>Edit Profile</h2><form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleUpdateProfile({ name: fd.get('name'), phoneNumber: fd.get('phoneNumber'), address: fd.get('address'), gender: fd.get('gender'), dob: fd.get('dob') }); }}><div className="m-form"><input name="name" defaultValue={user?.name} placeholder="Name" /><input name="phoneNumber" defaultValue={user?.phoneNumber} placeholder="Phone" /><input name="gender" defaultValue={user?.gender} placeholder="Gender" /><input name="dob" type="date" defaultValue={user?.dob} /><textarea name="address" rows={2} defaultValue={user?.address} placeholder="Address" /><button type="submit" className="btn-msub">Save</button></div></form></div></div>)}

//       <style jsx>{`
//         .project-selector-bar { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
//         .project-selector-left { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
//         .project-selector-left label { font-weight: 600; color: var(--teal); }
//         .project-search-wrapper { display: flex; gap: 0.5rem; }
//         .project-search-input { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); width: 200px; }
//         .project-select { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg); min-width: 250px; }
//         .project-selector-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
//         .action-btn { padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.2s; border: none; }
//         .action-btn.primary { background: var(--teal); color: white; }
//         .action-btn.success { background: var(--green); color: white; }
//         .action-btn.info { background: var(--blue); color: white; }
//         .action-btn.outline { background: transparent; border: 1px solid var(--teal); color: var(--teal); }
//         .action-btn:hover { transform: translateY(-2px); }
        
//         .emp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
//         .emp-card { background: var(--bg); border: 1px solid var(--border); border-radius: 18px; padding: 1.3rem; transition: all 0.3s ease; }
//         .emp-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); border-color: rgba(44, 166, 164, 0.3); }
//         .emp-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
//         .emp-avatar { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: rgba(44, 166, 164, 0.1); }
//         .emp-avatar.verified { background: rgba(52, 168, 83, 0.15); }
//         .avatar-img { width: 100%; height: 100%; border-radius: 14px; object-fit: cover; }
//         .emp-card h3 { font-size: 1rem; margin: 0 0 0.25rem; }
//         .dept-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; background: rgba(44, 166, 164, 0.12); color: var(--teal); }
//         .emp-body { margin-top: 0.75rem; }
//         .emp-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 0.8rem; }
//         .emp-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 0.5rem; }
//         .emp-footer button { padding: 0.4rem 1rem; border-radius: 20px; background: var(--teal); color: white; border: none; cursor: pointer; font-size: 0.75rem; }
//         .header-filters { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
//         .form-field { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.75rem; }
//         .form-field label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--muted); }
//         .form-field input, .form-field select, .form-field textarea { padding: 0.6rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); }
//         .team-member { display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: var(--surface); border-radius: 10px; margin-bottom: 0.5rem; }
//         .member-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
//         .member-name { font-weight: 600; font-size: 0.85rem; }
//         .member-role { font-size: 0.7rem; color: var(--teal); }
//         .upload-section { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1rem; }
//         .uploads-list { display: flex; flex-direction: column; gap: 0.5rem; }
//         .file-item { display: flex; align-items: center; gap: 1rem; padding: 0.6rem; background: var(--surface); border-radius: 10px; }
//         .file-actions { display: flex; gap: 0.3rem; }
//         .btn-icon { padding: 0.2rem 0.5rem; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); cursor: pointer; }
//         .history-entry { display: flex; gap: 1rem; padding: 0.6rem; border-bottom: 1px solid var(--border); }
//         .history-time { min-width: 150px; font-size: 0.7rem; color: var(--muted); }
//         .client-loader { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
//         .loader-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--teal); border-radius: 50%; animation: spin 0.8s linear infinite; }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         .view-all-link { color: var(--teal); background: none; border: none; cursor: pointer; }
//         .btn-success { background: linear-gradient(135deg, #27ae60, #229954); color: white; border: none; padding: 0.5rem 1rem; border-radius: 40px; cursor: pointer; }
//         .ai-section { background: linear-gradient(135deg, rgba(44, 166, 164, 0.1), rgba(31, 109, 168, 0.05)); border: 1px solid rgba(44, 166, 164, 0.3); border-radius: 16px; }
//         .folder-view { margin-top: 1rem; }
//         .folder-item { transition: transform 0.2s; }
//         .folder-item:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
//         @media (max-width: 768px) { .project-selector-bar { flex-direction: column; align-items: stretch; } .project-selector-left { flex-direction: column; align-items: stretch; } .project-search-wrapper { flex-direction: column; } .project-selector-actions { justify-content: center; } }
//       `}</style>
//     </div>
//   );
// };

// export default Manager;





