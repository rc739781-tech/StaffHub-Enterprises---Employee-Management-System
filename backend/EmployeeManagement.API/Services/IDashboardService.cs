using EmployeeManagement.API.DTOs;

namespace EmployeeManagement.API.Services
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetDashboardMetricsAsync();
    }
}
