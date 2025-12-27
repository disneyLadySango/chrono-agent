import { LinearClient, Issue } from '@linear/sdk';
import { supabase } from './supabase';
import type { TaskInsert, Task } from '@/types/database';

export function createLinearClient(apiKey: string): LinearClient {
  return new LinearClient({ apiKey });
}

export interface LinearIssue {
  id: string;
  title: string;
  description: string | null;
  state: {
    name: string;
    type: string;
  } | null;
  priority: number;
  dueDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function mapLinearPriorityToTask(priority: number): Task['priority'] {
  // Linear priority: 0 = No priority, 1 = Urgent, 2 = High, 3 = Medium, 4 = Low
  switch (priority) {
    case 1:
      return 'urgent';
    case 2:
      return 'high';
    case 3:
      return 'medium';
    case 4:
      return 'low';
    default:
      return 'medium';
  }
}

function mapLinearStateToTaskStatus(
  stateType: string | undefined
): Task['status'] {
  // Linear state types: backlog, unstarted, started, completed, canceled
  switch (stateType) {
    case 'completed':
      return 'completed';
    case 'canceled':
      return 'cancelled';
    case 'started':
      return 'in_progress';
    case 'backlog':
    case 'unstarted':
    default:
      return 'pending';
  }
}

export async function fetchLinearIssues(
  client: LinearClient
): Promise<LinearIssue[]> {
  const me = await client.viewer;
  const assignedIssues = await me.assignedIssues({
    filter: {
      state: {
        type: { nin: ['completed', 'canceled'] },
      },
    },
    first: 50,
  });

  const issues: LinearIssue[] = [];
  for (const issue of assignedIssues.nodes) {
    const state = await issue.state;
    issues.push({
      id: issue.id,
      title: issue.title,
      description: issue.description ?? null,
      state: state
        ? {
            name: state.name,
            type: state.type,
          }
        : null,
      priority: issue.priority,
      dueDate: issue.dueDate ?? null,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    });
  }

  return issues;
}

export async function syncLinearIssuesToSupabase(
  userId: string,
  issues: LinearIssue[]
): Promise<{ synced: number; errors: string[] }> {
  const errors: string[] = [];
  let synced = 0;

  for (const issue of issues) {
    try {
      // Check if task already exists with this linear_issue_id
      const { data: existingTask } = await supabase
        .from('tasks')
        .select('id')
        .eq('linear_issue_id', issue.id)
        .eq('user_id', userId)
        .single();

      const taskData: Partial<TaskInsert> = {
        title: issue.title,
        description: issue.description,
        status: mapLinearStateToTaskStatus(issue.state?.type),
        priority: mapLinearPriorityToTask(issue.priority),
        due_date: issue.dueDate,
        linear_issue_id: issue.id,
      };

      if (existingTask) {
        // Update existing task
        const { error: updateError } = await supabase
          .from('tasks')
          .update({
            ...taskData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingTask.id);

        if (updateError) {
          errors.push(`Failed to update task for issue ${issue.id}: ${updateError.message}`);
        } else {
          synced++;
        }
      } else {
        // Create new task
        const { error: insertError } = await supabase.from('tasks').insert({
          user_id: userId,
          ...taskData,
        } as TaskInsert);

        if (insertError) {
          errors.push(`Failed to create task for issue ${issue.id}: ${insertError.message}`);
        } else {
          synced++;
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      errors.push(`Error processing issue ${issue.id}: ${message}`);
    }
  }

  return { synced, errors };
}

export async function syncLinearTasks(
  apiKey: string,
  userId: string
): Promise<{ synced: number; errors: string[] }> {
  const client = createLinearClient(apiKey);
  const issues = await fetchLinearIssues(client);
  return syncLinearIssuesToSupabase(userId, issues);
}
