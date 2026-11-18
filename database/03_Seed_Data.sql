-- ==========================================================
-- Employee Management System - Seed Data Script
-- ==========================================================

USE EmployeeManagementDB;
GO

-- 1. SEED DEFAULT ADMIN & HR USERS (Password: Admin@123 / Hr@123)
-- SHA256 hashed string for 'Admin@123' is: a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Username] = 'admin')
BEGIN
    INSERT INTO [dbo].[Users] ([Username], [Email], [PasswordHash], [FullName], [Role], [IsActive], [CreatedAt])
    VALUES 
    (
        'admin', 
        'admin@company.com', 
        '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', -- SHA256 of 'Admin@123'
        'System Administrator', 
        'Admin', 
        1, 
        GETUTCDATE()
    ),
    (
        'hr_manager', 
        'hr@company.com', 
        '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', -- SHA256 of 'Admin@123'
        'Sarah Jenkins', 
        'HR', 
        1, 
        GETUTCDATE()
    );
    PRINT 'Users seeded successfully.';
END
GO

-- 2. SEED DEPARTMENTS
IF NOT EXISTS (SELECT 1 FROM [dbo].[Departments])
BEGIN
    SET IDENTITY_INSERT [dbo].[Departments] ON;
    
    INSERT INTO [dbo].[Departments] ([DepartmentId], [DepartmentName], [Description], [Status], [CreatedAt])
    VALUES
    (1, 'Software Engineering', 'Core product development, cloud architecture, and tech stack maintenance.', 'Active', GETUTCDATE()),
    (2, 'Human Resources', 'Talent acquisition, employee welfare, performance appraisal, and company policies.', 'Active', GETUTCDATE()),
    (3, 'Finance & Accounts', 'Financial auditing, payroll management, budget allocation, and tax compliance.', 'Active', GETUTCDATE()),
    (4, 'Marketing & Sales', 'Digital marketing campaigns, brand outreach, and enterprise client relations.', 'Active', GETUTCDATE()),
    (5, 'Quality Assurance', 'Automated and manual testing, test suite design, and software reliability.', 'Active', GETUTCDATE());

    SET IDENTITY_INSERT [dbo].[Departments] OFF;
    PRINT 'Departments seeded successfully.';
END
GO

-- 3. SEED EMPLOYEES
IF NOT EXISTS (SELECT 1 FROM [dbo].[Employees])
BEGIN
    SET IDENTITY_INSERT [dbo].[Employees] ON;

    INSERT INTO [dbo].[Employees] 
    ([EmployeeId], [FullName], [Email], [PhoneNumber], [Gender], [DateOfBirth], [DepartmentId], [Designation], [Salary], [JoiningDate], [Address], [Status], [CreatedAt])
    VALUES
    (1001, 'Alex Morgan', 'alex.morgan@company.com', '+1-555-0101', 'Male', '1992-04-15', 1, 'Senior Full Stack Lead', 92000.00, '2021-03-01', '742 Evergreen Terrace, Springfield, OR', 'Active', GETUTCDATE()),
    (1002, 'Emily Chen', 'emily.chen@company.com', '+1-555-0102', 'Female', '1995-08-22', 1, 'Frontend Angular Developer', 74000.00, '2022-06-15', '124 Conch Street, Seattle, WA', 'Active', GETUTCDATE()),
    (1003, 'David Miller', 'david.miller@company.com', '+1-555-0103', 'Male', '1989-11-05', 2, 'HR Business Partner', 68000.00, '2020-01-10', '405 Madison Avenue, New York, NY', 'Active', GETUTCDATE()),
    (1004, 'Sophia Rodriguez', 'sophia.r@company.com', '+1-555-0104', 'Female', '1993-02-18', 3, 'Senior Financial Analyst', 85000.00, '2021-09-01', '888 Brickell Bay Dr, Miami, FL', 'Active', GETUTCDATE()),
    (1005, 'Liam Johnson', 'liam.johnson@company.com', '+1-555-0105', 'Male', '1996-07-30', 4, 'Growth Marketing Specialist', 62000.00, '2023-02-01', '500 Market St, San Francisco, CA', 'Active', GETUTCDATE()),
    (1006, 'Olivia Taylor', 'olivia.taylor@company.com', '+1-555-0106', 'Female', '1994-12-12', 5, 'Lead QA Automation Engineer', 78000.00, '2022-11-20', '300 Congress Ave, Austin, TX', 'Active', GETUTCDATE()),
    (1007, 'Ethan Wright', 'ethan.wright@company.com', '+1-555-0107', 'Male', '1991-05-27', 1, '.NET Core Backend Architect', 98000.00, '2019-08-15', '100 North Michigan, Chicago, IL', 'Active', GETUTCDATE()),
    (1008, 'Ava Martinez', 'ava.martinez@company.com', '+1-555-0108', 'Female', '1998-03-09', 2, 'Talent Acquisition Associate', 52000.00, '2024-01-08', '210 Peachtree St, Atlanta, GA', 'Active', GETUTCDATE()),
    (1009, 'Noah Williams', 'noah.williams@company.com', '+1-555-0109', 'Male', '1990-09-14', 3, 'Accounts & Payroll Manager', 79000.00, '2021-04-12', '1600 Pennsylvania Ave, Washington, DC', 'Active', GETUTCDATE()),
    (1010, 'Isabella Davis', 'isabella.davis@company.com', '+1-555-0110', 'Female', '1997-10-03', 4, 'Brand Strategy Coordinator', 58000.00, '2023-05-15', '700 Boylston St, Boston, MA', 'Inactive', GETUTCDATE());

    SET IDENTITY_INSERT [dbo].[Employees] OFF;
    PRINT 'Employees seeded successfully.';
END
GO
