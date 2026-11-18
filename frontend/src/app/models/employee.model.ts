export interface Employee {
  employeeId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: 'Male' | 'Female' | 'Other' | string;
  dateOfBirth: string;
  departmentId: number;
  departmentName?: string;
  designation: string;
  salary: number;
  joiningDate: string;
  address: string;
  status: 'Active' | 'Inactive' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  departmentId: number;
  designation: string;
  salary: number;
  joiningDate: string;
  address: string;
  status: string;
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {
}

export interface EmployeeQueryParams {
  search?: string;
  departmentId?: number | null;
  status?: string;
  sortBy?: string;
  isDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
  useStoredProcedure?: boolean;
}
