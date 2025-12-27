import { TaskList } from "@/components/tasks/TaskList";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <header className="border-b bg-white dark:bg-zinc-900">
          <div className="container mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold">Chrono Agent</h1>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto max-w-5xl px-4 py-8">
          <TaskList />
        </main>
      </div>
    </AuthGuard>
  );
}
