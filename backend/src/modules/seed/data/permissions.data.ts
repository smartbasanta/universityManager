import { PermissionModule } from "src/model/permission.entity";

export const permissionsData = [
    // --- CORE ADMINISTRATION ---
    // USER MANAGEMENT
    { key: 'user:list', name: 'List Users', module: PermissionModule.USERS, group: 'Users', description: 'Can view lists of all users' },
    { key: 'user:view', name: 'View User Profile', module: PermissionModule.USERS, group: 'Users', description: 'Can view the detailed profile of any user' },
    { key: 'user:edit', name: 'Edit User Profile', module: PermissionModule.USERS, group: 'Users', description: 'Can edit profile information for any user' },
    { key: 'user:change-status', name: 'Change User Status', module: PermissionModule.USERS, group: 'Users', description: 'Can change user status (active, suspended, waiting approval)' },
    { key: 'user:delete', name: 'Delete User', module: PermissionModule.USERS, group: 'Users', description: 'Can soft-delete any user account' },
    { key: 'user:restore', name: 'Restore User', module: PermissionModule.USERS, group: 'Users', description: 'Can restore a soft-deleted user account' },
    
    // Own Profile Permissions
    { key: 'profile:edit-own', name: 'Edit Own Profile', module: PermissionModule.USERS, group: 'User Actions', description: 'Can edit their own user profile' },
    { key: 'mentor-profile:edit-own', name: 'Edit Own Mentor Profile', module: PermissionModule.USERS, group: 'User Actions', description: 'Can edit their own specialized mentor profile' },
    { key: 'ambassador-profile:edit-own', name: 'Edit Own Ambassador Profile', module: PermissionModule.USERS, group: 'User Actions', description: 'Can edit their own specialized student ambassador profile' },

    // ROLES & PERMISSIONS
    { key: 'role:list', name: 'List Roles', module: PermissionModule.ROLES_AND_PERMISSIONS, group: 'Roles', description: 'Can view the list of available roles' },
    { key: 'role:view', name: 'View Role Details', module: PermissionModule.ROLES_AND_PERMISSIONS, group: 'Roles', description: 'Can view a role and its assigned permissions' },
    { key: 'role:create', name: 'Create Roles', module: PermissionModule.ROLES_AND_PERMISSIONS, group: 'Roles', description: 'Can create new roles' },
    { key: 'role:edit', name: 'Edit Roles', module: PermissionModule.ROLES_AND_PERMISSIONS, group: 'Roles', description: 'Can edit existing roles and their permissions' },
    { key: 'role:assign', name: 'Assign Roles', module: PermissionModule.ROLES_AND_PERMISSIONS, group: 'Roles', description: 'Can assign roles to users within their scope' },
    { key: 'permission:list', name: 'List Permissions', module: PermissionModule.ROLES_AND_PERMISSIONS, group: 'Permissions', description: 'Can view the list of available permissions' },
    { key: 'permission:view', name: 'View Permission Details', module: PermissionModule.ROLES_AND_PERMISSIONS, group: 'Permissions', description: 'Can view a permission and its details' },

    // UNIVERSITY PROFILE
    { key: 'university:view-profile', name: 'View University Profile', module: PermissionModule.UNIVERSITY_PROFILE, group: 'University', description: 'Can view the public university profile page' },
    { key: 'university:create', name: 'Create University', module: PermissionModule.UNIVERSITY_PROFILE, group: 'University', description: 'Can create new University' },
    { key: 'university:list', name: 'View University list', module: PermissionModule.UNIVERSITY_PROFILE, group: 'University', description: 'Can view the university listing page' },
    { key: 'university:edit-profile', name: 'Edit University Profile', module: PermissionModule.UNIVERSITY_PROFILE, group: 'University', description: 'Can edit the main university profile details' },
    { key: 'university:publish', name: 'Publish University', module: PermissionModule.UNIVERSITY_PROFILE, group: 'University', description: 'Can change the university status to published/unpublished' },
    
    // INSTITUTIONS
    { key: 'institution:list', name: 'List Institutions', module: PermissionModule.INSTITUTIONS, group: 'Institutions', description: 'Can view a list of partner institutions' },
    { key: 'institution:view', name: 'View Institution', module: PermissionModule.INSTITUTIONS, group: 'Institutions', description: 'Can view the profile of a partner institution' },
    { key: 'institution:create', name: 'Create Institution', module: PermissionModule.INSTITUTIONS, group: 'Institutions', description: 'Can create new partner institutions' },
    { key: 'institution:edit', name: 'Edit Institution', module: PermissionModule.INSTITUTIONS, group: 'Institutions', description: 'Can edit partner institutions' },
    { key: 'institution:delete', name: 'Delete Institution', module: PermissionModule.INSTITUTIONS, group: 'Institutions', description: 'Can delete partner institutions' },
    { key: 'institution:manage', name: 'Manage Institutions', module: PermissionModule.INSTITUTIONS, group: 'Institutions', description: 'Can create, edit, or delete partner institutions' },

    // --- ACADEMICS ---
    { key: 'department:list', name: 'List Departments', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can view a list of academic departments' },
    { key: 'department:view', name: 'View Department', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can view details of an academic department' },
    { key: 'department:manage', name: 'Manage Departments', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can create, edit, and delete academic departments' },
    { key: 'department:create', name: 'Create Department', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can create new academic departments' },
    { key: 'department:edit', name: 'Edit Department', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can edit academic departments' },
    { key: 'department:delete', name: 'Delete Department', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can delete academic departments' },
    
    { key: 'program:list', name: 'List Programs', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can view a list of academic programs' },
    { key: 'program:view', name: 'View Program', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can view details of an academic program' },
    { key: 'program:create', name: 'Create Program', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can create new academic programs' },
    { key: 'program:edit', name: 'Edit Program', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can edit academic programs' },
    { key: 'program:delete', name: 'Delete Program', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can delete academic programs' },
    { key: 'program:manage', name: 'Manage Programs', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can create, edit, and delete academic programs' },
    
    { key: 'course:list', name: 'List Courses', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can view a list of courses' },
    { key: 'course:view', name: 'View Course', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can view details of a course' },
    { key: 'course:create', name: 'Create Course', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can create new courses' },
    { key: 'course:edit', name: 'Edit Course', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can edit courses' },
    { key: 'course:delete', name: 'Delete Course', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can delete courses' },
    { key: 'course:manage', name: 'Manage Courses', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can create, edit, and delete courses' },
    
    { key: 'faculty:list', name: 'List Faculty', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can view a list of faculty members' },
    { key: 'faculty:view', name: 'View Faculty', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can view the profile of a faculty member' },
    { key: 'faculty:create', name: 'Create Faculty', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can add new faculty profiles' },
    { key: 'faculty:edit', name: 'Edit Faculty', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can edit faculty profiles' },
    { key: 'faculty:delete', name: 'Delete Faculty', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can remove faculty profiles' },
    { key: 'faculty:manage', name: 'Manage Faculty', module: PermissionModule.ACADEMICS, group: 'Academics', description: 'Can add, edit, and remove faculty profiles' },

    // --- ADMISSIONS ---
    { key: 'admissions:view', name: 'View Admissions Data', module: PermissionModule.ADMISSIONS, group: 'Admissions', description: 'Can view admission requirements and statistics' },
    { key: 'admissions:edit', name: 'Edit Admissions Data', module: PermissionModule.ADMISSIONS, group: 'Admissions', description: 'Can edit admission requirements and statistics' },
    { key: 'admissions:manage', name: 'Manage Admissions Data', module: PermissionModule.ADMISSIONS, group: 'Admissions', description: 'Can edit admission requirements and statistics' },

    // --- STUDENT OPPORTUNITIES ---
    { key: 'job:list', name: 'List Jobs', module: PermissionModule.JOBS, group: 'Jobs', description: 'Can view job listings' },
    { key: 'job:view', name: 'View Job', module: PermissionModule.JOBS, group: 'Jobs', description: 'Can view job details' },
    { key: 'job:create', name: 'Create Job', module: PermissionModule.JOBS, group: 'Jobs', description: 'Can create job postings' },
    { key: 'job:edit', name: 'Edit Job', module: PermissionModule.JOBS, group: 'Jobs', description: 'Can edit job postings' },
    { key: 'job:publish', name: 'Publish Job', module: PermissionModule.JOBS, group: 'Jobs', description: 'Can publish jobs to make them live' },
    { key: 'job:delete', name: 'Delete Job', module: PermissionModule.JOBS, group: 'Jobs', description: 'Can delete job postings' },
    { key: 'job:restore', name: 'Restore Job', module: PermissionModule.JOBS, group: 'Jobs', description: 'Can restore soft-deleted job postings' },
    { key: 'job:view-applications', name: 'View Job Applications', module: PermissionModule.JOBS, group: 'Jobs', description: 'Can view applications submitted for a job' },

    { key: 'scholarship:list', name: 'List Scholarships', module: PermissionModule.SCHOLARSHIPS, group: 'Scholarships', description: 'Can view scholarship listings' },
    { key: 'scholarship:view', name: 'View Scholarship', module: PermissionModule.SCHOLARSHIPS, group: 'Scholarships', description: 'Can view scholarship details' },
    { key: 'scholarship:create', name: 'Create Scholarship', module: PermissionModule.SCHOLARSHIPS, group: 'Scholarships', description: 'Can create scholarship listings' },
    { key: 'scholarship:edit', name: 'Edit Scholarship', module: PermissionModule.SCHOLARSHIPS, group: 'Scholarships', description: 'Can edit scholarship listings' },
    { key: 'scholarship:delete', name: 'Delete Scholarship', module: PermissionModule.SCHOLARSHIPS, group: 'Scholarships', description: 'Can delete scholarship listings' },
    { key: 'scholarship:restore', name: 'Restore Scholarship', module: PermissionModule.SCHOLARSHIPS, group: 'Scholarships', description: 'Can restore deleted scholarships' },

    { key: 'opportunity:list', name: 'List Opportunities', module: PermissionModule.OPPORTUNITIES, group: 'Opportunities', description: 'Can view opportunities' },
    { key: 'opportunity:view', name: 'View Opportunity', module: PermissionModule.OPPORTUNITIES, group: 'Opportunities', description: 'Can view opportunity details' },
    { key: 'opportunity:create', name: 'Create Opportunity', module: PermissionModule.OPPORTUNITIES, group: 'Opportunities', description: 'Can create opportunities' },
    { key: 'opportunity:edit', name: 'Edit Opportunity', module: PermissionModule.OPPORTUNITIES, group: 'Opportunities', description: 'Can edit opportunities' },
    { key: 'opportunity:delete', name: 'Delete Opportunity', module: PermissionModule.OPPORTUNITIES, group: 'Opportunities', description: 'Can delete opportunities' },
    { key: 'opportunity:restore', name: 'Restore Opportunity', module: PermissionModule.OPPORTUNITIES, group: 'Opportunities', description: 'Can restore deleted opportunities' },

    // --- CONTENT & ENGAGEMENT ---
    { key: 'news:list', name: 'List News', module: PermissionModule.RESEARCH_AND_NEWS, group: 'News', description: 'Can view published research news articles' },
    { key: 'news:view', name: 'View News', module: PermissionModule.RESEARCH_AND_NEWS, group: 'News', description: 'Can read a full news article' },
    { key: 'news:create', name: 'Create News', module: PermissionModule.RESEARCH_AND_NEWS, group: 'News', description: 'Can create research news articles as drafts' },
    { key: 'news:publish', name: 'Publish News', module: PermissionModule.RESEARCH_AND_NEWS, group: 'News', description: 'Can publish news articles, making them live' },
    { key: 'news:edit', name: 'Edit News', module: PermissionModule.RESEARCH_AND_NEWS, group: 'News', description: 'Can edit any news article' },
    { key: 'news:delete', name: 'Delete News', module: PermissionModule.RESEARCH_AND_NEWS, group: 'News', description: 'Can delete news articles' },
    { key: 'news:restore', name: 'Restore News', module: PermissionModule.RESEARCH_AND_NEWS, group: 'News', description: 'Can restore deleted news articles' },

    { key: 'comment:moderate', name: 'Moderate Comments', module: PermissionModule.CONTENT_INTERACTIONS, group: 'Content Moderation', description: 'Can approve, hide, or mark comments as spam' },
    { key: 'review:moderate', name: 'Moderate Reviews', module: PermissionModule.CONTENT_INTERACTIONS, group: 'Content Moderation', description: 'Can approve or hide university reviews' },
    
    // --- CAMPUS LIFE ---
    { key: 'student-life:view', name: 'View Student Life Info', module: PermissionModule.STUDENT_LIFE, group: 'Campus Life', description: 'Can view housing, organizations, and traditions' },
    { key: 'student-life:edit', name: 'Edit Student Life Info', module: PermissionModule.STUDENT_LIFE, group: 'Campus Life', description: 'Can edit housing, organizations, and traditions' },
    { key: 'student-life:manage', name: 'Manage Student Life Info', module: PermissionModule.STUDENT_LIFE, group: 'Campus Life', description: 'Can edit housing, organizations, and traditions' },
    { key: 'athletics:edit', name: 'Edit Athletics Info', module: PermissionModule.ATHLETICS, group: 'Campus Life', description: 'Can edit sports teams and facilities' },
    { key: 'entrepreneurship:edit', name: 'Edit Entrepreneurship Info', module: PermissionModule.ENTREPRENEURSHIP, group: 'Campus Life', description: 'Can edit incubators and startup stories' },

    { key: 'athletics:view', name: 'View Athletics Info', module: PermissionModule.ATHLETICS, group: 'Campus Life', description: 'Can view sports teams and facilities' },
    { key: 'athletics:manage', name: 'Manage Athletics Info', module: PermissionModule.ATHLETICS, group: 'Campus Life', description: 'Can edit sports teams and facilities' },

    { key: 'entrepreneurship:view', name: 'View Entrepreneurship Info', module: PermissionModule.ENTREPRENEURSHIP, group: 'Campus Life', description: 'Can view incubators and startup stories' },
    { key: 'entrepreneurship:manage', name: 'Manage Entrepreneurship Info', module: PermissionModule.ENTREPRENEURSHIP, group: 'Campus Life', description: 'Can edit incubators and startup stories' },

    // --- SERVICES ---
    { key: 'slot:manage-own', name: 'Manage Own Slots', module: PermissionModule.MENTORSHIP_AND_BOOKINGS, group: 'Mentorship', description: 'Can create, edit, and delete their own availability slots' },
    { key: 'booking:view-own', name: 'View Own Bookings', module: PermissionModule.MENTORSHIP_AND_BOOKINGS, group: 'Mentorship', description: 'Can view bookings made for their own slots' },
    { key: 'booking:manage-all', name: 'Manage All Bookings', module: PermissionModule.MENTORSHIP_AND_BOOKINGS, group: 'Mentorship', description: 'Can view and cancel any booking in the system' },
    
    { key: 'career-services:view', name: 'View Career Outcomes', module: PermissionModule.CAREER_SERVICES, group: 'Services', description: 'Can view career outcome statistics' },
    { key: 'career-services:edit', name: 'Edit Career Outcomes', module: PermissionModule.CAREER_SERVICES, group: 'Services', description: 'Can edit career outcome statistics' },
    { key: 'career-services:manage', name: 'Manage Career Outcomes', module: PermissionModule.CAREER_SERVICES, group: 'Services', description: 'Can edit career outcome statistics' },

    // --- DASHBOARD ---
    { key: 'dashboard:view', name: 'View Admin Dashboard', module: PermissionModule.DASHBOARD, group: 'Dashboard', description: 'Can access the main administrative dashboard' },
    { key: 'analytics:view', name: 'View Analytics', module: PermissionModule.DASHBOARD, group: 'Dashboard', description: 'Can view analytics and reports' },
];