
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Image as ImageIcon, 
  File, 
  Video, 
  Upload, 
  Search, 
  Grid, 
  LayoutList, 
  MoreVertical,
  Trash2,
  Download,
  Edit,
  Copy,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: string;
  dimensions?: string;
  uploadedAt: string;
  thumbnailUrl?: string;
}

const mediaItems: MediaItem[] = [
  {
    id: "media-1",
    name: "hero-banner.png",
    type: "image",
    url: "/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png",
    size: "256 KB",
    dimensions: "1200x800",
    uploadedAt: "2023-10-15"
  },
  {
    id: "media-2",
    name: "product-showcase.png",
    type: "image",
    url: "/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png",
    size: "320 KB",
    dimensions: "1500x1000",
    uploadedAt: "2023-09-22"
  },
  {
    id: "media-3",
    name: "case-study.png",
    type: "image",
    url: "/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png",
    size: "180 KB",
    dimensions: "1000x750",
    uploadedAt: "2023-08-30"
  },
  {
    id: "media-4",
    name: "testimonial.png",
    type: "image",
    url: "/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png",
    size: "210 KB",
    dimensions: "800x800",
    uploadedAt: "2023-11-05"
  },
  {
    id: "media-5",
    name: "product-demo.mp4",
    type: "video",
    url: "/videos/demo.mp4",
    size: "4.2 MB",
    thumbnailUrl: "/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png",
    uploadedAt: "2023-10-10"
  },
  {
    id: "media-6",
    name: "company-brochure.pdf",
    type: "document",
    url: "/docs/brochure.pdf",
    size: "1.5 MB",
    uploadedAt: "2023-09-15"
  }
];

