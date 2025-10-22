export interface Account {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  activated: boolean;
  langKey: string;
  profession: string;
  socialNets: string[];
  organization: string;
  moderationInterest: boolean;
  description: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  authorities: string[];
}
