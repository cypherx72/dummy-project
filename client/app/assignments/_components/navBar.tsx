"use client";

import { Mail } from "lucide-react";
import { Bell } from "lucide-react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchBar } from "./searchBar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/context/session-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function NavBar() {
  return (
    <section className="flex flex-row justify-between items-center">
      <SearchBar />
      <Boo />
    </section>
  );
}

function Boo() {
  const { user } = useSession();

  const firstName = user?.name.split(" ")[0] as string;
  const secondName = user?.name.split(" ")[1] as string;

  const initials = firstName[0] + secondName[0];
  return (
    <div className="flex flex-row justify-end items-center space-x-4 w-full">
      <Button
        variant="secondary"
        className="relative bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 shadow-lg backdrop-blur-md p-3 border border-white/10 overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
        <span className="flex items-center gap-2">
          <Sparkles className="text-indigo-400" />
          <p className="font-normal text-sm">CampusPilot AI</p>
        </span>
      </Button>

      {/* Mail */}
      <Button className="relative" variant="secondary" size="icon-lg">
        <Mail className="size-6" />
        <Badge className="top-0.5 right-0.5 z-10 absolute bg-green-400 p-1.5 rounded-full size-3 font-semibold">
          2
        </Badge>
      </Button>

      <Button variant="secondary" size="icon-lg" className="relative p-0">
        <Bell className="size-6" />
        <Badge className="top-0.5 right-1 z-10 absolute bg-green-400 p-1.5 rounded-full size-3 font-semibold">
          2
        </Badge>
      </Button>

      <div className="flex flex-row items-center space-x-1">
        <Avatar className="size-10">
          <AvatarImage src={user?.image} />
          <AvatarFallback className="font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="flex flex-col text-xs tracking-wide">
          <p className="font-semibold text-zinc-300 text-nowrap">
            {user?.name}
          </p>
          <p className="font-semibold text-zinc-500">{user?.role}</p>
        </span>
      </div>
    </div>
  );
}
