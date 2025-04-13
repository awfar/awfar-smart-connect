
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "./ImageUpload";
import { ContentSection } from "@/hooks/use-content-manager";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import ColorPicker from "./ColorPicker";
import { Palette, Type, Image, Layers, Sliders } from "lucide-react";
import FileUpload from "./FileUpload";
import VideoUpload from "./VideoUpload";

interface ContentEditorProps {
  section: ContentSection;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onArrayChange: (fieldName: string, index: number, value: string) => void;
  onImageChange: (fieldName: string, url: string) => void;
  onStyleChange: (fieldName: string, value: string | number) => void;
}

const ContentEditor = ({
  section,
  onSave,
  onChange,
  onArrayChange,
  onImageChange,
  onStyleChange
}: ContentEditorProps) => {
  const [activeTab, setActiveTab] = useState("content");
  
  const fontOptions = [
    { value: "default", label: "الخط الافتراضي" },
    { value: "modern", label: "عصري" },
    { value: "classic", label: "كلاسيكي" },
    { value: "elegant", label: "أنيق" }
  ];
  
  const layoutOptions = [
    { value: "imageLeft", label: "صورة على اليسار" },
    { value: "imageRight", label: "صورة على اليمين" },
    { value: "imageTop", label: "صورة في الأعلى" },
    { value: "imageBottom", label: "صورة في الأسفل" },
    { value: "imageBackground", label: "صورة في الخلفية" }
  ];
  
  const styleOptions = [
    { value: "default", label: "افتراضي" },
    { value: "gradient", label: "تدرج" },
    { value: "boxed", label: "داخل إطار" },
    { value: "border", label: "مع حدود" },
    { value: "shadow", label: "مع ظل" }
  ];
  
  const buttonStyleOptions = [
    { value: "default", label: "افتراضي" },
    { value: "rounded", label: "مستدير" },
    { value: "outlined", label: "مخطط" },
    { value: "text", label: "نص فقط" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-4 gap-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type size={16} />
              <span>المحتوى</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image size={16} />
              <span>الوسائط</span>
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Palette size={16} />
              <span>التصميم</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layers size={16} />
              <span>التخطيط</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            {/* Text Content Fields */}
            {Object.entries(section.content).map(([key, value]) => {
              // Skip rendering non-text content
              if (
                Array.isArray(value) || 
                (typeof value === 'string' && (value.startsWith('/') || value.startsWith('http'))) ||
                (key.includes('Color') || key.includes('Style') || key.includes('layout') || key.includes('font') || key.includes('spacing') || key.includes('Background'))
              ) {
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
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      id={key}
                      name={key}
                      value={value}
                      onChange={onChange}
                      className="mt-1"
                    />
                  )}
                </div>
              );
            })}
            
            {/* Array Fields (like features, statistics, etc.) */}
            {Object.entries(section.content).map(([key, value]) => {
              if (!Array.isArray(value)) return null;
              
              return (
                <div key={key} className="space-y-3">
                  <Label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</Label>
                  {value.map((item: any, index: number) => {
                    if (typeof item === 'object') {
                      return (
                        <div key={`${key}-${index}`} className="grid grid-cols-2 gap-2">
                          {Object.entries(item).map(([subKey, subValue]) => (
                            <div key={`${key}-${index}-${subKey}`}>
                              <Label htmlFor={`${key}-${index}-${subKey}`}>{subKey}</Label>
                              <Input
                                id={`${key}-${index}-${subKey}`}
                                value={String(subValue)}
                                onChange={(e) => {
                                  const newItems = [...value];
                                  newItems[index] = { ...newItems[index], [subKey]: e.target.value };
                                  onArrayChange(key, index, JSON.stringify(newItems[index]));
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <Input
                        key={`${key}-${index}`}
                        value={item}
                        onChange={(e) => onArrayChange(key, index, e.target.value)}
                        className="mt-1"
                      />
                    );
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = [...value];
                      if (typeof value[0] === 'object') {
                        // Clone the structure of the first item but with empty values
                        const template = Object.keys(value[0]).reduce((acc, key) => {
                          acc[key] = '';
                          return acc;
                        }, {} as any);
                        newItems.push(template);
                      } else {
                        newItems.push('');
                      }
                      onArrayChange(key, newItems.length - 1, '');
                    }}
                  >
                    إضافة عنصر
                  </Button>
                </div>
              );
            })}
          </TabsContent>
          
          <TabsContent value="media" className="space-y-4">
            {/* Images */}
            {Object.entries(section.content).map(([key, value]) => {
              if (typeof value !== 'string' || (!key.includes('image') && !key.includes('img') && !value.startsWith('/') && !value.startsWith('http'))) {
                return null;
              }
              
              return (
                <div key={key} className="space-y-2">
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
            
            {/* Add Video Upload Option */}
            <div className="space-y-2">
              <Label className="block">فيديو</Label>
              <VideoUpload 
                currentUrl={section.content.video || ''} 
                onVideoUploaded={(url) => onImageChange('video', url)} 
              />
            </div>
            
            {/* Add File Upload Option */}
            <div className="space-y-2">
              <Label className="block">ملفات</Label>
              <FileUpload 
                currentUrl={section.content.file || ''} 
                onFileUploaded={(url) => onImageChange('file', url)} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="space-y-4">
            {/* Color Options */}
            <div className="space-y-2">
              <Label>لون الخلفية</Label>
              <ColorPicker 
                color={section.content.backgroundColor || '#ffffff'} 
                onChange={(color) => onStyleChange('backgroundColor', color)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>لون النص</Label>
              <ColorPicker 
                color={section.content.textColor || '#333333'} 
                onChange={(color) => onStyleChange('textColor', color)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>لون الأزرار الرئيسية</Label>
              <ColorPicker 
                color={section.content.primaryButtonColor || '#3b82f6'} 
                onChange={(color) => onStyleChange('primaryButtonColor', color)} 
              />
            </div>
            
            {/* Font Options */}
            <div className="space-y-2">
              <Label>نوع الخط</Label>
              <Select 
                value={section.content.fontFamily || 'default'} 
                onValueChange={(value) => onStyleChange('fontFamily', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الخط" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Style Options */}
            <div className="space-y-2">
              <Label>نمط القسم</Label>
              <Select 
                value={section.content.style || 'default'} 
                onValueChange={(value) => onStyleChange('style', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نمط القسم" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Button Style Options */}
            <div className="space-y-2">
              <Label>نمط الأزرار</Label>
              <Select 
                value={section.content.buttonStyle || 'default'} 
                onValueChange={(value) => onStyleChange('buttonStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نمط الأزرار" />
                </SelectTrigger>
                <SelectContent>
                  {buttonStyleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Spacing Options */}
            <div className="space-y-2">
              <Label>المساحات (الداخلية)</Label>
              <div className="pt-2 pb-4">
                <Slider 
                  defaultValue={[section.content.padding || 4]} 
                  max={10} 
                  step={1}
                  onValueChange={(value) => onStyleChange('padding', value[0])}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>المساحات (الخارجية)</Label>
              <div className="pt-2 pb-4">
                <Slider 
                  defaultValue={[section.content.margin || 4]} 
                  max={10} 
                  step={1}
                  onValueChange={(value) => onStyleChange('margin', value[0])}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-4">
            {/* Layout Options */}
            <div className="space-y-2">
              <Label>تخطيط القسم</Label>
              <Select 
                value={section.content.layout || 'imageRight'} 
                onValueChange={(value) => onStyleChange('layout', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر تخطيط القسم" />
                </SelectTrigger>
                <SelectContent>
                  {layoutOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Width Options */}
            <div className="space-y-2">
              <Label>عرض القسم</Label>
              <Select 
                value={section.content.width || 'default'} 
                onValueChange={(value) => onStyleChange('width', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر عرض القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="narrow">ضيق</SelectItem>
                  <SelectItem value="default">افتراضي</SelectItem>
                  <SelectItem value="wide">واسع</SelectItem>
                  <SelectItem value="full">كامل العرض</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Container Options */}
            <div className="space-y-2">
              <Label>نوع الحاوية</Label>
              <Select 
                value={section.content.container || 'default'} 
                onValueChange={(value) => onStyleChange('container', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الحاوية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">افتراضي</SelectItem>
                  <SelectItem value="card">بطاقة</SelectItem>
                  <SelectItem value="glassmorphism">زجاجي</SelectItem>
                  <SelectItem value="floating">عائم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Animation Options */}
            <div className="space-y-2">
              <Label>تأثيرات الحركة</Label>
              <Select 
                value={section.content.animation || 'none'} 
                onValueChange={(value) => onStyleChange('animation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر تأثير الحركة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">بدون</SelectItem>
                  <SelectItem value="fadeIn">ظهور تدريجي</SelectItem>
                  <SelectItem value="slideIn">دخول من الجانب</SelectItem>
                  <SelectItem value="zoomIn">تكبير</SelectItem>
                  <SelectItem value="bounce">ارتداد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab("content")}>إلغاء</Button>
        <Button onClick={onSave}>حفظ التغييرات</Button>
      </CardFooter>
    </Card>
  );
};

export default ContentEditor;
