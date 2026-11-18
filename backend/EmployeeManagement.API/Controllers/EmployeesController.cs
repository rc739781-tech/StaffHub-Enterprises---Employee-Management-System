using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EmployeeManagement.API.DTOs;
using EmployeeManagement.API.Services;

namespace EmployeeManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        /// <summary>
        /// GET /api/employees - Get list of employees with search, filter, sorting and pagination
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PagedResult<EmployeeDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetEmployees([FromQuery] EmployeeQueryParams queryParams)
        {
            var result = await _employeeService.GetAllEmployeesAsync(queryParams);
            return Ok(ApiResponse<PagedResult<EmployeeDto>>.SuccessResult(result, "Employees retrieved successfully."));
        }

        /// <summary>
        /// GET /api/employees/{id} - Get employee details by ID
        /// </summary>
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<EmployeeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null)
            {
                return NotFound(ApiResponse<object>.FailureResult($"Employee with ID {id} was not found."));
            }

            return Ok(ApiResponse<EmployeeDto>.SuccessResult(employee, "Employee retrieved successfully."));
        }

        /// <summary>
        /// GET /api/employees/department/{departmentId} - Get employees by department
        /// </summary>
        [HttpGet("department/{departmentId:int}")]
        [ProducesResponseType(typeof(ApiResponse<List<EmployeeDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetEmployeesByDepartment(int departmentId)
        {
            var employees = await _employeeService.GetEmployeesByDepartmentAsync(departmentId);
            return Ok(ApiResponse<List<EmployeeDto>>.SuccessResult(employees, "Employees retrieved successfully."));
        }

        /// <summary>
        /// POST /api/employees - Create a new employee
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<EmployeeDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDto createDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<object>.FailureResult("Validation failed.", errors));
            }

            try
            {
                var created = await _employeeService.CreateEmployeeAsync(createDto);
                return CreatedAtAction(nameof(GetEmployeeById), new { id = created.EmployeeId }, ApiResponse<EmployeeDto>.SuccessResult(created, "Employee created successfully."));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.FailureResult(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<object>.FailureResult(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<object>.FailureResult(ex.Message));
            }
        }

        /// <summary>
        /// PUT /api/employees/{id} - Update an existing employee
        /// </summary>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<EmployeeDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(ApiResponse<object>.FailureResult("Validation failed.", errors));
            }

            try
            {
                var updated = await _employeeService.UpdateEmployeeAsync(id, updateDto);
                if (updated == null)
                {
                    return NotFound(ApiResponse<object>.FailureResult($"Employee with ID {id} was not found."));
                }

                return Ok(ApiResponse<EmployeeDto>.SuccessResult(updated, "Employee updated successfully."));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<object>.FailureResult(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<object>.FailureResult(ex.Message));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<object>.FailureResult(ex.Message));
            }
        }

        /// <summary>
        /// DELETE /api/employees/{id} - Delete an employee
        /// </summary>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var success = await _employeeService.DeleteEmployeeAsync(id);
            if (!success)
            {
                return NotFound(ApiResponse<object>.FailureResult($"Employee with ID {id} was not found."));
            }

            return Ok(ApiResponse<bool>.SuccessResult(true, "Employee deleted successfully."));
        }
    }
}
