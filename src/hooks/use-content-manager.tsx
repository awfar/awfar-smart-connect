
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

export interface ContentSection {
  id: string;
  title: string;
  description: string;
  content: Record<string, any>;
}

export function useContentManager(initialSections: ContentSection[]) {
  const { toast: uiToast } = useToast();
  const [sections, setSections] = useState<ContentSection[]>(initialSections);
  const [currentSection, setCurrentSection] = useState<ContentSection>(initialSections[0]);

  const handleSave = () => {
    const updatedSections = sections.map((section) => 
      section.id === currentSection.id ? currentSection : section
    );
    
    setSections(updatedSections);
    
    toast.success(`تم حفظ محتوى ${currentSection.title} بنجاح`);
    
    // Mock API call to save changes to the backend
    console.log('Saving changes to:', currentSection);
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
    
    // Check if the value is a JSON string (for complex objects in arrays)
    try {
      if (value.startsWith('{') && value.endsWith('}')) {
        arrayField[index] = JSON.parse(value);
      } else {
        arrayField[index] = value;
      }
    } catch (e) {
      // If parsing fails, just set the raw value
      arrayField[index] = value;
    }
    
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

  const handleStyleChange = (fieldName: string, value: string | number) => {
    setCurrentSection({
      ...currentSection,
      content: {
        ...currentSection.content,
        [fieldName]: value
      }
    });
  };

  const selectSection = (sectionId: string) => {
    const selectedSection = sections.find(section => section.id === sectionId);
    if (selectedSection) {
      setCurrentSection(selectedSection);
    }
  };

  const addSection = (section: ContentSection) => {
    setSections([...sections, section]);
    setCurrentSection(section);
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    setSections(updatedSections);
    
    if (currentSection.id === sectionId) {
      setCurrentSection(updatedSections[0]);
    }
    
    toast.success("تم حذف القسم بنجاح");
  };

  const duplicateSection = (sectionId: string) => {
    const sectionToDuplicate = sections.find(section => section.id === sectionId);
    
    if (sectionToDuplicate) {
      const newSection = {
        ...sectionToDuplicate,
        id: `${sectionToDuplicate.id}-copy-${Date.now()}`,
        title: `${sectionToDuplicate.title} (نسخة)`,
      };
      
      setSections([...sections, newSection]);
      setCurrentSection(newSection);
      
      toast.success("تم نسخ القسم بنجاح");
    }
  };

  return {
    sections,
    currentSection,
    selectSection,
    handleSave,
    handleChange,
    handleArrayChange,
    handleImageChange,
    handleStyleChange,
    addSection,
    removeSection,
    duplicateSection
  };
}
