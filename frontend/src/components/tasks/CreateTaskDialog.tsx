"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import type { Task, TaskStatus } from "@/types/database";
import { Loader2 } from "lucide-react";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: (task: Task) => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "未着手" },
  { value: "in_progress", label: "進行中" },
  { value: "completed", label: "完了" },
  { value: "cancelled", label: "キャンセル" },
];

// Priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low
const priorityOptions: { value: string; label: string }[] = [
  { value: "4", label: "低" },
  { value: "3", label: "中" },
  { value: "2", label: "高" },
  { value: "1", label: "緊急" },
];

export function CreateTaskDialog({
  open,
  onOpenChange,
  onTaskCreated,
}: CreateTaskDialogProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [priority, setPriority] = useState("3"); // Medium
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setPriority("3");
    setDueDate("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!user) {
      setError("You must be logged in to create a task");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          status,
          priority: parseInt(priority, 10),
          due_date: dueDate || null,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        onTaskCreated(data);
        resetForm();
      }
    } catch (err: unknown) {
      console.error("Error creating task:", JSON.stringify(err, null, 2));
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String(err.message)
          : "Failed to create task";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新しいタスクを作成</DialogTitle>
          <DialogDescription>
            タスクの詳細を入力してください。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクのタイトルを入力"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="タスクの説明を入力（任意）"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">ステータス</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as TaskStatus)}
                disabled={loading}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">優先度</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value)}
                disabled={loading}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">期限</Label>
            <Input
              id="due_date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  作成中...
                </>
              ) : (
                "作成"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
