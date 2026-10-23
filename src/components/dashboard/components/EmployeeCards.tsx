"use client";

interface Employee {
  employeeId: number;
  isDirectorVerified: boolean;
  positionName: string;
  salary: number;
  name: string;
  department: string;
  skillSet: string;
  departmentId: number;
  departmentName: string;
}

export default function EmployeeCards({ employees }: { employees: Employee[] }) {
  return (
    <div className="emp-grid">
      {employees.map((emp) => {
        const skills = emp.skillSet.split(",");

        return (
          <div className="card" key={emp.employeeId}>
            
            <div className="emp-header">
              <div className={`emp-avatar ${emp.isDirectorVerified ? "verified" : "pending"}`}>
                👨‍💼
              </div>

              <div>
                <h3>{emp.positionName}</h3>
                <span className="dept-badge">{emp.departmentName}</span>
              </div>
            </div>

            <div className="emp-body">

              <div className="emp-row">
                <span>Name</span>
                <span>{emp?.name}</span>
              </div>

              <div className="emp-row">
                <span>Salary</span>
                <span className="salary">
                  ₹{emp.salary.toLocaleString()}
                </span>
              </div>

              <div className="emp-row">
                <span>Skills</span>
                <div className="skills">
                  {skills.slice(0, 3).map((s, i) => (
                    <span key={i} className="skill">{s.trim()}</span>
                  ))}
                  {skills.length > 3 && (
                    <span className="skill more">+{skills.length - 3}</span>
                  )}
                </div>
              </div>

              <div className="emp-row">
                <span>Status</span>
                <span className={`status ${emp.isDirectorVerified ? "ok" : "pending"}`}>
                  {emp.isDirectorVerified ? "Verified" : "Pending"}
                </span>
              </div>

            </div>

            <div className="emp-footer">
              <span>ID: {emp.employeeId}</span>
              <button>View</button>
            </div>

          </div>
        );
      })}
    </div>
  );
}