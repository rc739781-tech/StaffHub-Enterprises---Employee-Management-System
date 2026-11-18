using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Repositories;

namespace EmployeeManagement.API.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepo;
        private readonly IDepartmentRepository _departmentRepo;

        public EmployeeService(IEmployeeRepository employeeRepo, IDepartmentRepository departmentRepo)
        {
            _employeeRepo = employeeRepo;
            _departmentRepo = departmentRepo;
        }

        public async Task<PagedResult<EmployeeDto>> GetAllEmployeesAsync(EmployeeQueryParams queryParams)
        {
            return await _employeeRepo.GetEmployeesAsync(queryParams);
        }

        public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
        {
            return await _employeeRepo.GetEmployeeDetailsByIdAsync(id);
        }

        public async Task<List<EmployeeDto>> GetEmployeesByDepartmentAsync(int departmentId)
        {
            return await _employeeRepo.GetEmployeesByDepartmentAsync(departmentId);
        }

        public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createDto)
        {
            // 1. Verify Department exists
            var dept = await _departmentRepo.GetByIdAsync(createDto.DepartmentId);
            if (dept == null)
            {
                throw new KeyNotFoundException($"Department with ID {createDto.DepartmentId} does not exist.");
            }

            // 2. Verify Email is unique
            if (await _employeeRepo.EmailExistsAsync(createDto.Email))
            {
                throw new InvalidOperationException($"An employee with email '{createDto.Email}' already exists.");
            }

            // 3. Validate Date of Birth (must be at least 18 years old)
            var age = DateTime.Today.Year - createDto.DateOfBirth.Year;
            if (createDto.DateOfBirth.Date > DateTime.Today.AddYears(-age)) age--;
            if (age < 18)
            {
                throw new ArgumentException("Employee must be at least 18 years old.");
            }

            // 4. Map & Create
            var employee = new Employee
            {
                FullName = createDto.FullName.Trim(),
                Email = createDto.Email.Trim().ToLower(),
                PhoneNumber = createDto.PhoneNumber.Trim(),
                Gender = createDto.Gender,
                DateOfBirth = createDto.DateOfBirth,
                DepartmentId = createDto.DepartmentId,
                Designation = createDto.Designation.Trim(),
                Salary = createDto.Salary,
                JoiningDate = createDto.JoiningDate,
                Address = createDto.Address.Trim(),
                Status = createDto.Status
            };

            var created = await _employeeRepo.CreateAsync(employee);
            var result = await _employeeRepo.GetEmployeeDetailsByIdAsync(created.EmployeeId);
            return result!;
        }

        public async Task<EmployeeDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto updateDto)
        {
            var existing = await _employeeRepo.GetByIdAsync(id);
            if (existing == null)
            {
                return null;
            }

            // 1. Verify Department exists
            var dept = await _departmentRepo.GetByIdAsync(updateDto.DepartmentId);
            if (dept == null)
            {
                throw new KeyNotFoundException($"Department with ID {updateDto.DepartmentId} does not exist.");
            }

            // 2. Verify Email uniqueness (excluding this employee)
            if (await _employeeRepo.EmailExistsAsync(updateDto.Email, id))
            {
                throw new InvalidOperationException($"An employee with email '{updateDto.Email}' already exists.");
            }

            // 3. Map & Update
            existing.FullName = updateDto.FullName.Trim();
            existing.Email = updateDto.Email.Trim().ToLower();
            existing.PhoneNumber = updateDto.PhoneNumber.Trim();
            existing.Gender = updateDto.Gender;
            existing.DateOfBirth = updateDto.DateOfBirth;
            existing.DepartmentId = updateDto.DepartmentId;
            existing.Designation = updateDto.Designation.Trim();
            existing.Salary = updateDto.Salary;
            existing.JoiningDate = updateDto.JoiningDate;
            existing.Address = updateDto.Address.Trim();
            existing.Status = updateDto.Status;

            await _employeeRepo.UpdateAsync(existing);
            return await _employeeRepo.GetEmployeeDetailsByIdAsync(id);
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            return await _employeeRepo.DeleteAsync(id);
        }
    }
}
