// // 'use client';

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useAuth } from '@/contexts/AuthContext';

// // // ============================================
// // // TYPES (based on API documentation)
// // // ============================================

// // interface Consultant {
// //   consultantId: number;
// //   userId: number;
// //   name: string;
// //   email: string;
// //   photoUrl: string | null;
// //   skill: string;
// //   experience: string;
// //   currentStatus: string;
// //   departmentId: number;
// //   departmentName: string;
// //   isApproved: string;
// // }

// // interface StatusHistoryEntry {
// //   statusId: number;
// //   status: string;
// //   note: string;
// //   dateTime: string;
// // }

// // interface ConsultantDetail extends Consultant {
// //   // Additional fields for single consultant view
// // }

// // interface Employee {
// //   employeeId: number;
// //   userId: number;
// //   name: string;
// //   email: string;
// //   photoUrl: string | null;
// //   phoneNumber: string;
// //   address: string;
// //   gender: string;
// //   isDirectorVerified: boolean;
// //   positionName: string;
// //   salary: number;
// //   department: string;
// //   skillSet: string;
// //   departmentId: number;
// //   departmentName: string;
// // }

// // interface Project {
// //   projectId: number;
// //   projectName: string;
// //   projectDescription: string;
// //   projectType: string;
// //   status: string;
// //   departmentId: number;
// //   departmentName: string;
// //   clientId: number;
// //   clientName: string;
// //   clientEmail: string;
// //   assignedManagerId: number;
// //   assignedManagerName: string;
// //   deadline: string;
// //   cost: string;
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // interface Task {
// //   taskId: number;
// //   description: string;
// //   status: string;
// //   assignedToUserId: number;
// //   assignedToUserName: string;
// //   assignedToDepartment: string;
// //   createdByUserId: number;
// //   createdByName: string;
// //   deadline: string;
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // interface DashboardKPIs {
// //   totalConsultants: number;
// //   pendingConsultants: number;
// //   totalEmployees: number;
// //   totalProjects: number;
// //   totalTasks: number;
// //   totalDepartments: number;
// //   consultantsByStatus: Record<string, number>;
// //   consultantsByDepartment: Record<string, number>;
// //   employeesByDepartment: Record<string, number>;
// //   projectsByStatus: Record<string, number>;
// //   tasksByStatus: Record<string, number>;
// //   pendingTasks: number;
// //   inProgressTasks: number;
// //   completedTasks: number;
// //   conversionRate: number;
// // }

// // interface AssignTaskData {
// //   assignedToUserId: number;
// //   description: string;
// //   deadline: string;
// // }

// // interface UpdateStatusData {
// //   status: string;
// //   note: string;
// // }

// // interface ConvertToEmployeeData {
// //   positionName: string;
// //   salary: number;
// //   skillSet: string;
// //   departmentId: number;
// // }

// // // ============================================
// // // API CONFIGURATION
// // // ============================================

// // const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// // const apiCall = async <T,>(
// //   method: string,
// //   endpoint: string,
// //   data?: any,
// //   headers?: Record<string, string>
// // ): Promise<T> => {
// //   try {
// //     const config: any = {
// //       method,
// //       url: `${API_BASE}${endpoint}`,
// //       withCredentials: true,
// //       headers: {
// //         'Content-Type': 'application/json',
// //         ...headers,
// //       },
// //     };

// //     if (data) {
// //       config.data = data;
// //     }

// //     const response = await axios(config);
// //     return response.data;
// //   } catch (error: any) {
// //     throw error.response?.data || error;
// //   }
// // };

// // // ============================================
// // // API FUNCTIONS
// // // ============================================

// // // Auth
// // const checkHRAccess = async (userId: string) => {
// //   return apiCall<{ success: boolean; message: string; data: boolean }>(
// //     'GET',
// //     `/api/hr-director/check?userId=${userId}`
// //   );
// // };

// // // Consultant Management
// // const getAllConsultants = async () => {
// //   return apiCall<{ success: boolean; message: string; data: Consultant[] }>(
// //     'GET',
// //     '/api/hr-director/consultants'
// //   );
// // };

// // const getConsultantById = async (consultantId: number) => {
// //   return apiCall<{ success: boolean; message: string; data: ConsultantDetail }>(
// //     'GET',
// //     `/api/hr-director/consultants/${consultantId}`
// //   );
// // };

// // const getConsultantStatusHistory = async (consultantId: number) => {
// //   return apiCall<{ success: boolean; message: string; data: StatusHistoryEntry[] }>(
// //     'GET',
// //     `/api/hr-director/consultants/${consultantId}/status-history`
// //   );
// // };

// // const updateConsultantStatus = async (consultantId: number, status: string, note: string) => {
// //   return apiCall<{ success: boolean; message: string; data: any }>(
// //     'PUT',
// //     `/api/hr-director/consultants/${consultantId}/status`,
// //     { status, note }
// //   );
// // };

// // const assignDepartmentToConsultant = async (consultantId: number, departmentId: number) => {
// //   return apiCall<{ success: boolean; message: string; data: Consultant }>(
// //     'PUT',
// //     `/api/hr-director/consultants/${consultantId}/assign-department`,
// //     { departmentId }
// //   );
// // };

// // const convertConsultantToEmployee = async (consultantId: number, data: ConvertToEmployeeData) => {
// //   return apiCall<{ success: boolean; message: string; data: Employee }>(
// //     'POST',
// //     `/api/hr-director/consultants/${consultantId}/convert-to-employee`,
// //     data
// //   );
// // };

// // // Employee Management
// // const getAllEmployees = async () => {
// //   return apiCall<{ success: boolean; message: string; data: Employee[] }>(
// //     'GET',
// //     '/api/hr-director/employees'
// //   );
// // };

// // const getEmployeeById = async (employeeId: number) => {
// //   return apiCall<{ success: boolean; message: string; data: Employee }>(
// //     'GET',
// //     `/api/hr-director/employees/${employeeId}`
// //   );
// // };

// // const updateEmployee = async (employeeId: number, data: Partial<Employee>) => {
// //   return apiCall<{ success: boolean; message: string; data: Employee }>(
// //     'PUT',
// //     `/api/hr-director/employees/${employeeId}`,
// //     data
// //   );
// // };

// // // Project Management
// // const getAllProjects = async () => {
// //   return apiCall<{ success: boolean; message: string; data: Project[] }>(
// //     'GET',
// //     '/api/hr-director/projects'
// //   );
// // };

// // const getProjectById = async (projectId: number) => {
// //   return apiCall<{ success: boolean; message: string; data: Project }>(
// //     'GET',
// //     `/api/hr-director/projects/${projectId}`
// //   );
// // };

// // // Task Management
// // const assignTask = async (data: AssignTaskData) => {
// //   return apiCall<{ success: boolean; message: string; data: Task }>(
// //     'POST',
// //     '/api/hr-director/tasks/assign',
// //     data
// //   );
// // };

// // const getAllTasks = async () => {
// //   return apiCall<{ success: boolean; message: string; data: Task[] }>(
// //     'GET',
// //     '/api/hr-director/tasks'
// //   );
// // };

// // const getTasksByEmployee = async (employeeUserId: number) => {
// //   return apiCall<{ success: boolean; message: string; data: Task[] }>(
// //     'GET',
// //     `/api/hr-director/tasks/employee/${employeeUserId}`
// //   );
// // };

// // const updateTaskStatus = async (taskId: number, status: string, note: string) => {
// //   return apiCall<{ success: boolean; message: string; data: Task }>(
// //     'PUT',
// //     `/api/hr-director/tasks/${taskId}/status`,
// //     { status, note }
// //   );
// // };

// // // Dashboard
// // const getDashboardKPIs = async () => {
// //   return apiCall<{ success: boolean; message: string; data: DashboardKPIs }>(
// //     'GET',
// //     '/api/hr-director/dashboard/kpis'
// //   );
// // };

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

// // const formatDate = (dateString: string) => {
// //   try {
// //     return new Date(dateString).toLocaleString();
// //   } catch {
// //     return dateString;
// //   }
// // };

// // const formatCurrency = (amount: number) => {
// //   return new Intl.NumberFormat('en-IN', {
// //     style: 'currency',
// //     currency: 'INR',
// //     maximumFractionDigits: 0,
// //   }).format(amount);
// // };

// // // ============================================
// // // MAIN HR DIRECTOR COMPONENT
// // // ============================================

// // const HRDirectorDashboard: React.FC = () => {
// //   const { user, logout } = useAuth();
// //   const [loading, setLoading] = useState(true);
// //   const [hasAccess, setHasAccess] = useState(false);
// //   const [accessError, setAccessError] = useState<string | null>(null);
// //   const [activeTab, setActiveTab] = useState('dashboard');

// //   // Data states
// //   const [dashboardData, setDashboardData] = useState<DashboardKPIs | null>(null);
// //   const [consultants, setConsultants] = useState<Consultant[]>([]);
// //   const [employees, setEmployees] = useState<Employee[]>([]);
// //   const [projects, setProjects] = useState<Project[]>([]);
// //   const [tasks, setTasks] = useState<Task[]>([]);

// //   // Selected item states
// //   const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
// //   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
// //   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
// //   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
// //   const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);

// //   // Modal states
// //   const [showConsultantDetailModal, setShowConsultantDetailModal] = useState(false);
// //   const [showEmployeeDetailModal, setShowEmployeeDetailModal] = useState(false);
// //   const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
// //   const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
// //   const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
// //   const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
// //   const [showConvertModal, setShowConvertModal] = useState(false);
// //   const [showAssignDepartmentModal, setShowAssignDepartmentModal] = useState(false);

// //   // Form states
// //   const [assignTaskData, setAssignTaskData] = useState<AssignTaskData>({
// //     assignedToUserId: 0,
// //     description: '',
// //     deadline: '',
// //   });
// //   const [updateStatusData, setUpdateStatusData] = useState<UpdateStatusData>({
// //     status: '',
// //     note: '',
// //   });
// //   const [convertData, setConvertData] = useState<ConvertToEmployeeData>({
// //     positionName: '',
// //     salary: 0,
// //     skillSet: '',
// //     departmentId: 0,
// //   });
// //   const [assignDepartmentData, setAssignDepartmentData] = useState({
// //     departmentId: 0,
// //   });
// //   const [updateEmployeeData, setUpdateEmployeeData] = useState<Partial<Employee>>({});

// //   // Filter states
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('all');

// //   // Departments list (mock - in real app, fetch from API)
// //   const departments = [
// //     { id: 1, name: 'Technology' },
// //     { id: 2, name: 'Human Resources' },
// //     { id: 3, name: 'Sales' },
// //     { id: 4, name: 'Marketing' },
// //     { id: 5, name: 'Finance' },
// //     { id: 6, name: 'Operations' },
// //   ];

// //   useEffect(() => {
// //     checkAccessAndLoadData();
// //   }, []);

// //   const checkAccessAndLoadData = async () => {
// //     setLoading(true);
// //     try {
// //       // Check if user has HR Director access
// //       if (user?.userId) {
// //         const accessRes = await checkHRAccess(user.userId.toString());
// //         if (accessRes.success && accessRes.data) {
// //           setHasAccess(true);
// //           await loadAllData();
// //         } else {
// //           setHasAccess(false);
// //           setAccessError(accessRes.message || 'Access denied');
// //         }
// //       } else {
// //         setHasAccess(false);
// //         setAccessError('User not authenticated');
// //       }
// //     } catch (error: any) {
// //       console.error('Access check error:', error);
// //       setHasAccess(false);
// //       setAccessError(error.message || 'Failed to verify access');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadAllData = async () => {
// //     try {
// //       const [kpisRes, consultantsRes, employeesRes, projectsRes, tasksRes] = await Promise.all([
// //         getDashboardKPIs().catch(() => ({ data: null })),
// //         getAllConsultants().catch(() => ({ data: [] })),
// //         getAllEmployees().catch(() => ({ data: [] })),
// //         getAllProjects().catch(() => ({ data: [] })),
// //         getAllTasks().catch(() => ({ data: [] })),
// //       ]);

// //       setDashboardData(kpisRes.data);
// //       setConsultants(consultantsRes.data);
// //       setEmployees(employeesRes.data);
// //       setProjects(projectsRes.data);
// //       setTasks(tasksRes.data);
// //     } catch (error) {
// //       console.error('Error loading data:', error);
// //     }
// //   };

// //   const handleViewConsultant = async (consultant: Consultant) => {
// //     setSelectedConsultant(consultant);
// //     try {
// //       const historyRes = await getConsultantStatusHistory(consultant.consultantId);
// //       setStatusHistory(historyRes.data);
// //     } catch (error) {
// //       console.error('Error loading status history:', error);
// //       setStatusHistory([]);
// //     }
// //     setShowConsultantDetailModal(true);
// //   };

// //   const handleViewEmployee = (employee: Employee) => {
// //     setSelectedEmployee(employee);
// //     setUpdateEmployeeData({
// //       positionName: employee.positionName,
// //       salary: employee.salary,
// //       skillSet: employee.skillSet,
// //       departmentId: employee.departmentId,
// //     });
// //     setShowEmployeeDetailModal(true);
// //   };

// //   const handleViewProject = (project: Project) => {
// //     setSelectedProject(project);
// //     setShowProjectDetailModal(true);
// //   };

// //   const handleViewTask = (task: Task) => {
// //     setSelectedTask(task);
// //     setShowTaskDetailModal(true);
// //   };

// //   const handleUpdateConsultantStatus = async () => {
// //     if (!selectedConsultant || !updateStatusData.status) {
// //       alert('Please select a status');
// //       return;
// //     }
// //     try {
// //       await updateConsultantStatus(
// //         selectedConsultant.consultantId,
// //         updateStatusData.status,
// //         updateStatusData.note
// //       );
// //       await loadAllData();
// //       setShowUpdateStatusModal(false);
// //       setUpdateStatusData({ status: '', note: '' });
// //       alert('Status updated successfully');
// //     } catch (error: any) {
// //       alert(error.message || 'Failed to update status');
// //     }
// //   };

// //   const handleAssignDepartment = async () => {
// //     if (!selectedConsultant || !assignDepartmentData.departmentId) {
// //       alert('Please select a department');
// //       return;
// //     }
// //     try {
// //       await assignDepartmentToConsultant(
// //         selectedConsultant.consultantId,
// //         assignDepartmentData.departmentId
// //       );
// //       await loadAllData();
// //       setShowAssignDepartmentModal(false);
// //       setAssignDepartmentData({ departmentId: 0 });
// //       alert('Department assigned successfully');
// //     } catch (error: any) {
// //       alert(error.message || 'Failed to assign department');
// //     }
// //   };

// //   const handleConvertToEmployee = async () => {
// //     if (!selectedConsultant) return;
// //     if (!convertData.positionName || !convertData.salary || !convertData.departmentId) {
// //       alert('Please fill all required fields');
// //       return;
// //     }
// //     try {
// //       await convertConsultantToEmployee(selectedConsultant.consultantId, convertData);
// //       await loadAllData();
// //       setShowConvertModal(false);
// //       setConvertData({ positionName: '', salary: 0, skillSet: '', departmentId: 0 });
// //       alert('Consultant converted to employee successfully');
// //     } catch (error: any) {
// //       alert(error.message || 'Failed to convert consultant');
// //     }
// //   };

// //   const handleAssignTask = async () => {
// //     if (!assignTaskData.assignedToUserId || !assignTaskData.description || !assignTaskData.deadline) {
// //       alert('Please fill all fields');
// //       return;
// //     }
// //     try {
// //       await assignTask(assignTaskData);
// //       await loadAllData();
// //       setShowAssignTaskModal(false);
// //       setAssignTaskData({ assignedToUserId: 0, description: '', deadline: '' });
// //       alert('Task assigned successfully');
// //     } catch (error: any) {
// //       alert(error.message || 'Failed to assign task');
// //     }
// //   };

// //   const handleUpdateEmployee = async () => {
// //     if (!selectedEmployee) return;
// //     try {
// //       await updateEmployee(selectedEmployee.employeeId, updateEmployeeData);
// //       await loadAllData();
// //       setShowEmployeeDetailModal(false);
// //       alert('Employee updated successfully');
// //     } catch (error: any) {
// //       alert(error.message || 'Failed to update employee');
// //     }
// //   };

// //   // Filtered data
// //   const filteredConsultants = consultants.filter(c => {
// //     if (statusFilter !== 'all' && c.currentStatus !== statusFilter) return false;
// //     if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
// //         !c.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
// //     return true;
// //   });

// //   const filteredEmployees = employees.filter(e => {
// //     if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
// //         !e.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
// //     return true;
// //   });

// //   const filteredProjects = projects.filter(p => {
// //     if (searchQuery && !p.projectName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
// //     return true;
// //   });

// //   const filteredTasks = tasks.filter(t => {
// //     if (statusFilter !== 'all' && t.status !== statusFilter) return false;
// //     if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
// //         !t.assignedToUserName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
// //     return true;
// //   });

// //   if (loading) {
// //     return (
// //       <div className="hr-loader">
// //         <div className="loader-spinner"></div>
// //         <p>Verifying access...</p>
// //       </div>
// //     );
// //   }

// //   if (!hasAccess) {
// //     return (
// //       <div className="access-denied">
// //         <div className="access-denied-card">
// //           <span className="access-denied-icon">🔒</span>
// //           <h2>Access Denied</h2>
// //           <p>{accessError || 'You do not have permission to access this page.'}</p>
// //           <button className="btn-primary" onClick={() => window.location.href = '/'}>
// //             Go to Home
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="hr-director-container">
// //       {/* Header */}
// //       <header className="hr-header">
// //         <div className="header-left">
// //           <h1>HR Director Dashboard</h1>
// //           <p>Manage consultants, employees, projects, and tasks</p>
// //         </div>
// //         <div className="header-right">
// //           <span className="user-badge">
// //             <span className="user-icon">👤</span>
// //             {user?.name || 'HR Director'}
// //           </span>
// //           <button className="logout-btn" onClick={logout}>Logout</button>
// //         </div>
// //       </header>

// //       {/* Tabs */}
// //       <div className="hr-tabs">
// //         <button className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
// //           📊 Dashboard
// //         </button>
// //         <button className={`tab ${activeTab === 'consultants' ? 'active' : ''}`} onClick={() => setActiveTab('consultants')}>
// //           👨‍💻 Consultants
// //         </button>
// //         <button className={`tab ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
// //           👥 Employees
// //         </button>
// //         <button className={`tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
// //           📁 Projects
// //         </button>
// //         <button className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
// //           ✅ Tasks
// //         </button>
// //       </div>

