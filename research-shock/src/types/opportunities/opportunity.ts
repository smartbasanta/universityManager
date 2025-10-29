export interface SearchFilters {
  query: string;
  educationalLevel: string;
  datePosted: string;
  OpportunityType: string;
  location: string;
}

export interface LegacyOpportunity {
  id: string;
  title: string;
  organization: string;
  location: string;
  educationLevel: string;
  modeOfEngagement: 'Virtual' | 'In-person' | 'Hybrid';
  typeOfOpportunity: string;
  datePosted: string;
  logo: string;
  tags: string[];
  description: string;
  eventDetails: {
    location: string;
    dateTime: string;
    keywords: string[];
    flyer?: string;
  };
  organizationType: string;
  organizationDescription: string;
  isSelected?: boolean;
}
