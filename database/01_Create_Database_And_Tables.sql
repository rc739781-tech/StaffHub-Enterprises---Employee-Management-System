-- ==========================================================
-- Employee Management System - Database Creation Script
-- DBMS: Microsoft SQL Server 2019 / 2022 / Azure SQL
-- ==========================================================

-- 1. CREATE DATABASE
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'EmployeeManagementDB')
BEGIN
    CREATE DATABASE EmployeeManagementDB;
    PRINT 'Database EmployeeManagementDB created successfully.';
END
GO

USE EmployeeManagementDB;
GO

-- 2. CREATE USERS TABLE (Authentication & Roles)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users] (
        [UserId] INT IDENTITY(1,1) PRIMARY KEY,
        [Username] NVARCHAR(50) NOT NULL UNIQUE,
        [Email] NVARCHAR(100) NOT NULL UNIQUE,
        [PasswordHash] NVARCHAR(255) NOT NULL,
        [FullName] NVARCHAR(100) NOT NULL,
        [Role] NVARCHAR(20) NOT NULL DEFAULT 'Admin', -- Admin, HR, Manager
        [IsActive] BIT NOT NULL DEFAULT 1,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [LastLoginAt] DATETIME2 NULL
    );
    PRINT 'Table Users created successfully.';
END
GO

-- 3. CREATE DEPARTMENTS TABLE
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Departments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Departments] (
        [DepartmentId] INT IDENTITY(1,1) PRIMARY KEY,
        [DepartmentName] NVARCHAR(100) NOT NULL UNIQUE,
        [Description] NVARCHAR(500) NULL,
        [Status] NVARCHAR(20) NOT NULL DEFAULT 'Active', -- Active, Inactive
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] DATETIME2 NULL
    );
    PRINT 'Table Departments created successfully.';
END
GO

-- 4. CREATE EMPLOYEES TABLE
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Employees]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Employees] (
        [EmployeeId] INT IDENTITY(1001,1) PRIMARY KEY,
        [FullName] NVARCHAR(100) NOT NULL,
        [Email] NVARCHAR(100) NOT NULL UNIQUE,
        [PhoneNumber] NVARCHAR(20) NOT NULL,
        [Gender] NVARCHAR(10) NOT NULL, -- Male, Female, Other
        [DateOfBirth] DATE NOT NULL,
        [DepartmentId] INT NOT NULL,
        [Designation] NVARCHAR(100) NOT NULL,
        [Salary] DECIMAL(18, 2) NOT NULL,
        [JoiningDate] DATE NOT NULL,
        [Address] NVARCHAR(300) NOT NULL,
        [Status] NVARCHAR(20) NOT NULL DEFAULT 'Active', -- Active, Inactive
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] DATETIME2 NULL,
        CONSTRAINT [FK_Employees_Departments_DepartmentId] 
            FOREIGN KEY ([DepartmentId]) 
            REFERENCES [dbo].[Departments] ([DepartmentId])
            ON DELETE NO ACTION
    );
    PRINT 'Table Employees created successfully.';
END
GO

-- 5. CREATE INDEXES FOR PERFORMANCE
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Employees_DepartmentId' AND object_id = OBJECT_ID(N'[dbo].[Employees]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Employees_DepartmentId] ON [dbo].[Employees] ([DepartmentId]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Employees_Status' AND object_id = OBJECT_ID(N'[dbo].[Employees]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Employees_Status] ON [dbo].[Employees] ([Status]);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Employees_FullName' AND object_id = OBJECT_ID(N'[dbo].[Employees]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Employees_FullName] ON [dbo].[Employees] ([FullName]);
END
GO
