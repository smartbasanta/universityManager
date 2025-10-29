"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";

export function AvatarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full p-0 hover:bg-secondary/10"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/user-avatar.jpg" alt="User profile" />
            <AvatarFallback className="bg-primary text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="p-2">
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/user-avatar.jpg" alt="User profile" />
              <AvatarFallback className="bg-primary text-white">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </div>
        </div>
        <Link href={"/dashboard"}>
          <DropdownMenuItem className="cursor-pointer">
            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </Link>
        <Link href={"/settings"}>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
