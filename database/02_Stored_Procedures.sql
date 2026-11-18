-- ==========================================================
-- Employee Management System - Stored Procedures
-- DBMS: Microsoft SQL Server
-- ==========================================================

USE EmployeeManagementDB;
GO

-- 1. STORED PROCEDURE: sp_GetEmployees (Search, Filter, Sort & Join Department)
CREATE OR ALTER PROCEDURE [dbo].[sp_GetEmployees]
    @Search NVARCHAR(100) = NULL,
    @DepartmentId INT = NULL,
    @Status NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        e.[EmployeeId],
        e.[FullName],
        e.[Email],
        e.[PhoneNumber],
        e.[Gender],
        e.[DateOfBirth],
        e.[DepartmentId],
        d.[DepartmentName],
        e.[Designation],
        e.[Salary],
        e.[JoiningDate],
        e.[Address],
        e.[Status],
        e.[CreatedAt],
        e.[UpdatedAt]
    FROM [dbo].[Employees] e
    INNER JOIN [dbo].[Departments] d ON e.[DepartmentId] = d.[DepartmentId]
    WHERE 
        (@Search IS NULL OR e.[FullName] LIKE '%' + @Search + '%' OR CAST(e.[EmployeeId] AS NVARCHAR) LIKE '%' + @Search + '%' OR e.[Email] LIKE '%' + @Search + '%')
        AND (@DepartmentId IS NULL OR e.[DepartmentId] = @DepartmentId)
        AND (@Status IS NULL OR e.[Status] = @Status)
    ORDER BY e.[EmployeeId] DESC;
END
GO

-- 2. STORED PROCEDURE: sp_GetEmployeeById
CREATE OR ALTER PROCEDURE [dbo].[sp_GetEmployeeById]
    @EmployeeId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        e.[EmployeeId],
        e.[FullName],
        e.[Email],
        e.[PhoneNumber],
        e.[Gender],
        e.[DateOfBirth],
        e.[DepartmentId],
        d.[DepartmentName],
        e.[Designation],
        e.[Salary],
        e.[JoiningDate],
        e.[Address],
        e.[Status],
        e.[CreatedAt],
        e.[UpdatedAt]
    FROM [dbo].[Employees] e
    INNER JOIN [dbo].[Departments] d ON e.[DepartmentId] = d.[DepartmentId]
    WHERE e.[EmployeeId] = @EmployeeId;
END
GO

-- 3. STORED PROCEDURE: sp_GetEmployeesByDepartment
CREATE OR ALTER PROCEDURE [dbo].[sp_GetEmployeesByDepartment]
    @DepartmentId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        e.[EmployeeId],
        e.[FullName],
        e.[Email],
        e.[PhoneNumber],
        e.[Gender],
        e.[DateOfBirth],
        e.[DepartmentId],
        d.[DepartmentName],
        e.[Designation],
        e.[Salary],
        e.[JoiningDate],
        e.[Address],
        e.[Status],
        e.[CreatedAt],
        e.[UpdatedAt]
    FROM [dbo].[Employees] e
    INNER JOIN [dbo].[Departments] d ON e.[DepartmentId] = d.[DepartmentId]
    WHERE e.[DepartmentId] = @DepartmentId
    ORDER BY e.[FullName] ASC;
END
GO

-- 4. STORED PROCEDURE: sp_GetDashboardStats
CREATE OR ALTER PROCEDURE [dbo].[sp_GetDashboardStats]
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TotalEmployees INT;
    DECLARE @ActiveEmployees INT;
    DECLARE @InactiveEmployees INT;
    DECLARE @TotalDepartments INT;
    DECLARE @TotalMonthlyPayroll DECIMAL(18, 2);

    SELECT @TotalEmployees = COUNT(*) FROM [dbo].[Employees];
    SELECT @ActiveEmployees = COUNT(*) FROM [dbo].[Employees] WHERE [Status] = 'Active';
    SELECT @InactiveEmployees = COUNT(*) FROM [dbo].[Employees] WHERE [Status] = 'Inactive';
    SELECT @TotalDepartments = COUNT(*) FROM [dbo].[Departments] WHERE [Status] = 'Active';
    SELECT @TotalMonthlyPayroll = ISNULL(SUM([Salary]), 0) FROM [dbo].[Employees] WHERE [Status] = 'Active';

    -- Result Set 1: Metric summary
    SELECT 
        @TotalEmployees AS [TotalEmployees],
        @ActiveEmployees AS [ActiveEmployees],
        @InactiveEmployees AS [InactiveEmployees],
        @TotalDepartments AS [TotalDepartments],
        @TotalMonthlyPayroll AS [TotalMonthlyPayroll];

    -- Result Set 2: Department-wise Employee Distribution
    SELECT 
        d.[DepartmentId],
        d.[DepartmentName],
        COUNT(e.[EmployeeId]) AS [EmployeeCount]
    FROM [dbo].[Departments] d
    LEFT JOIN [dbo].[Employees] e ON d.[DepartmentId] = e.[DepartmentId] AND e.[Status] = 'Active'
    GROUP BY d.[DepartmentId], d.[DepartmentName]
    ORDER BY [EmployeeCount] DESC;
END
GO