// //       {/* Dashboard Tab */}
// //       {activeTab === 'dashboard' && dashboardData && (
// //         <div className="dashboard-content">
// //           {/* KPI Cards */}
// //           <div className="kpi-grid">
// //             <div className="kpi-card">
// //               <div className="kpi-icon blue">👨‍💻</div>
// //               <div className="kpi-info">
// //                 <span className="kpi-value">{dashboardData.totalConsultants}</span>
// //                 <span className="kpi-label">Total Consultants</span>
// //               </div>
// //             </div>
// //             <div className="kpi-card">
// //               <div className="kpi-icon orange">⏳</div>
// //               <div className="kpi-info">
// //                 <span className="kpi-value">{dashboardData.pendingConsultants}</span>
// //                 <span className="kpi-label">Pending Approval</span>
// //               </div>
// //             </div>
// //             <div className="kpi-card">
// //               <div className="kpi-icon green">👥</div>
// //               <div className="kpi-info">
// //                 <span className="kpi-value">{dashboardData.totalEmployees}</span>
// //                 <span className="kpi-label">Total Employees</span>
// //               </div>
// //             </div>
// //             <div className="kpi-card">
// //               <div className="kpi-icon purple">📁</div>
// //               <div className="kpi-info">
// //                 <span className="kpi-value">{dashboardData.totalProjects}</span>
// //                 <span className="kpi-label">Active Projects</span>
// //               </div>
// //             </div>
// //             <div className="kpi-card">
// //               <div className="kpi-icon teal">✅</div>
// //               <div className="kpi-info">
// //                 <span className="kpi-value">{dashboardData.totalTasks}</span>
// //                 <span className="kpi-label">Total Tasks</span>
// //               </div>
// //             </div>
// //             <div className="kpi-card">
// //               <div className="kpi-icon gold">📈</div>
// //               <div className="kpi-info">
// //                 <span className="kpi-value">{dashboardData.conversionRate}%</span>
// //                 <span className="kpi-label">Conversion Rate</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Charts Section */}
// //           <div className="charts-grid">
// //             <div className="chart-card">
// //               <h3>Consultants by Status</h3>
// //               <div className="status-bars">
// //                 {Object.entries(dashboardData.consultantsByStatus).map(([status, count]) => (
// //                   <div key={status} className="status-bar-item">
// //                     <span className="status-name">{getStatusBadge(status)}</span>
// //                     <div className="bar-container">
// //                       <div className="bar-fill" style={{ width: `${(count / dashboardData.totalConsultants) * 100}%`, backgroundColor: statusConfig[status]?.color || '#6B7280' }}></div>
// //                       <span className="bar-count">{count}</span>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="chart-card">
// //               <h3>Consultants by Department</h3>
// //               <div className="dept-list">
// //                 {Object.entries(dashboardData.consultantsByDepartment).map(([dept, count]) => (
// //                   <div key={dept} className="dept-item">
// //                     <span className="dept-name">{dept}</span>
// //                     <span className="dept-count">{count}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="chart-card">
// //               <h3>Employees by Department</h3>
// //               <div className="dept-list">
// //                 {Object.entries(dashboardData.employeesByDepartment).map(([dept, count]) => (
// //                   <div key={dept} className="dept-item">
// //                     <span className="dept-name">{dept}</span>
// //                     <span className="dept-count">{count}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="chart-card">
// //               <h3>Tasks Overview</h3>
// //               <div className="task-stats">
// //                 <div className="task-stat pending">
// //                   <span className="task-stat-label">Pending</span>
// //                   <span className="task-stat-value">{dashboardData.pendingTasks}</span>
// //                 </div>
// //                 <div className="task-stat progress">
// //                   <span className="task-stat-label">In Progress</span>
// //                   <span className="task-stat-value">{dashboardData.inProgressTasks}</span>
// //                 </div>
// //                 <div className="task-stat completed">
// //                   <span className="task-stat-label">Completed</span>
// //                   <span className="task-stat-value">{dashboardData.completedTasks}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Consultants Tab */}
// //       {activeTab === 'consultants' && (
// //         <div className="consultants-content">
// //           <div className="content-header">
// //             <h2>Consultant Management</h2>
// //             <div className="filters">
// //               <input
// //                 type="text"
// //                 placeholder="Search by name or email..."
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //                 className="search-input"
// //               />
// //               <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
// //                 <option value="all">All Status</option>
// //                 <option value="APPLIED">Applied</option>
// //                 <option value="DOCUMENT_VERIFIED">Documents Verified</option>
// //                 <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
// //                 <option value="INTERVIEW_PASSED">Interview Passed</option>
// //                 <option value="APPROVED">Approved</option>
// //                 <option value="REJECTED">Rejected</option>
// //                 <option value="CONVERTED_TO_EMPLOYEE">Converted to Employee</option>
// //               </select>
// //             </div>
// //           </div>

