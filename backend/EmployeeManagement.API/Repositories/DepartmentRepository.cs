using Microsoft.EntityFrameworkCore;
using EmployeeManagement.API.Data;
using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly AppDbContext _context;

        public DepartmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DepartmentDto>> GetAllAsync()
        {
            return await _context.Departments
                .AsNoTracking()
                .Select(d => new DepartmentDto
                {
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.DepartmentName,
                    Description = d.Description,
                    Status = d.Status,
                    EmployeeCount = d.Employees.Count(e => e.Status == "Active"),
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                })
                .OrderBy(d => d.DepartmentName)
                .ToListAsync();
        }

        public async Task<Department?> GetByIdAsync(int id)
        {
            return await _context.Departments.FindAsync(id);
        }

        public async Task<DepartmentDto?> GetDepartmentDetailsByIdAsync(int id)
        {
            return await _context.Departments
                .AsNoTracking()
                .Where(d => d.DepartmentId == id)
                .Select(d => new DepartmentDto
                {
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.DepartmentName,
                    Description = d.Description,
                    Status = d.Status,
                    EmployeeCount = d.Employees.Count(e => e.Status == "Active"),
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> NameExistsAsync(string name, int? excludeId = null)
        {
            return await _context.Departments
                .AnyAsync(d => d.DepartmentName.ToLower() == name.ToLower() && (!excludeId.HasValue || d.DepartmentId != excludeId.Value));
        }

        public async Task<Department> CreateAsync(Department department)
        {
            department.CreatedAt = DateTime.UtcNow;
            await _context.Departments.AddAsync(department);
            await _context.SaveChangesAsync();
            return department;
        }

        public async Task<Department?> UpdateAsync(Department department)
        {
            var existing = await _context.Departments.FindAsync(department.DepartmentId);
            if (existing == null) return null;

            existing.DepartmentName = department.DepartmentName;
            existing.Description = department.Description;
            existing.Status = department.Status;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null) return false;

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> HasEmployeesAsync(int id)
        {
            return await _context.Employees.AnyAsync(e => e.DepartmentId == id);
        }
    }
}
