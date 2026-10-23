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
  phoneNumber?: string;
  address?: string;
  gender?: string;
  roles?: string[];
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
  phoneNumber: string;
  address: string;
  gender: string;
  isDirectorVerified: boolean;
  positionName: string;
  salary: number;
  department: string;
  skillSet: string;
  departmentId: number;
  departmentName: string;
}

interface Client {
  id: number;
  user: {
    userId: number;
    name: string;
    email: string;
  };
  companyName: string;
  companyMobileNumber: string;
  companyEmail: string;
  orgType: string;
  clientType: string;
  isApproved: boolean;
  clientStatus: string;
  clientWebsite: string;
  rejectionReason?: string;
}

interface Department {
  departmentId: number;
  departmentName: string;
}

interface DepartmentKPI {
  departmentId: number;
  departmentName: string;
  totalEmployees: number;
  totalManagers: number;
  totalProjects: number;
  completedProjects: number;
  completionRate: number;
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
  assignedManagerId: number | null;
  assignedManagerName: string | null;
  deadline: string | null;
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
  handledById: number | null;
  handledByName: string;
  assignedToId: number | null;
  assignedToName: string | null;
  directorNote: string | null;
  managerNote: string | null;
  deadline: string | null;
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

interface Task {
  taskId: number;
  description: string;
  status: string;
  assignedToUserId: number;
  assignedToUserName: string;
  assignedToDepartment: string;
  createdByUserId: number;
  createdByName: string;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CompanyKPIs {
  companySummary: {
    totalEmployees: number;
    totalManagers: number;
    totalConsultants: number;
    totalClients: number;
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    pendingProjects: number;
    completionRate: number;
  };
  departmentKPISummary: DepartmentKPI[];
  monthlyTrends: {
    month: string;
    newEmployees: number;
    newClients: number;
    newProjects: number;
    completed: number;
  }[];
  recentActivities: {
    activityType: string;
    description: string;
    userName: string;
    departmentName: string;
    activityTime: string;
  }[];
  topPerformers: {
    topEmployees: {
      userId: number;
      name: string;
      position: string;
      department: string;
      completedTasks: number;
      averageRating: number;
    }[];
  };
}

interface HRKPIs {
  totalConsultants: number;
  pendingConsultants: number;
  totalEmployees: number;
  totalProjects: number;
  totalTasks: number;
  totalDepartments: number;
  consultantsByStatus: Record<string, number>;
  consultantsByDepartment: Record<string, number>;
  employeesByDepartment: Record<string, number>;
  projectsByStatus: Record<string, number>;
  tasksByStatus: Record<string, number>;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  conversionRate: number;
}

interface BDEDashboardKPIs {
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

interface PaymentRecord {
  paymentId: number;
  transactionId: string;
  amount: string;
  type: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userName: string;
  userEmail: string;
  paymentNote: string | null;
  directorNote: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  dateTime: string;
}

interface UserData {
  users: {
    userId: number;
    name: string;
    email: string;
    photoUrl: string | null;
    phoneNumber: string;
    address: string;
    gender: string;
    roles: string[];
    department: string;
    position: string;
    isActive: boolean;
    joinedAt: string;
  }[];
  totalUsers: number;
  totalEmployees: number;
  totalConsultants: number;
  totalClients: number;
}

// Payment Dashboard Types
interface PaymentDashboardStats {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    pendingApprovals: number;
    totalTransactions: number;
    approvedTransactions: number;
  };
  monthlyRevenue: {
    month: string;
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    projectPaymentsCount: number;
    salaryPaymentsCount: number;
  }[];
  recentTransactions: PaymentRecord[];
  topProjects: {
    projectId: number;
    projectName: string;
    totalPaid: number;
    paidPercentage: number;
  }[];
  revenueByType: Record<string, number>;
}

interface ProjectPaymentSummary {
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
  assignedManagerName: string | null;
  deadline: string | null;
  totalProjectAmount: string;
  paidAmount: string;
  remainingAmount: string;
  paidPercentage: number;
  isFullyPaid: boolean;
  payments: PaymentRecord[];
}

interface DepartmentPaymentSummary {
  departmentId: number;
  departmentName: string;
  totalProjects: number;
  totalBudget: number;
  totalPaid: number;
  totalRemaining: number;
  projects: {
    projectId: number;
    projectName: string;
    clientName: string;
    totalProjectAmount: string;
    paidAmount: string;
    remainingAmount: string;
    paidPercentage: number;
    isFullyPaid: boolean;
  }[];
}

interface ClientPaymentSummary {
  clientId: number;
  clientName: string;
  clientEmail: string;
  totalProjects: number;
  totalBudget: number;
  totalPaid: number;
  totalRemaining: number;
  projects: {
    projectId: number;
    projectName: string;
    departmentName: string;
    totalProjectAmount: string;
    paidAmount: string;
    remainingAmount: string;
    paidPercentage: number;
    isFullyPaid: boolean;
  }[];
}

interface PaymentCounts {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

interface SalaryPayment {
  paymentId: number;
  transactionId: string;
  amount: string;
  type: string;
  status: string;
  userName: string;
  userEmail: string;
  paymentNote: string | null;
  directorNote: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  dateTime: string;
}

// ============================================
// API SERVICE
// ============================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function apiCall<T>(method: string, endpoint: string, data?: any): Promise<T> {
  const response = await axios({
    method,
    url: `${API_BASE}${endpoint}`,
    data,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(`API ${method} ${endpoint} response:`, response.data);
  return response.data;
}

async function apiCallFormData<T>(endpoint: string, formData: FormData): Promise<T> {
  const response = await axios.post(`${API_BASE}${endpoint}`, formData, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// Head Director APIs
const headDirectorApi = {
  check: () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/head-director/check'),
  
  // Consultant Management
  getConsultants: () => apiCall<{ success: boolean; data: Consultant[] }>('GET', '/api/head-director/consultants'),
  getConsultantById: (consultantId: number) => apiCall<{ success: boolean; data: Consultant }>('GET', `/api/head-director/consultants/${consultantId}`),
  getConsultantStatusHistory: (consultantId: number) => apiCall<{ success: boolean; data: StatusHistory[] }>('GET', `/api/head-director/consultants/${consultantId}/status-history`),
  updateConsultantStatus: (consultantId: number, status: string, note: string) => 
    apiCall('PUT', `/api/head-director/consultants/${consultantId}/status`, { status, note }),
  assignConsultantDepartment: (consultantId: number, departmentId: number) => 
    apiCall('PUT', `/api/head-director/consultants/${consultantId}/assign-department`, { departmentId }),
  convertToEmployee: (consultantId: number, data: { positionName: string; salary: number; skillSet: string; departmentId: number }) => 
    apiCall('POST', `/api/head-director/consultants/${consultantId}/convert-to-employee`, data),
  
  // Employee Management
  getEmployees: () => apiCall<{ success: boolean; data: Employee[] }>('GET', '/api/head-director/employees'),
  getEmployeeById: (employeeId: number) => apiCall<{ success: boolean; data: Employee }>('GET', `/api/head-director/employees/${employeeId}`),
  updateEmployee: (employeeId: number, data: { positionName: string; salary: number; skillSet: string; departmentId: number }) => 
    apiCall('PUT', `/api/head-director/employees/${employeeId}`, data),
  
  // Client Management
  getPendingClients: () => apiCall<{ success: boolean; data: Client[] }>('GET', '/api/head-director/clients/pending'),
  getAllClients: () => apiCall<{ success: boolean; data: Client[] }>('GET', '/api/head-director/clients'),
  getClientById: (clientId: number) => apiCall<{ success: boolean; data: Client }>('GET', `/api/head-director/clients/${clientId}`),
  approveClient: (clientId: number, isApproved: boolean, rejectionReason?: string | null) => 
    apiCall('PUT', `/api/head-director/clients/${clientId}/approve`, { isApproved, rejectionReason }),
  getBDETeam: () => apiCall<{ success: boolean; data: Employee[] }>('GET', '/api/head-director/bde-team'),
  
  // User Management
  getAllUsers: () => apiCall<{ success: boolean; data: UserData }>('GET', '/api/head-director/users'),
  getUserById: (targetId: number) => apiCall<{ success: boolean; data: any }>('GET', `/api/head-director/users/${targetId}`),
  
  // Department Management
  getDepartments: () => apiCall<{ success: boolean; data: Department[] }>('GET', '/api/head-director/departments'),
  getDepartmentById: (deptId: number) => apiCall<{ success: boolean; data: Department }>('GET', `/api/head-director/departments/${deptId}`),
  createDepartment: (departmentName: string) => apiCall('POST', `/api/head-director/departments?departmentName=${encodeURIComponent(departmentName)}`),
  updateDepartment: (deptId: number, departmentName: string) => apiCall('PUT', `/api/head-director/departments/${deptId}?departmentName=${encodeURIComponent(departmentName)}`),
  deleteDepartment: (deptId: number) => apiCall('DELETE', `/api/head-director/departments/${deptId}`),
  getDepartmentKPIs: () => apiCall<{ success: boolean; data: DepartmentKPI[] }>('GET', '/api/head-director/departments/kpis'),
  
  // Project Management
  getAllProjects: () => apiCall<{ success: boolean; data: Project[] }>('GET', '/api/head-director/all-projects'),
  getProjectsByDepartment: (deptId: number) => apiCall<{ success: boolean; data: Project[] }>('GET', `/api/head-director/projects/department/${deptId}`),
  getProjectsByStatus: (status: string) => apiCall<{ success: boolean; data: Project[] }>('GET', `/api/head-director/projects/status/${status}`),
  getProjectById: (projectId: number) => apiCall<{ success: boolean; data: Project }>('GET', `/api/head-director/all-projects/${projectId}`),
  updateProjectStatus: (projectId: number, status: string, note?: string) => 
    apiCall('PUT', `/api/head-director/projects/${projectId}/status?status=${status}${note ? `&note=${encodeURIComponent(note)}` : ''}`),
  getProjectHistory: (projectId: number) => apiCall<{ success: boolean; data: ProjectHistory[] }>('GET', `/api/head-director/projects/${projectId}/history`),
  
  // Team Management
  getAllTeams: () => apiCall<{ success: boolean; data: Team[] }>('GET', '/api/head-director/teams'),
  getTeamsByProject: (projectId: number) => apiCall<{ success: boolean; data: Team[] }>('GET', `/api/head-director/projects/${projectId}/teams`),
  
  // Task Management
  getAllTasks: () => apiCall<{ success: boolean; data: Task[] }>('GET', '/api/head-director/all-tasks'),
  getTasksByProject: (projectId: number) => apiCall<{ success: boolean; data: Task[] }>('GET', `/api/head-director/projects/${projectId}/tasks`),
  updateTaskStatus: (taskId: number, status: string, note?: string) => 
    apiCall('PUT', `/api/head-director/all-tasks/${taskId}/status?status=${status}${note ? `&note=${encodeURIComponent(note)}` : ''}`),
  
  // Dashboards
  getCompanyKPIs: () => apiCall<{ success: boolean; data: CompanyKPIs }>('GET', '/api/head-director/dashboard/company-kpis'),
  getHRKPIs: () => apiCall<{ success: boolean; data: HRKPIs }>('GET', '/api/head-director/dashboard/hr-kpis'),
  getBDEDashboard: () => apiCall<{ success: boolean; data: BDEDashboardKPIs }>('GET', '/api/head-director/bde/dashboard/kpis'),
};

// File APIs
const fileApi = {
  upload: (projectId: number, file: File, fileType: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiCallFormData(`/api/file/upload/${projectId}?fileType=${fileType}`, formData);
  },
  getByProject: (projectId: number) => apiCall<{ success: boolean; data: FileItem[] }>('GET', `/api/file/project/${projectId}`),
  getMyUploads: () => apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/my-uploads'),
  getDepartmentFiles: () => apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/department-files'),
  delete: (fileId: number) => apiCall('DELETE', `/api/file/delete/${fileId}`),
  getAccessToken: (fileId: number) => apiCall('POST', `/api/file/access-token/${fileId}`, {}),
};

// Payment APIs (Complete Head Director Payment APIs)
const paymentApi = {
  // Get all pending payments for approval
  getPendingPayments: () => apiCall<{ success: boolean; data: PaymentRecord[] }>('GET', '/api/payment/pending'),
  
  // Get all payments
  getAllPayments: () => apiCall<{ success: boolean; data: PaymentRecord[] }>('GET', '/api/payment/all'),
  
  // Get payment by ID
  getPaymentById: (paymentId: number) => apiCall<{ success: boolean; data: PaymentRecord }>('GET', `/api/payment/${paymentId}`),
  
  // Approve or reject payment - CORRECT API SPEC
  approvePayment: (paymentId: number, status: 'APPROVED' | 'REJECTED', directorNote?: string) => 
    apiCall('PUT', `/api/payment/${paymentId}/approve`, { status, directorNote }),
  
  // Create salary payment
  createSalaryPayment: (data: { transactionId: string; amount: string; userId: number; paymentNote: string; month: string }) => 
    apiCall('POST', '/api/payment/salary', data),
  
  // Get project payments summary
  getProjectPayments: (projectId: number) => apiCall<{ success: boolean; data: ProjectPaymentSummary }>('GET', `/api/payment/project/${projectId}`),
  
  // Get salary payments by user
  getSalaryPaymentsByUser: (userId: number) => apiCall<{ success: boolean; data: SalaryPayment[] }>('GET', `/api/payment/salary/user/${userId}`),
  
  // Get dashboard statistics
  getDashboardStats: () => apiCall<{ success: boolean; data: PaymentDashboardStats }>('GET', '/api/payment/dashboard/stats'),
  
  // HEAD DIRECTOR SPECIFIC PAYMENT APIs
  getAllProjectsWithPaymentSummary: () => apiCall<{ success: boolean; data: ProjectPaymentSummary[] }>('GET', '/api/payment/director/projects'),
  getProjectsByDepartmentWithPaymentSummary: (departmentId: number) => 
    apiCall<{ success: boolean; data: ProjectPaymentSummary[] }>('GET', `/api/payment/director/departments/${departmentId}/projects`),
  getProjectPaymentSummaryForDirector: (projectId: number) => 
    apiCall<{ success: boolean; data: ProjectPaymentSummary }>('GET', `/api/payment/director/projects/${projectId}`),
  getPaymentCounts: () => apiCall<{ success: boolean; data: PaymentCounts }>('GET', '/api/payment/director/counts'),
  getDepartmentWisePaymentSummary: () => apiCall<{ success: boolean; data: DepartmentPaymentSummary[] }>('GET', '/api/payment/director/departments/summary'),
  getClientWisePaymentSummary: () => apiCall<{ success: boolean; data: ClientPaymentSummary[] }>('GET', '/api/payment/director/clients/summary'),
};

const userApi = {
  getProfile: () => apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile'),
  updateProfile: (data: any) => apiCall('PUT', '/api/users/profile', data),
};

// ============================================
// SIDEBAR MENU ITEMS
// ============================================

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'consultants', label: 'Consultants', icon: '👨‍💻' },
  { id: 'employees', label: 'Employees', icon: '👥' },
  { id: 'clients', label: 'Clients', icon: '🏢' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'departments', label: 'Departments', icon: '🏛️' },
  { id: 'teams', label: 'Teams', icon: '🤝' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'payments', label: 'Payments', icon: '💰' },
  { id: 'files', label: 'Files', icon: '📎' },
  { id: 'users', label: 'Users', icon: '👤' },
  { id: 'profile', label: 'Profile', icon: '⚙️' },
];

// ============================================
// STATUS CONFIGURATION
// ============================================

const statusConfig: Record<string, { label: string; class: string; icon: string; color: string }> = {
  PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳', color: '#F59E0B' },
  APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅', color: '#10B981' },
  REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '❌', color: '#EF4444' },
  ASSIGNED: { label: 'Assigned', class: 'status-assigned', icon: '👥', color: '#8B5CF6' },
  IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄', color: '#3B82F6' },
  COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️', color: '#10B981' },
  APPLIED: { label: 'Applied', class: 'status-pending', icon: '📝', color: '#F59E0B' },
  ACTIVE: { label: 'Active', class: 'status-approved', icon: '🟢', color: '#10B981' },
};

const getStatusBadge = (status: string) => {
  const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌', color: '#6B7280' };
  return <span className={`status-badge ${config.class}`}>{config.icon} {config.label}</span>;
};

// ============================================
// PAYMENT APPROVAL MODAL - UPDATED
// ============================================

const PaymentApprovalModal: React.FC<{
  payment: PaymentRecord | null;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ payment, onClose, onUpdate }) => {
  const [status, setStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [directorNote, setDirectorNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!payment) return null;

  const handleSubmit = async () => {
    if (!status) {
      alert('Please select approve or reject');
      return;
    }
    
    if (status === 'REJECTED' && !directorNote.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setLoading(true);
    try {
      const response: any = await paymentApi.approvePayment(payment.paymentId, status, directorNote);
      
      if (response.success) {
        alert(`Payment ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully`);
        onUpdate();
        onClose();
      } else {
        alert(response.message || 'Failed to process payment');
      }
    } catch (error: any) {
      console.error('Payment approval error:', error);
      alert(error.response?.data?.message || error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-mask open">
      <div className="modal-box">
        <button className="m-close" onClick={onClose}>✕</button>
        <h2>💰 Payment Approval</h2>
        <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
        
        <div className="details-grid">
          <div className="detail-item">
            <label>Amount</label>
            <span className="amount-highlight">₹{parseFloat(payment.amount).toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <label>Type</label>
            <span>{payment.type === 'PROJECT_PAYMENT' ? 'Project Payment' : payment.type}</span>
          </div>
          <div className="detail-item">
            <label>From</label>
            <span>{payment.userName}</span>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <span>{payment.userEmail}</span>
          </div>
          <div className="detail-item">
            <label>Date</label>
            <span>{new Date(payment.dateTime).toLocaleString()}</span>
          </div>
          <div className="detail-item full-width">
            <label>Payment Note</label>
            <span>{payment.paymentNote || 'No note provided'}</span>
          </div>
        </div>

        <div className="section-divider"></div>
        
        <div className="form-row">
          <label className="radio-label">
            <input 
              type="radio" 
              checked={status === 'APPROVED'} 
              onChange={() => setStatus('APPROVED')} 
            /> 
            ✅ Approve Payment
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              checked={status === 'REJECTED'} 
              onChange={() => setStatus('REJECTED')} 
            /> 
            ❌ Reject Payment
          </label>
        </div>
        
        <div className="form-row">
          <label className="field-label">Director Note {status === 'REJECTED' && '(Required for rejection)'}</label>
          <textarea 
            placeholder={status === 'REJECTED' ? "Please provide reason for rejection..." : "Optional note about this payment..."} 
            value={directorNote} 
            onChange={(e) => setDirectorNote(e.target.value)} 
            rows={3}
          />
        </div>
        
        <button 
          className="btn-primary" 
          onClick={handleSubmit} 
          disabled={loading || (status === 'REJECTED' && !directorNote.trim())}
          style={{ 
            background: status === 'APPROVED' 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : 'linear-gradient(135deg, #ef4444, #dc2626)',
            width: '100%',
            padding: '12px',
            fontSize: '16px'
          }}
        >
          {loading ? (
            <span>⏳ Processing...</span>
          ) : (
            <span>{status === 'APPROVED' ? '✅ Approve Payment' : '❌ Reject Payment'}</span>
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================
// OTHER MODAL COMPONENTS (Keep existing)
// ============================================

const ConsultantDetailModal: React.FC<{
  consultant: Consultant | null;
  departments: Department[];
  onClose: () => void;
  onUpdate: () => void;
}> = ({ consultant, departments, onClose, onUpdate }) => {
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<number>(consultant?.departmentId || 0);
  const [convertData, setConvertData] = useState({ positionName: '', salary: '', skillSet: '' });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (consultant) {
      loadStatusHistory();
      setSelectedStatus(consultant.currentStatus);
      setSelectedDepartment(consultant.departmentId);
    }
  }, [consultant]);

  const loadStatusHistory = async () => {
    if (!consultant) return;
    try {
      const res = await headDirectorApi.getConsultantStatusHistory(consultant.consultantId);
      if (res.success) setStatusHistory(res.data);
    } catch (error) {
      console.error('Error loading status history:', error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!consultant || !selectedStatus) return;
    setLoading(true);
    try {
      await headDirectorApi.updateConsultantStatus(consultant.consultantId, selectedStatus, statusNote);
      await loadStatusHistory();
      onUpdate();
      alert('Status updated successfully');
      setStatusNote('');
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDepartment = async () => {
    if (!consultant || !selectedDepartment) return;
    setLoading(true);
    try {
      await headDirectorApi.assignConsultantDepartment(consultant.consultantId, selectedDepartment);
      onUpdate();
      alert('Department assigned successfully');
    } catch (error) {
      alert('Failed to assign department');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToEmployee = async () => {
    if (!consultant || !convertData.positionName || !convertData.salary || !convertData.skillSet || !selectedDepartment) {
      alert('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await headDirectorApi.convertToEmployee(consultant.consultantId, {
        positionName: convertData.positionName,
        salary: parseFloat(convertData.salary),
        skillSet: convertData.skillSet,
        departmentId: selectedDepartment,
      });
      onUpdate();
      onClose();
      alert('Consultant converted to employee successfully');
    } catch (error) {
      alert('Failed to convert to employee');
    } finally {
      setLoading(false);
    }
  };

  if (!consultant) return null;

  return (
    <div className="modal-mask open">
      <div className="modal-box large">
        <button className="m-close" onClick={onClose}>✕</button>
        <h2>{consultant.name}</h2>
        <p className="subtitle">{consultant.email}</p>

        <div className="m-tabs">
          <button className={`m-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📋 Overview</button>
          <button className={`m-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>📜 Status History</button>
          <button className={`m-tab ${activeTab === 'convert' ? 'active' : ''}`} onClick={() => setActiveTab('convert')}>🔄 Convert to Employee</button>
        </div>

        {activeTab === 'overview' && (
          <div className="m-tab-content">
            <div className="details-grid">
              <div className="detail-item"><label>Skills</label><span>{consultant.skill}</span></div>
              <div className="detail-item"><label>Experience</label><span>{consultant.experience}</span></div>
              <div className="detail-item"><label>Current Status</label>{getStatusBadge(consultant.currentStatus)}</div>
              <div className="detail-item"><label>Department</label><span>{consultant.departmentName || 'Not assigned'}</span></div>
            </div>

            <div className="section-divider"></div>
            <h3>Update Status</h3>
            <div className="form-row">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="APPLIED">Applied</option>
                <option value="DOCUMENT_VERIFIED">Document Verified</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="INTERVIEW_PASSED">Interview Passed</option>
                <option value="INTERVIEW_FAILED">Interview Failed</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <textarea placeholder="Note (optional)" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} rows={2} />
              <button className="btn-primary" onClick={handleUpdateStatus} disabled={loading}>Update Status</button>
            </div>

            <div className="section-divider"></div>
            <h3>Assign Department</h3>
            <div className="form-row">
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}>
                <option value={0}>Select Department</option>
                {departments.map(dept => <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>)}
              </select>
              <button className="btn-primary" onClick={handleAssignDepartment} disabled={loading}>Assign Department</button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="m-tab-content">
            {statusHistory.length === 0 ? <div className="empty-state">No status history</div> : (
              <div className="timeline-list">
                {[...statusHistory].reverse().map(entry => (
                  <div key={entry.statusId} className="timeline-item-small">
                    <div className="timeline-dot-small" style={{ backgroundColor: statusConfig[entry.status]?.color }}></div>
                    <div className="timeline-content-small">
                      <div className="timeline-header-small">
                        {getStatusBadge(entry.status)}
                        <span className="timeline-date">{new Date(entry.dateTime).toLocaleString()}</span>
                      </div>
                      {entry.note && <div className="timeline-note-small">{entry.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'convert' && (
          <div className="m-tab-content">
            <div className="info-banner">
              <span className="info-icon">ℹ️</span>
              <span>Converting this consultant to an employee will create an employee record and remove them from consultants list.</span>
            </div>
            <div className="form-row"><input placeholder="Position Name *" value={convertData.positionName} onChange={(e) => setConvertData({ ...convertData, positionName: e.target.value })} /></div>
            <div className="form-row"><input type="number" placeholder="Salary (per month) *" value={convertData.salary} onChange={(e) => setConvertData({ ...convertData, salary: e.target.value })} /></div>
            <div className="form-row"><input placeholder="Skill Set *" value={convertData.skillSet} onChange={(e) => setConvertData({ ...convertData, skillSet: e.target.value })} /></div>
            <div className="form-row">
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}>
                <option value={0}>Select Department *</option>
                {departments.map(dept => <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>)}
              </select>
            </div>
            <button className="btn-primary" onClick={handleConvertToEmployee} disabled={loading}>Convert to Employee</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ClientApprovalModal: React.FC<{
  client: Client | null;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ client, onClose, onUpdate }) => {
  const [isApproved, setIsApproved] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!client) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await headDirectorApi.approveClient(client.id, isApproved, isApproved ? null : rejectionReason);
      onUpdate();
      onClose();
      alert(`Client ${isApproved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      alert('Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-mask open">
      <div className="modal-box">
        <button className="m-close" onClick={onClose}>✕</button>
        <h2>Approve Client</h2>
        <p><strong>{client.companyName}</strong></p>
        
        <div className="details-grid">
          <div className="detail-item"><label>Email</label><span>{client.companyEmail}</span></div>
          <div className="detail-item"><label>Mobile</label><span>{client.companyMobileNumber}</span></div>
          <div className="detail-item"><label>Org Type</label><span>{client.orgType}</span></div>
          <div className="detail-item"><label>Client Type</label><span>{client.clientType}</span></div>
          <div className="detail-item full-width"><label>Website</label><a href={client.clientWebsite} target="_blank" rel="noopener noreferrer">{client.clientWebsite}</a></div>
        </div>

        <div className="section-divider"></div>
        
        <div className="form-row">
          <label className="radio-label"><input type="radio" checked={isApproved} onChange={() => setIsApproved(true)} /> Approve</label>
          <label className="radio-label"><input type="radio" checked={!isApproved} onChange={() => setIsApproved(false)} /> Reject</label>
        </div>
        
        {!isApproved && <textarea placeholder="Rejection Reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={3} />}
        
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Processing...' : 'Submit'}</button>
      </div>
    </div>
  );
};

const ProjectDetailModal: React.FC<{
  project: Project | null;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ project, onClose, onUpdate }) => {
  const [history, setHistory] = useState<ProjectHistory[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (project) {
      loadProjectData();
      setNewStatus(project.status);
    }
  }, [project]);

  const loadProjectData = async () => {
    if (!project) return;
    try {
      const [historyRes, teamsRes, tasksRes, filesRes] = await Promise.all([
        headDirectorApi.getProjectHistory(project.projectId),
        headDirectorApi.getTeamsByProject(project.projectId),
        headDirectorApi.getTasksByProject(project.projectId),
        fileApi.getByProject(project.projectId),
      ]);
      if (historyRes.success) setHistory(historyRes.data);
      if (teamsRes.success) setTeams(teamsRes.data);
      if (tasksRes.success) setTasks(tasksRes.data);
      if (filesRes.success) setFiles(filesRes.data);
    } catch (error) {
      console.error('Error loading project data:', error);
    }
  };

  const handleUpdateStatus = async () => {
    if (!project || !newStatus) return;
    setLoading(true);
    try {
      await headDirectorApi.updateProjectStatus(project.projectId, newStatus, statusNote);
      await loadProjectData();
      onUpdate();
      alert('Project status updated');
      setStatusNote('');
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!project || !fileInputRef.current?.files?.length) return;
    const file = fileInputRef.current.files[0];
    setUploading(true);
    try {
      await fileApi.upload(project.projectId, file, 'Document');
      const filesRes = await fileApi.getByProject(project.projectId);
      setFiles(filesRes.data);
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert('File uploaded');
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileView = async (fileId: number) => {
    try {
      const tokenRes = await fileApi.getAccessToken(fileId);
      if (tokenRes.success && tokenRes.data) {
        window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
      }
    } catch (error) {
      alert('Cannot view file');
    }
  };

  const handleFileDelete = async (fileId: number) => {
    if (!confirm('Delete this file?')) return;
    try {
      await fileApi.delete(fileId);
      const filesRes = await fileApi.getByProject(project!.projectId);
      setFiles(filesRes.data);
      alert('File deleted');
    } catch (error) {
      alert('Delete failed');
    }
  };

  if (!project) return null;

  return (
    <div className="modal-mask open">
      <div className="modal-box large">
        <button className="m-close" onClick={onClose}>✕</button>
        <h2>{project.projectName}</h2>
        <p className="subtitle">Client: {project.clientName}</p>

        <div className="m-tabs">
          <button className={`m-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📋 Overview</button>
          <button className={`m-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>📜 History</button>
          <button className={`m-tab ${activeTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveTab('teams')}>👥 Teams ({teams.length})</button>
          <button className={`m-tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>✅ Tasks ({tasks.length})</button>
          <button className={`m-tab ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}>📎 Files ({files.length})</button>
        </div>

        {activeTab === 'overview' && (
          <div className="m-tab-content">
            <div className="details-grid">
              <div className="detail-item"><label>Status</label>{getStatusBadge(project.status)}</div>
              <div className="detail-item"><label>Type</label><span>{project.projectType}</span></div>
              <div className="detail-item"><label>Department</label><span>{project.departmentName}</span></div>
              <div className="detail-item"><label>Manager</label><span>{project.assignedManagerName || 'Not assigned'}</span></div>
              <div className="detail-item"><label>Budget</label><span>₹{parseFloat(project.cost).toLocaleString()}</span></div>
              <div className="detail-item"><label>Deadline</label><span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}</span></div>
              <div className="detail-item full-width"><label>Description</label><p>{project.projectDescription}</p></div>
            </div>

            <div className="section-divider"></div>
            <h3>Update Project Status</h3>
            <div className="form-row">
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="PENDING">Pending</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <textarea placeholder="Note (optional)" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} rows={2} />
              <button className="btn-primary" onClick={handleUpdateStatus} disabled={loading}>Update Status</button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="m-tab-content">
            {history.length === 0 ? <div className="empty-state">No history</div> : (
              <div className="timeline-list">
                {[...history].reverse().map(entry => (
                  <div key={entry.statusId} className="timeline-item-small">
                    <div className="timeline-dot-small" style={{ backgroundColor: statusConfig[entry.status]?.color }}></div>
                    <div className="timeline-content-small">
                      <div className="timeline-header-small">{getStatusBadge(entry.status)}<span className="timeline-date">{new Date(entry.dateTime).toLocaleString()}</span></div>
                      <div className="timeline-meta">By: {entry.handledByName}</div>
                      {entry.assignedToName && <div className="timeline-meta">Assigned to: {entry.assignedToName}</div>}
                      {entry.directorNote && <div className="timeline-note-small">📝 {entry.directorNote}</div>}
                      {entry.managerNote && <div className="timeline-note-small">👔 {entry.managerNote}</div>}
                      {entry.deadline && <div className="timeline-meta">Deadline: {new Date(entry.deadline).toLocaleDateString()}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="m-tab-content">
            {teams.length === 0 ? <div className="empty-state">No teams assigned</div> : teams.map(team => (
              <div key={team.teamId} className="team-card-small">
                <div className="team-header-small"><strong>{team.teamName}</strong> <span className="manager-badge">Manager: {team.managerName}</span></div>
                <div className="team-members-list">
                  {team.members.map(member => (
                    <div key={member.memberId} className="team-member-small">
                      <div className="member-avatar-small">{member.memberName.charAt(0)}</div>
                      <div><div className="member-name-small">{member.memberName}</div><div className="member-role-small">{member.role}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="m-tab-content">
            {tasks.length === 0 ? <div className="empty-state">No tasks created</div> : tasks.map(task => (
              <div key={task.taskId} className="task-item-small">
                <div className="task-header-small">
                  <strong>{task.description}</strong>
                  {getStatusBadge(task.status)}
                </div>
                <div className="task-meta-small">Assigned to: {task.assignedToUserName} | Created by: {task.createdByName}</div>
                {task.deadline && <div className="task-deadline-small">📅 Deadline: {new Date(task.deadline).toLocaleDateString()}</div>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="m-tab-content">
            <div className="upload-section-small"><input type="file" ref={fileInputRef} /><button className="btn-primary" onClick={handleFileUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload File'}</button></div>
            {files.length === 0 ? <div className="empty-state">No files</div> : files.map(file => (
              <div key={file.fileId} className="file-item-small">
                <span className="file-icon-small">📄</span>
                <div className="file-info-small"><div className="file-name-small">{file.fileLink.split('/').pop()}</div><div className="file-meta-small">Uploaded by {file.uploaderName} on {new Date(file.uploadTime).toLocaleDateString()}</div></div>
                <div className="file-actions-small"><button onClick={() => handleFileView(file.fileId)}>👁️ View</button><button onClick={() => handleFileDelete(file.fileId)}>🗑️</button></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SalaryPaymentModal: React.FC<{
  employees: Employee[];
  onClose: () => void;
  onUpdate: () => void;
}> = ({ employees, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    transactionId: '',
    amount: '',
    userId: 0,
    paymentNote: '',
    month: new Date().toLocaleString('default', { month: 'MMMM', year: 'numeric' }),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.transactionId || !formData.amount || !formData.userId) {
      alert('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await paymentApi.createSalaryPayment(formData);
      onUpdate();
      onClose();
      alert('Salary payment submitted successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to create salary payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-mask open">
      <div className="modal-box">
        <button className="m-close" onClick={onClose}>✕</button>
        <h2>💰 Create Salary Payment</h2>
        
        <div className="m-form">
          <input 
            placeholder="Transaction ID *" 
            value={formData.transactionId} 
            onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
          />
          <input 
            type="number" 
            placeholder="Amount *" 
            value={formData.amount} 
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <select 
            value={formData.userId} 
            onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) })}
          >
            <option value={0}>Select Employee *</option>
            {employees.map(emp => (
              <option key={emp.employeeId} value={emp.userId}>{emp.name} - {emp.positionName}</option>
            ))}
          </select>
          <input 
            placeholder="Month (e.g., March 2024)" 
            value={formData.month} 
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
          />
          <textarea 
            placeholder="Payment Note (optional)" 
            rows={2}
            value={formData.paymentNote} 
            onChange={(e) => setFormData({ ...formData, paymentNote: e.target.value })}
          />
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Submit Salary Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectPaymentDetailsModal: React.FC<{
  projectId: number;
  projectName: string;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ projectId, projectName, onClose, onUpdate }) => {
  const [paymentSummary, setPaymentSummary] = useState<ProjectPaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentSummary();
  }, [projectId]);

  const loadPaymentSummary = async () => {
    setLoading(true);
    try {
      const res = await paymentApi.getProjectPayments(projectId);
      if (res.success) setPaymentSummary(res.data);
    } catch (error) {
      console.error('Error loading payment summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-mask open">
        <div className="modal-box">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-mask open">
      <div className="modal-box large">
        <button className="m-close" onClick={onClose}>✕</button>
        <h2>💰 Payment Details: {projectName}</h2>
        
        {paymentSummary && (
          <>
            <div className="payment-summary-cards">
              <div className="payment-summary-card">
                <div className="summary-label">Total Budget</div>
                <div className="summary-value">₹{parseFloat(paymentSummary.totalProjectAmount).toLocaleString()}</div>
              </div>
              <div className="payment-summary-card success">
                <div className="summary-label">Paid Amount</div>
                <div className="summary-value">₹{parseFloat(paymentSummary.paidAmount).toLocaleString()}</div>
              </div>
              <div className="payment-summary-card warning">
                <div className="summary-label">Remaining</div>
                <div className="summary-value">₹{parseFloat(paymentSummary.remainingAmount).toLocaleString()}</div>
              </div>
              <div className="payment-summary-card info">
                <div className="summary-label">Completion</div>
                <div className="summary-value">{paymentSummary.paidPercentage}%</div>
              </div>
            </div>

            <div className="progress-bar-container">
              <div className="progress-label">Payment Progress</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${paymentSummary.paidPercentage}%` }}></div>
              </div>
              <div className="progress-percent">{paymentSummary.paidPercentage}% Paid</div>
            </div>

            <div className="section-divider"></div>
            
            <h3>Transaction History</h3>
            <div className="payments-list">
              {paymentSummary.payments.length === 0 ? (
                <div className="empty-state">No payments recorded</div>
              ) : (
                paymentSummary.payments.map(payment => (
                  <div key={payment.paymentId} className={`payment-item ${payment.status.toLowerCase()}`}>
                    <div className="payment-amount">₹{parseFloat(payment.amount).toLocaleString()}</div>
                    <div className="payment-info">
                      <div><strong>{payment.transactionId}</strong></div>
                      <div className="payment-meta">{new Date(payment.dateTime).toLocaleString()}</div>
                      {payment.paymentNote && <div className="payment-note">{payment.paymentNote}</div>}
                      {payment.directorNote && <div className="payment-note director-note">📝 Director: {payment.directorNote}</div>}
                    </div>
                    <div className="payment-status">{getStatusBadge(payment.status)}</div>
                    {payment.approvedByName && <div className="payment-approved-by">✓ {payment.approvedByName}</div>}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const DepartmentPaymentSummaryModal: React.FC<{
  department: DepartmentPaymentSummary;
  onClose: () => void;
}> = ({ department, onClose }) => {
  return (
    <div className="modal-mask open">
      <div className="modal-box large">
        <button className="m-close" onClick={onClose}>✕</button>
        <h2>🏛️ Department Payment Summary: {department.departmentName}</h2>
        
        <div className="payment-summary-cards">
          <div className="payment-summary-card">
            <div className="summary-label">Total Projects</div>
            <div className="summary-value">{department.totalProjects}</div>
          </div>
          <div className="payment-summary-card">
            <div className="summary-label">Total Budget</div>
            <div className="summary-value">₹{department.totalBudget.toLocaleString()}</div>
          </div>
          <div className="payment-summary-card success">
            <div className="summary-label">Total Paid</div>
            <div className="summary-value">₹{department.totalPaid.toLocaleString()}</div>
          </div>
          <div className="payment-summary-card warning">
            <div className="summary-label">Total Remaining</div>
            <div className="summary-value">₹{department.totalRemaining.toLocaleString()}</div>
          </div>
        </div>

        <div className="section-divider"></div>
        
        <h3>Projects in {department.departmentName}</h3>
        <div className="projects-list">
          {department.projects.map(project => (
            <div key={project.projectId} className="project-payment-item">
              <div className="project-payment-header">
                <strong>{project.projectName}</strong>
                <span className={`payment-status-badge ${project.isFullyPaid ? 'paid' : 'partial'}`}>
                  {project.isFullyPaid ? 'Fully Paid' : `${project.paidPercentage}% Paid`}
                </span>
              </div>
              <div className="project-payment-details">
                <span>Client: {project.clientName}</span>
                <span>Budget: ₹{parseFloat(project.totalProjectAmount).toLocaleString()}</span>
                <span>Paid: ₹{parseFloat(project.paidAmount).toLocaleString()}</span>
                <span>Remaining: ₹{parseFloat(project.remainingAmount).toLocaleString()}</span>
              </div>
              <div className="mini-progress">
                <div className="mini-progress-fill" style={{ width: `${project.paidPercentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ClientPaymentSummaryModal: React.FC<{
  client: ClientPaymentSummary;
  onClose: () => void;
}> = ({ client, onClose }) => {
  return (
    <div className="modal-mask open">
      <div className="modal-box large">
        <button className="m-close" onClick={onClose}>✕</button>
        <h2>🏢 Client Payment Summary: {client.clientName}</h2>
        
        <div className="payment-summary-cards">
          <div className="payment-summary-card">
            <div className="summary-label">Total Projects</div>
            <div className="summary-value">{client.totalProjects}</div>
          </div>
          <div className="payment-summary-card">
            <div className="summary-label">Total Budget</div>
            <div className="summary-value">₹{client.totalBudget.toLocaleString()}</div>
          </div>
          <div className="payment-summary-card success">
            <div className="summary-label">Total Paid</div>
            <div className="summary-value">₹{client.totalPaid.toLocaleString()}</div>
          </div>
          <div className="payment-summary-card warning">
            <div className="summary-label">Total Remaining</div>
            <div className="summary-value">₹{client.totalRemaining.toLocaleString()}</div>
          </div>
        </div>

        <div className="section-divider"></div>
        
        <h3>Projects for {client.clientName}</h3>
        <div className="projects-list">
          {client.projects.map(project => (
            <div key={project.projectId} className="project-payment-item">
              <div className="project-payment-header">
                <strong>{project.projectName}</strong>
                <span className={`payment-status-badge ${project.isFullyPaid ? 'paid' : 'partial'}`}>
                  {project.isFullyPaid ? 'Fully Paid' : `${project.paidPercentage}% Paid`}
                </span>
              </div>
              <div className="project-payment-details">
                <span>Department: {project.departmentName}</span>
                <span>Budget: ₹{parseFloat(project.totalProjectAmount).toLocaleString()}</span>
                <span>Paid: ₹{parseFloat(project.paidAmount).toLocaleString()}</span>
                <span>Remaining: ₹{parseFloat(project.remainingAmount).toLocaleString()}</span>
              </div>
              <div className="mini-progress">
                <div className="mini-progress-fill" style={{ width: `${project.paidPercentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TaskAssignModal: React.FC<{
  task: Task | null;
  employees: Employee[];
  onClose: () => void;
  onUpdate: () => void;
}> = ({ task, employees, onClose, onUpdate }) => {
  const [assignedToUserId, setAssignedToUserId] = useState(task?.assignedToUserId || 0);
  const [deadline, setDeadline] = useState(task?.deadline?.split('T')[0] || '');
  const [loading, setLoading] = useState(false);

  if (!task) return null;

  const handleAssign = async () => {
    if (!assignedToUserId) {
      alert('Please select an employee to assign');
      return;
    }
    setLoading(true);
    try {
      await headDirectorApi.updateTaskStatus(task.taskId, task.status, `Assigned to employee ID: ${assignedToUserId}`);
      onUpdate();
      onClose();
      alert('Task assigned successfully');
    } catch (error) {
      alert('Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-mask open">
      <div className="modal-box">
        <button className="m-close" onClick={onClose}>✕</button>
        <h2>📋 Assign Task</h2>
        <p><strong>{task.description}</strong></p>
        
        <div className="m-form">
          <div className="form-field">
            <label>Assign To</label>
            <select value={assignedToUserId} onChange={(e) => setAssignedToUserId(parseInt(e.target.value))}>
              <option value={0}>Select Employee</option>
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.userId}>{emp.name} - {emp.positionName} ({emp.departmentName})</option>
              ))}
            </select>
          </div>
          
          <div className="form-field">
            <label>Deadline (Optional)</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          
          <button className="btn-primary" onClick={handleAssign} disabled={loading}>
            {loading ? 'Assigning...' : 'Assign Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN HEAD DIRECTOR COMPONENT
// ============================================

const HeadDirector: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const { logout } = useAuth();

  // Data states
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [pendingClients, setPendingClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentKPIs, setDepartmentKPIs] = useState<DepartmentKPI[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PaymentRecord[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [users, setUsers] = useState<UserData | null>(null);
  
  // Payment Dashboard States
  const [paymentDashboardStats, setPaymentDashboardStats] = useState<PaymentDashboardStats | null>(null);
  const [projectPaymentSummaries, setProjectPaymentSummaries] = useState<ProjectPaymentSummary[]>([]);
  const [departmentPaymentSummaries, setDepartmentPaymentSummaries] = useState<DepartmentPaymentSummary[]>([]);
  const [clientPaymentSummaries, setClientPaymentSummaries] = useState<ClientPaymentSummary[]>([]);
  const [paymentCounts, setPaymentCounts] = useState<PaymentCounts | null>(null);
  
  // Dashboard KPI states
  const [companyKPIs, setCompanyKPIs] = useState<CompanyKPIs | null>(null);
  const [hrKPIs, setHrKPIs] = useState<HRKPIs | null>(null);
  const [bdeKPIs, setBdeKPIs] = useState<BDEDashboardKPIs | null>(null);
  
  // Modal states
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [selectedTaskForAssign, setSelectedTaskForAssign] = useState<Task | null>(null);
  const [selectedProjectForPaymentDetails, setSelectedProjectForPaymentDetails] = useState<{ id: number; name: string } | null>(null);
  const [selectedDepartmentForPayment, setSelectedDepartmentForPayment] = useState<DepartmentPaymentSummary | null>(null);
  const [selectedClientForPayment, setSelectedClientForPayment] = useState<ClientPaymentSummary | null>(null);
  const [showSalaryPaymentModal, setShowSalaryPaymentModal] = useState(false);
  
  // Form states
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateDepartmentModal, setShowCreateDepartmentModal] = useState(false);
  
  // Filters
  const [projectStatusFilter, setProjectStatusFilter] = useState('all');
  const [consultantSearch, setConsultantSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');
  const [taskSearch, setTaskSearch] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');

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
      const [
        profileRes,
        consultantsRes,
        employeesRes,
        clientsRes,
        pendingClientsRes,
        projectsRes,
        deptsRes,
        deptKPIsRes,
        teamsRes,
        tasksRes,
        paymentsRes,
        pendingPaymentsRes,
        filesRes,
        usersRes,
        companyKPIsRes,
        hrKPIsRes,
        bdeKPIsRes,
        paymentDashboardRes,
        projectPaymentsRes,
        departmentPaymentsRes,
        clientPaymentsRes,
        paymentCountsRes,
      ] = await Promise.all([
        userApi.getProfile().catch(() => ({ data: null })),
        headDirectorApi.getConsultants().catch(() => ({ data: [] })),
        headDirectorApi.getEmployees().catch(() => ({ data: [] })),
        headDirectorApi.getAllClients().catch(() => ({ data: [] })),
        headDirectorApi.getPendingClients().catch(() => ({ data: [] })),
        headDirectorApi.getAllProjects().catch(() => ({ data: [] })),
        headDirectorApi.getDepartments().catch(() => ({ data: [] })),
        headDirectorApi.getDepartmentKPIs().catch(() => ({ data: [] })),
        headDirectorApi.getAllTeams().catch(() => ({ data: [] })),
        headDirectorApi.getAllTasks().catch(() => ({ data: [] })),
        paymentApi.getAllPayments().catch(() => ({ data: [] })),
        paymentApi.getPendingPayments().catch(() => ({ data: [] })),
        fileApi.getDepartmentFiles().catch(() => ({ data: [] })),
        headDirectorApi.getAllUsers().catch(() => ({ data: null })),
        headDirectorApi.getCompanyKPIs().catch(() => ({ data: null })),
        headDirectorApi.getHRKPIs().catch(() => ({ data: null })),
        headDirectorApi.getBDEDashboard().catch(() => ({ data: null })),
        paymentApi.getDashboardStats().catch(() => ({ data: null })),
        paymentApi.getAllProjectsWithPaymentSummary().catch(() => ({ data: [] })),
        paymentApi.getDepartmentWisePaymentSummary().catch(() => ({ data: [] })),
        paymentApi.getClientWisePaymentSummary().catch(() => ({ data: [] })),
        paymentApi.getPaymentCounts().catch(() => ({ data: null })),
      ]);

      setUser(profileRes.data);
      setConsultants(consultantsRes.data);
      setEmployees(employeesRes.data);
      setClients(clientsRes.data);
      setPendingClients(pendingClientsRes.data);
      setProjects(projectsRes.data);
      setDepartments(deptsRes.data);
      setDepartmentKPIs(deptKPIsRes.data);
      setTeams(teamsRes.data);
      setTasks(tasksRes.data);
      setPayments(paymentsRes.data);
      setPendingPayments(pendingPaymentsRes.data);
      setFiles(filesRes.data);
      setUsers(usersRes.data);
      setCompanyKPIs(companyKPIsRes.data);
      setHrKPIs(hrKPIsRes.data);
      setBdeKPIs(bdeKPIsRes.data);
      setPaymentDashboardStats(paymentDashboardRes.data);
      setProjectPaymentSummaries(projectPaymentsRes.data);
      setDepartmentPaymentSummaries(departmentPaymentsRes.data);
      setClientPaymentSummaries(clientPaymentsRes.data);
      setPaymentCounts(paymentCountsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadAllData();
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleCreateDepartment = async () => {
    if (!newDepartmentName.trim()) return;
    try {
      await headDirectorApi.createDepartment(newDepartmentName);
      const deptsRes = await headDirectorApi.getDepartments();
      setDepartments(deptsRes.data);
      setShowCreateDepartmentModal(false);
      setNewDepartmentName('');
      alert('Department created');
    } catch (error) {
      alert('Failed to create department');
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDepartment || !newDepartmentName.trim()) return;
    try {
      await headDirectorApi.updateDepartment(editingDepartment.departmentId, newDepartmentName);
      const deptsRes = await headDirectorApi.getDepartments();
      setDepartments(deptsRes.data);
      setShowDepartmentModal(false);
      setEditingDepartment(null);
      setNewDepartmentName('');
      alert('Department updated');
    } catch (error) {
      alert('Failed to update department');
    }
  };

  const handleDeleteDepartment = async (deptId: number) => {
    if (!confirm('Delete this department? This will affect all associated records.')) return;
    try {
      await headDirectorApi.deleteDepartment(deptId);
      const deptsRes = await headDirectorApi.getDepartments();
      setDepartments(deptsRes.data);
      alert('Department deleted');
    } catch (error) {
      alert('Failed to delete department');
    }
  };

  const handleUpdateProfile = async (data: any) => {
    try {
      await userApi.updateProfile(data);
      const profileRes = await userApi.getProfile();
      setUser(profileRes.data);
      setShowProfileModal(false);
      alert('Profile updated');
    } catch (error) {
      alert('Update failed');
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

  const getProjectStats = () => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'COMPLETED').length;
    const inProgress = projects.filter(p => p.status === 'IN_PROGRESS').length;
    const pending = projects.filter(p => p.status === 'PENDING').length;
    const assigned = projects.filter(p => p.status === 'ASSIGNED').length;
    return { total, completed, inProgress, pending, assigned };
  };

  const filteredConsultants = consultants.filter(c => 
    c.name.toLowerCase().includes(consultantSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(consultantSearch.toLowerCase()) ||
    c.skill.toLowerCase().includes(consultantSearch.toLowerCase())
  );

  const filteredPayments = pendingPayments.filter(p => {
    if (paymentFilter === 'all') return true;
    return p.status === paymentFilter;
  });

  const filteredTasks = tasks.filter(task => {
    if (taskStatusFilter !== 'all' && task.status !== taskStatusFilter) return false;
    if (taskSearch && !task.description.toLowerCase().includes(taskSearch.toLowerCase()) && 
        !task.assignedToUserName.toLowerCase().includes(taskSearch.toLowerCase())) return false;
    return true;
  });

  const projectStats = getProjectStats();

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
        title="Head Director"
        logoIcon="👔"
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>☰</button>

      <main className="client-main">
        <header className="client-header">
          <div className="header-welcome">
            <h1>Welcome, Director {user?.name?.split(' ')[0] || ''}!</h1>
            <p>Head Director Dashboard - Complete Organization Overview</p>
          </div>
          <div className="header-stats">
            <div className="header-stat-item"><span className="stat-label">Total Users</span><span className="stat-value-sm">{users?.totalUsers || 0}</span></div>
            <div className="header-stat-item"><span className="stat-label">Pending Clients</span><span className="stat-value-sm">{pendingClients.length}</span></div>
            <div className="header-stat-item"><span className="stat-label">Pending Payments</span><span className="stat-value-sm">{paymentCounts?.pendingCount || pendingPayments.length}</span></div>
          </div>
        </header>

        {/* DASHBOARD TAB */}
        {activeNav === 'dashboard' && (
          <>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-icon blue">👥</div><div className="stat-info"><span className="stat-value">{employees.length}</span><span className="stat-label">Employees</span></div></div>
              <div className="stat-card"><div className="stat-icon green">👨‍💻</div><div className="stat-info"><span className="stat-value">{consultants.length}</span><span className="stat-label">Consultants</span></div></div>
              <div className="stat-card"><div className="stat-icon orange">🏢</div><div className="stat-info"><span className="stat-value">{clients.length}</span><span className="stat-label">Clients</span></div></div>
              <div className="stat-card"><div className="stat-icon purple">📁</div><div className="stat-info"><span className="stat-value">{projectStats.total}</span><span className="stat-label">Projects</span></div></div>
            </div>

            {/* Company KPIs */}
            {companyKPIs && (
              <div className="dashboard-card">
                <div className="card-header"><h2>📊 Company Overview</h2></div>
                <div className="kpi-grid">
                  <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.totalEmployees}</div><div className="kpi-label">Total Employees</div></div>
                  <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.totalManagers}</div><div className="kpi-label">Managers</div></div>
                  <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.totalConsultants}</div><div className="kpi-label">Consultants</div></div>
                  <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.totalClients}</div><div className="kpi-label">Clients</div></div>
                  <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.totalProjects}</div><div className="kpi-label">Total Projects</div></div>
                  <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.completionRate}%</div><div className="kpi-label">Completion Rate</div></div>
                </div>
                
                <div className="section-divider"></div>
                <h3>Project Status Distribution</h3>
                <div className="status-distribution">
                  <div className="status-bar"><div className="status-fill completed" style={{ width: `${(projectStats.completed / projectStats.total) * 100 || 0}%` }}><span>Completed</span></div></div>
                  <div className="status-stats"><span>✅ Completed: {projectStats.completed}</span><span>🔄 In Progress: {projectStats.inProgress}</span><span>⏳ Pending: {projectStats.pending}</span><span>👥 Assigned: {projectStats.assigned}</span></div>
                </div>
              </div>
            )}

            {/* HR Analytics Component */}
            {hrKPIs && (
              <div className="dashboard-card">
                <div className="card-header"><h2>👥 HR Analytics</h2></div>
                <div className="hr-analytics-grid">
                  {/* Consultants by Status */}
                  <div className="hr-analytics-card">
                    <h4>📊 Consultants by Status</h4>
                    <div className="status-chart">
                      {Object.entries(hrKPIs.consultantsByStatus).map(([status, count]) => (
                        <div key={status} className="status-row">
                          <span className="status-name">{status}</span>
                          <div className="status-bar-chart">
                            <div className="status-bar-fill" style={{ width: `${(count / hrKPIs.totalConsultants) * 100}%`, backgroundColor: statusConfig[status]?.color || '#6B7280' }}></div>
                          </div>
                          <span className="status-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consultants by Department */}
                  <div className="hr-analytics-card">
                    <h4>🏛️ Consultants by Department</h4>
                    <div className="dept-chart">
                      {Object.entries(hrKPIs.consultantsByDepartment).map(([dept, count]) => (
                        <div key={dept} className="dept-row">
                          <span className="dept-name">{dept}</span>
                          <div className="dept-bar-chart">
                            <div className="dept-bar-fill" style={{ width: `${(count / hrKPIs.totalConsultants) * 100}%`, backgroundColor: '#2ca6a4' }}></div>
                          </div>
                          <span className="dept-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Employees by Department */}
                  <div className="hr-analytics-card">
                    <h4>👥 Employees by Department</h4>
                    <div className="dept-chart">
                      {Object.entries(hrKPIs.employeesByDepartment).map(([dept, count]) => (
                        <div key={dept} className="dept-row">
                          <span className="dept-name">{dept}</span>
                          <div className="dept-bar-chart">
                            <div className="dept-bar-fill" style={{ width: `${(count / hrKPIs.totalEmployees) * 100}%`, backgroundColor: '#34a853' }}></div>
                          </div>
                          <span className="dept-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects by Status */}
                  <div className="hr-analytics-card">
                    <h4>📁 Projects by Status</h4>
                    <div className="status-chart">
                      {Object.entries(hrKPIs.projectsByStatus).map(([status, count]) => (
                        <div key={status} className="status-row">
                          <span className="status-name">{status}</span>
                          <div className="status-bar-chart">
                            <div className="status-bar-fill" style={{ width: `${(count / hrKPIs.totalProjects) * 100}%`, backgroundColor: statusConfig[status]?.color || '#6B7280' }}></div>
                          </div>
                          <span className="status-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tasks Summary */}
                  <div className="hr-analytics-card">
                    <h4>✅ Tasks Summary</h4>
                    <div className="tasks-summary">
                      <div className="task-stat pending"><span className="task-stat-value">{hrKPIs.pendingTasks}</span><span className="task-stat-label">Pending</span></div>
                      <div className="task-stat progress"><span className="task-stat-value">{hrKPIs.inProgressTasks}</span><span className="task-stat-label">In Progress</span></div>
                      <div className="task-stat completed"><span className="task-stat-value">{hrKPIs.completedTasks}</span><span className="task-stat-label">Completed</span></div>
                    </div>
                    <div className="conversion-rate">
                      <strong>Conversion Rate:</strong> <span className="highlight">{hrKPIs.conversionRate}%</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="hr-analytics-card">
                    <h4>📈 Quick Stats</h4>
                    <div className="quick-stats">
                      <div><strong>Total Consultants:</strong> {hrKPIs.totalConsultants}</div>
                      <div><strong>Pending Consultants:</strong> {hrKPIs.pendingConsultants}</div>
                      <div><strong>Total Employees:</strong> {hrKPIs.totalEmployees}</div>
                      <div><strong>Total Departments:</strong> {hrKPIs.totalDepartments}</div>
                      <div><strong>Total Projects:</strong> {hrKPIs.totalProjects}</div>
                      <div><strong>Total Tasks:</strong> {hrKPIs.totalTasks}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Dashboard Stats */}
            {paymentDashboardStats && (
              <div className="dashboard-card">
                <div className="card-header"><h2>💰 Financial Overview</h2></div>
                <div className="financial-grid">
                  <div className="financial-card"><div className="financial-label">Total Revenue</div><div className="financial-value revenue">₹{paymentDashboardStats.summary.totalRevenue.toLocaleString()}</div></div>
                  <div className="financial-card"><div className="financial-label">Total Expenses</div><div className="financial-value expense">₹{paymentDashboardStats.summary.totalExpenses.toLocaleString()}</div></div>
                  <div className="financial-card"><div className="financial-label">Net Profit</div><div className="financial-value profit">₹{paymentDashboardStats.summary.netProfit.toLocaleString()}</div></div>
                  <div className="financial-card"><div className="financial-label">Pending Approvals</div><div className="financial-value pending">{paymentDashboardStats.summary.pendingApprovals}</div></div>
                  <div className="financial-card"><div className="financial-label">Total Transactions</div><div className="financial-value">{paymentDashboardStats.summary.totalTransactions}</div></div>
                  <div className="financial-card"><div className="financial-label">Approved</div><div className="financial-value approved">{paymentDashboardStats.summary.approvedTransactions}</div></div>
                </div>

                <div className="section-divider"></div>
                
                <h3>Monthly Revenue Trends</h3>
                <div className="monthly-trends">
                  {paymentDashboardStats.monthlyRevenue.slice(0, 6).map((month, idx) => (
                    <div key={idx} className="month-card">
                      <div className="month-name">{month.month}</div>
                      <div className="month-revenue">₹{month.totalRevenue.toLocaleString()}</div>
                      <div className="month-expense">₹{month.totalExpenses.toLocaleString()}</div>
                      <div className="month-profit">Profit: ₹{month.netProfit.toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <div className="revenue-type">
                  <div className="revenue-type-item"><span className="type-dot project"></span>Project Payments: ₹{(paymentDashboardStats.revenueByType.PROJECT_PAYMENT || 0).toLocaleString()}</div>
                  <div className="revenue-type-item"><span className="type-dot salary"></span>Salary Payments: ₹{(paymentDashboardStats.revenueByType.SALARY || 0).toLocaleString()}</div>
                </div>
              </div>
            )}

            {/* Recent Activities */}
            {companyKPIs?.recentActivities && companyKPIs.recentActivities.length > 0 && (
              <div className="dashboard-card">
                <div className="card-header"><h2>🔄 Recent Activities</h2></div>
                <div className="activities-list">
                  {companyKPIs.recentActivities.slice(0, 5).map((activity, idx) => (
                    <div key={idx} className="activity-item">
                      <div className="activity-icon">{activity.activityType === 'PROJECT_CREATED' ? '📁' : '📝'}</div>
                      <div className="activity-content"><div className="activity-desc">{activity.description}</div><div className="activity-meta">By {activity.userName} • {activity.departmentName} • {new Date(activity.activityTime).toLocaleString()}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Performers */}
            {companyKPIs?.topPerformers?.topEmployees && companyKPIs.topPerformers.topEmployees.length > 0 && (
              <div className="dashboard-card">
                <div className="card-header"><h2>🏆 Top Performers</h2></div>
                <div className="performers-list">
                  {companyKPIs.topPerformers.topEmployees.map(performer => (
                    <div key={performer.userId} className="performer-item">
                      <div className="performer-avatar">{performer.name.charAt(0)}</div>
                      <div><div className="performer-name">{performer.name}</div><div className="performer-role">{performer.position} • {performer.department}</div></div>
                      <div className="performer-stats"><span>✅ {performer.completedTasks} tasks</span><span>⭐ {performer.averageRating}/5</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* CONSULTANTS TAB */}
        {activeNav === 'consultants' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>👨‍💻 Consultant Management</h2><div><input type="text" placeholder="Search consultants..." className="search-input" value={consultantSearch} onChange={(e) => setConsultantSearch(e.target.value)} /></div></div>
            <div className="consultants-grid">
              {filteredConsultants.map(consultant => (
                <div key={consultant.consultantId} className="consultant-card">
                  <div className="consultant-header"><div className="consultant-avatar">{consultant.name.charAt(0)}</div><div className="consultant-info"><h3>{consultant.name}</h3><p>{consultant.email}</p></div>{getStatusBadge(consultant.currentStatus)}</div>
                  <div className="consultant-details"><div className="detail"><span className="detail-label">Skills:</span> {consultant.skill}</div><div className="detail"><span className="detail-label">Experience:</span> {consultant.experience}</div><div className="detail"><span className="detail-label">Department:</span> {consultant.departmentName || 'Not assigned'}</div></div>
                  <div className="consultant-actions"><button className="btn-primary" onClick={() => setSelectedConsultant(consultant)}>View Details</button></div>
                </div>
              ))}
            </div>
            {filteredConsultants.length === 0 && <div className="empty-state"><span className="empty-icon">👨‍💻</span><p>No consultants found</p></div>}
          </div>
        )}

        {/* EMPLOYEES TAB */}
        {activeNav === 'employees' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>👥 Employee Directory</h2></div>
            <div className="employees-table-container">
              <table className="data-table">
                <thead><tr><th>Employee</th><th>Position</th><th>Department</th><th>Salary</th><th>Skills</th><th>Status</th></tr></thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.employeeId}>
                      <td><div className="user-cell"><strong>{emp.name}</strong><small>{emp.email}</small></div></td>
                      <td>{emp.positionName}</td>
                      <td>{emp.departmentName}</td>
                      <td>₹{emp.salary.toLocaleString()}</td>
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

        {/* CLIENTS TAB */}
        {activeNav === 'clients' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>🏢 Client Management</h2></div>
            
            <h3>Pending Approvals ({pendingClients.length})</h3>
            <div className="clients-grid">
              {pendingClients.map(client => (
                <div key={client.id} className="client-card pending">
                  <div className="client-header"><div className="client-icon">🏢</div><div><h3>{client.companyName}</h3><p>{client.companyEmail}</p></div></div>
                  <div className="client-details"><div>📞 {client.companyMobileNumber}</div><div>🏷️ {client.orgType} • {client.clientType}</div></div>
                  <div className="client-actions"><button className="btn-primary" onClick={() => setSelectedClient(client)}>Review & Approve</button></div>
                </div>
              ))}
            </div>
            {pendingClients.length === 0 && <div className="empty-state"><span className="empty-icon">✅</span><p>No pending client approvals</p></div>}

            <div className="section-divider"></div>
            <h3>All Clients ({clients.filter(c => c.isApproved).length})</h3>
            <div className="clients-grid">
              {clients.filter(c => c.isApproved).map(client => (
                <div key={client.id} className="client-card">
                  <div className="client-header"><div className="client-icon">✅</div><div><h3>{client.companyName}</h3><p>{client.companyEmail}</p></div></div>
                  <div className="client-details"><div>📞 {client.companyMobileNumber}</div><div>🌐 <a href={client.clientWebsite} target="_blank" rel="noopener noreferrer">{client.clientWebsite}</a></div></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeNav === 'projects' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>📁 All Projects</h2><select className="filter-select" value={projectStatusFilter} onChange={(e) => setProjectStatusFilter(e.target.value)}><option value="all">All Status</option><option value="PENDING">Pending</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select></div>
            <div className="projects-grid">
              {projects.filter(p => projectStatusFilter === 'all' || p.status === projectStatusFilter).map(project => (
                <div key={project.projectId} className="project-card">
                  <div className="project-card-header"><h3>{project.projectName}</h3>{getStatusBadge(project.status)}</div>
                  <p className="project-card-desc">{project.projectDescription.substring(0, 80)}...</p>
                  <div className="project-card-meta"><span>🏢 {project.clientName}</span><span>🏛️ {project.departmentName}</span><span>💰 ₹{parseFloat(project.cost).toLocaleString()}</span></div>
                  <div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => setSelectedProject(project)}>View Details</button></div>
                </div>
              ))}
            </div>
            {projects.length === 0 && <div className="empty-state"><span className="empty-icon">📁</span><p>No projects found</p></div>}
          </div>
        )}

        {/* DEPARTMENTS TAB */}
        {activeNav === 'departments' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>🏛️ Department Management</h2><button className="btn-primary" onClick={() => { setEditingDepartment(null); setNewDepartmentName(''); setShowCreateDepartmentModal(true); }}>+ New Department</button></div>
            
            <div className="departments-grid">
              {departments.map(dept => {
                const kpi = departmentKPIs.find(k => k.departmentId === dept.departmentId);
                return (
                  <div key={dept.departmentId} className="department-card">
                    <div className="department-header"><h3>{dept.departmentName}</h3><div className="department-actions"><button onClick={() => { setEditingDepartment(dept); setNewDepartmentName(dept.departmentName); setShowDepartmentModal(true); }}>✏️ Edit</button><button className="danger" onClick={() => handleDeleteDepartment(dept.departmentId)}>🗑️ Delete</button></div></div>
                    {kpi && <div className="department-stats"><div>👥 Employees: {kpi.totalEmployees}</div><div>👔 Managers: {kpi.totalManagers}</div><div>📁 Projects: {kpi.totalProjects}</div><div>✅ Completed: {kpi.completedProjects}</div><div>📊 Rate: {kpi.completionRate}%</div></div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TEAMS TAB - Redesigned Responsive */}
        {activeNav === 'teams' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>🤝 All Teams</h2></div>
            <div className="teams-responsive-grid">
              {teams.map(team => (
                <div key={team.teamId} className="team-responsive-card">
                  <div className="team-card-header">
                    <h3>{team.teamName}</h3>
                    <span className="project-badge">{team.projectName}</span>
                  </div>
                  <div className="team-manager-info">
                    <span className="manager-icon">👔</span>
                    <span className="manager-name">{team.managerName}</span>
                  </div>
                  <div className="team-members-container">
                    <div className="members-label">Team Members ({team.members.length})</div>
                    <div className="team-members-flex">
                      {team.members.map(member => (
                        <div key={member.memberId} className="member-chip">
                          <div className="member-chip-avatar">{member.memberName.charAt(0)}</div>
                          <div className="member-chip-info">
                            <div className="member-chip-name">{member.memberName}</div>
                            <div className="member-chip-role">{member.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="team-footer">
                    <span className="team-created">📅 Created: {new Date(team.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            {teams.length === 0 && <div className="empty-state"><span className="empty-icon">🤝</span><p>No teams found</p></div>}
          </div>
        )}

        {/* TASKS TAB - With Assign Button */}
        {activeNav === 'tasks' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>✅ All Tasks</h2>
              <div className="task-filters">
                <input type="text" placeholder="Search tasks..." className="search-input" value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} />
                <select className="filter-select" value={taskStatusFilter} onChange={(e) => setTaskStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
            <div className="tasks-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assigned To</th>
                    <th>Created By</th>
                    <th>Department</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task.taskId}>
                      <td className="task-desc-cell">{task.description}</td>
                      <td>{task.assignedToUserName || 'Unassigned'}</td>
                      <td>{task.createdByName}</td>
                      <td>{task.assignedToDepartment}</td>
                      <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</td>
                      <td>{getStatusBadge(task.status)}</td>
                      <td>
                        <button className="btn-assign" onClick={() => setSelectedTaskForAssign(task)}>
                          📋 Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredTasks.length === 0 && <div className="empty-state"><span className="empty-icon">✅</span><p>No tasks found</p></div>}
          </div>
        )}

        {/* PAYMENTS TAB - Complete Payment Component */}
        {activeNav === 'payments' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>💰 Payment Management</h2>
              <div className="payment-actions-header">
                <button className="btn-outline" onClick={() => setShowSalaryPaymentModal(true)}>💵 Create Salary Payment</button>
                <select className="filter-select" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value as any)}>
                  <option value="all">All Payments</option>
                  <option value="PENDING">Pending Only</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {/* Payment Summary Cards */}
            {paymentCounts && (
              <div className="payment-summary-cards">
                <div className="payment-summary-card pending">
                  <div className="summary-label">Pending</div>
                  <div className="summary-value">{paymentCounts.pendingCount}</div>
                </div>
                <div className="payment-summary-card approved">
                  <div className="summary-label">Approved</div>
                  <div className="summary-value">{paymentCounts.approvedCount}</div>
                </div>
                <div className="payment-summary-card rejected">
                  <div className="summary-label">Rejected</div>
                  <div className="summary-value">{paymentCounts.rejectedCount}</div>
                </div>
              </div>
            )}

            {/* Pending Payments List */}
            <h3>Pending Approvals ({pendingPayments.length})</h3>
            <div className="payments-list">
              {filteredPayments.filter(p => p.status === 'PENDING').map(payment => (
                <div key={payment.paymentId} className="payment-item pending">
                  <div className="payment-amount">₹{parseFloat(payment.amount).toLocaleString()}</div>
                  <div className="payment-info">
                    <div><strong>{payment.userName}</strong> - {payment.type}</div>
                    <div className="payment-meta">{payment.transactionId} • {new Date(payment.dateTime).toLocaleString()}</div>
                    {payment.paymentNote && <div className="payment-note">{payment.paymentNote}</div>}
                  </div>
                  <div className="payment-status">{getStatusBadge(payment.status)}</div>
                  <button className="btn-primary" onClick={() => setSelectedPayment(payment)}>Review</button>
                </div>
              ))}
            </div>

            {/* All Payments List */}
            <div className="section-divider"></div>
            <h3>All Transactions</h3>
            <div className="payments-list">
              {filteredPayments.slice(0, 10).map(payment => (
                <div key={payment.paymentId} className={`payment-item ${payment.status.toLowerCase()}`}>
                  <div className="payment-amount">₹{parseFloat(payment.amount).toLocaleString()}</div>
                  <div className="payment-info">
                    <div><strong>{payment.userName}</strong> - {payment.type}</div>
                    <div className="payment-meta">{payment.transactionId} • {new Date(payment.dateTime).toLocaleString()}</div>
                    {payment.paymentNote && <div className="payment-note">{payment.paymentNote}</div>}
                    {payment.directorNote && <div className="payment-note director-note">📝 {payment.directorNote}</div>}
                  </div>
                  <div className="payment-status">{getStatusBadge(payment.status)}</div>
                  {payment.approvedByName && <div className="payment-approved-by">✓ {payment.approvedByName}</div>}
                </div>
              ))}
            </div>

            {/* Department Wise Payment Summary */}
            <div className="section-divider"></div>
            <h3>Department Wise Payment Summary</h3>
            <div className="department-payment-grid">
              {departmentPaymentSummaries.map(dept => (
                <div key={dept.departmentId} className="department-payment-card" onClick={() => setSelectedDepartmentForPayment(dept)}>
                  <h4>{dept.departmentName}</h4>
                  <div className="dept-payment-stats">
                    <div>📁 {dept.totalProjects} Projects</div>
                    <div>💰 ₹{dept.totalBudget.toLocaleString()}</div>
                    <div>✅ ₹{dept.totalPaid.toLocaleString()} Paid</div>
                    <div>⏳ ₹{dept.totalRemaining.toLocaleString()} Remaining</div>
                  </div>
                  <div className="dept-progress">
                    <div className="dept-progress-fill" style={{ width: `${(dept.totalPaid / dept.totalBudget) * 100}%` }}></div>
                  </div>
                  <button className="btn-sm btn-outline">View Details</button>
                </div>
              ))}
            </div>

            {/* Client Wise Payment Summary */}
            <div className="section-divider"></div>
            <h3>Client Wise Payment Summary</h3>
            <div className="client-payment-grid">
              {clientPaymentSummaries.slice(0, 6).map(client => (
                <div key={client.clientId} className="client-payment-card" onClick={() => setSelectedClientForPayment(client)}>
                  <h4>{client.clientName}</h4>
                  <div className="client-payment-stats">
                    <div>📁 {client.totalProjects} Projects</div>
                    <div>💰 ₹{client.totalBudget.toLocaleString()}</div>
                    <div>✅ ₹{client.totalPaid.toLocaleString()}</div>
                  </div>
                  <div className="client-progress">
                    <div className="client-progress-fill" style={{ width: `${(client.totalPaid / client.totalBudget) * 100}%` }}></div>
                  </div>
                  <button className="btn-sm btn-outline">View Details</button>
                </div>
              ))}
            </div>

            {/* Project Payment Status */}
            <div className="section-divider"></div>
            <h3>Project Payment Status</h3>
            <div className="projects-payment-grid">
              {projectPaymentSummaries.map(project => (
                <div key={project.projectId} className="project-payment-card">
                  <div className="project-payment-header">
                    <h4>{project.projectName}</h4>
                    <span className={`payment-badge ${project.isFullyPaid ? 'paid' : 'partial'}`}>
                      {project.isFullyPaid ? 'Fully Paid' : `${project.paidPercentage}% Paid`}
                    </span>
                  </div>
                  <div className="project-payment-stats">
                    <div>🏢 {project.clientName}</div>
                    <div>🏛️ {project.departmentName}</div>
                    <div>💰 ₹{parseFloat(project.totalProjectAmount).toLocaleString()}</div>
                    <div>✅ ₹{parseFloat(project.paidAmount).toLocaleString()}</div>
                  </div>
                  <div className="project-progress">
                    <div className="project-progress-fill" style={{ width: `${project.paidPercentage}%` }}></div>
                  </div>
                  <button className="btn-sm btn-primary" onClick={() => setSelectedProjectForPaymentDetails({ id: project.projectId, name: project.projectName })}>
                    View Payment Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FILES TAB */}
        {activeNav === 'files' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>📎 Department Files</h2></div>
            <div className="files-grid">
              {files.map(file => (
                <div key={file.fileId} className="file-card">
                  <div className="file-icon-large">{file.fileType === 'Image' ? '🖼️' : file.fileType === 'Code' ? '💻' : '📄'}</div>
                  <div className="file-card-info"><div className="file-name">{file.fileLink.split('/').pop()}</div><div className="file-meta"><span>{file.fileType}</span><span>📤 {file.uploaderName}</span><span>📅 {new Date(file.uploadTime).toLocaleDateString()}</span><span>🏛️ {file.departmentName}</span></div></div>
                </div>
              ))}
            </div>
            {files.length === 0 && <div className="empty-state"><span className="empty-icon">📎</span><p>No files found</p></div>}
          </div>
        )}

        {/* USERS TAB */}
        {activeNav === 'users' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>👤 User Management</h2><div className="user-stats-summary"><span>Total: {users?.totalUsers}</span><span>Employees: {users?.totalEmployees}</span><span>Consultants: {users?.totalConsultants}</span><span>Clients: {users?.totalClients}</span></div></div>
            <div className="users-table-container">
              <table className="data-table">
                <thead><tr><th>User</th><th>Contact</th><th>Roles</th><th>Department</th><th>Position</th><th>Status</th><th>Joined</th></tr></thead>
                <tbody>
                  {users?.users.map(userItem => (
                    <tr key={userItem.userId}>
                      <td><div className="user-cell"><strong>{userItem.name}</strong><small>{userItem.email}</small></div></td>
                      <td>{userItem.phoneNumber}<br/><small>{userItem.address?.substring(0, 30)}...</small></td>
                      <td>{userItem.roles?.map(r => <span key={r} className="role-badge">{r}</span>)}</td>
                      <td>{userItem.department}</td>
                      <td>{userItem.position}</td>
                      <td>{userItem.isActive ? <span className="status-badge status-approved">Active</span> : <span className="status-badge status-rejected">Inactive</span>}</td>
                      <td>{new Date(userItem.joinedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeNav === 'profile' && (
          <div className="dashboard-card full-width">
            <div className="card-header"><h2>⚙️ Profile Settings</h2><button className="btn-outline" onClick={() => setShowProfileModal(true)}>Edit Profile</button></div>
            <div className="profile-info"><div className="profile-avatar-large"><div className="avatar-placeholder">{user?.name?.charAt(0) || 'D'}</div></div><div className="profile-details"><div className="detail-item"><label>Name</label><span>{user?.name}</span></div><div className="detail-item"><label>Email</label><span>{user?.email}</span></div><div className="detail-item"><label>Role</label><span>Head Director</span></div><div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not provided'}</span></div><div className="detail-item"><label>Address</label><span>{user?.address || 'Not provided'}</span></div><div className="detail-item"><label>Gender</label><span>{user?.gender || 'Not provided'}</span></div></div></div>
          </div>
        )}

        <footer className="client-footer"><p>© 2026 Gaurion Bharat | Developed by <a href='https://softmax.in' style={{ color: 'skyblue' }}>Softmax.in</a></p></footer>
      </main>

      {/* Modals */}
      {selectedConsultant && <ConsultantDetailModal consultant={selectedConsultant} departments={departments} onClose={() => setSelectedConsultant(null)} onUpdate={refreshData} />}
      {selectedClient && <ClientApprovalModal client={selectedClient} onClose={() => setSelectedClient(null)} onUpdate={refreshData} />}
      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} onUpdate={refreshData} />}
      {selectedPayment && <PaymentApprovalModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} onUpdate={refreshData} />}
      {selectedTaskForAssign && <TaskAssignModal task={selectedTaskForAssign} employees={employees} onClose={() => setSelectedTaskForAssign(null)} onUpdate={refreshData} />}
      {selectedProjectForPaymentDetails && <ProjectPaymentDetailsModal projectId={selectedProjectForPaymentDetails.id} projectName={selectedProjectForPaymentDetails.name} onClose={() => setSelectedProjectForPaymentDetails(null)} onUpdate={refreshData} />}
      {selectedDepartmentForPayment && <DepartmentPaymentSummaryModal department={selectedDepartmentForPayment} onClose={() => setSelectedDepartmentForPayment(null)} />}
      {selectedClientForPayment && <ClientPaymentSummaryModal client={selectedClientForPayment} onClose={() => setSelectedClientForPayment(null)} />}
      {showSalaryPaymentModal && <SalaryPaymentModal employees={employees} onClose={() => setShowSalaryPaymentModal(false)} onUpdate={refreshData} />}

      {/* Create Department Modal */}
      {showCreateDepartmentModal && (
        <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowCreateDepartmentModal(false)}>✕</button><h2>Create Department</h2><div className="m-form"><input placeholder="Department Name" value={newDepartmentName} onChange={(e) => setNewDepartmentName(e.target.value)} /><button className="btn-msub" onClick={handleCreateDepartment}>Create</button></div></div></div>
      )}

      {/* Edit Department Modal */}
      {showDepartmentModal && editingDepartment && (
        <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowDepartmentModal(false)}>✕</button><h2>Edit Department</h2><div className="m-form"><input placeholder="Department Name" value={newDepartmentName} onChange={(e) => setNewDepartmentName(e.target.value)} /><button className="btn-msub" onClick={handleUpdateDepartment}>Update</button></div></div></div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowProfileModal(false)}>✕</button><h2>Edit Profile</h2>
          <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleUpdateProfile({ name: fd.get('name'), phoneNumber: fd.get('phoneNumber'), address: fd.get('address'), gender: fd.get('gender') }); }}>
            <div className="m-form"><input name="name" placeholder="Name" defaultValue={user?.name} required /><input name="phoneNumber" placeholder="Phone Number" defaultValue={user?.phoneNumber} /><textarea name="address" placeholder="Address" rows={2} defaultValue={user?.address} /><select name="gender" defaultValue={user?.gender}><option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option></select><button type="submit" className="btn-msub">Save Changes</button></div>
          </form>
        </div></div>
      )}

      <style jsx>{`
        .client-container { display: flex; min-height: 100vh; }
        .client-main { flex: 1; margin-left: 280px; padding: 24px 32px; min-height: 100vh; }
        @media (max-width: 768px) { .client-main { margin-left: 0; padding: 16px; } .mobile-menu-btn { display: block; position: fixed; bottom: 20px; right: 20px; z-index: 101; background: var(--g-main); border: none; border-radius: 50%; width: 50px; height: 50px; font-size: 24px; cursor: pointer; } }
        @media (min-width: 769px) { .mobile-menu-btn { display: none; } }
        
        .client-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 20px; }
        .header-welcome h1 { font-size: 28px; font-weight: 700; margin: 0 0 4px; background: linear-gradient(135deg, #2ca6a4, #34a853); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header-welcome p { color: var(--muted); margin: 0; }
        .header-stats { display: flex; gap: 24px; }
        .header-stat-item { text-align: right; }
        .header-stat-item .stat-label { font-size: 11px; text-transform: uppercase; font-weight: 600; color: var(--muted); display: block; }
        .stat-value-sm { font-size: 18px; font-weight: 700; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; }
        .stat-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .stat-icon.blue { background: rgba(59, 130, 246, 0.1); }
        .stat-icon.green { background: rgba(16, 185, 129, 0.1); }
        .stat-icon.orange { background: rgba(245, 158, 11, 0.1); }
        .stat-icon.purple { background: rgba(139, 92, 246, 0.1); }
        .stat-info .stat-value { font-size: 28px; font-weight: 800; line-height: 1; }
        .stat-info .stat-label { font-size: 12px; color: var(--muted); }
        
        .dashboard-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 24px; margin-bottom: 24px; }
        .dashboard-card.full-width { width: 100%; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .card-header h2 { font-size: 20px; font-weight: 700; margin: 0; }
        
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
        .kpi-item { text-align: center; padding: 12px; background: var(--surface); border-radius: 12px; }
        .kpi-value { font-size: 28px; font-weight: 800; color: var(--teal); }
        .kpi-label { font-size: 11px; color: var(--muted); text-transform: uppercase; }
        
        .hr-analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; }
        .hr-analytics-card { background: var(--surface); border-radius: 16px; padding: 20px; border: 1px solid var(--border); }
        .hr-analytics-card h4 { font-size: 14px; font-weight: 700; margin-bottom: 16px; color: var(--teal); }
        .status-row, .dept-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 13px; flex-wrap: wrap; }
        .status-name, .dept-name { min-width: 100px; }
        .status-bar-chart, .dept-bar-chart { flex: 1; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
        .status-bar-fill, .dept-bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
        .status-count, .dept-count { min-width: 40px; text-align: right; font-weight: 600; }
        .tasks-summary { display: flex; justify-content: space-around; margin: 16px 0; flex-wrap: wrap; gap: 16px; }
        .task-stat { text-align: center; }
        .task-stat-value { font-size: 24px; font-weight: 800; display: block; }
        .task-stat.pending .task-stat-value { color: #f59e0b; }
        .task-stat.progress .task-stat-value { color: #3b82f6; }
        .task-stat.completed .task-stat-value { color: #10b981; }
        .task-stat-label { font-size: 11px; color: var(--muted); }
        .conversion-rate { text-align: center; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; margin-top: 12px; }
        .quick-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 13px; }
        .quick-stats div { padding: 6px 0; }
        
        .financial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
        .financial-card { text-align: center; padding: 16px; background: var(--surface); border-radius: 12px; }
        .financial-label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .financial-value { font-size: 24px; font-weight: 800; }
        .financial-value.revenue { color: #10b981; }
        .financial-value.expense { color: #ef4444; }
        .financial-value.profit { color: #3b82f6; }
        .financial-value.pending { color: #f59e0b; }
        .monthly-trends { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-top: 16px; }
        .month-card { background: var(--surface); border-radius: 12px; padding: 12px; text-align: center; }
        .month-name { font-weight: 700; margin-bottom: 8px; }
        .month-revenue { color: #10b981; font-size: 14px; }
        .month-expense { color: #ef4444; font-size: 12px; }
        .month-profit { color: #3b82f6; font-size: 12px; margin-top: 4px; }
        .revenue-type { display: flex; gap: 20px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); flex-wrap: wrap; }
        .revenue-type-item { display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .type-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
        .type-dot.project { background: #3b82f6; }
        .type-dot.salary { background: #f59e0b; }
        
        .status-distribution { margin-top: 16px; }
        .status-bar { height: 30px; background: var(--surface); border-radius: 12px; overflow: hidden; margin-bottom: 12px; }
        .status-fill { height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 600; }
        .status-fill.completed { background: linear-gradient(90deg, #10b981, #059669); }
        .status-stats { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; }
        
        .activities-list { display: flex; flex-direction: column; gap: 12px; }
        .activity-item { display: flex; gap: 12px; padding: 12px; background: var(--surface); border-radius: 12px; flex-wrap: wrap; }
        .activity-icon { font-size: 24px; }
        .activity-desc { font-weight: 500; margin-bottom: 4px; }
        .activity-meta { font-size: 11px; color: var(--muted); }
        
        .performers-list { display: flex; flex-direction: column; gap: 12px; }
        .performer-item { display: flex; align-items: center; gap: 16px; padding: 12px; background: var(--surface); border-radius: 12px; flex-wrap: wrap; }
        .performer-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #2ca6a4, #34a853); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: white; }
        .performer-name { font-weight: 700; }
        .performer-role { font-size: 11px; color: var(--muted); }
        .performer-stats { margin-left: auto; display: flex; gap: 12px; font-size: 12px; flex-wrap: wrap; }
        
        .consultants-grid, .clients-grid, .departments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .consultant-card, .client-card, .department-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: all 0.2s; }
        .consultant-card:hover, .client-card:hover, .department-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .consultant-header, .client-header { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
        .consultant-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #2ca6a4, #34a853); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: white; }
        .consultant-info h3 { margin: 0 0 4px; font-size: 16px; }
        .consultant-info p { margin: 0; font-size: 12px; color: var(--muted); }
        .consultant-details { margin-bottom: 16px; }
        .consultant-details .detail { font-size: 13px; margin-bottom: 6px; }
        .detail-label { font-weight: 600; color: var(--muted); }
        .consultant-actions { display: flex; gap: 8px; }
        
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .project-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: all 0.2s; }
        .project-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .project-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .project-card-header h3 { font-size: 16px; font-weight: 700; margin: 0; }
        .project-card-desc { font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 12px; }
        .project-card-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; color: var(--muted); margin-bottom: 16px; }
        .project-card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        
        .payment-summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .payment-summary-card { text-align: center; padding: 16px; background: var(--surface); border-radius: 12px; border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; }
        .payment-summary-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .payment-summary-card.pending { border-left: 3px solid #f59e0b; }
        .payment-summary-card.approved { border-left: 3px solid #10b981; }
        .payment-summary-card.rejected { border-left: 3px solid #ef4444; }
        .payment-summary-card .summary-label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
        .payment-summary-card .summary-value { font-size: 28px; font-weight: 800; }
        
        .payments-list { display: flex; flex-direction: column; gap: 12px; }
        .payment-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--surface); border-radius: 12px; border-left: 3px solid; flex-wrap: wrap; }
        .payment-item.pending { border-left-color: #f59e0b; }
        .payment-item.approved { border-left-color: #10b981; }
        .payment-item.rejected { border-left-color: #ef4444; }
        .payment-amount { font-size: 20px; font-weight: 800; min-width: 120px; }
        .payment-info { flex: 1; min-width: 200px; }
        .payment-meta { font-size: 11px; color: var(--muted); margin-top: 4px; }
        .payment-note { font-size: 12px; color: var(--text2); margin-top: 4px; }
        .payment-note.director-note { color: var(--teal); }
        .payment-status { min-width: 100px; }
        .payment-approved-by { font-size: 11px; color: var(--muted); }
        
        .department-payment-grid, .client-payment-grid, .projects-payment-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-top: 16px; }
        .department-payment-card, .client-payment-card, .project-payment-card { background: var(--surface); border-radius: 12px; padding: 16px; border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; }
        .department-payment-card:hover, .client-payment-card:hover, .project-payment-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .department-payment-card h4, .client-payment-card h4, .project-payment-card h4 { margin: 0 0 12px; font-size: 14px; }
        .dept-payment-stats, .client-payment-stats, .project-payment-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px; margin-bottom: 12px; }
        .dept-progress, .client-progress, .project-progress { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin: 12px 0; }
        .dept-progress-fill, .client-progress-fill, .project-progress-fill { height: 100%; background: linear-gradient(90deg, #2ca6a4, #34a853); border-radius: 3px; transition: width 0.3s; }
        .project-payment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .payment-badge { font-size: 10px; padding: 2px 8px; border-radius: 12px; }
        .payment-badge.paid { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .payment-badge.partial { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        
        .progress-bar-container { margin: 20px 0; }
        .progress-label { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
        .progress-bar { height: 10px; background: var(--border); border-radius: 5px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #2ca6a4, #34a853); border-radius: 5px; transition: width 0.3s; }
        .progress-percent { text-align: right; font-size: 12px; margin-top: 4px; color: var(--teal); }
        
        .amount-highlight { font-size: 20px; font-weight: 800; color: #10b981; }
        
        .teams-responsive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .team-responsive-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: all 0.2s; }
        .team-responsive-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .team-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .team-card-header h3 { margin: 0; font-size: 16px; }
        .project-badge { font-size: 10px; padding: 2px 8px; background: var(--surface); border-radius: 12px; color: var(--teal); }
        .team-manager-info { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding: 8px; background: rgba(44, 166, 164, 0.1); border-radius: 8px; flex-wrap: wrap; }
        .manager-icon { font-size: 16px; }
        .manager-name { font-weight: 600; color: var(--teal); }
        .members-label { font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 12px; }
        .team-members-flex { display: flex; flex-direction: column; gap: 10px; max-height: 200px; overflow-y: auto; }
        .member-chip { display: flex; align-items: center; gap: 10px; padding: 8px; background: var(--surface); border-radius: 10px; transition: all 0.2s; flex-wrap: wrap; }
        .member-chip:hover { background: rgba(44, 166, 164, 0.1); transform: translateX(4px); }
        .member-chip-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #2ca6a4, #34a853); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
        .member-chip-info { flex: 1; }
        .member-chip-name { font-weight: 600; font-size: 13px; }
        .member-chip-role { font-size: 10px; color: var(--teal); }
        .team-footer { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 10px; color: var(--muted); }
        
        .tasks-table-container { overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; min-width: 800px; }
        .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
        .data-table th { background: var(--surface); font-size: 12px; font-weight: 600; color: var(--muted); }
        .data-table td { font-size: 13px; }
        .task-desc-cell { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .btn-assign { padding: 4px 12px; background: #f59e0b; color: white; border: none; border-radius: 20px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-assign:hover { transform: scale(1.05); background: #d97706; }
        
        .task-filters { display: flex; gap: 12px; flex-wrap: wrap; }
        
        .files-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .file-card { display: flex; gap: 12px; padding: 16px; background: var(--surface); border-radius: 12px; border: 1px solid var(--border); flex-wrap: wrap; }
        .file-icon-large { font-size: 40px; }
        .file-card-info { flex: 1; }
        .file-name { font-weight: 600; margin-bottom: 6px; word-break: break-all; font-size: 13px; }
        .file-meta { display: flex; gap: 12px; flex-wrap: wrap; font-size: 10px; color: var(--muted); }
        
        .user-cell strong { display: block; }
        .user-cell small { font-size: 11px; color: var(--muted); }
        .role-badge { display: inline-block; padding: 2px 6px; background: rgba(44, 166, 164, 0.1); border-radius: 4px; font-size: 10px; margin-right: 4px; }
        
        .search-input { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); min-width: 200px; }
        .filter-select { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); cursor: pointer; }
        .btn-primary { padding: 8px 16px; background: linear-gradient(135deg, #2ca6a4, #1a7a78); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(44, 166, 164, 0.3); }
        .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 6px; }
        .btn-outline { background: transparent; border: 1px solid var(--border); padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { border-color: var(--teal); color: var(--teal); }
        .status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .status-pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-rejected { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .status-assigned { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
        .status-progress { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .status-completed { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        
        .section-divider { height: 1px; background: var(--border); margin: 20px 0; }
        .empty-state { text-align: center; padding: 40px; color: var(--muted); }
        .empty-icon { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.5; }
        .client-loader { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .loader-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--teal); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .modal-mask { display: flex; position: fixed; inset: 0; z-index: 2000; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 20px; }
        .modal-box { background: var(--card-bg); border-radius: 24px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding: 28px; position: relative; }
        .modal-box.large { max-width: 700px; }
        .m-close { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
        .m-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .m-tab { padding: 8px 16px; background: var(--surface); border: none; border-radius: 40px; cursor: pointer; font-size: 14px; }
        .m-tab.active { background: linear-gradient(135deg, #2ca6a4, #1a7a78); color: white; }
        .m-tab-content { margin-top: 16px; }
        .m-form { display: flex; flex-direction: column; gap: 16px; }
        .m-form input, .m-form textarea, .m-form select { padding: 12px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; font-size: 14px; }
        .btn-msub { padding: 14px; background: linear-gradient(135deg, #2ca6a4, #1a7a78); color: white; border: none; border-radius: 40px; font-weight: 700; cursor: pointer; width: 100%; }
        .details-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .detail-item { display: flex; flex-direction: column; gap: 4px; }
        .detail-item label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--muted); }
        .detail-item span { font-size: 14px; }
        .detail-item.full-width { grid-column: 1 / -1; }
        .form-row { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .field-label { font-size: 12px; font-weight: 600; color: var(--muted); }
        .radio-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .info-banner { display: flex; gap: 12px; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; margin-bottom: 16px; font-size: 13px; flex-wrap: wrap; }
        .timeline-list { display: flex; flex-direction: column; gap: 16px; }
        .timeline-item-small { display: flex; gap: 12px; }
        .timeline-dot-small { width: 10px; height: 10px; border-radius: 50%; margin-top: 6px; }
        .timeline-content-small { flex: 1; }
        .timeline-header-small { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
        .timeline-date { font-size: 11px; color: var(--muted); }
        .timeline-note-small { font-size: 12px; color: var(--muted); margin-top: 4px; padding: 4px 8px; background: var(--surface); border-radius: 6px; }
        .timeline-meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
        
        .client-footer { text-align: center; padding: 24px 0; margin-top: 32px; border-top: 1px solid var(--border); font-size: 13px; color: var(--muted); }
        .profile-info { display: flex; gap: 32px; flex-wrap: wrap; }
        .profile-avatar-large { width: 100px; height: 100px; border-radius: 24px; background: linear-gradient(135deg, #2ca6a4, #34a853); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .avatar-placeholder { font-size: 48px; font-weight: 700; color: white; }
        .profile-details { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
        .highlight { font-size: 24px; font-weight: 800; color: var(--teal); }
        .user-stats-summary { display: flex; gap: 16px; font-size: 13px; flex-wrap: wrap; }
        .user-stats-summary span { padding: 4px 12px; background: var(--surface); border-radius: 20px; }
        
        .department-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .department-header h3 { margin: 0; font-size: 16px; }
        .department-actions { display: flex; gap: 8px; }
        .department-actions button { padding: 4px 8px; font-size: 11px; border-radius: 6px; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
        .department-actions button.danger:hover { background: #ef4444; color: white; }
        .department-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px; }
        .client-card.pending { border-left: 3px solid #f59e0b; }
        .client-icon { font-size: 32px; }
        .client-details { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
        .client-details div { margin-bottom: 4px; }
        
        .upload-section-small { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .file-item-small { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--surface); border-radius: 8px; margin-bottom: 8px; flex-wrap: wrap; }
        .task-item-small { padding: 12px; background: var(--surface); border-radius: 8px; margin-bottom: 8px; }
        .task-header-small { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
        .task-meta-small { font-size: 11px; color: var(--muted); margin-bottom: 4px; }
        .task-deadline-small { font-size: 11px; color: #f59e0b; }
        .team-card-small { padding: 12px; background: var(--surface); border-radius: 12px; margin-bottom: 12px; }
        .team-header-small { display: flex; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .manager-badge { font-size: 11px; padding: 2px 8px; background: rgba(139, 92, 246, 0.1); border-radius: 12px; color: #8b5cf6; }
        .team-members-list { display: flex; flex-direction: column; gap: 8px; }
        .team-member-small { display: flex; align-items: center; gap: 10px; padding: 6px; flex-wrap: wrap; }
        .member-avatar-small { width: 32px; height: 32px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
        .member-name-small { font-weight: 500; font-size: 13px; }
        .member-role-small { font-size: 10px; color: var(--muted); }
        
        .payment-actions-header { display: flex; gap: 12px; flex-wrap: wrap; }
        
        @media (max-width: 768px) {
          .hr-analytics-grid { grid-template-columns: 1fr; }
          .financial-grid { grid-template-columns: repeat(2, 1fr); }
          .monthly-trends { grid-template-columns: repeat(2, 1fr); }
          .performer-stats { margin-left: 0; width: 100%; justify-content: space-between; }
          .teams-responsive-grid { grid-template-columns: 1fr; }
          .department-payment-grid, .client-payment-grid, .projects-payment-grid { grid-template-columns: 1fr; }
          .payment-actions-header { width: 100%; flex-direction: column; }
          .data-table th, .data-table td { padding: 8px; font-size: 11px; }
          .task-desc-cell { max-width: 120px; }
        }
      `}</style>
    </div>
  );
};

export default HeadDirector;

























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
//   phoneNumber?: string;
//   address?: string;
//   gender?: string;
//   roles?: string[];
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
//   phoneNumber: string;
//   address: string;
//   gender: string;
//   isDirectorVerified: boolean;
//   positionName: string;
//   salary: number;
//   department: string;
//   skillSet: string;
//   departmentId: number;
//   departmentName: string;
// }

// interface Client {
//   id: number;
//   user: {
//     userId: number;
//     name: string;
//     email: string;
//   };
//   companyName: string;
//   companyMobileNumber: string;
//   companyEmail: string;
//   orgType: string;
//   clientType: string;
//   isApproved: boolean;
//   clientStatus: string;
//   clientWebsite: string;
//   rejectionReason?: string;
// }

// interface Department {
//   departmentId: number;
//   departmentName: string;
// }

// interface DepartmentKPI {
//   departmentId: number;
//   departmentName: string;
//   totalEmployees: number;
//   totalManagers: number;
//   totalProjects: number;
//   completedProjects: number;
//   completionRate: number;
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
//   handledById: number | null;
//   handledByName: string;
//   assignedToId: number | null;
//   assignedToName: string | null;
//   directorNote: string | null;
//   managerNote: string | null;
//   deadline: string | null;
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

// interface Task {
//   taskId: number;
//   description: string;
//   status: string;
//   assignedToUserId: number;
//   assignedToUserName: string;
//   assignedToDepartment: string;
//   createdByUserId: number;
//   createdByName: string;
//   deadline: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// interface CompanyKPIs {
//   companySummary: {
//     totalEmployees: number;
//     totalManagers: number;
//     totalConsultants: number;
//     totalClients: number;
//     totalProjects: number;
//     completedProjects: number;
//     inProgressProjects: number;
//     pendingProjects: number;
//     completionRate: number;
//   };
//   departmentKPISummary: DepartmentKPI[];
//   monthlyTrends: {
//     month: string;
//     newEmployees: number;
//     newClients: number;
//     newProjects: number;
//     completed: number;
//   }[];
//   recentActivities: {
//     activityType: string;
//     description: string;
//     userName: string;
//     departmentName: string;
//     activityTime: string;
//   }[];
//   topPerformers: {
//     topEmployees: {
//       userId: number;
//       name: string;
//       position: string;
//       department: string;
//       completedTasks: number;
//       averageRating: number;
//     }[];
//   };
// }

// interface HRKPIs {
//   totalConsultants: number;
//   pendingConsultants: number;
//   totalEmployees: number;
//   totalProjects: number;
//   totalTasks: number;
//   totalDepartments: number;
//   consultantsByStatus: Record<string, number>;
//   consultantsByDepartment: Record<string, number>;
//   employeesByDepartment: Record<string, number>;
//   projectsByStatus: Record<string, number>;
//   tasksByStatus: Record<string, number>;
//   pendingTasks: number;
//   inProgressTasks: number;
//   completedTasks: number;
//   conversionRate: number;
// }

// interface BDEDashboardKPIs {
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

// interface PaymentRecord {
//   paymentId: number;
//   transactionId: string;
//   amount: string;
//   type: string;
//   status: 'PENDING' | 'APPROVED' | 'REJECTED';
//   userName: string;
//   userEmail: string;
//   paymentNote: string | null;
//   directorNote: string | null;
//   approvedByName: string | null;
//   approvedAt: string | null;
//   dateTime: string;
// }

// interface UserData {
//   users: {
//     userId: number;
//     name: string;
//     email: string;
//     photoUrl: string | null;
//     phoneNumber: string;
//     address: string;
//     gender: string;
//     roles: string[];
//     department: string;
//     position: string;
//     isActive: boolean;
//     joinedAt: string;
//   }[];
//   totalUsers: number;
//   totalEmployees: number;
//   totalConsultants: number;
//   totalClients: number;
// }

// // ============================================
// // API SERVICE
// // ============================================

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// async function apiCall<T>(method: string, endpoint: string, data?: any): Promise<T> {
//   const response = await axios({
//     method,
//     url: `${API_BASE}${endpoint}`,
//     data,
//     withCredentials: true,
//     headers: { 'Content-Type': 'application/json' },
//   });
//   console.log(`API ${method} ${endpoint} response:`, response.data);
//   return response.data;
// }

// async function apiCallFormData<T>(endpoint: string, formData: FormData): Promise<T> {
//   const response = await axios.post(`${API_BASE}${endpoint}`, formData, {
//     withCredentials: true,
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return response.data;
// }

// // Head Director APIs
// const headDirectorApi = {
//   check: () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/head-director/check'),
  
//   // Consultant Management
//   getConsultants: () => apiCall<{ success: boolean; data: Consultant[] }>('GET', '/api/head-director/consultants'),
//   getConsultantById: (consultantId: number) => apiCall<{ success: boolean; data: Consultant }>('GET', `/api/head-director/consultants/${consultantId}`),
//   getConsultantStatusHistory: (consultantId: number) => apiCall<{ success: boolean; data: StatusHistory[] }>('GET', `/api/head-director/consultants/${consultantId}/status-history`),
//   updateConsultantStatus: (consultantId: number, status: string, note: string) => 
//     apiCall('PUT', `/api/head-director/consultants/${consultantId}/status`, { status, note }),
//   assignConsultantDepartment: (consultantId: number, departmentId: number) => 
//     apiCall('PUT', `/api/head-director/consultants/${consultantId}/assign-department`, { departmentId }),
//   convertToEmployee: (consultantId: number, data: { positionName: string; salary: number; skillSet: string; departmentId: number }) => 
//     apiCall('POST', `/api/head-director/consultants/${consultantId}/convert-to-employee`, data),
  
//   // Employee Management
//   getEmployees: () => apiCall<{ success: boolean; data: Employee[] }>('GET', '/api/head-director/employees'),
//   getEmployeeById: (employeeId: number) => apiCall<{ success: boolean; data: Employee }>('GET', `/api/head-director/employees/${employeeId}`),
//   updateEmployee: (employeeId: number, data: { positionName: string; salary: number; skillSet: string; departmentId: number }) => 
//     apiCall('PUT', `/api/head-director/employees/${employeeId}`, data),
  
//   // Client Management
//   getPendingClients: () => apiCall<{ success: boolean; data: Client[] }>('GET', '/api/head-director/clients/pending'),
//   getAllClients: () => apiCall<{ success: boolean; data: Client[] }>('GET', '/api/head-director/clients'),
//   getClientById: (clientId: number) => apiCall<{ success: boolean; data: Client }>('GET', `/api/head-director/clients/${clientId}`),
//   approveClient: (clientId: number, isApproved: boolean, rejectionReason?: string | null) => 
//     apiCall('PUT', `/api/head-director/clients/${clientId}/approve`, { isApproved, rejectionReason }),
//   getBDETeam: () => apiCall<{ success: boolean; data: Employee[] }>('GET', '/api/head-director/bde-team'),
  
//   // User Management
//   getAllUsers: () => apiCall<{ success: boolean; data: UserData }>('GET', '/api/head-director/users'),
//   getUserById: (targetId: number) => apiCall<{ success: boolean; data: any }>('GET', `/api/head-director/users/${targetId}`),
  
//   // Department Management
//   getDepartments: () => apiCall<{ success: boolean; data: Department[] }>('GET', '/api/head-director/departments'),
//   getDepartmentById: (deptId: number) => apiCall<{ success: boolean; data: Department }>('GET', `/api/head-director/departments/${deptId}`),
//   createDepartment: (departmentName: string) => apiCall('POST', `/api/head-director/departments?departmentName=${encodeURIComponent(departmentName)}`),
//   updateDepartment: (deptId: number, departmentName: string) => apiCall('PUT', `/api/head-director/departments/${deptId}?departmentName=${encodeURIComponent(departmentName)}`),
//   deleteDepartment: (deptId: number) => apiCall('DELETE', `/api/head-director/departments/${deptId}`),
//   getDepartmentKPIs: () => apiCall<{ success: boolean; data: DepartmentKPI[] }>('GET', '/api/head-director/departments/kpis'),
  
//   // Project Management
//   getAllProjects: () => apiCall<{ success: boolean; data: Project[] }>('GET', '/api/head-director/all-projects'),
//   getProjectsByDepartment: (deptId: number) => apiCall<{ success: boolean; data: Project[] }>('GET', `/api/head-director/projects/department/${deptId}`),
//   getProjectsByStatus: (status: string) => apiCall<{ success: boolean; data: Project[] }>('GET', `/api/head-director/projects/status/${status}`),
//   getProjectById: (projectId: number) => apiCall<{ success: boolean; data: Project }>('GET', `/api/head-director/all-projects/${projectId}`),
//   updateProjectStatus: (projectId: number, status: string, note?: string) => 
//     apiCall('PUT', `/api/head-director/projects/${projectId}/status?status=${status}${note ? `&note=${encodeURIComponent(note)}` : ''}`),
//   getProjectHistory: (projectId: number) => apiCall<{ success: boolean; data: ProjectHistory[] }>('GET', `/api/head-director/projects/${projectId}/history`),
  
//   // Team Management
//   getAllTeams: () => apiCall<{ success: boolean; data: Team[] }>('GET', '/api/head-director/teams'),
//   getTeamsByProject: (projectId: number) => apiCall<{ success: boolean; data: Team[] }>('GET', `/api/head-director/projects/${projectId}/teams`),
  
//   // Task Management
//   getAllTasks: () => apiCall<{ success: boolean; data: Task[] }>('GET', '/api/head-director/all-tasks'),
//   getTasksByProject: (projectId: number) => apiCall<{ success: boolean; data: Task[] }>('GET', `/api/head-director/projects/${projectId}/tasks`),
//   updateTaskStatus: (taskId: number, status: string, note?: string) => 
//     apiCall('PUT', `/api/head-director/all-tasks/${taskId}/status?status=${status}${note ? `&note=${encodeURIComponent(note)}` : ''}`),
  
//   // Dashboards
//   getCompanyKPIs: () => apiCall<{ success: boolean; data: CompanyKPIs }>('GET', '/api/head-director/dashboard/company-kpis'),
//   getHRKPIs: () => apiCall<{ success: boolean; data: HRKPIs }>('GET', '/api/head-director/dashboard/hr-kpis'),
//   getBDEDashboard: () => apiCall<{ success: boolean; data: BDEDashboardKPIs }>('GET', '/api/head-director/bde/dashboard/kpis'),
// };

// // File APIs
// const fileApi = {
//   upload: (projectId: number, file: File, fileType: string) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     return apiCallFormData(`/api/file/upload/${projectId}?fileType=${fileType}`, formData);
//   },
//   getByProject: (projectId: number) => apiCall<{ success: boolean; data: FileItem[] }>('GET', `/api/file/project/${projectId}`),
//   getMyUploads: () => apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/my-uploads'),
//   getDepartmentFiles: () => apiCall<{ success: boolean; data: FileItem[] }>('GET', '/api/file/department-files'),
//   delete: (fileId: number) => apiCall('DELETE', `/api/file/delete/${fileId}`),
//   getAccessToken: (fileId: number) => apiCall('POST', `/api/file/access-token/${fileId}`, {}),
// };

// // Payment APIs (for approval)
// const paymentApi = {
//   getPendingPayments: () => apiCall<{ success: boolean; data: PaymentRecord[] }>('GET', '/api/payment/pending'),
//   getAllPayments: () => apiCall<{ success: boolean; data: PaymentRecord[] }>('GET', '/api/payment/all'),
//   approvePayment: (paymentId: number, isApproved: boolean, directorNote?: string) => 
//     apiCall('PUT', `/api/payment/${paymentId}/approve`, { isApproved, directorNote }),
// };

// const userApi = {
//   getProfile: () => apiCall<{ success: boolean; data: UserProfile }>('GET', '/api/users/profile'),
//   updateProfile: (data: any) => apiCall('PUT', '/api/users/profile', data),
// };

// // ============================================
// // SIDEBAR MENU ITEMS
// // ============================================

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//   { id: 'consultants', label: 'Consultants', icon: '👨‍💻' },
//   { id: 'employees', label: 'Employees', icon: '👥' },
//   { id: 'clients', label: 'Clients', icon: '🏢' },
//   { id: 'projects', label: 'Projects', icon: '📁' },
//   { id: 'departments', label: 'Departments', icon: '🏛️' },
//   { id: 'teams', label: 'Teams', icon: '🤝' },
//   { id: 'tasks', label: 'Tasks', icon: '✅' },
//   { id: 'payments', label: 'Payments', icon: '💰' },
//   { id: 'files', label: 'Files', icon: '📎' },
//   { id: 'users', label: 'Users', icon: '👤' },
//   { id: 'profile', label: 'Profile', icon: '⚙️' },
// ];

// // ============================================
// // STATUS CONFIGURATION
// // ============================================

// const statusConfig: Record<string, { label: string; class: string; icon: string; color: string }> = {
//   PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳', color: '#F59E0B' },
//   APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅', color: '#10B981' },
//   REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '❌', color: '#EF4444' },
//   ASSIGNED: { label: 'Assigned', class: 'status-assigned', icon: '👥', color: '#8B5CF6' },
//   IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄', color: '#3B82F6' },
//   COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️', color: '#10B981' },
//   APPLIED: { label: 'Applied', class: 'status-pending', icon: '📝', color: '#F59E0B' },
//   ACTIVE: { label: 'Active', class: 'status-approved', icon: '🟢', color: '#10B981' },
// };

// const getStatusBadge = (status: string) => {
//   const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌', color: '#6B7280' };
//   return <span className={`status-badge ${config.class}`}>{config.icon} {config.label}</span>;
// };

// // ============================================
// // MODAL COMPONENTS
// // ============================================

// const ConsultantDetailModal: React.FC<{
//   consultant: Consultant | null;
//   departments: Department[];
//   onClose: () => void;
//   onUpdate: () => void;
// }> = ({ consultant, departments, onClose, onUpdate }) => {
//   const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [statusNote, setStatusNote] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState<number>(consultant?.departmentId || 0);
//   const [convertData, setConvertData] = useState({ positionName: '', salary: '', skillSet: '' });
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     if (consultant) {
//       loadStatusHistory();
//       setSelectedStatus(consultant.currentStatus);
//       setSelectedDepartment(consultant.departmentId);
//     }
//   }, [consultant]);

//   const loadStatusHistory = async () => {
//     if (!consultant) return;
//     try {
//       const res = await headDirectorApi.getConsultantStatusHistory(consultant.consultantId);
//       if (res.success) setStatusHistory(res.data);
//     } catch (error) {
//       console.error('Error loading status history:', error);
//     }
//   };

//   const handleUpdateStatus = async () => {
//     if (!consultant || !selectedStatus) return;
//     setLoading(true);
//     try {
//       await headDirectorApi.updateConsultantStatus(consultant.consultantId, selectedStatus, statusNote);
//       await loadStatusHistory();
//       onUpdate();
//       alert('Status updated successfully');
//       setStatusNote('');
//     } catch (error) {
//       alert('Failed to update status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAssignDepartment = async () => {
//     if (!consultant || !selectedDepartment) return;
//     setLoading(true);
//     try {
//       await headDirectorApi.assignConsultantDepartment(consultant.consultantId, selectedDepartment);
//       onUpdate();
//       alert('Department assigned successfully');
//     } catch (error) {
//       alert('Failed to assign department');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConvertToEmployee = async () => {
//     if (!consultant || !convertData.positionName || !convertData.salary || !convertData.skillSet || !selectedDepartment) {
//       alert('Please fill all fields');
//       return;
//     }
//     setLoading(true);
//     try {
//       await headDirectorApi.convertToEmployee(consultant.consultantId, {
//         positionName: convertData.positionName,
//         salary: parseFloat(convertData.salary),
//         skillSet: convertData.skillSet,
//         departmentId: selectedDepartment,
//       });
//       onUpdate();
//       onClose();
//       alert('Consultant converted to employee successfully');
//     } catch (error) {
//       alert('Failed to convert to employee');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!consultant) return null;

//   return (
//     <div className="modal-mask open">
//       <div className="modal-box large">
//         <button className="m-close" onClick={onClose}>✕</button>
//         <h2>{consultant.name}</h2>
//         <p className="subtitle">{consultant.email}</p>

//         <div className="m-tabs">
//           <button className={`m-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📋 Overview</button>
//           <button className={`m-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>📜 Status History</button>
//           <button className={`m-tab ${activeTab === 'convert' ? 'active' : ''}`} onClick={() => setActiveTab('convert')}>🔄 Convert to Employee</button>
//         </div>

//         {activeTab === 'overview' && (
//           <div className="m-tab-content">
//             <div className="details-grid">
//               <div className="detail-item"><label>Skills</label><span>{consultant.skill}</span></div>
//               <div className="detail-item"><label>Experience</label><span>{consultant.experience}</span></div>
//               <div className="detail-item"><label>Current Status</label>{getStatusBadge(consultant.currentStatus)}</div>
//               <div className="detail-item"><label>Department</label><span>{consultant.departmentName || 'Not assigned'}</span></div>
//             </div>

//             <div className="section-divider"></div>
//             <h3>Update Status</h3>
//             <div className="form-row">
//               <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
//                 <option value="APPLIED">Applied</option>
//                 <option value="DOCUMENT_VERIFIED">Document Verified</option>
//                 <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
//                 <option value="INTERVIEW_PASSED">Interview Passed</option>
//                 <option value="INTERVIEW_FAILED">Interview Failed</option>
//                 <option value="APPROVED">Approved</option>
//                 <option value="REJECTED">Rejected</option>
//               </select>
//               <textarea placeholder="Note (optional)" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} rows={2} />
//               <button className="btn-primary" onClick={handleUpdateStatus} disabled={loading}>Update Status</button>
//             </div>

//             <div className="section-divider"></div>
//             <h3>Assign Department</h3>
//             <div className="form-row">
//               <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}>
//                 <option value={0}>Select Department</option>
//                 {departments.map(dept => <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>)}
//               </select>
//               <button className="btn-primary" onClick={handleAssignDepartment} disabled={loading}>Assign Department</button>
//             </div>
//           </div>
//         )}

//         {activeTab === 'history' && (
//           <div className="m-tab-content">
//             {statusHistory.length === 0 ? <div className="empty-state">No status history</div> : (
//               <div className="timeline-list">
//                 {[...statusHistory].reverse().map(entry => (
//                   <div key={entry.statusId} className="timeline-item-small">
//                     <div className="timeline-dot-small" style={{ backgroundColor: statusConfig[entry.status]?.color }}></div>
//                     <div className="timeline-content-small">
//                       <div className="timeline-header-small">
//                         {getStatusBadge(entry.status)}
//                         <span className="timeline-date">{new Date(entry.dateTime).toLocaleString()}</span>
//                       </div>
//                       {entry.note && <div className="timeline-note-small">{entry.note}</div>}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'convert' && (
//           <div className="m-tab-content">
//             <div className="info-banner">
//               <span className="info-icon">ℹ️</span>
//               <span>Converting this consultant to an employee will create an employee record and remove them from consultants list.</span>
//             </div>
//             <div className="form-row"><input placeholder="Position Name *" value={convertData.positionName} onChange={(e) => setConvertData({ ...convertData, positionName: e.target.value })} /></div>
//             <div className="form-row"><input type="number" placeholder="Salary (per month) *" value={convertData.salary} onChange={(e) => setConvertData({ ...convertData, salary: e.target.value })} /></div>
//             <div className="form-row"><input placeholder="Skill Set *" value={convertData.skillSet} onChange={(e) => setConvertData({ ...convertData, skillSet: e.target.value })} /></div>
//             <div className="form-row">
//               <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(parseInt(e.target.value))}>
//                 <option value={0}>Select Department *</option>
//                 {departments.map(dept => <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>)}
//               </select>
//             </div>
//             <button className="btn-primary" onClick={handleConvertToEmployee} disabled={loading}>Convert to Employee</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const ClientApprovalModal: React.FC<{
//   client: Client | null;
//   onClose: () => void;
//   onUpdate: () => void;
// }> = ({ client, onClose, onUpdate }) => {
//   const [isApproved, setIsApproved] = useState(true);
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [loading, setLoading] = useState(false);

//   if (!client) return null;

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await headDirectorApi.approveClient(client.id, isApproved, isApproved ? null : rejectionReason);
//       onUpdate();
//       onClose();
//       alert(`Client ${isApproved ? 'approved' : 'rejected'} successfully`);
//     } catch (error) {
//       alert('Failed to process request');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-mask open">
//       <div className="modal-box">
//         <button className="m-close" onClick={onClose}>✕</button>
//         <h2>Approve Client</h2>
//         <p><strong>{client.companyName}</strong></p>
        
//         <div className="details-grid">
//           <div className="detail-item"><label>Email</label><span>{client.companyEmail}</span></div>
//           <div className="detail-item"><label>Mobile</label><span>{client.companyMobileNumber}</span></div>
//           <div className="detail-item"><label>Org Type</label><span>{client.orgType}</span></div>
//           <div className="detail-item"><label>Client Type</label><span>{client.clientType}</span></div>
//           <div className="detail-item full-width"><label>Website</label><a href={client.clientWebsite} target="_blank" rel="noopener noreferrer">{client.clientWebsite}</a></div>
//         </div>

//         <div className="section-divider"></div>
        
//         <div className="form-row">
//           <label className="radio-label"><input type="radio" checked={isApproved} onChange={() => setIsApproved(true)} /> Approve</label>
//           <label className="radio-label"><input type="radio" checked={!isApproved} onChange={() => setIsApproved(false)} /> Reject</label>
//         </div>
        
//         {!isApproved && <textarea placeholder="Rejection Reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={3} />}
        
//         <button className="btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Processing...' : 'Submit'}</button>
//       </div>
//     </div>
//   );
// };

// const PaymentApprovalModal: React.FC<{
//   payment: PaymentRecord | null;
//   onClose: () => void;
//   onUpdate: () => void;
// }> = ({ payment, onClose, onUpdate }) => {
//   const [isApproved, setIsApproved] = useState(true);
//   const [directorNote, setDirectorNote] = useState('');
//   const [loading, setLoading] = useState(false);

//   if (!payment) return null;

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       await paymentApi.approvePayment(payment.paymentId, isApproved, directorNote);
//       onUpdate();
//       onClose();
//       alert(`Payment ${isApproved ? 'approved' : 'rejected'} successfully`);
//     } catch (error) {
//       alert('Failed to process payment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal-mask open">
//       <div className="modal-box">
//         <button className="m-close" onClick={onClose}>✕</button>
//         <h2>💰 Payment Approval</h2>
//         <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
        
//         <div className="details-grid">
//           <div className="detail-item"><label>Amount</label><span className="amount-highlight">₹{parseFloat(payment.amount).toLocaleString()}</span></div>
//           <div className="detail-item"><label>From</label><span>{payment.userName}</span></div>
//           <div className="detail-item"><label>Email</label><span>{payment.userEmail}</span></div>
//           <div className="detail-item full-width"><label>Note</label><span>{payment.paymentNote || 'No note'}</span></div>
//         </div>

//         <div className="section-divider"></div>
        
//         <div className="form-row">
//           <label className="radio-label"><input type="radio" checked={isApproved} onChange={() => setIsApproved(true)} /> ✅ Approve Payment</label>
//           <label className="radio-label"><input type="radio" checked={!isApproved} onChange={() => setIsApproved(false)} /> ❌ Reject Payment</label>
//         </div>
        
//         <textarea placeholder="Director Note (optional)" value={directorNote} onChange={(e) => setDirectorNote(e.target.value)} rows={3} />
        
//         <button className="btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Processing...' : 'Submit Decision'}</button>
//       </div>
//     </div>
//   );
// };

// const ProjectDetailModal: React.FC<{
//   project: Project | null;
//   onClose: () => void;
//   onUpdate: () => void;
// }> = ({ project, onClose, onUpdate }) => {
//   const [history, setHistory] = useState<ProjectHistory[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [files, setFiles] = useState<FileItem[]>([]);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [newStatus, setNewStatus] = useState('');
//   const [statusNote, setStatusNote] = useState('');
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     if (project) {
//       loadProjectData();
//       setNewStatus(project.status);
//     }
//   }, [project]);

//   const loadProjectData = async () => {
//     if (!project) return;
//     try {
//       const [historyRes, teamsRes, tasksRes, filesRes] = await Promise.all([
//         headDirectorApi.getProjectHistory(project.projectId),
//         headDirectorApi.getTeamsByProject(project.projectId),
//         headDirectorApi.getTasksByProject(project.projectId),
//         fileApi.getByProject(project.projectId),
//       ]);
//       if (historyRes.success) setHistory(historyRes.data);
//       if (teamsRes.success) setTeams(teamsRes.data);
//       if (tasksRes.success) setTasks(tasksRes.data);
//       if (filesRes.success) setFiles(filesRes.data);
//     } catch (error) {
//       console.error('Error loading project data:', error);
//     }
//   };

//   const handleUpdateStatus = async () => {
//     if (!project || !newStatus) return;
//     setLoading(true);
//     try {
//       await headDirectorApi.updateProjectStatus(project.projectId, newStatus, statusNote);
//       await loadProjectData();
//       onUpdate();
//       alert('Project status updated');
//       setStatusNote('');
//     } catch (error) {
//       alert('Failed to update status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = async () => {
//     if (!project || !fileInputRef.current?.files?.length) return;
//     const file = fileInputRef.current.files[0];
//     setUploading(true);
//     try {
//       await fileApi.upload(project.projectId, file, 'Document');
//       const filesRes = await fileApi.getByProject(project.projectId);
//       setFiles(filesRes.data);
//       if (fileInputRef.current) fileInputRef.current.value = '';
//       alert('File uploaded');
//     } catch (error) {
//       alert('Upload failed');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleFileView = async (fileId: number) => {
//     try {
//       const tokenRes = await fileApi.getAccessToken(fileId);
//       if (tokenRes.success && tokenRes.data) {
//         window.open(`${API_BASE}${tokenRes.data.secureUrl}`, '_blank');
//       }
//     } catch (error) {
//       alert('Cannot view file');
//     }
//   };

//   const handleFileDelete = async (fileId: number) => {
//     if (!confirm('Delete this file?')) return;
//     try {
//       await fileApi.delete(fileId);
//       const filesRes = await fileApi.getByProject(project!.projectId);
//       setFiles(filesRes.data);
//       alert('File deleted');
//     } catch (error) {
//       alert('Delete failed');
//     }
//   };

//   if (!project) return null;

//   return (
//     <div className="modal-mask open">
//       <div className="modal-box large">
//         <button className="m-close" onClick={onClose}>✕</button>
//         <h2>{project.projectName}</h2>
//         <p className="subtitle">Client: {project.clientName}</p>

//         <div className="m-tabs">
//           <button className={`m-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📋 Overview</button>
//           <button className={`m-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>📜 History</button>
//           <button className={`m-tab ${activeTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveTab('teams')}>👥 Teams ({teams.length})</button>
//           <button className={`m-tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>✅ Tasks ({tasks.length})</button>
//           <button className={`m-tab ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}>📎 Files ({files.length})</button>
//         </div>

//         {activeTab === 'overview' && (
//           <div className="m-tab-content">
//             <div className="details-grid">
//               <div className="detail-item"><label>Status</label>{getStatusBadge(project.status)}</div>
//               <div className="detail-item"><label>Type</label><span>{project.projectType}</span></div>
//               <div className="detail-item"><label>Department</label><span>{project.departmentName}</span></div>
//               <div className="detail-item"><label>Manager</label><span>{project.assignedManagerName || 'Not assigned'}</span></div>
//               <div className="detail-item"><label>Budget</label><span>₹{parseFloat(project.cost).toLocaleString()}</span></div>
//               <div className="detail-item"><label>Deadline</label><span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not set'}</span></div>
//               <div className="detail-item full-width"><label>Description</label><p>{project.projectDescription}</p></div>
//             </div>

//             <div className="section-divider"></div>
//             <h3>Update Project Status</h3>
//             <div className="form-row">
//               <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
//                 <option value="PENDING">Pending</option>
//                 <option value="ASSIGNED">Assigned</option>
//                 <option value="IN_PROGRESS">In Progress</option>
//                 <option value="COMPLETED">Completed</option>
//                 <option value="REJECTED">Rejected</option>
//               </select>
//               <textarea placeholder="Note (optional)" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} rows={2} />
//               <button className="btn-primary" onClick={handleUpdateStatus} disabled={loading}>Update Status</button>
//             </div>
//           </div>
//         )}

//         {activeTab === 'history' && (
//           <div className="m-tab-content">
//             {history.length === 0 ? <div className="empty-state">No history</div> : (
//               <div className="timeline-list">
//                 {[...history].reverse().map(entry => (
//                   <div key={entry.statusId} className="timeline-item-small">
//                     <div className="timeline-dot-small" style={{ backgroundColor: statusConfig[entry.status]?.color }}></div>
//                     <div className="timeline-content-small">
//                       <div className="timeline-header-small">{getStatusBadge(entry.status)}<span className="timeline-date">{new Date(entry.dateTime).toLocaleString()}</span></div>
//                       <div className="timeline-meta">By: {entry.handledByName}</div>
//                       {entry.assignedToName && <div className="timeline-meta">Assigned to: {entry.assignedToName}</div>}
//                       {entry.directorNote && <div className="timeline-note-small">📝 {entry.directorNote}</div>}
//                       {entry.managerNote && <div className="timeline-note-small">👔 {entry.managerNote}</div>}
//                       {entry.deadline && <div className="timeline-meta">Deadline: {new Date(entry.deadline).toLocaleDateString()}</div>}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === 'teams' && (
//           <div className="m-tab-content">
//             {teams.length === 0 ? <div className="empty-state">No teams assigned</div> : teams.map(team => (
//               <div key={team.teamId} className="team-card-small">
//                 <div className="team-header-small"><strong>{team.teamName}</strong> <span className="manager-badge">Manager: {team.managerName}</span></div>
//                 <div className="team-members-list">
//                   {team.members.map(member => (
//                     <div key={member.memberId} className="team-member-small">
//                       <div className="member-avatar-small">{member.memberName.charAt(0)}</div>
//                       <div><div className="member-name-small">{member.memberName}</div><div className="member-role-small">{member.role}</div></div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {activeTab === 'tasks' && (
//           <div className="m-tab-content">
//             {tasks.length === 0 ? <div className="empty-state">No tasks created</div> : tasks.map(task => (
//               <div key={task.taskId} className="task-item-small">
//                 <div className="task-header-small">
//                   <strong>{task.description}</strong>
//                   {getStatusBadge(task.status)}
//                 </div>
//                 <div className="task-meta-small">Assigned to: {task.assignedToUserName} | Created by: {task.createdByName}</div>
//                 {task.deadline && <div className="task-deadline-small">📅 Deadline: {new Date(task.deadline).toLocaleDateString()}</div>}
//               </div>
//             ))}
//           </div>
//         )}

//         {activeTab === 'files' && (
//           <div className="m-tab-content">
//             <div className="upload-section-small"><input type="file" ref={fileInputRef} /><button className="btn-primary" onClick={handleFileUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload File'}</button></div>
//             {files.length === 0 ? <div className="empty-state">No files</div> : files.map(file => (
//               <div key={file.fileId} className="file-item-small">
//                 <span className="file-icon-small">📄</span>
//                 <div className="file-info-small"><div className="file-name-small">{file.fileLink.split('/').pop()}</div><div className="file-meta-small">Uploaded by {file.uploaderName} on {new Date(file.uploadTime).toLocaleDateString()}</div></div>
//                 <div className="file-actions-small"><button onClick={() => handleFileView(file.fileId)}>👁️ View</button><button onClick={() => handleFileDelete(file.fileId)}>🗑️</button></div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ============================================
// // MAIN HEAD DIRECTOR COMPONENT
// // ============================================

// const HeadDirector: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('dashboard');
//   const [loading, setLoading] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const { logout } = useAuth();

//   // Data states
//   const [consultants, setConsultants] = useState<Consultant[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [clients, setClients] = useState<Client[]>([]);
//   const [pendingClients, setPendingClients] = useState<Client[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [departmentKPIs, setDepartmentKPIs] = useState<DepartmentKPI[]>([]);
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [payments, setPayments] = useState<PaymentRecord[]>([]);
//   const [pendingPayments, setPendingPayments] = useState<PaymentRecord[]>([]);
//   const [files, setFiles] = useState<FileItem[]>([]);
//   const [users, setUsers] = useState<UserData | null>(null);
  
//   // Dashboard KPI states
//   const [companyKPIs, setCompanyKPIs] = useState<CompanyKPIs | null>(null);
//   const [hrKPIs, setHrKPIs] = useState<HRKPIs | null>(null);
//   const [bdeKPIs, setBdeKPIs] = useState<BDEDashboardKPIs | null>(null);
  
//   // Modal states
//   const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
//   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  
//   // Form states
//   const [newDepartmentName, setNewDepartmentName] = useState('');
//   const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
//   const [showDepartmentModal, setShowDepartmentModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showCreateDepartmentModal, setShowCreateDepartmentModal] = useState(false);
  
//   // Filters
//   const [projectStatusFilter, setProjectStatusFilter] = useState('all');
//   const [consultantSearch, setConsultantSearch] = useState('');
//   const [paymentFilter, setPaymentFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');

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
//       const [
//         profileRes,
//         consultantsRes,
//         employeesRes,
//         clientsRes,
//         pendingClientsRes,
//         projectsRes,
//         deptsRes,
//         deptKPIsRes,
//         teamsRes,
//         tasksRes,
//         paymentsRes,
//         pendingPaymentsRes,
//         filesRes,
//         usersRes,
//         companyKPIsRes,
//         hrKPIsRes,
//         bdeKPIsRes,
//       ] = await Promise.all([
//         userApi.getProfile().catch(() => ({ data: null })),
//         headDirectorApi.getConsultants().catch(() => ({ data: [] })),
//         headDirectorApi.getEmployees().catch(() => ({ data: [] })),
//         headDirectorApi.getAllClients().catch(() => ({ data: [] })),
//         headDirectorApi.getPendingClients().catch(() => ({ data: [] })),
//         headDirectorApi.getAllProjects().catch(() => ({ data: [] })),
//         headDirectorApi.getDepartments().catch(() => ({ data: [] })),
//         headDirectorApi.getDepartmentKPIs().catch(() => ({ data: [] })),
//         headDirectorApi.getAllTeams().catch(() => ({ data: [] })),
//         headDirectorApi.getAllTasks().catch(() => ({ data: [] })),
//         paymentApi.getAllPayments().catch(() => ({ data: [] })),
//         paymentApi.getPendingPayments().catch(() => ({ data: [] })),
//         fileApi.getDepartmentFiles().catch(() => ({ data: [] })),
//         headDirectorApi.getAllUsers().catch(() => ({ data: null })),
//         headDirectorApi.getCompanyKPIs().catch(() => ({ data: null })),
//         headDirectorApi.getHRKPIs().catch(() => ({ data: null })),
//         headDirectorApi.getBDEDashboard().catch(() => ({ data: null })),
//       ]);

//       setUser(profileRes.data);
//       setConsultants(consultantsRes.data);
//       setEmployees(employeesRes.data);
//       setClients(clientsRes.data);
//       setPendingClients(pendingClientsRes.data);
//       setProjects(projectsRes.data);
//       setDepartments(deptsRes.data);
//       setDepartmentKPIs(deptKPIsRes.data);
//       setTeams(teamsRes.data);
//       setTasks(tasksRes.data);
//       setPayments(paymentsRes.data);
//       setPendingPayments(pendingPaymentsRes.data);
//       setFiles(filesRes.data);
//       setUsers(usersRes.data);
//       setCompanyKPIs(companyKPIsRes.data);
//       setHrKPIs(hrKPIsRes.data);
//       setBdeKPIs(bdeKPIsRes.data);
//     } catch (error) {
//       console.error('Error loading data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshData = () => {
//     loadAllData();
//   };

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//   };

//   const handleCreateDepartment = async () => {
//     if (!newDepartmentName.trim()) return;
//     try {
//       await headDirectorApi.createDepartment(newDepartmentName);
//       const deptsRes = await headDirectorApi.getDepartments();
//       setDepartments(deptsRes.data);
//       setShowCreateDepartmentModal(false);
//       setNewDepartmentName('');
//       alert('Department created');
//     } catch (error) {
//       alert('Failed to create department');
//     }
//   };

//   const handleUpdateDepartment = async () => {
//     if (!editingDepartment || !newDepartmentName.trim()) return;
//     try {
//       await headDirectorApi.updateDepartment(editingDepartment.departmentId, newDepartmentName);
//       const deptsRes = await headDirectorApi.getDepartments();
//       setDepartments(deptsRes.data);
//       setShowDepartmentModal(false);
//       setEditingDepartment(null);
//       setNewDepartmentName('');
//       alert('Department updated');
//     } catch (error) {
//       alert('Failed to update department');
//     }
//   };

//   const handleDeleteDepartment = async (deptId: number) => {
//     if (!confirm('Delete this department? This will affect all associated records.')) return;
//     try {
//       await headDirectorApi.deleteDepartment(deptId);
//       const deptsRes = await headDirectorApi.getDepartments();
//       setDepartments(deptsRes.data);
//       alert('Department deleted');
//     } catch (error) {
//       alert('Failed to delete department');
//     }
//   };

//   const handleUpdateProfile = async (data: any) => {
//     try {
//       await userApi.updateProfile(data);
//       const profileRes = await userApi.getProfile();
//       setUser(profileRes.data);
//       setShowProfileModal(false);
//       alert('Profile updated');
//     } catch (error) {
//       alert('Update failed');
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

//   const getProjectStats = () => {
//     const total = projects.length;
//     const completed = projects.filter(p => p.status === 'COMPLETED').length;
//     const inProgress = projects.filter(p => p.status === 'IN_PROGRESS').length;
//     const pending = projects.filter(p => p.status === 'PENDING').length;
//     const assigned = projects.filter(p => p.status === 'ASSIGNED').length;
//     return { total, completed, inProgress, pending, assigned };
//   };

//   const filteredConsultants = consultants.filter(c => 
//     c.name.toLowerCase().includes(consultantSearch.toLowerCase()) ||
//     c.email.toLowerCase().includes(consultantSearch.toLowerCase()) ||
//     c.skill.toLowerCase().includes(consultantSearch.toLowerCase())
//   );

//   const filteredPayments = pendingPayments.filter(p => {
//     if (paymentFilter === 'all') return true;
//     return p.status === paymentFilter;
//   });

//   const projectStats = getProjectStats();

//   if (loading) {
//     return <div className="client-loader"><div className="loader-spinner"></div></div>;
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
//         title="Head Director"
//         logoIcon="👔"
//         isOpen={mobileSidebarOpen}
//         onClose={() => setMobileSidebarOpen(false)}
//       />

//       <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>☰</button>

//       <main className="client-main">
//         <header className="client-header">
//           <div className="header-welcome">
//             <h1>Welcome, Director {user?.name?.split(' ')[0] || ''}!</h1>
//             <p>Head Director Dashboard - Complete Organization Overview</p>
//           </div>
//           <div className="header-stats">
//             <div className="header-stat-item"><span className="stat-label">Total Users</span><span className="stat-value-sm">{users?.totalUsers || 0}</span></div>
//             <div className="header-stat-item"><span className="stat-label">Pending Clients</span><span className="stat-value-sm">{pendingClients.length}</span></div>
//             <div className="header-stat-item"><span className="stat-label">Pending Payments</span><span className="stat-value-sm">{pendingPayments.length}</span></div>
//           </div>
//         </header>

//         {/* DASHBOARD TAB */}
//         {activeNav === 'dashboard' && (
//           <>
//             <div className="stats-grid">
//               <div className="stat-card"><div className="stat-icon blue">👥</div><div className="stat-info"><span className="stat-value">{employees.length}</span><span className="stat-label">Employees</span></div></div>
//               <div className="stat-card"><div className="stat-icon green">👨‍💻</div><div className="stat-info"><span className="stat-value">{consultants.length}</span><span className="stat-label">Consultants</span></div></div>
//               <div className="stat-card"><div className="stat-icon orange">🏢</div><div className="stat-info"><span className="stat-value">{clients.length}</span><span className="stat-label">Clients</span></div></div>
//               <div className="stat-card"><div className="stat-icon purple">📁</div><div className="stat-info"><span className="stat-value">{projectStats.total}</span><span className="stat-label">Projects</span></div></div>
//             </div>

//             {/* Company KPIs */}
//             {companyKPIs && (
//               <div className="dashboard-card">
//                 <div className="card-header"><h2>📊 Company Overview</h2></div>
//                 <div className="kpi-grid">
//                   <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.totalEmployees}</div><div className="kpi-label">Total Employees</div></div>
//                   <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.totalManagers}</div><div className="kpi-label">Managers</div></div>
//                   <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.totalConsultants}</div><div className="kpi-label">Consultants</div></div>
//                   <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.totalClients}</div><div className="kpi-label">Clients</div></div>
//                   <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.totalProjects}</div><div className="kpi-label">Total Projects</div></div>
//                   <div className="kpi-item"><div className="kpi-value">{companyKPIs.companySummary.completionRate}%</div><div className="kpi-label">Completion Rate</div></div>
//                 </div>
                
//                 <div className="section-divider"></div>
//                 <h3>Project Status Distribution</h3>
//                 <div className="status-distribution">
//                   <div className="status-bar"><div className="status-fill completed" style={{ width: `${(projectStats.completed / projectStats.total) * 100 || 0}%` }}><span>Completed</span></div></div>
//                   <div className="status-stats"><span>✅ Completed: {projectStats.completed}</span><span>🔄 In Progress: {projectStats.inProgress}</span><span>⏳ Pending: {projectStats.pending}</span><span>👥 Assigned: {projectStats.assigned}</span></div>
//                 </div>
//               </div>
//             )}

//             {/* HR KPIs */}
//             {hrKPIs && (
//               <div className="dashboard-card">
//                 <div className="card-header"><h2>👥 HR Analytics</h2></div>
//                 <div className="kpi-grid-two">
//                   <div><strong>Consultants by Status:</strong>{Object.entries(hrKPIs.consultantsByStatus).map(([k, v]) => <div key={k}>• {k}: {v}</div>)}</div>
//                   <div><strong>Consultants by Dept:</strong>{Object.entries(hrKPIs.consultantsByDepartment).map(([k, v]) => <div key={k}>• {k}: {v}</div>)}</div>
//                   <div><strong>Tasks Status:</strong><div>Pending: {hrKPIs.pendingTasks}</div><div>In Progress: {hrKPIs.inProgressTasks}</div><div>Completed: {hrKPIs.completedTasks}</div></div>
//                   <div><strong>Conversion Rate:</strong> <span className="highlight">{hrKPIs.conversionRate}%</span></div>
//                 </div>
//               </div>
//             )}

//             {/* Recent Activities */}
//             {companyKPIs?.recentActivities && companyKPIs.recentActivities.length > 0 && (
//               <div className="dashboard-card">
//                 <div className="card-header"><h2>🔄 Recent Activities</h2></div>
//                 <div className="activities-list">
//                   {companyKPIs.recentActivities.slice(0, 5).map((activity, idx) => (
//                     <div key={idx} className="activity-item">
//                       <div className="activity-icon">{activity.activityType === 'PROJECT_CREATED' ? '📁' : '📝'}</div>
//                       <div className="activity-content"><div className="activity-desc">{activity.description}</div><div className="activity-meta">By {activity.userName} • {activity.departmentName} • {new Date(activity.activityTime).toLocaleString()}</div></div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Top Performers */}
//             {companyKPIs?.topPerformers?.topEmployees && companyKPIs.topPerformers.topEmployees.length > 0 && (
//               <div className="dashboard-card">
//                 <div className="card-header"><h2>🏆 Top Performers</h2></div>
//                 <div className="performers-list">
//                   {companyKPIs.topPerformers.topEmployees.map(performer => (
//                     <div key={performer.userId} className="performer-item">
//                       <div className="performer-avatar">{performer.name.charAt(0)}</div>
//                       <div><div className="performer-name">{performer.name}</div><div className="performer-role">{performer.position} • {performer.department}</div></div>
//                       <div className="performer-stats"><span>✅ {performer.completedTasks} tasks</span><span>⭐ {performer.averageRating}/5</span></div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* CONSULTANTS TAB */}
//         {activeNav === 'consultants' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>👨‍💻 Consultant Management</h2><div><input type="text" placeholder="Search consultants..." className="search-input" value={consultantSearch} onChange={(e) => setConsultantSearch(e.target.value)} /></div></div>
//             <div className="consultants-grid">
//               {filteredConsultants.map(consultant => (
//                 <div key={consultant.consultantId} className="consultant-card">
//                   <div className="consultant-header"><div className="consultant-avatar">{consultant.name.charAt(0)}</div><div className="consultant-info"><h3>{consultant.name}</h3><p>{consultant.email}</p></div>{getStatusBadge(consultant.currentStatus)}</div>
//                   <div className="consultant-details"><div className="detail"><span className="detail-label">Skills:</span> {consultant.skill}</div><div className="detail"><span className="detail-label">Experience:</span> {consultant.experience}</div><div className="detail"><span className="detail-label">Department:</span> {consultant.departmentName || 'Not assigned'}</div></div>
//                   <div className="consultant-actions"><button className="btn-primary" onClick={() => setSelectedConsultant(consultant)}>View Details</button></div>
//                 </div>
//               ))}
//             </div>
//             {filteredConsultants.length === 0 && <div className="empty-state"><span className="empty-icon">👨‍💻</span><p>No consultants found</p></div>}
//           </div>
//         )}

//         {/* EMPLOYEES TAB */}
//         {activeNav === 'employees' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>👥 Employee Directory</h2></div>
//             <div className="employees-table-container">
//               <table className="data-table">
//                 <thead><tr><th>Employee</th><th>Position</th><th>Department</th><th>Salary</th><th>Skills</th><th>Status</th></tr></thead>
//                 <tbody>
//                   {employees.map(emp => (
//                     <tr key={emp.employeeId}>
//                       <td><div className="user-cell"><strong>{emp.name}</strong><small>{emp.email}</small></div></td>
//                       <td>{emp.positionName}</td>
//                       <td>{emp.departmentName}</td>
//                       <td>₹{emp.salary.toLocaleString()}</td>
//                       <td className="skills-cell">{emp.skillSet?.substring(0, 50)}...</td>
//                       <td>{emp.isDirectorVerified ? <span className="status-badge status-approved">✅ Verified</span> : <span className="status-badge status-pending">⏳ Pending</span>}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {employees.length === 0 && <div className="empty-state"><span className="empty-icon">👥</span><p>No employees found</p></div>}
//           </div>
//         )}

//         {/* CLIENTS TAB */}
//         {activeNav === 'clients' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>🏢 Client Management</h2><div className="header-tabs"><button className="tab-btn" onClick={() => {}}>All Clients ({clients.length})</button><button className="tab-btn pending" onClick={() => {}}>Pending Approval ({pendingClients.length})</button></div></div>
            
//             <h3>Pending Approvals</h3>
//             <div className="clients-grid">
//               {pendingClients.map(client => (
//                 <div key={client.id} className="client-card pending">
//                   <div className="client-header"><div className="client-icon">🏢</div><div><h3>{client.companyName}</h3><p>{client.companyEmail}</p></div></div>
//                   <div className="client-details"><div>📞 {client.companyMobileNumber}</div><div>🏷️ {client.orgType} • {client.clientType}</div></div>
//                   <div className="client-actions"><button className="btn-primary" onClick={() => setSelectedClient(client)}>Review & Approve</button></div>
//                 </div>
//               ))}
//             </div>
//             {pendingClients.length === 0 && <div className="empty-state"><span className="empty-icon">✅</span><p>No pending client approvals</p></div>}

//             <div className="section-divider"></div>
//             <h3>All Clients</h3>
//             <div className="clients-grid">
//               {clients.filter(c => c.isApproved).map(client => (
//                 <div key={client.id} className="client-card">
//                   <div className="client-header"><div className="client-icon">✅</div><div><h3>{client.companyName}</h3><p>{client.companyEmail}</p></div></div>
//                   <div className="client-details"><div>📞 {client.companyMobileNumber}</div><div>🌐 <a href={client.clientWebsite} target="_blank" rel="noopener noreferrer">{client.clientWebsite}</a></div></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* PROJECTS TAB */}
//         {activeNav === 'projects' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>📁 All Projects</h2><select className="filter-select" value={projectStatusFilter} onChange={(e) => setProjectStatusFilter(e.target.value)}><option value="all">All Status</option><option value="PENDING">Pending</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select></div>
//             <div className="projects-grid">
//               {projects.filter(p => projectStatusFilter === 'all' || p.status === projectStatusFilter).map(project => (
//                 <div key={project.projectId} className="project-card">
//                   <div className="project-card-header"><h3>{project.projectName}</h3>{getStatusBadge(project.status)}</div>
//                   <p className="project-card-desc">{project.projectDescription.substring(0, 80)}...</p>
//                   <div className="project-card-meta"><span>🏢 {project.clientName}</span><span>🏛️ {project.departmentName}</span><span>💰 ₹{parseFloat(project.cost).toLocaleString()}</span></div>
//                   <div className="project-card-actions"><button className="btn-sm btn-primary" onClick={() => setSelectedProject(project)}>View Details</button></div>
//                 </div>
//               ))}
//             </div>
//             {projects.length === 0 && <div className="empty-state"><span className="empty-icon">📁</span><p>No projects found</p></div>}
//           </div>
//         )}

//         {/* DEPARTMENTS TAB */}
//         {activeNav === 'departments' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>🏛️ Department Management</h2><button className="btn-primary" onClick={() => { setEditingDepartment(null); setNewDepartmentName(''); setShowCreateDepartmentModal(true); }}>+ New Department</button></div>
            
//             <div className="departments-grid">
//               {departments.map(dept => {
//                 const kpi = departmentKPIs.find(k => k.departmentId === dept.departmentId);
//                 return (
//                   <div key={dept.departmentId} className="department-card">
//                     <div className="department-header"><h3>{dept.departmentName}</h3><div className="department-actions"><button onClick={() => { setEditingDepartment(dept); setNewDepartmentName(dept.departmentName); setShowDepartmentModal(true); }}>✏️ Edit</button><button className="danger" onClick={() => handleDeleteDepartment(dept.departmentId)}>🗑️ Delete</button></div></div>
//                     {kpi && <div className="department-stats"><div>👥 Employees: {kpi.totalEmployees}</div><div>👔 Managers: {kpi.totalManagers}</div><div>📁 Projects: {kpi.totalProjects}</div><div>✅ Completed: {kpi.completedProjects}</div><div>📊 Rate: {kpi.completionRate}%</div></div>}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* TEAMS TAB */}
//         {activeNav === 'teams' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>🤝 All Teams</h2></div>
//             <div className="teams-grid">
//               {teams.map(team => (
//                 <div key={team.teamId} className="team-card">
//                   <div className="team-card-header"><h3>{team.teamName}</h3><span className="project-badge">{team.projectName}</span></div>
//                   <div className="team-manager">Manager: {team.managerName}</div>
//                   <div className="team-members-list">
//                     {team.members.map(member => (
//                       <div key={member.memberId} className="team-member-chip">
//                         <div className="member-chip-avatar">{member.memberName.charAt(0)}</div>
//                         <span>{member.memberName}</span>
//                         <span className="member-role-chip">{member.role}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {teams.length === 0 && <div className="empty-state"><span className="empty-icon">🤝</span><p>No teams found</p></div>}
//           </div>
//         )}

//         {/* TASKS TAB */}
//         {activeNav === 'tasks' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>✅ All Tasks</h2></div>
//             <div className="tasks-table-container">
//               <table className="data-table">
//                 <thead><tr><th>Task</th><th>Assigned To</th><th>Created By</th><th>Department</th><th>Deadline</th><th>Status</th></tr></thead>
//                 <tbody>
//                   {tasks.map(task => (
//                     <tr key={task.taskId}>
//                       <td className="task-desc-cell">{task.description}</td>
//                       <td>{task.assignedToUserName}</td>
//                       <td>{task.createdByName}</td>
//                       <td>{task.assignedToDepartment}</td>
//                       <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</td>
//                       <td>{getStatusBadge(task.status)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {tasks.length === 0 && <div className="empty-state"><span className="empty-icon">✅</span><p>No tasks found</p></div>}
//           </div>
//         )}

//         {/* PAYMENTS TAB */}
//         {activeNav === 'payments' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>💰 Payment Approvals</h2><select className="filter-select" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value as any)}><option value="all">All</option><option value="PENDING">Pending Only</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></div>
            
//             <div className="payments-list">
//               {filteredPayments.map(payment => (
//                 <div key={payment.paymentId} className={`payment-item ${payment.status.toLowerCase()}`}>
//                   <div className="payment-amount">₹{parseFloat(payment.amount).toLocaleString()}</div>
//                   <div className="payment-info"><div><strong>{payment.userName}</strong></div><div className="payment-meta">{payment.transactionId} • {new Date(payment.dateTime).toLocaleString()}</div>{payment.paymentNote && <div className="payment-note">{payment.paymentNote}</div>}</div>
//                   <div className="payment-status">{getStatusBadge(payment.status)}</div>
//                   {payment.status === 'PENDING' && <button className="btn-primary" onClick={() => setSelectedPayment(payment)}>Review</button>}
//                 </div>
//               ))}
//             </div>
//             {filteredPayments.length === 0 && <div className="empty-state"><span className="empty-icon">💰</span><p>No payments found</p></div>}
//           </div>
//         )}

//         {/* FILES TAB */}
//         {activeNav === 'files' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>📎 Department Files</h2></div>
//             <div className="files-grid">
//               {files.map(file => (
//                 <div key={file.fileId} className="file-card">
//                   <div className="file-icon-large">{file.fileType === 'Image' ? '🖼️' : file.fileType === 'Code' ? '💻' : '📄'}</div>
//                   <div className="file-card-info"><div className="file-name">{file.fileLink.split('/').pop()}</div><div className="file-meta"><span>{file.fileType}</span><span>📤 {file.uploaderName}</span><span>📅 {new Date(file.uploadTime).toLocaleDateString()}</span><span>🏛️ {file.departmentName}</span></div></div>
//                 </div>
//               ))}
//             </div>
//             {files.length === 0 && <div className="empty-state"><span className="empty-icon">📎</span><p>No files found</p></div>}
//           </div>
//         )}

//         {/* USERS TAB */}
//         {activeNav === 'users' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>👤 User Management</h2><div className="user-stats-summary"><span>Total: {users?.totalUsers}</span><span>Employees: {users?.totalEmployees}</span><span>Consultants: {users?.totalConsultants}</span><span>Clients: {users?.totalClients}</span></div></div>
//             <div className="users-table-container">
//               <table className="data-table">
//                 <thead><tr><th>User</th><th>Contact</th><th>Roles</th><th>Department</th><th>Position</th><th>Status</th><th>Joined</th></tr></thead>
//                 <tbody>
//                   {users?.users.map(userItem => (
//                     <tr key={userItem.userId}>
//                       <td><div className="user-cell"><strong>{userItem.name}</strong><small>{userItem.email}</small></div></td>
//                       <td>{userItem.phoneNumber}<br/><small>{userItem.address?.substring(0, 30)}...</small></td>
//                       <td>{userItem.roles?.map(r => <span key={r} className="role-badge">{r}</span>)}</td>
//                       <td>{userItem.department}</td>
//                       <td>{userItem.position}</td>
//                       <td>{userItem.isActive ? <span className="status-badge status-approved">Active</span> : <span className="status-badge status-rejected">Inactive</span>}</td>
//                       <td>{new Date(userItem.joinedAt).toLocaleDateString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* PROFILE TAB */}
//         {activeNav === 'profile' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>⚙️ Profile Settings</h2><button className="btn-outline" onClick={() => setShowProfileModal(true)}>Edit Profile</button></div>
//             <div className="profile-info"><div className="profile-avatar-large"><div className="avatar-placeholder">{user?.name?.charAt(0) || 'D'}</div></div><div className="profile-details"><div className="detail-item"><label>Name</label><span>{user?.name}</span></div><div className="detail-item"><label>Email</label><span>{user?.email}</span></div><div className="detail-item"><label>Role</label><span>Head Director</span></div><div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not provided'}</span></div><div className="detail-item"><label>Address</label><span>{user?.address || 'Not provided'}</span></div><div className="detail-item"><label>Gender</label><span>{user?.gender || 'Not provided'}</span></div></div></div>
//           </div>
//         )}

//         <footer className="client-footer"><p>© 2026 Head Director Portal | Developed by Softmax.in</p></footer>
//       </main>

//       {/* Modals */}
//       {selectedConsultant && <ConsultantDetailModal consultant={selectedConsultant} departments={departments} onClose={() => setSelectedConsultant(null)} onUpdate={refreshData} />}
//       {selectedClient && <ClientApprovalModal client={selectedClient} onClose={() => setSelectedClient(null)} onUpdate={refreshData} />}
//       {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} onUpdate={refreshData} />}
//       {selectedPayment && <PaymentApprovalModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} onUpdate={refreshData} />}

//       {/* Create Department Modal */}
//       {showCreateDepartmentModal && (
//         <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowCreateDepartmentModal(false)}>✕</button><h2>Create Department</h2><div className="m-form"><input placeholder="Department Name" value={newDepartmentName} onChange={(e) => setNewDepartmentName(e.target.value)} /><button className="btn-msub" onClick={handleCreateDepartment}>Create</button></div></div></div>
//       )}

//       {/* Edit Department Modal */}
//       {showDepartmentModal && editingDepartment && (
//         <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowDepartmentModal(false)}>✕</button><h2>Edit Department</h2><div className="m-form"><input placeholder="Department Name" value={newDepartmentName} onChange={(e) => setNewDepartmentName(e.target.value)} /><button className="btn-msub" onClick={handleUpdateDepartment}>Update</button></div></div></div>
//       )}

//       {/* Profile Edit Modal */}
//       {showProfileModal && (
//         <div className="modal-mask open"><div className="modal-box"><button className="m-close" onClick={() => setShowProfileModal(false)}>✕</button><h2>Edit Profile</h2>
//           <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleUpdateProfile({ name: fd.get('name'), phoneNumber: fd.get('phoneNumber'), address: fd.get('address'), gender: fd.get('gender') }); }}>
//             <div className="m-form"><input name="name" placeholder="Name" defaultValue={user?.name} required /><input name="phoneNumber" placeholder="Phone Number" defaultValue={user?.phoneNumber} /><textarea name="address" placeholder="Address" rows={2} defaultValue={user?.address} /><select name="gender" defaultValue={user?.gender}><option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option></select><button type="submit" className="btn-msub">Save Changes</button></div>
//           </form>
//         </div></div>
//       )}

//       <style jsx>{`
//         .client-container { display: flex; min-height: 100vh; }
//         .client-main { flex: 1; margin-left: 280px; padding: 24px 32px; min-height: 100vh; }
//         @media (max-width: 768px) { .client-main { margin-left: 0; padding: 16px; } .mobile-menu-btn { display: block; position: fixed; bottom: 20px; right: 20px; z-index: 101; background: var(--g-main); border: none; border-radius: 50%; width: 50px; height: 50px; font-size: 24px; cursor: pointer; } }
//         @media (min-width: 769px) { .mobile-menu-btn { display: none; } }
        
//         .client-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 20px; }
//         .header-welcome h1 { font-size: 28px; font-weight: 700; margin: 0 0 4px; background: linear-gradient(135deg, #2ca6a4, #34a853); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
//         .header-welcome p { color: var(--muted); margin: 0; }
//         .header-stats { display: flex; gap: 24px; }
//         .header-stat-item { text-align: right; }
//         .header-stat-item .stat-label { font-size: 11px; text-transform: uppercase; font-weight: 600; color: var(--muted); display: block; }
//         .stat-value-sm { font-size: 18px; font-weight: 700; }
        
//         .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
//         .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; }
//         .stat-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
//         .stat-icon.blue { background: rgba(59, 130, 246, 0.1); }
//         .stat-icon.green { background: rgba(16, 185, 129, 0.1); }
//         .stat-icon.orange { background: rgba(245, 158, 11, 0.1); }
//         .stat-icon.purple { background: rgba(139, 92, 246, 0.1); }
//         .stat-info .stat-value { font-size: 28px; font-weight: 800; line-height: 1; }
//         .stat-info .stat-label { font-size: 12px; color: var(--muted); }
        
//         .dashboard-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 24px; margin-bottom: 24px; }
//         .dashboard-card.full-width { width: 100%; }
//         .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
//         .card-header h2 { font-size: 20px; font-weight: 700; margin: 0; }
        
//         .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
//         .kpi-item { text-align: center; padding: 12px; background: var(--surface); border-radius: 12px; }
//         .kpi-value { font-size: 28px; font-weight: 800; color: var(--teal); }
//         .kpi-label { font-size: 11px; color: var(--muted); text-transform: uppercase; }
//         .kpi-grid-two { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        
//         .status-distribution { margin-top: 16px; }
//         .status-bar { height: 30px; background: var(--surface); border-radius: 12px; overflow: hidden; margin-bottom: 12px; }
//         .status-fill { height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 600; }
//         .status-fill.completed { background: linear-gradient(90deg, #10b981, #059669); }
//         .status-stats { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; }
        
//         .activities-list { display: flex; flex-direction: column; gap: 12px; }
//         .activity-item { display: flex; gap: 12px; padding: 12px; background: var(--surface); border-radius: 12px; }
//         .activity-icon { font-size: 24px; }
//         .activity-desc { font-weight: 500; margin-bottom: 4px; }
//         .activity-meta { font-size: 11px; color: var(--muted); }
        
//         .performers-list { display: flex; flex-direction: column; gap: 12px; }
//         .performer-item { display: flex; align-items: center; gap: 16px; padding: 12px; background: var(--surface); border-radius: 12px; }
//         .performer-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #2ca6a4, #34a853); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: white; }
//         .performer-name { font-weight: 700; }
//         .performer-role { font-size: 11px; color: var(--muted); }
//         .performer-stats { margin-left: auto; display: flex; gap: 12px; font-size: 12px; }
        
//         .consultants-grid, .clients-grid, .teams-grid, .departments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
//         .consultant-card, .client-card, .team-card, .department-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: all 0.2s; }
//         .consultant-card:hover, .client-card:hover, .team-card:hover, .department-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
//         .consultant-header, .client-header { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
//         .consultant-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #2ca6a4, #34a853); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: white; }
//         .consultant-info h3 { margin: 0 0 4px; font-size: 16px; }
//         .consultant-info p { margin: 0; font-size: 12px; color: var(--muted); }
//         .consultant-details { margin-bottom: 16px; }
//         .consultant-details .detail { font-size: 13px; margin-bottom: 6px; }
//         .detail-label { font-weight: 600; color: var(--muted); }
//         .consultant-actions { display: flex; gap: 8px; }
        
//         .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
//         .project-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; transition: all 0.2s; }
//         .project-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
//         .project-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
//         .project-card-header h3 { font-size: 16px; font-weight: 700; margin: 0; }
//         .project-card-desc { font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 12px; }
//         .project-card-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; color: var(--muted); margin-bottom: 16px; }
//         .project-card-actions { display: flex; gap: 8px; }
        
//         .payments-list { display: flex; flex-direction: column; gap: 12px; }
//         .payment-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--surface); border-radius: 12px; border-left: 3px solid; }
//         .payment-item.pending { border-left-color: #f59e0b; }
//         .payment-item.approved { border-left-color: #10b981; }
//         .payment-item.rejected { border-left-color: #ef4444; }
//         .payment-amount { font-size: 20px; font-weight: 800; min-width: 120px; }
//         .payment-info { flex: 1; }
//         .payment-meta { font-size: 11px; color: var(--muted); margin-top: 4px; }
//         .payment-note { font-size: 12px; color: var(--text2); margin-top: 4px; }
//         .payment-status { min-width: 100px; }
        
//         .files-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
//         .file-card { display: flex; gap: 12px; padding: 16px; background: var(--surface); border-radius: 12px; border: 1px solid var(--border); }
//         .file-icon-large { font-size: 40px; }
//         .file-card-info { flex: 1; }
//         .file-name { font-weight: 600; margin-bottom: 6px; word-break: break-all; }
//         .file-meta { display: flex; gap: 12px; flex-wrap: wrap; font-size: 10px; color: var(--muted); }
        
//         .data-table { width: 100%; border-collapse: collapse; }
//         .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border); }
//         .data-table th { background: var(--surface); font-size: 12px; font-weight: 600; color: var(--muted); }
//         .data-table td { font-size: 13px; }
//         .user-cell strong { display: block; }
//         .user-cell small { font-size: 11px; color: var(--muted); }
//         .skills-cell { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .role-badge { display: inline-block; padding: 2px 6px; background: rgba(44, 166, 164, 0.1); border-radius: 4px; font-size: 10px; margin-right: 4px; }
        
//         .team-member-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--surface); border-radius: 20px; margin: 4px; }
//         .member-chip-avatar { width: 24px; height: 24px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; }
//         .member-role-chip { font-size: 10px; color: var(--muted); }
        
//         .search-input { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); min-width: 200px; }
//         .filter-select { padding: 8px 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); cursor: pointer; }
//         .btn-primary { padding: 8px 16px; background: linear-gradient(135deg, #2ca6a4, #1a7a78); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
//         .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 6px; }
//         .btn-outline { background: transparent; border: 1px solid var(--border); padding: 8px 16px; border-radius: 8px; cursor: pointer; }
//         .status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
//         .status-pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
//         .status-approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }
//         .status-rejected { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
//         .status-assigned { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
//         .status-progress { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
//         .status-completed { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        
//         .section-divider { height: 1px; background: var(--border); margin: 20px 0; }
//         .empty-state { text-align: center; padding: 40px; color: var(--muted); }
//         .empty-icon { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.5; }
//         .client-loader { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
//         .loader-spinner { width: 40px; height: 40px; border: 3px solid var(--border); border-top-color: var(--teal); border-radius: 50%; animation: spin 0.8s linear infinite; }
//         @keyframes spin { to { transform: rotate(360deg); } }
        
//         .modal-mask { display: flex; position: fixed; inset: 0; z-index: 2000; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 20px; }
//         .modal-box { background: var(--card-bg); border-radius: 24px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding: 28px; position: relative; }
//         .modal-box.large { max-width: 700px; }
//         .m-close { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
//         .m-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
//         .m-tab { padding: 8px 16px; background: var(--surface); border: none; border-radius: 40px; cursor: pointer; font-size: 14px; }
//         .m-tab.active { background: linear-gradient(135deg, #2ca6a4, #1a7a78); color: white; }
//         .m-tab-content { margin-top: 16px; }
//         .m-form { display: flex; flex-direction: column; gap: 16px; }
//         .m-form input, .m-form textarea, .m-form select { padding: 12px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; font-size: 14px; }
//         .btn-msub { padding: 14px; background: linear-gradient(135deg, #2ca6a4, #1a7a78); color: white; border: none; border-radius: 40px; font-weight: 700; cursor: pointer; width: 100%; }
//         .details-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
//         .detail-item { display: flex; flex-direction: column; gap: 4px; }
//         .detail-item label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--muted); }
//         .detail-item span { font-size: 14px; }
//         .detail-item.full-width { grid-column: 1 / -1; }
//         .form-row { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
//         .radio-label { display: flex; align-items: center; gap: 8px; cursor: pointer; }
//         .info-banner { display: flex; gap: 12px; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 8px; margin-bottom: 16px; font-size: 13px; }
//         .timeline-list { display: flex; flex-direction: column; gap: 16px; }
//         .timeline-item-small { display: flex; gap: 12px; }
//         .timeline-dot-small { width: 10px; height: 10px; border-radius: 50%; margin-top: 6px; }
//         .timeline-content-small { flex: 1; }
//         .timeline-header-small { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
//         .timeline-date { font-size: 11px; color: var(--muted); }
//         .timeline-note-small { font-size: 12px; color: var(--muted); margin-top: 4px; padding: 4px 8px; background: var(--surface); border-radius: 6px; }
//         .timeline-meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
//         .client-footer { text-align: center; padding: 24px 0; margin-top: 32px; border-top: 1px solid var(--border); font-size: 13px; color: var(--muted); }
//         .profile-info { display: flex; gap: 32px; flex-wrap: wrap; }
//         .profile-avatar-large { width: 100px; height: 100px; border-radius: 24px; background: linear-gradient(135deg, #2ca6a4, #34a853); display: flex; align-items: center; justify-content: center; overflow: hidden; }
//         .avatar-placeholder { font-size: 48px; font-weight: 700; color: white; }
//         .profile-details { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
//         .highlight { font-size: 24px; font-weight: 800; color: var(--teal); }
//         .amount-highlight { font-size: 24px; font-weight: 800; color: #10b981; }
//         .user-stats-summary { display: flex; gap: 16px; font-size: 13px; }
//         .user-stats-summary span { padding: 4px 12px; background: var(--surface); border-radius: 20px; }
//         .task-desc-cell { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .team-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
//         .project-badge { font-size: 11px; padding: 2px 8px; background: var(--surface); border-radius: 12px; }
//         .team-manager { font-size: 12px; color: var(--teal); margin-bottom: 12px; }
//         .team-members-list { display: flex; flex-wrap: wrap; gap: 8px; }
//         .department-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
//         .department-header h3 { margin: 0; font-size: 16px; }
//         .department-actions { display: flex; gap: 8px; }
//         .department-actions button { padding: 4px 8px; font-size: 11px; border-radius: 6px; background: var(--surface); border: 1px solid var(--border); cursor: pointer; }
//         .department-actions button.danger:hover { background: #ef4444; color: white; }
//         .department-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px; }
//         .client-card.pending { border-left: 3px solid #f59e0b; }
//         .client-icon { font-size: 32px; }
//         .client-details { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
//         .client-details div { margin-bottom: 4px; }
//         .tab-btn { padding: 6px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; cursor: pointer; }
//         .tab-btn.pending { background: rgba(245, 158, 11, 0.1); border-color: #f59e0b; color: #f59e0b; }
//         .header-tabs { display: flex; gap: 8px; }
//         .upload-section-small { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
//         .file-item-small { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--surface); border-radius: 8px; margin-bottom: 8px; }
//         .task-item-small { padding: 12px; background: var(--surface); border-radius: 8px; margin-bottom: 8px; }
//         .task-header-small { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
//         .task-meta-small { font-size: 11px; color: var(--muted); margin-bottom: 4px; }
//         .task-deadline-small { font-size: 11px; color: #f59e0b; }
//         .team-card-small { padding: 12px; background: var(--surface); border-radius: 12px; margin-bottom: 12px; }
//         .team-header-small { display: flex; justify-content: space-between; margin-bottom: 12px; }
//         .manager-badge { font-size: 11px; padding: 2px 8px; background: rgba(139, 92, 246, 0.1); border-radius: 12px; color: #8b5cf6; }
//         .team-members-list { display: flex; flex-direction: column; gap: 8px; }
//         .team-member-small { display: flex; align-items: center; gap: 10px; padding: 6px; }
//         .member-avatar-small { width: 32px; height: 32px; border-radius: 50%; background: var(--teal); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; }
//         .member-name-small { font-weight: 500; font-size: 13px; }
//         .member-role-small { font-size: 10px; color: var(--muted); }
//       `}</style>
//     </div>
//   );
// };

// export default HeadDirector;









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

// interface DepartmentKPI {
//   departmentId: number;
//   departmentName: string;
//   employeeCount: number;
//   managerCount: number;
//   projectCount: number;
//   completedProjects: number;
//   completionRate: number;
// }

// interface CompanyKPIs {
//   companySummary: {
//     totalEmployees: number;
//     totalManagers: number;
//     totalConsultants: number;
//     totalClients: number;
//     totalProjects: number;
//     completedProjects: number;
//     inProgressProjects: number;
//     pendingProjects: number;
//     overallProjectCompletionRate: number;
//     totalRevenue: number;
//     totalExpenses: number;
//     netProfit: number;
//   };
//   departmentKPISummary: DepartmentKPI[];
//   monthlyTrends: Array<{
//     month: string;
//     newEmployees: number;
//     newClients: number;
//     newProjects: number;
//     projectsCompleted: number;
//     revenue: number;
//     expenses: number;
//   }>;
//   recentActivities: Array<{
//     activityType: string;
//     description: string;
//     userName: string;
//     departmentName: string;
//     activityTime: string;
//   }>;
//   topPerformers: {
//     topEmployees: Array<{
//       userId: number;
//       name: string;
//       position: string;
//       department: string;
//       tasksCompleted: number;
//       averageRating: number;
//     }>;
//     topClients: Array<{
//       clientId: number;
//       companyName: string;
//       totalProjects: number;
//       totalSpent: number;
//     }>;
//     topDepartments: Array<{
//       departmentId: number;
//       departmentName: string;
//       completionRate: number;
//       revenue: number;
//     }>;
//   };
//   financialSummary: {
//     totalRevenue: number;
//     totalExpenses: number;
//     netProfit: number;
//     profitMargin: number;
//     paymentBreakdown: Array<{
//       type: string;
//       amount: number;
//       count: number;
//     }>;
//   };
// }

// interface User {
//   userId: number;
//   name: string;
//   email: string;
//   roles: string[];
//   department: string;
//   position: string | null;
//   isActive: boolean;
//   joinedAt?: string;
// }

// interface UsersResponse {
//   users: User[];
//   totalCount: number;
//   employeeCount: number;
//   consultantCount: number;
//   clientCount: number;
// }

// interface Consultant {
//   consultantId: number;
//   userId: number;
//   name: string;
//   email: string;
//   skill: string;
//   experience: string;
//   currentStatus: string;
//   departmentId: number;
//   departmentName: string;
//   isApproved: string;
// }

// interface Employee {
//   employeeId: number;
//   userId: number;
//   name: string;
//   positionName: string;
//   departmentId: number;
//   departmentName: string;
// }

// interface Manager {
//   managerId: number;
//   name: string;
//   email: string;
//   departmentId: number;
//   departmentName: string;
//   positionName: string;
//   totalProjectsAssigned: number;
//   totalProjectsCompleted: number;
// }

// interface Client {
//   id: number;
//   companyName: string;
//   companyEmail: string;
//   isApproved: boolean;
//   clientStatus: string;
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

// interface Department {
//   departmentId: number;
//   departmentName: string;
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
//   console.log(`API ${method} ${endpoint} response:`, response.data);
//   return response.data;
// };

// // ============================================
// // HEAD DIRECTOR APIs
// // ============================================

// const headDirectorApi = {
//   checkCoreDirector: () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/core-director/check'),
//   getStats: () => apiCall<{ success: boolean; data: DashboardStats }>('GET', '/api/core-director/dashboard/stats'),
//   checkHeadDirector: () => apiCall<{ success: boolean; data: boolean }>('GET', '/api/head-director/check'),
//   getAllUsers: () => apiCall<{ success: boolean; data: UsersResponse }>('GET', '/api/head-director/users'),
//   getUserById: (userId: number) => apiCall<{ success: boolean; data: User }>('GET', `/api/head-director/users/${userId}`),
//   getDepartmentsKPIs: () => apiCall<{ success: boolean; data: DepartmentKPI[] }>('GET', '/api/head-director/departments/kpis'),
//   getAllProjects: () => apiCall<{ success: boolean; data: Project[] }>('GET', '/api/head-director/projects'),
//   getProjectsByDepartment: (departmentId: number) => apiCall<{ success: boolean; data: Project[] }>('GET', `/api/head-director/projects/department/${departmentId}`),
//   getProjectsByStatus: (status: string) => apiCall<{ success: boolean; data: Project[] }>('GET', `/api/head-director/projects/status/${status}`),
//   getAllConsultants: () => apiCall<{ success: boolean; data: Consultant[] }>('GET', '/api/head-director/consultants'),
//   getAllClients: () => apiCall<{ success: boolean; data: Client[] }>('GET', '/api/head-director/clients'),
//   getAllEmployees: () => apiCall<{ success: boolean; data: Employee[] }>('GET', '/api/head-director/employees'),
//   getAllManagers: () => apiCall<{ success: boolean; data: Manager[] }>('GET', '/api/head-director/managers'),
//   getDepartmentStats: (departmentId: number) => apiCall<{ success: boolean; data: DepartmentKPI }>('GET', `/api/head-director/department/${departmentId}/stats`),
//   getCompanyKPIs: () => apiCall<{ success: boolean; data: CompanyKPIs }>('GET', '/api/head-director/dashboard/kpis'),
//   createDepartment: (departmentName: string) => apiCall<{ success: boolean; message: string; data: Department }>('POST', '/api/department', { departmentName }),
//   updateDepartment: (departmentId: number, departmentName: string) => apiCall('PUT', `/api/department/${departmentId}`, { departmentName }),
//   deleteDepartment: (departmentId: number) => apiCall('DELETE', `/api/department/${departmentId}`),
//   getAllDepartments: () => apiCall<{ success: boolean; data: Department[] }>('GET', '/api/department'),
//   getDepartmentById: (departmentId: number) => apiCall<{ success: boolean; data: Department }>('GET', `/api/department/${departmentId}`),
//   getAllEmailRecipients: () => apiCall<{ success: boolean; data: EmailRecipient[] }>('GET', '/api/email/recipients/all-users'),
//   sendEmail: (userIds: number[], subject: string, message: string, messageType: string) =>
//     apiCall('POST', '/api/email/send', { userIds, subject, message, messageType }),
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

// // ============================================
// // SIDEBAR MENU ITEMS
// // ============================================

// const menuItems = [
//   { id: 'dashboard', label: 'Dashboard', icon: '📊' },
//   { id: 'users', label: 'All Users', icon: '👥' },
//   { id: 'departments', label: 'Departments', icon: '🏢' },
//   { id: 'projects', label: 'All Projects', icon: '📁' },
//   { id: 'consultants', label: 'Consultants', icon: '👨‍💻' },
//   { id: 'employees', label: 'Employees', icon: '👔' },
//   { id: 'managers', label: 'Managers', icon: '📋' },
//   { id: 'clients', label: 'Clients', icon: '🤝' },
//   { id: 'email', label: 'Send Email', icon: '✉️' },
//   { id: 'profile', label: 'Profile', icon: '👤' },
// ];

// // ============================================
// // MAIN COMPONENT
// // ============================================

// const HeadDirectorDashboard: React.FC = () => {
//   const [activeNav, setActiveNav] = useState('dashboard');
//   const [loading, setLoading] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
  
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [companyKpis, setCompanyKpis] = useState<CompanyKPIs | null>(null);
//   const [usersData, setUsersData] = useState<UsersResponse | null>(null);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [departmentKpis, setDepartmentKpis] = useState<DepartmentKPI[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [consultants, setConsultants] = useState<Consultant[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [managers, setManagers] = useState<Manager[]>([]);
//   const [clients, setClients] = useState<Client[]>([]);
//   const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([]);
  
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [showDepartmentModal, setShowDepartmentModal] = useState(false);
//   const [showDeleteDeptModal, setShowDeleteDeptModal] = useState(false);
//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState<{ show: boolean; action: () => void; message: string }>({ show: false, action: () => {}, message: '' });
//   const [actionLoading, setActionLoading] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
//   const [departmentForm, setDepartmentForm] = useState({ name: '' });
//   const [emailData, setEmailData] = useState({ userIds: [] as number[], subject: '', message: '', messageType: 'INFORMATION' });
//   const [profileData, setProfileData] = useState({ name: '', phoneNumber: '', address: '', gender: '', dob: '' });
//   const [selectedFilterDept, setSelectedFilterDept] = useState<number>(0);
//   const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');

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
//         usersRes,
//         departmentsRes,
//         deptKpisRes,
//         projectsRes,
//         consultantsRes,
//         employeesRes,
//         managersRes,
//         clientsRes,
//       ] = await Promise.all([
//         headDirectorApi.getUserProfile().catch(() => ({ data: null })),
//         headDirectorApi.getStats().catch(() => ({ data: null })),
//         headDirectorApi.getCompanyKPIs().catch(() => ({ data: null })),
//         headDirectorApi.getAllUsers().catch(() => ({ data: null })),
//         headDirectorApi.getAllDepartments().catch(() => ({ data: [] })),
//         headDirectorApi.getDepartmentsKPIs().catch(() => ({ data: [] })),
//         headDirectorApi.getAllProjects().catch(() => ({ data: [] })),
//         headDirectorApi.getAllConsultants().catch(() => ({ data: [] })),
//         headDirectorApi.getAllEmployees().catch(() => ({ data: [] })),
//         headDirectorApi.getAllManagers().catch(() => ({ data: [] })),
//         headDirectorApi.getAllClients().catch(() => ({ data: [] })),
//       ]);

//       setUser(profileRes.data);
//       setStats(statsRes.data);
//       setCompanyKpis(kpisRes.data);
//       setUsersData(usersRes.data);
//       setDepartments(departmentsRes.data);
//       setDepartmentKpis(deptKpisRes.data);
//       setProjects(projectsRes.data);
//       setConsultants(consultantsRes.data);
//       setEmployees(employeesRes.data);
//       setManagers(managersRes.data);
//       setClients(clientsRes.data);
//     } catch (error) {
//       console.error('Error loading dashboard:', error);
//       showMessage('error', 'Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadEmailRecipients = async () => {
//     try {
//       const res = await headDirectorApi.getAllEmailRecipients();
//       setEmailRecipients(res.data);
//     } catch (error) {
//       console.error('Error loading recipients:', error);
//     }
//   };

//   const handleCreateDepartment = async () => {
//     if (!departmentForm.name) {
//       showMessage('error', 'Please enter department name');
//       return;
//     }
//     setActionLoading(true);
//     try {
//       await headDirectorApi.createDepartment(departmentForm.name);
//       showMessage('success', 'Department created successfully');
//       setShowDepartmentModal(false);
//       setDepartmentForm({ name: '' });
//       loadDashboardData();
//     } catch (error) {
//       console.error('Error creating department:', error);
//       showMessage('error', 'Failed to create department');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleUpdateDepartment = async () => {
//     if (!selectedDepartment || !departmentForm.name) {
//       showMessage('error', 'Please enter department name');
//       return;
//     }
//     setActionLoading(true);
//     try {
//       await headDirectorApi.updateDepartment(selectedDepartment.departmentId, departmentForm.name);
//       showMessage('success', 'Department updated successfully');
//       setShowDepartmentModal(false);
//       setSelectedDepartment(null);
//       setDepartmentForm({ name: '' });
//       loadDashboardData();
//     } catch (error) {
//       console.error('Error updating department:', error);
//       showMessage('error', 'Failed to update department');
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDeleteDepartment = async () => {
//     if (!selectedDepartment) return;
//     setActionLoading(true);
//     try {
//       await headDirectorApi.deleteDepartment(selectedDepartment.departmentId);
//       showMessage('success', 'Department deleted successfully');
//       setShowDeleteDeptModal(false);
//       setSelectedDepartment(null);
//       loadDashboardData();
//     } catch (error) {
//       console.error('Error deleting department:', error);
//       showMessage('error', 'Failed to delete department');
//     } finally {
//       setActionLoading(false);
//     }
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
//       await headDirectorApi.sendEmail(emailData.userIds, emailData.subject, emailData.message, emailData.messageType);
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
//       await headDirectorApi.updateUserProfile(profileData);
//       const profileRes = await headDirectorApi.getUserProfile();
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

//   const filteredProjects = projects.filter(project => {
//     if (selectedFilterDept && project.departmentId !== selectedFilterDept) return false;
//     if (selectedStatusFilter && project.status !== selectedStatusFilter) return false;
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
//       {message && (
//         <div className={`toast-message ${message.type}`}>
//           {message.type === 'success' ? '✅' : '❌'} {message.text}
//         </div>
//       )}

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
//         title="Head Director"
//         logoIcon="👑"
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
//                 <h1>Welcome back, {user?.name?.split(' ')[0] || 'Head Director'}!</h1>
//                 <p>Company-Wide Dashboard - Complete Overview</p>
//               </div>
//             </header>

//             {stats && (
//               <div className="stats-grid">
//                 <div className="stat-card"><div className="stat-icon blue">📊</div><div className="stat-info"><span className="stat-value">{stats.totalProjects}</span><span className="stat-label">Head Projects</span></div></div>
//                 <div className="stat-card"><div className="stat-icon orange">⏳</div><div className="stat-info"><span className="stat-value">{stats.pendingProjects}</span><span className="stat-label">Pending</span></div></div>
//                 <div className="stat-card"><div className="stat-icon purple">🔄</div><div className="stat-info"><span className="stat-value">{stats.inProgressProjects}</span><span className="stat-label">In Progress</span></div></div>
//                 <div className="stat-card"><div className="stat-icon green">✅</div><div className="stat-info"><span className="stat-value">{stats.completedProjects}</span><span className="stat-label">Completed</span></div></div>
//               </div>
//             )}

//             {companyKpis && (
//               <>
//                 <div className="dashboard-card">
//                   <div className="card-header"><h2>🏢 Company Summary</h2></div>
//                   <div className="stats-grid">
//                     <div className="stat-card"><div className="stat-icon cyan">👥</div><div className="stat-info"><span className="stat-value">{companyKpis.companySummary.totalEmployees}</span><span className="stat-label">Employees</span></div></div>
//                     <div className="stat-card"><div className="stat-icon teal">📋</div><div className="stat-info"><span className="stat-value">{companyKpis.companySummary.totalManagers}</span><span className="stat-label">Managers</span></div></div>
//                     <div className="stat-card"><div className="stat-icon purple">👨‍💻</div><div className="stat-info"><span className="stat-value">{companyKpis.companySummary.totalConsultants}</span><span className="stat-label">Consultants</span></div></div>
//                     <div className="stat-card"><div className="stat-icon blue">🤝</div><div className="stat-info"><span className="stat-value">{companyKpis.companySummary.totalClients}</span><span className="stat-label">Clients</span></div></div>
//                     <div className="stat-card"><div className="stat-icon orange">📁</div><div className="stat-info"><span className="stat-value">{companyKpis.companySummary.totalProjects}</span><span className="stat-label">Total Projects</span></div></div>
//                     <div className="stat-card"><div className="stat-icon green">✅</div><div className="stat-info"><span className="stat-value">{companyKpis.companySummary.completedProjects}</span><span className="stat-label">Completed</span></div></div>
//                     <div className="stat-card"><div className="stat-icon purple">🔄</div><div className="stat-info"><span className="stat-value">{companyKpis.companySummary.inProgressProjects}</span><span className="stat-label">In Progress</span></div></div>
//                     <div className="stat-card"><div className="stat-icon orange">⏳</div><div className="stat-info"><span className="stat-value">{companyKpis.companySummary.pendingProjects}</span><span className="stat-label">Pending</span></div></div>
//                   </div>
//                 </div>

//                 <div className="dashboard-card">
//                   <div className="card-header"><h2>💰 Financial Summary</h2></div>
//                   <div className="stats-grid">
//                     <div className="stat-card"><div className="stat-icon green">📈</div><div className="stat-info"><span className="stat-value">₹{companyKpis.financialSummary.totalRevenue.toLocaleString()}</span><span className="stat-label">Revenue</span></div></div>
//                     <div className="stat-card"><div className="stat-icon red">📉</div><div className="stat-info"><span className="stat-value">₹{companyKpis.financialSummary.totalExpenses.toLocaleString()}</span><span className="stat-label">Expenses</span></div></div>
//                     <div className="stat-card"><div className="stat-icon purple">💵</div><div className="stat-info"><span className="stat-value">₹{companyKpis.financialSummary.netProfit.toLocaleString()}</span><span className="stat-label">Net Profit</span></div></div>
//                     <div className="stat-card"><div className="stat-icon blue">📊</div><div className="stat-info"><span className="stat-value">{companyKpis.financialSummary.profitMargin}%</span><span className="stat-label">Profit Margin</span></div></div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </>
//         )}

//         {/* Users Tab */}
//         {activeNav === 'users' && usersData && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>All Users ({usersData.totalCount})</h2>
//               <div className="header-stats">
//                 <span className="badge">👥 Employees: {usersData.employeeCount}</span>
//                 <span className="badge">👨‍💻 Consultants: {usersData.consultantCount}</span>
//                 <span className="badge">🤝 Clients: {usersData.clientCount}</span>
//               </div>
//             </div>
//             <div className="users-table">
//               <table className="data-table">
//                 <thead>
//                   <tr><th>Name</th><th>Email</th><th>Roles</th><th>Department</th><th>Position</th><th>Status</th><th>Actions</th></tr>
//                 </thead>
//                 <tbody>
//                   {usersData.users.map((userItem) => (
//                     <tr key={userItem.userId}>
//                       <td><strong>{userItem.name}</strong></td>
//                       <td>{userItem.email}</td>
//                       <td>{userItem.roles.join(', ')}</td>
//                       <td>{userItem.department}</td>
//                       <td>{userItem.position || '—'}</td>
//                       <td>{userItem.isActive ? <span className="status-badge status-active">Active</span> : <span className="status-badge status-inactive">Inactive</span>}</td>
//                       <td><button className="btn-icon" onClick={() => { setSelectedUser(userItem); setShowUserModal(true); }}>👁️</button></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Departments Tab */}
//         {activeNav === 'departments' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>Departments</h2>
//               <button className="btn-primary" onClick={() => { setSelectedDepartment(null); setDepartmentForm({ name: '' }); setShowDepartmentModal(true); }}>+ New Department</button>
//             </div>
//             <div className="departments-grid">
//               {departments.map((dept) => (
//                 <div key={dept.departmentId} className="department-card">
//                   <div className="department-header">
//                     <h3>{dept.departmentName}</h3>
//                     <div className="department-actions">
//                       <button className="btn-icon" onClick={() => { setSelectedDepartment(dept); setDepartmentForm({ name: dept.departmentName }); setShowDepartmentModal(true); }}>✏️</button>
//                       {dept.departmentId > 5 && (
//                         <button className="btn-icon danger" onClick={() => { setSelectedDepartment(dept); setShowDeleteDeptModal(true); }}>🗑️</button>
//                       )}
//                     </div>
//                   </div>
//                   <div className="department-stats">
//                     {departmentKpis.find((k) => k.departmentId === dept.departmentId) && (
//                       <>
//                         <div className="dept-stat-item">
//                           <label>Employees</label>
//                           <span>{departmentKpis.find((k) => k.departmentId === dept.departmentId)?.employeeCount || 0}</span>
//                         </div>
//                         <div className="dept-stat-item">
//                           <label>Projects</label>
//                           <span>{departmentKpis.find((k) => k.departmentId === dept.departmentId)?.projectCount || 0}</span>
//                         </div>
//                         <div className="dept-stat-item">
//                           <label>Completion Rate</label>
//                           <span>{departmentKpis.find((k) => k.departmentId === dept.departmentId)?.completionRate || 0}%</span>
//                         </div>
//                       </>
//                     )}
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
//               <h2>All Projects ({projects.length})</h2>
//               <div className="header-filters">
//                 <select value={selectedFilterDept} onChange={(e) => setSelectedFilterDept(Number(e.target.value))} className="filter-select">
//                   <option value={0}>All Departments</option>
//                   {departments.map((dept) => <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>)}
//                 </select>
//                 <select value={selectedStatusFilter} onChange={(e) => setSelectedStatusFilter(e.target.value)} className="filter-select">
//                   <option value="">All Status</option>
//                   <option value="PENDING">Pending</option>
//                   <option value="ASSIGNED">Assigned</option>
//                   <option value="IN_PROGRESS">In Progress</option>
//                   <option value="COMPLETED">Completed</option>
//                   <option value="REJECTED">Rejected</option>
//                 </select>
//               </div>
//             </div>
//             <div className="projects-grid">
//               {filteredProjects.map((project) => (
//                 <div key={project.projectId} className="project-card">
//                   <div className="project-card-header"><h3>{project.projectName}</h3>{getStatusBadge(project.status)}</div>
//                   <p className="project-card-desc">{project.projectDescription?.substring(0, 80)}...</p>
//                   <div className="project-card-meta">
//                     <span>🏢 {project.departmentName}</span>
//                     <span>👥 {project.clientName}</span>
//                     <span>📱 {project.projectType}</span>
//                     {project.deadline && <span>📅 Due: {new Date(project.deadline).toLocaleDateString()}</span>}
//                   </div>
//                   <div className="project-card-manager">👔 Manager: {project.assignedManagerName || 'Not assigned'}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Consultants Tab */}
//         {activeNav === 'consultants' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>All Consultants ({consultants.length})</h2></div>
//             <div className="consultants-table">
//               <table className="data-table">
//                 <thead>
//                   <tr><th>Name</th><th>Email</th><th>Skills</th><th>Experience</th><th>Department</th><th>Status</th></tr>
//                 </thead>
//                 <tbody>
//                   {consultants.map((consultant) => (
//                     <tr key={consultant.consultantId}>
//                       <td><strong>{consultant.name}</strong></td>
//                       <td>{consultant.email}</td>
//                       <td className="skills-cell">{consultant.skill?.substring(0, 50)}...</td>
//                       <td>{consultant.experience}</td>
//                       <td>{consultant.departmentName}</td>
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
//             <div className="card-header"><h2>All Employees ({employees.length})</h2></div>
//             <div className="employees-grid">
//               {employees.map((employee) => (
//                 <div key={employee.employeeId} className="employee-card">
//                   <div className="employee-header">
//                     <div className="employee-icon">👔</div>
//                     <div><h3>{employee.name}</h3><p>{employee.positionName}</p></div>
//                   </div>
//                   <div className="employee-details">
//                     <div className="detail-row"><label>Department</label><span>{employee.departmentName}</span></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Managers Tab */}
//         {activeNav === 'managers' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>All Managers ({managers.length})</h2></div>
//             <div className="managers-grid">
//               {managers.map((manager) => (
//                 <div key={manager.managerId} className="manager-card">
//                   <div className="manager-header"><h3>{manager.name}</h3><p>{manager.positionName}</p></div>
//                   <div className="manager-stats">
//                     <div className="stat"><label>Department</label><span>{manager.departmentName}</span></div>
//                     <div className="stat"><label>Projects Assigned</label><span>{manager.totalProjectsAssigned}</span></div>
//                     <div className="stat"><label>Projects Completed</label><span>{manager.totalProjectsCompleted}</span></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Clients Tab */}
//         {activeNav === 'clients' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header"><h2>All Clients ({clients.length})</h2></div>
//             <div className="clients-table">
//               <table className="data-table">
//                 <thead>
//                   <tr><th>Company Name</th><th>Email</th><th>Status</th></tr>
//                 </thead>
//                 <tbody>
//                   {clients.map((client) => (
//                     <tr key={client.id}>
//                       <td><strong>{client.companyName}</strong></td>
//                       <td>{client.companyEmail}</td>
//                       <td>{client.isApproved ? <span className="status-badge status-active">Active</span> : <span className="status-badge status-pending">Pending</span>}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
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
//               <p>As Head Director, you can send emails to:</p>
//               <ul>
//                 <li>✅ All Directors (Head, HR, Finance, BDE)</li>
//                 <li>✅ All Managers across all departments</li>
//                 <li>✅ All Employees company-wide</li>
//                 <li>✅ All Consultants</li>
//                 <li>✅ All Clients</li>
//                 <li>✅ Any combination of users</li>
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
//                 {user?.photoUrl ? <img src={user.photoUrl} alt={user.name} /> : <div className="avatar-placeholder">{user?.name?.charAt(0) || 'H'}</div>}
//               </div>
//               <div className="profile-details">
//                 <div className="detail-item"><label>Full Name</label><span>{user?.name}</span></div>
//                 <div className="detail-item"><label>Email</label><span>{user?.email}</span></div>
//                 <div className="detail-item"><label>Phone</label><span>{user?.phoneNumber || 'Not provided'}</span></div>
//                 <div className="detail-item"><label>Address</label><span>{user?.address || 'Not provided'}</span></div>
//                 <div className="detail-item"><label>Gender</label><span>{user?.gender || 'Not provided'}</span></div>
//                 <div className="detail-item"><label>Role</label><span>Head Director</span></div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       {/* User Detail Modal */}
//       {showUserModal && selectedUser && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => { setShowUserModal(false); setSelectedUser(null); }}>✕</button>
//             <h2>{selectedUser.name}</h2>
//             <p className="modal-sub">{selectedUser.email}</p>
//             <div className="detail-grid">
//               <div><label>Roles</label><span>{selectedUser.roles.join(', ')}</span></div>
//               <div><label>Department</label><span>{selectedUser.department}</span></div>
//               <div><label>Position</label><span>{selectedUser.position || '—'}</span></div>
//               <div><label>Status</label><span>{selectedUser.isActive ? 'Active' : 'Inactive'}</span></div>
//               {selectedUser.joinedAt && <div><label>Joined At</label><span>{new Date(selectedUser.joinedAt).toLocaleDateString()}</span></div>}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Department Modal */}
//       {showDepartmentModal && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => { setShowDepartmentModal(false); setSelectedDepartment(null); setDepartmentForm({ name: '' }); }}>✕</button>
//             <h2>{selectedDepartment ? 'Edit Department' : 'Create Department'}</h2>
//             <div className="m-form">
//               <input placeholder="Department Name" value={departmentForm.name} onChange={(e) => setDepartmentForm({ name: e.target.value })} />
//               <button className="btn-msub" onClick={() => showConfirmation(selectedDepartment ? 'Update this department?' : 'Create this department?', selectedDepartment ? handleUpdateDepartment : handleCreateDepartment)} disabled={actionLoading}>
//                 {actionLoading ? 'Saving...' : (selectedDepartment ? 'Update' : 'Create')}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Department Modal */}
//       {showDeleteDeptModal && selectedDepartment && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => { setShowDeleteDeptModal(false); setSelectedDepartment(null); }}>✕</button>
//             <h2>Delete Department</h2>
//             <p>Are you sure you want to delete <strong>{selectedDepartment.departmentName}</strong>?</p>
//             <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: '0.5rem' }}>This action cannot be undone!</p>
//             <div className="modal-actions" style={{ marginTop: '1rem' }}>
//               <button className="btn-outline" onClick={() => setShowDeleteDeptModal(false)}>Cancel</button>
//               <button className="btn-danger" onClick={() => showConfirmation(`Delete ${selectedDepartment.departmentName}?`, handleDeleteDepartment)} disabled={actionLoading}>
//                 {actionLoading ? 'Deleting...' : 'Delete Department'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Email Modal */}
//       {showEmailModal && (
//         <div className="modal-mask open">
//           <div className="modal-box large">
//             <button className="m-close" onClick={() => { setShowEmailModal(false); setEmailData({ userIds: [], subject: '', message: '', messageType: 'INFORMATION' }); }}>✕</button>
//             <h2>Send Email</h2>
//             <div className="m-form">
//               <select multiple size={5} value={emailData.userIds.map(String)} onChange={(e) => {
//                 const selected = Array.from(e.target.selectedOptions, (opt) => parseInt(opt.value));
//                 setEmailData({ ...emailData, userIds: selected });
//               }}>
//                 {emailRecipients.map((recipient) => (
//                   <option key={recipient.userId} value={recipient.userId}>
//                     {recipient.name} - {recipient.email} ({recipient.role})
//                   </option>
//                 ))}
//               </select>
//               <p className="muted-text">Hold Ctrl/Cmd to select multiple recipients</p>
//               <input placeholder="Subject" value={emailData.subject} onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })} />
//               <textarea rows={5} placeholder="Message" value={emailData.message} onChange={(e) => setEmailData({ ...emailData, message: e.target.value })} />
//               <select value={emailData.messageType} onChange={(e) => setEmailData({ ...emailData, messageType: e.target.value })}>
//                 <option value="INFORMATION">Information</option>
//                 <option value="IMPORTANT">Important</option>
//                 <option value="URGENT">Urgent</option>
//                 <option value="ALERT">Alert</option>
//                 <option value="MEETING">Meeting</option>
//                 <option value="TASK">Task</option>
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
//               <input placeholder="Full Name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
//               <input placeholder="Phone Number" value={profileData.phoneNumber} onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })} />
//               <textarea placeholder="Address" rows={2} value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} />
//               <select value={profileData.gender} onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}>
//                 <option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
//               </select>
//               <input type="date" value={profileData.dob} onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })} />
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

// export default HeadDirectorDashboard;