export interface ClientDocuments {
  aadharFront: string;
  aadharBack: string;
  photo: string;
  nomineeAadhar: string;
}

export type EmploymentType = 'Salaried' | 'Self-Employed';
export type ApplicationStatus = 'Pending' | 'Approved';
export type WithdrawalState = 'none' | 'pending' | 'blocked';
export type AccountType = 'Savings' | 'Current';

export interface ClientApplication {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dob?: string;
  address?: string;
  employment: EmploymentType;
  salary?: number | string;
  loanAmount: string; // e.g. "₹5,00,000" or raw
  bankName: string;
  bankHolder?: string;
  bankAcc: string;
  bankIfsc: string;
  bankType?: AccountType;
  nomineeName?: string;
  nomineePhone?: string;
  password: string;
  status: ApplicationStatus;
  walletBalance: number;
  withdrawalState: WithdrawalState;
  withdrawalTimestamp?: number; // timestamp when withdrawal was clicked
  documents: ClientDocuments;
  createdAt?: string;
}

export type AppView = 'register' | 'client-dashboard' | 'admin';
export type DashboardTab = 'profile' | 'wallet' | 'emi';
