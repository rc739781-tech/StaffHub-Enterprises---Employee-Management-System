using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Models;
using EmployeeManagement.API.Repositories;

namespace EmployeeManagement.API.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepo;

        public DepartmentService(IDepartmentRepository departmentRepo)
        {
            _departmentRepo = departmentRepo;
        }

        public async Task<List<DepartmentDto>> GetAllDepartmentsAsync()
        {
            return await _departmentRepo.GetAllAsync();
        }

        public async Task<DepartmentDto?> GetDepartmentByIdAsync(int id)
        {
            return await _departmentRepo.GetDepartmentDetailsByIdAsync(id);
        }

        public async Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentDto createDto)
        {
            if (await _departmentRepo.NameExistsAsync(createDto.DepartmentName))
            {
                throw new InvalidOperationException($"Department with name '{createDto.DepartmentName}' already exists.");
            }

            var department = new Department
            {
                DepartmentName = createDto.DepartmentName.Trim(),
                Description = createDto.Description?.Trim(),
                Status = createDto.Status
            };

            var created = await _departmentRepo.CreateAsync(department);
            return (await _departmentRepo.GetDepartmentDetailsByIdAsync(created.DepartmentId))!;
        }

        public async Task<DepartmentDto?> UpdateDepartmentAsync(int id, UpdateDepartmentDto updateDto)
        {
            var existing = await _departmentRepo.GetByIdAsync(id);
            if (existing == null)
            {
                return null;
            }

            if (await _departmentRepo.NameExistsAsync(updateDto.DepartmentName, id))
            {
                throw new InvalidOperationException($"Department with name '{updateDto.DepartmentName}' already exists.");
            }

            existing.DepartmentName = updateDto.DepartmentName.Trim();
            existing.Description = updateDto.Description?.Trim();
            existing.Status = updateDto.Status;

            await _departmentRepo.UpdateAsync(existing);
            return await _departmentRepo.GetDepartmentDetailsByIdAsync(id);
        }

        public async Task<bool> DeleteDepartmentAsync(int id)
        {
            // Check if department has active employees
            if (await _departmentRepo.HasEmployeesAsync(id))
            {
                throw new InvalidOperationException("Cannot delete department because it still has assigned employees. Reassign or remove employees first.");
            }

            return await _departmentRepo.DeleteAsync(id);
        }
    }
}
