import { useState, useEffect } from "react";
import { User, Settings, LogOut, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pb } from "@/lib/pocketbase";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const [user, setUser] = useState<any>(null);

  // Load logged-in user from PocketBase
  useEffect(() => {
    if (pb.authStore.model) {
      setUser(pb.authStore.model);
    }
  }, []);

  const handleLogout = () => {
    pb.authStore.clear();
    window.location.reload(); // optional: refresh page
  };
  const navigate = useNavigate();
  if (!user) return null; // or return a login button

  return (
    <div className="flex items-center space-x-3">
      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          1
        </Badge>
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-auto px-3 space-x-2 hover:bg-secondary"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={pb.files.getURL(user, user.avatar) || "/avatar.png"}
                alt={user.name}
              />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {user.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="hidden md:flex md:flex-col md:items-start md:text-sm">
              <span className="font-medium text-foreground">{user.name}</span>
              <Badge variant="secondary" className="text-xs">
                {user.role || "User"}
              </Badge>
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
