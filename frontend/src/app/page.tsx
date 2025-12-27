import { TaskList } from "@/components/tasks/TaskList";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <TaskList />
      </main>
    </div>
  );
}
