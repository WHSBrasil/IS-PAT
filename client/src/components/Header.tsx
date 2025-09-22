import { useLocation } from "wouter";

const sectionNames: Record<string, string> = {
  "/": "Dashboard",
  "/classificacoes": "Classificações",
  "/tombamento": "Tombamento",
  "/alocacao": "Alocação",
  "/transferencia": "Transferências",
  "/manutencao": "Manutenção",
};

export default function Header() {
  const [location] = useLocation();
  const currentSection = sectionNames[location] || "Dashboard";

  return (
    <header className="bg-card border-b border-border px-6 py-4" data-testid="header">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="ml-2 text-sm font-medium text-foreground" data-testid="current-section">
                    {currentSection}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Pesquisar patrimônio..." 
              className="w-64 pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent text-sm"
              data-testid="search-input"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          {/* Notifications */}
          <button className="relative p-2 text-muted-foreground hover:text-foreground" data-testid="notifications-button">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-6.5-6.5L8 16"/>
            </svg>
            <span className="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
