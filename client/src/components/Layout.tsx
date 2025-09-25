import { ReactNode } from "react";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  
  // Check if menu parameter is set to false in URL
  const urlParams = new URLSearchParams(window.location.search);
  const menuParam = urlParams.get('menu');
  
  // Hide menu if:
  // 1. URL parameter menu=false is explicitly set, OR
  // 2. It's a mobile device AND menu=true is NOT explicitly set
  const hideMenu = menuParam === 'false' || (isMobile && menuParam !== 'true');

  if (hideMenu) {
    return (
      <div className="flex h-screen bg-background">
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto bg-background p-6">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto bg-background">
          {children}
        </div>
      </main>
    </div>
  );
}
