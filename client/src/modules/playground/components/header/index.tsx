import { BarChart3, Files, Moon, Settings, Sun, ChartPie } from "lucide-react";

// hooks
import { useStore } from "../../contexts/store.context";
import { useTheme } from "@/common/providers/theme";
import { useConfirm } from "@/common/providers/confirmation";
import { useLocalStorageState } from "@/common/hooks/use-localstorage-state";

// components
import { Input } from "@/common/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Button } from "@/common/components/ui/button";

// constants
import { LOCAL_STORAGE_KEYS } from "../../constants";
import { useDependencyInjector } from "../../contexts/dependency-injector.context";

export default function PlaygroundHeader() {
  const { confirm } = useConfirm()

  const workspace = useStore(store => store.workspace!);
  const setWorkspace = useStore(store => store.setWorkspace);

  const { dataManager } = useDependencyInjector()

  const [workspaceName, setWorkspaceName] = useLocalStorageState(LOCAL_STORAGE_KEYS.WORKSPACE_NAME, workspace.name);

  const { setTheme } = useTheme();

  const handleRemoveAllCharts = () => {
    confirm({
      title: "Remove all charts",
      description: "Are you sure you want to remove all charts? This action cannot be undone.",
      onConfirm: async () => {
        await dataManager.deleteAllCharts()
      },
      onCancel: () => { },
      confirmButtonVariant: "destructive",
      confirmButtonText: "Remove"
    })
  }

  const handleRemoveAllDataFiles = () => {
    confirm({
      title: "Delete all data file?",
      description: "Are you sure you want to delete all data files? This action cannot be undone.",
      onConfirm: async () => {
        await dataManager.deleteAllFiles()
      },
      onCancel: () => { },
      confirmButtonVariant: "destructive",
      confirmButtonText: "Delete"
    })
  }

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
            onChange={e => {
              setWorkspaceName(e.target.value);
              setWorkspace({
                ...workspace,
                name: e.target.value,
              });
            }}
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
              <Settings className="h-5 w-5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleRemoveAllCharts} className="cursor-pointer">
              <div className="flex items-center justify-center border border-red-700 p-0.5 rounded-full relative">
                <div className="absolute h-full w-0.25 bg-red-700 left-1/2 -translate-x-1/2 rotate-45"></div>
                <ChartPie className="h-5 w-5" />
              </div>
              <span>Clear All Charts</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRemoveAllDataFiles} className="cursor-pointer">
              <div className="flex items-center justify-center border border-red-700 p-0.5 rounded-full relative">
                <div className="absolute h-full w-0.25 bg-red-700 left-1/2 -translate-x-1/2 rotate-45"></div>
                <Files className="h-5 w-5" />
              </div>
              <span>Remove All Data Files</span>
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div >
    </header >
  );
}
