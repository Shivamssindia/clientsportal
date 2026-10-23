// ProjectCard.tsx
import React from 'react';

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
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onAIAnalyze: (project: Project) => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onViewDetails, 
  onAIAnalyze, 
  getStatusBadge 
}) => {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <h3>{project.projectName}</h3>
        {getStatusBadge(project.status)}
      </div>
      <p className="project-card-desc">
        {project.projectDescription?.substring(0, 80)}...
      </p>
      <div className="project-card-meta">
        <span>👥 {project.clientName}</span>
        <span>📱 {project.projectType}</span>
      </div>
      <div className="project-card-actions">
        <button 
          className="btn-sm btn-primary" 
          onClick={() => onViewDetails(project)}
        >
          View Details
        </button>
        <button 
          className="btn-sm btn-outline" 
          onClick={() => onAIAnalyze(project)}
        >
          🤖 AI Analyze
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;