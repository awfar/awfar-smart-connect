
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Check, Download, File, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  currentUrl: string;
  onFileUploaded: (url: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ currentUrl, onFileUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Get file name from URL
  const getFileName = (url: string) => {
    if (!url) return "";
    return url.split("/").pop() || "file";
  };

  // Mock file extension to determine icon
  const getFileExtension = (fileName: string) => {
    return fileName.split(".").pop()?.toLowerCase() || "";
  };

  // This is a mock function - in a real app, you would implement actual file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Mock upload delay
    setTimeout(() => {
      // Mock successful upload with a file name
      const mockFileUrl = `/files/${file.name.replace(/\s+/g, "-")}`;
      onFileUploaded(mockFileUrl);
      
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }, 1500);
  };

  const renderFileIcon = (fileName: string) => {
    const extension = getFileExtension(fileName);
    
    switch(extension) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-8 w-8 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-8 w-8 text-green-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-8 w-8 text-orange-500" />;
      case "zip":
      case "rar":
        return <FileText className="h-8 w-8 text-purple-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {currentUrl && (
        <div className="border rounded-md p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {renderFileIcon(getFileName(currentUrl))}
              <div>
                <p className="font-medium">{getFileName(currentUrl)}</p>
                <p className="text-xs text-muted-foreground">المرفق الحالي</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" /> تحميل
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-500"
                onClick={() => onFileUploaded("")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="file-upload">رفع ملف</Label>
        <div className="flex items-center gap-2">
          <Input 
            type="file" 
            id="file-upload" 
            onChange={handleFileChange} 
            className="hidden"
          />
          <Button
            type="button"
            variant={uploadSuccess ? "outline" : "default"}
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
            className={`w-full ${uploadSuccess ? "border-green-500 text-green-500" : ""}`}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                جاري رفع الملف...
              </span>
            ) : uploadSuccess ? (
              <span className="flex items-center gap-2">
                <Check size={16} />
                تم رفع الملف بنجاح
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload size={16} />
                رفع ملف جديد
              </span>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          الصيغ المدعومة: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, RAR. الحد الأقصى للحجم: 10 ميجابايت.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
