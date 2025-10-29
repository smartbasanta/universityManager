export interface ProfileData {
  name: string;
  title: string;
  location: string;
  bio?: string;
  avatar: string;
  linkedin?: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read?: boolean;
  href?: string;
  onClick?: () => void;
}

