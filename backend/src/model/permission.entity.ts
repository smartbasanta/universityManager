import { Column, Entity } from 'typeorm';
import { parentEntity } from './parent.entity';

export enum PermissionModule {
  // --- Core Administration ---
  /**
   * Permissions related to managing all user types (Students, Staff, Mentors, etc.),
   * including their profiles, status, and verification.
   */
  USERS = 'User Management',

  /**
   * Permissions for creating, updating, and assigning roles and direct permissions.
   * The heart of the RBAC system.
   */
  ROLES_AND_PERMISSIONS = 'Roles & Permissions',

  /**
   * Permissions for managing the university's core public-facing information,
   * such as overview details, rankings, notable alumni, and research hubs.
   */
  UNIVERSITY_PROFILE = 'University Profile',

  /**
   * Permissions for managing external partner entities, such as corporations or
   * other educational institutions.
   */
  INSTITUTIONS = 'Institution Management',


  // --- Academics ---
  /**
   * Permissions related to the core academic structure: managing departments,
   * programs of study, courses, and faculty profiles.
   */
  ACADEMICS = 'Academics',

  /**
   * Permissions for managing university admissions data, including acceptance
   * rates, deadlines, and specific requirements (e.g., GPA, SAT scores).
   */
  ADMISSIONS = 'Admissions',


  // --- Student-Facing Opportunities ---
  /**
   * Permissions for creating and managing job postings and their associated
   * application forms and questions.
   */
  JOBS = 'Jobs',

  /**
   * Permissions for creating and managing scholarship opportunities, including
   * criteria, deadlines, and application forms.
   */
  SCHOLARSHIPS = 'Scholarships',

  /**
   * Permissions for managing other special opportunities like bootcamps,
   * research programs, competitions, and hackathons.
   */
  OPPORTUNITIES = 'Opportunities',


  // --- Content and Engagement ---
  /**
   * Permissions for creating, publishing, and managing research news articles,
   * including categories and tags.
   */
  RESEARCH_AND_NEWS = 'Research & News',

  /**
   * Permissions for moderating user-generated content like comments and reviews
   * across the entire platform.
   */
  CONTENT_INTERACTIONS = 'Content Interactions',


  // --- Campus Life ---
  /**
   * Permissions related to managing student life information, including housing
   * options, student organizations, and university traditions.
   */
  STUDENT_LIFE = 'Student Life',

  /**
   * Permissions for managing all aspects of university sports, including teams,
   * facilities, achievements, and hosted events.
   */
  ATHLETICS = 'Athletics',

  /**
   * Permissions for managing entrepreneurship program information, such as
   * incubators, hackathons, and startup success stories.
   */
  ENTREPRENEURSHIP = 'Entrepreneurship',


  // --- Services ---
  /**
   * Permissions for managing the mentorship and booking system, including mentor
   * and student ambassador profiles, availability slots, and student bookings.
   */
  MENTORSHIP_AND_BOOKINGS = 'Mentorship & Bookings',

  /**
   * Permissions for managing data related to post-graduation success, such as
   * employment rates, median salaries, and top employers.
   */
  CAREER_SERVICES = 'Career Services',

  /**
   * A general module for permissions related to viewing analytics, reports,
   * and administrative dashboards.
   */
  DASHBOARD = 'Dashboard',
}

@Entity('permissions')
export class PermissionEntity extends parentEntity {
  @Column({
    unique: true,
    comment: 'The code-level key of the permission, e.g., "job:create"',
  })
  key: string;

  @Column({
    comment: 'User friendly name to be displayed in frontend',
  })
  name: string;

  @Column({
    type: 'enum',
    enum: PermissionModule,
    nullable: true,
    comment: 'The high-level application module this permission belongs to',
  })
  module: PermissionModule;

  @Column({
    nullable: true,
    comment: 'A user-friendly group name for displaying in the UI, e.g., "Job Posting Management"',
  })
  group: string;

  @Column({
    nullable: true,
    comment: 'A user-friendly description of what the permission allows',
  })
  description: string;
}