import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, BarChart3, Settings, DollarSign, Target, Zap, 
  FileText, Wrench, Menu, X, ChevronLeft, ChevronRight, LogOut 
} from "lucide-react";
import { Button } from "./ui/button";

const Sidebar = ({ onCollapseChange, user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
        onCollapseChange?.(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onCollapseChange]);

  // Notify parent of collapse state changes
  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const menuItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/cost-savings", icon: DollarSign, label: "Savings" },
    { path: "/energy-goals", icon: Target, label: "Goals" },
    { path: "/load-scheduling", icon: Zap, label: "Scheduling" },
    { path: "/reports", icon: FileText, label: "Reports" },
    { path: "/maintenance", icon: Wrench, label: "Maintenance" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/50 rounded-full"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={isMobile ? sidebarVariants : {}}
        initial={isMobile ? "closed" : "open"}
        animate={isMobile ? (isOpen ? "open" : "closed") : "open"}
        className={`fixed left-0 top-0 h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50 z-40 transition-all duration-300 ${
          isCollapsed && !isMobile ? "w-16" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              {(!isCollapsed || isMobile) && (
                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-3"
                >
                  <img src="/logo.png" alt="Flux SOS" className="w-8 h-8 rounded-lg" />
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    Flux SOS
                  </h1>
                </motion.div>
              )}
              
              {!isMobile && isCollapsed && (
                <motion.div
                  variants={itemVariants}
                  className="mx-auto"
                >
                  <img src="/logo.png" alt="Flux SOS" className="w-8 h-8 rounded-lg" />
                </motion.div>
              )}
              
              {!isMobile && (
                <Button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center  px-3 py-3 rounded-xl transition-all duration-200 group relative ${isCollapsed && !isMobile ? 'w-10 h-10' : 'space-x-3'} ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg"
                        : "hover:bg-white/60 dark:hover:bg-slate-800/60 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500"}`} />
                    {(!isCollapsed || isMobile) && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {isCollapsed && !isMobile && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User Info & Signout */}
          {(!isCollapsed || isMobile) && user && (
            <motion.div
              variants={itemVariants}
              className="p-4 border-t border-white/20 dark:border-slate-700/50 space-y-3"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium">{user.username || user.houseNumber}</p>
                <p className="text-xs">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200 group"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </motion.div>
          )}

          {/* Collapsed signout button */}
          {isCollapsed && !isMobile && user && (
            <motion.div
              variants={itemVariants}
              className="p-2 border-t border-white/20 dark:border-slate-700/50"
            >
              <button
                onClick={onLogout}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200 group relative mx-auto"
              >
                <LogOut className="h-4 w-4" />
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Sign Out
                </div>
              </button>
            </motion.div>
          )}

          {/* Footer */}
          {(!isCollapsed || isMobile) && (
            <motion.div
              variants={itemVariants}
              className="p-4 border-t border-white/20 dark:border-slate-700/50"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                <p>Flux SOS v2.0</p>
                <p>Energy Management System</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;