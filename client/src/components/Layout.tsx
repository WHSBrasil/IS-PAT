import { ReactNode } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  
  // Check if menu parameter is set to false in URL
  const urlParams = new URLSearchParams(window.location.search);
  const hideMenu = urlParams.get('menu') === 'false';

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
