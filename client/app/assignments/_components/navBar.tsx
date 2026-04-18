"use client";

import { Mail, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./searchBar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/context/session-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function NavBar() {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <SearchBar />
      <NavActions />
    </header>
  );
}

function NavActions() {
  const { user } = useSession();

  const firstName = user?.name?.split(" ")[0] ?? "";
  const secondName = user?.name?.split(" ")[1] ?? "";
  const initials = `${firstName[0] ?? ""}${secondName[0] ?? ""}`;

  return (
    <div className="flex flex-row items-center gap-2 sm:gap-3">
      {/* AI Assistant Button */}
      <Button
        variant="secondary"
        size="sm"
        className="relative bg-muted/50 hover:bg-muted border border-border/50 gap-2"
      >
        <Sparkles className="w-4 h-4 text-blue-500" />
        <span className="hidden sm:inline text-sm">CampusPilot AI</span>
      </Button>

      {/* Mail */}
      <Button variant="secondary" size="icon" className="relative">
        <Mail className="w-5 h-5" />
        <Badge className="top-0 right-0 absolute flex items-center justify-center bg-emerald-500 text-white text-[10px] w-4 h-4 p-0 rounded-full">
          2
        </Badge>
      </Button>

      {/* Notifications */}
      <Button variant="secondary" size="icon" className="relative">
        <Bell className="w-5 h-5" />
        <Badge className="top-0 right-0 absolute flex items-center justify-center bg-emerald-500 text-white text-[10px] w-4 h-4 p-0 rounded-full">
          2
        </Badge>
      </Button>

      {/* User Profile */}
      <div className="flex items-center gap-2 ml-1">
        <Avatar className="w-9 h-9">
          <AvatarImage src={user?.image} alt={user?.name ?? "User"} />
          <AvatarFallback className="font-medium text-sm bg-muted">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:flex flex-col">
          <span className="font-medium text-sm text-foreground leading-tight truncate max-w-32">
            {user?.name}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
            {user?.role}
          </span>
        </div>
      </div>
    </div>
  );
}
