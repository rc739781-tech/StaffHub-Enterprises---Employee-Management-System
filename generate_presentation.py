import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]  # Blank layout

    # Color Palette Definitions
    C_BG_DARK = RGBColor(15, 23, 42)       # Slate 900
    C_CARD_DARK = RGBColor(30, 41, 59)     # Slate 800
    C_BG_LIGHT = RGBColor(248, 250, 252)   # Slate 50
    C_WHITE = RGBColor(255, 255, 255)
    C_PRIMARY = RGBColor(37, 99, 235)      # Royal Blue 600
    C_PRIMARY_LIGHT = RGBColor(239, 246, 255) # Blue 50
    C_SECONDARY = RGBColor(14, 165, 233)   # Sky 500
    C_TEXT_MAIN = RGBColor(15, 23, 42)     # Slate 900
    C_TEXT_MUTED = RGBColor(100, 116, 139) # Slate 500
    C_TEXT_LIGHT = RGBColor(226, 232, 240) # Slate 200
    C_BORDER = RGBColor(226, 232, 240)     # Slate 200
    C_BORDER_DARK = RGBColor(51, 65, 85)   # Slate 700
    C_ACCENT_GREEN = RGBColor(16, 185, 129)# Emerald 500
    C_ACCENT_AMBER = RGBColor(245, 158, 11)# Amber 500
    C_ACCENT_PURPLE = RGBColor(139, 92, 246)# Violet 500

    def add_header(slide, category_text, title_text, subtitle_text=None, dark=False):
        # Category Pill / Tag
        tag_box = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(2.2), Inches(0.35)
        )
        tag_box.fill.solid()
        tag_box.fill.fore_color.rgb = C_PRIMARY if dark else RGBColor(224, 231, 255)
        tag_box.line.color.rgb = C_PRIMARY
        tag_tf = tag_box.text_frame
        tag_tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tag_tf.paragraphs[0]
        p.text = category_text.upper()
        p.alignment = PP_ALIGN.CENTER
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_WHITE if dark else C_PRIMARY

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(11.7), Inches(0.75))
        tf = title_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = C_WHITE if dark else C_TEXT_MAIN

        # Subtitle
        if subtitle_text:
            p2 = tf.add_paragraph()
            p2.text = subtitle_text
            p2.font.size = Pt(12)
            p2.font.color.rgb = C_TEXT_LIGHT if dark else C_TEXT_MUTED
            p2.space_before = Pt(4)

    def add_footer(slide, current_slide, total_slides=12, dark=False):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.4))
        tf = footer_box.text_frame
        p = tf.paragraphs[0]
        p.text = "StaffHub Enterprise • Employee Management System Presentation"
        p.font.size = Pt(9)
        p.font.color.rgb = C_TEXT_MUTED if dark else C_TEXT_MUTED

        p_num = tf.add_paragraph()
        p_num.text = f"Slide {current_slide} of {total_slides}"
        p_num.alignment = PP_ALIGN.RIGHT
        p_num.font.size = Pt(9)
        p_num.font.bold = True
        p_num.font.color.rgb = C_PRIMARY if dark else C_PRIMARY

    def create_card(slide, left, top, width, height, bg_color=C_WHITE, border_color=C_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1)
        else:
            card.line.fill.background()
        return card

    # =========================================================================
    # SLIDE 1: TITLE SLIDE (Dark Premium Theme)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = C_BG_DARK
    bg1.line.fill.background()

    # Decorative accent bar
    top_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = C_PRIMARY
    top_bar.line.fill.background()

    # Project Badge
    badge = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.2), Inches(4.5), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(30, 58, 138)
    badge.line.color.rgb = C_PRIMARY
    b_tf = badge.text_frame
    b_tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    bp = b_tf.paragraphs[0]
    bp.text = "FULL-STACK ENTERPRISE INTERNSHIP PROJECT"
    bp.alignment = PP_ALIGN.CENTER
    bp.font.size = Pt(11)
    bp.font.bold = True
    bp.font.color.rgb = RGBColor(191, 219, 254)

    # Main Title
    t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(2.2))
    t_tf = t_box.text_frame
    t_tf.word_wrap = True
    tp1 = t_tf.paragraphs[0]
    tp1.text = "Employee Management System"
    tp1.font.size = Pt(40)
    tp1.font.bold = True
    tp1.font.color.rgb = C_WHITE

    tp2 = t_tf.add_paragraph()
    tp2.text = "StaffHub Enterprise • Modern Human Capital & Department Management Platform"
    tp2.font.size = Pt(18)
    tp2.font.color.rgb = C_SECONDARY
    tp2.space_before = Pt(8)

    # Sub-description
    tp3 = t_tf.add_paragraph()
    tp3.text = "Engineered with Angular 18 (Signals & Standalone), ASP.NET Core 8 Web API, EF Core 8 & SQL Server"
    tp3.font.size = Pt(13)
    tp3.font.color.rgb = C_TEXT_LIGHT
    tp3.space_before = Pt(12)

    # 4 Key Tech Feature Cards
    tech_highlights = [
        ("Angular 18 Frontend", "Signals, Standalone Architecture, Reactive Forms, Bootstrap 5.3 & Chart.js UI"),
        ("ASP.NET Core 8 API", "3-Tier Clean Architecture, RESTful Controllers, Services & Repositories"),
        ("Dual-Query DB Access", "EF Core 8 LINQ ORM with T-SQL Stored Procedure fallback execution"),
        ("Enterprise Security", "JWT Authentication, PBKDF2 Password Hashing & Role-Based Access Control")
    ]
    card_w = Inches(2.65)
    card_h = Inches(1.8)
    for i, (title, desc) in enumerate(tech_highlights):
        c_left = Inches(1.2) + i * Inches(2.78)
        card = create_card(s1, c_left, Inches(4.3), card_w, card_h, bg_color=C_CARD_DARK, border_color=C_BORDER_DARK)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.2)
        ctf.margin_right = Inches(0.2)
        ctf.margin_top = Inches(0.2)
        cp1 = ctf.paragraphs[0]
        cp1.text = title
        cp1.font.size = Pt(13)
        cp1.font.bold = True
        cp1.font.color.rgb = C_WHITE
        cp2 = ctf.add_paragraph()
        cp2.text = desc
        cp2.font.size = Pt(10)
        cp2.font.color.rgb = C_TEXT_LIGHT
        cp2.space_before = Pt(6)

    # Footer Info
    f_box = s1.shapes.add_textbox(Inches(1.2), Inches(6.4), Inches(11.0), Inches(0.5))
    ftf = f_box.text_frame
    fp = ftf.paragraphs[0]
    fp.text = "Presenter: Rahul S.  |  Role: Full-Stack .NET & Angular Developer  |  Project Presentation & Technical Viva"
    fp.font.size = Pt(11)
    fp.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT & MOTIVATION
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    bg2 = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg2.fill.solid()
    bg2.fill.fore_color.rgb = C_BG_LIGHT
    bg2.line.fill.background()
    add_header(s2, "Executive Context", "Problem Statement & Project Motivation", "Why traditional employee tracking fails and how StaffHub solves enterprise HR needs")
    add_footer(s2, 2)

    # Left Column: The Problem (Challenges)
    card_prob = create_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.9))
    ptf = card_prob.text_frame
    ptf.word_wrap = True
    ptf.margin_left = Inches(0.3)
    ptf.margin_top = Inches(0.3)
    p = ptf.paragraphs[0]
    p.text = "⚠️ Challenges in Legacy HR Operations"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = RGBColor(220, 38, 38) # Red

    issues = [
        ("Fragmented & Siloed Records", "Employee files scattered across offline spreadsheets, manual registers, and local drives with high risk of data loss."),
        ("No Granular Access Control", "Sensitive compensation and personal records are unprotected without cryptographic authentication and role segregation."),
        ("Referential Inconsistencies", "Deleting departments leaves orphan employee records or breaks payroll calculations without database integrity rules."),
        ("High Latency & Sluggish Queries", "Growing employee headcounts cause slow search queries without optimized stored procedures, indexes, and pagination."),
        ("Zero Executive Visibility", "Leadership lacks instantaneous KPI dashboards for department salary distributions, headcounts, and hiring trends.")
    ]
    for title, desc in issues:
        p_t = ptf.add_paragraph()
        p_t.text = f"• {title}:"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = C_TEXT_MAIN
        p_t.space_before = Pt(8)
        p_d = ptf.add_paragraph()
        p_d.text = f"  {desc}"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = C_TEXT_MUTED

    # Right Column: The Solution (StaffHub Enterprise)
    card_sol = create_card(s2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.9), bg_color=C_PRIMARY_LIGHT, border_color=RGBColor(191, 219, 254))
    stf = card_sol.text_frame
    stf.word_wrap = True
    stf.margin_left = Inches(0.3)
    stf.margin_top = Inches(0.3)
    p = stf.paragraphs[0]
    p.text = "✅ The StaffHub Solution"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    solutions = [
        ("Unified Cloud-Ready Architecture", "Centralized, responsive Angular 18 single page app connected to robust ASP.NET Core 8 RESTful services."),
        ("Rigorous Data Integrity & Validation", "Enforces email uniqueness, minimum 18-year age bounds, positive salary thresholds, and foreign-key constraints."),
        ("Enterprise JWT Security", "Stateless bearer token authentication with claims-based authorization separating Admin and HR privileges."),
        ("Dual-Query Performance Layer", "Utilizes EF Core 8 LINQ alongside T-SQL Stored Procedures for sub-50ms execution times on enterprise datasets."),
        ("Real-Time Analytics Dashboard", "Dynamic Chart.js visualizations tracking total payroll, department allocation percentages, and staff status.")
    ]
    for title, desc in solutions:
        s_t = stf.add_paragraph()
        s_t.text = f"✔ {title}:"
        s_t.font.size = Pt(12)
        s_t.font.bold = True
        s_t.font.color.rgb = C_PRIMARY
        s_t.space_before = Pt(8)
        s_d = stf.add_paragraph()
        s_d.text = f"  {desc}"
        s_d.font.size = Pt(10.5)
        s_d.font.color.rgb = C_TEXT_MAIN

    # =========================================================================
    # SLIDE 3: SYSTEM ARCHITECTURE & 3-TIER CLEAN DESIGN
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    bg3 = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg3.fill.solid()
    bg3.fill.fore_color.rgb = C_BG_LIGHT
    bg3.line.fill.background()
    add_header(s3, "System Architecture", "3-Tier Enterprise Clean Architecture", "Decoupled layers ensuring high maintainability, testability, and enterprise scalability")
    add_footer(s3, 3)

    tiers = [
        ("1. Presentation Tier (Client SPA)", C_PRIMARY, [
            ("Framework", "Angular 18 Standalone Architecture"),
            ("State & Reactivity", "Angular Signals & RxJS Observable streams"),
            ("Form Management", "ReactiveFormsModule with strict field validators"),
            ("UI & Styling", "Bootstrap 5.3, Bootstrap Icons & Custom Glassmorphism"),
            ("Http Pipeline", "JwtInterceptor (Bearer Token) & ErrorInterceptor")
        ]),
        ("2. Application Tier (Web API)", C_SECONDARY, [
            ("Runtime / Framework", "ASP.NET Core 8 Web API (C# 12)"),
            ("Design Patterns", "Repository Pattern & Dependency Injection"),
            ("Middleware", "Global Exception Handling Middleware"),
            ("API Contracts", "Strongly-typed DTOs & ApiResponse<T> Wrapper"),
            ("API Documentation", "Swagger / OpenAPI 3.0 with JWT Authorize Support")
        ]),
        ("3. Data Tier (Persistence & DB)", C_ACCENT_PURPLE, [
            ("ORM Engine", "Entity Framework Core 8 (Code-First / Model-Driven)"),
            ("Database Engine", "Microsoft SQL Server 2022 / LocalDB"),
            ("Portability Fallback", "Automatic SQLite engine for zero-config local runs"),
            ("Stored Procedures", "sp_GetEmployees, sp_GetDashboardStats"),
            ("Database Seeder", "Automatic DbInitializer with enterprise test data")
        ])
    ]

    for i, (title, color, items) in enumerate(tiers):
        t_left = Inches(0.8) + i * Inches(3.95)
        card = create_card(s3, t_left, Inches(1.8), Inches(3.8), Inches(4.9))
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.25)
        ctf.margin_top = Inches(0.25)

        # Header Bar inside card
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = color

        for label, val in items:
            lp = ctf.add_paragraph()
            lp.text = f"• {label}"
            lp.font.size = Pt(11)
            lp.font.bold = True
            lp.font.color.rgb = C_TEXT_MAIN
            lp.space_before = Pt(8)

            vp = ctf.add_paragraph()
            vp.text = f"  {val}"
            vp.font.size = Pt(10)
            vp.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 4: TECHNOLOGY STACK DEEP-DIVE
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    bg4 = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg4.fill.solid()
    bg4.fill.fore_color.rgb = C_BG_LIGHT
    add_header(s4, "Technology Stack", "Modern Full-Stack Engineering Stack", "Cutting-edge frameworks and enterprise tooling powering the entire solution")
    add_footer(s4, 4)

    # 4 Detailed Quadrants
    quads = [
        ("Frontend Technologies", Inches(0.8), Inches(1.8), [
            ("Angular 18", "Latest release utilizing Standalone Components, fine-grained Signals reactivity, and modern Control Flow syntax (@if, @for)."),
            ("TypeScript 5.5", "Strict compile-time type-safety for models, interfaces, API response handlers, and reusable services."),
            ("Bootstrap 5.3 & Icons", "Modern responsive grid system, customizable utilities, accessible interactive modal dialogues, and icon sets."),
            ("Chart.js 4.4", "Dynamic canvas-rendered charts displaying department staff distributions and salary budget allocations.")
        ]),
        ("Backend & Web API", Inches(6.8), Inches(1.8), [
            ("ASP.NET Core 8", "High-throughput asynchronous web API framework with native Dependency Injection and Kestrel HTTP server."),
            ("C# 12 Language", "Modern language constructs: record types, primary constructors, pattern matching, and nullable reference types."),
            ("REST Architecture", "Clean, resource-oriented endpoint design returning consistent JSON responses and standard HTTP status codes."),
            ("Swagger / OpenAPI", "Interactive web documentation enabling instant testing of secured endpoints with JWT bearer headers.")
        ]),
        ("Data & Persistence", Inches(0.8), Inches(4.35), [
            ("Entity Framework Core 8", "Advanced Object-Relational Mapper (ORM) handling schema mapping, LINQ expressions, and transaction control."),
            ("Microsoft SQL Server", "Enterprise-grade relational database with strict foreign keys, non-clustered indexing, and cascading constraints."),
            ("Stored Procedures", "Optimized T-SQL scripts (sp_GetEmployees, sp_GetDashboardStats) bypassing ORM overhead for critical analytical queries."),
            ("SQLite Local Fallback", "Automatic zero-configuration database fallback for instant developer evaluation and offline demonstrations.")
        ]),
        ("Security & DevOps", Inches(6.8), Inches(4.35), [
            ("JWT Authentication", "Cryptographically signed JSON Web Tokens (HMAC-SHA256) ensuring stateless, tamper-proof user sessions."),
            ("PBKDF2 Password Hashing", "Enterprise password protection utilizing salted key derivation preventing rainbow table attacks."),
            ("CORS Policies", "Strict origin restrictions explicitly whitelisting the Angular frontend client while blocking unauthorized cross-origin calls."),
            ("Automated Launchers", "Pre-configured batch automation scripts (Run-Project.bat) initializing backend, frontend, and browser concurrently.")
        ])
    ]

    for title, left, top, items in quads:
        card = create_card(s4, left, top, Inches(5.7), Inches(2.45))
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.25)
        ctf.margin_top = Inches(0.18)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY

        for tech, desc in items:
            tp = ctf.add_paragraph()
            tp.text = f"• {tech}: {desc}"
            tp.font.size = Pt(9.5)
            tp.font.color.rgb = C_TEXT_MAIN
            tp.space_before = Pt(3)

    # =========================================================================
    # SLIDE 5: CORE FUNCTIONAL MODULES
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    bg5 = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg5.fill.solid()
    bg5.fill.fore_color.rgb = C_BG_LIGHT
    add_header(s5, "Feature Highlights", "Core Functional Modules & Capabilities", "Comprehensive end-to-end features supporting complete employee lifecycle management")
    add_footer(s5, 5)

    modules = [
        ("🔐 Auth & RBAC", C_PRIMARY, [
            "JWT-based stateless authentication",
            "Role segregation: Admin vs HR Manager",
            "Automatic token expiration & silent refresh",
            "Route guarding via Angular AuthGuard",
            "One-click demo credentials on login screen"
        ]),
        ("👥 Employee Management", C_SECONDARY, [
            "Complete CRUD (Create, Read, Update, Delete)",
            "Real-time search with input debounce",
            "Multi-filter by Department & Employment Status",
            "Server-side / Client pagination & sorting",
            "Dual-query execution toggle (LINQ vs SP)"
        ]),
        ("🏢 Department Module", C_ACCENT_PURPLE, [
            "Department code, name, and budget tracking",
            "Live head-count rollups per department",
            "Referential integrity protection on delete",
            "Direct link to filtered department employees",
            "Seamless department reassignment workflow"
        ]),
        ("📊 Analytics Dashboard", C_ACCENT_GREEN, [
            "Summary KPI cards (Total, Active, Payroll)",
            "Average salary computation across staff",
            "Interactive Chart.js department distribution",
            "Recent hires quick-view list",
            "Real-time stored procedure aggregation"
        ])
    ]

    for i, (title, color, items) in enumerate(modules):
        m_left = Inches(0.8) + i * Inches(2.95)
        card = create_card(s5, m_left, Inches(1.8), Inches(2.85), Inches(4.9))
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.2)
        ctf.margin_top = Inches(0.25)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = color

        for item in items:
            ip = ctf.add_paragraph()
            ip.text = f"✔ {item}"
            ip.font.size = Pt(10)
            ip.font.color.rgb = C_TEXT_MAIN
            ip.space_before = Pt(8)

    # =========================================================================
    # SLIDE 6: DATABASE DESIGN & SCHEMA ARCHITECTURE
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    bg6 = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg6.fill.solid()
    bg6.fill.fore_color.rgb = C_BG_LIGHT
    add_header(s6, "Database Architecture", "Database Schema & Entity-Relationship Model", "Normalized relational structure with strict constraints, foreign keys, and indexes")
    add_footer(s6, 6)

    # Left: 3 Table Schema Cards
    tables = [
        ("Users (Auth & Security)", Inches(0.8), Inches(1.8), Inches(5.6), Inches(1.5), [
            ("Id (PK)", "INT IDENTITY", "Primary Key"),
            ("Username / Email", "NVARCHAR(100)", "Unique Index, Not Null"),
            ("PasswordHash / Role", "NVARCHAR(MAX)", "Salted Hash, Role ('Admin' / 'HR')")
        ]),
        ("Departments (Organizational Units)", Inches(0.8), Inches(3.45), Inches(5.6), Inches(1.55), [
            ("Id (PK)", "INT IDENTITY", "Primary Key"),
            ("Name / Code", "NVARCHAR(100)", "Unique Department Code (e.g., 'ENG', 'HR')"),
            ("Budget / Location", "DECIMAL(18,2)", "Fiscal Allocation & Office Location")
        ]),
        ("Employees (Staff Records)", Inches(0.8), Inches(5.15), Inches(5.6), Inches(1.55), [
            ("Id (PK) / DeptId (FK)", "INT / INT", "Referential link to Departments table"),
            ("FirstName / LastName / Email", "NVARCHAR(100)", "Unique Email Constraint, RFC Validated"),
            ("Salary / Status / HireDate", "DECIMAL / NVARCHAR", "Check Salary > 1000, Status enum")
        ])
    ]

    for title, left, top, width, height, fields in tables:
        card = create_card(s6, left, top, width, height)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.2)
        ctf.margin_top = Inches(0.12)
        p = ctf.paragraphs[0]
        p.text = f"📋 Table: {title}"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY

        for f_name, f_type, f_desc in fields:
            fp = ctf.add_paragraph()
            fp.text = f"  • {f_name} [{f_type}] — {f_desc}"
            fp.font.size = Pt(9)
            fp.font.color.rgb = C_TEXT_MAIN
            fp.space_before = Pt(1)

    # Right: Integrity Rules & ER Relationship Insights
    right_card = create_card(s6, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.9), bg_color=C_PRIMARY_LIGHT, border_color=RGBColor(191, 219, 254))
    rtf = right_card.text_frame
    rtf.word_wrap = True
    rtf.margin_left = Inches(0.3)
    rtf.margin_top = Inches(0.25)
    rp = rtf.paragraphs[0]
    rp.text = "🔗 Entity Relationships & Integrity Rules"
    rp.font.size = Pt(15)
    rp.font.bold = True
    rp.font.color.rgb = C_PRIMARY

    rules = [
        ("1-to-Many Relationship (1:N)", "Each Department houses multiple Employees. Each Employee belongs to exactly one Department (Foreign Key FK_Employees_Departments)."),
        ("Referential Integrity Guard", "Restricted deletion policy prevents accidental department removal if active employees are currently assigned to it."),
        ("Unique Email & Identity Index", "Unique non-clustered index on Employee.Email and User.Email enforces zero duplicate accounts across the organization."),
        ("Validation & Check Constraints", "Check constraints ensure positive compensation (> $1,000) and realistic hiring/birth date temporal ordering."),
        ("Automated Seeding Pipeline", "DbInitializer.cs verifies table existence and seeds realistic department hierarchies, staff members, and admin credentials automatically.")
    ]
    for r_title, r_desc in rules:
        rtp = rtf.add_paragraph()
        rtp.text = f"✔ {r_title}:"
        rtp.font.size = Pt(11.5)
        rtp.font.bold = True
        rtp.font.color.rgb = C_TEXT_MAIN
        rtp.space_before = Pt(6)
        rdp = rtf.add_paragraph()
        rdp.text = f"   {r_desc}"
        rdp.font.size = Pt(10)
        rdp.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 7: DUAL-QUERY DATA ACCESS (EF CORE + STORED PROCEDURES)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    bg7 = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg7.fill.solid()
    bg7.fill.fore_color.rgb = C_BG_LIGHT
    add_header(s7, "Performance & Optimization", "Dual-Query Architecture: EF Core vs Stored Procedures", "A unique enterprise design allowing live query comparison and maximum optimization")
    add_footer(s7, 7)

    # Comparison Columns
    col1 = create_card(s7, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.9))
    c1tf = col1.text_frame
    c1tf.word_wrap = True
    c1tf.margin_left = Inches(0.3)
    c1tf.margin_top = Inches(0.25)
    p = c1tf.paragraphs[0]
    p.text = "⚡ Entity Framework Core 8 (LINQ)"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    ef_points = [
        ("Developer Velocity", "Strongly-typed LINQ queries eliminate runtime SQL syntax errors and accelerate feature development."),
        ("Change Tracking", "Built-in EF Core DbContext monitors entity state transitions (Added, Modified, Deleted) automatically."),
        ("Standard CRUD Operations", "Used for employee onboarding, single-record lookups, department updates, and relationship mapping."),
        ("Dynamic Query Composition", "Allows fluent chaining of Where(), OrderBy(), and Skip()/Take() based on runtime user filter inputs.")
    ]
    for title, desc in ef_points:
        p_t = c1tf.add_paragraph()
        p_t.text = f"• {title}:"
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = C_TEXT_MAIN
        p_t.space_before = Pt(8)
        p_d = c1tf.add_paragraph()
        p_d.text = f"  {desc}"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = C_TEXT_MUTED

    col2 = create_card(s7, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.9))
    c2tf = col2.text_frame
    c2tf.word_wrap = True
    c2tf.margin_left = Inches(0.3)
    c2tf.margin_top = Inches(0.25)
    p = c2tf.paragraphs[0]
    p.text = "🚀 T-SQL Stored Procedures"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_ACCENT_GREEN

    sp_points = [
        ("Pre-compiled Execution Plan", "SQL Server caches execution trees, dramatically cutting query compilation and latency for heavy datasets."),
        ("sp_GetEmployees", "Custom procedure performing multi-parameter search, department joins, status filtering, and offset pagination in 1 trip."),
        ("sp_GetDashboardStats", "Aggregates total staff, active/inactive counts, average salary, and department distribution in a single optimized pass."),
        ("Live Toggle in UI", "StaffHub includes a live header switch in the frontend to compare EF Core vs Stored Procedure execution speeds!")
    ]
    for title, desc in sp_points:
        p_t = c2tf.add_paragraph()
        p_t.text = f"✔ {title}:"
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = C_TEXT_MAIN
        p_t.space_before = Pt(8)
        p_d = c2tf.add_paragraph()
        p_d.text = f"   {desc}"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 8: RESTFUL API DESIGN & SWAGGER SPECIFICATION
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    bg8 = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg8.fill.solid()
    bg8.fill.fore_color.rgb = C_BG_LIGHT
    add_header(s8, "API Contracts & Integration", "RESTful API Design & OpenAPI / Swagger Specs", "Structured REST endpoints conforming to modern API contracts with standardized payloads")
    add_footer(s8, 8)

    # API Endpoints Table Card
    table_card = create_card(s8, Inches(0.8), Inches(1.8), Inches(7.8), Inches(4.9))
    # Add a real Table inside table_card
    table_shape = s8.shapes.add_table(7, 3, Inches(1.0), Inches(2.0), Inches(7.4), Inches(4.4))
    table = table_shape.table
    table.columns[0].width = Inches(1.2)
    table.columns[1].width = Inches(2.5)
    table.columns[2].width = Inches(3.7)

    headers = ["METHOD", "ENDPOINT", "DESCRIPTION & PAYLOAD"]
    for col_idx, h_text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_CARD_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.bold = True
        p.font.size = Pt(10)
        p.font.color.rgb = C_WHITE

    endpoints_data = [
        ("POST", "/api/auth/login", "Authenticates user credentials; returns signed JWT bearer token."),
        ("GET", "/api/employees", "Paginated search, filter by dept/status, sort by salary/name."),
        ("POST", "/api/employees", "Registers new employee; enforces email uniqueness & age >= 18."),
        ("PUT", "/api/employees/{id}", "Updates profile, salary, job title, and department assignment."),
        ("DELETE", "/api/employees/{id}", "Permanently removes employee with modal confirmation."),
        ("GET", "/api/dashboard/stats", "Aggregated analytical KPIs: payroll, counts & department ratios.")
    ]
    for row_idx, (method, ep, desc) in enumerate(endpoints_data, start=1):
        cell_m = table.cell(row_idx, 0)
        cell_m.text = method
        cp = cell_m.text_frame.paragraphs[0]
        cp.font.bold = True
        cp.font.size = Pt(9.5)
        cp.font.color.rgb = RGBColor(16, 185, 129) if method == "GET" else (C_PRIMARY if method == "POST" else (RGBColor(245, 158, 11) if method == "PUT" else RGBColor(239, 68, 68)))

        cell_e = table.cell(row_idx, 1)
        cell_e.text = ep
        cell_e.text_frame.paragraphs[0].font.size = Pt(9.5)
        cell_e.text_frame.paragraphs[0].font.name = "Consolas"

        cell_d = table.cell(row_idx, 2)
        cell_d.text = desc
        cell_d.text_frame.paragraphs[0].font.size = Pt(9)

    # Right: ApiResponse<T> Standard Envelope
    env_card = create_card(s8, Inches(8.9), Inches(1.8), Inches(3.6), Inches(4.9), bg_color=C_PRIMARY_LIGHT, border_color=RGBColor(191, 219, 254))
    etf = env_card.text_frame
    etf.word_wrap = True
    etf.margin_left = Inches(0.2)
    etf.margin_top = Inches(0.2)
    ep = etf.paragraphs[0]
    ep.text = "📦 Standard Envelope"
    ep.font.size = Pt(13)
    ep.font.bold = True
    ep.font.color.rgb = C_PRIMARY

    env_items = [
        ("ApiResponse<T>", "All API endpoints return a unified response model containing Success, Message, Data, and Errors properties."),
        ("Consistent Front-End Handling", "Eliminates unexpected response structures and simplifies Angular service deserialization."),
        ("HTTP Status Codes", "200 OK (Success), 201 Created (Onboarded), 400 Bad Request (Validation failure), 401 Unauthorized (Invalid JWT), 404 Not Found, 500 Internal Server Error.")
    ]
    for title, desc in env_items:
        tp = etf.add_paragraph()
        tp.text = f"• {title}:"
        tp.font.size = Pt(10.5)
        tp.font.bold = True
        tp.font.color.rgb = C_TEXT_MAIN
        tp.space_before = Pt(8)
        dp = etf.add_paragraph()
        dp.text = f"  {desc}"
        dp.font.size = Pt(9.5)
        dp.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 9: SECURITY ARCHITECTURE & GLOBAL ERROR HANDLING
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    bg9 = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg9.fill.solid()
    bg9.fill.fore_color.rgb = C_BG_LIGHT
    add_header(s9, "Security & Resilience", "Authentication, Authorization & Error Handling", "Multi-layered defensive architecture protecting user identity, sensitive data, and uptime")
    add_footer(s9, 9)

    sec_cards = [
        ("🔐 JWT Authentication Flow", Inches(0.8), Inches(1.8), [
            ("HMAC-SHA256 Token Signing", "Tokens are cryptographically signed with an enterprise secret key, expiring after configurable duration (8 hours)."),
            ("Decentralized Claims", "Payload encodes UserId, Username, Email, and Role without requiring continuous database hits on every request."),
            ("Stateless Scaling", "The Web API requires no server-side session memory, enabling straightforward horizontal scalability.")
        ]),
        ("🛡️ Client & Route Protection", Inches(4.8), Inches(1.8), [
            ("Angular AuthGuard", "Intercepts route activation. Unauthenticated users are gracefully redirected to the login page with return-url memory."),
            ("JwtInterceptor Pipeline", "Transparently attaches the 'Authorization: Bearer <token>' header to every outgoing HTTP request."),
            ("Role-Based UI Rendering", "Dynamically shows or hides sensitive action buttons (e.g. Delete, Edit Salary) based on authenticated user claims.")
        ]),
        ("⚡ Global Error Middleware", Inches(8.8), Inches(1.8), [
            ("ExceptionMiddleware.cs", "Custom ASP.NET Core middleware intercepts unhandled exceptions across all controller endpoints."),
            ("Zero Stack Trace Leaks", "Prevents database connection strings or internal stack traces from leaking to public clients."),
            ("ErrorInterceptor in Angular", "Automatically parses backend error responses and displays intuitive toast notifications to the user.")
        ])
    ]

    for title, left, top, items in sec_cards:
        card = create_card(s9, left, top, Inches(3.7), Inches(4.9))
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.2)
        ctf.margin_top = Inches(0.25)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY

        for it, desc in items:
            ip = ctf.add_paragraph()
            ip.text = f"• {it}:"
            ip.font.size = Pt(11)
            ip.font.bold = True
            ip.font.color.rgb = C_TEXT_MAIN
            ip.space_before = Pt(8)

            dp = ctf.add_paragraph()
            dp.text = f"  {desc}"
            dp.font.size = Pt(9.5)
            dp.font.color.rgb = C_TEXT_MUTED

    # =========================================================================
    # SLIDE 10: FRONTEND ARCHITECTURE & USER EXPERIENCE (UX)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    bg10 = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg10.fill.solid()
    bg10.fill.fore_color.rgb = C_BG_LIGHT
    add_header(s10, "Frontend Engineering", "Angular 18 Architecture & Enterprise UX Design", "Responsive, accessible, and reactive user interface built for high productivity")
    add_footer(s10, 10)

    # 4 Cards Layout
    fe_features = [
        ("Modern Angular 18 Standalone", Inches(0.8), Inches(1.8), [
            "100% Standalone Components — no legacy NgModule boilerplate.",
            "Fine-grained reactivity utilizing Angular Signals for instant UI updates.",
            "Modern Control Flow syntax (@if, @for, @empty) reducing bundle overhead.",
            "Lazy-loaded application routes ensuring lightning-fast initial load times."
        ]),
        ("Reactive Forms & Live Validation", Inches(6.8), Inches(1.8), [
            "Strict client-side validations matching backend constraints in real time.",
            "Visual error hints indicating invalid emails, phone formats, or underage dates.",
            "Custom age validator calculating minimum 18 years from DateOfBirth.",
            "Dirty & touched field tracking with disabled submit buttons until valid."
        ]),
        ("Interactive Dashboard & Charts", Inches(0.8), Inches(4.35), [
            "Chart.js powered donut chart depicting department distribution ratios.",
            "Dynamic summary metric cards: Total Staff, Active Staff, Total Payroll.",
            "Recent hires snapshot table displaying newest workforce additions.",
            "Stored Procedure / EF Core real-time execution toggle switch."
        ]),
        ("User Feedback & Confirmation Modals", Inches(6.8), Inches(4.35), [
            "Custom Toast Service presenting auto-dismissing success/error alerts.",
            "Safety confirmation modals preventing accidental employee or dept deletion.",
            "Search debouncing preventing wasteful rapid HTTP requests during typing.",
            "Fully responsive layout optimized across desktop, tablet, and mobile displays."
        ])
    ]

    for title, left, top, items in fe_features:
        card = create_card(s10, left, top, Inches(5.7), Inches(2.45))
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.25)
        ctf.margin_top = Inches(0.2)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY

        for it in items:
            ip = ctf.add_paragraph()
            ip.text = f"✔ {it}"
            ip.font.size = Pt(9.5)
            ip.font.color.rgb = C_TEXT_MAIN
            ip.space_before = Pt(3)

    # =========================================================================
    # SLIDE 11: VALIDATION, TESTING & PERFORMANCE RESULTS
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    bg11 = s11.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg11.fill.solid()
    bg11.fill.fore_color.rgb = C_BG_LIGHT
    add_header(s11, "Validation & Metrics", "Business Validation, Testing & Performance Metrics", "Rigorous automated validation and benchmarked runtime metrics across all tiers")
    add_footer(s11, 11)

    # Metric Cards Top Row
    metrics = [
        ("< 50 ms", "API Response Time", "High-efficiency async I/O with SQL Server & SQLite"),
        ("2.2 MB", "Frontend Initial Bundle", "Lightweight Angular 18 build with code-splitting"),
        ("100%", "Constraint Coverage", "Unique email, minimum age, positive salary & referential safety"),
        ("Zero Error", "Compilation & Build", "Strict TypeScript checking & .NET 8 compiler verification")
    ]
    for i, (stat, label, detail) in enumerate(metrics):
        m_left = Inches(0.8) + i * Inches(2.95)
        card = create_card(s11, m_left, Inches(1.8), Inches(2.85), Inches(1.6), bg_color=C_PRIMARY_LIGHT, border_color=RGBColor(191, 219, 254))
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.2)
        ctf.margin_top = Inches(0.15)
        p = ctf.paragraphs[0]
        p.text = stat
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = C_PRIMARY

        p2 = ctf.add_paragraph()
        p2.text = label
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = C_TEXT_MAIN

        p3 = ctf.add_paragraph()
        p3.text = detail
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = C_TEXT_MUTED

    # Bottom Row: 2 Big Result Cards
    card_v = create_card(s11, Inches(0.8), Inches(3.6), Inches(5.7), Inches(3.1))
    vtf = card_v.text_frame
    vtf.word_wrap = True
    vtf.margin_left = Inches(0.25)
    vtf.margin_top = Inches(0.2)
    p = vtf.paragraphs[0]
    p.text = "🛡️ Rigorous Validation Matrix"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    v_rules = [
        ("Full Name Constraint", "2 to 100 characters; prevents blank or whitespace submissions."),
        ("RFC Email & Uniqueness", "Strict regex validation + database UNIQUE index preventing duplicates."),
        ("Age Validation Rule", "Enforces age >= 18 calculated against DateOfBirth parameter."),
        ("Compensation Floor", "Restricts salary to positive numerical values >= $1,000."),
        ("Department Deletion Guard", "Rejects deletion attempts if active employees are assigned.")
    ]
    for r, d in v_rules:
        rp = vtf.add_paragraph()
        rp.text = f"• {r}: {d}"
        rp.font.size = Pt(9.5)
        rp.font.color.rgb = C_TEXT_MAIN
        rp.space_before = Pt(3)

    card_t = create_card(s11, Inches(6.8), Inches(3.6), Inches(5.7), Inches(3.1))
    ttf = card_t.text_frame
    ttf.word_wrap = True
    ttf.margin_left = Inches(0.25)
    ttf.margin_top = Inches(0.2)
    p = ttf.paragraphs[0]
    p.text = "🧪 Integration & End-to-End Verification"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = C_ACCENT_GREEN

    t_cases = [
        ("Cross-Origin Resource Sharing (CORS)", "Verified pre-flight OPTIONS requests and allowed origins for Angular."),
        ("Database Auto-Migration & Seeding", "Verified cold-boot DB initialization with test admin & departments."),
        ("JWT Lifecycle & Expiration", "Verified 401 Unauthorized handling on tampered or expired tokens."),
        ("Batch Launcher Automation", "Verified single-command project startup via Run-Project.bat launcher."),
        ("Dual-Query Performance Check", "Verified seamless switching between LINQ and SQL Stored Procedures.")
    ]
    for r, d in t_cases:
        rp = ttf.add_paragraph()
        rp.text = f"✔ {r}: {d}"
        rp.font.size = Pt(9.5)
        rp.font.color.rgb = C_TEXT_MAIN
        rp.space_before = Pt(3)

    # =========================================================================
    # SLIDE 12: CONCLUSION, ROADMAP & VIVA Q&A (Dark Finish)
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    bg12 = s12.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg12.fill.solid()
    bg12.fill.fore_color.rgb = C_BG_DARK
    bg12.line.fill.background()
    add_header(s12, "Project Summary & Outlook", "Conclusion, Future Roadmap & Technical Q&A", "Key internship learnings, enterprise roadmap, and open floor for technical questions", dark=True)
    add_footer(s12, 12, dark=True)

    # 3 Summary Cards
    c12_data = [
        ("🎓 Key Internship Learnings", [
            "Mastered 3-tier clean architecture separating business logic from persistence.",
            "Deepened expertise in Angular 18 standalone components, signals, and guards.",
            "Engineered secure JWT authentication and password cryptographic hashing.",
            "Integrated stored procedures for performance optimization alongside EF Core."
        ]),
        ("🚀 Future Scalability Roadmap", [
            "Employee Self-Service Portal (Leave requests, profile updates, ticket logging).",
            "Biometric & RFID Attendance Integration for real-time punch clock tracking.",
            "Automated Payroll Generation with PDF pay-slip export and email dispatch.",
            "Containerization via Docker & Kubernetes for multi-cloud deployment."
        ]),
        ("💬 Technical Viva & Live Q&A", [
            "Ready for live code walkthrough of Controllers, Services & Repositories.",
            "Interactive demonstration of Angular 18 UI & RESTful Swagger endpoints.",
            "Review of database constraints, schemas, and stored procedures.",
            "Thank you for your time and guidance!"
        ])
    ]

    for i, (title, items) in enumerate(c12_data):
        c_left = Inches(0.8) + i * Inches(3.95)
        card = create_card(s12, c_left, Inches(1.8), Inches(3.8), Inches(4.9), bg_color=C_CARD_DARK, border_color=C_BORDER_DARK)
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.25)
        ctf.margin_top = Inches(0.25)
        p = ctf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = C_SECONDARY if i == 1 else (C_ACCENT_GREEN if i == 2 else C_WHITE)

        for item in items:
            ip = ctf.add_paragraph()
            ip.text = f"• {item}"
            ip.font.size = Pt(10.5)
            ip.font.color.rgb = C_TEXT_LIGHT
            ip.space_before = Pt(8)

    output_path = r"C:\Users\RAHUL\Desktop\EmployeeManagementSystem\EmployeeManagementSystem_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_presentation()
