export type UserRole = 'master' | 'slave';

export interface Headquarters {
  headquartersId: string;
  name: string;
  description?: string;
  createdAt: Date;
  userHeadquarters?: UserHeadquarters[];
}

export interface UserHeadquarters {
  userId: string;
  headquartersId: string;
  role: UserRole;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  age?: number | null;
  role?: string | null;
}

export interface Procedure {
  id: string;
  headquartersId: string;
  name: string;
  description: string;
  fields: FormField[];
  createdAt: Date;
  createdBy: string;
}

export interface FormField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'email' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
}

export type RequestStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export interface Request {
  id: string;
  headquartersId: string;
  procedureId: string;
  procedureName: string;
  applicantId: string;
  applicantName: string;
  status: RequestStatus;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  headquartersId: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  createdBy: string;
}

export interface DashboardData {
  headquarters: Headquarters | undefined;
  procedures: Procedure[];
  requests: Request[];
}
