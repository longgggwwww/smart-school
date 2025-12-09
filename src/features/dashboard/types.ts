/**
 * Dashboard Feature - Types
 */

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeClasses: number;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  path: string;
  permission?: string;
}
