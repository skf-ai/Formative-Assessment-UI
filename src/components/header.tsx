import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import type { User } from '../types';

interface HeaderProps {
  sectionName?: string;
  user?: User | null;
  onNavigateToLanding?: () => void;
}

export function Header({ 
  sectionName = "Assessment Center", 
  user,
  onNavigateToLanding
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Logo and Section */}
        <div className="flex items-center space-x-4 cursor-pointer" onClick={onNavigateToLanding}>
          {/* SKF Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Avatar className="h-16 w-16 sm:h-9 sm:w-9 sm:h-10 sm:w-10">
              <AvatarImage src="/src/logo/siksha-logo.png" alt="Siksha Logo" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground">
                {sectionName}
              </h1>
            </div>
          </div>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-2 sm:px-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name || 'Guest'} />
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'G'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.name || 'Guest'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email || ''}</span>
                </div>
                <ChevronDown className="h-4 w-4 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}