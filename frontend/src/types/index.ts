// Project Types
export interface Project {
  id: number;
  name: string;
  code: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  budget: number;
  project_manager: number;
  created_at: string;
  updated_at: string;
  phases: Phase[];
  risks: Risk[];
  documents: ProjectDocument[];
  progress_updates: Progress[];
}

export interface Phase {
  id: number;
  project: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  completion_percentage: number;
  tasks: Task[];
}

export interface Task {
  id: number;
  phase: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to: number | null;
  completion_percentage: number;
  dependencies: number[];
}

// Financial Types
export interface Budget {
  id: number;
  project: number;
  total_amount: number;
  start_date: string;
  end_date: string;
  notes: string;
  created_by: number;
  items: BudgetItem[];
}

export interface BudgetItem {
  id: number;
  budget: number;
  category: 'labor' | 'material' | 'equipment' | 'subcontractor' | 'overhead' | 'other';
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

export interface Expense {
  id: number;
  project: number;
  budget_item: number | null;
  description: string;
  amount: number;
  date: string;
  receipt: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submitted_by: number;
  approved_by: number | null;
  notes: string;
}

// Resource Types
export interface Equipment {
  id: number;
  name: string;
  equipment_code: string;
  category: string;
  description: string;
  status: 'available' | 'in_use' | 'maintenance' | 'repair' | 'retired';
  location: string;
}

export interface Material {
  id: number;
  name: string;
  code: string;
  category: string;
  description: string;
  unit: string;
  unit_price: number;
  current_stock: number;
}

// HR Types
export interface Employee {
  id: number;
  user: number;
  employee_id: string;
  department: string;
  position: string;
  phone: string;
  join_date: string;
  salary: number;
}

export interface TimeSheet {
  id: number;
  employee: number;
  project: number;
  start_date: string;
  end_date: string;
  total_hours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  entries: TimeSheetEntry[];
}

// Document Types
export interface Document {
  id: number;
  project: number;
  title: string;
  document_type: 'contract' | 'drawing' | 'specification' | 'permit' | 'report' | 'correspondence' | 'other';
  document_number: string;
  description: string;
  file: string;
  version: string;
  status: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// Dashboard Types
export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  total_budget: number;
  total_expenses: number;
  pending_tasks: number;
  equipment_utilization: number;
  recent_activities: Activity[];
}

export interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user: User;
  project?: Project;
}
