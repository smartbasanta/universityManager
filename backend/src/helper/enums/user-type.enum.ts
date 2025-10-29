/**
 * Defines the primary persona or scope of a user in the system.
 * This is stored on the AuthEntity for quick role lookups and polymorphism.
 */
export enum UserType {
  // Broad administrative scopes
  UNIVERSITY_ADMIN = 'university_admin',
  INSTITUTION_ADMIN = 'institution_admin',
  DEPARTMENT_ADMIN = 'department_admin',

  // Specific user roles
  STUDENT = 'student',
  STAFF = 'staff',
  MENTOR_IN_RESIDENCE = 'mentor_in_residence',
  STUDENT_AMBASSADOR = 'student_ambassador',
}