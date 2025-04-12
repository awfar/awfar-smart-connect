
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud, UserPlus } from "lucide-react";

const LeadCardHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>العملاء المحتملين</CardTitle>
        <CardDescription className="mt-1">
          إدارة العملاء المحتملين وتصنيفهم حسب المراحل
        </CardDescription>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <DownloadCloud className="h-4 w-4 ml-1" />
          تصدير
        </Button>
        <Button variant="ghost" size="sm">
          <UserPlus className="h-4 w-4 ml-1" />
          استيراد
        </Button>
      </div>
    </div>
  );
};

export default LeadCardHeader;
