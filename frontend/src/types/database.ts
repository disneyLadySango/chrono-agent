export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          estimated_minutes: number | null;
          actual_minutes: number | null;
          due_date: string | null;
          completed_at: string | null;
          linear_issue_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          estimated_minutes?: number | null;
          actual_minutes?: number | null;
          due_date?: string | null;
          completed_at?: string | null;
          linear_issue_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          estimated_minutes?: number | null;
          actual_minutes?: number | null;
          due_date?: string | null;
          completed_at?: string | null;
          linear_issue_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      daily_schedules: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          start_time: string;
          end_time: string;
          task_id: string | null;
          event_type: 'task' | 'break' | 'meeting' | 'focus_time' | 'other';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          start_time: string;
          end_time: string;
          task_id?: string | null;
          event_type?: 'task' | 'break' | 'meeting' | 'focus_time' | 'other';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          task_id?: string | null;
          event_type?: 'task' | 'break' | 'meeting' | 'focus_time' | 'other';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'daily_schedules_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
      pomodoro_logs: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          started_at: string;
          ended_at: string | null;
          duration_minutes: number;
          session_type: 'work' | 'short_break' | 'long_break';
          completed: boolean;
          interrupted: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id?: string | null;
          started_at: string;
          ended_at?: string | null;
          duration_minutes: number;
          session_type?: 'work' | 'short_break' | 'long_break';
          completed?: boolean;
          interrupted?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string | null;
          started_at?: string;
          ended_at?: string | null;
          duration_minutes?: number;
          session_type?: 'work' | 'short_break' | 'long_break';
          completed?: boolean;
          interrupted?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pomodoro_logs_task_id_fkey';
            columns: ['task_id'];
            isOneToOne: false;
            referencedRelation: 'tasks';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Convenience type aliases
export type Task = Tables<'tasks'>;
export type TaskInsert = InsertTables<'tasks'>;
export type TaskUpdate = UpdateTables<'tasks'>;

export type DailySchedule = Tables<'daily_schedules'>;
export type DailyScheduleInsert = InsertTables<'daily_schedules'>;
export type DailyScheduleUpdate = UpdateTables<'daily_schedules'>;

export type PomodoroLog = Tables<'pomodoro_logs'>;
export type PomodoroLogInsert = InsertTables<'pomodoro_logs'>;
export type PomodoroLogUpdate = UpdateTables<'pomodoro_logs'>;
