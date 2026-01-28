import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children, user, onLogout }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Sidebar onCollapseChange={setIsCollapsed} user={user} onLogout={onLogout} />
      
      {/* Main Content */}
      <main 
        className={`transition-all duration-300 ${
          isMobile 
            ? "ml-0" 
            : isCollapsed 
              ? "ml-16" 
              : "ml-64"
        }`}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;