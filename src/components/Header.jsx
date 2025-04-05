import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Settings } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "PowerHive";
      case "/analytics":
        return "Energy Analytics";
      case "/settings":
        return "Settings";
      default:
        return "PowerHive";
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <h1 className="text-xl font-medium tracking-tight">
            {getTitle()}
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Button 
            variant={location.pathname === "/" ? "default" : "ghost"} 
            size="sm" 
            asChild
            className="rounded-full px-4"
          >
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
          <Button 
            variant={location.pathname === "/analytics" ? "default" : "ghost"} 
            size="sm" 
            asChild
            className="rounded-full px-4"
          >
            <Link to="/analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
          </Button>
          <Button 
            variant={location.pathname === "/settings" ? "default" : "ghost"} 
            size="sm" 
            asChild
            className="rounded-full px-4"
          >
            <Link to="/settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </Button>
        </nav>
        
        <div className="md:hidden flex items-center">
          <Button 
            variant={location.pathname === "/" ? "default" : "ghost"} 
            size="icon" 
            asChild
            className="rounded-full"
          >
            <Link to="/">
              <Home className="h-4 w-4" />
            </Link>
          </Button>
          <Button 
            variant={location.pathname === "/analytics" ? "default" : "ghost"} 
            size="icon" 
            asChild
            className="rounded-full"
          >
            <Link to="/analytics">
              <BarChart3 className="h-4 w-4" />
            </Link>
          </Button>
          <Button 
            variant={location.pathname === "/settings" ? "default" : "ghost"} 
            size="icon" 
            asChild
            className="rounded-full"
          >
            <Link to="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
