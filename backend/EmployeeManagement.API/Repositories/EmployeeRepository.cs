using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using EmployeeManagement.API.Data;
using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Models;

namespace EmployeeManagement.API.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public EmployeeRepository(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<PagedResult<EmployeeDto>> GetEmployeesAsync(EmployeeQueryParams queryParams)
        {
            // If requested, demonstrate calling SQL Server Stored Procedure 'sp_GetEmployees'
            if (queryParams.UseStoredProcedure)
            {
                return await GetEmployeesUsingStoredProcedureAsync(queryParams);
            }

            // Otherwise use Entity Framework Core LINQ query
            var query = _context.Employees
                .Include(e => e.Department)
                .AsNoTracking()
                .AsQueryable();

            // Search by Name, Email, or EmployeeId
            if (!string.IsNullOrWhiteSpace(queryParams.Search))
            {
                var search = queryParams.Search.Trim().ToLower();
                query = query.Where(e =>
                    e.FullName.ToLower().Contains(search) ||
                    e.Email.ToLower().Contains(search) ||
                    e.EmployeeId.ToString().Contains(search));
            }

            // Filter by Department
            if (queryParams.DepartmentId.HasValue && queryParams.DepartmentId.Value > 0)
            {
                query = query.Where(e => e.DepartmentId == queryParams.DepartmentId.Value);
            }

            // Filter by Status
            if (!string.IsNullOrWhiteSpace(queryParams.Status) && queryParams.Status != "All")
            {
                query = query.Where(e => e.Status == queryParams.Status);
            }

            // Sort
            query = queryParams.SortBy?.ToLower() switch
            {
                "fullname" => queryParams.IsDescending ? query.OrderByDescending(e => e.FullName) : query.OrderBy(e => e.FullName),
                "email" => queryParams.IsDescending ? query.OrderByDescending(e => e.Email) : query.OrderBy(e => e.Email),
                "salary" => queryParams.IsDescending ? query.OrderByDescending(e => e.Salary) : query.OrderBy(e => e.Salary),
                "joiningdate" => queryParams.IsDescending ? query.OrderByDescending(e => e.JoiningDate) : query.OrderBy(e => e.JoiningDate),
                "department" => queryParams.IsDescending ? query.OrderByDescending(e => e.Department!.DepartmentName) : query.OrderBy(e => e.Department!.DepartmentName),
                "status" => queryParams.IsDescending ? query.OrderByDescending(e => e.Status) : query.OrderBy(e => e.Status),
                _ => queryParams.IsDescending ? query.OrderByDescending(e => e.EmployeeId) : query.OrderBy(e => e.EmployeeId)
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .Select(e => new EmployeeDto
                {
                    EmployeeId = e.EmployeeId,
                    FullName = e.FullName,
                    Email = e.Email,
                    PhoneNumber = e.PhoneNumber,
                    Gender = e.Gender,
                    DateOfBirth = e.DateOfBirth,
                    DepartmentId = e.DepartmentId,
                    DepartmentName = e.Department != null ? e.Department.DepartmentName : "Unassigned",
                    Designation = e.Designation,
                    Salary = e.Salary,
                    JoiningDate = e.JoiningDate,
                    Address = e.Address,
                    Status = e.Status,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt
                })
                .ToListAsync();

            return new PagedResult<EmployeeDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize
            };
        }

        private async Task<PagedResult<EmployeeDto>> GetEmployeesUsingStoredProcedureAsync(EmployeeQueryParams queryParams)
        {
            var list = new List<EmployeeDto>();
            var connectionString = _context.Database.GetConnectionString();

            if (string.IsNullOrEmpty(connectionString))
            {
                // Fallback to LINQ
                queryParams.UseStoredProcedure = false;
                return await GetEmployeesAsync(queryParams);
            }

            try
            {
                using var conn = new SqlConnection(connectionString);
                using var cmd = new SqlCommand("dbo.sp_GetEmployees", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                cmd.Parameters.AddWithValue("@Search", string.IsNullOrWhiteSpace(queryParams.Search) ? DBNull.Value : queryParams.Search);
                cmd.Parameters.AddWithValue("@DepartmentId", queryParams.DepartmentId.HasValue && queryParams.DepartmentId.Value > 0 ? queryParams.DepartmentId.Value : DBNull.Value);
                cmd.Parameters.AddWithValue("@Status", string.IsNullOrWhiteSpace(queryParams.Status) || queryParams.Status == "All" ? DBNull.Value : queryParams.Status);

                await conn.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    list.Add(new EmployeeDto
                    {
                        EmployeeId = reader.GetInt32(reader.GetOrdinal("EmployeeId")),
                        FullName = reader.GetString(reader.GetOrdinal("FullName")),
                        Email = reader.GetString(reader.GetOrdinal("Email")),
                        PhoneNumber = reader.GetString(reader.GetOrdinal("PhoneNumber")),
                        Gender = reader.GetString(reader.GetOrdinal("Gender")),
                        DateOfBirth = reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                        DepartmentId = reader.GetInt32(reader.GetOrdinal("DepartmentId")),
                        DepartmentName = reader.GetString(reader.GetOrdinal("DepartmentName")),
                        Designation = reader.GetString(reader.GetOrdinal("Designation")),
                        Salary = reader.GetDecimal(reader.GetOrdinal("Salary")),
                        JoiningDate = reader.GetDateTime(reader.GetOrdinal("JoiningDate")),
                        Address = reader.GetString(reader.GetOrdinal("Address")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                        UpdatedAt = reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? null : reader.GetDateTime(reader.GetOrdinal("UpdatedAt"))
                    });
                }
            }
            catch
            {
                // Graceful fallback to EF Core if stored procedures not yet installed on local DB
                queryParams.UseStoredProcedure = false;
                return await GetEmployeesAsync(queryParams);
            }

            var total = list.Count;
            var paged = list
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToList();

            return new PagedResult<EmployeeDto>
            {
                Items = paged,
                TotalCount = total,
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize
            };
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            return await _context.Employees
                .Include(e => e.Department)
                .FirstOrDefaultAsync(e => e.EmployeeId == id);
        }

        public async Task<EmployeeDto?> GetEmployeeDetailsByIdAsync(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Department)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.EmployeeId == id);

            if (employee == null) return null;

            return new EmployeeDto
            {
                EmployeeId = employee.EmployeeId,
                FullName = employee.FullName,
                Email = employee.Email,
                PhoneNumber = employee.PhoneNumber,
                Gender = employee.Gender,
                DateOfBirth = employee.DateOfBirth,
                DepartmentId = employee.DepartmentId,
                DepartmentName = employee.Department?.DepartmentName ?? "Unassigned",
                Designation = employee.Designation,
                Salary = employee.Salary,
                JoiningDate = employee.JoiningDate,
                Address = employee.Address,
                Status = employee.Status,
                CreatedAt = employee.CreatedAt,
                UpdatedAt = employee.UpdatedAt
            };
        }

        public async Task<List<EmployeeDto>> GetEmployeesByDepartmentAsync(int departmentId)
        {
            return await _context.Employees
                .Include(e => e.Department)
                .Where(e => e.DepartmentId == departmentId)
                .OrderBy(e => e.FullName)
                .Select(e => new EmployeeDto
                {
                    EmployeeId = e.EmployeeId,
                    FullName = e.FullName,
                    Email = e.Email,
                    PhoneNumber = e.PhoneNumber,
                    Gender = e.Gender,
                    DateOfBirth = e.DateOfBirth,
                    DepartmentId = e.DepartmentId,
                    DepartmentName = e.Department!.DepartmentName,
                    Designation = e.Designation,
                    Salary = e.Salary,
                    JoiningDate = e.JoiningDate,
                    Address = e.Address,
                    Status = e.Status,
                    CreatedAt = e.CreatedAt,
                    UpdatedAt = e.UpdatedAt
                })
                .ToListAsync();
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeEmployeeId = null)
        {
            return await _context.Employees
                .AnyAsync(e => e.Email.ToLower() == email.ToLower() && (!excludeEmployeeId.HasValue || e.EmployeeId != excludeEmployeeId.Value));
        }

        public async Task<Employee> CreateAsync(Employee employee)
        {
            employee.CreatedAt = DateTime.UtcNow;
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        public async Task<Employee?> UpdateAsync(Employee employee)
        {
            var existing = await _context.Employees.FindAsync(employee.EmployeeId);
            if (existing == null) return null;

            existing.FullName = employee.FullName;
            existing.Email = employee.Email;
            existing.PhoneNumber = employee.PhoneNumber;
            existing.Gender = employee.Gender;
            existing.DateOfBirth = employee.DateOfBirth;
            existing.DepartmentId = employee.DepartmentId;
            existing.Designation = employee.Designation;
            existing.Salary = employee.Salary;
            existing.JoiningDate = employee.JoiningDate;
            existing.Address = employee.Address;
            existing.Status = employee.Status;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
