using EmployeeManagement.API.DTOs;

namespace EmployeeManagement.API.Services
{
    public interface IEmployeeService
    {
        Task<PagedResult<EmployeeDto>> GetAllEmployeesAsync(EmployeeQueryParams queryParams);
        Task<EmployeeDto?> GetEmployeeByIdAsync(int id);
        Task<List<EmployeeDto>> GetEmployeesByDepartmentAsync(int departmentId);
        Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createDto);
        Task<EmployeeDto?> UpdateEmployeeAsync(int id, UpdateEmployeeDto updateDto);
        Task<bool> DeleteEmployeeAsync(int id);
    }
}
