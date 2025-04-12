
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, ImageIcon, Check } from "lucide-react";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // This is a mock function - in a real app, you would implement actual image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Mock upload delay
    setTimeout(() => {
      // Mock successful upload with a random image from the existing uploads
      const mockImages = [
        "/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png",
        "/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png",
        "/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png",
        "/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png"
      ];
      
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      onImageUploaded(randomImage);
      
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input 
          type="file" 
          id="image-upload" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden"
        />
        <Button
          type="button"
          variant={uploadSuccess ? "outline" : "default"}
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={isUploading}
          className={`w-full ${uploadSuccess ? "border-green-500 text-green-500" : ""}`}
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Uploading...
            </span>
          ) : uploadSuccess ? (
            <span className="flex items-center gap-2">
              <Check size={16} />
              Upload Successful
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Upload size={16} />
              Upload New Image
            </span>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => onImageUploaded("/placeholder.svg")}
        >
          <ImageIcon size={16} className="mr-2" />
          Use Placeholder
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Supported formats: JPEG, PNG, WebP, GIF. Max size: 5MB.
      </p>
    </div>
  );
};
