
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "./ImageUpload";
import { ContentSection } from "@/hooks/use-content-manager";

interface ContentEditorProps {
  section: ContentSection;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onArrayChange: (fieldName: string, index: number, value: string) => void;
  onImageChange: (fieldName: string, url: string) => void;
}

const ContentEditor = ({
  section,
  onSave,
  onChange,
  onArrayChange,
  onImageChange
}: ContentEditorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {Object.entries(section.content).map(([key, value]) => {
            // Skip rendering arrays and images here
            if (Array.isArray(value) || (typeof value === 'string' && (value.startsWith('/') || value.startsWith('http')))) {
              return null;
            }
            
            return (
              <div key={key}>
                <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</Label>
                {typeof value === 'string' && value.length > 50 ? (
                  <Textarea
                    id={key}
                    name={key}
                    value={value}
                    onChange={onChange}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={key}
                    name={key}
                    value={value}
                    onChange={onChange}
                  />
                )}
              </div>
            );
          })}
          
          {/* Render arrays */}
          {Object.entries(section.content).map(([key, value]) => {
            if (!Array.isArray(value)) return null;
            
            return (
              <div key={key} className="space-y-3">
                <Label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</Label>
                {value.map((item: any, index: number) => (
                  <Input
                    key={`${key}-${index}`}
                    value={item}
                    onChange={(e) => onArrayChange(key, index, e.target.value)}
                  />
                ))}
              </div>
            );
          })}
          
          {/* Render images */}
          {Object.entries(section.content).map(([key, value]) => {
            if (typeof value !== 'string' || (!value.startsWith('/') && !value.startsWith('http'))) return null;
            
            return (
              <div key={key}>
                <Label className="block mb-2">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</Label>
                <div className="mb-4">
                  <img 
                    src={value} 
                    alt={key} 
                    className="w-40 h-auto rounded-md border object-cover"
                  />
                </div>
                <ImageUpload onImageUploaded={(url) => onImageChange(key, url)} />
              </div>
            );
          })}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={onSave} className="w-full">Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default ContentEditor;
