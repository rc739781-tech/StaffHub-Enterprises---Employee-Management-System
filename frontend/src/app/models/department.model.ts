export interface Department {
  departmentId: number;
  departmentName: string;
  description?: string;
  status: 'Active' | 'Inactive' | string;
  employeeCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentRequest {
  departmentName: string;
  description?: string;
  status: string;
}

export interface UpdateDepartmentRequest {
  departmentName: string;
  description?: string;
  status: string;
}
