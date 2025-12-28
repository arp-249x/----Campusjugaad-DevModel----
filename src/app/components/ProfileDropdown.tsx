import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, Settings, LogOut, HelpCircle } from "lucide-react";

interface ProfileDropdownProps {
  user?: any;
  onLogout?: () => void;
}

export function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : "CJ";
  const displayName = user?.name || "Student";
  const email = user?.email || "student@campus.edu";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-10 w-10 border-2 border-[var(--campus-border)] hover:border-[#2D7FF9] transition-colors cursor-pointer ring-offset-2 ring-offset-[var(--campus-bg)]">
          <AvatarImage src="/placeholder-avatar.jpg" />
          <AvatarFallback className="bg-gradient-to-br from-[#2D7FF9] to-[#9D4EDD] text-white font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[var(--campus-card-bg)] border-[var(--campus-border)]" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-[var(--campus-text-primary)]">{displayName}</p>
            <p className="text-xs leading-none text-[var(--campus-text-secondary)]">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[var(--campus-border)]" />
        <DropdownMenuItem className="text-[var(--campus-text-primary)] focus:bg-[var(--campus-surface)] cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[var(--campus-text-primary)] focus:bg-[var(--campus-surface)] cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-[var(--campus-text-primary)] focus:bg-[var(--campus-surface)] cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help Center</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[var(--campus-border)]" />
        <DropdownMenuItem 
          onClick={onLogout}
          className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}