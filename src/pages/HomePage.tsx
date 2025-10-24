import { ConcordLayout } from "@/components/concord/ConcordLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/hooks/use-theme";
import { useEffect } from "react";
export function HomePage() {
  // The useTheme hook manages the theme class on a higher-level element.
  // We just need to ensure it's called so its useEffect runs.
  useTheme();
  // Apply font-sans to the body for global scope, covering modals and portals.
  useEffect(() => {
    document.body.classList.add("font-sans");
    // Cleanup function to remove the class when the component unmounts.
    return () => {
      document.body.classList.remove("font-sans");
    };
  }, []); // Empty dependency array ensures this runs only once on mount.
  return (
    <TooltipProvider>
      {/* The theme class is applied by the useTheme hook, not directly here.
          The 'font-sans' class is now applied globally via the useEffect hook. */}
      <div className="h-screen w-screen">
        <ConcordLayout />
        <Toaster />
      </div>
    </TooltipProvider>
  );
}