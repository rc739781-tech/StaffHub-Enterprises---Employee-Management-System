using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Repositories
{
    public interface IDepartmentRepository
    {
        Task<List<DepartmentDto>> GetAllAsync();
        Task<Department?> GetByIdAsync(int id);
        Task<DepartmentDto?> GetDepartmentDetailsByIdAsync(int id);
        Task<bool> NameExistsAsync(string name, int? excludeId = null);
        Task<Department> CreateAsync(Department department);
        Task<Department?> UpdateAsync(Department department);
        Task<bool> DeleteAsync(int id);
        Task<bool> HasEmployeesAsync(int id);
    }
}
