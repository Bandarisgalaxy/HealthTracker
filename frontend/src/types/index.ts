export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'doctor' | 'guardian';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface HealthRecord {
  id: string;
  type: 'allergy' | 'vital' | 'prescription' | 'visit' | 'vaccination' | 'other';
  title: string;
  notes: any;
  meta?: any;
  createdAt: string;
}

export interface Reminder {
  _id: string;
  title: string;
  message?: string;
  remindAt: string;
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  done: boolean;
  createdAt: string;
}

export interface CreateHealthRecordData {
  type: HealthRecord['type'];
  title: string;
  notes: any;
  meta?: any;
}

export interface CreateReminderData {
  title: string;
  message?: string;
  remindAt: string;
  repeat?: Reminder['repeat'];
}