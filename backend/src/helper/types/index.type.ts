export enum roleType {
    SUPER_ADMIN = 'super_admin',

    UNIVERSITY = 'university',
    UNIVERSITY_STAFF = 'university_staff',
    DEPARTMENT_STAFF = 'department_staff',
    
    INSTITUTION = 'institution',
    INSTITUTION_STAFF = 'institution_staff',
    DIVISION_STAFF = 'division_staff',

    MENTOR = 'mentor',
    STUDENT_AMBASSADOR = 'student_ambassador',
    
    STUDENT = 'student'
}

export enum staffRoleType {
    UNIVERSITY_STAFF = 'UNIVERSITY_STAFF',
    DEPARTMENT_STAFF = 'DEPARTMENT_STAFF',
    INSTITUTION_STAFF = 'INSTITUTION_STAFF',
    DIVISION_STAFF = 'DIVISION_STAFF',
    ALL_STAFF = 'ALL_STAFF',
}

export enum enrollStatus {
    approved = "approved",
    pending = "pending",
    reject = "reject"
}

export enum genderType {
    male = "male",
    female = "female",
    others = "others"
}

export type JwtPayload = {
    sub: string;
    // role: string;
    // permissions?: string[];
    // UniversityId?: string;
};


export enum permissionType {
    // Research News Management
    RESEARCH_NEWS_CONTRIBUTOR = 'RESEARCH_NEWS_CONTRIBUTOR',     // Can only manage own content
    RESEARCH_NEWS_REVIEWER = 'RESEARCH_NEWS_REVIEWER',           // Can read all, edit own
    RESEARCH_NEWS_EDITOR = 'RESEARCH_NEWS_EDITOR',               // Can read all, edit all

    // University Profile Management (Only for University)
    UNIVERSITY_PROFILE_ADMIN = 'UNIVERSITY_PROFILE_ADMIN',        // Full access to everything

    // Company Profile Management (Only for Company)
    COMPANY_PROFILE_ADMIN = 'COMPANY_PROFILE_ADMIN',        // Full access to everything

    // Scholarship Management
    SCHOLARSHIP_CONTRIBUTOR = 'SCHOLARSHIP_CONTRIBUTOR',         // Can only manage own content
    SCHOLARSHIP_REVIEWER = 'SCHOLARSHIP_REVIEWER',               // Can read all, edit own
    SCHOLARSHIP_EDITOR = 'SCHOLARSHIP_EDITOR',                   // Can read all, edit all

    // Job Management
    JOB_CONTRIBUTOR = 'JOB_CONTRIBUTOR',                         // Can only manage own content
    JOB_REVIEWER = 'JOB_REVIEWER',                               // Can read all, edit own
    JOB_EDITOR = 'JOB_EDITOR',                                   // Can read all, edit all

    // Mentor Management
    MENTOR_ADMIN = 'MENTOR_ADMIN',                             // Full access to everything

    // Student Ambassador Management (Only for University)
    STUDENT_AMBASSADOR_ADMIN = 'STUDENT_AMBASSADOR_ADMIN',       // Full access to everything

    // Opportunity Management
    OPPORTUNITY_CONTRIBUTOR = 'OPPORTUNITY_CONTRIBUTOR',         // Can only manage own content
    OPPORTUNITY_REVIEWER = 'OPPORTUNITY_REVIEWER',               // Can read all, edit own
    OPPORTUNITY_EDITOR = 'OPPORTUNITY_EDITOR',                   // Can read all, edit all
    
    // Team Management
    TEAM_MANAGEMENT_ADMIN = 'TEAM_MANAGEMENT_ADMIN',             // Full access to everything
}

export enum AccessType {
    FREE = 'Free',
    PREMIUM = 'Premium'
}

export type VerifyPayload = {
    email: string;
};

export type accountApprovalPayload = {
    type: string;
    role: string;
    id: string;
    permission?: string[];
}

export enum NewsStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

export enum AccountStatusType {
    active = 'Active',
    pending = 'Pending',
    awaiting = 'Awaiting'
}


export enum ResearchCategory {
    AI = 'ai',
    AEROSPACE = 'aerospace',
    HEALTH = 'health',
    SUSTAINABILITY = 'sustainability',
    QUANTUM = 'quantum',
    OTHER = 'other',
}