import { BarChart3, FolderOpen, Laptop, LogOut, Moon, Settings, Sun, User } from "lucide-react";

// components
import { Input } from "@/common/components/ui/input";

// hooks
import { useStore } from "../../contexts/store.context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/common/components/ui/dropdown-menu";
import { Button } from "@/common/components/ui/button";

export default function PlaygroundHeader() {
  const workspace = useStore(store => store.workspace!);
  const setWorkspace = useStore(store => store.setWorkspace);

  const workspaceName = workspace.name;

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  };

  return (
    <header className="bg-primary text-background p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-20">
        <div className="flex">
          <BarChart3 className="h-6 w-6 text-white" />
          <span className="ml-2 text-xl font-bold text-white">PlotExpress</span>
        </div>
        <div className="flex gap-5 items-center">
          <Input
            value={workspaceName}
            placeholder="Workspace name"
            onChange={e =>
              setWorkspace({
                ...workspace,
                name: e.target.value,
              })
            }
            className="text-lg bg-background/20 px-3 py-1 rounded-lg hidden sm:inline-block w-60 border-none text-white placeholder:text-white/50"
          />
        </div>
      </div>
      <div className="flex items-stretch gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost" 
              size="icon"
              className="text-background hover:bg-background/20"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-white" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-white" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4 text-foreground" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4 text-foreground" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop className="mr-2 h-4 w-4 text-foreground" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-background hover:bg-background/20"
            >
              <User className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4 text-foreground" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderOpen className="mr-2 h-4 w-4 text-foreground" />
              <span>Projects</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4 text-foreground" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
