
import React from 'react';
import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AgentRoleConfigProps {
  role: {
    id: string;
    name: string;
    description: string;
  };
  selected: boolean;
  onSelect: (id: string) => void;
}

const AgentRoleConfig: React.FC<AgentRoleConfigProps> = ({
  role,
  selected,
  onSelect
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        selected 
          ? 'border-2 border-primary shadow-md' 
          : 'hover:shadow-md'
      }`}
      onClick={() => onSelect(role.id)}
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-2">
          <User className="h-5 w-5" />
          <h3 className="font-medium">{role.name}</h3>
          {selected && (
            <div className="ml-auto h-5 w-5 rounded-full bg-primary flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500">{role.description}</p>
      </CardContent>
    </Card>
  );
};

export default AgentRoleConfig;
