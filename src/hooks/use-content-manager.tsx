
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface ContentSection {
  id: string;
  title: string;
  description: string;
  content: Record<string, any>;
}

export function useContentManager(initialSections: ContentSection[]) {
  const { toast } = useToast();
  const [sections, setSections] = useState<ContentSection[]>(initialSections);
  const [currentSection, setCurrentSection] = useState<ContentSection>(initialSections[0]);

  const handleSave = () => {
    const updatedSections = sections.map((section) => 
      section.id === currentSection.id ? currentSection : section
    );
    
    setSections(updatedSections);
    
    toast({
      title: "Content saved",
      description: `${currentSection.title} has been updated successfully.`,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setCurrentSection({
      ...currentSection,
      content: {
        ...currentSection.content,
        [name]: value
      }
    });
  };

  const handleArrayChange = (fieldName: string, index: number, value: string) => {
    const arrayField = [...currentSection.content[fieldName]];
    arrayField[index] = value;
    
    setCurrentSection({
      ...currentSection,
      content: {
        ...currentSection.content,
        [fieldName]: arrayField
      }
    });
  };

  const handleImageChange = (fieldName: string, url: string) => {
    setCurrentSection({
      ...currentSection,
      content: {
        ...currentSection.content,
        [fieldName]: url
      }
    });
  };

  const selectSection = (sectionId: string) => {
    const selectedSection = sections.find(section => section.id === sectionId);
    if (selectedSection) {
      setCurrentSection(selectedSection);
    }
  };

  return {
    sections,
    currentSection,
    selectSection,
    handleSave,
    handleChange,
    handleArrayChange,
    handleImageChange
  };
}
