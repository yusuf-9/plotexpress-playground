"use client";

import { BarChart3 } from "lucide-react";

// components
import { Input } from "@/common/components/ui/input";

// hooks
import { useStore } from "../../contexts/store.context";

export default function PlaygroundHeader() {
  const workspace = useStore(store => store.workspace!);
  const setWorkspace = useStore(store => store.setWorkspace);

  const workspaceName = workspace.name;

  return (
    <header className="bg-gradient-to-r from-main to-[#34d399] text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-10">
        <BarChart3 className="h-6 w-6" />
        <span className="ml-2 text-xl font-bold">PlotExpress</span>
        <div className="flex gap-5 items-center">
          <Input
            value={workspaceName}
            onChange={e =>
              setWorkspace({
                ...workspace,
                name: e.target.value,
              })
            }
            className="text-lg bg-white/20 px-3 py-1 rounded-lg hidden sm:inline-block w-60 border-none"
          />
        </div>
      </div>
      {/* <div className="flex items-stretch gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>Projects</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
    </header>
  );
}
