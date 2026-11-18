using EmployeeManagement.API.DTOs;

namespace EmployeeManagement.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginRequestDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterUserDto registerDto);
    }
}
