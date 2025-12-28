"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task, TaskStatus } from "@/types/database";
import { Calendar, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  pending: "未着手",
  in_progress: "進行中",
  completed: "完了",
  cancelled: "キャンセル",
};

// Priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low
const priorityLabels: Record<number, string> = {
  0: "なし",
  1: "緊急",
  2: "高",
  3: "中",
  4: "低",
};

const priorityColors: Record<number, string> = {
  0: "bg-slate-400",
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-blue-500",
  4: "bg-slate-500",
};

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-medium leading-tight">
            {task.title}
          </CardTitle>
          <Badge
            className={`${priorityColors[task.priority] || priorityColors[0]} text-white text-xs`}
          >
            {priorityLabels[task.priority] || priorityLabels[0]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <Select
            value={task.status}
            onValueChange={(value) =>
              onStatusChange(task.id, value as TaskStatus)
            }
          >
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
                <SelectItem key={status} value={status} className="text-xs">
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(task.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {task.due_date && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.due_date)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
