/**
 * Defines the approval and activity status for user profiles like Staff and Ambassadors.
 */
export enum UserStatus {
  ACTIVE = 'Active', // Use 'ACTIVE' to match your other PersonStatus enum
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  SUSPENDED = 'SUSPENDED',
}

export enum PersonStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING_APPROVAL = 'Pending Approval',
  SUSPENDED = 'Suspended',
}
