using Microsoft.EntityFrameworkCore;
using EmployeeManagement.API.Data;
using EmployeeManagement.API.DTOs;

namespace EmployeeManagement.API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardSummaryDto> GetDashboardMetricsAsync()
        {
            var totalEmployees = await _context.Employees.CountAsync();
            var activeEmployees = await _context.Employees.CountAsync(e => e.Status == "Active");
            var inactiveEmployees = await _context.Employees.CountAsync(e => e.Status == "Inactive");
            var totalDepartments = await _context.Departments.CountAsync(d => d.Status == "Active");

            var activeSalaries = await _context.Employees
                .Where(e => e.Status == "Active")
                .Select(e => e.Salary)
                .ToListAsync();

            var totalPayroll = activeSalaries.Sum();
            var avgSalary = activeEmployees > 0 ? (totalPayroll / activeEmployees) : 0;

            // Department Breakdown
            var deptStats = await _context.Departments
                .Select(d => new
                {
                    d.DepartmentId,
                    d.DepartmentName,
                    Count = d.Employees.Count(e => e.Status == "Active")
                })
                .OrderByDescending(d => d.Count)
                .ToListAsync();

            var departmentBreakdown = deptStats.Select(d => new DepartmentStatsDto
            {
                DepartmentId = d.DepartmentId,
                DepartmentName = d.DepartmentName,
                EmployeeCount = d.Count,
                Percentage = activeEmployees > 0 ? Math.Round(((decimal)d.Count / activeEmployees) * 100, 1) : 0
            }).ToList();

            // Gender Breakdown
            var genderGroups = await _context.Employees
                .Where(e => e.Status == "Active")
                .GroupBy(e => e.Gender)
                .Select(g => new { Gender = g.Key, Count = g.Count() })
                .ToListAsync();

            var genderBreakdown = genderGroups.Select(g => new GenderStatsDto
            {
                Gender = g.Gender,
                Count = g.Count,
                Percentage = activeEmployees > 0 ? Math.Round(((decimal)g.Count / activeEmployees) * 100, 1) : 0
            }).ToList();

            // Recent Employees (top 5)
            var recentEmployees = await _context.Employees
                .Include(e => e.Department)
                .OrderByDescending(e => e.CreatedAt)
                .Take(5)
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

            return new DashboardSummaryDto
            {
                TotalEmployees = totalEmployees,
                ActiveEmployees = activeEmployees,
                InactiveEmployees = inactiveEmployees,
                TotalDepartments = totalDepartments,
                TotalMonthlyPayroll = totalPayroll,
                AverageSalary = Math.Round(avgSalary, 2),
                DepartmentBreakdown = departmentBreakdown,
                GenderBreakdown = genderBreakdown,
                RecentEmployees = recentEmployees
            };
        }
    }
}
