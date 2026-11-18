using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Repositories
{
    public interface IEmployeeRepository
    {
        Task<PagedResult<EmployeeDto>> GetEmployeesAsync(EmployeeQueryParams queryParams);
        Task<Employee?> GetByIdAsync(int id);
        Task<EmployeeDto?> GetEmployeeDetailsByIdAsync(int id);
        Task<List<EmployeeDto>> GetEmployeesByDepartmentAsync(int departmentId);
        Task<bool> EmailExistsAsync(string email, int? excludeEmployeeId = null);
        Task<Employee> CreateAsync(Employee employee);
        Task<Employee?> UpdateAsync(Employee employee);
        Task<bool> DeleteAsync(int id);
    }
}
