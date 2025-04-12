
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white border-b h-14 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex-1 flex md:justify-center lg:justify-start">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="بحث..."
            className="pl-10 pr-10 h-9 md:w-[300px] lg:w-[400px] bg-background"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>مم</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default DashboardHeader;
