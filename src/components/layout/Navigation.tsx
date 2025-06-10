import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  MessageCircle,
  Calendar,
  BarChart3,
  Bot,
  Database,
  Globe,
  Truck,
  Settings,
  Navigation as NavigationIcon,
  Menu,
  X,
  User,
  LogOut,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { path: "/", label: t("nav.admin_home"), icon: Home },
    { path: "/client", label: t("nav.website"), icon: Globe },
    {
      path: "/equipment",
      label: t("nav.equipment"),
      icon: Truck,
      permission: "equipment.edit",
    },
    {
      path: "/chat",
      label: t("nav.chat"),
      icon: MessageCircle,
      permission: "chat.access",
    },
    {
      path: "/gps",
      label: t("nav.gps_tracking"),
      icon: NavigationIcon,
      permission: "gps.view",
    },
    {
      path: "/dashboard",
      label: t("nav.dashboard"),
      icon: BarChart3,
      permission: "reports.view",
    },
    {
      path: "/reports",
      label: t("nav.reports"),
      icon: FileText,
      permission: "reports.view",
    },
    {
      path: "/database",
      label: t("nav.database"),
      icon: Database,
      permission: "reports.view",
    },
    { path: "/ai", label: t("nav.ai_assistant"), icon: Bot },
    {
      path: "/settings",
      label: t("nav.settings"),
      icon: Settings,
      permission: "settings.edit",
    },
  ].filter((item) => !item.permission || hasPermission(item.permission));

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-orange-500 p-2 rounded-lg">
                <div className="w-6 h-6 bg-white rounded transform rotate-45"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">EquipEase</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center space-x-2",
                      isActive && "bg-orange-500 hover:bg-orange-600",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}

            {/* User Profile */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4 text-orange-600" />
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4 text-orange-600" />
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start space-x-2",
                        isActive && "bg-orange-500 hover:bg-orange-600",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-2"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("nav.sign_out")}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
