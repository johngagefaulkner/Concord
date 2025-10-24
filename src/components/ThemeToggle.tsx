import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5 text-muted-foreground" />
      <Switch
        checked={theme === 'dark-concord'}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}