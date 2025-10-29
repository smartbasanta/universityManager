import { permissionsData } from './permissions.data'; // Assuming permissions are in this file

export const rolesData = [

    // =================================================================================
    // CORE PERSONA ROLES
    // These roles represent the primary identity of a user in the system.
    // They are typically assigned once and define the user's main function.
    // =================================================================================

    {
        key: 'SUPER_ADMIN',
        name: 'Super Admin',
        description: 'Has unrestricted, system-wide access to all features and data.',
        scope: 'System',
        level: 100,
        permissions: ['*'], // A wildcard to signify all permissions
    },
    {
        key: 'UNIVERSITY_ADMIN',
        name: 'University Admin',
        description: 'Manages a specific university profile, its departments, staff, and all university-level content.',
        scope: 'University',
        level: 90,
        permissions: [
            // User Management
            'user:list', 'user:view', 'user:edit', 'user:change-status', 'user:delete', 'user:restore',
            // Roles & Permissions
            'role:list', 'role:view', 'role:assign',
            // University Profile
            'university:list', 'university:view-profile', 'university:edit-profile', 'university:publish', 'university:create',
            // Institutions
            'institution:list', 'institution:view', 'institution:create', 'institution:edit', 'institution:delete', 'institution:manage',
            // Academics
            'department:list', 'department:view', 'department:create', 'department:edit', 'department:delete', 'department:manage',
            'program:list', 'program:view', 'program:create', 'program:edit', 'program:delete', 'program:manage',
            'course:list', 'course:view', 'course:create', 'course:edit', 'course:delete', 'course:manage',
            'faculty:list', 'faculty:view', 'faculty:create', 'faculty:edit', 'faculty:delete', 'faculty:manage',
            // Admissions
            'admissions:view', 'admissions:edit', 'admissions:manage',
            // Student Opportunities
            'job:list', 'job:view', 'job:create', 'job:edit', 'job:publish', 'job:delete', 'job:restore', 'job:view-applications',
            'scholarship:list', 'scholarship:view', 'scholarship:create', 'scholarship:edit', 'scholarship:delete', 'scholarship:restore',
            'opportunity:list', 'opportunity:view', 'opportunity:create', 'opportunity:edit', 'opportunity:delete', 'opportunity:restore',
            // Content & Engagement
            'news:list', 'news:view', 'news:create', 'news:publish', 'news:edit', 'news:delete', 'news:restore',
            'comment:moderate', 'review:moderate',
            // Campus Life
            'student-life:view', 'student-life:edit', 'student-life:manage',
            'athletics:view', 'athletics:edit', 'athletics:manage',
            'entrepreneurship:view', 'entrepreneurship:edit', 'entrepreneurship:manage',
            // Services
            'booking:manage-all',
            'career-services:view', 'career-services:edit', 'career-services:manage',
            // Dashboard
            'dashboard:view', 'analytics:view',
        ],
    },
    {
        key: 'DEPARTMENT_HEAD',
        name: 'Department Head',
        description: 'Manages a specific academic department, including its staff, programs, and content.',
        scope: 'Department',
        level: 80,
        permissions: [
            // User management (within their department)
            'user:list', 'user:view', 'user:edit', 'user:change-status',
            // Own profile
            'profile:edit-own',
            // Academic management (within their department)
            'department:view', 'department:edit',
            'program:list', 'program:view', 'program:create', 'program:edit', 'program:delete',
            'course:list', 'course:view', 'course:create', 'course:edit', 'course:delete',
            'faculty:list', 'faculty:view', 'faculty:create', 'faculty:edit', 'faculty:delete',
            // Content creation (for their department)
            'job:list', 'job:view', 'job:create', 'job:edit', 'job:delete',
            'scholarship:list', 'scholarship:view', 'scholarship:create', 'scholarship:edit', 'scholarship:delete',
            'opportunity:list', 'opportunity:view', 'opportunity:create', 'opportunity:edit', 'opportunity:delete',
            'news:list', 'news:view', 'news:create', 'news:edit', 'news:publish',
        ],
    },
    {
        key: 'INSTITUTION_ADMIN',
        name: 'Institution Admin',
        description: 'Represents an external company/institution. Can manage their profile and post jobs.',
        scope: 'Institution',
        level: 70,
        permissions: [
            'profile:edit-own',
            'job:list', 'job:view', 'job:create', 'job:edit', 'job:publish', 'job:delete', 'job:restore', 'job:view-applications',
        ],
    },
    {
        key: 'STAFF',
        name: 'University Staff',
        description: 'A general staff member who can contribute content and manage their own profile.',
        scope: 'University', // Scope can be University or Department
        level: 40,
        permissions: [
            'profile:edit-own',
            'news:list', 'news:view', 'news:create', 'news:edit',
            'opportunity:list', 'opportunity:view', 'opportunity:create', 'opportunity:edit',
        ],
    },
    {
        key: 'MENTOR',
        name: 'Mentor in Residence',
        description: 'A mentor who can manage their profile, availability, and bookings.',
        scope: 'User',
        level: 20,
        permissions: [
            'profile:edit-own',
            'mentor-profile:edit-own',
            'slot:manage-own',
            'booking:view-own',
        ],
    },
    {
        key: 'STUDENT',
        name: 'Student',
        description: 'The default role for all students. Can interact with content and manage their own profile.',
        scope: 'User',
        level: 10,
        isDefault: true,
        permissions: [
            'profile:edit-own',
        ],
    },
    {
        key: 'STUDENT_AMBASSADOR',
        name: 'Student Ambassador',
        description: 'A student who manages their availability and provides guidance to other students.',
        scope: 'User',
        level: 20,
        permissions: [
            'profile:edit-own',
            'ambassador-profile:edit-own',
            'slot:manage-own', 
            'booking:view-own',
        ],
    },

    // =================================================================================
    // FUNCTIONAL / MODULE-BASED ROLES
    // These roles grant specific, targeted capabilities. They can be layered on top
    // of Persona Roles to grant extra permissions without creating new core roles.
    // =================================================================================

    {
        key: 'CONTENT_CREATOR',
        name: 'Content Creator',
        description: 'A general staff member who can create and manage content like news and opportunities.',
        scope: 'University',
        level: 50,
        permissions: [
            'news:list', 'news:view', 'news:create', 'news:edit',
            'opportunity:list', 'opportunity:view', 'opportunity:create', 'opportunity:edit',
        ],
    },
    {
        key: 'JOB_MANAGER',
        name: 'Job Manager',
        description: 'Full control over job postings for their assigned scope (University or Department).',
        scope: 'University', // Can be assigned at University or Department level
        level: 75,
        permissions: [
            'job:list', 'job:view', 'job:create', 'job:edit', 'job:publish', 'job:delete', 'job:restore', 'job:view-applications',
        ],
    },
    {
        key: 'CONTENT_EDITOR',
        name: 'Content Editor',
        description: 'Manages all major content types: News, Opportunities, and Scholarships.',
        scope: 'University',
        level: 70,
        permissions: [
            'news:list', 'news:view', 'news:create', 'news:edit', 'news:publish', 'news:delete', 'news:restore',
            'opportunity:list', 'opportunity:view', 'opportunity:create', 'opportunity:edit', 'opportunity:delete', 'opportunity:restore',
            'scholarship:list', 'scholarship:view', 'scholarship:create', 'scholarship:edit', 'scholarship:delete', 'scholarship:restore',
        ],
    },
    {
        key: 'COMMUNITY_MODERATOR',
        name: 'Community Moderator',
        description: 'Focuses solely on moderating user-generated content like comments and reviews.',
        scope: 'University',
        level: 65,
        permissions: [
            'comment:moderate', 'review:moderate',
        ],
    },
    {
        key: 'ACADEMICS_MANAGER',
        name: 'Academics Manager',
        description: 'Full control over academic structures: Departments, Programs, Courses, and Faculty.',
        scope: 'University',
        level: 75,
        permissions: [
            'department:list', 'department:view', 'department:create', 'department:edit', 'department:delete', 'department:manage',
            'program:list', 'program:view', 'program:create', 'program:edit', 'program:delete', 'program:manage',
            'course:list', 'course:view', 'course:create', 'course:edit', 'course:delete', 'course:manage',
            'faculty:list', 'faculty:view', 'faculty:create', 'faculty:edit', 'faculty:delete', 'faculty:manage',
        ],
    },
    {
        key: 'ADMISSIONS_OFFICER', 
        name: 'Admissions Officer',
        description: 'Manages all aspects of the university admissions data and requirements.',
        scope: 'University', 
        level: 70, 
        permissions: [ 'admissions:view', 'admissions:edit', 'admissions:manage' ],
    },
    {
        key: 'SCHOLARSHIP_COORDINATOR', 
        name: 'Scholarship Coordinator',
        description: 'Full control over creating and managing scholarships for the university.',
        scope: 'University', 
        level: 70, 
        permissions: [ 'scholarship:list', 'scholarship:view', 'scholarship:create', 'scholarship:edit', 'scholarship:delete', 'scholarship:restore' ],
    },
    {
        key: 'OPPORTUNITY_MANAGER', 
        name: 'Opportunity Manager',
        description: 'Manages special opportunities like bootcamps, competitions, and research programs.',
        scope: 'University', 
        level: 70, 
        permissions: [ 'opportunity:list', 'opportunity:view', 'opportunity:create', 'opportunity:edit', 'opportunity:delete', 'opportunity:restore' ],
    },
    {
        key: 'NEWS_EDITOR', 
        name: 'News Editor',
        description: 'Full control over creating, publishing, and managing all research news articles.',
        scope: 'University', 
        level: 70, 
        permissions: [ 'news:list', 'news:view', 'news:create', 'news:edit', 'news:publish', 'news:delete', 'news:restore' ],
    },
    {
        key: 'STUDENT_LIFE_MANAGER', 
        name: 'Student Life Manager',
        description: 'Manages all information related to student life, including housing, organizations, and traditions.',
        scope: 'University', 
        level: 65, 
        permissions: [ 'student-life:view', 'student-life:edit', 'student-life:manage' ],
    },
    {
        key: 'ATHLETICS_MANAGER', 
        name: 'Athletics Manager',
        description: 'Manages all information related to university sports, teams, and facilities.',
        scope: 'University', 
        level: 65, 
        permissions: [ 'athletics:view', 'athletics:edit', 'athletics:manage' ],
    },
    {
        key: 'ENTREPRENEURSHIP_MANAGER', 
        name: 'Entrepreneurship Manager',
        description: 'Manages all information for the entrepreneurship program, including incubators and startups.',
        scope: 'University', 
        level: 65, 
        permissions: [ 'entrepreneurship:view', 'entrepreneurship:edit', 'entrepreneurship:manage' ],
    },
    {
        key: 'MENTORSHIP_COORDINATOR',
        name: 'Mentorship Coordinator',
        description: 'Administers the entire mentorship program, including managing bookings for all mentors.',
        scope: 'University',
        level: 70,
        permissions: [
            'user:list', 'user:view', // To find and manage mentors
            'booking:manage-all',
        ],
    },
    {
        key: 'CAREER_SERVICES_ADMIN', 
        name: 'Career Services Admin',
        description: 'Manages post-graduation data, such as employment rates and top employers.',
        scope: 'University', 
        level: 70, 
        permissions: [ 'career-services:view', 'career-services:edit', 'career-services:manage' ],
    },
    {
        key: 'ANALYST_READ_ONLY',
        name: 'Analyst (Read-Only)',
        description: 'Read-only access to view data and analytics across the platform. Cannot make any changes.',
        scope: 'University',
        level: 60,
        permissions: [
            'dashboard:view', 'analytics:view',
            'user:list', 'user:view',
            'role:list', 'role:view',
            'university:list', 'university:view-profile',
            'institution:list', 'institution:view',
            'department:list', 'department:view',
            'program:list', 'program:view',
            'course:list', 'course:view',
            'faculty:list', 'faculty:view',
            'job:list', 'job:view', 'job:view-applications',
            'scholarship:list', 'scholarship:view',
            'opportunity:list', 'opportunity:view',
            'news:list', 'news:view',
            'student-life:view',
            'athletics:view',
            'entrepreneurship:view',
            'career-services:view'
        ],
    },
];