// Re-export types from Supabase generated types
export type { Database, Json } from './supabase';

import type { Database } from './supabase';

// Convenience type aliases
export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

export type DailySchedule = Database['public']['Tables']['daily_schedules']['Row'];
export type DailyScheduleInsert = Database['public']['Tables']['daily_schedules']['Insert'];
export type DailyScheduleUpdate = Database['public']['Tables']['daily_schedules']['Update'];

export type PomodoroLog = Database['public']['Tables']['pomodoro_logs']['Row'];
export type PomodoroLogInsert = Database['public']['Tables']['pomodoro_logs']['Insert'];
export type PomodoroLogUpdate = Database['public']['Tables']['pomodoro_logs']['Update'];

// Enum types
export type TaskStatus = Database['public']['Enums']['task_status'];
export type TaskSource = Database['public']['Enums']['task_source'];
export type PomodoroStatus = Database['public']['Enums']['pomodoro_status'];

// Priority is a number (0=none, 1=urgent, 2=high, 3=medium, 4=low)
export type TaskPriority = Task['priority'];
