
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

// Create the HeaderNameFix component to access the correct user profile name
export const HeaderNameFix = () => {
  const { profile } = useAuth();
  return profile?.name || "User";
};

// Export the Header component as default to fix import issues
const Header = () => {
  const { profile, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Optional: Redirect to login page or home page after logout
    // window.location.href = '/login';
  };

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="text-lg font-semibold">
          DiamondFlow
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.name || "User"}
                    </p>
                    {profile?.email && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account">
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Export both as named exports
export { Header };
export default Header;
