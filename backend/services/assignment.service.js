
const DEPARTMENT_MAP = {
  traffic:      { department: "traffic",     role: "Traffic Control Officer" },
  air_quality:  { department: "environment", role: "Environment Officer" },
  energy:       { department: "energy",      role: "Utility Officer" },
  water:        { department: "utility",     role: "Utility Officer" },
  waste:        { department: "utility",     role: "Waste Management Officer" },
};

const calculatePriorityScore = ({ severity, value, threshold, zoneActiveAlertCount }) => {

  const severityWeight = severity === "critical" ? 60 : severity === "warning" ? 35 : 15;

  const overshootPct = threshold ? Math.max(0, ((value - threshold) / threshold) * 100) : 0;
  const overshootScore = Math.min(overshootPct, 30); 
  const compoundingScore = Math.min(zoneActiveAlertCount * 3, 10);

  const total = severityWeight + overshootScore + compoundingScore;

  return Math.round(Math.min(Math.max(total, 0), 100));
};

const assignAlert = ({ type, severity, value, threshold, zoneActiveAlertCount = 0 }) => {
  const mapping = DEPARTMENT_MAP[type] || { department: "admin", role: "General Officer" };

  const priorityScore = calculatePriorityScore({
    severity,
    value,
    threshold,
    zoneActiveAlertCount,
  });

  return {
    assignedDepartment: mapping.department,
    assignedRole: mapping.role,
    priorityScore,
  };
};

module.exports = { assignAlert, DEPARTMENT_MAP };