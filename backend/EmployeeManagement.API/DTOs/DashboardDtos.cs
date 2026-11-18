namespace EmployeeManagement.API.DTOs
{
    public class DashboardSummaryDto
    {
        public int TotalEmployees { get; set; }
        public int ActiveEmployees { get; set; }
        public int InactiveEmployees { get; set; }
        public int TotalDepartments { get; set; }
        public decimal TotalMonthlyPayroll { get; set; }
        public decimal AverageSalary { get; set; }
        public List<DepartmentStatsDto> DepartmentBreakdown { get; set; } = new List<DepartmentStatsDto>();
        public List<GenderStatsDto> GenderBreakdown { get; set; } = new List<GenderStatsDto>();
        public List<EmployeeDto> RecentEmployees { get; set; } = new List<EmployeeDto>();
    }

    public class DepartmentStatsDto
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public int EmployeeCount { get; set; }
        public decimal Percentage { get; set; }
    }

    public class GenderStatsDto
    {
        public string Gender { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }
}