// //           <div className="consultants-grid">
// //             {filteredConsultants.map((consultant) => (
// //               <div key={consultant.consultantId} className="consultant-card">
// //                 <div className="consultant-avatar">
// //                   {consultant.photoUrl ? (
// //                     <img src={consultant.photoUrl} alt={consultant.name} />
// //                   ) : (
// //                     <div className="avatar-placeholder">{consultant.name.charAt(0)}</div>
// //                   )}
// //                 </div>
// //                 <div className="consultant-info">
// //                   <h3>{consultant.name}</h3>
// //                   <p className="consultant-email">{consultant.email}</p>
// //                   <div className="consultant-meta">
// //                     <span className="skill-tag">{consultant.skill?.split(',')[0]}</span>
// //                     <span className="exp-tag">{consultant.experience}</span>
// //                   </div>
// //                   <div className="consultant-status">
// //                     {getStatusBadge(consultant.currentStatus)}
// //                   </div>
// //                   {consultant.departmentName && (
// //                     <div className="consultant-department">🏢 {consultant.departmentName}</div>
// //                   )}
// //                 </div>
// //                 <div className="consultant-actions">
// //                   <button className="btn-sm btn-primary" onClick={() => handleViewConsultant(consultant)}>
// //                     View Details
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           {filteredConsultants.length === 0 && (
// //             <div className="empty-state">
// //               <span className="empty-icon">👨‍💻</span>
// //               <p>No consultants found</p>
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* Employees Tab */}
// //       {activeTab === 'employees' && (
// //         <div className="employees-content">
// //           <div className="content-header">
// //             <h2>Employee Management</h2>
// //             <input
// //               type="text"
// //               placeholder="Search by name or email..."
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               className="search-input"
// //             />
// //           </div>

// //           <div className="employees-table-container">
// //             <table className="data-table">
// //               <thead>
// //                 <tr>
// //                   <th>Employee</th>
// //                   <th>Position</th>
// //                   <th>Department</th>
// //                   <th>Salary</th>
// //                   <th>Status</th>
// //                   <th>Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filteredEmployees.map((employee) => (
// //                   <tr key={employee.employeeId}>
// //                     <td>
// //                       <div className="employee-cell">
// //                         <div className="employee-avatar-small">
// //                           {employee.photoUrl ? (
// //                             <img src={employee.photoUrl} alt={employee.name} />
// //                           ) : (
// //                             <span>{employee.name.charAt(0)}</span>
// //                           )}
// //                         </div>
// //                         <div>
// //                           <div className="employee-name">{employee.name}</div>
// //                           <div className="employee-email">{employee.email}</div>
// //                         </div>
// //                       </div>
// //                     </td>
// //                     <td>{employee.positionName}</td>
// //                     <td>{employee.departmentName}</td>
// //                     <td>{formatCurrency(employee.salary)}</td>
// //                     <td>{employee.isDirectorVerified ? '✅ Verified' : '⏳ Pending'}</td>
// //                     <td>
// //                       <button className="btn-sm btn-outline" onClick={() => handleViewEmployee(employee)}>
// //                         View
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {filteredEmployees.length === 0 && (
// //             <div className="empty-state">
// //               <span className="empty-icon">👥</span>
// //               <p>No employees found</p>
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* Projects Tab */}
// //       {activeTab === 'projects' && (
// //         <div className="projects-content">
// //           <div className="content-header">
// //             <h2>Project Management</h2>
// //             <input
// //               type="text"
// //               placeholder="Search projects..."
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               className="search-input"
// //             />
// //           </div>

// //           <div className="projects-grid">
// //             {filteredProjects.map((project) => (
// //               <div key={project.projectId} className="project-card">
// //                 <div className="project-header">
// //                   <h3>{project.projectName}</h3>
// //                   {getStatusBadge(project.status)}
// //                 </div>
// //                 <p className="project-description">{project.projectDescription?.substring(0, 100)}</p>
// //                 <div className="project-meta">
// //                   <span>🏢 {project.departmentName}</span>
// //                   <span>👤 {project.clientName}</span>
// //                   <span>👔 {project.assignedManagerName}</span>
// //                   {project.deadline && <span>📅 Due: {new Date(project.deadline).toLocaleDateString()}</span>}
// //                   <span>💰 {formatCurrency(parseFloat(project.cost))}</span>
// //                 </div>
// //                 <div className="project-actions">
// //                   <button className="btn-sm btn-primary" onClick={() => handleViewProject(project)}>
// //                     View Details
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           {filteredProjects.length === 0 && (
// //             <div className="empty-state">
// //               <span className="empty-icon">📁</span>
// //               <p>No projects found</p>
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* Tasks Tab */}
// //       {activeTab === 'tasks' && (
// //         <div className="tasks-content">
// //           <div className="content-header">
// //             <h2>Task Management</h2>
// //             <div className="filters">
// //               <input
// //                 type="text"
// //                 placeholder="Search tasks..."
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //                 className="search-input"
// //               />
// //               <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
// //                 <option value="all">All Status</option>
// //                 <option value="PENDING">Pending</option>
// //                 <option value="IN_PROGRESS">In Progress</option>
// //                 <option value="COMPLETED">Completed</option>
// //               </select>
// //               <button className="btn-primary" onClick={() => setShowAssignTaskModal(true)}>
// //                 + Assign New Task
// //               </button>
// //             </div>
// //           </div>

// //           <div className="tasks-table-container">
// //             <table className="data-table">
// //               <thead>
// //                 <tr>
// //                   <th>Task</th>
// //                   <th>Assigned To</th>
// //                   <th>Department</th>
// //                   <th>Status</th>
// //                   <th>Deadline</th>
// //                   <th>Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filteredTasks.map((task) => (
// //                   <tr key={task.taskId}>
// //                     <td className="task-desc-cell">{task.description}</td>
// //                     <td>{task.assignedToUserName}</td>
// //                     <td>{task.assignedToDepartment}</td>
// //                     <td>{getStatusBadge(task.status)}</td>
// //                     <td>{new Date(task.deadline).toLocaleDateString()}</td>
// //                     <td>
// //                       <button className="btn-sm btn-outline" onClick={() => handleViewTask(task)}>
// //                         View
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>

// //           {filteredTasks.length === 0 && (
// //             <div className="empty-state">
// //               <span className="empty-icon">✅</span>
// //               <p>No tasks found</p>
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* Consultant Detail Modal */}
// //       {showConsultantDetailModal && selectedConsultant && (
// //         <div className="modal-overlay" onClick={() => setShowConsultantDetailModal(false)}>
// //           <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
// //             <button className="modal-close" onClick={() => setShowConsultantDetailModal(false)}>✕</button>
// //             <div className="modal-header">
// //               <div className="consultant-profile-header">
// //                 <div className="profile-avatar">
// //                   {selectedConsultant.photoUrl ? (
// //                     <img src={selectedConsultant.photoUrl} alt={selectedConsultant.name} />
// //                   ) : (
// //                     <div className="avatar-placeholder large">{selectedConsultant.name.charAt(0)}</div>
// //                   )}
// //                 </div>
// //                 <div className="profile-info">
// //                   <h2>{selectedConsultant.name}</h2>
// //                   <p>{selectedConsultant.email}</p>
// //                   <div className="profile-badges">
// //                     {getStatusBadge(selectedConsultant.currentStatus)}
// //                     {selectedConsultant.departmentName && (
// //                       <span className="dept-badge">🏢 {selectedConsultant.departmentName}</span>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="modal-body">
// //               <div className="detail-section">
// //                 <h3>Professional Details</h3>
// //                 <div className="details-grid">
// //                   <div className="detail-item"><label>Skills:</label><span>{selectedConsultant.skill}</span></div>
// //                   <div className="detail-item"><label>Experience:</label><span>{selectedConsultant.experience}</span></div>
// //                 </div>
// //               </div>

// //               <div className="detail-section">
// //                 <h3>Status History</h3>
// //                 <div className="timeline">
// //                   {statusHistory.map((entry) => (
// //                     <div key={entry.statusId} className="timeline-item">
// //                       <div className="timeline-dot" style={{ backgroundColor: statusConfig[entry.status]?.color }}></div>
// //                       <div className="timeline-content">
// //                         <div className="timeline-header">
// //                           <span className="timeline-status">{getStatusBadge(entry.status)}</span>
// //                           <span className="timeline-date">{formatDate(entry.dateTime)}</span>
// //                         </div>
// //                         {entry.note && <p className="timeline-note">{entry.note}</p>}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="modal-footer">
// //               <button className="btn-outline" onClick={() => {
// //                 setShowConsultantDetailModal(false);
// //                 setShowAssignDepartmentModal(true);
// //               }}>
// //                 Assign Department
// //               </button>
// //               <button className="btn-outline" onClick={() => {
// //                 setShowConsultantDetailModal(false);
// //                 setShowUpdateStatusModal(true);
// //               }}>
// //                 Update Status
// //               </button>
// //               <button className="btn-primary" onClick={() => {
// //                 setShowConsultantDetailModal(false);
// //                 setShowConvertModal(true);
// //               }}>
// //                 Convert to Employee
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Update Status Modal */}
// //       {showUpdateStatusModal && selectedConsultant && (
// //         <div className="modal-overlay" onClick={() => setShowUpdateStatusModal(false)}>
// //           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
// //             <button className="modal-close" onClick={() => setShowUpdateStatusModal(false)}>✕</button>
// //             <h2>Update Consultant Status</h2>
// //             <p className="modal-subtitle">{selectedConsultant.name}</p>
// //             <div className="form-group">
// //               <label>Select Status</label>
// //               <select value={updateStatusData.status} onChange={(e) => setUpdateStatusData({ ...updateStatusData, status: e.target.value })}>
// //                 <option value="">Select Status</option>
// //                 <option value="APPLIED">Applied</option>
// //                 <option value="DOCUMENT_VERIFIED">Documents Verified</option>
// //                 <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
// //                 <option value="INTERVIEW_PASSED">Interview Passed</option>
// //                 <option value="INTERVIEW_FAILED">Interview Failed</option>
// //                 <option value="APPROVED">Approved</option>
// //                 <option value="REJECTED">Rejected</option>
// //               </select>
// //             </div>
// //             <div className="form-group">
// //               <label>Note (Optional)</label>
// //               <textarea rows={3} value={updateStatusData.note} onChange={(e) => setUpdateStatusData({ ...updateStatusData, note: e.target.value })} />
// //             </div>
// //             <button className="btn-primary" onClick={handleUpdateConsultantStatus}>Update Status</button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Assign Department Modal */}
// //       {showAssignDepartmentModal && selectedConsultant && (
// //         <div className="modal-overlay" onClick={() => setShowAssignDepartmentModal(false)}>
// //           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
// //             <button className="modal-close" onClick={() => setShowAssignDepartmentModal(false)}>✕</button>
// //             <h2>Assign Department</h2>
// //             <p className="modal-subtitle">Consultant: {selectedConsultant.name}</p>
// //             <div className="form-group">
// //               <label>Select Department</label>
// //               <select value={assignDepartmentData.departmentId} onChange={(e) => setAssignDepartmentData({ departmentId: parseInt(e.target.value) })}>
// //                 <option value="0">Select Department</option>
// //                 {departments.map(dept => (
// //                   <option key={dept.id} value={dept.id}>{dept.name}</option>
// //                 ))}
// //               </select>
// //             </div>
// //             <button className="btn-primary" onClick={handleAssignDepartment}>Assign Department</button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Convert to Employee Modal */}
// //       {showConvertModal && selectedConsultant && (
// //         <div className="modal-overlay" onClick={() => setShowConvertModal(false)}>
// //           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
// //             <button className="modal-close" onClick={() => setShowConvertModal(false)}>✕</button>
// //             <h2>Convert to Employee</h2>
// //             <p className="modal-subtitle">Consultant: {selectedConsultant.name}</p>
// //             <div className="form-group">
// //               <label>Position Name *</label>
// //               <input type="text" value={convertData.positionName} onChange={(e) => setConvertData({ ...convertData, positionName: e.target.value })} />
// //             </div>
// //             <div className="form-group">
// //               <label>Salary (₹) *</label>
// //               <input type="number" value={convertData.salary} onChange={(e) => setConvertData({ ...convertData, salary: parseFloat(e.target.value) })} />
// //             </div>
// //             <div className="form-group">
// //               <label>Skill Set *</label>
// //               <input type="text" value={convertData.skillSet} onChange={(e) => setConvertData({ ...convertData, skillSet: e.target.value })} placeholder="e.g., Java, React, AWS" />
// //             </div>
// //             <div className="form-group">
// //               <label>Department *</label>
// //               <select value={convertData.departmentId} onChange={(e) => setConvertData({ ...convertData, departmentId: parseInt(e.target.value) })}>
// //                 <option value="0">Select Department</option>
// //                 {departments.map(dept => (
// //                   <option key={dept.id} value={dept.id}>{dept.name}</option>
// //                 ))}
// //               </select>
// //             </div>
// //             <button className="btn-primary" onClick={handleConvertToEmployee}>Convert to Employee</button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Assign Task Modal */}
// //       {showAssignTaskModal && (
// //         <div className="modal-overlay" onClick={() => setShowAssignTaskModal(false)}>
// //           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
// //             <button className="modal-close" onClick={() => setShowAssignTaskModal(false)}>✕</button>
// //             <h2>Assign New Task</h2>
// //             <div className="form-group">
// //               <label>Assign To (Employee) *</label>
// //               <select value={assignTaskData.assignedToUserId} onChange={(e) => setAssignTaskData({ ...assignTaskData, assignedToUserId: parseInt(e.target.value) })}>
// //                 <option value="0">Select Employee</option>
// //                 {employees.map(emp => (
// //                   <option key={emp.userId} value={emp.userId}>{emp.name} - {emp.positionName}</option>
// //                 ))}
// //               </select>
// //             </div>
// //             <div className="form-group">
// //               <label>Task Description *</label>
// //               <textarea rows={3} value={assignTaskData.description} onChange={(e) => setAssignTaskData({ ...assignTaskData, description: e.target.value })} />
// //             </div>
// //             <div className="form-group">
// //               <label>Deadline *</label>
// //               <input type="datetime-local" value={assignTaskData.deadline} onChange={(e) => setAssignTaskData({ ...assignTaskData, deadline: e.target.value })} />
// //             </div>
// //             <button className="btn-primary" onClick={handleAssignTask}>Assign Task</button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Employee Detail Modal */}
// //       {showEmployeeDetailModal && selectedEmployee && (
// //         <div className="modal-overlay" onClick={() => setShowEmployeeDetailModal(false)}>
// //           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
// //             <button className="modal-close" onClick={() => setShowEmployeeDetailModal(false)}>✕</button>
// //             <h2>Edit Employee</h2>
// //             <p className="modal-subtitle">{selectedEmployee.name}</p>
// //             <div className="form-group">
// //               <label>Position Name</label>
// //               <input type="text" value={updateEmployeeData.positionName || ''} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, positionName: e.target.value })} />
// //             </div>
// //             <div className="form-group">
// //               <label>Salary (₹)</label>
// //               <input type="number" value={updateEmployeeData.salary || 0} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, salary: parseFloat(e.target.value) })} />
// //             </div>
// //             <div className="form-group">
// //               <label>Skill Set</label>
// //               <input type="text" value={updateEmployeeData.skillSet || ''} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, skillSet: e.target.value })} />
// //             </div>
// //             <div className="form-group">
// //               <label>Department</label>
// //               <select value={updateEmployeeData.departmentId || 0} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, departmentId: parseInt(e.target.value) })}>
// //                 <option value="0">Select Department</option>
// //                 {departments.map(dept => (
// //                   <option key={dept.id} value={dept.id}>{dept.name}</option>
// //                 ))}
// //               </select>
// //             </div>
// //             <button className="btn-primary" onClick={handleUpdateEmployee}>Save Changes</button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Project Detail Modal */}
// //       {showProjectDetailModal && selectedProject && (
// //         <div className="modal-overlay" onClick={() => setShowProjectDetailModal(false)}>
// //           <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
// //             <button className="modal-close" onClick={() => setShowProjectDetailModal(false)}>✕</button>
// //             <h2>{selectedProject.projectName}</h2>
// //             <div className="details-grid">
// //               <div className="detail-item"><label>Status:</label>{getStatusBadge(selectedProject.status)}</div>
// //               <div className="detail-item"><label>Type:</label><span>{selectedProject.projectType}</span></div>
// //               <div className="detail-item"><label>Department:</label><span>{selectedProject.departmentName}</span></div>
// //               <div className="detail-item"><label>Client:</label><span>{selectedProject.clientName}</span></div>
// //               <div className="detail-item"><label>Manager:</label><span>{selectedProject.assignedManagerName}</span></div>
// //               <div className="detail-item"><label>Deadline:</label><span>{new Date(selectedProject.deadline).toLocaleDateString()}</span></div>
// //               <div className="detail-item"><label>Cost:</label><span>{formatCurrency(parseFloat(selectedProject.cost))}</span></div>
// //               <div className="detail-item full-width"><label>Description:</label><p>{selectedProject.projectDescription}</p></div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Task Detail Modal */}
// //       {showTaskDetailModal && selectedTask && (
// //         <div className="modal-overlay" onClick={() => setShowTaskDetailModal(false)}>
// //           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
// //             <button className="modal-close" onClick={() => setShowTaskDetailModal(false)}>✕</button>
// //             <h2>Task Details</h2>
// //             <div className="details-grid">
// //               <div className="detail-item"><label>Description:</label><span>{selectedTask.description}</span></div>
// //               <div className="detail-item"><label>Status:</label>{getStatusBadge(selectedTask.status)}</div>
// //               <div className="detail-item"><label>Assigned To:</label><span>{selectedTask.assignedToUserName}</span></div>
// //               <div className="detail-item"><label>Department:</label><span>{selectedTask.assignedToDepartment}</span></div>
// //               <div className="detail-item"><label>Created By:</label><span>{selectedTask.createdByName}</span></div>
// //               <div className="detail-item"><label>Deadline:</label><span>{new Date(selectedTask.deadline).toLocaleString()}</span></div>
// //               <div className="detail-item"><label>Created At:</label><span>{formatDate(selectedTask.createdAt)}</span></div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <style jsx>{`
// //         .hr-director-container {
// //           min-height: 100vh;
// //           background: var(--bg, #f5f7fc);
// //         }

// //         .hr-header {
// //           background: var(--card-bg, #ffffff);
// //           border-bottom: 1px solid var(--border, #e5e7eb);
// //           padding: 1rem 2rem;
// //           display: flex;
// //           justify-content: space-between;
// //           align-items: center;
// //           flex-wrap: wrap;
// //           gap: 1rem;
// //         }

// //         .header-left h1 {
// //           font-size: 1.5rem;
// //           font-weight: 700;
// //           margin: 0;
// //           color: var(--text, #1f2937);
// //         }

// //         .header-left p {
// //           font-size: 0.8rem;
// //           color: var(--muted, #6b7280);
// //           margin: 0.25rem 0 0;
// //         }

// //         .header-right {
// //           display: flex;
// //           align-items: center;
// //           gap: 1rem;
// //         }

// //         .user-badge {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.5rem;
// //           padding: 0.5rem 1rem;
// //           background: var(--surface, #f3f4f6);
// //           border-radius: 40px;
// //           font-size: 0.85rem;
// //           font-weight: 500;
// //         }

// //         .logout-btn {
// //           padding: 0.5rem 1rem;
// //           background: transparent;
// //           border: 1px solid var(--border, #e5e7eb);
// //           border-radius: 40px;
// //           cursor: pointer;
// //           transition: all 0.2s;
// //         }

// //         .logout-btn:hover {
// //           background: #ef4444;
// //           color: white;
// //           border-color: #ef4444;
// //         }

// //         .hr-tabs {
// //           display: flex;
// //           gap: 0.25rem;
// //           padding: 0 2rem;
// //           background: var(--card-bg, #ffffff);
// //           border-bottom: 1px solid var(--border, #e5e7eb);
// //           flex-wrap: wrap;
// //         }

// //         .tab {
// //           padding: 0.85rem 1.5rem;
// //           background: transparent;
// //           border: none;
// //           font-size: 0.9rem;
// //           font-weight: 600;
// //           color: var(--muted, #6b7280);
// //           cursor: pointer;
// //           transition: all 0.2s;
// //           border-bottom: 2px solid transparent;
// //         }

// //         .tab:hover {
// //           color: var(--teal, #2ca6a4);
// //         }

// //         .tab.active {
// //           color: var(--teal, #2ca6a4);
// //           border-bottom-color: var(--teal, #2ca6a4);
// //         }

// //         .dashboard-content,
// //         .consultants-content,
// //         .employees-content,
// //         .projects-content,
// //         .tasks-content {
// //           padding: 2rem;
// //         }

// //         .kpi-grid {
// //           display: grid;
// //           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
// //           gap: 1.5rem;
// //           margin-bottom: 2rem;
// //         }

// //         .kpi-card {
// //           background: var(--card-bg, #ffffff);
// //           border: 1px solid var(--border, #e5e7eb);
// //           border-radius: 16px;
// //           padding: 1.2rem;
// //           display: flex;
// //           align-items: center;
// //           gap: 1rem;
// //           transition: all 0.2s;
// //         }

// //         .kpi-card:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
// //         }

// //         .kpi-icon {
// //           width: 48px;
// //           height: 48px;
// //           border-radius: 12px;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           font-size: 1.5rem;
// //         }

// //         .kpi-icon.blue { background: rgba(31, 109, 168, 0.1); }
// //         .kpi-icon.orange { background: rgba(245, 124, 0, 0.1); }
// //         .kpi-icon.green { background: rgba(52, 168, 83, 0.1); }
// //         .kpi-icon.purple { background: rgba(106, 90, 205, 0.1); }
// //         .kpi-icon.teal { background: rgba(44, 166, 164, 0.1); }
// //         .kpi-icon.gold { background: rgba(245, 158, 11, 0.1); }

// //         .kpi-info {
// //           display: flex;
// //           flex-direction: column;
// //         }

// //         .kpi-value {
// //           font-size: 2rem;
// //           font-weight: 800;
// //           line-height: 1;
// //           color: var(--text, #1f2937);
// //         }

// //         .kpi-label {
// //           font-size: 0.75rem;
// //           color: var(--muted, #6b7280);
// //         }

// //         .charts-grid {
// //           display: grid;
// //           grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
// //           gap: 1.5rem;
// //         }

// //         .chart-card {
// //           background: var(--card-bg, #ffffff);
// //           border: 1px solid var(--border, #e5e7eb);
// //           border-radius: 16px;
// //           padding: 1.2rem;
// //         }

// //         .chart-card h3 {
// //           font-size: 1rem;
// //           margin-bottom: 1rem;
// //           color: var(--text, #1f2937);
// //         }

// //         .status-bars {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0.75rem;
// //         }

// //         .status-bar-item {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.75rem;
// //           flex-wrap: wrap;
// //         }

// //         .status-name {
// //           width: 140px;
// //         }

// //         .bar-container {
// //           flex: 1;
// //           display: flex;
// //           align-items: center;
// //           gap: 0.5rem;
// //         }

// //         .bar-fill {
// //           height: 8px;
// //           border-radius: 4px;
// //           transition: width 0.3s;
// //         }

// //         .bar-count {
// //           font-size: 0.75rem;
// //           font-weight: 600;
// //           min-width: 30px;
// //         }

// //         .dept-list {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0.5rem;
// //         }

// //         .dept-item {
// //           display: flex;
// //           justify-content: space-between;
// //           padding: 0.5rem 0;
// //           border-bottom: 1px solid var(--border, #e5e7eb);
// //         }

// //         .dept-name {
// //           font-weight: 500;
// //         }

// //         .dept-count {
// //           font-weight: 700;
// //           color: var(--teal, #2ca6a4);
// //         }

// //         .task-stats {
// //           display: flex;
// //           justify-content: space-around;
// //           text-align: center;
// //         }

// //         .task-stat {
// //           padding: 0.5rem;
// //         }

// //         .task-stat-label {
// //           display: block;
// //           font-size: 0.7rem;
// //           color: var(--muted, #6b7280);
// //         }

// //         .task-stat-value {
// //           display: block;
// //           font-size: 1.5rem;
// //           font-weight: 700;
// //         }

// //         .task-stat.pending .task-stat-value { color: #f59e0b; }
// //         .task-stat.progress .task-stat-value { color: #3b82f6; }
// //         .task-stat.completed .task-stat-value { color: #10b981; }

// //         .content-header {
// //           display: flex;
// //           justify-content: space-between;
// //           align-items: center;
// //           flex-wrap: wrap;
// //           gap: 1rem;
// //           margin-bottom: 1.5rem;
// //         }

// //         .content-header h2 {
// //           font-size: 1.25rem;
// //           margin: 0;
// //         }

// //         .filters {
// //           display: flex;
// //           gap: 0.75rem;
// //           flex-wrap: wrap;
// //         }

// //         .search-input, .filter-select {
// //           padding: 0.5rem 0.75rem;
// //           border: 1px solid var(--border, #e5e7eb);
// //           border-radius: 8px;
// //           background: var(--surface, #f3f4f6);
// //           font-size: 0.85rem;
// //           min-width: 200px;
// //         }

// //         .consultants-grid {
// //           display: grid;
// //           grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
// //           gap: 1rem;
// //         }

// //         .consultant-card {
// //           background: var(--card-bg, #ffffff);
// //           border: 1px solid var(--border, #e5e7eb);
// //           border-radius: 16px;
// //           padding: 1.2rem;
// //           display: flex;
// //           gap: 1rem;
// //           transition: all 0.2s;
// //         }

// //         .consultant-card:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
// //         }

// //         .consultant-avatar {
// //           width: 60px;
// //           height: 60px;
// //           border-radius: 50%;
// //           overflow: hidden;
// //           flex-shrink: 0;
// //         }

// //         .consultant-avatar img,
// //         .avatar-placeholder {
// //           width: 100%;
// //           height: 100%;
// //           object-fit: cover;
// //         }

// //         .avatar-placeholder {
// //           background: linear-gradient(135deg, #2ca6a4, #1f6da8);
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           font-size: 1.5rem;
// //           font-weight: 700;
// //           color: white;
// //         }

// //         .consultant-info {
// //           flex: 1;
// //         }

// //         .consultant-info h3 {
// //           margin: 0 0 0.25rem;
// //           font-size: 1rem;
// //         }

// //         .consultant-email {
// //           font-size: 0.75rem;
// //           color: var(--muted, #6b7280);
// //           margin: 0 0 0.5rem;
// //         }

// //         .consultant-meta {
// //           display: flex;
// //           gap: 0.5rem;
// //           margin-bottom: 0.5rem;
// //         }

// //         .skill-tag, .exp-tag {
// //           padding: 0.2rem 0.5rem;
// //           border-radius: 12px;
// //           font-size: 0.7rem;
// //           background: rgba(44, 166, 164, 0.1);
// //           color: var(--teal, #2ca6a4);
// //         }

// //         .consultant-department {
// //           font-size: 0.7rem;
// //           color: var(--muted, #6b7280);
// //           margin-top: 0.5rem;
// //         }

// //         .consultant-actions {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0.5rem;
// //         }

// //         .projects-grid {
// //           display: grid;
// //           grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
// //           gap: 1rem;
// //         }

// //         .project-card {
// //           background: var(--card-bg, #ffffff);
// //           border: 1px solid var(--border, #e5e7eb);
// //           border-radius: 16px;
// //           padding: 1.2rem;
// //         }

// //         .project-header {
// //           display: flex;
// //           justify-content: space-between;
// //           align-items: center;
// //           margin-bottom: 0.75rem;
// //         }

// //         .project-header h3 {
// //           margin: 0;
// //           font-size: 1rem;
// //         }

// //         .project-description {
// //           font-size: 0.8rem;
// //           color: var(--muted, #6b7280);
// //           margin-bottom: 0.75rem;
// //         }

// //         .project-meta {
// //           display: flex;
// //           flex-wrap: wrap;
// //           gap: 0.5rem;
// //           font-size: 0.7rem;
// //           color: var(--muted, #6b7280);
// //           margin-bottom: 0.75rem;
// //         }

// //         .project-actions {
// //           display: flex;
// //           gap: 0.5rem;
// //         }

// //         .data-table {
// //           width: 100%;
// //           border-collapse: collapse;
// //         }

// //         .data-table th,
// //         .data-table td {
// //           padding: 0.75rem;
// //           text-align: left;
// //           border-bottom: 1px solid var(--border, #e5e7eb);
// //         }

// //         .data-table th {
// //           font-size: 0.75rem;
// //           font-weight: 600;
// //           text-transform: uppercase;
// //           color: var(--muted, #6b7280);
// //         }

// //         .employee-cell {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.75rem;
// //         }

// //         .employee-avatar-small {
// //           width: 36px;
// //           height: 36px;
// //           border-radius: 50%;
// //           background: linear-gradient(135deg, #2ca6a4, #1f6da8);
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           color: white;
// //           font-weight: 700;
// //         }

// //         .employee-name {
// //           font-weight: 600;
// //           font-size: 0.85rem;
// //         }

// //         .employee-email {
// //           font-size: 0.7rem;
// //           color: var(--muted, #6b7280);
// //         }

// //         .task-desc-cell {
// //           max-width: 300px;
// //           white-space: nowrap;
// //           overflow: hidden;
// //           text-overflow: ellipsis;
// //         }

// //         .btn-sm {
// //           padding: 0.35rem 0.85rem;
// //           border-radius: 40px;
// //           font-size: 0.75rem;
// //           font-weight: 600;
// //           cursor: pointer;
// //           transition: all 0.2s;
// //         }

// //         .btn-primary {
// //           background: linear-gradient(135deg, #2ca6a4, #1f6da8);
// //           color: white;
// //           border: none;
// //           padding: 0.6rem 1.2rem;
// //           border-radius: 40px;
// //           font-weight: 600;
// //           cursor: pointer;
// //         }

// //         .btn-outline {
// //           background: transparent;
// //           border: 1.5px solid var(--border, #e5e7eb);
// //           color: var(--text, #1f2937);
// //         }

// //         .btn-outline:hover {
// //           border-color: var(--teal, #2ca6a4);
// //           color: var(--teal, #2ca6a4);
// //         }

// //         .status-badge {
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 0.25rem;
// //           padding: 0.2rem 0.6rem;
// //           border-radius: 20px;
// //           font-size: 0.7rem;
// //           font-weight: 600;
// //         }

// //         .status-pending { background: rgba(245, 124, 0, 0.1); color: #f59e0b; }
// //         .status-progress { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
// //         .status-approved { background: rgba(16, 185, 129, 0.1); color: #10b981; }
// //         .status-rejected { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
// //         .status-completed { background: rgba(16, 185, 129, 0.1); color: #10b981; }

// //         .empty-state {
// //           text-align: center;
// //           padding: 3rem;
// //           color: var(--muted, #6b7280);
// //         }

// //         .empty-icon {
// //           font-size: 3rem;
// //           display: block;
// //           margin-bottom: 1rem;
// //           opacity: 0.5;
// //         }

// //         .modal-overlay {
// //           position: fixed;
// //           top: 0;
// //           left: 0;
// //           right: 0;
// //           bottom: 0;
// //           background: rgba(0, 0, 0, 0.6);
// //           backdrop-filter: blur(4px);
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           z-index: 1000;
// //           padding: 1rem;
// //         }

// //         .modal-content {
// //           background: var(--card-bg, #ffffff);
// //           border-radius: 24px;
// //           max-width: 500px;
// //           width: 100%;
// //           max-height: 90vh;
// //           overflow-y: auto;
// //           padding: 1.5rem;
// //           position: relative;
// //         }

// //         .modal-content.large {
// //           max-width: 700px;
// //         }

// //         .modal-close {
// //           position: absolute;
// //           top: 1rem;
// //           right: 1rem;
// //           width: 32px;
// //           height: 32px;
// //           border-radius: 50%;
// //           background: var(--surface, #f3f4f6);
// //           border: 1px solid var(--border, #e5e7eb);
// //           cursor: pointer;
// //         }

// //         .modal-header {
// //           margin-bottom: 1.5rem;
// //         }

// //         .consultant-profile-header {
// //           display: flex;
// //           gap: 1.5rem;
// //           align-items: center;
// //           flex-wrap: wrap;
// //         }

// //         .profile-avatar {
// //           width: 80px;
// //           height: 80px;
// //           border-radius: 50%;
// //           overflow: hidden;
// //         }

// //         .avatar-placeholder.large {
// //           font-size: 2rem;
// //         }

// //         .profile-badges {
// //           display: flex;
// //           gap: 0.5rem;
// //           margin-top: 0.5rem;
// //           flex-wrap: wrap;
// //         }

// //         .detail-section {
// //           margin-bottom: 1.5rem;
// //         }

// //         .detail-section h3 {
// //           font-size: 0.9rem;
// //           margin-bottom: 0.75rem;
// //           color: var(--teal, #2ca6a4);
// //         }

// //         .details-grid {
// //           display: grid;
// //           grid-template-columns: repeat(2, 1fr);
// //           gap: 0.75rem;
// //         }

// //         .detail-item {
// //           display: flex;
// //           flex-direction: column;
// //         }

// //         .detail-item label {
// //           font-size: 0.7rem;
// //           font-weight: 600;
// //           color: var(--muted, #6b7280);
// //         }

// //         .detail-item span {
// //           font-size: 0.85rem;
// //         }

// //         .detail-item.full-width {
// //           grid-column: 1 / -1;
// //         }

// //         .timeline {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0.75rem;
// //         }

// //         .timeline-item {
// //           display: flex;
// //           gap: 0.75rem;
// //         }

// //         .timeline-dot {
// //           width: 10px;
// //           height: 10px;
// //           border-radius: 50%;
// //           margin-top: 0.3rem;
// //         }

// //         .timeline-content {
// //           flex: 1;
// //         }

// //         .timeline-header {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.5rem;
// //           flex-wrap: wrap;
// //         }

// //         .timeline-date {
// //           font-size: 0.7rem;
// //           color: var(--muted, #6b7280);
// //         }

// //         .timeline-note {
// //           font-size: 0.75rem;
// //           color: var(--muted, #6b7280);
// //           margin-top: 0.25rem;
// //         }

// //         .modal-footer {
// //           display: flex;
// //           gap: 0.75rem;
// //           justify-content: flex-end;
// //           margin-top: 1.5rem;
// //           padding-top: 1rem;
// //           border-top: 1px solid var(--border, #e5e7eb);
// //         }

// //         .form-group {
// //           margin-bottom: 1rem;
// //         }

// //         .form-group label {
// //           display: block;
// //           font-size: 0.75rem;
// //           font-weight: 600;
// //           margin-bottom: 0.25rem;
// //           color: var(--muted, #6b7280);
// //         }

// //         .form-group input,
// //         .form-group select,
// //         .form-group textarea {
// //           width: 100%;
// //           padding: 0.6rem 0.75rem;
// //           border: 1px solid var(--border, #e5e7eb);
// //           border-radius: 10px;
// //           background: var(--surface, #f3f4f6);
// //           font-size: 0.85rem;
// //         }

// //         .modal-subtitle {
// //           color: var(--muted, #6b7280);
// //           margin-bottom: 1rem;
// //         }

// //         .hr-loader {
// //           display: flex;
// //           flex-direction: column;
// //           align-items: center;
// //           justify-content: center;
// //           min-height: 100vh;
// //           gap: 1rem;
// //         }

// //         .loader-spinner {
// //           width: 40px;
// //           height: 40px;
// //           border: 3px solid var(--border, #e5e7eb);
// //           border-top-color: var(--teal, #2ca6a4);
// //           border-radius: 50%;
// //           animation: spin 0.8s linear infinite;
// //         }

// //         @keyframes spin {
// //           to { transform: rotate(360deg); }
// //         }

// //         .access-denied {
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           min-height: 100vh;
// //           background: var(--bg, #f5f7fc);
// //         }

// //         .access-denied-card {
// //           text-align: center;
// //           background: var(--card-bg, #ffffff);
// //           padding: 2rem;
// //           border-radius: 24px;
// //           max-width: 400px;
// //         }

// //         .access-denied-icon {
// //           font-size: 4rem;
// //           display: block;
// //           margin-bottom: 1rem;
// //         }

// //         @media (max-width: 768px) {
// //           .hr-header, .hr-tabs, .dashboard-content,
// //           .consultants-content, .employees-content,
// //           .projects-content, .tasks-content {
// //             padding: 1rem;
// //           }
          
// //           .kpi-grid {
// //             grid-template-columns: repeat(2, 1fr);
// //           }
          
// //           .charts-grid {
// //             grid-template-columns: 1fr;
// //           }
          
// //           .details-grid {
// //             grid-template-columns: 1fr;
// //           }
          
// //           .consultants-grid,
// //           .projects-grid {
// //             grid-template-columns: 1fr;
// //           }
          
// //           .data-table {
// //             display: block;
// //             overflow-x: auto;
// //           }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default HRDirectorDashboard;



// 'use client';

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '@/contexts/AuthContext';

// // ============================================
// // TYPES
// // ============================================

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

// interface StatusHistoryEntry {
//   statusId: number;
//   status: string;
//   note: string;
//   dateTime: string;
// }

// interface ConsultantDetail extends Consultant {}

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

// interface Task {
//   taskId: number;
//   description: string;
//   status: string;
//   assignedToUserId: number;
//   assignedToUserName: string;
//   assignedToDepartment: string;
//   createdByUserId: number;
//   createdByName: string;
//   deadline: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface DashboardKPIs {
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

// interface AssignTaskData {
//   assignedToUserId: number;
//   description: string;
//   deadline: string;
// }

// interface UpdateStatusData {
//   status: string;
//   note: string;
// }

// interface ConvertToEmployeeData {
//   positionName: string;
//   salary: number;
//   skillSet: string;
//   departmentId: number;
//   stype?: string;
// }

// interface Department {
//   departmentId: number;
//   departmentName: string;
// }

// interface ToastMessage {
//   id: number;
//   type: 'success' | 'error' | 'info' | 'warning';
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
//   headers?: Record<string, string>
// ): Promise<T> => {
//   try {
//     const config: any = {
//       method,
//       url: `${API_BASE}${endpoint}`,
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json',
//         ...headers,
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

// const checkHRAccess = async (userId: string) => {
//   return apiCall<{ success: boolean; message: string; data: boolean }>(
//     'GET',
//     `/api/hr-director/check?userId=${userId}`
//   );
// };

// const getAllConsultants = async () => {
//   return apiCall<{ success: boolean; message: string; data: Consultant[] }>(
//     'GET',
//     '/api/hr-director/consultants'
//   );
// };

// const getConsultantById = async (consultantId: number) => {
//   return apiCall<{ success: boolean; message: string; data: ConsultantDetail }>(
//     'GET',
//     `/api/hr-director/consultants/${consultantId}`
//   );
// };

// const getConsultantStatusHistory = async (consultantId: number) => {
//   return apiCall<{ success: boolean; message: string; data: StatusHistoryEntry[] }>(
//     'GET',
//     `/api/hr-director/consultants/${consultantId}/status-history`
//   );
// };

// const updateConsultantStatus = async (consultantId: number, status: string, note: string) => {
//   return apiCall<{ success: boolean; message: string; data: any }>(
//     'PUT',
//     `/api/hr-director/consultants/${consultantId}/status`,
//     { status, note }
//   );
// };

// const assignDepartmentToConsultant = async (consultantId: number, departmentId: number) => {
//   return apiCall<{ success: boolean; message: string; data: Consultant }>(
//     'PUT',
//     `/api/hr-director/consultants/${consultantId}/assign-department`,
//     { departmentId }
//   );
// };

// const convertConsultantToEmployee = async (consultantId: number, data: ConvertToEmployeeData) => {
//   return apiCall<{ success: boolean; message: string; data: Employee }>(
//     'POST',
//     `/api/hr-director/consultants/${consultantId}/convert-to-employee`,
//     data
//   );
// };

// const getAllEmployees = async () => {
//   return apiCall<{ success: boolean; message: string; data: Employee[] }>(
//     'GET',
//     '/api/hr-director/employees'
//   );
// };

// const getEmployeeById = async (employeeId: number) => {
//   return apiCall<{ success: boolean; message: string; data: Employee }>(
//     'GET',
//     `/api/hr-director/employees/${employeeId}`
//   );
// };

// const updateEmployee = async (employeeId: number, data: Partial<Employee>) => {
//   return apiCall<{ success: boolean; message: string; data: Employee }>(
//     'PUT',
//     `/api/hr-director/employees/${employeeId}`,
//     data
//   );
// };

// const getAllProjects = async () => {
//   return apiCall<{ success: boolean; message: string; data: Project[] }>(
//     'GET',
//     '/api/hr-director/projects'
//   );
// };

// const getProjectById = async (projectId: number) => {
//   return apiCall<{ success: boolean; message: string; data: Project }>(
//     'GET',
//     `/api/hr-director/projects/${projectId}`
//   );
// };

// const assignTask = async (data: AssignTaskData) => {
//   return apiCall<{ success: boolean; message: string; data: Task }>(
//     'POST',
//     '/api/hr-director/tasks/assign',
//     data
//   );
// };

// const getAllTasks = async () => {
//   return apiCall<{ success: boolean; message: string; data: Task[] }>(
//     'GET',
//     '/api/hr-director/tasks'
//   );
// };

// const getTasksByEmployee = async (employeeUserId: number) => {
//   return apiCall<{ success: boolean; message: string; data: Task[] }>(
//     'GET',
//     `/api/hr-director/tasks/employee/${employeeUserId}`
//   );
// };

// const updateTaskStatus = async (taskId: number, status: string, note: string) => {
//   return apiCall<{ success: boolean; message: string; data: Task }>(
//     'PUT',
//     `/api/hr-director/tasks/${taskId}/status`,
//     { status, note }
//   );
// };

// const getDashboardKPIs = async () => {
//   return apiCall<{ success: boolean; message: string; data: DashboardKPIs }>(
//     'GET',
//     '/api/hr-director/dashboard/kpis'
//   );
// };

// const getAllDepartments = async () => {
//   return apiCall<{ success: boolean; message: string; data: Department[] }>(
//     'GET',
//     '/api/department'
//   );
// };

// // ============================================
// // STATUS CONFIGURATION
// // ============================================

// const statusConfig: Record<string, { label: string; class: string; icon: string; color: string; bgLight: string }> = {
//   APPLIED: { label: 'Applied', class: 'status-pending', icon: '📝', color: '#F59E0B', bgLight: '#FEF3C7' },
//   DOCUMENT_VERIFIED: { label: 'Documents Verified', class: 'status-progress', icon: '✓', color: '#3B82F6', bgLight: '#DBEAFE' },
//   INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', class: 'status-progress', icon: '📅', color: '#8B5CF6', bgLight: '#EDE9FE' },
//   INTERVIEW_PASSED: { label: 'Interview Passed', class: 'status-progress', icon: '🎉', color: '#10B981', bgLight: '#D1FAE5' },
//   INTERVIEW_FAILED: { label: 'Interview Failed', class: 'status-rejected', icon: '❌', color: '#EF4444', bgLight: '#FEE2E2' },
//   APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅', color: '#10B981', bgLight: '#D1FAE5' },
//   REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '🚫', color: '#EF4444', bgLight: '#FEE2E2' },
//   ACTIVE: { label: 'Active', class: 'status-approved', icon: '🟢', color: '#10B981', bgLight: '#D1FAE5' },
//   INACTIVE: { label: 'Inactive', class: 'status-rejected', icon: '⚪', color: '#6B7280', bgLight: '#F3F4F6' },
//   BLOCKED: { label: 'Blocked', class: 'status-rejected', icon: '🔴', color: '#EF4444', bgLight: '#FEE2E2' },
//   CONVERTED_TO_EMPLOYEE: { label: 'Converted to Employee', class: 'status-approved', icon: '💼', color: '#8B5CF6', bgLight: '#EDE9FE' },
//   PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳', color: '#F59E0B', bgLight: '#FEF3C7' },
//   IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄', color: '#3B82F6', bgLight: '#DBEAFE' },
//   COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️', color: '#10B981', bgLight: '#D1FAE5' },
// };

// const getStatusBadge = (status: string) => {
//   const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌', color: '#6B7280', bgLight: '#F3F4F6' };
//   return (
//     <span className={`status-badge ${config.class}`}>
//       <span className="status-icon">{config.icon}</span>
//       {config.label}
//     </span>
//   );
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

// // Loading Spinner Component
// const LoadingSpinner: React.FC<{ size?: 'small' | 'medium' | 'large'; color?: string }> = ({ 
//   size = 'medium', 
//   color = '#2ca6a4' 
// }) => {
//   const sizes = { small: 20, medium: 32, large: 48 };
//   const dimension = sizes[size];
  
//   return (
//     <div className="canvas-loader" style={{ width: dimension, height: dimension }}>
//       <svg viewBox="0 0 50 50" style={{ animation: 'spin 0.8s linear infinite' }}>
//         <circle
//           cx="25"
//           cy="25"
//           r="20"
//           fill="none"
//           stroke={color}
//           strokeWidth="4"
//           strokeLinecap="round"
//           strokeDasharray="80, 200"
//           strokeDashoffset="0"
//           style={{ animation: 'dash 1.5s ease-in-out infinite' }}
//         />
//       </svg>
//     </div>
//   );
// };

// // Toast Notification Component
// const Toast: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 4000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const icons = {
//     success: '✅',
//     error: '❌',
//     warning: '⚠️',
//     info: 'ℹ️'
//   };

//   return (
//     <div className={`toast toast-${toast.type}`}>
//       <span className="toast-icon">{icons[toast.type]}</span>
//       <span className="toast-message">{toast.message}</span>
//       <button className="toast-close" onClick={onClose}>✕</button>
//     </div>
//   );
// };

// // ============================================
// // MAIN HR DIRECTOR COMPONENT
// // ============================================

// const HRDirectorDashboard: React.FC = () => {
//   const { user, logout } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [hasAccess, setHasAccess] = useState(false);
//   const [accessError, setAccessError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [toasts, setToasts] = useState<ToastMessage[]>([]);
//   const [buttonLoading, setButtonLoading] = useState<string | null>(null);

//   // Data states
//   const [dashboardData, setDashboardData] = useState<DashboardKPIs | null>(null);
//   const [consultants, setConsultants] = useState<Consultant[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);

//   // Selected item states
//   const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);

//   // Modal states
//   const [showConsultantDetailModal, setShowConsultantDetailModal] = useState(false);
//   const [showEmployeeDetailModal, setShowEmployeeDetailModal] = useState(false);
//   const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
//   const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
//   const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
//   const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
//   const [showConvertModal, setShowConvertModal] = useState(false);
//   const [showAssignDepartmentModal, setShowAssignDepartmentModal] = useState(false);

//   // Form states
//   const [assignTaskData, setAssignTaskData] = useState<AssignTaskData>({
//     assignedToUserId: 0,
//     description: '',
//     deadline: '',
//   });
//   const [updateStatusData, setUpdateStatusData] = useState<UpdateStatusData>({
//     status: '',
//     note: '',
//   });
//   const [convertData, setConvertData] = useState<ConvertToEmployeeData>({
//     positionName: '',
//     salary: 0,
//     skillSet: '',
//     departmentId: 0,
//     stype: '',
//   });
//   const [assignDepartmentData, setAssignDepartmentData] = useState({
//     departmentId: 0,
//   });
//   const [updateEmployeeData, setUpdateEmployeeData] = useState<Partial<Employee>>({});

//   // Filter states
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   const showToast = (message: string, type: ToastMessage['type']) => {
//     const id = Date.now();
//     setToasts(prev => [...prev, { id, message, type }]);
//   };

//   const removeToast = (id: number) => {
//     setToasts(prev => prev.filter(t => t.id !== id));
//   };

//   useEffect(() => {
//     checkAccessAndLoadData();
//   }, []);

//   const checkAccessAndLoadData = async () => {
//     setLoading(true);
//     try {
//       if (user?.userId) {
//         const accessRes = await checkHRAccess(user.userId.toString());
//         if (accessRes.success && accessRes.data) {
//           setHasAccess(true);
//           await loadAllData();
//         } else {
//           setHasAccess(false);
//           setAccessError(accessRes.message || 'Access denied');
//         }
//       } else {
//         setHasAccess(false);
//         setAccessError('User not authenticated');
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
//       const [kpisRes, consultantsRes, employeesRes, projectsRes, tasksRes, deptsRes] = await Promise.all([
//         getDashboardKPIs().catch(() => ({ data: null })),
//         getAllConsultants().catch(() => ({ data: [] })),
//         getAllEmployees().catch(() => ({ data: [] })),
//         getAllProjects().catch(() => ({ data: [] })),
//         getAllTasks().catch(() => ({ data: [] })),
//         getAllDepartments().catch(() => ({ data: [] })),
//       ]);

//       setDashboardData(kpisRes.data);
//       setConsultants(consultantsRes.data);
//       setEmployees(employeesRes.data);
//       setProjects(projectsRes.data);
//       setTasks(tasksRes.data);
//       setDepartments(deptsRes.data.length ? deptsRes.data : [
//         { departmentId: 1, departmentName: 'Technology' },
//         { departmentId: 2, departmentName: 'Human Resources' },
//         { departmentId: 3, departmentName: 'Sales' },
//         { departmentId: 4, departmentName: 'Marketing' },
//         { departmentId: 5, departmentName: 'Finance' },
//         { departmentId: 6, departmentName: 'Operations' },
//       ]);
//     } catch (error) {
//       console.error('Error loading data:', error);
//       showToast('Failed to load some data', 'warning');
//     }
//   };

//   const handleViewConsultant = async (consultant: Consultant) => {
//     setSelectedConsultant(consultant);
//     setButtonLoading(`history-${consultant.consultantId}`);
//     try {
//       const historyRes = await getConsultantStatusHistory(consultant.consultantId);
//       setStatusHistory(historyRes.data);
//       setShowConsultantDetailModal(true);
//     } catch (error) {
//       console.error('Error loading status history:', error);
//       setStatusHistory([]);
//       setShowConsultantDetailModal(true);
//     } finally {
//       setButtonLoading(null);
//     }
//   };

//   const handleViewEmployee = (employee: Employee) => {
//     setSelectedEmployee(employee);
//     setUpdateEmployeeData({
//       positionName: employee.positionName,
//       salary: employee.salary,
//       skillSet: employee.skillSet,
//       departmentId: employee.departmentId,
//     });
//     setShowEmployeeDetailModal(true);
//   };

//   const handleViewProject = (project: Project) => {
//     setSelectedProject(project);
//     setShowProjectDetailModal(true);
//   };

//   const handleViewTask = (task: Task) => {
//     setSelectedTask(task);
//     setShowTaskDetailModal(true);
//   };

//   const handleUpdateConsultantStatus = async () => {
//     if (!selectedConsultant || !updateStatusData.status) {
//       showToast('Please select a status', 'warning');
//       return;
//     }
//     setButtonLoading('update-status');
//     try {
//       await updateConsultantStatus(
//         selectedConsultant.consultantId,
//         updateStatusData.status,
//         updateStatusData.note
//       );
//       await loadAllData();
//       setShowUpdateStatusModal(false);
//       setUpdateStatusData({ status: '', note: '' });
//       showToast('Status updated successfully', 'success');
//     } catch (error: any) {
//       showToast(error.message || 'Failed to update status', 'error');
//     } finally {
//       setButtonLoading(null);
//     }
//   };

//   const handleAssignDepartment = async () => {
//     if (!selectedConsultant || !assignDepartmentData.departmentId) {
//       showToast('Please select a department', 'warning');
//       return;
//     }
//     setButtonLoading('assign-dept');
//     try {
//       await assignDepartmentToConsultant(
//         selectedConsultant.consultantId,
//         assignDepartmentData.departmentId
//       );
//       await loadAllData();
//       setShowAssignDepartmentModal(false);
//       setAssignDepartmentData({ departmentId: 0 });
//       showToast('Department assigned successfully', 'success');
//     } catch (error: any) {
//       showToast(error.message || 'Failed to assign department', 'error');
//     } finally {
//       setButtonLoading(null);
//     }
//   };

//   const handleConvertToEmployee = async () => {
//     if (!selectedConsultant) return;
//     if (!convertData.positionName || !convertData.salary || !convertData.departmentId) {
//       showToast('Please fill all required fields', 'warning');
//       return;
//     }
//     setButtonLoading('convert');
//     try {
//       await convertConsultantToEmployee(selectedConsultant.consultantId, convertData);
//       await loadAllData();
//       setShowConvertModal(false);
//       setConvertData({ positionName: '', salary: 0, skillSet: '', departmentId: 0, stype: '' });
//       showToast('Consultant converted to employee successfully', 'success');
//     } catch (error: any) {
//       showToast(error.message || 'Failed to convert consultant', 'error');
//     } finally {
//       setButtonLoading(null);
//     }
//   };

//   const handleAssignTask = async () => {
//     if (!assignTaskData.assignedToUserId || !assignTaskData.description || !assignTaskData.deadline) {
//       showToast('Please fill all fields', 'warning');
//       return;
//     }
//     setButtonLoading('assign-task');
//     try {
//       await assignTask(assignTaskData);
//       await loadAllData();
//       setShowAssignTaskModal(false);
//       setAssignTaskData({ assignedToUserId: 0, description: '', deadline: '' });
//       showToast('Task assigned successfully', 'success');
//     } catch (error: any) {
//       showToast(error.message || 'Failed to assign task', 'error');
//     } finally {
//       setButtonLoading(null);
//     }
//   };

//   const handleUpdateEmployee = async () => {
//     if (!selectedEmployee) return;
//     setButtonLoading('update-employee');
//     try {
//       await updateEmployee(selectedEmployee.employeeId, updateEmployeeData);
//       await loadAllData();
//       setShowEmployeeDetailModal(false);
//       showToast('Employee updated successfully', 'success');
//     } catch (error: any) {
//       showToast(error.message || 'Failed to update employee', 'error');
//     } finally {
//       setButtonLoading(null);
//     }
//   };

//   // Filtered data
//   const filteredConsultants = consultants.filter(c => {
//     if (statusFilter !== 'all' && c.currentStatus !== statusFilter) return false;
//     if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
//         !c.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
//     return true;
//   });

//   const filteredEmployees = employees.filter(e => {
//     if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         !e.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
//     return true;
//   });

//   const filteredProjects = projects.filter(p => {
//     if (searchQuery && !p.projectName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
//     return true;
//   });

//   const filteredTasks = tasks.filter(t => {
//     if (statusFilter !== 'all' && t.status !== statusFilter) return false;
//     if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         !t.assignedToUserName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
//     return true;
//   });

//   const kpiCards = [
//     { key: 'totalConsultants', label: 'Total Consultants', icon: '👨‍💻', color: 'blue', value: dashboardData?.totalConsultants || 0 },
//     { key: 'pendingConsultants', label: 'Pending Approval', icon: '⏳', color: 'orange', value: dashboardData?.pendingConsultants || 0 },
//     { key: 'totalEmployees', label: 'Total Employees', icon: '👥', color: 'green', value: dashboardData?.totalEmployees || 0 },
//     { key: 'totalProjects', label: 'Active Projects', icon: '📁', color: 'purple', value: dashboardData?.totalProjects || 0 },
//     { key: 'totalTasks', label: 'Total Tasks', icon: '✅', color: 'teal', value: dashboardData?.totalTasks || 0 },
//     { key: 'conversionRate', label: 'Conversion Rate', icon: '📈', color: 'gold', value: `${dashboardData?.conversionRate || 0}%` },
//   ];

//   if (loading) {
//     return (
//       <div className="client-loader">
//         <div className="loader-spinner"></div>
//         <p>Verifying access...</p>
//       </div>
//     );
//   }

//   if (!hasAccess) {
//     return (
//       <div className="access-denied" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
//         <div className="access-denied-card" style={{ textAlign: 'center', background: 'var(--card-bg)', padding: '2rem', borderRadius: '24px', maxWidth: '400px' }}>
//           <span className="access-denied-icon" style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🔒</span>
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
//     <div className="client-container">
//       {/* Toast Container */}
//       <div className="toast-container">
//         {toasts.map(toast => (
//           <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
//         ))}
//       </div>

//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="sidebar-header">
//           <div className="sidebar-logo">
//             <span className="logo-icon">🏢</span>
//             <span className="logo-text">HR Director</span>
//           </div>
//         </div>

//         <div className="sidebar-user">
//           <div className="sidebar-avatar">
//             {user?.photoUrl ? (
//               <img src={user.photoUrl} alt={user.name} />
//             ) : (
//               <div className="avatar-placeholder">{user?.name?.charAt(0) || 'H'}</div>
//             )}
//           </div>
//           <div className="sidebar-user-info">
//             <h4>{user?.name?.split(' ')[0] || 'HR Director'}</h4>
//             <p>HR Director</p>
//           </div>
//         </div>

//         <nav className="sidebar-nav">
//           <button 
//             className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
//             onClick={() => setActiveTab('dashboard')}
//           >
//             <span className="nav-icon">📊</span>
//             <span>Dashboard</span>
//           </button>
//           <button 
//             className={`sidebar-nav-item ${activeTab === 'consultants' ? 'active' : ''}`}
//             onClick={() => setActiveTab('consultants')}
//           >
//             <span className="nav-icon">👨‍💻</span>
//             <span>Consultants</span>
//             {consultants.filter(c => c.currentStatus === 'APPLIED').length > 0 && (
//               <span className="tab-badge" style={{ marginLeft: 'auto', background: '#f59e0b', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '20px' }}>
//                 {consultants.filter(c => c.currentStatus === 'APPLIED').length}
//               </span>
//             )}
//           </button>
//           <button 
//             className={`sidebar-nav-item ${activeTab === 'employees' ? 'active' : ''}`}
//             onClick={() => setActiveTab('employees')}
//           >
//             <span className="nav-icon">👥</span>
//             <span>Employees</span>
//           </button>
//           <button 
//             className={`sidebar-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
//             onClick={() => setActiveTab('projects')}
//           >
//             <span className="nav-icon">📁</span>
//             <span>Projects</span>
//           </button>
//           <button 
//             className={`sidebar-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
//             onClick={() => setActiveTab('tasks')}
//           >
//             <span className="nav-icon">✅</span>
//             <span>Tasks</span>
//             {tasks.filter(t => t.status === 'PENDING').length > 0 && (
//               <span className="tab-badge" style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '20px' }}>
//                 {tasks.filter(t => t.status === 'PENDING').length}
//               </span>
//             )}
//           </button>
//         </nav>

//         <div className="sidebar-footer">
//           <button className="sidebar-footer-btn logout" onClick={logout}>
//             <span className="nav-icon">🚪</span>
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* Sidebar Overlay for Mobile */}
//       <div className="sidebar-overlay" onClick={() => {}} />

//       {/* Mobile Menu Button */}
//       <button className="mobile-menu-btn" onClick={() => {}}>☰</button>

//       {/* Main Content */}
//       <main className="client-main">
//         <header className="client-header">
//           <div className="header-welcome">
//             <h1>Welcome back, {user?.name?.split(' ')[0] || 'HR Director'}!</h1>
//             <p>Manage consultants, employees, projects, and tasks from one dashboard</p>
//           </div>
//           <div className="header-stats">
//             <div className="header-stat-item">
//               <span className="stat-label">Consultants</span>
//               <span className="stat-value-sm">{consultants.length}</span>
//             </div>
//             <div className="header-stat-item">
//               <span className="stat-label">Employees</span>
//               <span className="stat-value-sm">{employees.length}</span>
//             </div>
//             <div className="header-stat-item">
//               <span className="stat-label">Active Tasks</span>
//               <span className="stat-value-sm">{tasks.filter(t => t.status !== 'COMPLETED').length}</span>
//             </div>
//           </div>
//         </header>

//         {/* Dashboard Tab */}
//         {activeTab === 'dashboard' && dashboardData && (
//           <>
//             {/* Stats Grid */}
//             <div className="stats-grid">
//               <div className="stat-card">
//                 <div className="stat-icon blue">👨‍💻</div>
//                 <div className="stat-info">
//                   <span className="stat-value">{dashboardData.totalConsultants}</span>
//                   <span className="stat-label">Total Consultants</span>
//                 </div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-icon orange">⏳</div>
//                 <div className="stat-info">
//                   <span className="stat-value">{dashboardData.pendingConsultants}</span>
//                   <span className="stat-label">Pending Approval</span>
//                 </div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-icon green">👥</div>
//                 <div className="stat-info">
//                   <span className="stat-value">{dashboardData.totalEmployees}</span>
//                   <span className="stat-label">Total Employees</span>
//                 </div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-icon purple">📁</div>
//                 <div className="stat-info">
//                   <span className="stat-value">{dashboardData.totalProjects}</span>
//                   <span className="stat-label">Active Projects</span>
//                 </div>
//               </div>
//             </div>

//             {/* Dashboard Cards */}
//             <div className="dashboard-card">
//               <div className="card-header">
//                 <h2>Consultants by Status</h2>
//               </div>
//               <div className="status-bars">
//                 {Object.entries(dashboardData.consultantsByStatus).slice(0, 5).map(([status, count]) => (
//                   <div key={status} className="status-bar-item">
//                     <span className="status-name">{getStatusBadge(status)}</span>
//                     <div className="bar-container">
//                       <div className="bar-fill" style={{ width: `${(count / dashboardData.totalConsultants) * 100}%`, backgroundColor: statusConfig[status]?.color || '#6B7280' }} />
//                       <span className="bar-count">{count}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="dashboard-card">
//               <div className="card-header">
//                 <h2>Recent Tasks</h2>
//                 <button className="view-all-link" onClick={() => setActiveTab('tasks')}>View All →</button>
//               </div>
//               <div className="projects-grid">
//                 {tasks.slice(0, 3).map(task => (
//                   <div key={task.taskId} className="project-card">
//                     <div className="project-card-header">
//                       <h3>{task.description.substring(0, 40)}</h3>
//                       {getStatusBadge(task.status)}
//                     </div>
//                     <div className="project-card-meta">
//                       <span>👤 {task.assignedToUserName}</span>
//                       <span>📅 Due: {new Date(task.deadline).toLocaleDateString()}</span>
//                     </div>
//                     <div className="project-card-actions">
//                       <button className="btn-sm btn-outline" onClick={() => handleViewTask(task)}>View</button>
//                     </div>
//                   </div>
//                 ))}
//                 {tasks.length === 0 && <div className="empty-state-small">No tasks available</div>}
//               </div>
//             </div>
//           </>
//         )}

//         {/* Consultants Tab */}
//         {activeTab === 'consultants' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>Consultant Management</h2>
//               <div className="header-filters">
//                 <input
//                   type="text"
//                   placeholder="Search consultants..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="search-input"
//                 />
//                 <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
//                   <option value="all">All Status</option>
//                   <option value="APPLIED">Applied</option>
//                   <option value="DOCUMENT_VERIFIED">Documents Verified</option>
//                   <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
//                   <option value="INTERVIEW_PASSED">Interview Passed</option>
//                   <option value="APPROVED">Approved</option>
//                   <option value="REJECTED">Rejected</option>
//                   <option value="CONVERTED_TO_EMPLOYEE">Converted to Employee</option>
//                 </select>
//               </div>
//             </div>

//             <div className="projects-grid">
//               {filteredConsultants.map((consultant) => (
//                 <div key={consultant.consultantId} className="project-card">
//                   <div className="project-card-header">
//                     <h3>{consultant.name}</h3>
//                     {getStatusBadge(consultant.currentStatus)}
//                   </div>
//                   <p className="project-card-desc">{consultant.email}</p>
//                   <div className="project-card-meta">
//                     <span>🛠️ {consultant.skill?.split(',')[0]}</span>
//                     <span>📅 {consultant.experience}</span>
//                     {consultant.departmentName && <span>🏢 {consultant.departmentName}</span>}
//                   </div>
//                   <div className="project-card-actions">
//                     <button className="btn-sm btn-primary" onClick={() => handleViewConsultant(consultant)}>
//                       {buttonLoading === `history-${consultant.consultantId}` ? <LoadingSpinner size="small" /> : 'View Details'}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredConsultants.length === 0 && (
//               <div className="empty-state">
//                 <span className="empty-icon">👨‍💻</span>
//                 <p>No consultants found</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Employees Tab */}
//         {activeTab === 'employees' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>Employee Management</h2>
//               <input
//                 type="text"
//                 placeholder="Search employees..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-input"
//               />
//             </div>

//             <div className="payments-table">
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Employee</th>
//                     <th>Position</th>
//                     <th>Department</th>
//                     <th>Salary</th>
//                     <th>Status</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredEmployees.map((employee) => (
//                     <tr key={employee.employeeId}>
//                       <td>
//                         <div className="user-cell">
//                           <strong>{employee.name}</strong>
//                           <small>{employee.email}</small>
//                         </div>
//                       </td>
//                       <td>{employee.positionName}</td>
//                       <td>{employee.departmentName}</td>
//                       <td className="amount credit">{formatCurrency(employee.salary)}</td>
//                       <td>
//                         <span className={`type-badge ${employee.isDirectorVerified ? 'credit' : 'pending'}`}>
//                           {employee.isDirectorVerified ? 'Verified' : 'Pending'}
//                         </span>
//                       </td>
//                       <td>
//                         <button className="btn-sm btn-outline" onClick={() => handleViewEmployee(employee)}>
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {filteredEmployees.length === 0 && (
//               <div className="empty-state">
//                 <span className="empty-icon">👥</span>
//                 <p>No employees found</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Projects Tab */}
//         {activeTab === 'projects' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>Project Management</h2>
//               <input
//                 type="text"
//                 placeholder="Search projects..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-input"
//               />
//             </div>

//             <div className="projects-grid">
//               {filteredProjects.map((project) => (
//                 <div key={project.projectId} className="project-card">
//                   <div className="project-card-header">
//                     <h3>{project.projectName}</h3>
//                     {getStatusBadge(project.status)}
//                   </div>
//                   <p className="project-card-desc">{project.projectDescription?.substring(0, 80)}</p>
//                   <div className="project-card-meta">
//                     <span>🏢 {project.departmentName}</span>
//                     <span>👤 {project.clientName}</span>
//                     <span>👔 {project.assignedManagerName}</span>
//                     {project.deadline && <span>📅 {new Date(project.deadline).toLocaleDateString()}</span>}
//                     <span>💰 {formatCurrency(parseFloat(project.cost))}</span>
//                   </div>
//                   <div className="project-card-actions">
//                     <button className="btn-sm btn-primary" onClick={() => handleViewProject(project)}>
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredProjects.length === 0 && (
//               <div className="empty-state">
//                 <span className="empty-icon">📁</span>
//                 <p>No projects found</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Tasks Tab */}
//         {activeTab === 'tasks' && (
//           <div className="dashboard-card full-width">
//             <div className="card-header">
//               <h2>Task Management</h2>
//               <div className="header-filters">
//                 <input
//                   type="text"
//                   placeholder="Search tasks..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="search-input"
//                 />
//                 <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
//                   <option value="all">All Status</option>
//                   <option value="PENDING">Pending</option>
//                   <option value="IN_PROGRESS">In Progress</option>
//                   <option value="COMPLETED">Completed</option>
//                 </select>
//                 <button className="btn-primary" onClick={() => setShowAssignTaskModal(true)}>
//                   + Assign Task
//                 </button>
//               </div>
//             </div>

//             <div className="tasks-table-container">
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Task</th>
//                     <th>Assigned To</th>
//                     <th>Department</th>
//                     <th>Status</th>
//                     <th>Deadline</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredTasks.map((task) => (
//                     <tr key={task.taskId}>
//                       <td className="task-desc-cell">{task.description}</td>
//                       <td>{task.assignedToUserName}</td>
//                       <td>{task.assignedToDepartment}</td>
//                       <td>{getStatusBadge(task.status)}</td>
//                       <td className={new Date(task.deadline) < new Date() ? 'text-danger' : ''}>
//                         {new Date(task.deadline).toLocaleDateString()}
//                       </td>
//                       <td>
//                         <button className="btn-sm btn-outline" onClick={() => handleViewTask(task)}>
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {filteredTasks.length === 0 && (
//               <div className="empty-state">
//                 <span className="empty-icon">✅</span>
//                 <p>No tasks found</p>
//               </div>
//             )}
//           </div>
//         )}

//         <footer className="client-footer">
//           <p>© 2026 HR Director Portal | Powered by Softmax.in</p>
//         </footer>
//       </main>

//       {/* Consultant Detail Modal */}
//       {showConsultantDetailModal && selectedConsultant && (
//         <div className="modal-mask open">
//           <div className="modal-box large">
//             <button className="m-close" onClick={() => setShowConsultantDetailModal(false)}>✕</button>
//             <div className="consultant-profile-header" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
//               <div className="profile-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden' }}>
//                 {selectedConsultant.photoUrl ? (
//                   <img src={selectedConsultant.photoUrl} alt={selectedConsultant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                 ) : (
//                   <div className="avatar-placeholder" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2ca6a4, #1f6da8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '700', color: 'white' }}>
//                     {selectedConsultant.name.charAt(0)}
//                   </div>
//                 )}
//               </div>
//               <div className="profile-info">
//                 <h2 style={{ margin: 0 }}>{selectedConsultant.name}</h2>
//                 <p style={{ margin: '0.25rem 0', color: 'var(--muted)' }}>{selectedConsultant.email}</p>
//                 <div className="profile-badges" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
//                   {getStatusBadge(selectedConsultant.currentStatus)}
//                   {selectedConsultant.departmentName && <span className="dept-badge">🏢 {selectedConsultant.departmentName}</span>}
//                 </div>
//               </div>
//             </div>

//             <div className="project-detail-section" style={{ marginTop: '1.5rem' }}>
//               <div className="detail-row">
//                 <label>Skills</label>
//                 <span>{selectedConsultant.skill}</span>
//               </div>
//               <div className="detail-row">
//                 <label>Experience</label>
//                 <span>{selectedConsultant.experience}</span>
//               </div>
//               <div className="detail-row">
//                 <label>Status History</label>
//                 <div className="timeline">
//                   {statusHistory.length === 0 ? (
//                     <div className="empty-state-small">No status history available</div>
//                   ) : (
//                     statusHistory.map((entry) => (
//                       <div key={entry.statusId} className="history-entry" style={{ padding: '0.5rem', background: 'var(--surface)', borderRadius: '8px', marginBottom: '0.5rem' }}>
//                         <div className="history-time">{formatDate(entry.dateTime)}</div>
//                         <div className="history-status">{getStatusBadge(entry.status)}</div>
//                         {entry.note && <div className="history-note">{entry.note}</div>}
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="modal-actions" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
//               <button className="btn-outline" onClick={() => { setShowConsultantDetailModal(false); setShowAssignDepartmentModal(true); }}>Assign Department</button>
//               <button className="btn-outline" onClick={() => { setShowConsultantDetailModal(false); setShowUpdateStatusModal(true); }}>Update Status</button>
//               <button className="btn-primary" onClick={() => { setShowConsultantDetailModal(false); setShowConvertModal(true); }}>Convert to Employee</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Update Status Modal */}
//       {showUpdateStatusModal && selectedConsultant && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => setShowUpdateStatusModal(false)}>✕</button>
//             <h2>Update Status</h2>
//             <p>{selectedConsultant.name}</p>
//             <div className="m-form">
//               <select value={updateStatusData.status} onChange={(e) => setUpdateStatusData({ ...updateStatusData, status: e.target.value })}>
//                 <option value="">Select Status</option>
//                 <option value="APPLIED">Applied</option>
//                 <option value="DOCUMENT_VERIFIED">Documents Verified</option>
//                 <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
//                 <option value="INTERVIEW_PASSED">Interview Passed</option>
//                 <option value="INTERVIEW_FAILED">Interview Failed</option>
//                 <option value="APPROVED">Approved</option>
//                 <option value="REJECTED">Rejected</option>
//               </select>
//               <textarea placeholder="Note (Optional)" rows={3} value={updateStatusData.note} onChange={(e) => setUpdateStatusData({ ...updateStatusData, note: e.target.value })} />
//               <button className="btn-msub" onClick={handleUpdateConsultantStatus} disabled={buttonLoading === 'update-status'}>
//                 {buttonLoading === 'update-status' ? <LoadingSpinner size="small" /> : 'Update Status'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Assign Department Modal */}
//       {showAssignDepartmentModal && selectedConsultant && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => setShowAssignDepartmentModal(false)}>✕</button>
//             <h2>Assign Department</h2>
//             <p>{selectedConsultant.name}</p>
//             <div className="m-form">
//               <select value={assignDepartmentData.departmentId} onChange={(e) => setAssignDepartmentData({ departmentId: parseInt(e.target.value) })}>
//                 <option value="0">Select Department</option>
//                 {departments.map(dept => <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>)}
//               </select>
//               <button className="btn-msub" onClick={handleAssignDepartment} disabled={buttonLoading === 'assign-dept'}>
//                 {buttonLoading === 'assign-dept' ? <LoadingSpinner size="small" /> : 'Assign Department'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Convert to Employee Modal with stype field */}
//       {showConvertModal && selectedConsultant && (
//         <div className="modal-mask open">
//           <div className="modal-box large">
//             <button className="m-close" onClick={() => setShowConvertModal(false)}>✕</button>
//             <h2>Convert to Employee</h2>
//             <p>{selectedConsultant.name}</p>
//             <div className="m-form">
//               <input type="text" placeholder="Position Name *" value={convertData.positionName} onChange={(e) => setConvertData({ ...convertData, positionName: e.target.value })} />
//               <input type="number" placeholder="Salary (₹) *" value={convertData.salary} onChange={(e) => setConvertData({ ...convertData, salary: parseFloat(e.target.value) })} />
//               <input type="text" placeholder="Skill Set *" value={convertData.skillSet} onChange={(e) => setConvertData({ ...convertData, skillSet: e.target.value })} />
//               <select value={convertData.departmentId} onChange={(e) => setConvertData({ ...convertData, departmentId: parseInt(e.target.value) })}>
//                 <option value="0">Select Department</option>
//                 {departments.map(dept => <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>)}
//               </select>
//               <select value={convertData.stype} onChange={(e) => setConvertData({ ...convertData, stype: e.target.value })}>
//                 <option value="">Regular Employee</option>
//                 <option value="MANAGER">Manager</option>
//                 <option value="DIRECTOR">Director</option>
//               </select>
//               <small>Select role type for special permissions</small>
//               <button className="btn-msub" onClick={handleConvertToEmployee} disabled={buttonLoading === 'convert'}>
//                 {buttonLoading === 'convert' ? <LoadingSpinner size="small" /> : 'Convert to Employee'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Assign Task Modal */}
//       {showAssignTaskModal && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => setShowAssignTaskModal(false)}>✕</button>
//             <h2>Assign New Task</h2>
//             <div className="m-form">
//               <select value={assignTaskData.assignedToUserId} onChange={(e) => setAssignTaskData({ ...assignTaskData, assignedToUserId: parseInt(e.target.value) })}>
//                 <option value="0">Select Employee</option>
//                 {employees.map(emp => <option key={emp.userId} value={emp.userId}>{emp.name} - {emp.positionName}</option>)}
//               </select>
//               <textarea placeholder="Task Description *" rows={3} value={assignTaskData.description} onChange={(e) => setAssignTaskData({ ...assignTaskData, description: e.target.value })} />
//               <input type="datetime-local" value={assignTaskData.deadline} onChange={(e) => setAssignTaskData({ ...assignTaskData, deadline: e.target.value })} />
//               <button className="btn-msub" onClick={handleAssignTask} disabled={buttonLoading === 'assign-task'}>
//                 {buttonLoading === 'assign-task' ? <LoadingSpinner size="small" /> : 'Assign Task'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Employee Detail Modal */}
//       {showEmployeeDetailModal && selectedEmployee && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => setShowEmployeeDetailModal(false)}>✕</button>
//             <h2>Edit Employee</h2>
//             <p>{selectedEmployee.name}</p>
//             <div className="m-form">
//               <input type="text" placeholder="Position Name" value={updateEmployeeData.positionName || ''} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, positionName: e.target.value })} />
//               <input type="number" placeholder="Salary (₹)" value={updateEmployeeData.salary || 0} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, salary: parseFloat(e.target.value) })} />
//               <input type="text" placeholder="Skill Set" value={updateEmployeeData.skillSet || ''} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, skillSet: e.target.value })} />
//               <select value={updateEmployeeData.departmentId || 0} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, departmentId: parseInt(e.target.value) })}>
//                 <option value="0">Select Department</option>
//                 {departments.map(dept => <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>)}
//               </select>
//               <button className="btn-msub" onClick={handleUpdateEmployee} disabled={buttonLoading === 'update-employee'}>
//                 {buttonLoading === 'update-employee' ? <LoadingSpinner size="small" /> : 'Save Changes'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Project Detail Modal */}
//       {showProjectDetailModal && selectedProject && (
//         <div className="modal-mask open">
//           <div className="modal-box large">
//             <button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button>
//             <h2>{selectedProject.projectName}</h2>
//             <div className="project-detail-section">
//               <div className="detail-grid">
//                 <div><label>Status:</label><div>{getStatusBadge(selectedProject.status)}</div></div>
//                 <div><label>Type:</label><span>{selectedProject.projectType}</span></div>
//                 <div><label>Department:</label><span>{selectedProject.departmentName}</span></div>
//                 <div><label>Client:</label><span>{selectedProject.clientName}</span></div>
//                 <div><label>Manager:</label><span>{selectedProject.assignedManagerName}</span></div>
//                 <div><label>Deadline:</label><span>{new Date(selectedProject.deadline).toLocaleDateString()}</span></div>
//                 <div><label>Cost:</label><span className="cost-highlight">{formatCurrency(parseFloat(selectedProject.cost))}</span></div>
//                 <div className="full-width"><label>Description:</label><p>{selectedProject.projectDescription}</p></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Task Detail Modal */}
//       {showTaskDetailModal && selectedTask && (
//         <div className="modal-mask open">
//           <div className="modal-box">
//             <button className="m-close" onClick={() => setShowTaskDetailModal(false)}>✕</button>
//             <h2>Task Details</h2>
//             <div className="task-detail-section">
//               <div className="detail-row"><label>Description</label><span>{selectedTask.description}</span></div>
//               <div className="detail-row"><label>Status</label>{getStatusBadge(selectedTask.status)}</div>
//               <div className="detail-row"><label>Assigned To</label><span>{selectedTask.assignedToUserName}</span></div>
//               <div className="detail-row"><label>Department</label><span>{selectedTask.assignedToDepartment}</span></div>
//               <div className="detail-row"><label>Created By</label><span>{selectedTask.createdByName}</span></div>
//               <div className="detail-row"><label>Deadline</label><span className={new Date(selectedTask.deadline) < new Date() ? 'text-danger' : ''}>{new Date(selectedTask.deadline).toLocaleString()}</span></div>
//               <div className="detail-row"><label>Created At</label><span>{formatDate(selectedTask.createdAt)}</span></div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @import "tailwindcss";

//         /* =====================================================
//            DESIGN TOKENS
//            ===================================================== */
//         :root {
//            --green: #34A853;
//            --teal: #2CA6A4;
//            --blue: #1F6DA8;
//            --orange: #F36C3D;
//            --red: #E74C3C;
//            --g-main: linear-gradient(135deg, #34A853, #2CA6A4, #1F6DA8);
//            --bg: #f5f7fc;
//            --bg2: #ffffff;
//            --bg3: #eef1f8;
//            --surface: rgba(0, 0, 0, .035);
//            --border: #e0e6f0;
//            --text: #0c1018;
//            --text2: #1e2535;
//            --muted: #5e6f8a;
//            --shadow: 0 2px 16px rgba(0, 0, 0, .07);
//            --shadow-lg: 0 8px 40px rgba(0, 0, 0, .11);
//            --card-bg: #ffffff;
//            --font-h: 'Fraunces', Georgia, serif;
//            --font-b: 'DM Sans', system-ui, sans-serif;
//         }

//         /* Toast Container */
//         .toast-container {
//           position: fixed;
//           top: 20px;
//           right: 20px;
//           z-index: 10000;
//           display: flex;
//           flex-direction: column;
//           gap: 10px;
//         }

//         .toast {
//           background: var(--card-bg);
//           border-radius: 12px;
//           padding: 12px 20px;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           box-shadow: var(--shadow-lg);
//           animation: slideInRight 0.3s ease;
//           border-left: 4px solid;
//         }

//         .toast-success { border-left-color: var(--green); }
//         .toast-error { border-left-color: var(--red); }
//         .toast-warning { border-left-color: var(--orange); }
//         .toast-info { border-left-color: var(--blue); }

//         @keyframes slideInRight {
//           from { opacity: 0; transform: translateX(100px); }
//           to { opacity: 1; transform: translateX(0); }
//         }

//         /* Canvas Loader */
//         .canvas-loader {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//         }

//         @keyframes spin {
//           100% { transform: rotate(360deg); }
//         }

//         @keyframes dash {
//           0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
//           50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
//           100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
//         }

//         /* Sidebar Styles */
//         .sidebar {
//           position: fixed;
//           top: 0;
//           left: 0;
//           bottom: 0;
//           width: 280px;
//           background: var(--bg2);
//           border-right: 1px solid var(--border);
//           z-index: 200;
//           display: flex;
//           flex-direction: column;
//         }

//         .sidebar-header {
//           padding: 1.5rem;
//           border-bottom: 1px solid var(--border);
//         }

//         .sidebar-logo {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//         }

//         .sidebar-logo .logo-icon { font-size: 1.5rem; }
//         .sidebar-logo .logo-text {
//           font-family: var(--font-h);
//           font-size: 1.1rem;
//           font-weight: 800;
//           background: var(--g-main);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .sidebar-user {
//           padding: 1.5rem;
//           border-bottom: 1px solid var(--border);
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//         }

//         .sidebar-avatar {
//           width: 48px;
//           height: 48px;
//           border-radius: 50%;
//           overflow: hidden;
//           background: var(--g-main);
//           flex-shrink: 0;
//         }

//         .sidebar-avatar img, .sidebar-avatar .avatar-placeholder {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-size: 1.2rem;
//           font-weight: bold;
//         }

//         .sidebar-user-info h4 {
//           font-size: 0.9rem;
//           font-weight: 700;
//           color: var(--text2);
//           margin-bottom: 0.2rem;
//         }

//         .sidebar-user-info p {
//           font-size: 0.7rem;
//           color: var(--muted);
//         }

//         .sidebar-nav {
//           flex: 1;
//           padding: 1rem;
//           display: flex;
//           flex-direction: column;
//           gap: 0.3rem;
//           overflow-y: auto;
//         }

//         .sidebar-nav::-webkit-scrollbar {
//           width: 4px;
//         }
//         .sidebar-nav::-webkit-scrollbar-track {
//           background: var(--surface);
//           border-radius: 4px;
//         }
//         .sidebar-nav::-webkit-scrollbar-thumb {
//           background: var(--teal);
//           border-radius: 4px;
//         }

//         .sidebar-nav-item {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 0.75rem 1rem;
//           border-radius: 12px;
//           background: transparent;
//           color: var(--text2);
//           font-size: 0.9rem;
//           font-weight: 500;
//           transition: all 0.2s;
//           cursor: pointer;
//           width: 100%;
//           text-align: left;
//         }

//         .sidebar-nav-item:hover { background: var(--surface); color: var(--teal); }
//         .sidebar-nav-item.active { background: var(--g-main); color: white; }
//         .nav-icon { font-size: 1.2rem; }

//         .sidebar-footer {
//           padding: 1rem;
//           border-top: 1px solid var(--border);
//         }

//         .sidebar-footer-btn {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           padding: 0.75rem 1rem;
//           border-radius: 12px;
//           background: transparent;
//           color: var(--text2);
//           font-size: 0.9rem;
//           font-weight: 500;
//           transition: all 0.2s;
//           cursor: pointer;
//           width: 100%;
//           text-align: left;
//         }

//         .sidebar-footer-btn.logout { color: var(--red); }
//         .sidebar-footer-btn.logout:hover { background: rgba(231, 76, 60, 0.1); }

//         /* Main Content */
//         .client-main {
//           flex: 1;
//           margin-left: 280px;
//           padding: 1.5rem;
//           display: flex;
//           flex-direction: column;
//           min-height: 100vh;
//         }

//         .client-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 2rem;
//           padding-bottom: 1rem;
//           border-bottom: 1px solid var(--border);
//           flex-wrap: wrap;
//           gap: 1rem;
//         }

//         .header-welcome h1 {
//           font-family: var(--font-h);
//           font-size: 1.5rem;
//           font-weight: 800;
//           color: var(--text2);
//           margin-bottom: 0.2rem;
//         }

//         .header-welcome p {
//           color: var(--muted);
//           font-size: 0.85rem;
//         }

//         .header-stats {
//           display: flex;
//           gap: 1.5rem;
//           flex-wrap: wrap;
//         }

//         .header-stat-item {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-end;
//           gap: 0.2rem;
//         }

//         .header-stat-item .stat-label {
//           font-size: 0.7rem;
//           color: var(--muted);
//           text-transform: uppercase;
//         }

//         .stat-value-sm {
//           font-size: 0.9rem;
//           font-weight: 600;
//           color: var(--text2);
//         }

//         /* Stats Grid */
//         .stats-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
//           gap: 1rem;
//           margin-bottom: 1.5rem;
//         }

//         .stat-card {
//           background: var(--bg2);
//           color: var(--text2);
//           border: 1px solid var(--border);
//           border-radius: 16px;
//           padding: 1.2rem;
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           transition: transform 0.2s;
//         }

//         .stat-card:hover {
//           transform: translateY(-2px);
//           box-shadow: var(--shadow);
//         }

//         .stat-icon {
//           width: 52px;
//           height: 52px;
//           border-radius: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1.8rem;
//         }

//         .stat-icon.blue { background: rgba(31, 109, 168, 0.1); }
//         .stat-icon.green { background: rgba(52, 168, 83, 0.1); }
//         .stat-icon.orange { background: rgba(245, 124, 0, 0.1); }
//         .stat-icon.purple { background: rgba(106, 90, 205, 0.1); }

//         .stat-info .stat-value {
//           font-family: var(--font-h);
//           font-size: 2rem;
//           font-weight: 900;
//           color: var(--text2);
//           line-height: 1;
//         }

//         .stat-info .stat-label {
//           font-size: 0.75rem;
//           color: var(--muted);
//         }

//         /* Dashboard Card */
//         .dashboard-card {
//           background: var(--bg2);
//           color: var(--text2);
//           border: 1px solid var(--border);
//           border-radius: 20px;
//           padding: 1.5rem;
//           margin-bottom: 1.5rem;
//         }

//         .dashboard-card.full-width { width: 100%; }

//         .card-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           flex-wrap: wrap;
//           gap: 1rem;
//           margin-bottom: 1.2rem;
//           padding-bottom: 1rem;
//           border-bottom: 1px solid var(--border);
//         }

//         .card-header h2 {
//           font-family: var(--font-h);
//           font-size: 1.2rem;
//           font-weight: 800;
//           color: var(--text2);
//           margin: 0;
//         }

//         /* Projects Grid */
//         .projects-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
//           gap: 1rem;
//         }

//         .project-card {
//           background: var(--bg);
//           border: 1px solid var(--border);
//           border-radius: 14px;
//           padding: 1rem;
//           transition: all 0.2s;
//         }

//         .project-card:hover {
//           transform: translateY(-2px);
//           box-shadow: var(--shadow);
//         }

//         .project-card-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           flex-wrap: wrap;
//           gap: 0.5rem;
//           margin-bottom: 0.6rem;
//         }

//         .project-card-header h3 {
//           font-size: 1rem;
//           font-weight: 700;
//           color: var(--text2);
//         }

//         .project-card-desc {
//           font-size: 0.8rem;
//           color: var(--muted);
//           line-height: 1.5;
//           margin-bottom: 0.8rem;
//         }

//         .project-card-meta {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 0.6rem;
//           margin-bottom: 0.6rem;
//           font-size: 0.7rem;
//           color: var(--muted);
//         }

//         .project-card-actions {
//           display: flex;
//           gap: 0.5rem;
//           flex-wrap: wrap;
//         }

//         /* Buttons */
//         .btn-primary {
//           background: var(--g-main);
//           color: white;
//           border: none;
//           padding: 0.5rem 1rem;
//           border-radius: 40px;
//           font-size: 0.8rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .btn-primary:hover:not(:disabled) {
//           transform: translateY(-1px);
//           box-shadow: 0 2px 8px rgba(44, 166, 164, 0.4);
//         }

//         .btn-primary:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }

//         .btn-outline {
//           background: transparent;
//           border: 1px solid var(--border);
//           color: var(--text2);
//           padding: 0.5rem 1rem;
//           border-radius: 40px;
//           font-size: 0.8rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .btn-outline:hover {
//           border-color: var(--teal);
//           color: var(--teal);
//         }

//         .btn-sm {
//           padding: 0.3rem 0.8rem;
//           font-size: 0.7rem;
//         }

//         .btn-msub {
//           padding: 0.82rem;
//           border-radius: 40px;
//           background: var(--g-main);
//           color: white;
//           font-weight: 800;
//           font-size: 0.92rem;
//           cursor: pointer;
//           border: none;
//           margin-top: 0.5rem;
//           transition: all 0.2s;
//           width: 100%;
//         }

//         .btn-msub:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 18px rgba(44, 166, 164, 0.38);
//         }

//         /* Status Badge */
//         .status-badge {
//           display: inline-block;
//           padding: 0.2rem 0.6rem;
//           border-radius: 20px;
//           font-size: 0.7rem;
//           font-weight: 600;
//         }

//         .status-pending { background: rgba(245, 124, 0, 0.1); color: var(--orange); }
//         .status-approved { background: rgba(52, 168, 83, 0.1); color: var(--green); }
//         .status-rejected { background: rgba(231, 76, 60, 0.1); color: var(--red); }
//         .status-progress { background: rgba(44, 166, 164, 0.1); color: var(--teal); }
//         .status-completed { background: rgba(52, 168, 83, 0.1); color: var(--green); }

//         /* Data Table */
//         .data-table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         .data-table th,
//         .data-table td {
//           padding: 0.8rem;
//           text-align: left;
//           border-bottom: 1px solid var(--border);
//         }

//         .data-table th {
//           font-size: 0.75rem;
//           font-weight: 600;
//           color: var(--muted);
//           text-transform: uppercase;
//         }

//         .user-cell strong { font-size: 0.85rem; }
//         .user-cell small { font-size: 0.7rem; color: var(--muted); }

//         .type-badge {
//           display: inline-block;
//           padding: 0.2rem 0.6rem;
//           border-radius: 20px;
//           font-size: 0.7rem;
//           font-weight: 600;
//         }

//         .type-badge.credit { background: rgba(52, 168, 83, 0.1); color: var(--green); }
//         .type-badge.pending { background: rgba(245, 124, 0, 0.1); color: var(--orange); }

//         .amount.credit { color: var(--green); font-weight: 600; }

//         .task-desc-cell {
//           max-width: 300px;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .text-danger { color: var(--red) !important; font-weight: 600; }

//         /* Filters */
//         .header-filters {
//           display: flex;
//           gap: 0.75rem;
//           flex-wrap: wrap;
//           align-items: center;
//         }

//         .filter-select, .search-input {
//           padding: 0.5rem 0.75rem;
//           background: var(--surface);
//           border: 1px solid var(--border);
//           border-radius: 8px;
//           color: var(--text2);
//           font-size: 0.8rem;
//           outline: none;
//           transition: all 0.2s;
//         }

//         .filter-select:focus, .search-input:focus { border-color: var(--teal); }
//         .search-input { min-width: 200px; }

//         /* Modal */
//         .modal-mask {
//           display: none;
//           position: fixed;
//           inset: 0;
//           z-index: 2000;
//           background: rgba(0, 0, 0, 0.48);
//           backdrop-filter: blur(8px);
//           align-items: center;
//           justify-content: center;
//           padding: 1rem;
//         }

//         .modal-mask.open { display: flex; }

//         .modal-box {
//           background: var(--card-bg);
//           border: 1px solid var(--border);
//           border-radius: 22px;
//           padding: 2rem;
//           width: 100%;
//           max-width: 500px;
//           position: relative;
//           box-shadow: var(--shadow-lg);
//           animation: mIn 0.32s ease both;
//         }

//         .modal-box.large { max-width: 700px; }

//         @keyframes mIn {
//           from { opacity: 0; transform: scale(0.94) translateY(8px); }
//           to { opacity: 1; transform: none; }
//         }

//         .m-close {
//           position: absolute;
//           top: 0.95rem;
//           right: 0.95rem;
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           background: var(--surface);
//           border: 1px solid var(--border);
//           color: var(--muted);
//           font-size: 0.8rem;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           transition: all 0.2s;
//         }

//         .m-close:hover {
//           background: var(--red);
//           border-color: var(--red);
//           color: white;
//         }

//         .modal-box h2 {
//           font-family: var(--font-h);
//           font-size: 1.3rem;
//           font-weight: 900;
//           margin-bottom: 0.5rem;
//         }

//         .m-form {
//           display: flex;
//           flex-direction: column;
//           gap: 0.75rem;
//           margin-top: 1rem;
//         }

//         .m-form input, .m-form select, .m-form textarea {
//           background: var(--surface);
//           border: 1.5px solid var(--border);
//           color: var(--text2);
//           padding: 0.72rem 0.95rem;
//           border-radius: 11px;
//           font-family: var(--font-b);
//           font-size: 0.85rem;
//           outline: none;
//           transition: all 0.2s;
//         }

//         .m-form input:focus, .m-form select:focus, .m-form textarea:focus {
//           border-color: var(--teal);
//         }

//         .detail-row { margin-bottom: 0.8rem; }
//         .detail-row label { font-weight: 600; color: var(--muted); display: block; margin-bottom: 0.2rem; font-size: 0.75rem; }
//         .detail-row span { font-size: 0.9rem; color: var(--text2); }

//         .detail-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
//           gap: 0.8rem;
//         }

//         .detail-grid .full-width { grid-column: 1 / -1; }
//         .detail-grid div label { font-weight: 600; font-size: 0.7rem; color: var(--muted); display: block; margin-bottom: 0.2rem; }

//         .cost-highlight {
//           background: linear-gradient(135deg, #2ca6a4, #1e7a78);
//           display: inline-block;
//           padding: 0.2rem 0.6rem;
//           border-radius: 20px;
//           color: white !important;
//           font-size: 0.8rem !important;
//         }

//         .empty-state { text-align: center; padding: 3rem 1rem; color: var(--muted); }
//         .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; opacity: 0.5; }
//         .empty-state-small { text-align: center; padding: 1rem; color: var(--green); background: rgba(52, 168, 83, 0.1); border-radius: 8px; }

//         .client-loader {
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
//           border: 3px solid var(--border);
//           border-top-color: var(--teal);
//           border-radius: 50%;
//           animation: spin 0.8s linear infinite;
//         }

//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }

//         .view-all-link {
//           margin-top: 1rem;
//           color: var(--teal);
//           background: none;
//           border: none;
//           cursor: pointer;
//           font-size: 0.8rem;
//         }

//         /* Status Bars */
//         .status-bars {
//           display: flex;
//           flex-direction: column;
//           gap: 0.75rem;
//         }

//         .status-bar-item {
//           display: flex;
//           align-items: center;
//           gap: 0.75rem;
//           flex-wrap: wrap;
//         }

//         .status-name {
//           width: 140px;
//         }

//         .bar-container {
//           flex: 1;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//         }

//         .bar-fill {
//           height: 8px;
//           border-radius: 4px;
//           transition: width 0.3s;
//         }

//         .bar-count {
//           font-size: 0.75rem;
//           font-weight: 600;
//           min-width: 30px;
//         }

//         /* Mobile Menu */
//         .mobile-menu-btn {
//           display: none;
//           position: fixed;
//           bottom: 1.5rem;
//           right: 1.5rem;
//           width: 50px;
//           height: 50px;
//           border-radius: 50%;
//           background: var(--g-main);
//           border: none;
//           color: white;
//           font-size: 1.5rem;
//           cursor: pointer;
//           z-index: 1001;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//           align-items: center;
//           justify-content: center;
//           transition: all 0.2s;
//         }

//         .client-footer {
//           margin-top: 2rem;
//           padding: 1.5rem;
//           border-top: 1px solid var(--border);
//           text-align: center;
//           color: var(--muted);
//           font-size: 0.8rem;
//         }

//         /* Responsive */
//         @media (max-width: 768px) {
//           .sidebar {
//             transform: translateX(-100%);
//             transition: transform 0.3s ease;
//           }
//           .sidebar.open { transform: translateX(0); }
//           .client-main { margin-left: 0; padding: 1rem; padding-bottom: 80px; }
//           .mobile-menu-btn { display: flex; }
//           .stats-grid { grid-template-columns: repeat(2, 1fr); }
//           .projects-grid { grid-template-columns: 1fr; }
//           .modal-box { max-width: 95%; padding: 1.5rem; }
//         }

//         @media (min-width: 769px) {
//           .sidebar-overlay { display: none !important; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default HRDirectorDashboard;


//@ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// TYPES
// ============================================

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

interface StatusHistoryEntry {
  statusId: number;
  status: string;
  note: string;
  dateTime: string;
}

interface ConsultantDetail extends Consultant {}

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

interface Task {
  taskId: number;
  description: string;
  status: string;
  assignedToUserId: number;
  assignedToUserName: string;
  assignedToDepartment: string;
  createdByUserId: number;
  createdByName: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardKPIs {
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

interface AssignTaskData {
  assignedToUserId: number;
  description: string;
  deadline: string;
}

interface UpdateStatusData {
  status: string;
  note: string;
}

interface ConvertToEmployeeData {
  positionName: string;
  salary: number;
  skillSet: string;
  departmentId: number;
  stype?: string;
}

interface Department {
  departmentId: number;
  departmentName: string;
}

interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const apiCall = async <T,>(
  method: string,
  endpoint: string,
  data?: any,
  headers?: Record<string, string>
): Promise<T> => {
  try {
    const config: any = {
      method,
      url: `${API_BASE}${endpoint}`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
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

const checkHRAccess = async (userId: string) => {
  return apiCall<{ success: boolean; message: string; data: boolean }>(
    'GET',
    `/api/hr-director/check?userId=${userId}`
  );
};

const getAllConsultants = async () => {
  return apiCall<{ success: boolean; message: string; data: Consultant[] }>(
    'GET',
    '/api/hr-director/consultants'
  );
};

const getConsultantById = async (consultantId: number) => {
  return apiCall<{ success: boolean; message: string; data: ConsultantDetail }>(
    'GET',
    `/api/hr-director/consultants/${consultantId}`
  );
};

const getConsultantStatusHistory = async (consultantId: number) => {
  return apiCall<{ success: boolean; message: string; data: StatusHistoryEntry[] }>(
    'GET',
    `/api/hr-director/consultants/${consultantId}/status-history`
  );
};

const updateConsultantStatus = async (consultantId: number, status: string, note: string) => {
  return apiCall<{ success: boolean; message: string; data: any }>(
    'PUT',
    `/api/hr-director/consultants/${consultantId}/status`,
    { status, note }
  );
};

const assignDepartmentToConsultant = async (consultantId: number, departmentId: number) => {
  return apiCall<{ success: boolean; message: string; data: Consultant }>(
    'PUT',
    `/api/hr-director/consultants/${consultantId}/assign-department`,
    { departmentId }
  );
};

const convertConsultantToEmployee = async (consultantId: number, data: ConvertToEmployeeData) => {
  return apiCall<{ success: boolean; message: string; data: Employee }>(
    'POST',
    `/api/hr-director/consultants/${consultantId}/convert-to-employee`,
    data
  );
};

const getAllEmployees = async () => {
  return apiCall<{ success: boolean; message: string; data: Employee[] }>(
    'GET',
    '/api/hr-director/employees'
  );
};

const getEmployeeById = async (employeeId: number) => {
  return apiCall<{ success: boolean; message: string; data: Employee }>(
    'GET',
    `/api/hr-director/employees/${employeeId}`
  );
};

const updateEmployee = async (employeeId: number, data: Partial<Employee>) => {
  return apiCall<{ success: boolean; message: string; data: Employee }>(
    'PUT',
    `/api/hr-director/employees/${employeeId}`,
    data
  );
};

const getAllProjects = async () => {
  return apiCall<{ success: boolean; message: string; data: Project[] }>(
    'GET',
    '/api/hr-director/projects'
  );
};

const getProjectById = async (projectId: number) => {
  return apiCall<{ success: boolean; message: string; data: Project }>(
    'GET',
    `/api/hr-director/projects/${projectId}`
  );
};

const assignTask = async (data: AssignTaskData) => {
  return apiCall<{ success: boolean; message: string; data: Task }>(
    'POST',
    '/api/hr-director/tasks/assign',
    data
  );
};

const getAllTasks = async () => {
  return apiCall<{ success: boolean; message: string; data: Task[] }>(
    'GET',
    '/api/hr-director/tasks'
  );
};

const getTasksByEmployee = async (employeeUserId: number) => {
  return apiCall<{ success: boolean; message: string; data: Task[] }>(
    'GET',
    `/api/hr-director/tasks/employee/${employeeUserId}`
  );
};

const updateTaskStatus = async (taskId: number, status: string, note: string) => {
  return apiCall<{ success: boolean; message: string; data: Task }>(
    'PUT',
    `/api/hr-director/tasks/${taskId}/status`,
    { status, note }
  );
};

const getDashboardKPIs = async () => {
  return apiCall<{ success: boolean; message: string; data: DashboardKPIs }>(
    'GET',
    '/api/hr-director/dashboard/kpis'
  );
};

const getAllDepartments = async () => {
  return apiCall<{ success: boolean; message: string; data: Department[] }>(
    'GET',
    '/api/department'
  );
};

// ============================================
// STATUS CONFIGURATION
// ============================================

const statusConfig: Record<string, { label: string; class: string; icon: string; color: string; bgLight: string }> = {
  APPLIED: { label: 'Applied', class: 'status-pending', icon: '📝', color: '#F59E0B', bgLight: '#FEF3C7' },
  DOCUMENT_VERIFIED: { label: 'Documents Verified', class: 'status-progress', icon: '✓', color: '#3B82F6', bgLight: '#DBEAFE' },
  INTERVIEW_SCHEDULED: { label: 'Interview Scheduled', class: 'status-progress', icon: '📅', color: '#8B5CF6', bgLight: '#EDE9FE' },
  INTERVIEW_PASSED: { label: 'Interview Passed', class: 'status-progress', icon: '🎉', color: '#10B981', bgLight: '#D1FAE5' },
  INTERVIEW_FAILED: { label: 'Interview Failed', class: 'status-rejected', icon: '❌', color: '#EF4444', bgLight: '#FEE2E2' },
  APPROVED: { label: 'Approved', class: 'status-approved', icon: '✅', color: '#10B981', bgLight: '#D1FAE5' },
  REJECTED: { label: 'Rejected', class: 'status-rejected', icon: '🚫', color: '#EF4444', bgLight: '#FEE2E2' },
  ACTIVE: { label: 'Active', class: 'status-approved', icon: '🟢', color: '#10B981', bgLight: '#D1FAE5' },
  INACTIVE: { label: 'Inactive', class: 'status-rejected', icon: '⚪', color: '#6B7280', bgLight: '#F3F4F6' },
  BLOCKED: { label: 'Blocked', class: 'status-rejected', icon: '🔴', color: '#EF4444', bgLight: '#FEE2E2' },
  CONVERTED_TO_EMPLOYEE: { label: 'Converted to Employee', class: 'status-approved', icon: '💼', color: '#8B5CF6', bgLight: '#EDE9FE' },
  PENDING: { label: 'Pending', class: 'status-pending', icon: '⏳', color: '#F59E0B', bgLight: '#FEF3C7' },
  IN_PROGRESS: { label: 'In Progress', class: 'status-progress', icon: '🔄', color: '#3B82F6', bgLight: '#DBEAFE' },
  COMPLETED: { label: 'Completed', class: 'status-completed', icon: '✔️', color: '#10B981', bgLight: '#D1FAE5' },
};

const getStatusBadge = (status: string) => {
  const config = statusConfig[status] || { label: status || 'N/A', class: 'status-pending', icon: '📌', color: '#6B7280', bgLight: '#F3F4F6' };
  return (
    <span className={`status-badge ${config.class}`}>
      <span className="status-icon">{config.icon}</span>
      {config.label}
    </span>
  );
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

// Loading Spinner Component
const LoadingSpinner: React.FC<{ size?: 'small' | 'medium' | 'large'; color?: string }> = ({ 
  size = 'medium', 
  color = '#2ca6a4' 
}) => {
  const sizes = { small: 20, medium: 32, large: 48 };
  const dimension = sizes[size];
  
  return (
    <div className="canvas-loader" style={{ width: dimension, height: dimension }}>
      <svg viewBox="0 0 50 50" style={{ animation: 'spin 0.8s linear infinite' }}>
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80, 200"
          strokeDashoffset="0"
          style={{ animation: 'dash 1.5s ease-in-out infinite' }}
        />
      </svg>
    </div>
  );
};

// Toast Notification Component
const Toast: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
};

// ============================================
// MAIN HR DIRECTOR COMPONENT
// ============================================

const HRDirectorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardKPIs | null>(null);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Selected item states
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);

  // Modal states
  const [showConsultantDetailModal, setShowConsultantDetailModal] = useState(false);
  const [showEmployeeDetailModal, setShowEmployeeDetailModal] = useState(false);
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showAssignDepartmentModal, setShowAssignDepartmentModal] = useState(false);

  // Form states
  const [assignTaskData, setAssignTaskData] = useState<AssignTaskData>({
    assignedToUserId: 0,
    description: '',
    deadline: '',
  });
  const [updateStatusData, setUpdateStatusData] = useState<UpdateStatusData>({
    status: '',
    note: '',
  });
  const [convertData, setConvertData] = useState<ConvertToEmployeeData>({
    positionName: '',
    salary: 0,
    skillSet: '',
    departmentId: 0,
    stype: '',
  });
  const [assignDepartmentData, setAssignDepartmentData] = useState({
    departmentId: 0,
  });
  const [updateEmployeeData, setUpdateEmployeeData] = useState<Partial<Employee>>({});

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const showToast = (message: string, type: ToastMessage['type']) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    checkAccessAndLoadData();
  }, []);

  const checkAccessAndLoadData = async () => {
    setLoading(true);
    try {
      if (user?.userId) {
        const accessRes = await checkHRAccess(user.userId.toString());
        if (accessRes.success && accessRes.data) {
          setHasAccess(true);
          await loadAllData();
        } else {
          setHasAccess(false);
          setAccessError(accessRes.message || 'Access denied');
        }
      } else {
        setHasAccess(false);
        setAccessError('User not authenticated');
      }
    } catch (error: any) {
      console.error('Access check error:', error);
      setHasAccess(false);
      setAccessError(error.message || 'Failed to verify access');
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [kpisRes, consultantsRes, employeesRes, projectsRes, tasksRes, deptsRes] = await Promise.all([
        getDashboardKPIs().catch(() => ({ data: null })),
        getAllConsultants().catch(() => ({ data: [] })),
        getAllEmployees().catch(() => ({ data: [] })),
        getAllProjects().catch(() => ({ data: [] })),
        getAllTasks().catch(() => ({ data: [] })),
        getAllDepartments().catch(() => ({ data: [] })),
      ]);

      setDashboardData(kpisRes.data);
      setConsultants(consultantsRes.data);
      setEmployees(employeesRes.data);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      setDepartments(deptsRes.data.length ? deptsRes.data : [
        { departmentId: 1, departmentName: 'Technology' },
        { departmentId: 2, departmentName: 'Human Resources' },
        { departmentId: 3, departmentName: 'Sales' },
        { departmentId: 4, departmentName: 'Marketing' },
        { departmentId: 5, departmentName: 'Finance' },
        { departmentId: 6, departmentName: 'Operations' },
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Failed to load some data', 'warning');
    }
  };

  const handleViewConsultant = async (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setButtonLoading(`history-${consultant.consultantId}`);
    try {
      const historyRes = await getConsultantStatusHistory(consultant.consultantId);
      setStatusHistory(historyRes.data);
      setShowConsultantDetailModal(true);
    } catch (error) {
      console.error('Error loading status history:', error);
      setStatusHistory([]);
      setShowConsultantDetailModal(true);
    } finally {
      setButtonLoading(null);
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setUpdateEmployeeData({
      positionName: employee.positionName,
      salary: employee.salary,
      skillSet: employee.skillSet,
      departmentId: employee.departmentId,
    });
    setShowEmployeeDetailModal(true);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetailModal(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetailModal(true);
  };

  const handleUpdateConsultantStatus = async () => {
    if (!selectedConsultant || !updateStatusData.status) {
      showToast('Please select a status', 'warning');
      return;
    }
    setButtonLoading('update-status');
    try {
      await updateConsultantStatus(
        selectedConsultant.consultantId,
        updateStatusData.status,
        updateStatusData.note
      );
      await loadAllData();
      setShowUpdateStatusModal(false);
      setUpdateStatusData({ status: '', note: '' });
      showToast('Status updated successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to update status', 'error');
    } finally {
      setButtonLoading(null);
    }
  };

  const handleAssignDepartment = async () => {
    if (!selectedConsultant || !assignDepartmentData.departmentId) {
      showToast('Please select a department', 'warning');
      return;
    }
    setButtonLoading('assign-dept');
    try {
      await assignDepartmentToConsultant(
        selectedConsultant.consultantId,
        assignDepartmentData.departmentId
      );
      await loadAllData();
      setShowAssignDepartmentModal(false);
      setAssignDepartmentData({ departmentId: 0 });
      showToast('Department assigned successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to assign department', 'error');
    } finally {
      setButtonLoading(null);
    }
  };

  const handleConvertToEmployee = async () => {
    if (!selectedConsultant) return;
    if (!convertData.positionName || !convertData.salary || !convertData.departmentId) {
      showToast('Please fill all required fields', 'warning');
      return;
    }
    setButtonLoading('convert');
    try {
      await convertConsultantToEmployee(selectedConsultant.consultantId, convertData);
      await loadAllData();
      setShowConvertModal(false);
      setConvertData({ positionName: '', salary: 0, skillSet: '', departmentId: 0, stype: '' });
      showToast('Consultant converted to employee successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to convert consultant', 'error');
    } finally {
      setButtonLoading(null);
    }
  };

  const handleAssignTask = async () => {
    if (!assignTaskData.assignedToUserId || !assignTaskData.description || !assignTaskData.deadline) {
      showToast('Please fill all fields', 'warning');
      return;
    }
    setButtonLoading('assign-task');
    try {
      await assignTask(assignTaskData);
      await loadAllData();
      setShowAssignTaskModal(false);
      setAssignTaskData({ assignedToUserId: 0, description: '', deadline: '' });
      showToast('Task assigned successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to assign task', 'error');
    } finally {
      setButtonLoading(null);
    }
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;
    setButtonLoading('update-employee');
    try {
      await updateEmployee(selectedEmployee.employeeId, updateEmployeeData);
      await loadAllData();
      setShowEmployeeDetailModal(false);
      showToast('Employee updated successfully', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to update employee', 'error');
    } finally {
      setButtonLoading(null);
    }
  };

  // Filtered data
  const filteredConsultants = consultants.filter(c => {
    if (statusFilter !== 'all' && c.currentStatus !== statusFilter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !c.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredEmployees = employees.filter(e => {
    if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !e.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredProjects = projects.filter(p => {
    if (searchQuery && !p.projectName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.assignedToUserName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="client-loader">
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
    <div className="client-container">
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🏢</span>
            <span className="logo-text">HR Director</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">{user?.name?.charAt(0) || 'H'}</div>
            )}
          </div>
          <div className="sidebar-user-info">
            <h4>{user?.name?.split(' ')[0] || 'HR Director'}</h4>
            <p>HR Director</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'consultants' ? 'active' : ''}`}
            onClick={() => { setActiveTab('consultants'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">👨‍💻</span>
            <span>Consultants</span>
            {consultants.filter(c => c.currentStatus === 'APPLIED').length > 0 && (
              <span className="nav-badge">
                {consultants.filter(c => c.currentStatus === 'APPLIED').length}
              </span>
            )}
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => { setActiveTab('employees'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">👥</span>
            <span>Employees</span>
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => { setActiveTab('projects'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">📁</span>
            <span>Projects</span>
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tasks'); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon">✅</span>
            <span>Tasks</span>
            {tasks.filter(t => t.status === 'PENDING').length > 0 && (
              <span className="nav-badge urgent">
                {tasks.filter(t => t.status === 'PENDING').length}
              </span>
            )}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-footer-btn logout" onClick={logout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay for Mobile */}
      {mobileSidebarOpen && <div className="sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />}

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>☰</button>

      {/* Main Content */}
      <main className="client-main">
        <header className="client-header">
          <div className="header-welcome">
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'HR Director'}!</h1>
            <p>Manage consultants, employees, projects, and tasks from one dashboard</p>
          </div>
          <div className="header-stats">
            <div className="header-stat-item">
              <span className="stat-label">Consultants</span>
              <span className="stat-value-sm">{consultants.length}</span>
            </div>
            <div className="header-stat-item">
              <span className="stat-label">Employees</span>
              <span className="stat-value-sm">{employees.length}</span>
            </div>
            <div className="header-stat-item">
              <span className="stat-label">Active Tasks</span>
              <span className="stat-value-sm">{tasks.filter(t => t.status !== 'COMPLETED').length}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && dashboardData && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue">👨‍💻</div>
                <div className="stat-info">
                  <span className="stat-value">{dashboardData.totalConsultants}</span>
                  <span className="stat-label">Total Consultants</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">⏳</div>
                <div className="stat-info">
                  <span className="stat-value">{dashboardData.pendingConsultants}</span>
                  <span className="stat-label">Pending Approval</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">👥</div>
                <div className="stat-info">
                  <span className="stat-value">{dashboardData.totalEmployees}</span>
                  <span className="stat-label">Total Employees</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">📁</div>
                <div className="stat-info">
                  <span className="stat-value">{dashboardData.totalProjects}</span>
                  <span className="stat-label">Active Projects</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h2>Consultants by Status</h2>
              </div>
              <div className="status-bars">
                {Object.entries(dashboardData.consultantsByStatus).slice(0, 5).map(([status, count]) => (
                  <div key={status} className="status-bar-item">
                    <span className="status-name">{getStatusBadge(status)}</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: `${(count / dashboardData.totalConsultants) * 100}%`, backgroundColor: statusConfig[status]?.color || '#6B7280' }} />
                      <span className="bar-count">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h2>Recent Tasks</h2>
                <button className="view-all-link" onClick={() => setActiveTab('tasks')}>View All →</button>
              </div>
              <div className="projects-grid">
                {tasks.slice(0, 3).map(task => (
                  <div key={task.taskId} className="project-card">
                    <div className="project-card-header">
                      <h3>{task.description.substring(0, 40)}</h3>
                      {getStatusBadge(task.status)}
                    </div>
                    <div className="project-card-meta">
                      <span>👤 {task.assignedToUserName}</span>
                      <span>📅 Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="project-card-actions">
                      <button className="btn-sm btn-outline" onClick={() => handleViewTask(task)}>View</button>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && <div className="empty-state-small">No tasks available</div>}
              </div>
            </div>
          </>
        )}

        {/* Consultants Tab */}
        {activeTab === 'consultants' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>Consultant Management</h2>
              <div className="header-filters">
                <input
                  type="text"
                  placeholder="Search consultants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                  <option value="all">All Status</option>
                  <option value="APPLIED">Applied</option>
                  <option value="DOCUMENT_VERIFIED">Documents Verified</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="INTERVIEW_PASSED">Interview Passed</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CONVERTED_TO_EMPLOYEE">Converted to Employee</option>
                </select>
              </div>
            </div>

            <div className="projects-grid">
              {filteredConsultants.map((consultant) => (
                <div key={consultant.consultantId} className="project-card">
                  <div className="project-card-header">
                    <h3>{consultant.name}</h3>
                    {getStatusBadge(consultant.currentStatus)}
                  </div>
                  <p className="project-card-desc">{consultant.email}</p>
                  <div className="project-card-meta">
                    <span>🛠️ {consultant.skill?.split(',')[0]}</span>
                    <span>📅 {consultant.experience}</span>
                    {consultant.departmentName && <span>🏢 {consultant.departmentName}</span>}
                  </div>
                  <div className="project-card-actions">
                    <button className="btn-sm btn-primary" onClick={() => handleViewConsultant(consultant)}>
                      {buttonLoading === `history-${consultant.consultantId}` ? <LoadingSpinner size="small" /> : 'View Details'}
                    </button>
                    <button className="btn-sm btn-outline" onClick={() => handleViewConsultant(consultant)}>
                      {/* {buttonLoading === `history-${consultant.consultantId}` ? <LoadingSpinner size="small" /> : 'Download'} */}Download
                    </button>
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
        {activeTab === 'employees' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>Employee Management</h2>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="payments-table">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.employeeId}>
                      <td>
                        <div className="user-cell">
                          <strong>{employee.name}</strong>
                          <small>{employee.email}</small>
                        </div>
                      </td>
                      <td>{employee.positionName}</td>
                      <td>{employee.departmentName}</td>
                      <td className="amount credit">{formatCurrency(employee.salary)}</td>
                      <td>
                        <span className={`type-badge ${employee.isDirectorVerified ? 'credit' : 'pending'}`}>
                          {employee.isDirectorVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button className="btn-sm btn-outline" onClick={() => handleViewEmployee(employee)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEmployees.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">👥</span>
                <p>No employees found</p>
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>Project Management</h2>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div key={project.projectId} className="project-card">
                  <div className="project-card-header">
                    <h3>{project.projectName}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  <p className="project-card-desc">{project.projectDescription?.substring(0, 80)}</p>
                  <div className="project-card-meta">
                    <span>🏢 {project.departmentName}</span>
                    <span>👤 {project.clientName}</span>
                    <span>👔 {project.assignedManagerName}</span>
                    {project.deadline && <span>📅 {new Date(project.deadline).toLocaleDateString()}</span>}
                    <span>💰 {formatCurrency(parseFloat(project.cost))}</span>
                  </div>
                  <div className="project-card-actions">
                    <button className="btn-sm btn-primary" onClick={() => handleViewProject(project)}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">📁</span>
                <p>No projects found</p>
              </div>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="dashboard-card full-width">
            <div className="card-header">
              <h2>Task Management</h2>
              <div className="header-filters">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <button className="btn-primary" onClick={() => setShowAssignTaskModal(true)}>
                  + Assign Task
                </button>
              </div>
            </div>

            <div className="tasks-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Assigned To</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.taskId}>
                      <td className="task-desc-cell">{task.description}</td>
                      <td>{task.assignedToUserName}</td>
                      <td>{task.assignedToDepartment}</td>
                      <td>{getStatusBadge(task.status)}</td>
                      <td className={new Date(task.deadline) < new Date() ? 'text-danger' : ''}>
                        {new Date(task.deadline).toLocaleDateString()}
                      </td>
                      <td>
                        <button className="btn-sm btn-outline" onClick={() => handleViewTask(task)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTasks.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">✅</span>
                <p>No tasks found</p>
              </div>
            )}
          </div>
        )}

        <footer className="client-footer"><p>© 2026 Gaurion Bharat | Developed by <a href='https://softmax.in' style={{ color: 'skyblue' }}>Softmax.in</a></p></footer>
      </main>

      {/* ============================================ */}
      {/* CONSULTANT DETAIL MODAL - FIXED WITH SCROLL */}
      {/* ============================================ */}
      {showConsultantDetailModal && selectedConsultant && (
        <div className="modal-mask open" onClick={() => setShowConsultantDetailModal(false)}>
          <div className="modal-box modal-consultant" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowConsultantDetailModal(false)}>✕</button>
            
            <div className="modal-scroll-content">
              <div className="consultant-profile-header">
                <div className="profile-avatar">
                  {selectedConsultant.photoUrl ? (
                    <img src={selectedConsultant.photoUrl} alt={selectedConsultant.name} />
                  ) : (
                    <div className="avatar-placeholder large">{selectedConsultant.name.charAt(0)}</div>
                  )}
                </div>
                <div className="profile-info">
                  <h2>{selectedConsultant.name}</h2>
                  <p className="profile-email">{selectedConsultant.email}</p>
                  <div className="profile-badges">
                    {getStatusBadge(selectedConsultant.currentStatus)}
                    {selectedConsultant.departmentName && (
                      <span className="dept-badge">🏢 {selectedConsultant.departmentName}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>📋 Professional Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Skills</label>
                    <span>{selectedConsultant.skill}</span>
                  </div>
                  <div className="detail-item">
                    <label>Experience</label>
                    <span>{selectedConsultant.experience}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>📜 Status History</h3>
                <div className="status-history-list">
                  {statusHistory.length === 0 ? (
                    <div className="empty-history">No status history available</div>
                  ) : (
                    statusHistory.map((entry) => (
                      <div key={entry.statusId} className="history-item">
                        <div className="history-dot" style={{ backgroundColor: statusConfig[entry.status]?.color }} />
                        <div className="history-content">
                          <div className="history-header">
                            {getStatusBadge(entry.status)}
                            <span className="history-date">{formatDate(entry.dateTime)}</span>
                          </div>
                          {entry.note && <p className="history-note">{entry.note}</p>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer-actions">
              <button className="btn-outline" onClick={() => { setShowConsultantDetailModal(false); setShowAssignDepartmentModal(true); }}>
                📍 Assign Department
              </button>
              <button className="btn-outline" onClick={() => { setShowConsultantDetailModal(false); setShowUpdateStatusModal(true); }}>
                🔄 Update Status
              </button>
              <button className="btn-primary" onClick={() => { setShowConsultantDetailModal(false); setShowConvertModal(true); }}>
                💼 Convert to Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateStatusModal && selectedConsultant && (
        <div className="modal-mask open" onClick={() => setShowUpdateStatusModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowUpdateStatusModal(false)}>✕</button>
            <h2>Update Status</h2>
            <p className="modal-subtitle">{selectedConsultant.name}</p>
            <div className="m-form">
              <select value={updateStatusData.status} onChange={(e) => setUpdateStatusData({ ...updateStatusData, status: e.target.value })}>
                <option value="">Select Status</option>
                <option value="APPLIED">Applied</option>
                <option value="DOCUMENT_VERIFIED">Documents Verified</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="INTERVIEW_PASSED">Interview Passed</option>
                <option value="INTERVIEW_FAILED">Interview Failed</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <textarea placeholder="Note (Optional)" rows={3} value={updateStatusData.note} onChange={(e) => setUpdateStatusData({ ...updateStatusData, note: e.target.value })} />
              <button className="btn-msub" onClick={handleUpdateConsultantStatus} disabled={buttonLoading === 'update-status'}>
                {buttonLoading === 'update-status' ? <LoadingSpinner size="small" /> : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Department Modal */}
      {showAssignDepartmentModal && selectedConsultant && (
        <div className="modal-mask open" onClick={() => setShowAssignDepartmentModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowAssignDepartmentModal(false)}>✕</button>
            <h2>Assign Department</h2>
            <p className="modal-subtitle">{selectedConsultant.name}</p>
            <div className="m-form">
              <select value={assignDepartmentData.departmentId} onChange={(e) => setAssignDepartmentData({ departmentId: parseInt(e.target.value) })}>
                <option value="0">Select Department</option>
                {departments.map(dept => <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>)}
              </select>
              <button className="btn-msub" onClick={handleAssignDepartment} disabled={buttonLoading === 'assign-dept'}>
                {buttonLoading === 'assign-dept' ? <LoadingSpinner size="small" /> : 'Assign Department'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Employee Modal */}
      {showConvertModal && selectedConsultant && (
        <div className="modal-mask open" onClick={() => setShowConvertModal(false)}>
          <div className="modal-box modal-large" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowConvertModal(false)}>✕</button>
            <h2>Convert to Employee</h2>
            <p className="modal-subtitle">{selectedConsultant.name}</p>
            <div className="m-form">
              <input type="text" placeholder="Position Name *" value={convertData.positionName} onChange={(e) => setConvertData({ ...convertData, positionName: e.target.value })} />
              <input type="number" placeholder="Salary (₹) *" value={convertData.salary} onChange={(e) => setConvertData({ ...convertData, salary: parseFloat(e.target.value) })} />
              <input type="text" placeholder="Skill Set *" value={convertData.skillSet} onChange={(e) => setConvertData({ ...convertData, skillSet: e.target.value })} />
              <select value={convertData.departmentId} onChange={(e) => setConvertData({ ...convertData, departmentId: parseInt(e.target.value) })}>
                <option value="0">Select Department</option>
                {departments.map(dept => <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>)}
              </select>
              <select value={convertData.stype} onChange={(e) => setConvertData({ ...convertData, stype: e.target.value })}>
                <option value="">Regular Employee</option>
                <option value="MANAGER">👔 Manager</option>
                <option value="DIRECTOR">🎯 Director</option>
              </select>
              <small className="form-hint">Select role type for special permissions</small>
              <button className="btn-msub" onClick={handleConvertToEmployee} disabled={buttonLoading === 'convert'}>
                {buttonLoading === 'convert' ? <LoadingSpinner size="small" /> : 'Convert to Employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssignTaskModal && (
        <div className="modal-mask open" onClick={() => setShowAssignTaskModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowAssignTaskModal(false)}>✕</button>
            <h2>Assign New Task</h2>
            <div className="m-form">
              <select value={assignTaskData.assignedToUserId} onChange={(e) => setAssignTaskData({ ...assignTaskData, assignedToUserId: parseInt(e.target.value) })}>
                <option value="0">Select Employee</option>
                {employees.map(emp => <option key={emp.userId} value={emp.userId}>{emp.name} - {emp.positionName}</option>)}
              </select>
              <textarea placeholder="Task Description *" rows={3} value={assignTaskData.description} onChange={(e) => setAssignTaskData({ ...assignTaskData, description: e.target.value })} />
              <input type="datetime-local" value={assignTaskData.deadline} onChange={(e) => setAssignTaskData({ ...assignTaskData, deadline: e.target.value })} />
              <button className="btn-msub" onClick={handleAssignTask} disabled={buttonLoading === 'assign-task'}>
                {buttonLoading === 'assign-task' ? <LoadingSpinner size="small" /> : 'Assign Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {showEmployeeDetailModal && selectedEmployee && (
        <div className="modal-mask open" onClick={() => setShowEmployeeDetailModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowEmployeeDetailModal(false)}>✕</button>
            <h2>Edit Employee</h2>
            <p className="modal-subtitle">{selectedEmployee.name}</p>
            <div className="m-form">
              <input type="text" placeholder="Position Name" value={updateEmployeeData.positionName || ''} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, positionName: e.target.value })} />
              <input type="number" placeholder="Salary (₹)" value={updateEmployeeData.salary || 0} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, salary: parseFloat(e.target.value) })} />
              <input type="text" placeholder="Skill Set" value={updateEmployeeData.skillSet || ''} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, skillSet: e.target.value })} />
              <select value={updateEmployeeData.departmentId || 0} onChange={(e) => setUpdateEmployeeData({ ...updateEmployeeData, departmentId: parseInt(e.target.value) })}>
                <option value="0">Select Department</option>
                {departments.map(dept => <option key={dept.departmentId} value={dept.departmentId}>{dept.departmentName}</option>)}
              </select>
              <button className="btn-msub" onClick={handleUpdateEmployee} disabled={buttonLoading === 'update-employee'}>
                {buttonLoading === 'update-employee' ? <LoadingSpinner size="small" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {showProjectDetailModal && selectedProject && (
        <div className="modal-mask open" onClick={() => setShowProjectDetailModal(false)}>
          <div className="modal-box modal-large" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowProjectDetailModal(false)}>✕</button>
            <div className="modal-scroll-content">
              <h2>{selectedProject.projectName}</h2>
              <div className="project-detail-section">
                <div className="detail-grid">
                  <div><label>Status:</label><div>{getStatusBadge(selectedProject.status)}</div></div>
                  <div><label>Type:</label><span>{selectedProject.projectType}</span></div>
                  <div><label>Department:</label><span>{selectedProject.departmentName}</span></div>
                  <div><label>Client:</label><span>{selectedProject.clientName}</span></div>
                  <div><label>Manager:</label><span>{selectedProject.assignedManagerName}</span></div>
                  <div><label>Deadline:</label><span>{new Date(selectedProject.deadline).toLocaleDateString()}</span></div>
                  <div><label>Cost:</label><span className="cost-highlight">{formatCurrency(parseFloat(selectedProject.cost))}</span></div>
                  <div className="full-width"><label>Description:</label><p>{selectedProject.projectDescription}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {showTaskDetailModal && selectedTask && (
        <div className="modal-mask open" onClick={() => setShowTaskDetailModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="m-close" onClick={() => setShowTaskDetailModal(false)}>✕</button>
            <div className="modal-scroll-content">
              <h2>Task Details</h2>
              <div className="task-detail-section">
                <div className="detail-row"><label>Description</label><span>{selectedTask.description}</span></div>
                <div className="detail-row"><label>Status</label>{getStatusBadge(selectedTask.status)}</div>
                <div className="detail-row"><label>Assigned To</label><span>{selectedTask.assignedToUserName}</span></div>
                <div className="detail-row"><label>Department</label><span>{selectedTask.assignedToDepartment}</span></div>
                <div className="detail-row"><label>Created By</label><span>{selectedTask.createdByName}</span></div>
                <div className="detail-row"><label>Deadline</label><span className={new Date(selectedTask.deadline) < new Date() ? 'text-danger' : ''}>{new Date(selectedTask.deadline).toLocaleString()}</span></div>
                <div className="detail-row"><label>Created At</label><span>{formatDate(selectedTask.createdAt)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* =====================================================
           ROOT VARIABLES
           ===================================================== */
        :root {
           --green: #34A853;
           --teal: #2CA6A4;
           --blue: #1F6DA8;
           --orange: #F36C3D;
           --red: #E74C3C;
           --purple: #8B5CF6;
           --g-main: linear-gradient(135deg, #34A853, #2CA6A4, #1F6DA8);
           --bg: #f5f7fc;
           --bg2: #ffffff;
           --bg3: #eef1f8;
           --surface: rgba(0, 0, 0, .035);
           --border: #e0e6f0;
           --text: #0c1018;
           --text2: #1e2535;
           --muted: #5e6f8a;
           --shadow: 0 2px 16px rgba(0, 0, 0, .07);
           --shadow-lg: 0 8px 40px rgba(0, 0, 0, .11);
           --card-bg: #ffffff;
           --font-h: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
           --font-b: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        [data-theme="dark"] {
           --bg: #0f1117;
           --bg2: #1a1d2e;
           --bg3: #111820;
           --surface: rgba(255, 255, 255, .045);
           --border: rgba(255, 255, 255, .09);
           --text: #eef2ff;
           --text2: #c7d0e8;
           --muted: #8895b3;
           --card-bg: #1a1d2e;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: var(--font-b);
          background: var(--bg);
          color: var(--text);
        }

        /* Toast Container */
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .toast {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: var(--shadow-lg);
          animation: slideInRight 0.3s ease;
          border-left: 4px solid;
        }

        .toast-success { border-left-color: var(--green); }
        .toast-error { border-left-color: var(--red); }
        .toast-warning { border-left-color: var(--orange); }
        .toast-info { border-left-color: var(--blue); }

        .toast-icon { font-size: 1.2rem; }
        .toast-message { flex: 1; font-size: 0.85rem; color: var(--text); }
        .toast-close {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: var(--muted);
          padding: 4px;
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Canvas Loader */
        .canvas-loader {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        @keyframes dash {
          0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
          100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
        }

        /* Client Container */
        .client-container {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
        }

        /* Sidebar Styles */
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
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sidebar-logo .logo-icon { font-size: 1.5rem; }
        .sidebar-logo .logo-text {
          font-size: 1.1rem;
          font-weight: 800;
          background: var(--g-main);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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

        .sidebar-avatar img, .sidebar-avatar .avatar-placeholder {
          width: 100%;
          height: 100%;
          object-fit: cover;
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

        .sidebar-nav::-webkit-scrollbar { width: 4px; }
        .sidebar-nav::-webkit-scrollbar-track { background: var(--surface); border-radius: 4px; }
        .sidebar-nav::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 4px; }

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

        .sidebar-nav-item:hover { background: var(--surface); color: var(--teal); }
        .sidebar-nav-item.active { background: var(--g-main); color: white; }
        .nav-icon { font-size: 1.2rem; }

        .nav-badge {
          position: absolute;
          right: 12px;
          background: var(--orange);
          color: white;
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 20px;
        }

        .nav-badge.urgent { background: var(--red); }

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

        .sidebar-footer-btn.logout { color: var(--red); }
        .sidebar-footer-btn.logout:hover { background: rgba(231, 76, 60, 0.1); }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 199;
          display: none;
        }

        /* Main Content */
        .client-main {
          flex: 1;
          margin-left: 280px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
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
        .stat-icon.purple { background: rgba(139, 92, 246, 0.1); }

        .stat-info .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: var(--text2);
          line-height: 1;
        }

        .stat-info .stat-label {
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

        .dashboard-card.full-width { width: 100%; }

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
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text2);
          margin: 0;
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }

        .project-card {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1rem;
          transition: all 0.2s;
        }

        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow);
        }

        .project-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.6rem;
        }

        .project-card-header h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text2);
        }

        .project-card-desc {
          font-size: 0.8rem;
          color: var(--muted);
          line-height: 1.5;
          margin-bottom: 0.8rem;
        }

        .project-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
          font-size: 0.7rem;
          color: var(--muted);
        }

        .project-card-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
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

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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

        .btn-sm {
          padding: 0.3rem 0.8rem;
          font-size: 0.7rem;
        }

        .btn-msub {
          padding: 0.82rem;
          border-radius: 40px;
          background: var(--g-main);
          color: white;
          font-weight: 800;
          font-size: 0.92rem;
          cursor: pointer;
          border: none;
          margin-top: 0.5rem;
          transition: all 0.2s;
          width: 100%;
        }

        .btn-msub:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(44, 166, 164, 0.38);
        }

        /* Status Badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .status-pending { background: rgba(245, 124, 0, 0.1); color: var(--orange); }
        .status-approved { background: rgba(52, 168, 83, 0.1); color: var(--green); }
        .status-rejected { background: rgba(231, 76, 60, 0.1); color: var(--red); }
        .status-progress { background: rgba(44, 166, 164, 0.1); color: var(--teal); }
        .status-completed { background: rgba(52, 168, 83, 0.1); color: var(--green); }

        /* Data Table */
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 0.8rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }

        .data-table th {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
        }

        .user-cell strong { font-size: 0.85rem; display: block; }
        .user-cell small { font-size: 0.7rem; color: var(--muted); }

        .type-badge {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .type-badge.credit { background: rgba(52, 168, 83, 0.1); color: var(--green); }
        .type-badge.pending { background: rgba(245, 124, 0, 0.1); color: var(--orange); }

        .amount.credit { color: var(--green); font-weight: 600; }

        .task-desc-cell {
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .text-danger { color: var(--red) !important; font-weight: 600; }

        /* Filters */
        .header-filters {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-select, .search-input {
          padding: 0.5rem 0.75rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text2);
          font-size: 0.8rem;
          outline: none;
          transition: all 0.2s;
        }

        .filter-select:focus, .search-input:focus { border-color: var(--teal); }
        .search-input { min-width: 200px; }

        /* Modal Styles - FIXED WITH SCROLL */
        .modal-mask {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-mask.open { display: flex; }

        .modal-box {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 24px;
          width: 100%;
          max-width: 550px;
          max-height: 85vh;
          position: relative;
          box-shadow: var(--shadow-lg);
          animation: mIn 0.32s ease both;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-box.modal-large { max-width: 700px; }
        .modal-box.modal-consultant { max-width: 600px; }

        @keyframes mIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to { opacity: 1; transform: none; }
        }

        .m-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--muted);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }

        .m-close:hover {
          background: var(--red);
          border-color: var(--red);
          color: white;
        }

        /* Scrollable Content */
        .modal-scroll-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.8rem;
          max-height: calc(85vh - 80px);
        }

        .modal-scroll-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-scroll-content::-webkit-scrollbar-track {
          background: var(--surface);
          border-radius: 10px;
        }

        .modal-scroll-content::-webkit-scrollbar-thumb {
          background: var(--teal);
          border-radius: 10px;
        }

        .modal-box h2 {
          font-size: 1.3rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
          color: var(--text2);
        }

        .modal-subtitle {
          color: var(--muted);
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }

        .m-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .m-form input, .m-form select, .m-form textarea {
          background: var(--surface);
          border: 1.5px solid var(--border);
          color: var(--text2);
          padding: 0.72rem 0.95rem;
          border-radius: 12px;
          font-size: 0.85rem;
          outline: none;
          transition: all 0.2s;
        }

        .m-form input:focus, .m-form select:focus, .m-form textarea:focus {
          border-color: var(--teal);
        }

        .form-hint {
          font-size: 0.7rem;
          color: var(--muted);
          margin-top: -0.3rem;
        }

        /* Consultant Profile Header */
        .consultant-profile-header {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder.large {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--teal), var(--blue));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
        }

        .profile-info h2 {
          margin: 0;
          font-size: 1.3rem;
          color: var(--text2);
        }

        .profile-email {
          color: var(--muted);
          margin: 0.25rem 0;
          font-size: 0.85rem;
        }

        .profile-badges {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .dept-badge {
          background: rgba(44, 166, 164, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          color: var(--teal);
        }

        /* Detail Section */
        .detail-section {
          margin-bottom: 1.5rem;
        }

        .detail-section h3 {
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          color: var(--teal);
          font-weight: 700;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          background: var(--surface);
          padding: 0.8rem;
          border-radius: 12px;
        }

        .detail-item label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
        }

        .detail-item span {
          font-size: 0.85rem;
          color: var(--text2);
          word-break: break-word;
        }

        /* Status History List */
        .status-history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 300px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .status-history-list::-webkit-scrollbar {
          width: 4px;
        }

        .status-history-list::-webkit-scrollbar-track {
          background: var(--surface);
          border-radius: 4px;
        }

        .status-history-list::-webkit-scrollbar-thumb {
          background: var(--teal);
          border-radius: 4px;
        }

        .history-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.8rem;
          background: var(--surface);
          border-radius: 12px;
        }

        .history-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 0.3rem;
          flex-shrink: 0;
        }

        .history-content {
          flex: 1;
        }

        .history-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.3rem;
        }

        .history-date {
          font-size: 0.7rem;
          color: var(--muted);
        }

        .history-note {
          font-size: 0.75rem;
          color: var(--muted);
          margin-top: 0.25rem;
          padding-left: 0.5rem;
          border-left: 2px solid var(--teal);
        }

        .empty-history {
          text-align: center;
          padding: 1rem;
          color: var(--muted);
          font-size: 0.85rem;
        }

        /* Modal Footer Actions */
        .modal-footer-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          padding: 1rem 1.8rem;
          border-top: 1px solid var(--border);
          background: var(--card-bg);
          flex-wrap: wrap;
        }

        /* Project Detail */
        .project-detail-section {
          width: 100%;
        }

        .detail-row {
          margin-bottom: 0.8rem;
        }

        .detail-row label {
          font-weight: 600;
          color: var(--muted);
          display: block;
          margin-bottom: 0.2rem;
          font-size: 0.75rem;
        }

        .detail-row span {
          font-size: 0.9rem;
          color: var(--text2);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.8rem;
        }

        .detail-grid .full-width { grid-column: 1 / -1; }
        .detail-grid div label { font-weight: 600; font-size: 0.7rem; color: var(--muted); display: block; margin-bottom: 0.2rem; }
        .detail-grid div span { font-size: 0.85rem; color: var(--text2); }

        .cost-highlight {
          background: linear-gradient(135deg, #2ca6a4, #1e7a78);
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          color: white !important;
          font-size: 0.8rem !important;
        }

        .task-detail-section .detail-row {
          margin-bottom: 0.8rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--muted);
        }

        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state-small {
          text-align: center;
          padding: 1rem;
          color: var(--green);
          background: rgba(52, 168, 83, 0.1);
          border-radius: 8px;
        }

        /* Status Bars */
        .status-bars {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .status-bar-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .status-name {
          width: 140px;
        }

        .bar-container {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .bar-fill {
          height: 8px;
          border-radius: 4px;
          transition: width 0.3s;
        }

        .bar-count {
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 30px;
        }

        .view-all-link {
          color: var(--teal);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
        }

        /* Loader */
        .client-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 1rem;
        }

        .loader-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--teal);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .access-denied {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .access-denied-card {
          text-align: center;
          background: var(--card-bg);
          padding: 2rem;
          border-radius: 24px;
          max-width: 400px;
        }

        .access-denied-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        /* Mobile Menu */
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
          transition: all 0.2s;
        }

        .client-footer {
          margin-top: 2rem;
          padding: 1.5rem;
          border-top: 1px solid var(--border);
          text-align: center;
          color: var(--muted);
          font-size: 0.8rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 1000;
          }
          .sidebar.open { transform: translateX(0); }
          .sidebar-overlay {
            display: block;
            z-index: 999;
          }
          .client-main { margin-left: 0; padding: 1rem; padding-bottom: 80px; }
          .mobile-menu-btn { display: flex; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .projects-grid { grid-template-columns: 1fr; }
          .details-grid { grid-template-columns: 1fr; }
          .modal-box { max-width: 95%; }
          .modal-scroll-content { padding: 1.2rem; }
          .modal-footer-actions { padding: 1rem; flex-direction: column; }
          .modal-footer-actions button { width: 100%; }
          .consultant-profile-header { flex-direction: column; text-align: center; }
          .profile-badges { justify-content: center; }
          .header-filters { width: 100%; flex-direction: column; }
          .header-filters input, .header-filters select { width: 100%; }
          .card-header { flex-direction: column; align-items: flex-start; }
        }

        @media (min-width: 769px) {
          .sidebar-overlay { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default HRDirectorDashboard;
