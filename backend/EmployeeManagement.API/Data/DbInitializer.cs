using System.Security.Cryptography;
using System.Text;
using EmployeeManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.API.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(AppDbContext context)
        {
            // Ensure Database is created
            await context.Database.EnsureCreatedAsync();

            // Seed Users if not existing
            if (!await context.Users.AnyAsync())
            {
                var adminUser = new User
                {
                    Username = "admin",
                    Email = "admin@company.com",
                    PasswordHash = HashPassword("Admin@123"),
                    FullName = "System Administrator",
                    Role = "Admin",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var hrUser = new User
                {
                    Username = "hr_manager",
                    Email = "hr@company.com",
                    PasswordHash = HashPassword("Admin@123"),
                    FullName = "Sarah Jenkins (HR)",
                    Role = "HR",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await context.Users.AddRangeAsync(adminUser, hrUser);
                await context.SaveChangesAsync();
            }

            // Seed Departments if not existing
            if (!await context.Departments.AnyAsync())
            {
                var departments = new List<Department>
                {
                    new() { DepartmentName = "Software Engineering", Description = "Core product development and cloud infrastructure", Status = "Active", CreatedAt = DateTime.UtcNow },
                    new() { DepartmentName = "Human Resources", Description = "Talent acquisition, relations and workplace culture", Status = "Active", CreatedAt = DateTime.UtcNow },
                    new() { DepartmentName = "Finance & Accounts", Description = "Financial planning, auditing, and payroll management", Status = "Active", CreatedAt = DateTime.UtcNow },
                    new() { DepartmentName = "Marketing & Sales", Description = "Brand growth, marketing campaigns, and client sales", Status = "Active", CreatedAt = DateTime.UtcNow },
                    new() { DepartmentName = "Quality Assurance", Description = "Testing automation, code reliability, and QA standards", Status = "Active", CreatedAt = DateTime.UtcNow }
                };

                await context.Departments.AddRangeAsync(departments);
                await context.SaveChangesAsync();
            }

            // Seed Employees if not existing
            if (!await context.Employees.AnyAsync())
            {
                var depts = await context.Departments.ToListAsync();
                var devDept = depts.FirstOrDefault(d => d.DepartmentName == "Software Engineering")?.DepartmentId ?? 1;
                var hrDept = depts.FirstOrDefault(d => d.DepartmentName == "Human Resources")?.DepartmentId ?? 2;
                var finDept = depts.FirstOrDefault(d => d.DepartmentName == "Finance & Accounts")?.DepartmentId ?? 3;
                var mktDept = depts.FirstOrDefault(d => d.DepartmentName == "Marketing & Sales")?.DepartmentId ?? 4;
                var qaDept = depts.FirstOrDefault(d => d.DepartmentName == "Quality Assurance")?.DepartmentId ?? 5;

                var employees = new List<Employee>
                {
                    new()
                    {
                        FullName = "Alex Morgan",
                        Email = "alex.morgan@company.com",
                        PhoneNumber = "+1-555-0101",
                        Gender = "Male",
                        DateOfBirth = new DateTime(1992, 4, 15),
                        DepartmentId = devDept,
                        Designation = "Senior Full Stack Lead",
                        Salary = 92000.00m,
                        JoiningDate = new DateTime(2021, 3, 1),
                        Address = "742 Evergreen Terrace, Springfield, OR",
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        FullName = "Emily Chen",
                        Email = "emily.chen@company.com",
                        PhoneNumber = "+1-555-0102",
                        Gender = "Female",
                        DateOfBirth = new DateTime(1995, 8, 22),
                        DepartmentId = devDept,
                        Designation = "Frontend Angular Specialist",
                        Salary = 74000.00m,
                        JoiningDate = new DateTime(2022, 6, 15),
                        Address = "124 Conch Street, Seattle, WA",
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        FullName = "David Miller",
                        Email = "david.miller@company.com",
                        PhoneNumber = "+1-555-0103",
                        Gender = "Male",
                        DateOfBirth = new DateTime(1989, 11, 5),
                        DepartmentId = hrDept,
                        Designation = "HR Business Partner",
                        Salary = 68000.00m,
                        JoiningDate = new DateTime(2020, 1, 10),
                        Address = "405 Madison Avenue, New York, NY",
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        FullName = "Sophia Rodriguez",
                        Email = "sophia.r@company.com",
                        PhoneNumber = "+1-555-0104",
                        Gender = "Female",
                        DateOfBirth = new DateTime(1993, 2, 18),
                        DepartmentId = finDept,
                        Designation = "Senior Financial Analyst",
                        Salary = 85000.00m,
                        JoiningDate = new DateTime(2021, 9, 1),
                        Address = "888 Brickell Bay Dr, Miami, FL",
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        FullName = "Liam Johnson",
                        Email = "liam.johnson@company.com",
                        PhoneNumber = "+1-555-0105",
                        Gender = "Male",
                        DateOfBirth = new DateTime(1996, 7, 30),
                        DepartmentId = mktDept,
                        Designation = "Growth Marketing Specialist",
                        Salary = 62000.00m,
                        JoiningDate = new DateTime(2023, 2, 1),
                        Address = "500 Market St, San Francisco, CA",
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        FullName = "Olivia Taylor",
                        Email = "olivia.taylor@company.com",
                        PhoneNumber = "+1-555-0106",
                        Gender = "Female",
                        DateOfBirth = new DateTime(1994, 12, 12),
                        DepartmentId = qaDept,
                        Designation = "Lead QA Automation Engineer",
                        Salary = 78000.00m,
                        JoiningDate = new DateTime(2022, 11, 20),
                        Address = "300 Congress Ave, Austin, TX",
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        FullName = "Ethan Wright",
                        Email = "ethan.wright@company.com",
                        PhoneNumber = "+1-555-0107",
                        Gender = "Male",
                        DateOfBirth = new DateTime(1991, 5, 27),
                        DepartmentId = devDept,
                        Designation = ".NET Core Backend Architect",
                        Salary = 98000.00m,
                        JoiningDate = new DateTime(2019, 8, 15),
                        Address = "100 North Michigan, Chicago, IL",
                        Status = "Active",
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        FullName = "Isabella Davis",
                        Email = "isabella.davis@company.com",
                        PhoneNumber = "+1-555-0110",
                        Gender = "Female",
                        DateOfBirth = new DateTime(1997, 10, 3),
                        DepartmentId = mktDept,
                        Designation = "Brand Strategy Coordinator",
                        Salary = 58000.00m,
                        JoiningDate = new DateTime(2023, 5, 15),
                        Address = "700 Boylston St, Boston, MA",
                        Status = "Inactive",
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await context.Employees.AddRangeAsync(employees);
                await context.SaveChangesAsync();
            }
        }

        public static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            var builder = new StringBuilder();
            foreach (var b in bytes)
            {
                builder.Append(b.ToString("x2"));
            }
            return builder.ToString();
        }
    }
}