const MediaLibrary = () => {
  const [media, setMedia] = useState<MediaItem[]>(mediaItems);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Mock upload process
      toast.success(`تم رفع ${files.length} ملفات بنجاح`);
      
      // In a real app, you would handle the actual file upload here
      // and then update the media state with the new files
    }
  };
  
  const handleDeleteMedia = (id: string) => {
    setMedia(media.filter(item => item.id !== id));
    toast.success("تم حذف الملف بنجاح");
  };
  
  const openPreview = (item: MediaItem) => {
    setSelectedMedia(item);
    setIsPreviewOpen(true);
  };
  
  const filteredMedia = activeTab === "all" 
    ? media.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : media.filter(item => 
        item.type === activeTab && 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
  const renderMediaItem = (item: MediaItem) => {
    if (viewMode === "grid") {
      return (
        <Card key={item.id} className="overflow-hidden group">
          <div className="relative">
            {item.type === "image" ? (
              <img 
                src={item.url} 
                alt={item.name}
                className="w-full aspect-square object-cover"
              />
            ) : item.type === "video" ? (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                {item.thumbnailUrl ? (
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Video className="h-12 w-12 text-gray-400" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                <File className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-8 w-8"
                onClick={() => openPreview(item)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="secondary" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.url)}>
                    <Copy className="mr-2 h-4 w-4" /> نسخ الرابط
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" /> تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" /> تنزيل
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteMedia(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardContent className="p-2">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.size}</p>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <tr key={item.id} className="group">
          <td className="py-2 pl-4">
            <div className="flex items-center gap-3">
              {item.type === "image" ? (
                <div className="h-10 w-10 rounded-md overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : item.type === "video" ? (
                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <Video className="h-5 w-5 text-gray-500" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <File className="h-5 w-5 text-gray-500" />
                </div>
              )}
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          </td>
          <td className="py-2">{item.type}</td>
          <td className="py-2">{item.size}</td>
          <td className="py-2">{item.dimensions || "-"}</td>
          <td className="py-2">{item.uploadedAt}</td>
          <td className="py-2 pr-4">
            <div className="flex items-center justify-end gap-1">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8"
                onClick={() => openPreview(item)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.url)}>
                    <Copy className="mr-2 h-4 w-4" /> نسخ الرابط
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" /> تعديل
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" /> تنزيل
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteMedia(item.id)}
                    className="text-red-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-medium">مكتبة الوسائط</h2>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن ملفات..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
          
          <div>
            <Input 
              type="file" 
              id="media-upload" 
              className="hidden" 
              multiple 
              onChange={handleFileUpload}
            />
            <Button onClick={() => document.getElementById("media-upload")?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              رفع ملفات
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <File className="h-4 w-4" /> الكل
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" /> صور
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-1">
            <Video className="h-4 w-4" /> فيديو
          </TabsTrigger>
          <TabsTrigger value="document" className="flex items-center gap-1">
            <File className="h-4 w-4" /> مستندات
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredMedia.map(renderMediaItem)}
            </div>
          ) : (
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-start py-2 pl-4 font-medium">الاسم</th>
                    <th className="text-start py-2 font-medium">النوع</th>
                    <th className="text-start py-2 font-medium">الحجم</th>
                    <th className="text-start py-2 font-medium">الأبعاد</th>
                    <th className="text-start py-2 font-medium">تاريخ الرفع</th>
                    <th className="text-start py-2 pr-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedia.map(renderMediaItem)}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="image" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredMedia.map(renderMediaItem)}
            </div>
          ) : (
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-start py-2 pl-4 font-medium">الاسم</th>
                    <th className="text-start py-2 font-medium">النوع</th>
                    <th className="text-start py-2 font-medium">الحجم</th>
                    <th className="text-start py-2 font-medium">الأبعاد</th>
                    <th className="text-start py-2 font-medium">تاريخ الرفع</th>
                    <th className="text-start py-2 pr-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedia.map(renderMediaItem)}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="video" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredMedia.map(renderMediaItem)}
            </div>
          ) : (
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-start py-2 pl-4 font-medium">الاسم</th>
                    <th className="text-start py-2 font-medium">النوع</th>
                    <th className="text-start py-2 font-medium">الحجم</th>
                    <th className="text-start py-2 font-medium">الأبعاد</th>
                    <th className="text-start py-2 font-medium">تاريخ الرفع</th>
                    <th className="text-start py-2 pr-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedia.map(renderMediaItem)}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="document" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredMedia.map(renderMediaItem)}
            </div>
          ) : (
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-start py-2 pl-4 font-medium">الاسم</th>
                    <th className="text-start py-2 font-medium">النوع</th>
                    <th className="text-start py-2 font-medium">الحجم</th>
                    <th className="text-start py-2 font-medium">الأبعاد</th>
                    <th className="text-start py-2 font-medium">تاريخ الرفع</th>
                    <th className="text-start py-2 pr-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedia.map(renderMediaItem)}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Media Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.name}</DialogTitle>
            <DialogDescription>
              {selectedMedia?.type === 'image' && selectedMedia?.dimensions && `${selectedMedia.dimensions} • `}
              {selectedMedia?.size}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center items-center py-4">
            {selectedMedia?.type === "image" ? (
              <img 
                src={selectedMedia.url} 
                alt={selectedMedia.name}
                className="max-h-[500px] object-contain"
              />
            ) : selectedMedia?.type === "video" ? (
              <video 
                src={selectedMedia.url} 
                controls 
                className="max-h-[500px] w-full"
              />
            ) : (
              <div className="h-60 w-full flex flex-col items-center justify-center bg-gray-100 rounded-md">
                <File className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-800 font-medium">{selectedMedia?.name}</p>
                <p className="text-gray-500 text-sm">{selectedMedia?.size}</p>
                <Button className="mt-4">
                  <Download className="mr-2 h-4 w-4" />
                  تنزيل الملف
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm space-y-1">
              <p><span className="font-medium">تاريخ الرفع:</span> {selectedMedia?.uploadedAt}</p>
              <p><span className="font-medium">الحجم:</span> {selectedMedia?.size}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(selectedMedia?.url || '')}>
                نسخ الرابط
              </Button>
              <Button>تنزيل</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaLibrary;
