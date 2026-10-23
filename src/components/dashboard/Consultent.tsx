//@ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
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

interface ConsultantDetails {
  consultantId: number;
  userId: number;
  marks10: number;
  marks12: number;
  graduationMarks: number;
  stream: string;
  experience: string;
  skill: string;
  skillType: string;
  resumeLink: string;
  isApproved: string;
  salary?: number;
  averageRating?: number;
  totalReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Task {
  taskId: number;
  projectId: number;
  projectName: string;
  taskDetails: string;
  description: string;
  taskStatus: string;
  createdByName: string;
  deadline: string;
  managerNote: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectRequest {
  requestId: number;
  projectId: number;
  projectName: string;
  consultantName: string;
  requestedAt: string;
  status?: string;
}

interface DepartmentProject {
  projectId: number;
  projectName: string;
  projectDescription?: string;
  projectType?: string;
  status: string;
  departmentId: number;
  departmentName: string;
  hasRequested: boolean;
  isAssigned?: boolean;
  managerName?: string;
  clientName?: string;
  deadline?: string;
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

interface FileItem {
  fileId: number;
  fileType: string;
  fileLink: string;
  uploaderId?: number;
  uploaderName: string;
  uploadTime?: string;
  projectId?: number;
  projectName?: string;
  departmentId?: number;
  departmentName?: string;
}

interface Project {
  projectId: number;
  projectName: string;
  status: string;
  departmentName: string;
  projectDescription?: string;
  projectType?: string;
  clientName?: string;
  clientEmail?: string;
  assignedManagerName?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TeamProject {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectType: string;
  status: string;
  departmentName: string;
  clientName: string;
  managerName: string;
  deadline: string;
}

interface StatusHistory {
  statusId: number;
  status: string;
  note: string;
  dateTime: string;
}

interface LatestStatus {
  statusId: number;
  status: string;
  note: string;
  dateTime: string;
}

interface Rating {
  reviewId: number;
  consultantId: number;
  consultantName: string;
  reviewerName: string;
  reviewMarks: number;
  reviewNote: string;
  createdAt: string;
}

interface Role {
  id: number;
  ptype: string;
  stype: string;
  isApproved: string;
  createdAt: string;
}

interface MyDetails {
  user: UserProfile;
  roles: Role[];
  employee: null;
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
// CONSULTANT API FUNCTIONS
// ============================================

const applyAsConsultant = async (formData: FormData) => {
  return apiCall('POST', '/api/consultant/apply', formData, true);
};

const getMyConsultantDetails = async () => {
  return apiCall<{ success: boolean; data: ConsultantDetails }>('GET', '/api/consultant/my-details');
};

const updateConsultantDetails = async (formData: FormData) => {
  return apiCall('PUT', '/api/consultant/update', formData, true);
};

const getMyStatusHistory = async () => {
  return apiCall<{ success: boolean; data: StatusHistory[] }>('GET', '/api/consultant/my-status-history');
};

const getMyLatestStatus = async () => {
  return apiCall<{ success: boolean; data: LatestStatus }>('GET', '/api/consultant/my-latest-status');
};

const getMyRatings = async () => {
  return apiCall<{ success: boolean; data: Rating[] }>('GET', '/api/consultant/my-ratings');
};

const getMyAverageRating = async () => {
  return apiCall<{ success: boolean; data: number }>('GET', '/api/consultant/my-average-rating');
};

// ============================================
// TASK APIs
// ============================================

const getMyTasks = async () => {
  return apiCall<{ success: boolean; data: Task[] }>('GET', '/api/task/my-tasks');
};

const updateTaskStatus = async (taskId: number, status: string, managerNote?: string) => {
  let url = `/api/task/update-status/${taskId}?status=${status}`;
  if (managerNote) url += `&managerNote=${encodeURIComponent(managerNote)}`;
  return apiCall('PUT', url, null);
};

// ============================================
// PROJECT REQUEST APIs
// ============================================

const getDepartmentProjects = async () => {
  return apiCall<{ success: boolean; data: DepartmentProject[] }>('GET', '/api/consultant-project/department-projects');
};

const requestProject = async (projectId: number) => {
  return apiCall('POST', `/api/consultant-project/request/${projectId}`);
};

const getMyProjectRequests = async () => {
  return apiCall<{ success: boolean; data: ProjectRequest[] }>('GET', '/api/consultant-project/my-requests');
};

// ============================================
// CONSULTANT ASSIGNED PROJECTS API
// ============================================

const getMyAssignedProjects = async () => {
  return apiCall<{ success: boolean; data: TeamProject[] }>('GET', '/api/consultant-project/my-assigned-projects');
};

// ============================================
// TEAM APIs
// ============================================

const getMyConsultantTeams = async () => {
  return apiCall<{ success: boolean; data: Team[] }>('GET', '/api/team/my-consultant-teams');
};

const getProjectTeams = async (projectId: number) => {
  return apiCall<{ success: boolean; data: Team[] }>('GET', `/api/team/project/${projectId}`);
};

// ============================================
// FILE APIs (Only for assigned projects)
// ============================================

const uploadFile = async (projectId: number, file: File, fileType: string) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiCall('POST', `/api/file/upload/${projectId}?fileType=${fileType}`, formData, true);
};

const getProjectFiles = async (projectId: number) => {
  return apiCall<{ success: boolean; data: FileItem[] }>('GET', `/api/file/project/${projectId}`);
};

const getMyUploads = async () => {
  return apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/my-uploads');
};

const deleteFile = async (fileId: number) => {
  return apiCall('DELETE', `/api/file/delete/${fileId}`);
};

const getAccessToken = async (fileId: number) => {
  return apiCall('POST', `/api/file/access-token/${fileId}`, {});
};

// ============================================
// PROJECT APIs (View Only - No History)
// ============================================

const getProjectById = async (projectId: number) => {
  return apiCall<{ success: boolean; data: Project }>('GET', `/api/project/${projectId}`);
};

// ============================================
// USER PROFILE APIs
// ============================================

const getUserProfile = async () => {
  return apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
};

const updateUserProfile = async (data: any) => {
  return apiCall('PUT', '/api/users/profile', data);
};

const deleteAccount = async () => {
  return apiCall('DELETE', '/api/users/account');
};

const getMyDetails = async () => {
  return apiCall<{ success: boolean; data: MyDetails }>('GET', '/api/getmydetails');
};

// ============================================
// RESUME GENERATION
// ============================================

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

interface ResumeData {
  name: string;
  email: string;
  photo: string;
  marks10: string;
  marks12: string;
  graduationMarks: string;
  stream: string;
  experience: string;
  skill: string;
  skillType: string;
}

const generateResumeBlob = async (data: ResumeData): Promise<Blob> => {
  const res = await fetch("/templates/resume-template.docx");
  const content = await res.arrayBuffer();
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  
  doc.setData({
    name: data.name,
    email: data.email,
    photo: data.photo,
    marks10: data.marks10,
    marks12: data.marks12,
    graduationMarks: data.graduationMarks,
    stream: data.stream,
    experience: data.experience,
    skill: data.skill,
    skillType: data.skillType
  });
  
  doc.render();
  return doc.getZip().generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
};

const generateResume = async (data: ResumeData) => {
  const blob = await generateResumeBlob(data);
  saveAs(blob, "resume.docx");
};

// ============================================
// SIDEBAR MENU ITEMS
// ============================================

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'activity-log', label: 'Activity Log', icon: '📋' },
  { id: 'my-details', label: 'My Details', icon: '📝' },
  { id: 'my-tasks', label: 'My Tasks', icon: '✅' },
  { id: 'projects', label: 'Available Projects', icon: '📁' },
  { id: 'my-requests', label: 'My Requests', icon: '📨' },
  { id: 'my-teams', label: 'My Teams', icon: '👥' },
  { id: 'my-assigned-projects', label: 'My Projects', icon: '🚀' },
  { id: 'my-uploads', label: 'My Uploads', icon: '📎' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

// ============================================
// STATUS CONFIGURATION
// ============================================

const statusConfig: Record<string, { label: string; class: string; icon: string; color: string }> = {
  APPLIED: { label: 'Applied', class: 'status-pending', icon: '📝', color: '#F59E0B' },
  DOCUMENT_VERIFIED: { label: 'Documents Verified', class: 'status-progress', icon: '✓', color: '#3B82F6' },
  INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', class: 'status-progress', icon: '📅', color: '#8B5CF6' },
  INTERVIEW_PASSED: { label: 'Interview Passed', class: 'status-progress', icon: '🎉', color: '#10B981' },
  INTERVIEW_FAILED: { label: 'Interview Failed', class: 'status-rejected', icon: '❌', color: '#EF4444' },
  APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅', color: '#10B981' },
  REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '🚫', color: '#EF4444' },
  ACTIVE: { label: 'Active', class: 'status-approved', icon: '🟢', color: '#10B981' },
  INACTIVE: { label: 'Inactive', class: 'status-rejected', icon: '⚪', color: '#6B7280' },
  BLOCKED: { label: 'Blocked', class: 'status-rejected', icon: '🔴', color: '#EF4444' },
  PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳', color: '#F59E0B' },
  IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄', color: '#3B82F6' },
  COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️', color: '#10B981' },
  ASSIGNED: { label: 'Assigned', class: 'status-assigned', icon: '👥', color: '#8B5CF6' },
};

const getStatusBadge = (status: string) => {
  const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌', color: '#6B7280' };
  return <span className={`status-badge ${config.class}`}>{config.icon} {config.label}</span>;
};

// ============================================
// MAIN CONSULTANT COMPONENT
// ============================================

const Consultant: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [myDetails, setMyDetails] = useState<MyDetails | null>(null);
  const [consultantDetails, setConsultantDetails] = useState<ConsultantDetails | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [latestStatus, setLatestStatus] = useState<LatestStatus | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);

  // Data states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departmentProjects, setDepartmentProjects] = useState<DepartmentProject[]>([]);
  const [myRequests, setMyRequests] = useState<ProjectRequest[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [myUploads, setMyUploads] = useState<FileItem[]>([]);
  const [myAssignedProjects, setMyAssignedProjects] = useState<TeamProject[]>([]);

  // Modal states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectForFiles, setSelectedProjectForFiles] = useState<number | null>(null);
  const [projectFiles, setProjectFiles] = useState<FileItem[]>([]);
  const [projectTeams, setProjectTeams] = useState<Team[]>([]);
  
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('overview');
  const [selectedModalProjectId, setSelectedModalProjectId] = useState<number | null>(null);
  
  const { logout } = useAuth();

  // Form states
  const [updateTaskData, setUpdateTaskData] = useState({ status: '', managerNote: '' });
  const [uploadData, setUploadData] = useState({ file: null as File | null, fileType: '', projectId: 0 });
  const [applyFormData, setApplyFormData] = useState({
    marks10: '', marks12: '', graduationMarks: '', stream: '', experience: '', skill: '', skillType: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [deletingFile, setDeletingFile] = useState<number | null>(null);
  
  // Filter states
  const [taskFilter, setTaskFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [profileRes, detailsRes, consultantRes, statusHistoryRes, latestStatusRes, ratingsRes, avgRatingRes] = await Promise.all([
        getUserProfile().catch(() => ({ data: null })),
        getMyDetails().catch(() => ({ data: null })),
        getMyConsultantDetails().catch(() => ({ data: null })),
        getMyStatusHistory().catch(() => ({ data: [] })),
        getMyLatestStatus().catch(() => ({ data: null })),
        getMyRatings().catch(() => ({ data: [] })),
        getMyAverageRating().catch(() => ({ data: 0 })),
      ]);

      setUser(profileRes.data);
      setMyDetails(detailsRes.data);
      setConsultantDetails(consultantRes.data || null);
      setStatusHistory(statusHistoryRes.data || []);
      setLatestStatus(latestStatusRes.data || null);
      setRatings(ratingsRes.data || []);
      setAverageRating(avgRatingRes.data || 0);
      
      if (consultantRes.data) {
        await loadAllData();
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [tasksRes, projectsRes, requestsRes, teamsRes, uploadsRes, assignedProjectsRes] = await Promise.all([
        getMyTasks().catch(() => ({ data: [] })),
        getDepartmentProjects().catch(() => ({ data: [] })),
        getMyProjectRequests().catch(() => ({ data: [] })),
        getMyConsultantTeams().catch(() => ({ data: [] })),
        getMyUploads().catch(() => ({ data: [] })),
        getMyAssignedProjects().catch(() => ({ data: [] })),
      ]);

      setTasks(tasksRes.data);
      setDepartmentProjects(projectsRes.data);
      setMyRequests(requestsRes.data);
      setMyTeams(teamsRes.data);
      setMyUploads(uploadsRes.data);
      setMyAssignedProjects(assignedProjectsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleGenerateResume = async () => {
    if (!consultantDetails || !user) { alert('Consultant details not found'); return; }
    const resumeData: ResumeData = {
      name: user.name, email: user.email, photo: user.photoUrl || '',
      marks10: consultantDetails.marks10.toString(), marks12: consultantDetails.marks12.toString(),
      graduationMarks: consultantDetails.graduationMarks.toString(), stream: consultantDetails.stream,
      experience: consultantDetails.experience, skill: consultantDetails.skill, skillType: consultantDetails.skillType,
    };
    try {
      await generateResume(resumeData);
      alert('Resume downloaded successfully');
    } catch (error) {
      alert('Failed to generate resume');
    }
  };

  const handleApplyAsConsultant = async () => {
    try {
      const formData = new FormData();
      formData.append('marks10', applyFormData.marks10);
      formData.append('marks12', applyFormData.marks12);
      formData.append('graduationMarks', applyFormData.graduationMarks);
      formData.append('stream', applyFormData.stream);
      formData.append('experience', applyFormData.experience);
      formData.append('skill', applyFormData.skill);
      formData.append('skillType', applyFormData.skillType);
      if (resumeFile) formData.append('resume', resumeFile);

      await applyAsConsultant(formData);
      alert('Application submitted successfully');
      
      const consultantRes = await getMyConsultantDetails();
      setConsultantDetails(consultantRes.data);
      const statusHistoryRes = await getMyStatusHistory();
      setStatusHistory(statusHistoryRes.data);
      const latestStatusRes = await getMyLatestStatus();
      setLatestStatus(latestStatusRes.data);
      setShowApplyModal(false);
      setApplyFormData({ marks10: '', marks12: '', graduationMarks: '', stream: '', experience: '', skill: '', skillType: '' });
      setResumeFile(null);
      await loadAllData();
    } catch (error: any) {
      alert(error.message || 'Failed to submit application');
    }
  };

  const handleUpdateConsultantDetails = async () => {
    try {
      const formData = new FormData();
      formData.append('marks10', applyFormData.marks10);
      formData.append('marks12', applyFormData.marks12);
      formData.append('graduationMarks', applyFormData.graduationMarks);
      formData.append('stream', applyFormData.stream);
      formData.append('experience', applyFormData.experience);
      formData.append('skill', applyFormData.skill);
      formData.append('skillType', applyFormData.skillType);
      if (resumeFile) formData.append('resume', resumeFile);

      await updateConsultantDetails(formData);
      alert('Details updated successfully');
      const consultantRes = await getMyConsultantDetails();
      setConsultantDetails(consultantRes.data);
      setShowEditDetailsModal(false);
      await loadAllData();
    } catch (error: any) {
      alert(error.message || 'Failed to update details');
    }
  };

  const handleUpdateTaskStatus = async () => {
    if (!selectedTask || !updateTaskData.status) { alert('Please select a status'); return; }
    try {
      await updateTaskStatus(selectedTask.taskId, updateTaskData.status, updateTaskData.managerNote);
      await loadAllData();
      setShowUpdateTaskModal(false);
      setSelectedTask(null);
      setUpdateTaskData({ status: '', managerNote: '' });
      alert('Task status updated successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to update task status');
    }
  };

  const handleRequestProject = async (projectId: number) => {
    try {
      await requestProject(projectId);
      await loadAllData();
      alert('Project request sent successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to request project');
    }
  };

  const handleUploadFile = async () => {
    if (!selectedProjectForFiles || !uploadData.file || !uploadData.fileType) {
      alert('Please select a project, file, and file type');
      return;
    }
    try {
      await uploadFile(selectedProjectForFiles, uploadData.file, uploadData.fileType);
      const filesRes = await getProjectFiles(selectedProjectForFiles);
      setProjectFiles(filesRes.data);
      const uploadsRes = await getMyUploads();
      setMyUploads(uploadsRes.data);
      setUploadData({ file: null, fileType: '', projectId: 0 });
      alert('File uploaded successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to upload file');
    }
  };

  const handleViewFile = async (fileId: number) => {
    try {
      const tokenRes: any = await getAccessToken(fileId);
      if (tokenRes.success && tokenRes.data) {
        window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
      } else { alert('Cannot view file'); }
    } catch (error) { alert('Cannot view file'); }
  };

  const handleDownloadFile = async (fileId: number) => {
    try {
      const tokenRes = await getAccessToken(fileId);
      if (tokenRes.success && tokenRes.data) {
        window.open(`${API_BASE}${tokenRes.data.downloadUrl}`, '_blank');
      } else { alert('Cannot download file'); }
    } catch (error) { alert('Download failed'); }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    setDeletingFile(fileId);
    try {
      await deleteFile(fileId);
      if (selectedProjectForFiles) {
        const filesRes = await getProjectFiles(selectedProjectForFiles);
        setProjectFiles(filesRes.data);
      }
      const uploadsRes = await getMyUploads();
      setMyUploads(uploadsRes.data);
      alert('File deleted successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to delete file');
    } finally {
      setDeletingFile(null);
    }
  };

  // Handle project view - different based on where it's called from
  const handleViewAssignedProject = async (projectId: number) => {
    setSelectedModalProjectId(projectId);
    setActiveModalTab('overview');
    try {
      const [projectRes, teamsRes, filesRes] = await Promise.all([
        getProjectById(projectId),
        getProjectTeams(projectId).catch(() => ({ data: [] })),
        getProjectFiles(projectId).catch(() => ({ data: [] })),
      ]);
      setSelectedProject(projectRes.data);
      setProjectTeams(teamsRes.data);
      setProjectFiles(filesRes.data);
      setSelectedProjectForFiles(projectId);
      setShowProjectDetailModal(true);
    } catch (error: any) {
      alert(error.message || 'Failed to load project details');
    }
  };

  const handleViewAvailableProject = async (projectId: number) => {
    setSelectedModalProjectId(projectId);
    try {
      const projectRes = await getProjectById(projectId);
      setSelectedProject(projectRes.data);
      setShowProjectDetailModal(true);
    } catch (error: any) {
      alert(error.message || 'Failed to load project details');
    }
  };

  const handleUpdateProfile = async (data: any) => {
    try {
      await updateUserProfile(data);
      const profileRes = await getUserProfile();
      setUser(profileRes.data);
      setShowProfileModal(false);
      alert('Profile updated successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteAccount();
        await logout();
        window.location.href = '/';
      } catch (error: any) {
        alert(error.message || 'Failed to delete account');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'pending') return task.taskStatus === 'PENDING';
    if (taskFilter === 'in_progress') return task.taskStatus === 'IN_PROGRESS';
    if (taskFilter === 'completed') return task.taskStatus === 'COMPLETED';
    return true;
  }).filter(task => task.taskDetails.toLowerCase().includes(searchQuery.toLowerCase()) || task.projectName.toLowerCase().includes(searchQuery.toLowerCase()));

  const hasApplied = consultantDetails !== null;
  const displayAverageRating = averageRating > 0 ? averageRating : (ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.reviewMarks, 0) / ratings.length : 0);
  const getStatusColor = (status: string) => statusConfig[status]?.color || '#6B7280';
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  // Group uploads by project for folder view
  const groupedUploads = React.useMemo(() => {
    const grouped: { [key: string]: FileItem[] } = {};
    myUploads.forEach(upload => {
      const key = upload.projectName || 'Other';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(upload);
    });
    return grouped;
  }, [myUploads]);

  if (loading) {
    return <div className="client-loader"><div className="loader-spinner"></div></div>;
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
        title="Consultant Portal"
        logoIcon="👨‍💻"
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>☰</button>

      <main className="client-main">
        <header className="client-header">
          <div className="header-welcome">
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'Consultant'}!</h1>
            <p>Consultant Dashboard - Project Management Portal</p>
          </div>
          <div className="header-stats">
            <div className="header-stat-item">
              <span className="stat-label">Status</span>
              <span className="stat-value-sm">
                {latestStatus ? getStatusBadge(latestStatus.status) : <span className="status-badge status-pending">⏳ Not Applied</span>}
              </span>
            </div>
            <div className="header-stat-item">
              <span className="stat-label">Rating</span>
              <span className="stat-value-sm">⭐ {displayAverageRating.toFixed(1)} / 5</span>
            </div>
            <div className="header-stat-item">
              <span className="stat-label">Tasks</span>
              <span className="stat-value-sm">{tasks.filter(t => t.taskStatus !== 'COMPLETED').length} Active</span>
            </div>
          </div>
        </header>

        {/* Apply Form */}
        {!hasApplied && (
          <div className="dashboard-card">
            <div className="card-header"><h2>Complete Your Consultant Application</h2><p className="card-subtitle">Fill in your details to apply as a consultant</p></div>
            <div className="apply-form">
              <div className="details-grid">
                <div className="form-field"><label>10th Marks (%)</label><input type="number" placeholder="e.g., 85.5" value={applyFormData.marks10} onChange={(e) => setApplyFormData({ ...applyFormData, marks10: e.target.value })} /></div>
                <div className="form-field"><label>12th Marks (%)</label><input type="number" placeholder="e.g., 78.0" value={applyFormData.marks12} onChange={(e) => setApplyFormData({ ...applyFormData, marks12: e.target.value })} /></div>
                <div className="form-field"><label>Graduation Marks (%)</label><input type="number" placeholder="e.g., 72.3" value={applyFormData.graduationMarks} onChange={(e) => setApplyFormData({ ...applyFormData, graduationMarks: e.target.value })} /></div>
                <div className="form-field"><label>Stream</label><input type="text" placeholder="e.g., Computer Science" value={applyFormData.stream} onChange={(e) => setApplyFormData({ ...applyFormData, stream: e.target.value })} /></div>
                <div className="form-field"><label>Experience</label><input type="text" placeholder="e.g., 3 years" value={applyFormData.experience} onChange={(e) => setApplyFormData({ ...applyFormData, experience: e.target.value })} /></div>
                <div className="form-field"><label>Skills</label><input type="text" placeholder="e.g., Java, Spring Boot, React" value={applyFormData.skill} onChange={(e) => setApplyFormData({ ...applyFormData, skill: e.target.value })} /></div>
                <div className="form-field"><label>Skill Type</label><input type="text" placeholder="e.g., Full Stack" value={applyFormData.skillType} onChange={(e) => setApplyFormData({ ...applyFormData, skillType: e.target.value })} /></div>
                <div className="form-field"><label>Resume (PDF/DOC)</label><input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />{resumeFile && <small>{resumeFile.name}</small>}</div>
              </div>
              <button className="btn-msub" onClick={handleApplyAsConsultant}>Submit Application</button>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeNav === 'dashboard' && hasApplied && (
          <>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-icon blue">✅</div><div className="stat-info"><span className="stat-value">{tasks.length}</span><span className="stat-label">Total Tasks</span></div></div>
              <div className="stat-card"><div className="stat-icon green">🔄</div><div className="stat-info"><span className="stat-value">{tasks.filter(t => t.taskStatus === 'IN_PROGRESS').length}</span><span className="stat-label">In Progress</span></div></div>
              <div className="stat-card"><div className="stat-icon orange">📁</div><div className="stat-info"><span className="stat-value">{departmentProjects.length}</span><span className="stat-label">Available Projects</span></div></div>
              <div className="stat-card"><div className="stat-icon purple">👥</div><div className="stat-info"><span className="stat-value">{myTeams.length}</span><span className="stat-label">My Teams</span></div></div>
            </div>

            {latestStatus && (
              <div className="dashboard-card status-card">
                <div className="card-header"><h2>📊 Current Activity Status</h2><span className="status-badge-large" style={{ backgroundColor: getStatusColor(latestStatus.status) }}>{statusConfig[latestStatus.status]?.icon} {statusConfig[latestStatus.status]?.label}</span></div>
                <div className="status-details"><p><strong>Note:</strong> {latestStatus.note || 'No additional notes'}</p><p><strong>Last Updated:</strong> {formatDate(latestStatus.dateTime)}</p></div>
              </div>
            )}

            {ratings.length > 0 && (
              <div className="dashboard-card">
                <div className="card-header"><h2>⭐ My Ratings & Reviews</h2><div className="average-rating">Average: <strong>{displayAverageRating.toFixed(1)} / 5</strong> ({ratings.length} reviews)</div></div>
                <div className="ratings-list">{ratings.slice(0, 3).map(rating => (<div key={rating.reviewId} className="rating-item"><div className="rating-header"><strong>{rating.reviewerName}</strong><span className="rating-stars">⭐ {rating.reviewMarks}/5</span></div><p className="rating-note">{rating.reviewNote}</p><small className="rating-date">{formatDate(rating.createdAt)}</small></div>))}</div>
                {ratings.length > 3 && <button className="view-all-link" onClick={() => alert('All ratings feature coming soon')}>View All {ratings.length} Reviews →</button>}
              </div>
            )}

            <div className="dashboard-card">
              <div className="card-header"><h2>My Recent Tasks</h2><button className="view-all-link" onClick={() => setActiveNav('my-tasks')}>View All →</button></div>
              <div className="projects-grid">{tasks.slice(0, 3).map(task => (<div key={task.taskId} className="project-card"><div className="project-card-header"><h3>{task.taskDetails}</h3>{getStatusBadge(task.taskStatus)}</div><p className="project-card-desc">{task.description?.substring(0, 80) || 'No description'}</p><div className="project-card-meta"><span>📁 {task.projectName}</span><span>👤 {task.createdByName}</span>{task.deadline && <span>📅 Due: {new Date(task.deadline).toLocaleDateString()}</span>}</div><div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => { setSelectedTask(task); setShowTaskModal(true); }}>View Details</button>{task.taskStatus !== 'COMPLETED' && <button className="btn-sm btn-outline" onClick={() => { setSelectedTask(task); setShowUpdateTaskModal(true); }}>Update Status</button>}</div></div>))}</div>
              {tasks.length === 0 && <div className="empty-state"><span className="empty-icon">✅</span><p>No tasks assigned yet</p></div>}
            </div>

            <div className="dashboard-card">
              <div className="card-header"><h2>Available Projects</h2><button className="view-all-link" onClick={() => setActiveNav('projects')}>View All →</button></div>
              <div className="projects-grid">{departmentProjects.slice(0, 3).map(project => (<div key={project.projectId} className="project-card"><div className="project-card-header"><h3>{project.projectName}</h3>{getStatusBadge(project.status)}</div><div className="project-card-meta"><span>🏢 {project.departmentName}</span>{project.managerName && <span>👔 {project.managerName}</span>}</div><div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => handleViewAvailableProject(project.projectId)}>View Details</button>{!project.hasRequested && project.status === 'IN_PROGRESS' && <button className="btn-sm btn-outline" onClick={() => handleRequestProject(project.projectId)}>Request to Join</button>}{project.hasRequested && <span className="status-badge status-pending">⏳ Requested</span>}</div></div>))}</div>
              {departmentProjects.length === 0 && <div className="empty-state"><span className="empty-icon">📁</span><p>No projects available</p></div>}
            </div>
          </>
        )}

        {/* Activity Log Tab */}
        {activeNav === 'activity-log' && hasApplied && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>📋 Activity Log & Status History</h2><div className="activity-summary"><span className="activity-badge">Total Updates: {statusHistory.length}</span></div></div>
            <div className="activity-timeline">
              {statusHistory.length === 0 ? <div className="empty-state"><span className="empty-icon">📭</span><p>No activity history available yet</p></div> :
                [...statusHistory].reverse().map((entry, index) => {
                  const config = statusConfig[entry.status] || { icon: '📌', label: entry.status, color: '#6B7280' };
                  return (<div key={entry.statusId} className="timeline-item"><div className="timeline-dot-wrapper"><div className="timeline-dot" style={{ backgroundColor: config.color }}></div>{index < statusHistory.length - 1 && <div className="timeline-line"></div>}</div><div className="timeline-content"><div className="timeline-header"><span className="timeline-status-icon">{config.icon}</span><span className="timeline-status-label" style={{ color: config.color }}>{config.label}</span><span className="timeline-date">{formatDate(entry.dateTime)}</span></div>{entry.note && <div className="timeline-note"><span className="note-icon">📝</span><span className="note-text">{entry.note}</span></div>}</div></div>);
                })}
            </div>
          </div>
        )}

        {/* My Details Tab */}
        {activeNav === 'my-details' && consultantDetails && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>My Consultant Details</h2><div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}><button className="btn-outline" onClick={handleGenerateResume}>📄 Download Resume</button><button className="btn-outline" onClick={() => { setApplyFormData({ marks10: consultantDetails.marks10.toString(), marks12: consultantDetails.marks12.toString(), graduationMarks: consultantDetails.graduationMarks.toString(), stream: consultantDetails.stream, experience: consultantDetails.experience, skill: consultantDetails.skill, skillType: consultantDetails.skillType }); setShowEditDetailsModal(true); }}>✏️ Edit Details</button></div></div>
            <div className="details-grid">
              <div className="detail-item"><label>Status</label>{getStatusBadge(consultantDetails.isApproved)}</div>
              <div className="detail-item"><label>Rating</label><span>⭐ {displayAverageRating.toFixed(1)} / 5 ({ratings.length} reviews)</span></div>
              {consultantDetails.salary && consultantDetails.salary > 0 && <div className="detail-item"><label>Salary</label><span>💰 ₹{consultantDetails.salary.toLocaleString()}/month</span></div>}
              <div className="detail-item"><label>10th Marks</label><span>{consultantDetails.marks10}%</span></div>
              <div className="detail-item"><label>12th Marks</label><span>{consultantDetails.marks12}%</span></div>
              <div className="detail-item"><label>Graduation Marks</label><span>{consultantDetails.graduationMarks}%</span></div>
              <div className="detail-item"><label>Stream</label><span>{consultantDetails.stream}</span></div>
              <div className="detail-item"><label>Experience</label><span>{consultantDetails.experience}</span></div>
              <div className="detail-item"><label>Skills</label><span className="skills-tags">{consultantDetails.skill.split(',').map((s, i) => (<span key={i} className="skill-tag">{s.trim()}</span>))}</span></div>
              <div className="detail-item"><label>Skill Type</label><span>{consultantDetails.skillType}</span></div>
              <div className="detail-item"><label>Resume</label>{consultantDetails.resumeLink && <a href={consultantDetails.resumeLink} target="_blank" rel="noopener noreferrer" className="resume-link">📄 View Resume</a>}</div>
              {consultantDetails.createdAt && <div className="detail-item"><label>Applied On</label><span>{formatDate(consultantDetails.createdAt)}</span></div>}
              {consultantDetails.updatedAt && <div className="detail-item"><label>Last Updated</label><span>{formatDate(consultantDetails.updatedAt)}</span></div>}
            </div>
          </div>
        )}

        {/* My Tasks Tab */}
        {activeNav === 'my-tasks' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>My Tasks</h2><div className="header-filters"><select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}><option value="all">All Tasks</option><option value="pending">⏳ Pending</option><option value="in_progress">🔄 In Progress</option><option value="completed">✅ Completed</option></select><input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" /></div></div>
            <div className="projects-grid">{filteredTasks.map(task => (<div key={task.taskId} className="project-card"><div className="project-card-header"><h3>{task.taskDetails}</h3>{getStatusBadge(task.taskStatus)}</div><p className="project-card-desc">{task.description?.substring(0, 100) || 'No description'}</p><div className="project-card-meta"><span>📁 {task.projectName}</span><span>👤 {task.createdByName}</span>{task.deadline && <span>📅 Due: {new Date(task.deadline).toLocaleDateString()}</span>}</div>{task.managerNote && <div className="project-card-manager">📝 Note: {task.managerNote}</div>}<div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => { setSelectedTask(task); setShowTaskModal(true); }}>View Details</button>{task.taskStatus !== 'COMPLETED' && <button className="btn-sm btn-outline" onClick={() => { setSelectedTask(task); setShowUpdateTaskModal(true); }}>Update Status</button>}</div></div>))}</div>
            {filteredTasks.length === 0 && <div className="empty-state"><span className="empty-icon">✅</span><p>No tasks found</p></div>}
          </div>
        )}

        {/* Available Projects Tab (Only Overview) */}
        {activeNav === 'projects' && (
          <div className="dashboard-card full-width">
            <h2>Available Projects</h2>
            <div className="projects-grid">{departmentProjects.map(project => (<div key={project.projectId} className="project-card"><div className="project-card-header"><h3>{project.projectName}</h3>{getStatusBadge(project.status)}</div><p className="project-card-desc">{project.projectDescription?.substring(0, 80) || 'No description'}</p><div className="project-card-meta"><span>🏢 {project.departmentName}</span><span>📱 {project.projectType || 'N/A'}</span>{project.managerName && <span>👔 {project.managerName}</span>}{project.deadline && <span>📅 Deadline: {new Date(project.deadline).toLocaleDateString()}</span>}</div><div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => handleViewAvailableProject(project.projectId)}>View Details</button>{!project.hasRequested && project.status === 'IN_PROGRESS' && <button className="btn-sm btn-outline" onClick={() => handleRequestProject(project.projectId)}>Request to Join</button>}{project.hasRequested && <span className="status-badge status-pending">⏳ Request Sent</span>}</div></div>))}</div>
            {departmentProjects.length === 0 && <div className="empty-state"><span className="empty-icon">📁</span><p>No projects available</p></div>}
          </div>
        )}

        {/* My Requests Tab */}
        {activeNav === 'my-requests' && (
          <div className="dashboard-card full-width">
            <h2>My Project Requests</h2>
            <div className="projects-grid">{myRequests.map(request => (<div key={request.requestId} className="project-card"><div className="project-card-header"><h3>{request.projectName}</h3><span className="status-badge status-pending">⏳ Requested</span></div><div className="project-card-meta"><span>📅 Requested: {formatDate(request.requestedAt)}</span></div><div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => handleViewAvailableProject(request.projectId)}>View Project</button></div></div>))}</div>
            {myRequests.length === 0 && <div className="empty-state"><span className="empty-icon">📨</span><p>No project requests found</p></div>}
          </div>
        )}

        {/* My Teams Tab */}
        {activeNav === 'my-teams' && (
          <div className="dashboard-card full-width">
            <h2>My Teams</h2>
            {myTeams.map(team => (<div key={team.teamId} className="team-section" style={{ marginBottom: '2rem' }}><h3>{team.teamName}</h3><div className="team-manager">Project: {team.projectName}</div><div className="team-manager">Manager: {team.managerName}</div><div className="team-members"><h4>Team Members ({team.members.length})</h4>{team.members.map((member, idx) => (<div key={idx} className="team-member"><div className="member-avatar">{member.memberName.charAt(0)}</div><div className="member-info"><div className="member-name">{member.memberName}</div><div className="member-role">{member.role}</div>{member.memberEmail && <div className="member-email">{member.memberEmail}</div>}</div></div>))}</div></div>))}
            {myTeams.length === 0 && <div className="empty-state"><span className="empty-icon">👥</span><p>No teams assigned yet</p></div>}
          </div>
        )}

        {/* My Assigned Projects Tab (Full access - Files, Teams) */}
        {activeNav === 'my-assigned-projects' && (
          <div className="dashboard-card full-width">
            <h2>🚀 My Projects</h2>
            <p className="card-subtitle">Projects where I am a team member - Full access to files and team details</p>
            <div className="projects-grid">{myAssignedProjects.map(project => (<div key={project.projectId} className="project-card"><div className="project-card-header"><h3>{project.projectName}</h3>{getStatusBadge(project.status)}</div><p className="project-card-desc">{project.projectDescription?.substring(0, 100) || 'No description'}</p><div className="project-card-meta"><span>🏢 {project.departmentName}</span><span>📱 {project.projectType || 'N/A'}</span><span>👔 {project.managerName}</span><span>👤 {project.clientName}</span>{project.deadline && <span>📅 Deadline: {new Date(project.deadline).toLocaleDateString()}</span>}</div><div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => handleViewAssignedProject(project.projectId)}>View Details</button></div></div>))}</div>
            {myAssignedProjects.length === 0 && <div className="empty-state"><span className="empty-icon">🚀</span><p>No team projects assigned yet. Once you're added to a team, projects will appear here.</p></div>}
          </div>
        )}

        {/* My Uploads Tab - Folder Design */}
        {activeNav === 'my-uploads' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>📎 My Uploads</h2><p className="card-subtitle">Files you have uploaded to projects - grouped by project</p></div>
            <div className="upload-section">
              <select value={uploadData.projectId} onChange={(e) => setUploadData({ ...uploadData, projectId: parseInt(e.target.value) })}><option value="0">Select Project</option>{myTeams.map(team => (<option key={team.teamId} value={team.projectId}>{team.projectName}</option>))}</select>
              <input type="file" onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })} />
              <select value={uploadData.fileType} onChange={(e) => setUploadData({ ...uploadData, fileType: e.target.value })}><option value="">Select Type</option><option value="Document">📄 Document</option><option value="Code">💻 Code</option><option value="Image">🖼️ Image</option><option value="PDF">📕 PDF</option><option value="Report">📊 Report</option></select>
              <button className="btn-primary" onClick={handleUploadFile} disabled={!uploadData.file || !uploadData.projectId}>📤 Upload File</button>
            </div>
            {Object.keys(groupedUploads).length === 0 ? <div className="empty-state"><span className="empty-icon">📎</span><p>No files uploaded yet. Upload files from your project details.</p></div> : (
              <div className="folder-structure">{Object.entries(groupedUploads).map(([projectName, files]) => (<div key={projectName} className="folder-card"><div className="folder-header"><span className="folder-icon">📁</span><span className="folder-name">{projectName}</span><span className="file-count">{files.length} file{files.length !== 1 ? 's' : ''}</span></div><div className="folder-files">{files.map(file => (<div key={file.fileId} className="file-item"><div className="file-icon">{file.fileType === 'Image' ? '🖼️' : file.fileType === 'Code' ? '💻' : file.fileType === 'PDF' ? '📕' : file.fileType === 'Report' ? '📊' : '📄'}</div><div className="file-info"><div className="file-name">{file.fileLink?.split('/').pop() || 'File'}</div><div className="file-type-badge">{file.fileType || 'File'}</div>{file.uploadTime && <div className="file-date">{formatDate(file.uploadTime)}</div>}</div><div className="file-actions"><button className="btn-icon" onClick={() => handleViewFile(file.fileId)}>👁️ View</button><button className="btn-icon" onClick={() => handleDownloadFile(file.fileId)}>📥 Download</button><button className="btn-icon danger" onClick={() => handleDeleteFile(file.fileId)} disabled={deletingFile === file.fileId}>{deletingFile === file.fileId ? '⏳' : '🗑️ Delete'}</button></div></div>))}</div></div>))}</div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeNav === 'profile' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>Profile Information</h2><button className="btn-outline" onClick={() => setShowProfileModal(true)}>✏️ Edit Profile</button></div>
            <div className="profile-info"><div className="profile-avatar-large">{user?.photoUrl ? <img src={user.photoUrl} alt={user.name} /> : <div className="avatar-placeholder">{user?.name?.charAt(0) || 'C'}</div>}</div><div className="profile-details"><div className="detail-item"><label>Full Name</label><span>{user?.name}</span></div><div className="detail-item"><label>Email</label><span>{user?.email}</span></div><div className="detail-item"><label>Role</label><span>Consultant</span></div><div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not provided'}</span></div><div className="detail-item"><label>Address</label><span>{user?.address || 'Not provided'}</span></div></div></div>
            <div className="setting-item danger" style={{ marginTop: '2rem' }}><div><div className="setting-label">Delete Account</div><div className="setting-desc">Permanently delete your account and all data</div></div><button className="btn-danger" onClick={handleDeleteAccount}>Delete Account</button></div>
          </div>
        )}

        <footer className="client-footer"><p>© 2026 Gaurion Bharat | Developed by <a href='https://softmax.in' style={{ color: 'skyblue' }}>Softmax.in</a></p></footer>
      </main>

      {/* Task Detail Modal */}
      {showTaskModal && selectedTask && (
        <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowTaskModal(false)}>✕</button><h2>{selectedTask.taskDetails}</h2><div className="project-detail-section"><div className="detail-row"><label>Project:</label><span>{selectedTask.projectName}</span></div><div className="detail-row"><label>Status:</label>{getStatusBadge(selectedTask.taskStatus)}</div><div className="detail-row"><label>Description:</label><p>{selectedTask.description || 'No description'}</p></div><div className="detail-row"><label>Created By:</label><span>{selectedTask.createdByName}</span></div>{selectedTask.deadline && <div className="detail-row"><label>Deadline:</label><span>{new Date(selectedTask.deadline).toLocaleString()}</span></div>}{selectedTask.managerNote && <div className="detail-row"><label>Manager Note:</label><span>{selectedTask.managerNote}</span></div>}</div></div></div>
      )}

      {/* Update Task Status Modal */}
      {showUpdateTaskModal && selectedTask && (
        <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowUpdateTaskModal(false)}>✕</button><h2>Update Task Status</h2><p className="task-name">{selectedTask.taskDetails}</p><div className="m-form"><div className="form-field"><label>Select Status</label><select value={updateTaskData.status} onChange={(e) => setUpdateTaskData({ ...updateTaskData, status: e.target.value })}><option value="">Select Status</option><option value="PENDING">⏳ Pending</option><option value="IN_PROGRESS">🔄 In Progress</option><option value="COMPLETED">✅ Completed</option></select></div><div className="form-field"><label>Note for Manager (Optional)</label><textarea placeholder="Add any notes about the task progress..." value={updateTaskData.managerNote} onChange={(e) => setUpdateTaskData({ ...updateTaskData, managerNote: e.target.value })} rows={3} /></div><button className="btn-msub" onClick={handleUpdateTaskStatus}>Update Status</button></div></div></div>
      )}

      {/* Project Detail Modal - For Available Projects (Only Overview - No Files, No Teams) */}
      {showProjectDetailModal && selectedProject && selectedModalProjectId && !myAssignedProjects.some(p => p.projectId === selectedModalProjectId) && (
        <div className="modal-mask open">
          <div className="modal-box large">
            <button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button>
            <h2>{selectedProject.projectName}</h2>
            <div className="m-tabs"><button className="m-tab active">📋 Overview</button></div>
            <div className="m-tab-content active">
              <div className="project-detail-section">
                <div className="detail-row"><label>Status:</label>{getStatusBadge(selectedProject.status)}</div>
                <div className="detail-row"><label>Description:</label><p>{selectedProject.projectDescription || 'No description'}</p></div>
                <div className="detail-grid"><div><label>Type:</label> {selectedProject.projectType || 'N/A'}</div><div><label>Client:</label> {selectedProject.clientName || 'N/A'}</div><div><label>Department:</label> {selectedProject.departmentName}</div>{selectedProject.assignedManagerName && <div><label>Manager:</label> {selectedProject.assignedManagerName}</div>}{selectedProject.deadline && <div><label>Deadline:</label> {new Date(selectedProject.deadline).toLocaleDateString()}</div>}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal - For Assigned Projects (Full Access: Overview, Teams, Files) */}
      {showProjectDetailModal && selectedProject && selectedModalProjectId && myAssignedProjects.some(p => p.projectId === selectedModalProjectId) && (
        <div className="modal-mask open">
          <div className="modal-box large">
            <button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button>
            <h2>{selectedProject.projectName}</h2>
            <div className="m-tabs">
              <button className={`m-tab ${activeModalTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveModalTab('overview')}>📋 Overview</button>
              <button className={`m-tab ${activeModalTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveModalTab('teams')}>👥 Teams</button>
              <button className={`m-tab ${activeModalTab === 'files' ? 'active' : ''}`} onClick={() => setActiveModalTab('files')}>📎 Files</button>
            </div>

            <div className="m-tab-content" id="tab-overview" style={{ display: activeModalTab === 'overview' ? 'block' : 'none' }}>
              <div className="project-detail-section"><div className="detail-row"><label>Status:</label>{getStatusBadge(selectedProject.status)}</div><div className="detail-row"><label>Description:</label><p>{selectedProject.projectDescription || 'No description'}</p></div><div className="detail-grid"><div><label>Type:</label> {selectedProject.projectType || 'N/A'}</div><div><label>Client:</label> {selectedProject.clientName || 'N/A'}</div><div><label>Department:</label> {selectedProject.departmentName}</div>{selectedProject.assignedManagerName && <div><label>Manager:</label> {selectedProject.assignedManagerName}</div>}{selectedProject.deadline && <div><label>Deadline:</label> {new Date(selectedProject.deadline).toLocaleDateString()}</div>}</div></div>
            </div>

            <div className="m-tab-content" id="tab-teams" style={{ display: activeModalTab === 'teams' ? 'block' : 'none' }}>
              {projectTeams.length === 0 ? <div className="empty-state"><span className="empty-icon">👥</span><p>No teams assigned to this project yet</p></div> : projectTeams.map(team => (<div key={team.teamId} className="team-section"><h3>{team.teamName}</h3><div className="team-manager">Manager: {team.managerName}</div><div className="team-members"><h4>Team Members</h4>{team.members.map((member, idx) => (<div key={idx} className="team-member"><div className="member-avatar">{member.memberName.charAt(0)}</div><div className="member-info"><div className="member-name">{member.memberName}</div><div className="member-role">{member.role}</div></div></div>))}</div></div>))}
            </div>

            <div className="m-tab-content" id="tab-files" style={{ display: activeModalTab === 'files' ? 'block' : 'none' }}>
              <div className="upload-section"><input type="file" onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })} /><select value={uploadData.fileType} onChange={(e) => setUploadData({ ...uploadData, fileType: e.target.value })}><option value="">Select Type</option><option value="Document">📄 Document</option><option value="Code">💻 Code</option><option value="Image">🖼️ Image</option><option value="PDF">📕 PDF</option><option value="Report">📊 Report</option></select><button className="btn-primary" onClick={handleUploadFile}>📤 Upload</button></div>
              <div className="files-list">{projectFiles.length === 0 ? <div className="empty-state"><span className="empty-icon">📁</span><p>No files uploaded yet</p></div> : projectFiles.map(file => (<div key={file.fileId} className="file-item"><div className="file-icon">📄</div><div className="file-info"><div className="file-name">{file.fileLink?.split('/').pop() || 'File'}</div><div className="file-meta"><span className="file-type">{file.fileType}</span><span>Uploaded by {file.uploaderName}</span>{file.uploadTime && <span>{formatDate(file.uploadTime)}</span>}</div></div><div className="file-actions"><button className="btn-icon" onClick={() => handleViewFile(file.fileId)}>👁️ View</button><button className="btn-icon" onClick={() => handleDownloadFile(file.fileId)}>📥 Download</button>{file.uploaderName === user?.name && <button className="btn-icon danger" onClick={() => handleDeleteFile(file.fileId)} disabled={deletingFile === file.fileId}>{deletingFile === file.fileId ? '⏳' : '🗑️ Delete'}</button>}</div></div>))}</div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowProfileModal(false)}>✕</button><h2>Edit Profile</h2><form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleUpdateProfile({ name: fd.get('name'), phoneNumber: fd.get('phoneNumber'), address: fd.get('address'), gender: fd.get('gender'), dob: fd.get('dob') }); }}><div className="m-form"><div className="form-field"><label>Full Name</label><input name="name" placeholder="Name" defaultValue={user?.name} required /></div><div className="form-field"><label>Phone Number</label><input name="phoneNumber" placeholder="Phone Number" defaultValue={user?.phoneNumber} /></div><div className="form-field"><label>Gender</label><input name="gender" placeholder="Gender" defaultValue={user?.gender} /></div><div className="form-field"><label>Date of Birth</label><input name="dob" type="date" defaultValue={user?.dob} /></div><div className="form-field"><label>Address</label><textarea name="address" placeholder="Address" rows={2} defaultValue={user?.address} /></div><button type="submit" className="btn-msub">Save Changes</button></div></form></div></div>
      )}

      {/* Edit Consultant Details Modal */}
      {showEditDetailsModal && (
        <div className="modal-mask open"><div className="modal-box large"><button className="m-close" onClick={() => setShowEditDetailsModal(false)}>✕</button><h2>Edit Consultant Details</h2><div className="m-form"><div className="details-grid"><div className="form-field"><label>10th Marks (%)</label><input type="number" placeholder="10th Marks (%)" value={applyFormData.marks10} onChange={(e) => setApplyFormData({ ...applyFormData, marks10: e.target.value })} /></div><div className="form-field"><label>12th Marks (%)</label><input type="number" placeholder="12th Marks (%)" value={applyFormData.marks12} onChange={(e) => setApplyFormData({ ...applyFormData, marks12: e.target.value })} /></div><div className="form-field"><label>Graduation Marks (%)</label><input type="number" placeholder="Graduation Marks (%)" value={applyFormData.graduationMarks} onChange={(e) => setApplyFormData({ ...applyFormData, graduationMarks: e.target.value })} /></div><div className="form-field"><label>Stream</label><input type="text" placeholder="Stream" value={applyFormData.stream} onChange={(e) => setApplyFormData({ ...applyFormData, stream: e.target.value })} /></div><div className="form-field"><label>Experience</label><input type="text" placeholder="Experience" value={applyFormData.experience} onChange={(e) => setApplyFormData({ ...applyFormData, experience: e.target.value })} /></div><div className="form-field"><label>Skills</label><input type="text" placeholder="Skills (comma separated)" value={applyFormData.skill} onChange={(e) => setApplyFormData({ ...applyFormData, skill: e.target.value })} /></div><div className="form-field"><label>Skill Type</label><input type="text" placeholder="Skill Type" value={applyFormData.skillType} onChange={(e) => setApplyFormData({ ...applyFormData, skillType: e.target.value })} /></div><div className="form-field"><label>Resume (PDF/DOC)</label><input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />{resumeFile && <small>{resumeFile.name}</small>}</div></div><button className="btn-msub" onClick={handleUpdateConsultantDetails}>Update Details</button></div></div></div>
      )}

      <style jsx>{`
        .activity-timeline { display: flex; flex-direction: column; gap: 0; margin-top: 1rem; }
        .timeline-item { display: flex; position: relative; padding: 1rem 0; }
        .timeline-dot-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; width: 40px; flex-shrink: 0; }
        .timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--teal); border: 2px solid var(--card-bg); z-index: 2; }
        .timeline-line { position: absolute; top: 20px; bottom: -20px; width: 2px; background: var(--border); left: 50%; transform: translateX(-50%); }
        .timeline-content { flex: 1; background: var(--surface); border-radius: 12px; padding: 1rem; margin-left: 0.5rem; border: 1px solid var(--border); }
        .timeline-header { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
        .timeline-status-icon { font-size: 1.2rem; }
        .timeline-status-label { font-weight: 700; font-size: 0.9rem; }
        .timeline-date { font-size: 0.75rem; color: var(--muted); margin-left: auto; }
        .timeline-note { display: flex; align-items: flex-start; gap: 0.5rem; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border); font-size: 0.85rem; color: var(--text2); }
        .activity-summary { display: flex; gap: 0.5rem; }
        .activity-badge { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 0.25rem 0.75rem; font-size: 0.75rem; color: var(--muted); }
        .status-card { background: linear-gradient(135deg, var(--card-bg), var(--surface)); border-left: 4px solid var(--teal); }
        .status-badge-large { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 40px; font-weight: 700; font-size: 0.85rem; color: white; }
        .status-details { margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .ratings-list { display: flex; flex-direction: column; gap: 1rem; }
        .rating-item { padding: 1rem; background: var(--surface); border-radius: 12px; border: 1px solid var(--border); }
        .rating-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem; }
        .rating-stars { color: #f59e0b; }
        .rating-note { font-size: 0.85rem; color: var(--text2); }
        .rating-date { font-size: 0.7rem; color: var(--muted); }
        .average-rating { background: var(--surface); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; }
        .apply-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-field { display: flex; flex-direction: column; gap: 0.25rem; }
        .form-field label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: var(--muted); }
        .skills-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
        .skill-tag { background: rgba(44, 166, 164, 0.1); color: var(--teal); padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.7rem; }
        .resume-link { color: var(--teal); text-decoration: none; }
        .upload-section { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
        .upload-section input, .upload-section select { padding: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; }
        .team-section { margin-bottom: 1.5rem; }
        .team-section h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .team-section h4 { font-size: 0.8rem; font-weight: 600; margin: 0.5rem 0; color: var(--muted); }
        .team-manager { font-size: 0.8rem; color: var(--teal); margin-bottom: 0.8rem; }
        .team-members { display: flex; flex-direction: column; gap: 0.5rem; }
        .team-member { display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: var(--surface); border-radius: 10px; }
        .member-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--g-main); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
        .member-info .member-name { font-weight: 600; font-size: 0.85rem; }
        .member-info .member-role { font-size: 0.7rem; color: var(--teal); }
        .member-info .member-email { font-size: 0.65rem; color: var(--muted); }
        .files-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .empty-state { text-align: center; padding: 3rem; color: var(--muted); }
        .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; opacity: 0.5; }
        .view-all-link { margin-top: 1rem; color: var(--teal); background: none; border: none; cursor: pointer; font-size: 0.8rem; }
        .card-subtitle { font-size: 0.8rem; color: var(--muted); margin-top: 0.25rem; }
        .search-input { padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); min-width: 200px; }
        .client-loader { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .loader-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--teal); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .folder-structure { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1rem; }
        .folder-card { background: var(--surface); border-radius: 12px; border: 1px solid var(--border); overflow: hidden; transition: all 0.2s ease; }
        .folder-header { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; background: rgba(44, 166, 164, 0.05); border-bottom: 1px solid var(--border); cursor: pointer; }
        .folder-header:hover { background: rgba(44, 166, 164, 0.1); }
        .folder-icon { font-size: 1.3rem; }
        .folder-name { font-weight: 600; font-size: 1rem; flex: 1; }
        .file-count { font-size: 0.7rem; padding: 0.2rem 0.5rem; background: var(--surface); border-radius: 20px; color: var(--muted); }
        .folder-files { padding: 0.5rem; }
        .file-type-badge { font-size: 0.65rem; background: var(--bg); padding: 0.15rem 0.5rem; border-radius: 12px; color: var(--teal); display: inline-block; }
        .file-date { font-size: 0.6rem; color: var(--muted); margin-top: 0.2rem; }
        .file-item { display: flex; align-items: center; gap: 1rem; padding: 0.8rem; border-radius: 10px; background: var(--bg); margin-bottom: 0.5rem; transition: all 0.2s; }
        .file-item:hover { background: var(--surface); transform: translateX(4px); }
        .file-icon { font-size: 1.5rem; }
        .file-info { flex: 1; }
        .file-name { font-weight: 500; font-size: 0.85rem; word-break: break-all; }
        .file-actions { display: flex; gap: 0.3rem; }
        .btn-icon { padding: 0.3rem 0.6rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; font-size: 0.7rem; transition: all 0.2s; }
        .btn-icon:hover { background: var(--bg); border-color: var(--teal); }
        .btn-icon.danger:hover { border-color: #ef4444; color: #ef4444; }
        .profile-avatar-large { width: 100px; height: 100px; border-radius: 50%; overflow: hidden; background: var(--g-main); display: flex; align-items: center; justify-content: center; }
        .profile-avatar-large img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 700; color: white; }
        .profile-info { display: flex; gap: 2rem; flex-wrap: wrap; margin-top: 1rem; }
        .profile-details { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; }
        .setting-item.danger { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(239, 68, 68, 0.05); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2); }
        .btn-danger { background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
        .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.8rem; margin-top: 1rem; }
        .detail-row { margin-bottom: 0.8rem; }
        .detail-row label { font-weight: 600; color: var(--muted); width: 100px; display: inline-block; }
        .m-tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
        .m-tab { padding: 0.5rem 1rem; background: none; border: none; cursor: pointer; font-weight: 600; color: var(--muted); border-radius: 8px; transition: all 0.2s; }
        .m-tab.active { background: var(--g-main); color: white; }
        .m-tab-content { padding: 1rem 0; }
        .modal-mask { display: flex; position: fixed; inset: 0; z-index: 2000; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 1rem; }
        .modal-box { background: var(--card-bg); border-radius: 24px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding: 1.5rem; position: relative; }
        .modal-box.large { max-width: 800px; }
        .m-close { position: absolute; top: 1rem; right: 1rem; width: 32px; height: 32px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
        .btn-msub { padding: 0.75rem; background: var(--g-main); color: white; border: none; border-radius: 40px; font-weight: 700; cursor: pointer; width: 100%; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 1.2rem; display: flex; align-items: center; gap: 1rem; }
        .stat-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; }
        .stat-icon.blue { background: rgba(31, 109, 168, 0.1); }
        .stat-icon.green { background: rgba(52, 168, 83, 0.1); }
        .stat-icon.orange { background: rgba(245, 124, 0, 0.1); }
        .stat-icon.purple { background: rgba(106, 90, 205, 0.1); }
        .stat-info .stat-value { font-size: 2rem; font-weight: 800; line-height: 1; }
        .stat-info .stat-label { font-size: 0.75rem; color: var(--muted); }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }
        .project-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 14px; padding: 1rem; transition: all 0.2s; }
        .project-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .project-card-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem; }
        .project-card-header h3 { font-size: 1rem; font-weight: 700; margin: 0; color: var(--text2); }
        .project-card-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.5; margin-bottom: 0.8rem; }
        .project-card-meta { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 0.6rem; font-size: 0.7rem; color: var(--muted); }
        .project-card-manager { font-size: 0.7rem; color: var(--teal); margin-top: 0.5rem; }
        .project-card-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .btn-sm { padding: 0.4rem 0.9rem; border-radius: 40px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 0.35rem; border: none; }
        .btn-primary { background: var(--g-main); color: white; }
        .btn-outline { background: transparent; border: 1.5px solid var(--border); color: var(--text2); }
        .btn-outline:hover { border-color: var(--teal); color: var(--teal); }
        .status-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
        .status-pending { background: rgba(245, 124, 0, 0.1); color: var(--orange); }
        .status-approved { background: rgba(52, 168, 83, 0.1); color: var(--green); }
        .status-rejected { background: rgba(231, 76, 60, 0.1); color: var(--red); }
        .status-assigned { background: rgba(31, 109, 168, 0.1); color: var(--blue); }
        .status-progress { background: rgba(44, 166, 164, 0.1); color: var(--teal); }
        .status-completed { background: rgba(52, 168, 83, 0.1); color: var(--green); }
        .dashboard-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; }
        .dashboard-card.full-width { width: 100%; }
        .card-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
        .card-header h2 { font-size: 1.2rem; font-weight: 800; margin: 0; color: var(--text2); }
        .client-footer { text-align: center; padding: 1.5rem; margin-top: 2rem; border-top: 1px solid var(--border); font-size: 0.8rem; color: var(--muted); }
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .client-sidebar { transform: translateX(-100%); }
          .client-sidebar.open { transform: translateX(0); }
          .client-main { margin-left: 0; padding: 16px; }
          .mobile-menu-btn { display: block; position: fixed; bottom: 20px; right: 20px; z-index: 101; background: var(--g-main); border: none; border-radius: 50%; width: 50px; height: 50px; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
          .projects-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Consultant;





// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
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

// interface ConsultantDetails {
//   consultantId: number;
//   userId: number;
//   marks10: number;
//   marks12: number;
//   graduationMarks: number;
//   stream: string;
//   experience: string;
//   skill: string;
//   skillType: string;
//   resumeLink: string;
//   isApproved: string;
//   salary?: number;
//   averageRating?: number;
//   totalReviews?: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface Task {
//   taskId: number;
//   projectId: number;
//   projectName: string;
//   taskDetails: string;
//   description: string;
//   taskStatus: string;
//   createdByName: string;
//   deadline: string;
//   managerNote: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface ProjectRequest {
//   requestId: number;
//   projectId: number;
//   projectName: string;
//   consultantName: string;
//   requestedAt: string;
//   status?: string;
//   consultantEmail?: string;
//   consultantPhoto?: string;
//   skill?: string;
//   experience?: string;
//   marks10?: number;
//   marks12?: number;
//   graduationMarks?: number;
//   resumeLink?: string;
//   averageRating?: number;
//   totalReviews?: number;
// }

// interface DepartmentProject {
//   projectId: number;
//   projectName: string;
//   projectDescription?: string;
//   projectType?: string;
//   status: string;
//   departmentId: number;
//   departmentName: string;
//   hasRequested: boolean;
//   isAssigned?: boolean;
//   managerName?: string;
//   clientName?: string;
//   deadline?: string;
// }

// interface Team {
//   teamId: number;
//   teamName: string;
//   projectName: string;
//   projectId?: number;
//   managerName: string;
//   members: TeamMember[];
//   createdAt?: string;
// }

// interface TeamMember {
//   memberName: string;
//   role: string;
//   memberEmail?: string;
//   photoUrl?: string;
//   description?: string;
// }

// interface FileItem {
//   fileId: number;
//   fileType: string;
//   fileLink: string;
//   uploaderName: string;
//   uploadTime?: string;
//   projectId?: number;
//   projectName?: string;
//   departmentId?: number;
//   departmentName?: string;
// }

// interface Project {
//   projectId: number;
//   projectName: string;
//   status: string;
//   departmentName: string;
//   projectDescription?: string;
//   projectType?: string;
//   clientName?: string;
//   deadline?: string;
//   clientEmail?: string;
//   assignedManagerName?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface ProjectHistory {
//   statusId: number;
//   status: string;
//   dateTime: string;
//   handledByName?: string;
//   managerNote?: string;
//   directorNote?: string;
//   assignedToName?: string;
//   deadline?: string;
// }

// interface StatusHistory {
//   statusId: number;
//   status: string;
//   note: string;
//   dateTime: string;
// }

// interface LatestStatus {
//   statusId: number;
//   status: string;
//   note: string;
//   dateTime: string;
// }

// interface Rating {
//   reviewId: number;
//   consultantId: number;
//   consultantName: string;
//   reviewerName: string;
//   reviewMarks: number;
//   reviewNote: string;
//   createdAt: string;
// }

// interface Role {
//   id: number;
//   ptype: string;
//   stype: string;
//   isApproved: string;
//   createdAt: string;
// }

// interface MyDetails {
//   user: UserProfile;
//   roles: Role[];
//   employee: null;
// }

// // New API response types
// interface TeamProject {
//   projectId: number;
//   projectName: string;
//   projectDescription: string;
//   projectType: string;
//   status: string;
//   departmentName: string;
//   clientName: string;
//   managerName: string;
//   deadline: string;
//   files: FileItem[];
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
// // CONSULTANT API FUNCTIONS
// // ============================================

// const applyAsConsultant = async (formData: FormData) => {
//   return apiCall('POST', '/api/consultant/apply', formData, true);
// };

// const getMyConsultantDetails = async () => {
//   return apiCall<{ success: boolean; data: ConsultantDetails }>('GET', '/api/consultant/my-details');
// };

// const updateConsultantDetails = async (formData: FormData) => {
//   return apiCall('PUT', '/api/consultant/update', formData, true);
// };

// const getMyStatusHistory = async () => {
//   return apiCall<{ success: boolean; data: StatusHistory[] }>('GET', '/api/consultant/my-status-history');
// };

// const getMyLatestStatus = async () => {
//   return apiCall<{ success: boolean; data: LatestStatus }>('GET', '/api/consultant/my-latest-status');
// };

// const getMyRatings = async () => {
//   return apiCall<{ success: boolean; data: Rating[] }>('GET', '/api/consultant/my-ratings');
// };

// const getMyAverageRating = async () => {
//   return apiCall<{ success: boolean; data: number }>('GET', '/api/consultant/my-average-rating');
// };

// // ============================================
// // TASK APIs
// // ============================================

// const getMyTasks = async () => {
//   return apiCall<{ success: boolean; data: Task[] }>('GET', '/api/task/my-tasks');
// };

// const updateTaskStatus = async (taskId: number, status: string, managerNote?: string) => {
//   let url = `/api/task/update-status/${taskId}?status=${status}`;
//   if (managerNote) {
//     url += `&managerNote=${encodeURIComponent(managerNote)}`;
//   }
//   return apiCall('PUT', url, null);
// };

// const getProjectTasks = async (projectId: number) => {
//   return apiCall<{ success: boolean; data: Task[] }>('GET', `/api/task/project/${projectId}`);
// };

// // ============================================
// // PROJECT REQUEST APIs (Improved)
// // ============================================

// const getDepartmentProjects = async () => {
//   return apiCall<{ success: boolean; data: DepartmentProject[] }>(
//     'GET',
//     '/api/consultant-project/department-projects'
//   );
// };

// const requestProject = async (projectId: number) => {
//   return apiCall('POST', `/api/consultant-project/request/${projectId}`);
// };

// const getMyProjectRequests = async () => {
//   return apiCall<{ success: boolean; data: ProjectRequest[] }>(
//     'GET',
//     '/api/consultant-project/my-requests'
//   );
// };

// const hasRequestedProject = async (projectId: number) => {
//   return apiCall<{ success: boolean; data: boolean }>(
//     'GET',
//     `/api/consultant-project/has-requested/${projectId}`
//   );
// };

// // ============================================
// // CONSULTANT ASSIGNED PROJECTS API (FIXED)
// // ============================================

// const getMyAssignedProjects = async () => {
//   return apiCall<{ success: boolean; data: TeamProject[] }>(
//     'GET',
//     '/api/consultant-project/my-assigned-projects'
//   );
// };

// // ============================================
// // TEAM APIs
// // ============================================

// const getMyConsultantTeams = async () => {
//   return apiCall<{ success: boolean; data: Team[] }>('GET', '/api/team/my-consultant-teams');
// };

// const getProjectTeams = async (projectId: number) => {
//   return apiCall<{ success: boolean; data: Team[] }>('GET', `/api/team/project/${projectId}`);
// };

// // ============================================
// // FILE APIs
// // ============================================

// const uploadFile = async (projectId: number, file: File, fileType: string) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   return apiCall('POST', `/api/file/upload/${projectId}?fileType=${fileType}`, formData, true);
// };

// const getProjectFiles = async (projectId: number) => {
//   return apiCall<{ success: boolean; data: FileItem[] }>('GET', `/api/file/project/${projectId}`);
// };

// const getMyUploads = async () => {
//   return apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/my-uploads');
// };

// const deleteFile = async (fileId: number) => {
//   return apiCall('DELETE', `/api/file/delete/${fileId}`);
// };

// const getAccessToken = async (fileId: number) => {
//   return apiCall('POST', `/api/file/access-token/${fileId}`, {});
// };

// // ============================================
// // PROJECT APIs (View Only - No History for Consultants)
// // ============================================

// const getProjectById = async (projectId: number) => {
//   return apiCall<{ success: boolean; data: Project }>('GET', `/api/project/${projectId}`);
// };

// // Note: Project history API is NOT called for consultants
// // const getProjectHistory = async (projectId: number) => {
// //   return apiCall<{ success: boolean; data: ProjectHistory[] }>(
// //     'GET',
// //     `/api/project/${projectId}/history`
// //   );
// // };

// // ============================================
// // USER PROFILE APIs
// // ============================================

// const getCompleteProfile = async () => {
//   return apiCall<{ success: boolean; data: { user: UserProfile; roles: Role[] } }>(
//     'GET',
//     '/api/users/complete'
//   );
// };

// const getUserProfile = async () => {
//   return apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
// };

// const updateUserProfile = async (data: { name?: string; phoneNumber?: string; address?: string; gender?: string; dob?: string }) => {
//   return apiCall('PUT', '/api/users/profile', data);
// };

// const deleteAccount = async () => {
//   return apiCall('DELETE', '/api/users/account');
// };

// const getMyDetails = async () => {
//   return apiCall<{ success: boolean; data: MyDetails }>('GET', '/api/getmydetails');
// };

// // ============================================
// // RESUME GENERATION
// // ============================================

// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";
// import { saveAs } from "file-saver";

// interface ResumeData {
//   name: string;
//   email: string;
//   photo: string;
//   marks10: string;
//   marks12: string;
//   graduationMarks: string;
//   stream: string;
//   experience: string;
//   skill: string;
//   skillType: string;
// }

// const generateResumeBlob = async (data: ResumeData): Promise<Blob> => {
//   const res = await fetch("/templates/resume-template.docx");
//   const content = await res.arrayBuffer();
//   const zip = new PizZip(content);
//   const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  
//   doc.setData({
//     name: data.name,
//     email: data.email,
//     photo: data.photo,
//     marks10: data.marks10,
//     marks12: data.marks12,
//     graduationMarks: data.graduationMarks,
//     stream: data.stream,
//     experience: data.experience,
//     skill: data.skill,
//     skillType: data.skillType
//   });
  
//   doc.render();
//   return doc.getZip().generate({
//     type: "blob",
//     mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//   });
// };

// const generateResume = async (data: ResumeData) => {
//   const blob = await generateResumeBlob(data);
//   saveAs(blob, "resume.docx");
// };

// // ============================================
// // SIDEBAR MENU ITEMS
// // ============================================

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//   { id: 'activity-log', label: 'Activity Log', icon: '📋' },
//   { id: 'my-details', label: 'My Details', icon: '📝' },
//   { id: 'my-tasks', label: 'My Tasks', icon: '✅' },
//   { id: 'projects', label: 'Available Projects', icon: '📁' },
//   { id: 'my-requests', label: 'My Requests', icon: '📨' },
//   { id: 'my-teams', label: 'My Teams', icon: '👥' },
//   { id: 'my-team-projects', label: 'Team Projects', icon: '🚀' },
//   { id: 'my-uploads', label: 'My Uploads', icon: '📎' },
//   { id: 'profile', label: 'Profile', icon: '👤' },
// ];

// // ============================================
// // STATUS CONFIGURATION
// // ============================================

// const statusConfig: Record<string, { label: string; class: string; icon: string; color: string }> = {
//   APPLIED: { label: 'Applied', class: 'status-pending', icon: '📝', color: '#F59E0B' },
//   DOCUMENT_VERIFIED: { label: 'Documents Verified', class: 'status-progress', icon: '✓', color: '#3B82F6' },
//   INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', class: 'status-progress', icon: '📅', color: '#8B5CF6' },
//   INTERVIEW_PASSED: { label: 'Interview Passed', class: 'status-progress', icon: '🎉', color: '#10B981' },
//   INTERVIEW_FAILED: { label: 'Interview Failed', class: 'status-rejected', icon: '❌', color: '#EF4444' },
//   APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅', color: '#10B981' },
//   REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '🚫', color: '#EF4444' },
//   ACTIVE: { label: 'Active', class: 'status-approved', icon: '🟢', color: '#10B981' },
//   INACTIVE: { label: 'Inactive', class: 'status-rejected', icon: '⚪', color: '#6B7280' },
//   BLOCKED: { label: 'Blocked', class: 'status-rejected', icon: '🔴', color: '#EF4444' },
//   CONVERTED_TO_EMPLOYEE: { label: 'Converted to Employee', class: 'status-approved', icon: '💼', color: '#8B5CF6' },
//   PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳', color: '#F59E0B' },
//   IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄', color: '#3B82F6' },
//   COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️', color: '#10B981' },
//   ASSIGNED: { label: 'Assigned', class: 'status-assigned', icon: '👥', color: '#8B5CF6' },
// };

// const getStatusBadge = (status: string) => {
//   const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌', color: '#6B7280' };
//   return (
//     <span className={`status-badge ${config.class}`}>
//       <span className="status-icon">{config.icon}</span>
//       {config.label}
//     </span>
//   );
// };

// // ============================================
// // MAIN CONSULTANT COMPONENT
// // ============================================

// const Consultant: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('dashboard');
//   const [loading, setLoading] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [myDetails, setMyDetails] = useState<MyDetails | null>(null);
//   const [consultantDetails, setConsultantDetails] = useState<ConsultantDetails | null>(null);
//   const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
//   const [latestStatus, setLatestStatus] = useState<LatestStatus | null>(null);
//   const [ratings, setRatings] = useState<Rating[]>([]);
//   const [averageRating, setAverageRating] = useState<number>(0);

//   // Data states
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [departmentProjects, setDepartmentProjects] = useState<DepartmentProject[]>([]);
//   const [myRequests, setMyRequests] = useState<ProjectRequest[]>([]);
//   const [myTeams, setMyTeams] = useState<Team[]>([]);
//   const [myUploads, setMyUploads] = useState<FileItem[]>([]);
//   const [myTeamProjects, setMyTeamProjects] = useState<TeamProject[]>([]);

//   // Modal states
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [selectedProjectForFiles, setSelectedProjectForFiles] = useState<number | null>(null);
//   const [projectFiles, setProjectFiles] = useState<FileItem[]>([]);
//   const [projectTeams, setProjectTeams] = useState<Team[]>([]);
  
//   const [showTaskModal, setShowTaskModal] = useState(false);
//   const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
//   const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
//   const { logout } = useAuth();

//   // Form states
//   const [updateTaskData, setUpdateTaskData] = useState({ status: '', managerNote: '' });
//   const [uploadData, setUploadData] = useState({ file: null as File | null, fileType: '', projectId: 0 });
//   const [applyFormData, setApplyFormData] = useState({
//     marks10: '',
//     marks12: '',
//     graduationMarks: '',
//     stream: '',
//     experience: '',
//     skill: '',
//     skillType: '',
//   });
//   const [resumeFile, setResumeFile] = useState<File | null>(null);
  
//   // Filter states
//   const [taskFilter, setTaskFilter] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [darkMode, setDarkMode] = useState(false);

//   // Grouped uploads for folder view
//   const [groupedUploads, setGroupedUploads] = useState<Record<string, FileItem[]>>({});

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.setAttribute('data-theme', 'dark');
//     }
//     loadInitialData();
//   }, []);

//   useEffect(() => {
//     // Group uploads by project
//     const grouped: Record<string, FileItem[]> = {};
//     myUploads.forEach(upload => {
//       const key = upload.projectName || 'Other';
//       if (!grouped[key]) grouped[key] = [];
//       grouped[key].push(upload);
//     });
//     setGroupedUploads(grouped);
//   }, [myUploads]);

//   const loadInitialData = async () => {
//     setLoading(true);
//     try {
//       const [profileRes, detailsRes, consultantRes, statusHistoryRes, latestStatusRes, ratingsRes, avgRatingRes] = await Promise.all([
//         getUserProfile().catch(() => ({ data: null })),
//         getMyDetails().catch(() => ({ data: null })),
//         getMyConsultantDetails().catch(() => ({ data: null })),
//         getMyStatusHistory().catch(() => ({ data: [] })),
//         getMyLatestStatus().catch(() => ({ data: null })),
//         getMyRatings().catch(() => ({ data: [] })),
//         getMyAverageRating().catch(() => ({ data: 0 })),
//       ]);

//       setUser(profileRes.data);
//       setMyDetails(detailsRes.data);
//       setConsultantDetails(consultantRes.data || null);
//       setStatusHistory(statusHistoryRes.data || []);
//       setLatestStatus(latestStatusRes.data || null);
//       setRatings(ratingsRes.data || []);
//       setAverageRating(avgRatingRes.data || 0);
      
//       if (consultantRes.data) {
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
//       const [tasksRes, projectsRes, requestsRes, teamsRes, uploadsRes, teamProjectsRes] = await Promise.all([
//         getMyTasks().catch(() => ({ data: [] })),
//         getDepartmentProjects().catch(() => ({ data: [] })),
//         getMyProjectRequests().catch(() => ({ data: [] })),
//         getMyConsultantTeams().catch(() => ({ data: [] })),
//         getMyUploads().catch(() => ({ data: [] })),
//         getMyAssignedProjects().catch(() => ({ data: [] })),
//       ]);

//       setTasks(tasksRes.data);
//       setDepartmentProjects(projectsRes.data);
//       setMyRequests(requestsRes.data);
//       setMyTeams(teamsRes.data);
//       setMyUploads(uploadsRes.data);
//       setMyTeamProjects(teamProjectsRes.data);
//     } catch (error) {
//       console.error('Error loading data:', error);
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

//   const handleGenerateResume = async () => {
//     if (!consultantDetails || !user) {
//       alert('Consultant details not found');
//       return;
//     }
    
//     const resumeData: ResumeData = {
//       name: user.name,
//       email: user.email,
//       photo: user.photoUrl || '',
//       marks10: consultantDetails.marks10.toString(),
//       marks12: consultantDetails.marks12.toString(),
//       graduationMarks: consultantDetails.graduationMarks.toString(),
//       stream: consultantDetails.stream,
//       experience: consultantDetails.experience,
//       skill: consultantDetails.skill,
//       skillType: consultantDetails.skillType,
//     };
    
//     try {
//       await generateResume(resumeData);
//       alert('Resume downloaded successfully');
//     } catch (error) {
//       console.error('Error generating resume:', error);
//       alert('Failed to generate resume. Please check if template exists.');
//     }
//   };

//   const handleApplyAsConsultant = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('marks10', applyFormData.marks10);
//       formData.append('marks12', applyFormData.marks12);
//       formData.append('graduationMarks', applyFormData.graduationMarks);
//       formData.append('stream', applyFormData.stream);
//       formData.append('experience', applyFormData.experience);
//       formData.append('skill', applyFormData.skill);
//       formData.append('skillType', applyFormData.skillType);
//       if (resumeFile) {
//         formData.append('resume', resumeFile);
//       }

//       const response = await applyAsConsultant(formData);
//       alert(response.message || 'Application submitted successfully');
      
//       const consultantRes = await getMyConsultantDetails();
//       setConsultantDetails(consultantRes.data);
//       const statusHistoryRes = await getMyStatusHistory();
//       setStatusHistory(statusHistoryRes.data);
//       const latestStatusRes = await getMyLatestStatus();
//       setLatestStatus(latestStatusRes.data);
//       setShowApplyModal(false);
      
//       setApplyFormData({
//         marks10: '',
//         marks12: '',
//         graduationMarks: '',
//         stream: '',
//         experience: '',
//         skill: '',
//         skillType: '',
//       });
//       setResumeFile(null);
//       await loadAllData();
//     } catch (error: any) {
//       console.error('Error applying as consultant:', error);
//       alert(error.message || 'Failed to submit application');
//     }
//   };

//   const handleUpdateConsultantDetails = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('marks10', applyFormData.marks10);
//       formData.append('marks12', applyFormData.marks12);
//       formData.append('graduationMarks', applyFormData.graduationMarks);
//       formData.append('stream', applyFormData.stream);
//       formData.append('experience', applyFormData.experience);
//       formData.append('skill', applyFormData.skill);
//       formData.append('skillType', applyFormData.skillType);
//       if (resumeFile) {
//         formData.append('resume', resumeFile);
//       }

//       const response = await updateConsultantDetails(formData);
//       alert(response.message || 'Details updated successfully');
      
//       const consultantRes = await getMyConsultantDetails();
//       setConsultantDetails(consultantRes.data);
//       setShowEditDetailsModal(false);
//       await loadAllData();
//     } catch (error: any) {
//       console.error('Error updating consultant details:', error);
//       alert(error.message || 'Failed to update details');
//     }
//   };

//   const handleUpdateTaskStatus = async () => {
//     if (!selectedTask) return;
//     if (!updateTaskData.status) {
//       alert('Please select a status');
//       return;
//     }
//     try {
//       await updateTaskStatus(selectedTask.taskId, updateTaskData.status, updateTaskData.managerNote);
//       await loadAllData();
//       setShowUpdateTaskModal(false);
//       setSelectedTask(null);
//       setUpdateTaskData({ status: '', managerNote: '' });
//       alert('Task status updated successfully');
//     } catch (error: any) {
//       console.error('Error updating task status:', error);
//       alert(error.message || 'Failed to update task status');
//     }
//   };

//   const handleRequestProject = async (projectId: number) => {
//     try {
//       await requestProject(projectId);
//       await loadAllData();
//       alert('Project request sent successfully');
//     } catch (error: any) {
//       console.error('Error requesting project:', error);
//       alert(error.message || 'Failed to request project');
//     }
//   };

//   const handleUploadFile = async () => {
//     if (!selectedProjectForFiles || !uploadData.file) {
//       alert('Please select a file and project');
//       return;
//     }
//     if (!uploadData.fileType) {
//       alert('Please select file type');
//       return;
//     }
//     try {
//       await uploadFile(selectedProjectForFiles, uploadData.file, uploadData.fileType);
//       const filesRes = await getProjectFiles(selectedProjectForFiles);
//       setProjectFiles(filesRes.data);
//       const uploadsRes = await getMyUploads();
//       setMyUploads(uploadsRes.data);
//       setUploadData({ file: null, fileType: '', projectId: 0 });
//       alert('File uploaded successfully');
//     } catch (error: any) {
//       console.error('Error uploading file:', error);
//       alert(error.message || 'Failed to upload file');
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
//     } catch (error) {
//       alert('Cannot view file');
//     }
//   };

//   const handleDownloadFile = async (fileId: number) => {
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

//   const handleDeleteFile = async (fileId: number) => {
//     if (confirm('Are you sure you want to delete this file?')) {
//       try {
//         await deleteFile(fileId);
//         if (selectedProjectForFiles) {
//           const filesRes = await getProjectFiles(selectedProjectForFiles);
//           setProjectFiles(filesRes.data);
//         }
//         const uploadsRes = await getMyUploads();
//         setMyUploads(uploadsRes.data);
//         alert('File deleted successfully');
//       } catch (error: any) {
//         console.error('Error deleting file:', error);
//         alert(error.message || 'Failed to delete file');
//       }
//     }
//   };

//   const handleViewProject = async (projectId: number) => {
//     try {
//       const [projectRes, teamsRes, filesRes] = await Promise.all([
//         getProjectById(projectId),
//         getProjectTeams(projectId).catch(() => ({ data: [] })),
//         getProjectFiles(projectId).catch(() => ({ data: [] })),
//       ]);
//       setSelectedProject(projectRes.data);
//       setProjectTeams(teamsRes.data);
//       setProjectFiles(filesRes.data);
//       setSelectedProjectForFiles(projectId);
//       setShowProjectDetailModal(true);
//     } catch (error: any) {
//       console.error('Error loading project details:', error);
//       alert(error.message || 'Failed to load project details');
//     }
//   };

//   const handleUpdateProfile = async (data: any) => {
//     try {
//       await updateUserProfile(data);
//       const profileRes = await getUserProfile();
//       setUser(profileRes.data);
//       setShowProfileModal(false);
//       alert('Profile updated successfully');
//     } catch (error: any) {
//       console.error('Error updating profile:', error);
//       alert(error.message || 'Failed to update profile');
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
//       try {
//         await deleteAccount();
//         await logout();
//         window.location.href = '/';
//       } catch (error: any) {
//         console.error('Error deleting account:', error);
//         alert(error.message || 'Failed to delete account');
//       }
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       window.location.href = '/';
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Filter tasks
//   const filteredTasks = tasks
//     .filter((task) => {
//       if (taskFilter === 'pending') return task.taskStatus === 'PENDING';
//       if (taskFilter === 'in_progress') return task.taskStatus === 'IN_PROGRESS';
//       if (taskFilter === 'completed') return task.taskStatus === 'COMPLETED';
//       return true;
//     })
//     .filter((task) =>
//       task.taskDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       task.projectName.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//   const hasApplied = consultantDetails !== null;
//   const displayAverageRating = averageRating > 0 ? averageRating : 
//     (ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.reviewMarks, 0) / ratings.length : 0);

//   const getStatusColor = (status: string) => {
//     return statusConfig[status]?.color || '#6B7280';
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       return new Date(dateString).toLocaleString();
//     } catch {
//       return dateString;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="client-loader">
//         <div className="loader-spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="client-container">
//       <CommonSidebar
//         activeNav={activeNav}
//         setActiveNav={setActiveNav}
//         onLogout={handleLogout}
//         onThemeToggle={toggleDarkMode}
//         darkMode={darkMode}
//         user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null}
//         menuItems={menuItems}
//         title="Consultant Portal"
//         logoIcon="👨‍💻"
//         isOpen={mobileSidebarOpen}
//         onClose={() => setMobileSidebarOpen(false)}
//       />

//       <button
//         className="mobile-menu-btn"
//         onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
//       >
//         ☰
//       </button>

//       <main className="client-main">
//         <header className="client-header">
//           <div className="header-welcome">
//             <h1>Welcome back, {user?.name?.split(' ')[0] || 'Consultant'}!</h1>
//             <p>Consultant Dashboard - Project Management Portal</p>
//           </div>
//           <div className="header-stats">
//             <div className="header-stat-item">
//               <span className="stat-label">Status</span>
//               <span className="stat-value-sm">
//                 {latestStatus ? getStatusBadge(latestStatus.status) : 
//                   <span className="status-badge status-pending">⏳ Not Applied</span>
//                 }
//               </span>
//             </div>
//             <div className="header-stat-item">
//               <span className="stat-label">Rating</span>
//               <span className="stat-value-sm">⭐ {displayAverageRating.toFixed(1)} / 5</span>
//             </div>
//             <div className="header-stat-item">
//               <span className="stat-label">Tasks</span>
//               <span className="stat-value-sm">{tasks.filter(t => t.taskStatus !== 'COMPLETED').length} Active</span>
//             </div>
//           </div>
//         </header>

//         {/* Show Apply Form if consultant hasn't applied */}
//         {!hasApplied && (
//           <div className="dashboard-card">
//             <div className="card-header">
//               <h2>Complete Your Consultant Application</h2>
//               <p className="card-subtitle">Fill in your details to apply as a consultant</p>
//             </div>
//             <div className="apply-form">
//               <div className="details-grid">
//                 <div className="form-field">
//                   <label>10th Marks (%)</label>
//                   <input
//                     type="number"
//                     placeholder="e.g., 85.5"
//                     value={applyFormData.marks10}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, marks10: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>12th Marks (%)</label>
//                   <input
//                     type="number"
//                     placeholder="e.g., 78.0"
//                     value={applyFormData.marks12}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, marks12: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Graduation Marks (%)</label>
//                   <input
//                     type="number"
//                     placeholder="e.g., 72.3"
//                     value={applyFormData.graduationMarks}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, graduationMarks: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Stream</label>
//                   <input
//                     type="text"
//                     placeholder="e.g., Computer Science"
//                     value={applyFormData.stream}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, stream: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Experience</label>
//                   <input
//                     type="text"
//                     placeholder="e.g., 3 years"
//                     value={applyFormData.experience}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, experience: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Skills</label>
//                   <input
//                     type="text"
//                     placeholder="e.g., Java, Spring Boot, React"
//                     value={applyFormData.skill}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, skill: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Skill Type</label>
//                   <input
//                     type="text"
//                     placeholder="e.g., Full Stack"
//                     value={applyFormData.skillType}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, skillType: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Resume (PDF/DOC)</label>
//                   <input
//                     type="file"
//                     accept=".pdf,.doc,.docx"
//                     onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
//                   />
//                   {resumeFile && <small className="file-name">{resumeFile.name}</small>}
//                 </div>
//               </div>
//               <button className="btn-msub" onClick={handleApplyAsConsultant}>
//                 Submit Application
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Dashboard Tab */}
//         {activeNav === 'dashboard' && hasApplied && (
//           <>
//             <div className="stats-grid">
//               <div className="stat-card">
//                 <div className="stat-icon blue">✅</div>
//                 <div className="stat-info">
//                   <span className="stat-value">{tasks.length}</span>
//                   <span className="stat-label">Total Tasks</span>
//                 </div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-icon green">🔄</div>
//                 <div className="stat-info">
//                   <span className="stat-value">{tasks.filter(t => t.taskStatus === 'IN_PROGRESS').length}</span>
//                   <span className="stat-label">In Progress</span>
//                 </div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-icon orange">📁</div>
//                 <div className="stat-info">
//                   <span className="stat-value">{departmentProjects.length}</span>
//                   <span className="stat-label">Available Projects</span>
//                 </div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-icon purple">👥</div>
//                 <div className="stat-info">
//                   <span className="stat-value">{myTeams.length}</span>
//                   <span className="stat-label">My Teams</span>
//                 </div>
//               </div>
//             </div>

//             {/* Current Status Card */}
//             {latestStatus && (
//               <div className="dashboard-card status-card">
//                 <div className="card-header">
//                   <h2>📊 Current Activity Status</h2>
//                   <span className="status-badge-large" style={{ backgroundColor: getStatusColor(latestStatus.status) }}>
//                     {statusConfig[latestStatus.status]?.icon} {statusConfig[latestStatus.status]?.label}
//                   </span>
//                 </div>
//                 <div className="status-details">
//                   <p><strong>Note:</strong> {latestStatus.note || 'No additional notes'}</p>
//                   <p><strong>Last Updated:</strong> {formatDate(latestStatus.dateTime)}</p>
//                 </div>
//               </div>
//             )}

//             {/* Ratings Section */}
//             {ratings.length > 0 && (
//               <div className="dashboard-card">
//                 <div className="card-header">
//                   <h2>⭐ My Ratings & Reviews</h2>
//                   <div className="average-rating">
//                     Average: <strong>{displayAverageRating.toFixed(1)} / 5</strong> ({ratings.length} reviews)
//                   </div>
//                 </div>
//                 <div className="ratings-list">
//                   {ratings.slice(0, 3).map((rating) => (
//                     <div key={rating.reviewId} className="rating-item">
//                       <div className="rating-header">
//                         <strong>{rating.reviewerName}</strong>
//                         <span className="rating-stars">⭐ {rating.reviewMarks}/5</span>
//                       </div>
//                       <p className="rating-note">{rating.reviewNote}</p>
//                       <small className="rating-date">{formatDate(rating.createdAt)}</small>
//                     </div>
//                   ))}
//                 </div>
//                 {ratings.length > 3 && (
//                   <button className="view-all-link" onClick={() => alert('All ratings feature coming soon')}>
//                     View All {ratings.length} Reviews →
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Recent Tasks */}
//             <div className="dashboard-card">
//               <div className="card-header">
//                 <h2>My Recent Tasks</h2>
//                 <button className="view-all-link" onClick={() => setActiveNav('my-tasks')}>
//                   View All →
//                 </button>
//               </div>
//               <div className="projects-grid">
//                 {tasks.slice(0, 3).map((task) => (
//                   <div key={task.taskId} className="project-card">
//                     <div className="project-card-header">
//                       <h3>{task.taskDetails}</h3>
//                       {getStatusBadge(task.taskStatus)}
//                     </div>
//                     <p className="project-card-desc">{task.description?.substring(0, 80) || 'No description'}</p>
//                     <div className="project-card-meta">
//                       <span>📁 {task.projectName}</span>
//                       <span>👤 {task.createdByName}</span>
//                       {task.deadline && <span>📅 Due: {new Date(task.deadline).toLocaleDateString()}</span>}
//                     </div>
//                     <div className="project-card-actions">
//                       <button
//                         className="btn-sm btn-primary"
//                         onClick={() => {
//                           setSelectedTask(task);
//                           setShowTaskModal(true);
//                         }}
//                       >
//                         View Details
//                       </button>
//                       {task.taskStatus !== 'COMPLETED' && (
//                         <button
//                           className="btn-sm btn-outline"
//                           onClick={() => {
//                             setSelectedTask(task);
//                             setShowUpdateTaskModal(true);
//                           }}
//                         >
//                           Update Status
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {tasks.length === 0 && (
//                 <div className="empty-state">
//                   <span className="empty-icon">✅</span>
//                   <p>No tasks assigned yet</p>
//                 </div>
//               )}
//             </div>

//             {/* Available Projects */}
//             <div className="dashboard-card">
//               <div className="card-header">
//                 <h2>Available Projects</h2>
//                 <button className="view-all-link" onClick={() => setActiveNav('projects')}>
//                   View All →
//                 </button>
//               </div>
//               <div className="projects-grid">
//                 {departmentProjects.slice(0, 3).map((project) => (
//                   <div key={project.projectId} className="project-card">
//                     <div className="project-card-header">
//                       <h3>{project.projectName}</h3>
//                       {getStatusBadge(project.status)}
//                     </div>
//                     <div className="project-card-meta">
//                       <span>🏢 {project.departmentName}</span>
//                       {project.managerName && <span>👔 {project.managerName}</span>}
//                     </div>
//                     <div className="project-card-actions">
//                       <button
//                         className="btn-sm btn-primary"
//                         onClick={() => handleViewProject(project.projectId)}
//                       >
//                         View Details
//                       </button>
//                       {!project.hasRequested && project.status === 'IN_PROGRESS' && (
//                         <button
//                           className="btn-sm btn-outline"
//                           onClick={() => handleRequestProject(project.projectId)}
//                         >
//                           Request to Join
//                         </button>
//                       )}
//                       {project.hasRequested && (
//                         <span className="status-badge status-pending">⏳ Requested</span>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {departmentProjects.length === 0 && (
//                 <div className="empty-state">
//                   <span className="empty-icon">📁</span>
//                   <p>No projects available</p>
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {/* Activity Log Tab */}
//         {activeNav === 'activity-log' && hasApplied && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>📋 Activity Log & Status History</h2>
//               <div className="activity-summary">
//                 <span className="activity-badge">Total Updates: {statusHistory.length}</span>
//               </div>
//             </div>
//             <div className="activity-timeline">
//               {statusHistory.length === 0 ? (
//                 <div className="empty-state">
//                   <span className="empty-icon">📭</span>
//                   <p>No activity history available yet</p>
//                 </div>
//               ) : (
//                 [...statusHistory].reverse().map((entry, index) => {
//                   const config = statusConfig[entry.status] || { icon: '📌', label: entry.status, color: '#6B7280' };
//                   return (
//                     <div key={entry.statusId} className="timeline-item">
//                       <div className="timeline-dot-wrapper">
//                         <div className="timeline-dot" style={{ backgroundColor: config.color }}></div>
//                         {index < statusHistory.length - 1 && <div className="timeline-line"></div>}
//                       </div>
//                       <div className="timeline-content">
//                         <div className="timeline-header">
//                           <span className="timeline-status-icon">{config.icon}</span>
//                           <span className="timeline-status-label" style={{ color: config.color }}>
//                             {config.label}
//                           </span>
//                           <span className="timeline-date">{formatDate(entry.dateTime)}</span>
//                         </div>
//                         {entry.note && (
//                           <div className="timeline-note">
//                             <span className="note-icon">📝</span>
//                             <span className="note-text">{entry.note}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         )}

//         {/* My Details Tab */}
//         {activeNav === 'my-details' && consultantDetails && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>My Consultant Details</h2>
//               <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
//                 <button className="btn-outline" onClick={handleGenerateResume}>
//                   📄 Download Resume
//                 </button>
//                 <button className="btn-outline" onClick={() => {
//                   setApplyFormData({
//                     marks10: consultantDetails.marks10.toString(),
//                     marks12: consultantDetails.marks12.toString(),
//                     graduationMarks: consultantDetails.graduationMarks.toString(),
//                     stream: consultantDetails.stream,
//                     experience: consultantDetails.experience,
//                     skill: consultantDetails.skill,
//                     skillType: consultantDetails.skillType,
//                   });
//                   setShowEditDetailsModal(true);
//                 }}>
//                   ✏️ Edit Details
//                 </button>
//               </div>
//             </div>
//             <div className="details-grid">
//               <div className="detail-item">
//                 <label>Status</label>
//                 {getStatusBadge(consultantDetails.isApproved)}
//               </div>
//               <div className="detail-item">
//                 <label>Rating</label>
//                 <span>⭐ {displayAverageRating.toFixed(1)} / 5 ({ratings.length} reviews)</span>
//               </div>
//               {consultantDetails.salary && consultantDetails.salary > 0 && (
//                 <div className="detail-item">
//                   <label>Salary</label>
//                   <span>💰 ₹{consultantDetails.salary.toLocaleString()}/month</span>
//                 </div>
//               )}
//               <div className="detail-item">
//                 <label>10th Marks</label>
//                 <span>{consultantDetails.marks10}%</span>
//               </div>
//               <div className="detail-item">
//                 <label>12th Marks</label>
//                 <span>{consultantDetails.marks12}%</span>
//               </div>
//               <div className="detail-item">
//                 <label>Graduation Marks</label>
//                 <span>{consultantDetails.graduationMarks}%</span>
//               </div>
//               <div className="detail-item">
//                 <label>Stream</label>
//                 <span>{consultantDetails.stream}</span>
//               </div>
//               <div className="detail-item">
//                 <label>Experience</label>
//                 <span>{consultantDetails.experience}</span>
//               </div>
//               <div className="detail-item">
//                 <label>Skills</label>
//                 <span className="skills-tags">
//                   {consultantDetails.skill.split(',').map((s, i) => (
//                     <span key={i} className="skill-tag">{s.trim()}</span>
//                   ))}
//                 </span>
//               </div>
//               <div className="detail-item">
//                 <label>Skill Type</label>
//                 <span>{consultantDetails.skillType}</span>
//               </div>
//               <div className="detail-item">
//                 <label>Resume</label>
//                 {consultantDetails.resumeLink && (
//                   <a href={consultantDetails.resumeLink} target="_blank" rel="noopener noreferrer" className="resume-link">
//                     📄 View Resume
//                   </a>
//                 )}
//               </div>
//               {consultantDetails.createdAt && (
//                 <div className="detail-item">
//                   <label>Applied On</label>
//                   <span>{formatDate(consultantDetails.createdAt)}</span>
//                 </div>
//               )}
//               {consultantDetails.updatedAt && (
//                 <div className="detail-item">
//                   <label>Last Updated</label>
//                   <span>{formatDate(consultantDetails.updatedAt)}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* My Tasks Tab */}
//         {activeNav === 'my-tasks' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>My Tasks</h2>
//               <div className="header-filters">
//                 <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}>
//                   <option value="all">All Tasks</option>
//                   <option value="pending">⏳ Pending</option>
//                   <option value="in_progress">🔄 In Progress</option>
//                   <option value="completed">✅ Completed</option>
//                 </select>
//                 <input
//                   type="text"
//                   placeholder="Search tasks..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="search-input"
//                 />
//               </div>
//             </div>
//             <div className="projects-grid">
//               {filteredTasks.map((task) => (
//                 <div key={task.taskId} className="project-card">
//                   <div className="project-card-header">
//                     <h3>{task.taskDetails}</h3>
//                     {getStatusBadge(task.taskStatus)}
//                   </div>
//                   <p className="project-card-desc">{task.description?.substring(0, 100) || 'No description'}</p>
//                   <div className="project-card-meta">
//                     <span>📁 {task.projectName}</span>
//                     <span>👤 {task.createdByName}</span>
//                     {task.deadline && <span>📅 Due: {new Date(task.deadline).toLocaleDateString()}</span>}
//                   </div>
//                   {task.managerNote && (
//                     <div className="project-card-manager">📝 Note: {task.managerNote}</div>
//                   )}
//                   <div className="project-card-actions">
//                     <button
//                       className="btn-sm btn-primary"
//                       onClick={() => {
//                         setSelectedTask(task);
//                         setShowTaskModal(true);
//                       }}
//                     >
//                       View Details
//                     </button>
//                     {task.taskStatus !== 'COMPLETED' && (
//                       <button
//                         className="btn-sm btn-outline"
//                         onClick={() => {
//                           setSelectedTask(task);
//                           setShowUpdateTaskModal(true);
//                         }}
//                       >
//                         Update Status
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {filteredTasks.length === 0 && (
//               <div className="empty-state">
//                 <span className="empty-icon">✅</span>
//                 <p>No tasks found</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Available Projects Tab */}
//         {activeNav === 'projects' && (
//           <div className="dashboard-card full-width">
//             <h2>Available Projects</h2>
//             <div className="projects-grid">
//               {departmentProjects.map((project) => (
//                 <div key={project.projectId} className="project-card">
//                   <div className="project-card-header">
//                     <h3>{project.projectName}</h3>
//                     {getStatusBadge(project.status)}
//                   </div>
//                   <p className="project-card-desc">{project.projectDescription?.substring(0, 80) || 'No description'}</p>
//                   <div className="project-card-meta">
//                     <span>🏢 {project.departmentName}</span>
//                     <span>📱 {project.projectType || 'N/A'}</span>
//                     {project.managerName && <span>👔 {project.managerName}</span>}
//                     {project.deadline && <span>📅 Deadline: {new Date(project.deadline).toLocaleDateString()}</span>}
//                   </div>
//                   <div className="project-card-actions">
//                     <button
//                       className="btn-sm btn-primary"
//                       onClick={() => handleViewProject(project.projectId)}
//                     >
//                       View Details
//                     </button>
//                     {!project.hasRequested && project.status === 'IN_PROGRESS' && (
//                       <button
//                         className="btn-sm btn-outline"
//                         onClick={() => handleRequestProject(project.projectId)}
//                       >
//                         Request to Join
//                       </button>
//                     )}
//                     {project.hasRequested && (
//                       <span className="status-badge status-pending">⏳ Request Sent</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {departmentProjects.length === 0 && (
//               <div className="empty-state">
//                 <span className="empty-icon">📁</span>
//                 <p>No projects available</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* My Requests Tab */}
//         {activeNav === 'my-requests' && (
//           <div className="dashboard-card full-width">
//             <h2>My Project Requests</h2>
//             <div className="projects-grid">
//               {myRequests.map((request) => (
//                 <div key={request.requestId} className="project-card">
//                   <div className="project-card-header">
//                     <h3>{request.projectName}</h3>
//                     <span className="status-badge status-pending">⏳ Requested</span>
//                   </div>
//                   <div className="project-card-meta">
//                     <span>📅 Requested: {formatDate(request.requestedAt)}</span>
//                   </div>
//                   <div className="project-card-actions">
//                     <button
//                       className="btn-sm btn-primary"
//                       onClick={() => handleViewProject(request.projectId)}
//                     >
//                       View Project
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {myRequests.length === 0 && (
//               <div className="empty-state">
//                 <span className="empty-icon">📨</span>
//                 <p>No project requests found</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* My Teams Tab */}
//         {activeNav === 'my-teams' && (
//           <div className="dashboard-card full-width">
//             <h2>My Teams</h2>
//             {myTeams.map((team) => (
//               <div key={team.teamId} className="team-section" style={{ marginBottom: '2rem' }}>
//                 <h3>{team.teamName}</h3>
//                 <div className="team-manager">Project: {team.projectName}</div>
//                 <div className="team-manager">Manager: {team.managerName}</div>
//                 <div className="team-members">
//                   <h4>Team Members ({team.members.length})</h4>
//                   {team.members.map((member, idx) => (
//                     <div key={idx} className="team-member">
//                       <div className="member-avatar">{member.memberName.charAt(0)}</div>
//                       <div className="member-info">
//                         <div className="member-name">{member.memberName}</div>
//                         <div className="member-role">{member.role}</div>
//                         {member.memberEmail && <div className="member-email">{member.memberEmail}</div>}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//             {myTeams.length === 0 && (
//               <div className="empty-state">
//                 <span className="empty-icon">👥</span>
//                 <p>No teams assigned yet</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* My Team Projects Tab (FIXED - Using correct API) */}
//         {activeNav === 'my-team-projects' && (
//           <div className="dashboard-card full-width">
//             <h2>🚀 My Team Projects</h2>
//             <p className="card-subtitle">Projects where I am a team member</p>
//             <div className="projects-grid">
//               {myTeamProjects.map((project) => (
//                 <div key={project.projectId} className="project-card">
//                   <div className="project-card-header">
//                     <h3>{project.projectName}</h3>
//                     {getStatusBadge(project.status)}
//                   </div>
//                   <p className="project-card-desc">{project.projectDescription?.substring(0, 100) || 'No description'}</p>
//                   <div className="project-card-meta">
//                     <span>🏢 {project.departmentName}</span>
//                     <span>📱 {project.projectType || 'N/A'}</span>
//                     <span>👔 {project.managerName}</span>
//                     <span>👤 {project.clientName}</span>
//                     {project.deadline && <span>📅 Deadline: {new Date(project.deadline).toLocaleDateString()}</span>}
//                   </div>
//                   <div className="project-card-actions">
//                     <button
//                       className="btn-sm btn-primary"
//                       onClick={() => handleViewProject(project.projectId)}
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {myTeamProjects.length === 0 && (
//               <div className="empty-state">
//                 <span className="empty-icon">🚀</span>
//                 <p>No team projects assigned yet. Once you're added to a team, projects will appear here.</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* My Uploads Tab with Folder Design */}
//         {activeNav === 'my-uploads' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>📎 My Uploads</h2>
//               <p className="card-subtitle">Files you have uploaded to projects - grouped by project</p>
//             </div>
//             <div className="upload-section">
//               <select 
//                 value={uploadData.projectId} 
//                 onChange={(e) => setUploadData({ ...uploadData, projectId: parseInt(e.target.value) })}
//               >
//                 <option value="0">Select Project</option>
//                 {myTeams.map(team => (
//                   <option key={team.teamId} value={team.projectId}>{team.projectName}</option>
//                 ))}
//               </select>
//               <input 
//                 type="file" 
//                 onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })} 
//               />
//               <select 
//                 value={uploadData.fileType} 
//                 onChange={(e) => setUploadData({ ...uploadData, fileType: e.target.value })}
//               >
//                 <option value="">Select Type</option>
//                 <option value="Document">📄 Document</option>
//                 <option value="Code">💻 Code</option>
//                 <option value="Image">🖼️ Image</option>
//                 <option value="PDF">📕 PDF</option>
//                 <option value="Report">📊 Report</option>
//                 <option value="Other">📎 Other</option>
//               </select>
//               <button className="btn-primary" onClick={handleUploadFile} disabled={!uploadData.file || !uploadData.projectId}>
//                 📤 Upload File
//               </button>
//             </div>
            
//             {/* Folder-like grouped uploads */}
//             {Object.keys(groupedUploads).length === 0 ? (
//               <div className="empty-state">
//                 <span className="empty-icon">📎</span>
//                 <p>No files uploaded yet. Upload files from your project details.</p>
//               </div>
//             ) : (
//               <div className="folder-structure">
//                 {Object.entries(groupedUploads).map(([projectName, files]) => (
//                   <div key={projectName} className="folder-card">
//                     <div className="folder-header">
//                       <span className="folder-icon">📁</span>
//                       <span className="folder-name">{projectName}</span>
//                       <span className="file-count">{files.length} file{files.length !== 1 ? 's' : ''}</span>
//                     </div>
//                     <div className="folder-files">
//                       {files.map((file) => (
//                         <div key={file.fileId} className="file-item">
//                           <div className="file-icon">
//                             {file.fileType === 'Image' ? '🖼️' : 
//                              file.fileType === 'Code' ? '💻' : 
//                              file.fileType === 'PDF' ? '📕' : 
//                              file.fileType === 'Report' ? '📊' : '📄'}
//                           </div>
//                           <div className="file-info">
//                             <div className="file-name">{file.fileLink?.split('/').pop() || 'File'}</div>
//                             <div className="file-type-badge">{file.fileType || 'File'}</div>
//                             {file.uploadTime && <div className="file-date">{formatDate(file.uploadTime)}</div>}
//                           </div>
//                           <div className="file-actions">
//                             <button className="btn-icon" onClick={() => handleViewFile(file.fileId)}>👁️ View</button>
//                             <button className="btn-icon" onClick={() => handleDownloadFile(file.fileId)}>📥 Download</button>
//                             <button className="btn-icon danger" onClick={() => handleDeleteFile(file.fileId)}>🗑️ Delete</button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Profile Tab */}
//         {activeNav === 'profile' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>Profile Information</h2>
//               <button className="btn-outline" onClick={() => setShowProfileModal(true)}>
//                 ✏️ Edit Profile
//               </button>
//             </div>
//             <div className="profile-info">
//               <div className="profile-avatar-large">
//                 {user?.photoUrl ? (
//                   <img src={user.photoUrl} alt={user.name} />
//                 ) : (
//                   <div className="avatar-placeholder">{user?.name?.charAt(0) || 'C'}</div>
//                 )}
//               </div>
//               <div className="profile-details">
//                 <div className="detail-item">
//                   <label>Full Name</label>
//                   <span>{user?.name}</span>
//                 </div>
//                 <div className="detail-item">
//                   <label>Email Address</label>
//                   <span>{user?.email}</span>
//                 </div>
//                 <div className="detail-item">
//                   <label>Role</label>
//                   <span>Consultant</span>
//                 </div>
//                 <div className="detail-item">
//                   <label>Email Verified</label>
//                   <span>{user?.emailVerified ? '✅ Yes' : '❌ No'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <label>Phone Number</label>
//                   <span>{user?.phoneNumber || 'Not provided'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <label>Address</label>
//                   <span>{user?.address || 'Not provided'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <label>Gender</label>
//                   <span>{user?.gender || 'Not provided'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <label>Date of Birth</label>
//                   <span>{user?.dob || 'Not provided'}</span>
//                 </div>
//               </div>
//             </div>
//             <div className="setting-item danger" style={{ marginTop: '2rem' }}>
//               <div>
//                 <div className="setting-label">Delete Account</div>
//                 <div className="setting-desc">Permanently delete your account and all data</div>
//               </div>
//               <button className="btn-danger" onClick={handleDeleteAccount}>
//                 Delete Account
//               </button>
//             </div>
//           </div>
//         )}

//         <footer className="client-footer">
//           <p>© 2026 Consultant Portal | Developed by <a href='https://softmax.in' style={{ color: 'skyblue' }}>Softmax.in</a></p>
//         </footer>
//       </main>

//       {/* Task Detail Modal */}
//       {showTaskModal && selectedTask && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => setShowTaskModal(false)}>✕</button>
//             <h2>{selectedTask.taskDetails}</h2>
//             <div className="project-detail-section">
//               <div className="detail-row">
//                 <label>Project:</label>
//                 <span>{selectedTask.projectName}</span>
//               </div>
//               <div className="detail-row">
//                 <label>Status:</label>
//                 {getStatusBadge(selectedTask.taskStatus)}
//               </div>
//               <div className="detail-row">
//                 <label>Description:</label>
//                 <p>{selectedTask.description || 'No description'}</p>
//               </div>
//               <div className="detail-row">
//                 <label>Created By:</label>
//                 <span>{selectedTask.createdByName}</span>
//               </div>
//               {selectedTask.deadline && (
//                 <div className="detail-row">
//                   <label>Deadline:</label>
//                   <span>{new Date(selectedTask.deadline).toLocaleString()}</span>
//                 </div>
//               )}
//               {selectedTask.managerNote && (
//                 <div className="detail-row">
//                   <label>Manager Note:</label>
//                   <span>{selectedTask.managerNote}</span>
//                 </div>
//               )}
//               {selectedTask.createdAt && (
//                 <div className="detail-row">
//                   <label>Created At:</label>
//                   <span>{formatDate(selectedTask.createdAt)}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Update Task Status Modal */}
//       {showUpdateTaskModal && selectedTask && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => setShowUpdateTaskModal(false)}>✕</button>
//             <h2>Update Task Status</h2>
//             <p className="task-name">{selectedTask.taskDetails}</p>
//             <div className="m-form">
//               <div className="form-field">
//                 <label>Select Status</label>
//                 <select
//                   value={updateTaskData.status}
//                   onChange={(e) => setUpdateTaskData({ ...updateTaskData, status: e.target.value })}
//                 >
//                   <option value="">Select Status</option>
//                   <option value="PENDING">⏳ Pending</option>
//                   <option value="IN_PROGRESS">🔄 In Progress</option>
//                   <option value="COMPLETED">✅ Completed</option>
//                 </select>
//               </div>
//               <div className="form-field">
//                 <label>Note for Manager (Optional)</label>
//                 <textarea
//                   placeholder="Add any notes about the task progress..."
//                   value={updateTaskData.managerNote}
//                   onChange={(e) => setUpdateTaskData({ ...updateTaskData, managerNote: e.target.value })}
//                   rows={3}
//                 />
//               </div>
//               <button className="btn-msub" onClick={handleUpdateTaskStatus}>
//                 Update Status
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Project Detail Modal - No History Tab for Consultants */}
//       {showProjectDetailModal && selectedProject && (
//         <div className="modal-mask open">
//           <div className="modal-box large">
//             <button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button>
//             <h2>{selectedProject.projectName}</h2>
//             <div className="m-tabs">
//               <button className="m-tab active" data-tab="overview" onClick={() => {
//                 document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none');
//                 document.getElementById('tab-overview')!.style.display = 'block';
//               }}>📋 Overview</button>
//               <button className="m-tab" data-tab="teams" onClick={() => {
//                 document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none');
//                 document.getElementById('tab-teams')!.style.display = 'block';
//               }}>👥 Teams</button>
//               <button className="m-tab" data-tab="files" onClick={() => {
//                 document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none');
//                 document.getElementById('tab-files')!.style.display = 'block';
//               }}>📎 Files</button>
//               {/* History tab removed for consultants - only managers/directors can see project history */}
//             </div>

//             <div className="m-tab-content active" id="tab-overview" style={{ display: 'block' }}>
//               <div className="project-detail-section">
//                 <div className="detail-row">
//                   <label>Status:</label>
//                   {getStatusBadge(selectedProject.status)}
//                 </div>
//                 <div className="detail-row">
//                   <label>Description:</label>
//                   <p>{selectedProject.projectDescription || 'No description'}</p>
//                 </div>
//                 <div className="detail-grid">
//                   <div><label>Type:</label> {selectedProject.projectType || 'N/A'}</div>
//                   <div><label>Client:</label> {selectedProject.clientName || 'N/A'}</div>
//                   <div><label>Department:</label> {selectedProject.departmentName}</div>
//                   {selectedProject.assignedManagerName && <div><label>Manager:</label> {selectedProject.assignedManagerName}</div>}
//                   {selectedProject.deadline && <div><label>Deadline:</label> {new Date(selectedProject.deadline).toLocaleDateString()}</div>}
//                   {selectedProject.createdAt && <div><label>Created:</label> {formatDate(selectedProject.createdAt)}</div>}
//                 </div>
//               </div>
//             </div>

//             <div className="m-tab-content" id="tab-teams" style={{ display: 'none' }}>
//               {projectTeams.length === 0 ? (
//                 <div className="empty-state"><span className="empty-icon">👥</span><p>No teams assigned to this project yet</p></div>
//               ) : (
//                 projectTeams.map((team) => (
//                   <div key={team.teamId} className="team-section">
//                     <h3>{team.teamName}</h3>
//                     <div className="team-manager">Manager: {team.managerName}</div>
//                     <div className="team-members">
//                       <h4>Team Members</h4>
//                       {team.members.map((member, idx) => (
//                         <div key={idx} className="team-member">
//                           <div className="member-avatar">{member.memberName.charAt(0)}</div>
//                           <div className="member-info">
//                             <div className="member-name">{member.memberName}</div>
//                             <div className="member-role">{member.role}</div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="m-tab-content" id="tab-files" style={{ display: 'none' }}>
//               <div className="upload-section">
//                 <input type="file" onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })} />
//                 <select value={uploadData.fileType} onChange={(e) => setUploadData({ ...uploadData, fileType: e.target.value })}>
//                   <option value="">Select Type</option>
//                   <option value="Document">📄 Document</option>
//                   <option value="Code">💻 Code</option>
//                   <option value="Image">🖼️ Image</option>
//                   <option value="PDF">📕 PDF</option>
//                   <option value="Report">📊 Report</option>
//                 </select>
//                 <button className="btn-primary" onClick={handleUploadFile}>📤 Upload</button>
//               </div>
//               <div className="files-list">
//                 {projectFiles.length === 0 ? (
//                   <div className="empty-state"><span className="empty-icon">📁</span><p>No files uploaded yet</p></div>
//                 ) : (
//                   projectFiles.map((file) => (
//                     <div key={file.fileId} className="file-item">
//                       <div className="file-icon">📄</div>
//                       <div className="file-info">
//                         <div className="file-name">{file.fileLink?.split('/').pop() || 'File'}</div>
//                         <div className="file-meta">
//                           <span className="file-type">{file.fileType}</span>
//                           <span>Uploaded by {file.uploaderName}</span>
//                           {file.uploadTime && <span>{formatDate(file.uploadTime)}</span>}
//                         </div>
//                       </div>
//                       <div className="file-actions">
//                         <button className="btn-icon" onClick={() => handleViewFile(file.fileId)}>👁️ View</button>
//                         <button className="btn-icon" onClick={() => handleDownloadFile(file.fileId)}>📥 Download</button>
//                         {file.uploaderName === user?.name && (
//                           <button className="btn-icon danger" onClick={() => handleDeleteFile(file.fileId)}>🗑️ Delete</button>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
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
//             <form onSubmit={(e) => {
//               e.preventDefault();
//               const formData = new FormData(e.currentTarget);
//               handleUpdateProfile({
//                 name: formData.get('name'),
//                 phoneNumber: formData.get('phoneNumber'),
//                 address: formData.get('address'),
//                 gender: formData.get('gender'),
//                 dob: formData.get('dob'),
//               });
//             }}>
//               <div className="m-form">
//                 <div className="form-field">
//                   <label>Full Name</label>
//                   <input name="name" placeholder="Name" defaultValue={user?.name} required />
//                 </div>
//                 <div className="form-field">
//                   <label>Phone Number</label>
//                   <input name="phoneNumber" placeholder="Phone Number" defaultValue={user?.phoneNumber} />
//                 </div>
//                 <div className="form-field">
//                   <label>Gender</label>
//                   <input name="gender" placeholder="Gender" defaultValue={user?.gender} />
//                 </div>
//                 <div className="form-field">
//                   <label>Date of Birth</label>
//                   <input name="dob" type="date" defaultValue={user?.dob} />
//                 </div>
//                 <div className="form-field">
//                   <label>Address</label>
//                   <textarea name="address" placeholder="Address" rows={2} defaultValue={user?.address} />
//                 </div>
//                 <button type="submit" className="btn-msub">Save Changes</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Consultant Details Modal */}
//       {showEditDetailsModal && (
//         <div className="modal-mask open">
//           <div className="modal-box large">
//             <button className="m-close" onClick={() => setShowEditDetailsModal(false)}>✕</button>
//             <h2>Edit Consultant Details</h2>
//             <div className="m-form">
//               <div className="details-grid">
//                 <div className="form-field">
//                   <label>10th Marks (%)</label>
//                   <input
//                     type="number"
//                     placeholder="10th Marks (%)"
//                     value={applyFormData.marks10}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, marks10: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>12th Marks (%)</label>
//                   <input
//                     type="number"
//                     placeholder="12th Marks (%)"
//                     value={applyFormData.marks12}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, marks12: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Graduation Marks (%)</label>
//                   <input
//                     type="number"
//                     placeholder="Graduation Marks (%)"
//                     value={applyFormData.graduationMarks}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, graduationMarks: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Stream</label>
//                   <input
//                     type="text"
//                     placeholder="Stream"
//                     value={applyFormData.stream}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, stream: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Experience</label>
//                   <input
//                     type="text"
//                     placeholder="Experience"
//                     value={applyFormData.experience}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, experience: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Skills</label>
//                   <input
//                     type="text"
//                     placeholder="Skills (comma separated)"
//                     value={applyFormData.skill}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, skill: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Skill Type</label>
//                   <input
//                     type="text"
//                     placeholder="Skill Type"
//                     value={applyFormData.skillType}
//                     onChange={(e) => setApplyFormData({ ...applyFormData, skillType: e.target.value })}
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label>Resume (PDF/DOC)</label>
//                   <input
//                     type="file"
//                     accept=".pdf,.doc,.docx"
//                     onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
//                   />
//                   {resumeFile && <small className="file-name">{resumeFile.name}</small>}
//                 </div>
//               </div>
//               <button className="btn-msub" onClick={handleUpdateConsultantDetails}>
//                 Update Details
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .activity-timeline {
//           display: flex;
//           flex-direction: column;
//           gap: 0;
//           margin-top: 1rem;
//         }

//         .timeline-item {
//           display: flex;
//           position: relative;
//           padding: 1rem 0;
//         }

//         .timeline-dot-wrapper {
//           position: relative;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           width: 40px;
//           flex-shrink: 0;
//         }

//         .timeline-dot {
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//           background: var(--teal);
//           border: 2px solid var(--card-bg);
//           z-index: 2;
//         }

//         .timeline-line {
//           position: absolute;
//           top: 20px;
//           bottom: -20px;
//           width: 2px;
//           background: var(--border);
//           left: 50%;
//           transform: translateX(-50%);
//         }

//         .timeline-content {
//           flex: 1;
//           background: var(--surface);
//           border-radius: 12px;
//           padding: 1rem;
//           margin-left: 0.5rem;
//           border: 1px solid var(--border);
//         }

//         .timeline-header {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           flex-wrap: wrap;
//           margin-bottom: 0.5rem;
//         }

//         .timeline-status-icon {
//           font-size: 1.2rem;
//         }

//         .timeline-status-label {
//           font-weight: 700;
//           font-size: 0.9rem;
//         }

//         .timeline-date {
//           font-size: 0.75rem;
//           color: var(--muted);
//           margin-left: auto;
//         }

//         .timeline-note {
//           display: flex;
//           align-items: flex-start;
//           gap: 0.5rem;
//           margin-top: 0.5rem;
//           padding-top: 0.5rem;
//           border-top: 1px dashed var(--border);
//           font-size: 0.85rem;
//           color: var(--text2);
//         }

//         .note-icon {
//           font-size: 0.85rem;
//         }

//         .note-text {
//           flex: 1;
//         }

//         .activity-summary {
//           display: flex;
//           gap: 0.5rem;
//         }

//         .activity-badge {
//           background: var(--surface);
//           border: 1px solid var(--border);
//           border-radius: 20px;
//           padding: 0.25rem 0.75rem;
//           font-size: 0.75rem;
//           color: var(--muted);
//         }

//         .status-card {
//           background: linear-gradient(135deg, var(--card-bg), var(--surface));
//           border-left: 4px solid var(--teal);
//         }

//         .status-badge-large {
//           display: inline-flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.5rem 1rem;
//           border-radius: 40px;
//           font-weight: 700;
//           font-size: 0.85rem;
//           color: white;
//         }

//         .status-details {
//           margin-top: 1rem;
//           display: flex;
//           flex-direction: column;
//           gap: 0.5rem;
//         }

//         .status-details p {
//           margin: 0;
//           font-size: 0.85rem;
//         }

//         .ratings-list {
//           display: flex;
//           flex-direction: column;
//           gap: 1rem;
//         }

//         .rating-item {
//           padding: 1rem;
//           background: var(--surface);
//           border-radius: 12px;
//           border: 1px solid var(--border);
//         }

//         .rating-header {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 0.5rem;
//           flex-wrap: wrap;
//           gap: 0.5rem;
//         }

//         .rating-stars {
//           color: #f59e0b;
//         }

//         .rating-note {
//           font-size: 0.85rem;
//           color: var(--text2);
//           margin-bottom: 0.5rem;
//         }

//         .rating-date {
//           font-size: 0.7rem;
//           color: var(--muted);
//         }

//         .average-rating {
//           background: var(--surface);
//           padding: 0.25rem 0.75rem;
//           border-radius: 20px;
//           font-size: 0.8rem;
//         }

//         .apply-form {
//           display: flex;
//           flex-direction: column;
//           gap: 1.5rem;
//         }

//         .form-field {
//           display: flex;
//           flex-direction: column;
//           gap: 0.25rem;
//         }

//         .form-field label {
//           font-size: 0.7rem;
//           font-weight: 600;
//           text-transform: uppercase;
//           color: var(--muted);
//         }

//         .form-field small {
//           font-size: 0.7rem;
//           color: var(--muted);
//         }

//         .skills-tags {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 0.3rem;
//         }

//         .skill-tag {
//           background: rgba(44, 166, 164, 0.1);
//           color: var(--teal);
//           padding: 0.2rem 0.5rem;
//           border-radius: 12px;
//           font-size: 0.7rem;
//         }

//         .resume-link {
//           color: var(--teal);
//           text-decoration: none;
//         }

//         .resume-link:hover {
//           text-decoration: underline;
//         }

//         .task-name {
//           margin-bottom: 1rem;
//           font-weight: 500;
//         }

//         .upload-section {
//           display: flex;
//           gap: 0.8rem;
//           flex-wrap: wrap;
//           margin-bottom: 1.5rem;
//           padding-bottom: 1rem;
//           border-bottom: 1px solid var(--border);
//         }

//         .upload-section input,
//         .upload-section select {
//           padding: 0.5rem;
//           background: var(--surface);
//           border: 1px solid var(--border);
//           border-radius: 8px;
//         }

//         .team-section {
//           margin-bottom: 1.5rem;
//         }

//         .team-section h3 {
//           font-size: 1rem;
//           font-weight: 700;
//           margin-bottom: 0.5rem;
//         }

//         .team-section h4 {
//           font-size: 0.8rem;
//           font-weight: 600;
//           margin: 0.5rem 0;
//           color: var(--muted);
//         }

//         .team-manager {
//           font-size: 0.8rem;
//           color: var(--teal);
//           margin-bottom: 0.8rem;
//         }

//         .team-members {
//           display: flex;
//           flex-direction: column;
//           gap: 0.5rem;
//         }

//         .team-member {
//           display: flex;
//           align-items: center;
//           gap: 0.8rem;
//           padding: 0.6rem;
//           background: var(--surface);
//           border-radius: 10px;
//         }

//         .member-avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//           background: var(--g-main);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-weight: 700;
//         }

//         .member-info .member-name {
//           font-weight: 600;
//           font-size: 0.85rem;
//         }

//         .member-info .member-role {
//           font-size: 0.7rem;
//           color: var(--teal);
//         }

//         .member-info .member-email {
//           font-size: 0.65rem;
//           color: var(--muted);
//         }

//         .files-list {
//           display: flex;
//           flex-direction: column;
//           gap: 0.5rem;
//         }

//         .empty-state {
//           text-align: center;
//           padding: 3rem;
//           color: var(--muted);
//         }

//         .empty-icon {
//           font-size: 3rem;
//           display: block;
//           margin-bottom: 1rem;
//           opacity: 0.5;
//         }

//         .view-all-link {
//           margin-top: 1rem;
//           color: var(--teal);
//           background: none;
//           border: none;
//           cursor: pointer;
//           font-size: 0.8rem;
//         }

//         .card-subtitle {
//           font-size: 0.8rem;
//           color: var(--muted);
//           margin-top: 0.25rem;
//         }

//         .search-input {
//           padding: 0.5rem 0.75rem;
//           border: 1px solid var(--border);
//           border-radius: 8px;
//           background: var(--surface);
//           min-width: 200px;
//         }

//         .client-loader {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           min-height: 100vh;
//         }

//         .loader-spinner {
//           width: 40px;
//           height: 40px;
//           border: 3px solid var(--border);
//           border-top-color: var(--teal);
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }

//         @keyframes spin {
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         .vscode-timeline {
//           max-height: 500px;
//           overflow-y: auto;
//         }

//         .timeline-entry {
//           display: flex;
//           gap: 1rem;
//           margin-bottom: 1rem;
//         }

//         .timeline-dot {
//           width: 10px;
//           height: 10px;
//           border-radius: 50%;
//           background: var(--teal);
//         }

//         .timeline-vertical-line {
//           width: 2px;
//           height: 30px;
//           background: var(--border);
//           margin-left: 4px;
//         }

//         .commit-header {
//           display: flex;
//           gap: 1rem;
//           align-items: center;
//           flex-wrap: wrap;
//           margin-bottom: 0.5rem;
//         }

//         .hash-text {
//           font-family: monospace;
//           font-size: 0.7rem;
//           background: var(--surface);
//           padding: 0.2rem 0.4rem;
//           border-radius: 4px;
//         }

//         .branch-name {
//           font-size: 0.7rem;
//           color: #8b5cf6;
//         }

//         .commit-title {
//           margin: 0.5rem 0;
//         }

//         .commit-description {
//           font-size: 0.75rem;
//           color: var(--muted);
//           padding: 0.3rem 0.5rem;
//           background: var(--surface);
//           border-radius: 6px;
//           margin-top: 0.3rem;
//         }

//         .commit-description.director {
//           border-left: 2px solid var(--orange);
//         }

//         .commit-meta {
//           display: flex;
//           gap: 1rem;
//           font-size: 0.7rem;
//           color: var(--muted);
//           margin-top: 0.5rem;
//         }

//         .stat-badge {
//           font-size: 0.65rem;
//           background: var(--surface);
//           padding: 0.2rem 0.4rem;
//           border-radius: 4px;
//         }

//         .folder-structure {
//           display: flex;
//           flex-direction: column;
//           gap: 1.25rem;
//           margin-top: 1rem;
//         }

//         .folder-card {
//           background: var(--surface);
//           border-radius: 12px;
//           border: 1px solid var(--border);
//           overflow: hidden;
//           transition: all 0.2s ease;
//         }

//         .folder-header {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 0.85rem 1rem;
//           background: rgba(44, 166, 164, 0.05);
//           border-bottom: 1px solid var(--border);
//           cursor: pointer;
//           transition: background 0.2s;
//         }

//         .folder-header:hover {
//           background: rgba(44, 166, 164, 0.1);
//         }

//         .folder-icon {
//           font-size: 1.3rem;
//         }

//         .folder-name {
//           font-weight: 600;
//           font-size: 1rem;
//           flex: 1;
//         }

//         .file-count {
//           font-size: 0.7rem;
//           padding: 0.2rem 0.5rem;
//           background: var(--surface);
//           border-radius: 20px;
//           color: var(--muted);
//         }

//         .folder-files {
//           padding: 0.5rem;
//         }

//         .file-type-badge {
//           font-size: 0.65rem;
//           background: var(--bg);
//           padding: 0.15rem 0.5rem;
//           border-radius: 12px;
//           color: var(--teal);
//           display: inline-block;
//         }

//         .file-date {
//           font-size: 0.6rem;
//           color: var(--muted);
//           margin-top: 0.2rem;
//         }

//         .file-item {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           padding: 0.8rem;
//           border-radius: 10px;
//           background: var(--bg);
//           margin-bottom: 0.5rem;
//           transition: all 0.2s;
//         }

//         .file-item:hover {
//           background: var(--surface);
//           transform: translateX(4px);
//         }

//         .file-icon {
//           font-size: 1.5rem;
//         }

//         .file-info {
//           flex: 1;
//         }

//         .file-name {
//           font-weight: 500;
//           font-size: 0.85rem;
//           word-break: break-all;
//         }

//         .file-meta {
//           display: flex;
//           gap: 0.8rem;
//           flex-wrap: wrap;
//           font-size: 0.7rem;
//           color: var(--muted);
//         }

//         .file-actions {
//           display: flex;
//           gap: 0.3rem;
//         }

//         .btn-icon {
//           padding: 0.3rem 0.6rem;
//           background: var(--surface);
//           border: 1px solid var(--border);
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 0.7rem;
//           transition: all 0.2s;
//         }

//         .btn-icon:hover {
//           background: var(--bg);
//           border-color: var(--teal);
//         }

//         .btn-icon.danger:hover {
//           border-color: #ef4444;
//           color: #ef4444;
//         }

//         .profile-avatar-large img,
//         .avatar-placeholder {
//           width: 100px;
//           height: 100px;
//           border-radius: 50%;
//           object-fit: cover;
//         }

//         .avatar-placeholder {
//           background: var(--g-main);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 2.5rem;
//           font-weight: 700;
//           color: white;
//         }

//         .profile-info {
//           display: flex;
//           gap: 2rem;
//           flex-wrap: wrap;
//           margin-top: 1rem;
//         }

//         .profile-details {
//           flex: 1;
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//           gap: 1rem;
//         }

//         .setting-item.danger {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 1rem;
//           background: rgba(239, 68, 68, 0.05);
//           border-radius: 12px;
//           border: 1px solid rgba(239, 68, 68, 0.2);
//         }

//         .btn-danger {
//           background: #ef4444;
//           color: white;
//           border: none;
//           padding: 0.5rem 1rem;
//           border-radius: 8px;
//           cursor: pointer;
//         }

//         .detail-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
//           gap: 0.8rem;
//           margin-top: 1rem;
//         }

//         .detail-row {
//           margin-bottom: 0.8rem;
//         }

//         .detail-row label {
//           font-weight: 600;
//           color: var(--muted);
//           width: 100px;
//           display: inline-block;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Consultant;



// // 'use client';

// // import React, { useState, useEffect, useRef } from 'react';
// // import axios from 'axios';
// // import CommonSidebar from './components/CommonSidebar';
// // import { useAuth } from '@/contexts/AuthContext';

// // // ============================================
// // // TYPES
// // // ============================================

// // interface UserProfile {
// //   userId: number;
// //   uid: string;
// //   name: string;
// //   email: string;
// //   photoUrl: string | null;
// //   emailVerified: boolean;
// //   isProfileCompleted: boolean;
// //   phoneNumber?: string;
// //   address?: string;
// //   gender?: string;
// //   dob?: string;
// // }

// // interface ConsultantDetails {
// //   consultantId: number;
// //   userId: number;
// //   marks10: number;
// //   marks12: number;
// //   graduationMarks: number;
// //   stream: string;
// //   experience: string;
// //   skill: string;
// //   skillType: string;
// //   resumeLink: string;
// //   isApproved: string;
// //   salary?: number;
// //   averageRating?: number;
// //   totalReviews?: number;
// //   createdAt?: string;
// //   updatedAt?: string;
// // }

// // interface Task {
// //   taskId: number;
// //   projectId: number;
// //   projectName: string;
// //   taskDetails: string;
// //   description: string;
// //   taskStatus: string;
// //   createdByName: string;
// //   deadline: string;
// //   managerNote: string;
// //   createdAt?: string;
// //   updatedAt?: string;
// // }

// // interface ProjectRequest {
// //   requestId: number;
// //   projectId: number;
// //   projectName: string;
// //   consultantName: string;
// //   requestedAt: string;
// //   status?: string;
// //   consultantEmail?: string;
// //   consultantPhoto?: string;
// //   skill?: string;
// //   experience?: string;
// //   marks10?: number;
// //   marks12?: number;
// //   graduationMarks?: number;
// //   resumeLink?: string;
// //   averageRating?: number;
// //   totalReviews?: number;
// // }

// // interface DepartmentProject {
// //   projectId: number;
// //   projectName: string;
// //   projectDescription?: string;
// //   projectType?: string;
// //   status: string;
// //   departmentId: number;
// //   departmentName: string;
// //   hasRequested: boolean;
// //   isAssigned?: boolean;
// //   managerName?: string;
// //   clientName?: string;
// //   deadline?: string;
// // }

// // interface Team {
// //   teamId: number;
// //   teamName: string;
// //   projectName: string;
// //   projectId?: number;
// //   managerName: string;
// //   members: TeamMember[];
// //   createdAt?: string;
// // }

// // interface TeamMember {
// //   memberName: string;
// //   role: string;
// //   memberEmail?: string;
// //   photoUrl?: string;
// //   description?: string;
// // }

// // interface FileItem {
// //   fileId: number;
// //   fileType: string;
// //   fileLink: string;
// //   uploaderName: string;
// //   uploadTime?: string;
// //   projectId?: number;
// //   projectName?: string;
// //   departmentId?: number;
// //   departmentName?: string;
// // }

// // interface Project {
// //   projectId: number;
// //   projectName: string;
// //   status: string;
// //   departmentName: string;
// //   projectDescription?: string;
// //   projectType?: string;
// //   clientName?: string;
// //   deadline?: string;
// //   clientEmail?: string;
// //   assignedManagerName?: string;
// //   createdAt?: string;
// //   updatedAt?: string;
// // }

// // interface ProjectHistory {
// //   statusId: number;
// //   status: string;
// //   dateTime: string;
// //   handledByName?: string;
// //   managerNote?: string;
// //   directorNote?: string;
// //   assignedToName?: string;
// //   deadline?: string;
// // }

// // interface StatusHistory {
// //   statusId: number;
// //   status: string;
// //   note: string;
// //   dateTime: string;
// // }

// // interface LatestStatus {
// //   statusId: number;
// //   status: string;
// //   note: string;
// //   dateTime: string;
// // }

// // interface Rating {
// //   reviewId: number;
// //   consultantId: number;
// //   consultantName: string;
// //   reviewerName: string;
// //   reviewMarks: number;
// //   reviewNote: string;
// //   createdAt: string;
// // }

// // interface Role {
// //   id: number;
// //   ptype: string;
// //   stype: string;
// //   isApproved: string;
// //   createdAt: string;
// // }

// // interface MyDetails {
// //   user: UserProfile;
// //   roles: Role[];
// //   employee: null;
// // }

// // // New API response types
// // interface TeamProject {
// //   projectId: number;
// //   projectName: string;
// //   projectDescription: string;
// //   projectType: string;
// //   status: string;
// //   departmentName: string;
// //   clientName: string;
// //   managerName: string;
// //   deadline: string;
// //   files: FileItem[];
// // }

// // // ============================================
// // // API CONFIGURATION
// // // ============================================

// // const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// // const apiCall = async <T,>(
// //   method: string,
// //   endpoint: string,
// //   data?: any,
// //   isFormData: boolean = false
// // ): Promise<T> => {
// //   try {
// //     const config: any = {
// //       method,
// //       url: `${API_BASE}${endpoint}`,
// //       withCredentials: true,
// //     };

// //     if (isFormData) {
// //       config.data = data;
// //       config.headers = { 'Content-Type': 'multipart/form-data' };
// //     } else if (data) {
// //       config.data = data;
// //       config.headers = { 'Content-Type': 'application/json' };
// //     }

// //     const response = await axios(config);
// //     return response.data;
// //   } catch (error: any) {
// //     throw error.response?.data || error;
// //   }
// // };

// // // ============================================
// // // CONSULTANT API FUNCTIONS
// // // ============================================

// // const applyAsConsultant = async (formData: FormData) => {
// //   return apiCall('POST', '/api/consultant/apply', formData, true);
// // };

// // const getMyConsultantDetails = async () => {
// //   return apiCall<{ success: boolean; data: ConsultantDetails }>('GET', '/api/consultant/my-details');
// // };

// // const updateConsultantDetails = async (formData: FormData) => {
// //   return apiCall('PUT', '/api/consultant/update', formData, true);
// // };

// // const getMyStatusHistory = async () => {
// //   return apiCall<{ success: boolean; data: StatusHistory[] }>('GET', '/api/consultant/my-status-history');
// // };

// // const getMyLatestStatus = async () => {
// //   return apiCall<{ success: boolean; data: LatestStatus }>('GET', '/api/consultant/my-latest-status');
// // };

// // const getMyRatings = async () => {
// //   return apiCall<{ success: boolean; data: Rating[] }>('GET', '/api/consultant/my-ratings');
// // };

// // const getMyAverageRating = async () => {
// //   return apiCall<{ success: boolean; data: number }>('GET', '/api/consultant/my-average-rating');
// // };

// // // ============================================
// // // TASK APIs
// // // ============================================

// // const getMyTasks = async () => {
// //   return apiCall<{ success: boolean; data: Task[] }>('GET', '/api/task/my-tasks');
// // };

// // const updateTaskStatus = async (taskId: number, status: string, managerNote?: string) => {
// //   let url = `/api/task/update-status/${taskId}?status=${status}`;
// //   if (managerNote) {
// //     url += `&managerNote=${encodeURIComponent(managerNote)}`;
// //   }
// //   return apiCall('PUT', url, null);
// // };

// // const getProjectTasks = async (projectId: number) => {
// //   return apiCall<{ success: boolean; data: Task[] }>('GET', `/api/task/project/${projectId}`);
// // };

// // // ============================================
// // // PROJECT REQUEST APIs (Improved)
// // // ============================================

// // const getDepartmentProjects = async () => {
// //   return apiCall<{ success: boolean; data: DepartmentProject[] }>(
// //     'GET',
// //     '/api/consultant-project/department-projects'
// //   );
// // };

// // const requestProject = async (projectId: number) => {
// //   return apiCall('POST', `/api/consultant-project/request/${projectId}`);
// // };

// // const getMyProjectRequests = async () => {
// //   return apiCall<{ success: boolean; data: ProjectRequest[] }>(
// //     'GET',
// //     '/api/consultant-project/my-requests'
// //   );
// // };

// // const hasRequestedProject = async (projectId: number) => {
// //   return apiCall<{ success: boolean; data: boolean }>(
// //     'GET',
// //     `/api/consultant-project/has-requested/${projectId}`
// //   );
// // };

// // // ============================================
// // // NEW CONSULTANT APIs (Improved)
// // // ============================================

// // const getMyTeamProjects = async () => {
// //   return apiCall<{ success: boolean; data: TeamProject[] }>(
// //     'GET',
// //     '/api/consultant/my-team-projects'
// //   );
// // };

// // // ============================================
// // // TEAM APIs
// // // ============================================

// // const getMyConsultantTeams = async () => {
// //   return apiCall<{ success: boolean; data: Team[] }>('GET', '/api/team/my-consultant-teams');
// // };

// // const getProjectTeams = async (projectId: number) => {
// //   return apiCall<{ success: boolean; data: Team[] }>('GET', `/api/team/project/${projectId}`);
// // };

// // // ============================================
// // // FILE APIs
// // // ============================================

// // const uploadFile = async (projectId: number, file: File, fileType: string) => {
// //   const formData = new FormData();
// //   formData.append('file', file);
// //   return apiCall('POST', `/api/file/upload/${projectId}?fileType=${fileType}`, formData, true);
// // };

// // const getProjectFiles = async (projectId: number) => {
// //   return apiCall<{ success: boolean; data: FileItem[] }>('GET', `/api/file/project/${projectId}`);
// // };

// // const getMyUploads = async () => {
// //   return apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/my-uploads');
// // };

// // const deleteFile = async (fileId: number) => {
// //   return apiCall('DELETE', `/api/file/delete/${fileId}`);
// // };

// // const getAccessToken = async (fileId: number) => {
// //   return apiCall('POST', `/api/file/access-token/${fileId}`, {});
// // };

// // // ============================================
// // // PROJECT APIs (View Only)
// // // ============================================

// // const getProjectById = async (projectId: number) => {
// //   return apiCall<{ success: boolean; data: Project }>('GET', `/api/project/${projectId}`);
// // };

// // const getProjectHistory = async (projectId: number) => {
// //   return apiCall<{ success: boolean; data: ProjectHistory[] }>(
// //     'GET',
// //     `/api/project/${projectId}/history`
// //   );
// // };

// // // ============================================
// // // USER PROFILE APIs
// // // ============================================

// // const getCompleteProfile = async () => {
// //   return apiCall<{ success: boolean; data: { user: UserProfile; roles: Role[] } }>(
// //     'GET',
// //     '/api/users/complete'
// //   );
// // };

// // const getUserProfile = async () => {
// //   return apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile');
// // };

// // const updateUserProfile = async (data: { name?: string; phoneNumber?: string; address?: string; gender?: string; dob?: string }) => {
// //   return apiCall('PUT', '/api/users/profile', data);
// // };

// // const deleteAccount = async () => {
// //   return apiCall('DELETE', '/api/users/account');
// // };

// // const getMyDetails = async () => {
// //   return apiCall<{ success: boolean; data: MyDetails }>('GET', '/api/getmydetails');
// // };

// // // ============================================
// // // RESUME GENERATION
// // // ============================================

// // import PizZip from "pizzip";
// // import Docxtemplater from "docxtemplater";
// // import { saveAs } from "file-saver";

// // interface ResumeData {
// //   name: string;
// //   email: string;
// //   photo: string;
// //   marks10: string;
// //   marks12: string;
// //   graduationMarks: string;
// //   stream: string;
// //   experience: string;
// //   skill: string;
// //   skillType: string;
// // }

// // const generateResumeBlob = async (data: ResumeData): Promise<Blob> => {
// //   const res = await fetch("/templates/resume-template.docx");
// //   const content = await res.arrayBuffer();
// //   const zip = new PizZip(content);
// //   const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  
// //   doc.setData({
// //     name: data.name,
// //     email: data.email,
// //     photo: data.photo,
// //     marks10: data.marks10,
// //     marks12: data.marks12,
// //     graduationMarks: data.graduationMarks,
// //     stream: data.stream,
// //     experience: data.experience,
// //     skill: data.skill,
// //     skillType: data.skillType
// //   });
  
// //   doc.render();
// //   return doc.getZip().generate({
// //     type: "blob",
// //     mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
// //   });
// // };

// // const generateResume = async (data: ResumeData) => {
// //   const blob = await generateResumeBlob(data);
// //   saveAs(blob, "resume.docx");
// // };

// // // ============================================
// // // SIDEBAR MENU ITEMS
// // // ============================================

// // const menuItems = [
// //   { id: 'dashboard', label: 'Dashboard', icon: '📊' },
// //   { id: 'activity-log', label: 'Activity Log', icon: '📋' },
// //   { id: 'my-details', label: 'My Details', icon: '📝' },
// //   { id: 'my-tasks', label: 'My Tasks', icon: '✅' },
// //   { id: 'projects', label: 'Available Projects', icon: '📁' },
// //   { id: 'my-requests', label: 'My Requests', icon: '📨' },
// //   { id: 'my-teams', label: 'My Teams', icon: '👥' },
// //   { id: 'my-team-projects', label: 'Team Projects', icon: '🚀' },
// //   { id: 'my-uploads', label: 'My Uploads', icon: '📎' },
// //   { id: 'profile', label: 'Profile', icon: '👤' },
// // ];

// // // ============================================
// // // STATUS CONFIGURATION
// // // ============================================

// // const statusConfig: Record<string, { label: string; class: string; icon: string; color: string }> = {
// //   APPLIED: { label: 'Applied', class: 'status-pending', icon: '📝', color: '#F59E0B' },
// //   DOCUMENT_VERIFIED: { label: 'Documents Verified', class: 'status-progress', icon: '✓', color: '#3B82F6' },
// //   INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', class: 'status-progress', icon: '📅', color: '#8B5CF6' },
// //   INTERVIEW_PASSED: { label: 'Interview Passed', class: 'status-progress', icon: '🎉', color: '#10B981' },
// //   INTERVIEW_FAILED: { label: 'Interview Failed', class: 'status-rejected', icon: '❌', color: '#EF4444' },
// //   APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅', color: '#10B981' },
// //   REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '🚫', color: '#EF4444' },
// //   ACTIVE: { label: 'Active', class: 'status-approved', icon: '🟢', color: '#10B981' },
// //   INACTIVE: { label: 'Inactive', class: 'status-rejected', icon: '⚪', color: '#6B7280' },
// //   BLOCKED: { label: 'Blocked', class: 'status-rejected', icon: '🔴', color: '#EF4444' },
// //   CONVERTED_TO_EMPLOYEE: { label: 'Converted to Employee', class: 'status-approved', icon: '💼', color: '#8B5CF6' },
// //   PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳', color: '#F59E0B' },
// //   IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄', color: '#3B82F6' },
// //   COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️', color: '#10B981' },
// //   ASSIGNED: { label: 'Assigned', class: 'status-assigned', icon: '👥', color: '#8B5CF6' },
// // };

// // const getStatusBadge = (status: string) => {
// //   const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌', color: '#6B7280' };
// //   return (
// //     <span className={`status-badge ${config.class}`}>
// //       <span className="status-icon">{config.icon}</span>
// //       {config.label}
// //     </span>
// //   );
// // };

// // // ============================================
// // // MAIN CONSULTANT COMPONENT
// // // ============================================

// // const Consultant: React.FC = () => {
// //   const [activeNav, setActiveNav] = useState('dashboard');
// //   const [loading, setLoading] = useState(true);
// //   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
// //   const [user, setUser] = useState<UserProfile | null>(null);
// //   const [myDetails, setMyDetails] = useState<MyDetails | null>(null);
// //   const [consultantDetails, setConsultantDetails] = useState<ConsultantDetails | null>(null);
// //   const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
// //   const [latestStatus, setLatestStatus] = useState<LatestStatus | null>(null);
// //   const [ratings, setRatings] = useState<Rating[]>([]);
// //   const [averageRating, setAverageRating] = useState<number>(0);

// //   // Data states
// //   const [tasks, setTasks] = useState<Task[]>([]);
// //   const [departmentProjects, setDepartmentProjects] = useState<DepartmentProject[]>([]);
// //   const [myRequests, setMyRequests] = useState<ProjectRequest[]>([]);
// //   const [myTeams, setMyTeams] = useState<Team[]>([]);
// //   const [myUploads, setMyUploads] = useState<FileItem[]>([]);
// //   const [myTeamProjects, setMyTeamProjects] = useState<TeamProject[]>([]);

// //   // Modal states
// //   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
// //   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
// //   const [selectedProjectForFiles, setSelectedProjectForFiles] = useState<number | null>(null);
// //   const [projectFiles, setProjectFiles] = useState<FileItem[]>([]);
// //   const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);
// //   const [projectTeams, setProjectTeams] = useState<Team[]>([]);
  
// //   const [showTaskModal, setShowTaskModal] = useState(false);
// //   const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
// //   const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
// //   const [showProfileModal, setShowProfileModal] = useState(false);
// //   const [showApplyModal, setShowApplyModal] = useState(false);
// //   const [showEditDetailsModal, setShowEditDetailsModal] = useState(false);
// //   const { logout } = useAuth();

// //   // Form states
// //   const [updateTaskData, setUpdateTaskData] = useState({ status: '', managerNote: '' });
// //   const [uploadData, setUploadData] = useState({ file: null as File | null, fileType: '', projectId: 0 });
// //   const [applyFormData, setApplyFormData] = useState({
// //     marks10: '',
// //     marks12: '',
// //     graduationMarks: '',
// //     stream: '',
// //     experience: '',
// //     skill: '',
// //     skillType: '',
// //   });
// //   const [resumeFile, setResumeFile] = useState<File | null>(null);
  
// //   // Filter states
// //   const [taskFilter, setTaskFilter] = useState('all');
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [darkMode, setDarkMode] = useState(false);

// //   // Grouped uploads for folder view
// //   const [groupedUploads, setGroupedUploads] = useState<Record<string, FileItem[]>>({});

// //   useEffect(() => {
// //     const savedTheme = localStorage.getItem('theme');
// //     if (savedTheme === 'dark') {
// //       setDarkMode(true);
// //       document.documentElement.setAttribute('data-theme', 'dark');
// //     }
// //     loadInitialData();
// //   }, []);

// //   useEffect(() => {
// //     // Group uploads by project
// //     const grouped: Record<string, FileItem[]> = {};
// //     myUploads.forEach(upload => {
// //       const key = upload.projectName || 'Other';
// //       if (!grouped[key]) grouped[key] = [];
// //       grouped[key].push(upload);
// //     });
// //     setGroupedUploads(grouped);
// //   }, [myUploads]);

// //   const loadInitialData = async () => {
// //     setLoading(true);
// //     try {
// //       const [profileRes, detailsRes, consultantRes, statusHistoryRes, latestStatusRes, ratingsRes, avgRatingRes] = await Promise.all([
// //         getUserProfile().catch(() => ({ data: null })),
// //         getMyDetails().catch(() => ({ data: null })),
// //         getMyConsultantDetails().catch(() => ({ data: null })),
// //         getMyStatusHistory().catch(() => ({ data: [] })),
// //         getMyLatestStatus().catch(() => ({ data: null })),
// //         getMyRatings().catch(() => ({ data: [] })),
// //         getMyAverageRating().catch(() => ({ data: 0 })),
// //       ]);

// //       setUser(profileRes.data);
// //       setMyDetails(detailsRes.data);
// //       setConsultantDetails(consultantRes.data || null);
// //       setStatusHistory(statusHistoryRes.data || []);
// //       setLatestStatus(latestStatusRes.data || null);
// //       setRatings(ratingsRes.data || []);
// //       setAverageRating(avgRatingRes.data || 0);
      
// //       if (consultantRes.data) {
// //         await loadAllData();
// //       }
// //     } catch (error) {
// //       console.error('Error loading initial data:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadAllData = async () => {
// //     try {
// //       const [tasksRes, projectsRes, requestsRes, teamsRes, uploadsRes, teamProjectsRes] = await Promise.all([
// //         getMyTasks().catch(() => ({ data: [] })),
// //         getDepartmentProjects().catch(() => ({ data: [] })),
// //         getMyProjectRequests().catch(() => ({ data: [] })),
// //         getMyConsultantTeams().catch(() => ({ data: [] })),
// //         getMyUploads().catch(() => ({ data: [] })),
// //         getMyTeamProjects().catch(() => ({ data: [] })),
// //       ]);

// //       setTasks(tasksRes.data);
// //       setDepartmentProjects(projectsRes.data);
// //       setMyRequests(requestsRes.data);
// //       setMyTeams(teamsRes.data);
// //       setMyUploads(uploadsRes.data);
// //       setMyTeamProjects(teamProjectsRes.data);
// //     } catch (error) {
// //       console.error('Error loading data:', error);
// //     }
// //   };

// //   const toggleDarkMode = () => {
// //     const newMode = !darkMode;
// //     setDarkMode(newMode);
// //     if (newMode) {
// //       document.documentElement.setAttribute('data-theme', 'dark');
// //       localStorage.setItem('theme', 'dark');
// //     } else {
// //       document.documentElement.setAttribute('data-theme', 'light');
// //       localStorage.setItem('theme', 'light');
// //     }
// //   };

// //   const handleGenerateResume = async () => {
// //     if (!consultantDetails || !user) {
// //       alert('Consultant details not found');
// //       return;
// //     }
    
// //     const resumeData: ResumeData = {
// //       name: user.name,
// //       email: user.email,
// //       photo: user.photoUrl || '',
// //       marks10: consultantDetails.marks10.toString(),
// //       marks12: consultantDetails.marks12.toString(),
// //       graduationMarks: consultantDetails.graduationMarks.toString(),
// //       stream: consultantDetails.stream,
// //       experience: consultantDetails.experience,
// //       skill: consultantDetails.skill,
// //       skillType: consultantDetails.skillType,
// //     };
    
// //     try {
// //       await generateResume(resumeData);
// //       alert('Resume downloaded successfully');
// //     } catch (error) {
// //       console.error('Error generating resume:', error);
// //       alert('Failed to generate resume. Please check if template exists.');
// //     }
// //   };

// //   const handleApplyAsConsultant = async () => {
// //     try {
// //       const formData = new FormData();
// //       formData.append('marks10', applyFormData.marks10);
// //       formData.append('marks12', applyFormData.marks12);
// //       formData.append('graduationMarks', applyFormData.graduationMarks);
// //       formData.append('stream', applyFormData.stream);
// //       formData.append('experience', applyFormData.experience);
// //       formData.append('skill', applyFormData.skill);
// //       formData.append('skillType', applyFormData.skillType);
// //       if (resumeFile) {
// //         formData.append('resume', resumeFile);
// //       }

// //       const response = await applyAsConsultant(formData);
// //       alert(response.message || 'Application submitted successfully');
      
// //       const consultantRes = await getMyConsultantDetails();
// //       setConsultantDetails(consultantRes.data);
// //       const statusHistoryRes = await getMyStatusHistory();
// //       setStatusHistory(statusHistoryRes.data);
// //       const latestStatusRes = await getMyLatestStatus();
// //       setLatestStatus(latestStatusRes.data);
// //       setShowApplyModal(false);
      
// //       setApplyFormData({
// //         marks10: '',
// //         marks12: '',
// //         graduationMarks: '',
// //         stream: '',
// //         experience: '',
// //         skill: '',
// //         skillType: '',
// //       });
// //       setResumeFile(null);
// //       await loadAllData();
// //     } catch (error: any) {
// //       console.error('Error applying as consultant:', error);
// //       alert(error.message || 'Failed to submit application');
// //     }
// //   };

// //   const handleUpdateConsultantDetails = async () => {
// //     try {
// //       const formData = new FormData();
// //       formData.append('marks10', applyFormData.marks10);
// //       formData.append('marks12', applyFormData.marks12);
// //       formData.append('graduationMarks', applyFormData.graduationMarks);
// //       formData.append('stream', applyFormData.stream);
// //       formData.append('experience', applyFormData.experience);
// //       formData.append('skill', applyFormData.skill);
// //       formData.append('skillType', applyFormData.skillType);
// //       if (resumeFile) {
// //         formData.append('resume', resumeFile);
// //       }

// //       const response = await updateConsultantDetails(formData);
// //       alert(response.message || 'Details updated successfully');
      
// //       const consultantRes = await getMyConsultantDetails();
// //       setConsultantDetails(consultantRes.data);
// //       setShowEditDetailsModal(false);
// //       await loadAllData();
// //     } catch (error: any) {
// //       console.error('Error updating consultant details:', error);
// //       alert(error.message || 'Failed to update details');
// //     }
// //   };

// //   const handleUpdateTaskStatus = async () => {
// //     if (!selectedTask) return;
// //     if (!updateTaskData.status) {
// //       alert('Please select a status');
// //       return;
// //     }
// //     try {
// //       await updateTaskStatus(selectedTask.taskId, updateTaskData.status, updateTaskData.managerNote);
// //       await loadAllData();
// //       setShowUpdateTaskModal(false);
// //       setSelectedTask(null);
// //       setUpdateTaskData({ status: '', managerNote: '' });
// //       alert('Task status updated successfully');
// //     } catch (error: any) {
// //       console.error('Error updating task status:', error);
// //       alert(error.message || 'Failed to update task status');
// //     }
// //   };

// //   const handleRequestProject = async (projectId: number) => {
// //     try {
// //       await requestProject(projectId);
// //       await loadAllData();
// //       alert('Project request sent successfully');
// //     } catch (error: any) {
// //       console.error('Error requesting project:', error);
// //       alert(error.message || 'Failed to request project');
// //     }
// //   };

// //   const handleUploadFile = async () => {
// //     if (!selectedProjectForFiles || !uploadData.file) {
// //       alert('Please select a file and project');
// //       return;
// //     }
// //     if (!uploadData.fileType) {
// //       alert('Please select file type');
// //       return;
// //     }
// //     try {
// //       await uploadFile(selectedProjectForFiles, uploadData.file, uploadData.fileType);
// //       const filesRes = await getProjectFiles(selectedProjectForFiles);
// //       setProjectFiles(filesRes.data);
// //       const uploadsRes = await getMyUploads();
// //       setMyUploads(uploadsRes.data);
// //       setUploadData({ file: null, fileType: '', projectId: 0 });
// //       alert('File uploaded successfully');
// //     } catch (error: any) {
// //       console.error('Error uploading file:', error);
// //       alert(error.message || 'Failed to upload file');
// //     }
// //   };

// //   const handleViewFile = async (fileId: number) => {
// //     try {
// //       const tokenRes = await getAccessToken(fileId);
// //       if (tokenRes.success && tokenRes.data) {
// //         window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
// //       } else {
// //         alert('Cannot view file');
// //       }
// //     } catch (error) {
// //       alert('Cannot view file');
// //     }
// //   };

// //   const handleDownloadFile = async (fileId: number) => {
// //     try {
// //       const tokenRes = await getAccessToken(fileId);
// //       if (tokenRes.success && tokenRes.data) {
// //         window.open(`${API_BASE}${tokenRes.data.downloadUrl}`, '_blank');
// //       } else {
// //         alert('Cannot download file');
// //       }
// //     } catch (error) {
// //       alert('Download failed');
// //     }
// //   };

// //   const handleDeleteFile = async (fileId: number) => {
// //     if (confirm('Are you sure you want to delete this file?')) {
// //       try {
// //         await deleteFile(fileId);
// //         if (selectedProjectForFiles) {
// //           const filesRes = await getProjectFiles(selectedProjectForFiles);
// //           setProjectFiles(filesRes.data);
// //         }
// //         const uploadsRes = await getMyUploads();
// //         setMyUploads(uploadsRes.data);
// //         alert('File deleted successfully');
// //       } catch (error: any) {
// //         console.error('Error deleting file:', error);
// //         alert(error.message || 'Failed to delete file');
// //       }
// //     }
// //   };

// //   const handleViewProject = async (projectId: number) => {
// //     try {
// //       const [projectRes, historyRes, teamsRes, filesRes] = await Promise.all([
// //         getProjectById(projectId),
// //         getProjectHistory(projectId).catch(() => ({ data: [] })),
// //         getProjectTeams(projectId).catch(() => ({ data: [] })),
// //         getProjectFiles(projectId).catch(() => ({ data: [] })),
// //       ]);
// //       setSelectedProject(projectRes.data);
// //       setProjectHistory(historyRes.data);
// //       setProjectTeams(teamsRes.data);
// //       setProjectFiles(filesRes.data);
// //       setSelectedProjectForFiles(projectId);
// //       setShowProjectDetailModal(true);
// //     } catch (error: any) {
// //       console.error('Error loading project details:', error);
// //       alert(error.message || 'Failed to load project details');
// //     }
// //   };

// //   const handleUpdateProfile = async (data: any) => {
// //     try {
// //       await updateUserProfile(data);
// //       const profileRes = await getUserProfile();
// //       setUser(profileRes.data);
// //       setShowProfileModal(false);
// //       alert('Profile updated successfully');
// //     } catch (error: any) {
// //       console.error('Error updating profile:', error);
// //       alert(error.message || 'Failed to update profile');
// //     }
// //   };

// //   const handleDeleteAccount = async () => {
// //     if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
// //       try {
// //         await deleteAccount();
// //         await logout();
// //         window.location.href = '/';
// //       } catch (error: any) {
// //         console.error('Error deleting account:', error);
// //         alert(error.message || 'Failed to delete account');
// //       }
// //     }
// //   };

// //   const handleLogout = async () => {
// //     try {
// //       await logout();
// //       window.location.href = '/';
// //     } catch (error) {
// //       console.error('Logout error:', error);
// //     }
// //   };

// //   // Filter tasks
// //   const filteredTasks = tasks
// //     .filter((task) => {
// //       if (taskFilter === 'pending') return task.taskStatus === 'PENDING';
// //       if (taskFilter === 'in_progress') return task.taskStatus === 'IN_PROGRESS';
// //       if (taskFilter === 'completed') return task.taskStatus === 'COMPLETED';
// //       return true;
// //     })
// //     .filter((task) =>
// //       task.taskDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       task.projectName.toLowerCase().includes(searchQuery.toLowerCase())
// //     );

// //   const hasApplied = consultantDetails !== null;
// //   const displayAverageRating = averageRating > 0 ? averageRating : 
// //     (ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.reviewMarks, 0) / ratings.length : 0);

// //   const getStatusColor = (status: string) => {
// //     return statusConfig[status]?.color || '#6B7280';
// //   };

// //   const formatDate = (dateString: string) => {
// //     try {
// //       return new Date(dateString).toLocaleString();
// //     } catch {
// //       return dateString;
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="client-loader">
// //         <div className="loader-spinner"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="client-container">
// //       <CommonSidebar
// //         activeNav={activeNav}
// //         setActiveNav={setActiveNav}
// //         onLogout={handleLogout}
// //         onThemeToggle={toggleDarkMode}
// //         darkMode={darkMode}
// //         user={user ? { name: user.name, email: user.email, photoUrl: user.photoUrl } : null}
// //         menuItems={menuItems}
// //         title="Consultant Portal"
// //         logoIcon="👨‍💻"
// //         isOpen={mobileSidebarOpen}
// //         onClose={() => setMobileSidebarOpen(false)}
// //       />

// //       <button
// //         className="mobile-menu-btn"
// //         onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
// //       >
// //         ☰
// //       </button>

// //       <main className="client-main">
// //         <header className="client-header">
// //           <div className="header-welcome">
// //             <h1>Welcome back, {user?.name?.split(' ')[0] || 'Consultant'}!</h1>
// //             <p>Consultant Dashboard - Project Management Portal</p>
// //           </div>
// //           <div className="header-stats">
// //             <div className="header-stat-item">
// //               <span className="stat-label">Status</span>
// //               <span className="stat-value-sm">
// //                 {latestStatus ? getStatusBadge(latestStatus.status) : 
// //                   <span className="status-badge status-pending">⏳ Not Applied</span>
// //                 }
// //               </span>
// //             </div>
// //             <div className="header-stat-item">
// //               <span className="stat-label">Rating</span>
// //               <span className="stat-value-sm">⭐ {displayAverageRating.toFixed(1)} / 5</span>
// //             </div>
// //             <div className="header-stat-item">
// //               <span className="stat-label">Tasks</span>
// //               <span className="stat-value-sm">{tasks.filter(t => t.taskStatus !== 'COMPLETED').length} Active</span>
// //             </div>
// //           </div>
// //         </header>

// //         {/* Show Apply Form if consultant hasn't applied */}
// //         {!hasApplied && (
// //           <div className="dashboard-card">
// //             <div className="card-header">
// //               <h2>Complete Your Consultant Application</h2>
// //               <p className="card-subtitle">Fill in your details to apply as a consultant</p>
// //             </div>
// //             <div className="apply-form">
// //               <div className="details-grid">
// //                 <div className="form-field">
// //                   <label>10th Marks (%)</label>
// //                   <input
// //                     type="number"
// //                     placeholder="e.g., 85.5"
// //                     value={applyFormData.marks10}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, marks10: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>12th Marks (%)</label>
// //                   <input
// //                     type="number"
// //                     placeholder="e.g., 78.0"
// //                     value={applyFormData.marks12}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, marks12: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Graduation Marks (%)</label>
// //                   <input
// //                     type="number"
// //                     placeholder="e.g., 72.3"
// //                     value={applyFormData.graduationMarks}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, graduationMarks: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Stream</label>
// //                   <input
// //                     type="text"
// //                     placeholder="e.g., Computer Science"
// //                     value={applyFormData.stream}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, stream: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Experience</label>
// //                   <input
// //                     type="text"
// //                     placeholder="e.g., 3 years"
// //                     value={applyFormData.experience}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, experience: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Skills</label>
// //                   <input
// //                     type="text"
// //                     placeholder="e.g., Java, Spring Boot, React"
// //                     value={applyFormData.skill}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, skill: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Skill Type</label>
// //                   <input
// //                     type="text"
// //                     placeholder="e.g., Full Stack"
// //                     value={applyFormData.skillType}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, skillType: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Resume (PDF/DOC)</label>
// //                   <input
// //                     type="file"
// //                     accept=".pdf,.doc,.docx"
// //                     onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
// //                   />
// //                   {resumeFile && <small className="file-name">{resumeFile.name}</small>}
// //                 </div>
// //               </div>
// //               <button className="btn-msub" onClick={handleApplyAsConsultant}>
// //                 Submit Application
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {/* Dashboard Tab */}
// //         {activeNav === 'dashboard' && hasApplied && (
// //           <>
// //             <div className="stats-grid">
// //               <div className="stat-card">
// //                 <div className="stat-icon blue">✅</div>
// //                 <div className="stat-info">
// //                   <span className="stat-value">{tasks.length}</span>
// //                   <span className="stat-label">Total Tasks</span>
// //                 </div>
// //               </div>
// //               <div className="stat-card">
// //                 <div className="stat-icon green">🔄</div>
// //                 <div className="stat-info">
// //                   <span className="stat-value">{tasks.filter(t => t.taskStatus === 'IN_PROGRESS').length}</span>
// //                   <span className="stat-label">In Progress</span>
// //                 </div>
// //               </div>
// //               <div className="stat-card">
// //                 <div className="stat-icon orange">📁</div>
// //                 <div className="stat-info">
// //                   <span className="stat-value">{departmentProjects.length}</span>
// //                   <span className="stat-label">Available Projects</span>
// //                 </div>
// //               </div>
// //               <div className="stat-card">
// //                 <div className="stat-icon purple">👥</div>
// //                 <div className="stat-info">
// //                   <span className="stat-value">{myTeams.length}</span>
// //                   <span className="stat-label">My Teams</span>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Current Status Card */}
// //             {latestStatus && (
// //               <div className="dashboard-card status-card">
// //                 <div className="card-header">
// //                   <h2>📊 Current Activity Status</h2>
// //                   <span className="status-badge-large" style={{ backgroundColor: getStatusColor(latestStatus.status) }}>
// //                     {statusConfig[latestStatus.status]?.icon} {statusConfig[latestStatus.status]?.label}
// //                   </span>
// //                 </div>
// //                 <div className="status-details">
// //                   <p><strong>Note:</strong> {latestStatus.note || 'No additional notes'}</p>
// //                   <p><strong>Last Updated:</strong> {formatDate(latestStatus.dateTime)}</p>
// //                 </div>
// //               </div>
// //             )}

// //             {/* Ratings Section */}
// //             {ratings.length > 0 && (
// //               <div className="dashboard-card">
// //                 <div className="card-header">
// //                   <h2>⭐ My Ratings & Reviews</h2>
// //                   <div className="average-rating">
// //                     Average: <strong>{displayAverageRating.toFixed(1)} / 5</strong> ({ratings.length} reviews)
// //                   </div>
// //                 </div>
// //                 <div className="ratings-list">
// //                   {ratings.slice(0, 3).map((rating) => (
// //                     <div key={rating.reviewId} className="rating-item">
// //                       <div className="rating-header">
// //                         <strong>{rating.reviewerName}</strong>
// //                         <span className="rating-stars">⭐ {rating.reviewMarks}/5</span>
// //                       </div>
// //                       <p className="rating-note">{rating.reviewNote}</p>
// //                       <small className="rating-date">{formatDate(rating.createdAt)}</small>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 {ratings.length > 3 && (
// //                   <button className="view-all-link" onClick={() => alert('All ratings feature coming soon')}>
// //                     View All {ratings.length} Reviews →
// //                   </button>
// //                 )}
// //               </div>
// //             )}

// //             {/* Recent Tasks */}
// //             <div className="dashboard-card">
// //               <div className="card-header">
// //                 <h2>My Recent Tasks</h2>
// //                 <button className="view-all-link" onClick={() => setActiveNav('my-tasks')}>
// //                   View All →
// //                 </button>
// //               </div>
// //               <div className="projects-grid">
// //                 {tasks.slice(0, 3).map((task) => (
// //                   <div key={task.taskId} className="project-card">
// //                     <div className="project-card-header">
// //                       <h3>{task.taskDetails}</h3>
// //                       {getStatusBadge(task.taskStatus)}
// //                     </div>
// //                     <p className="project-card-desc">{task.description?.substring(0, 80) || 'No description'}</p>
// //                     <div className="project-card-meta">
// //                       <span>📁 {task.projectName}</span>
// //                       <span>👤 {task.createdByName}</span>
// //                       {task.deadline && <span>📅 Due: {new Date(task.deadline).toLocaleDateString()}</span>}
// //                     </div>
// //                     <div className="project-card-actions">
// //                       <button
// //                         className="btn-sm btn-primary"
// //                         onClick={() => {
// //                           setSelectedTask(task);
// //                           setShowTaskModal(true);
// //                         }}
// //                       >
// //                         View Details
// //                       </button>
// //                       {task.taskStatus !== 'COMPLETED' && (
// //                         <button
// //                           className="btn-sm btn-outline"
// //                           onClick={() => {
// //                             setSelectedTask(task);
// //                             setShowUpdateTaskModal(true);
// //                           }}
// //                         >
// //                           Update Status
// //                         </button>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //               {tasks.length === 0 && (
// //                 <div className="empty-state">
// //                   <span className="empty-icon">✅</span>
// //                   <p>No tasks assigned yet</p>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Available Projects */}
// //             <div className="dashboard-card">
// //               <div className="card-header">
// //                 <h2>Available Projects</h2>
// //                 <button className="view-all-link" onClick={() => setActiveNav('projects')}>
// //                   View All →
// //                 </button>
// //               </div>
// //               <div className="projects-grid">
// //                 {departmentProjects.slice(0, 3).map((project) => (
// //                   <div key={project.projectId} className="project-card">
// //                     <div className="project-card-header">
// //                       <h3>{project.projectName}</h3>
// //                       {getStatusBadge(project.status)}
// //                     </div>
// //                     <div className="project-card-meta">
// //                       <span>🏢 {project.departmentName}</span>
// //                       {project.managerName && <span>👔 {project.managerName}</span>}
// //                     </div>
// //                     <div className="project-card-actions">
// //                       <button
// //                         className="btn-sm btn-primary"
// //                         onClick={() => handleViewProject(project.projectId)}
// //                       >
// //                         View Details
// //                       </button>
// //                       {!project.hasRequested && project.status === 'IN_PROGRESS' && (
// //                         <button
// //                           className="btn-sm btn-outline"
// //                           onClick={() => handleRequestProject(project.projectId)}
// //                         >
// //                           Request to Join
// //                         </button>
// //                       )}
// //                       {project.hasRequested && (
// //                         <span className="status-badge status-pending">⏳ Requested</span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //               {departmentProjects.length === 0 && (
// //                 <div className="empty-state">
// //                   <span className="empty-icon">📁</span>
// //                   <p>No projects available</p>
// //                 </div>
// //               )}
// //             </div>
// //           </>
// //         )}

// //         {/* Activity Log Tab */}
// //         {activeNav === 'activity-log' && hasApplied && (
// //           <div className="dashboard-card full-width">
// //             <div className="card-header">
// //               <h2>📋 Activity Log & Status History</h2>
// //               <div className="activity-summary">
// //                 <span className="activity-badge">Total Updates: {statusHistory.length}</span>
// //               </div>
// //             </div>
// //             <div className="activity-timeline">
// //               {statusHistory.length === 0 ? (
// //                 <div className="empty-state">
// //                   <span className="empty-icon">📭</span>
// //                   <p>No activity history available yet</p>
// //                 </div>
// //               ) : (
// //                 [...statusHistory].reverse().map((entry, index) => {
// //                   const config = statusConfig[entry.status] || { icon: '📌', label: entry.status, color: '#6B7280' };
// //                   return (
// //                     <div key={entry.statusId} className="timeline-item">
// //                       <div className="timeline-dot-wrapper">
// //                         <div className="timeline-dot" style={{ backgroundColor: config.color }}></div>
// //                         {index < statusHistory.length - 1 && <div className="timeline-line"></div>}
// //                       </div>
// //                       <div className="timeline-content">
// //                         <div className="timeline-header">
// //                           <span className="timeline-status-icon">{config.icon}</span>
// //                           <span className="timeline-status-label" style={{ color: config.color }}>
// //                             {config.label}
// //                           </span>
// //                           <span className="timeline-date">{formatDate(entry.dateTime)}</span>
// //                         </div>
// //                         {entry.note && (
// //                           <div className="timeline-note">
// //                             <span className="note-icon">📝</span>
// //                             <span className="note-text">{entry.note}</span>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </div>
// //                   );
// //                 })
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         {/* My Details Tab */}
// //         {activeNav === 'my-details' && consultantDetails && (
// //           <div className="dashboard-card full-width">
// //             <div className="card-header">
// //               <h2>My Consultant Details</h2>
// //               <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
// //                 <button className="btn-outline" onClick={handleGenerateResume}>
// //                   📄 Download Resume
// //                 </button>
// //                 <button className="btn-outline" onClick={() => {
// //                   setApplyFormData({
// //                     marks10: consultantDetails.marks10.toString(),
// //                     marks12: consultantDetails.marks12.toString(),
// //                     graduationMarks: consultantDetails.graduationMarks.toString(),
// //                     stream: consultantDetails.stream,
// //                     experience: consultantDetails.experience,
// //                     skill: consultantDetails.skill,
// //                     skillType: consultantDetails.skillType,
// //                   });
// //                   setShowEditDetailsModal(true);
// //                 }}>
// //                   ✏️ Edit Details
// //                 </button>
// //               </div>
// //             </div>
// //             <div className="details-grid">
// //               <div className="detail-item">
// //                 <label>Status</label>
// //                 {getStatusBadge(consultantDetails.isApproved)}
// //               </div>
// //               <div className="detail-item">
// //                 <label>Rating</label>
// //                 <span>⭐ {displayAverageRating.toFixed(1)} / 5 ({ratings.length} reviews)</span>
// //               </div>
// //               {consultantDetails.salary && consultantDetails.salary > 0 && (
// //                 <div className="detail-item">
// //                   <label>Salary</label>
// //                   <span>💰 ₹{consultantDetails.salary.toLocaleString()}/month</span>
// //                 </div>
// //               )}
// //               <div className="detail-item">
// //                 <label>10th Marks</label>
// //                 <span>{consultantDetails.marks10}%</span>
// //               </div>
// //               <div className="detail-item">
// //                 <label>12th Marks</label>
// //                 <span>{consultantDetails.marks12}%</span>
// //               </div>
// //               <div className="detail-item">
// //                 <label>Graduation Marks</label>
// //                 <span>{consultantDetails.graduationMarks}%</span>
// //               </div>
// //               <div className="detail-item">
// //                 <label>Stream</label>
// //                 <span>{consultantDetails.stream}</span>
// //               </div>
// //               <div className="detail-item">
// //                 <label>Experience</label>
// //                 <span>{consultantDetails.experience}</span>
// //               </div>
// //               <div className="detail-item">
// //                 <label>Skills</label>
// //                 <span className="skills-tags">
// //                   {consultantDetails.skill.split(',').map((s, i) => (
// //                     <span key={i} className="skill-tag">{s.trim()}</span>
// //                   ))}
// //                 </span>
// //               </div>
// //               <div className="detail-item">
// //                 <label>Skill Type</label>
// //                 <span>{consultantDetails.skillType}</span>
// //               </div>
// //               <div className="detail-item">
// //                 <label>Resume</label>
// //                 {consultantDetails.resumeLink && (
// //                   <a href={consultantDetails.resumeLink} target="_blank" rel="noopener noreferrer" className="resume-link">
// //                     📄 View Resume
// //                   </a>
// //                 )}
// //               </div>
// //               {consultantDetails.createdAt && (
// //                 <div className="detail-item">
// //                   <label>Applied On</label>
// //                   <span>{formatDate(consultantDetails.createdAt)}</span>
// //                 </div>
// //               )}
// //               {consultantDetails.updatedAt && (
// //                 <div className="detail-item">
// //                   <label>Last Updated</label>
// //                   <span>{formatDate(consultantDetails.updatedAt)}</span>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         {/* My Tasks Tab */}
// //         {activeNav === 'my-tasks' && (
// //           <div className="dashboard-card full-width">
// //             <div className="card-header">
// //               <h2>My Tasks</h2>
// //               <div className="header-filters">
// //                 <select value={taskFilter} onChange={(e) => setTaskFilter(e.target.value)}>
// //                   <option value="all">All Tasks</option>
// //                   <option value="pending">⏳ Pending</option>
// //                   <option value="in_progress">🔄 In Progress</option>
// //                   <option value="completed">✅ Completed</option>
// //                 </select>
// //                 <input
// //                   type="text"
// //                   placeholder="Search tasks..."
// //                   value={searchQuery}
// //                   onChange={(e) => setSearchQuery(e.target.value)}
// //                   className="search-input"
// //                 />
// //               </div>
// //             </div>
// //             <div className="projects-grid">
// //               {filteredTasks.map((task) => (
// //                 <div key={task.taskId} className="project-card">
// //                   <div className="project-card-header">
// //                     <h3>{task.taskDetails}</h3>
// //                     {getStatusBadge(task.taskStatus)}
// //                   </div>
// //                   <p className="project-card-desc">{task.description?.substring(0, 100) || 'No description'}</p>
// //                   <div className="project-card-meta">
// //                     <span>📁 {task.projectName}</span>
// //                     <span>👤 {task.createdByName}</span>
// //                     {task.deadline && <span>📅 Due: {new Date(task.deadline).toLocaleDateString()}</span>}
// //                   </div>
// //                   {task.managerNote && (
// //                     <div className="project-card-manager">📝 Note: {task.managerNote}</div>
// //                   )}
// //                   <div className="project-card-actions">
// //                     <button
// //                       className="btn-sm btn-primary"
// //                       onClick={() => {
// //                         setSelectedTask(task);
// //                         setShowTaskModal(true);
// //                       }}
// //                     >
// //                       View Details
// //                     </button>
// //                     {task.taskStatus !== 'COMPLETED' && (
// //                       <button
// //                         className="btn-sm btn-outline"
// //                         onClick={() => {
// //                           setSelectedTask(task);
// //                           setShowUpdateTaskModal(true);
// //                         }}
// //                       >
// //                         Update Status
// //                       </button>
// //                     )}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //             {filteredTasks.length === 0 && (
// //               <div className="empty-state">
// //                 <span className="empty-icon">✅</span>
// //                 <p>No tasks found</p>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* Available Projects Tab */}
// //         {activeNav === 'projects' && (
// //           <div className="dashboard-card full-width">
// //             <h2>Available Projects</h2>
// //             <div className="projects-grid">
// //               {departmentProjects.map((project) => (
// //                 <div key={project.projectId} className="project-card">
// //                   <div className="project-card-header">
// //                     <h3>{project.projectName}</h3>
// //                     {getStatusBadge(project.status)}
// //                   </div>
// //                   <p className="project-card-desc">{project.projectDescription?.substring(0, 80) || 'No description'}</p>
// //                   <div className="project-card-meta">
// //                     <span>🏢 {project.departmentName}</span>
// //                     <span>📱 {project.projectType || 'N/A'}</span>
// //                     {project.managerName && <span>👔 {project.managerName}</span>}
// //                     {project.deadline && <span>📅 Deadline: {new Date(project.deadline).toLocaleDateString()}</span>}
// //                   </div>
// //                   <div className="project-card-actions">
// //                     <button
// //                       className="btn-sm btn-primary"
// //                       onClick={() => handleViewProject(project.projectId)}
// //                     >
// //                       View Details
// //                     </button>
// //                     {!project.hasRequested && project.status === 'IN_PROGRESS' && (
// //                       <button
// //                         className="btn-sm btn-outline"
// //                         onClick={() => handleRequestProject(project.projectId)}
// //                       >
// //                         Request to Join
// //                       </button>
// //                     )}
// //                     {project.hasRequested && (
// //                       <span className="status-badge status-pending">⏳ Request Sent</span>
// //                     )}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //             {departmentProjects.length === 0 && (
// //               <div className="empty-state">
// //                 <span className="empty-icon">📁</span>
// //                 <p>No projects available</p>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* My Requests Tab */}
// //         {activeNav === 'my-requests' && (
// //           <div className="dashboard-card full-width">
// //             <h2>My Project Requests</h2>
// //             <div className="projects-grid">
// //               {myRequests.map((request) => (
// //                 <div key={request.requestId} className="project-card">
// //                   <div className="project-card-header">
// //                     <h3>{request.projectName}</h3>
// //                     <span className="status-badge status-pending">⏳ Requested</span>
// //                   </div>
// //                   <div className="project-card-meta">
// //                     <span>📅 Requested: {formatDate(request.requestedAt)}</span>
// //                   </div>
// //                   <div className="project-card-actions">
// //                     <button
// //                       className="btn-sm btn-primary"
// //                       onClick={() => handleViewProject(request.projectId)}
// //                     >
// //                       View Project
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //             {myRequests.length === 0 && (
// //               <div className="empty-state">
// //                 <span className="empty-icon">📨</span>
// //                 <p>No project requests found</p>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* My Teams Tab */}
// //         {activeNav === 'my-teams' && (
// //           <div className="dashboard-card full-width">
// //             <h2>My Teams</h2>
// //             {myTeams.map((team) => (
// //               <div key={team.teamId} className="team-section" style={{ marginBottom: '2rem' }}>
// //                 <h3>{team.teamName}</h3>
// //                 <div className="team-manager">Project: {team.projectName}</div>
// //                 <div className="team-manager">Manager: {team.managerName}</div>
// //                 <div className="team-members">
// //                   <h4>Team Members ({team.members.length})</h4>
// //                   {team.members.map((member, idx) => (
// //                     <div key={idx} className="team-member">
// //                       <div className="member-avatar">{member.memberName.charAt(0)}</div>
// //                       <div className="member-info">
// //                         <div className="member-name">{member.memberName}</div>
// //                         <div className="member-role">{member.role}</div>
// //                         {member.memberEmail && <div className="member-email">{member.memberEmail}</div>}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             ))}
// //             {myTeams.length === 0 && (
// //               <div className="empty-state">
// //                 <span className="empty-icon">👥</span>
// //                 <p>No teams assigned yet</p>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* My Team Projects Tab (NEW) */}
// //         {activeNav === 'my-team-projects' && (
// //           <div className="dashboard-card full-width">
// //             <h2>🚀 My Team Projects</h2>
// //             <p className="card-subtitle">Projects where I am a team member</p>
// //             <div className="projects-grid">
// //               {myTeamProjects.map((project) => (
// //                 <div key={project.projectId} className="project-card">
// //                   <div className="project-card-header">
// //                     <h3>{project.projectName}</h3>
// //                     {getStatusBadge(project.status)}
// //                   </div>
// //                   <p className="project-card-desc">{project.projectDescription?.substring(0, 100) || 'No description'}</p>
// //                   <div className="project-card-meta">
// //                     <span>🏢 {project.departmentName}</span>
// //                     <span>📱 {project.projectType || 'N/A'}</span>
// //                     <span>👔 {project.managerName}</span>
// //                     <span>👤 {project.clientName}</span>
// //                     {project.deadline && <span>📅 Deadline: {new Date(project.deadline).toLocaleDateString()}</span>}
// //                   </div>
// //                   <div className="project-card-actions">
// //                     <button
// //                       className="btn-sm btn-primary"
// //                       onClick={() => handleViewProject(project.projectId)}
// //                     >
// //                       View Details
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //             {myTeamProjects.length === 0 && (
// //               <div className="empty-state">
// //                 <span className="empty-icon">🚀</span>
// //                 <p>No team projects assigned yet. Once you're added to a team, projects will appear here.</p>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* My Uploads Tab with Folder Design */}
// //         {activeNav === 'my-uploads' && (
// //           <div className="dashboard-card full-width">
// //             <div className="card-header">
// //               <h2>📎 My Uploads</h2>
// //               <p className="card-subtitle">Files you have uploaded to projects - grouped by project</p>
// //             </div>
// //             <div className="upload-section">
// //               <select 
// //                 value={uploadData.projectId} 
// //                 onChange={(e) => setUploadData({ ...uploadData, projectId: parseInt(e.target.value) })}
// //               >
// //                 <option value="0">Select Project</option>
// //                 {myTeams.map(team => (
// //                   <option key={team.teamId} value={team.projectId}>{team.projectName}</option>
// //                 ))}
// //               </select>
// //               <input 
// //                 type="file" 
// //                 onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })} 
// //               />
// //               <select 
// //                 value={uploadData.fileType} 
// //                 onChange={(e) => setUploadData({ ...uploadData, fileType: e.target.value })}
// //               >
// //                 <option value="">Select Type</option>
// //                 <option value="Document">📄 Document</option>
// //                 <option value="Code">💻 Code</option>
// //                 <option value="Image">🖼️ Image</option>
// //                 <option value="PDF">📕 PDF</option>
// //                 <option value="Report">📊 Report</option>
// //                 <option value="Other">📎 Other</option>
// //               </select>
// //               <button className="btn-primary" onClick={handleUploadFile} disabled={!uploadData.file || !uploadData.projectId}>
// //                 📤 Upload File
// //               </button>
// //             </div>
            
// //             {/* Folder-like grouped uploads */}
// //             {Object.keys(groupedUploads).length === 0 ? (
// //               <div className="empty-state">
// //                 <span className="empty-icon">📎</span>
// //                 <p>No files uploaded yet. Upload files from your project details.</p>
// //               </div>
// //             ) : (
// //               <div className="folder-structure">
// //                 {Object.entries(groupedUploads).map(([projectName, files]) => (
// //                   <div key={projectName} className="folder-card">
// //                     <div className="folder-header">
// //                       <span className="folder-icon">📁</span>
// //                       <span className="folder-name">{projectName}</span>
// //                       <span className="file-count">{files.length} file{files.length !== 1 ? 's' : ''}</span>
// //                     </div>
// //                     <div className="folder-files">
// //                       {files.map((file) => (
// //                         <div key={file.fileId} className="file-item">
// //                           <div className="file-icon">
// //                             {file.fileType === 'Image' ? '🖼️' : 
// //                              file.fileType === 'Code' ? '💻' : 
// //                              file.fileType === 'PDF' ? '📕' : 
// //                              file.fileType === 'Report' ? '📊' : '📄'}
// //                           </div>
// //                           <div className="file-info">
// //                             <div className="file-name">{file.fileLink?.split('/').pop() || 'File'}</div>
// //                             <div className="file-type-badge">{file.fileType || 'File'}</div>
// //                             {file.uploadTime && <div className="file-date">{formatDate(file.uploadTime)}</div>}
// //                           </div>
// //                           <div className="file-actions">
// //                             <button className="btn-icon" onClick={() => handleViewFile(file.fileId)}>👁️ View</button>
// //                             <button className="btn-icon" onClick={() => handleDownloadFile(file.fileId)}>📥 Download</button>
// //                             <button className="btn-icon danger" onClick={() => handleDeleteFile(file.fileId)}>🗑️ Delete</button>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* Profile Tab */}
// //         {activeNav === 'profile' && (
// //           <div className="dashboard-card full-width">
// //             <div className="card-header">
// //               <h2>Profile Information</h2>
// //               <button className="btn-outline" onClick={() => setShowProfileModal(true)}>
// //                 ✏️ Edit Profile
// //               </button>
// //             </div>
// //             <div className="profile-info">
// //               <div className="profile-avatar-large">
// //                 {user?.photoUrl ? (
// //                   <img src={user.photoUrl} alt={user.name} />
// //                 ) : (
// //                   <div className="avatar-placeholder">{user?.name?.charAt(0) || 'C'}</div>
// //                 )}
// //               </div>
// //               <div className="profile-details">
// //                 <div className="detail-item">
// //                   <label>Full Name</label>
// //                   <span>{user?.name}</span>
// //                 </div>
// //                 <div className="detail-item">
// //                   <label>Email Address</label>
// //                   <span>{user?.email}</span>
// //                 </div>
// //                 <div className="detail-item">
// //                   <label>Role</label>
// //                   <span>Consultant</span>
// //                 </div>
// //                 <div className="detail-item">
// //                   <label>Email Verified</label>
// //                   <span>{user?.emailVerified ? '✅ Yes' : '❌ No'}</span>
// //                 </div>
// //                 <div className="detail-item">
// //                   <label>Phone Number</label>
// //                   <span>{user?.phoneNumber || 'Not provided'}</span>
// //                 </div>
// //                 <div className="detail-item">
// //                   <label>Address</label>
// //                   <span>{user?.address || 'Not provided'}</span>
// //                 </div>
// //                 <div className="detail-item">
// //                   <label>Gender</label>
// //                   <span>{user?.gender || 'Not provided'}</span>
// //                 </div>
// //                 <div className="detail-item">
// //                   <label>Date of Birth</label>
// //                   <span>{user?.dob || 'Not provided'}</span>
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="setting-item danger" style={{ marginTop: '2rem' }}>
// //               <div>
// //                 <div className="setting-label">Delete Account</div>
// //                 <div className="setting-desc">Permanently delete your account and all data</div>
// //               </div>
// //               <button className="btn-danger" onClick={handleDeleteAccount}>
// //                 Delete Account
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         <footer className="client-footer">
// //           <p>© 2026 Consultant Portal | Developed by <a href='https://softmax.in' style={{ color: 'skyblue' }}>Softmax.in</a></p>
// //         </footer>
// //       </main>

// //       {/* Task Detail Modal */}
// //       {showTaskModal && selectedTask && (
// //         <div className="modal-mask open">
// //           <div className="modal-box">
// //             <button className="m-close" onClick={() => setShowTaskModal(false)}>✕</button>
// //             <h2>{selectedTask.taskDetails}</h2>
// //             <div className="project-detail-section">
// //               <div className="detail-row">
// //                 <label>Project:</label>
// //                 <span>{selectedTask.projectName}</span>
// //               </div>
// //               <div className="detail-row">
// //                 <label>Status:</label>
// //                 {getStatusBadge(selectedTask.taskStatus)}
// //               </div>
// //               <div className="detail-row">
// //                 <label>Description:</label>
// //                 <p>{selectedTask.description || 'No description'}</p>
// //               </div>
// //               <div className="detail-row">
// //                 <label>Created By:</label>
// //                 <span>{selectedTask.createdByName}</span>
// //               </div>
// //               {selectedTask.deadline && (
// //                 <div className="detail-row">
// //                   <label>Deadline:</label>
// //                   <span>{new Date(selectedTask.deadline).toLocaleString()}</span>
// //                 </div>
// //               )}
// //               {selectedTask.managerNote && (
// //                 <div className="detail-row">
// //                   <label>Manager Note:</label>
// //                   <span>{selectedTask.managerNote}</span>
// //                 </div>
// //               )}
// //               {selectedTask.createdAt && (
// //                 <div className="detail-row">
// //                   <label>Created At:</label>
// //                   <span>{formatDate(selectedTask.createdAt)}</span>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Update Task Status Modal */}
// //       {showUpdateTaskModal && selectedTask && (
// //         <div className="modal-mask open">
// //           <div className="modal-box">
// //             <button className="m-close" onClick={() => setShowUpdateTaskModal(false)}>✕</button>
// //             <h2>Update Task Status</h2>
// //             <p className="task-name">{selectedTask.taskDetails}</p>
// //             <div className="m-form">
// //               <div className="form-field">
// //                 <label>Select Status</label>
// //                 <select
// //                   value={updateTaskData.status}
// //                   onChange={(e) => setUpdateTaskData({ ...updateTaskData, status: e.target.value })}
// //                 >
// //                   <option value="">Select Status</option>
// //                   <option value="PENDING">⏳ Pending</option>
// //                   <option value="IN_PROGRESS">🔄 In Progress</option>
// //                   <option value="COMPLETED">✅ Completed</option>
// //                 </select>
// //               </div>
// //               <div className="form-field">
// //                 <label>Note for Manager (Optional)</label>
// //                 <textarea
// //                   placeholder="Add any notes about the task progress..."
// //                   value={updateTaskData.managerNote}
// //                   onChange={(e) => setUpdateTaskData({ ...updateTaskData, managerNote: e.target.value })}
// //                   rows={3}
// //                 />
// //               </div>
// //               <button className="btn-msub" onClick={handleUpdateTaskStatus}>
// //                 Update Status
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Project Detail Modal */}
// //       {showProjectDetailModal && selectedProject && (
// //         <div className="modal-mask open">
// //           <div className="modal-box large">
// //             <button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button>
// //             <h2>{selectedProject.projectName}</h2>
// //             <div className="m-tabs">
// //               <button className="m-tab active" data-tab="overview" onClick={() => {
// //                 document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none');
// //                 document.getElementById('tab-overview')!.style.display = 'block';
// //               }}>📋 Overview</button>
// //               <button className="m-tab" data-tab="teams" onClick={() => {
// //                 document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none');
// //                 document.getElementById('tab-teams')!.style.display = 'block';
// //               }}>👥 Teams</button>
// //               <button className="m-tab" data-tab="files" onClick={() => {
// //                 document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none');
// //                 document.getElementById('tab-files')!.style.display = 'block';
// //               }}>📎 Files</button>
// //               <button className="m-tab" data-tab="history" onClick={() => {
// //                 document.querySelectorAll('.m-tab-content').forEach(el => (el as HTMLElement).style.display = 'none');
// //                 document.getElementById('tab-history')!.style.display = 'block';
// //               }}>📜 History</button>
// //             </div>

// //             <div className="m-tab-content active" id="tab-overview" style={{ display: 'block' }}>
// //               <div className="project-detail-section">
// //                 <div className="detail-row">
// //                   <label>Status:</label>
// //                   {getStatusBadge(selectedProject.status)}
// //                 </div>
// //                 <div className="detail-row">
// //                   <label>Description:</label>
// //                   <p>{selectedProject.projectDescription || 'No description'}</p>
// //                 </div>
// //                 <div className="detail-grid">
// //                   <div><label>Type:</label> {selectedProject.projectType || 'N/A'}</div>
// //                   <div><label>Client:</label> {selectedProject.clientName || 'N/A'}</div>
// //                   <div><label>Department:</label> {selectedProject.departmentName}</div>
// //                   {selectedProject.assignedManagerName && <div><label>Manager:</label> {selectedProject.assignedManagerName}</div>}
// //                   {selectedProject.deadline && <div><label>Deadline:</label> {new Date(selectedProject.deadline).toLocaleDateString()}</div>}
// //                   {selectedProject.createdAt && <div><label>Created:</label> {formatDate(selectedProject.createdAt)}</div>}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="m-tab-content" id="tab-teams" style={{ display: 'none' }}>
// //               {projectTeams.length === 0 ? (
// //                 <div className="empty-state"><span className="empty-icon">👥</span><p>No teams assigned to this project yet</p></div>
// //               ) : (
// //                 projectTeams.map((team) => (
// //                   <div key={team.teamId} className="team-section">
// //                     <h3>{team.teamName}</h3>
// //                     <div className="team-manager">Manager: {team.managerName}</div>
// //                     <div className="team-members">
// //                       <h4>Team Members</h4>
// //                       {team.members.map((member, idx) => (
// //                         <div key={idx} className="team-member">
// //                           <div className="member-avatar">{member.memberName.charAt(0)}</div>
// //                           <div className="member-info">
// //                             <div className="member-name">{member.memberName}</div>
// //                             <div className="member-role">{member.role}</div>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ))
// //               )}
// //             </div>

// //             <div className="m-tab-content" id="tab-files" style={{ display: 'none' }}>
// //               <div className="upload-section">
// //                 <input type="file" onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })} />
// //                 <select value={uploadData.fileType} onChange={(e) => setUploadData({ ...uploadData, fileType: e.target.value })}>
// //                   <option value="">Select Type</option>
// //                   <option value="Document">📄 Document</option>
// //                   <option value="Code">💻 Code</option>
// //                   <option value="Image">🖼️ Image</option>
// //                   <option value="PDF">📕 PDF</option>
// //                   <option value="Report">📊 Report</option>
// //                 </select>
// //                 <button className="btn-primary" onClick={handleUploadFile}>📤 Upload</button>
// //               </div>
// //               <div className="files-list">
// //                 {projectFiles.length === 0 ? (
// //                   <div className="empty-state"><span className="empty-icon">📁</span><p>No files uploaded yet</p></div>
// //                 ) : (
// //                   projectFiles.map((file) => (
// //                     <div key={file.fileId} className="file-item">
// //                       <div className="file-icon">📄</div>
// //                       <div className="file-info">
// //                         <div className="file-name">{file.fileLink?.split('/').pop() || 'File'}</div>
// //                         <div className="file-meta">
// //                           <span className="file-type">{file.fileType}</span>
// //                           <span>Uploaded by {file.uploaderName}</span>
// //                           {file.uploadTime && <span>{formatDate(file.uploadTime)}</span>}
// //                         </div>
// //                       </div>
// //                       <div className="file-actions">
// //                         <button className="btn-icon" onClick={() => handleViewFile(file.fileId)}>👁️ View</button>
// //                         <button className="btn-icon" onClick={() => handleDownloadFile(file.fileId)}>📥 Download</button>
// //                         {file.uploaderName === user?.name && (
// //                           <button className="btn-icon danger" onClick={() => handleDeleteFile(file.fileId)}>🗑️ Delete</button>
// //                         )}
// //                       </div>
// //                     </div>
// //                   ))
// //                 )}
// //               </div>
// //             </div>

// //             <div className="m-tab-content" id="tab-history" style={{ display: 'none' }}>
// //               <div className="vscode-timeline">
// //                 {projectHistory.length === 0 ? (
// //                   <div className="empty-state"><span className="empty-icon">📜</span><p>No history records found</p></div>
// //                 ) : (
// //                   [...projectHistory].reverse().map((entry, index) => (
// //                     <div 
// //                       key={entry.statusId || index} 
// //                       className={`timeline-entry ${index === 0 ? 'latest' : ''}`}
// //                       data-status={entry.status}
// //                     >
// //                       <div className="timeline-line">
// //                         <div className="timeline-connector">
// //                           <div className="timeline-dot"></div>
// //                           {index < projectHistory.length - 1 && (
// //                             <div className="timeline-vertical-line"></div>
// //                           )}
// //                         </div>
// //                       </div>
// //                       <div className="timeline-content">
// //                         <div className="commit-header">
// //                           <div className="commit-hash">
// //                             <span className="hash-text">{entry.statusId?.toString().slice(-8) || 'unknown'}</span>
// //                           </div>
// //                           <div className="commit-branch">
// //                             <span className="branch-name">{entry.status}</span>
// //                           </div>
// //                           <div className="commit-date">
// //                             <span className="date-text">{formatDate(entry.dateTime)}</span>
// //                           </div>
// //                         </div>
// //                         <div className="commit-message">
// //                           <div className="commit-title">{getStatusBadge(entry.status)}</div>
// //                           {entry.managerNote && (
// //                             <div className="commit-description">
// //                               <span className="description-text">{entry.managerNote}</span>
// //                             </div>
// //                           )}
// //                           {entry.directorNote && (
// //                             <div className="commit-description director">
// //                               <span className="description-text">{entry.directorNote}</span>
// //                             </div>
// //                           )}
// //                         </div>
// //                         <div className="commit-meta">
// //                           <div className="meta-author">
// //                             <span className="author-name">{entry.handledByName || 'Unknown'}</span>
// //                           </div>
// //                           {entry.assignedToName && (
// //                             <div className="meta-assignee">
// //                               <span className="assignee-name">→ {entry.assignedToName}</span>
// //                             </div>
// //                           )}
// //                         </div>
// //                         <div className="commit-stats">
// //                           <span className="stat-badge">
// //                             <span className="stat-text">{new Date(entry.dateTime).toLocaleTimeString()}</span>
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Profile Modal */}
// //       {showProfileModal && (
// //         <div className="modal-mask open">
// //           <div className="modal-box">
// //             <button className="m-close" onClick={() => setShowProfileModal(false)}>✕</button>
// //             <h2>Edit Profile</h2>
// //             <form onSubmit={(e) => {
// //               e.preventDefault();
// //               const formData = new FormData(e.currentTarget);
// //               handleUpdateProfile({
// //                 name: formData.get('name'),
// //                 phoneNumber: formData.get('phoneNumber'),
// //                 address: formData.get('address'),
// //                 gender: formData.get('gender'),
// //                 dob: formData.get('dob'),
// //               });
// //             }}>
// //               <div className="m-form">
// //                 <div className="form-field">
// //                   <label>Full Name</label>
// //                   <input name="name" placeholder="Name" defaultValue={user?.name} required />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Phone Number</label>
// //                   <input name="phoneNumber" placeholder="Phone Number" defaultValue={user?.phoneNumber} />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Gender</label>
// //                   <input name="gender" placeholder="Gender" defaultValue={user?.gender} />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Date of Birth</label>
// //                   <input name="dob" type="date" defaultValue={user?.dob} />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Address</label>
// //                   <textarea name="address" placeholder="Address" rows={2} defaultValue={user?.address} />
// //                 </div>
// //                 <button type="submit" className="btn-msub">Save Changes</button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* Edit Consultant Details Modal */}
// //       {showEditDetailsModal && (
// //         <div className="modal-mask open">
// //           <div className="modal-box large">
// //             <button className="m-close" onClick={() => setShowEditDetailsModal(false)}>✕</button>
// //             <h2>Edit Consultant Details</h2>
// //             <div className="m-form">
// //               <div className="details-grid">
// //                 <div className="form-field">
// //                   <label>10th Marks (%)</label>
// //                   <input
// //                     type="number"
// //                     placeholder="10th Marks (%)"
// //                     value={applyFormData.marks10}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, marks10: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>12th Marks (%)</label>
// //                   <input
// //                     type="number"
// //                     placeholder="12th Marks (%)"
// //                     value={applyFormData.marks12}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, marks12: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Graduation Marks (%)</label>
// //                   <input
// //                     type="number"
// //                     placeholder="Graduation Marks (%)"
// //                     value={applyFormData.graduationMarks}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, graduationMarks: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Stream</label>
// //                   <input
// //                     type="text"
// //                     placeholder="Stream"
// //                     value={applyFormData.stream}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, stream: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Experience</label>
// //                   <input
// //                     type="text"
// //                     placeholder="Experience"
// //                     value={applyFormData.experience}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, experience: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Skills</label>
// //                   <input
// //                     type="text"
// //                     placeholder="Skills (comma separated)"
// //                     value={applyFormData.skill}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, skill: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Skill Type</label>
// //                   <input
// //                     type="text"
// //                     placeholder="Skill Type"
// //                     value={applyFormData.skillType}
// //                     onChange={(e) => setApplyFormData({ ...applyFormData, skillType: e.target.value })}
// //                   />
// //                 </div>
// //                 <div className="form-field">
// //                   <label>Resume (PDF/DOC)</label>
// //                   <input
// //                     type="file"
// //                     accept=".pdf,.doc,.docx"
// //                     onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
// //                   />
// //                   {resumeFile && <small className="file-name">{resumeFile.name}</small>}
// //                 </div>
// //               </div>
// //               <button className="btn-msub" onClick={handleUpdateConsultantDetails}>
// //                 Update Details
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <style jsx>{`
// //         /* Activity Log Timeline Styles */
// //         .activity-timeline {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0;
// //           margin-top: 1rem;
// //         }

// //         .timeline-item {
// //           display: flex;
// //           position: relative;
// //           padding: 1rem 0;
// //         }

// //         .timeline-dot-wrapper {
// //           position: relative;
// //           display: flex;
// //           flex-direction: column;
// //           align-items: center;
// //           width: 40px;
// //           flex-shrink: 0;
// //         }

// //         .timeline-dot {
// //           width: 12px;
// //           height: 12px;
// //           border-radius: 50%;
// //           background: var(--teal);
// //           border: 2px solid var(--card-bg);
// //           z-index: 2;
// //         }

// //         .timeline-line {
// //           position: absolute;
// //           top: 20px;
// //           bottom: -20px;
// //           width: 2px;
// //           background: var(--border);
// //           left: 50%;
// //           transform: translateX(-50%);
// //         }

// //         .timeline-content {
// //           flex: 1;
// //           background: var(--surface);
// //           border-radius: 12px;
// //           padding: 1rem;
// //           margin-left: 0.5rem;
// //           border: 1px solid var(--border);
// //         }

// //         .timeline-header {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.75rem;
// //           flex-wrap: wrap;
// //           margin-bottom: 0.5rem;
// //         }

// //         .timeline-status-icon {
// //           font-size: 1.2rem;
// //         }

// //         .timeline-status-label {
// //           font-weight: 700;
// //           font-size: 0.9rem;
// //         }

// //         .timeline-date {
// //           font-size: 0.75rem;
// //           color: var(--muted);
// //           margin-left: auto;
// //         }

// //         .timeline-note {
// //           display: flex;
// //           align-items: flex-start;
// //           gap: 0.5rem;
// //           margin-top: 0.5rem;
// //           padding-top: 0.5rem;
// //           border-top: 1px dashed var(--border);
// //           font-size: 0.85rem;
// //           color: var(--text2);
// //         }

// //         .note-icon {
// //           font-size: 0.85rem;
// //         }

// //         .note-text {
// //           flex: 1;
// //         }

// //         .activity-summary {
// //           display: flex;
// //           gap: 0.5rem;
// //         }

// //         .activity-badge {
// //           background: var(--surface);
// //           border: 1px solid var(--border);
// //           border-radius: 20px;
// //           padding: 0.25rem 0.75rem;
// //           font-size: 0.75rem;
// //           color: var(--muted);
// //         }

// //         .status-card {
// //           background: linear-gradient(135deg, var(--card-bg), var(--surface));
// //           border-left: 4px solid var(--teal);
// //         }

// //         .status-badge-large {
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 0.5rem;
// //           padding: 0.5rem 1rem;
// //           border-radius: 40px;
// //           font-weight: 700;
// //           font-size: 0.85rem;
// //           color: white;
// //         }

// //         .status-details {
// //           margin-top: 1rem;
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0.5rem;
// //         }

// //         .status-details p {
// //           margin: 0;
// //           font-size: 0.85rem;
// //         }

// //         .ratings-list {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 1rem;
// //         }

// //         .rating-item {
// //           padding: 1rem;
// //           background: var(--surface);
// //           border-radius: 12px;
// //           border: 1px solid var(--border);
// //         }

// //         .rating-header {
// //           display: flex;
// //           justify-content: space-between;
// //           margin-bottom: 0.5rem;
// //           flex-wrap: wrap;
// //           gap: 0.5rem;
// //         }

// //         .rating-stars {
// //           color: #f59e0b;
// //         }

// //         .rating-note {
// //           font-size: 0.85rem;
// //           color: var(--text2);
// //           margin-bottom: 0.5rem;
// //         }

// //         .rating-date {
// //           font-size: 0.7rem;
// //           color: var(--muted);
// //         }

// //         .average-rating {
// //           background: var(--surface);
// //           padding: 0.25rem 0.75rem;
// //           border-radius: 20px;
// //           font-size: 0.8rem;
// //         }

// //         .apply-form {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 1.5rem;
// //         }

// //         .form-field {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0.25rem;
// //         }

// //         .form-field label {
// //           font-size: 0.7rem;
// //           font-weight: 600;
// //           text-transform: uppercase;
// //           color: var(--muted);
// //         }

// //         .form-field small {
// //           font-size: 0.7rem;
// //           color: var(--muted);
// //         }

// //         .skills-tags {
// //           display: flex;
// //           flex-wrap: wrap;
// //           gap: 0.3rem;
// //         }

// //         .skill-tag {
// //           background: rgba(44, 166, 164, 0.1);
// //           color: var(--teal);
// //           padding: 0.2rem 0.5rem;
// //           border-radius: 12px;
// //           font-size: 0.7rem;
// //         }

// //         .resume-link {
// //           color: var(--teal);
// //           text-decoration: none;
// //         }

// //         .resume-link:hover {
// //           text-decoration: underline;
// //         }

// //         .task-name {
// //           margin-bottom: 1rem;
// //           font-weight: 500;
// //         }

// //         .upload-section {
// //           display: flex;
// //           gap: 0.8rem;
// //           flex-wrap: wrap;
// //           margin-bottom: 1.5rem;
// //           padding-bottom: 1rem;
// //           border-bottom: 1px solid var(--border);
// //         }

// //         .upload-section input,
// //         .upload-section select {
// //           padding: 0.5rem;
// //           background: var(--surface);
// //           border: 1px solid var(--border);
// //           border-radius: 8px;
// //         }

// //         .team-section {
// //           margin-bottom: 1.5rem;
// //         }

// //         .team-section h3 {
// //           font-size: 1rem;
// //           font-weight: 700;
// //           margin-bottom: 0.5rem;
// //         }

// //         .team-section h4 {
// //           font-size: 0.8rem;
// //           font-weight: 600;
// //           margin: 0.5rem 0;
// //           color: var(--muted);
// //         }

// //         .team-manager {
// //           font-size: 0.8rem;
// //           color: var(--teal);
// //           margin-bottom: 0.8rem;
// //         }

// //         .team-members {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0.5rem;
// //         }

// //         .team-member {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.8rem;
// //           padding: 0.6rem;
// //           background: var(--surface);
// //           border-radius: 10px;
// //         }

// //         .member-avatar {
// //           width: 40px;
// //           height: 40px;
// //           border-radius: 50%;
// //           background: var(--g-main);
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           color: white;
// //           font-weight: 700;
// //         }

// //         .member-info .member-name {
// //           font-weight: 600;
// //           font-size: 0.85rem;
// //         }

// //         .member-info .member-role {
// //           font-size: 0.7rem;
// //           color: var(--teal);
// //         }

// //         .member-info .member-email {
// //           font-size: 0.65rem;
// //           color: var(--muted);
// //         }

// //         .files-list {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0.5rem;
// //         }

// //         .empty-state {
// //           text-align: center;
// //           padding: 3rem;
// //           color: var(--muted);
// //         }

// //         .empty-icon {
// //           font-size: 3rem;
// //           display: block;
// //           margin-bottom: 1rem;
// //           opacity: 0.5;
// //         }

// //         .view-all-link {
// //           margin-top: 1rem;
// //           color: var(--teal);
// //           background: none;
// //           border: none;
// //           cursor: pointer;
// //           font-size: 0.8rem;
// //         }

// //         .card-subtitle {
// //           font-size: 0.8rem;
// //           color: var(--muted);
// //           margin-top: 0.25rem;
// //         }

// //         .search-input {
// //           padding: 0.5rem 0.75rem;
// //           border: 1px solid var(--border);
// //           border-radius: 8px;
// //           background: var(--surface);
// //           min-width: 200px;
// //         }

// //         .client-loader {
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           min-height: 100vh;
// //         }

// //         .loader-spinner {
// //           width: 40px;
// //           height: 40px;
// //           border: 3px solid var(--border);
// //           border-top-color: var(--teal);
// //           border-radius: 50%;
// //           animation: spin 0.8s linear infinite;
// //         }

// //         @keyframes spin {
// //           to {
// //             transform: rotate(360deg);
// //           }
// //         }

// //         /* VS Code Timeline Styles */
// //         .vscode-timeline {
// //           max-height: 500px;
// //           overflow-y: auto;
// //         }

// //         .timeline-entry {
// //           display: flex;
// //           gap: 1rem;
// //           margin-bottom: 1rem;
// //         }

// //         .timeline-dot {
// //           width: 10px;
// //           height: 10px;
// //           border-radius: 50%;
// //           background: var(--teal);
// //         }

// //         .timeline-vertical-line {
// //           width: 2px;
// //           height: 30px;
// //           background: var(--border);
// //           margin-left: 4px;
// //         }

// //         .commit-header {
// //           display: flex;
// //           gap: 1rem;
// //           align-items: center;
// //           flex-wrap: wrap;
// //           margin-bottom: 0.5rem;
// //         }

// //         .hash-text {
// //           font-family: monospace;
// //           font-size: 0.7rem;
// //           background: var(--surface);
// //           padding: 0.2rem 0.4rem;
// //           border-radius: 4px;
// //         }

// //         .branch-name {
// //           font-size: 0.7rem;
// //           color: #8b5cf6;
// //         }

// //         .commit-title {
// //           margin: 0.5rem 0;
// //         }

// //         .commit-description {
// //           font-size: 0.75rem;
// //           color: var(--muted);
// //           padding: 0.3rem 0.5rem;
// //           background: var(--surface);
// //           border-radius: 6px;
// //           margin-top: 0.3rem;
// //         }

// //         .commit-description.director {
// //           border-left: 2px solid var(--orange);
// //         }

// //         .commit-meta {
// //           display: flex;
// //           gap: 1rem;
// //           font-size: 0.7rem;
// //           color: var(--muted);
// //           margin-top: 0.5rem;
// //         }

// //         .stat-badge {
// //           font-size: 0.65rem;
// //           background: var(--surface);
// //           padding: 0.2rem 0.4rem;
// //           border-radius: 4px;
// //         }

// //         /* Folder Structure Styles for My Uploads */
// //         .folder-structure {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 1.25rem;
// //           margin-top: 1rem;
// //         }

// //         .folder-card {
// //           background: var(--surface);
// //           border-radius: 12px;
// //           border: 1px solid var(--border);
// //           overflow: hidden;
// //           transition: all 0.2s ease;
// //         }

// //         .folder-header {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.75rem;
// //           padding: 0.85rem 1rem;
// //           background: rgba(44, 166, 164, 0.05);
// //           border-bottom: 1px solid var(--border);
// //           cursor: pointer;
// //           transition: background 0.2s;
// //         }

// //         .folder-header:hover {
// //           background: rgba(44, 166, 164, 0.1);
// //         }

// //         .folder-icon {
// //           font-size: 1.3rem;
// //         }

// //         .folder-name {
// //           font-weight: 600;
// //           font-size: 1rem;
// //           flex: 1;
// //         }

// //         .file-count {
// //           font-size: 0.7rem;
// //           padding: 0.2rem 0.5rem;
// //           background: var(--surface);
// //           border-radius: 20px;
// //           color: var(--muted);
// //         }

// //         .folder-files {
// //           padding: 0.5rem;
// //         }

// //         .file-type-badge {
// //           font-size: 0.65rem;
// //           background: var(--bg);
// //           padding: 0.15rem 0.5rem;
// //           border-radius: 12px;
// //           color: var(--teal);
// //           display: inline-block;
// //         }

// //         .file-date {
// //           font-size: 0.6rem;
// //           color: var(--muted);
// //           margin-top: 0.2rem;
// //         }

// //         .file-item {
// //           display: flex;
// //           align-items: center;
// //           gap: 1rem;
// //           padding: 0.8rem;
// //           border-radius: 10px;
// //           background: var(--bg);
// //           margin-bottom: 0.5rem;
// //           transition: all 0.2s;
// //         }

// //         .file-item:hover {
// //           background: var(--surface);
// //           transform: translateX(4px);
// //         }

// //         .file-icon {
// //           font-size: 1.5rem;
// //         }

// //         .file-info {
// //           flex: 1;
// //         }

// //         .file-name {
// //           font-weight: 500;
// //           font-size: 0.85rem;
// //           word-break: break-all;
// //         }

// //         .file-meta {
// //           display: flex;
// //           gap: 0.8rem;
// //           flex-wrap: wrap;
// //           font-size: 0.7rem;
// //           color: var(--muted);
// //         }

// //         .file-actions {
// //           display: flex;
// //           gap: 0.3rem;
// //         }

// //         .btn-icon {
// //           padding: 0.3rem 0.6rem;
// //           background: var(--surface);
// //           border: 1px solid var(--border);
// //           border-radius: 6px;
// //           cursor: pointer;
// //           font-size: 0.7rem;
// //           transition: all 0.2s;
// //         }

// //         .btn-icon:hover {
// //           background: var(--bg);
// //           border-color: var(--teal);
// //         }

// //         .btn-icon.danger:hover {
// //           border-color: #ef4444;
// //           color: #ef4444;
// //         }

// //         .profile-avatar-large img,
// //         .avatar-placeholder {
// //           width: 100px;
// //           height: 100px;
// //           border-radius: 50%;
// //           object-fit: cover;
// //         }

// //         .avatar-placeholder {
// //           background: var(--g-main);
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           font-size: 2.5rem;
// //           font-weight: 700;
// //           color: white;
// //         }

// //         .profile-info {
// //           display: flex;
// //           gap: 2rem;
// //           flex-wrap: wrap;
// //           margin-top: 1rem;
// //         }

// //         .profile-details {
// //           flex: 1;
// //           display: grid;
// //           grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
// //           gap: 1rem;
// //         }

// //         .setting-item.danger {
// //           display: flex;
// //           justify-content: space-between;
// //           align-items: center;
// //           padding: 1rem;
// //           background: rgba(239, 68, 68, 0.05);
// //           border-radius: 12px;
// //           border: 1px solid rgba(239, 68, 68, 0.2);
// //         }

// //         .btn-danger {
// //           background: #ef4444;
// //           color: white;
// //           border: none;
// //           padding: 0.5rem 1rem;
// //           border-radius: 8px;
// //           cursor: pointer;
// //         }

// //         .detail-grid {
// //           display: grid;
// //           grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
// //           gap: 0.8rem;
// //           margin-top: 1rem;
// //         }

// //         .detail-row {
// //           margin-bottom: 0.8rem;
// //         }

// //         .detail-row label {
// //           font-weight: 600;
// //           color: var(--muted);
// //           width: 100px;
// //           display: inline-block;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default Consultant;




