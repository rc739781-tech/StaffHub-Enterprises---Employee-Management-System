import { Employee } from './employee.model';

export interface DepartmentStat {
  departmentId: number;
  departmentName: string;
  employeeCount: number;
  percentage: number;
}

export interface GenderStat {
  gender: string;
  count: number;
  percentage: number;
}

export interface DashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  totalMonthlyPayroll: number;
  averageSalary: number;
  departmentBreakdown: DepartmentStat[];
  genderBreakdown: GenderStat[];
  recentEmployees: Employee[];
}
