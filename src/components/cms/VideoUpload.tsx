
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Video, Check } from "lucide-react";
import { toast } from "sonner";

interface VideoUploadProps {
  currentUrl: string;
  onVideoUploaded: (url: string) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ currentUrl, onVideoUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [embedUrl, setEmbedUrl] = useState("");

  // This is a mock function - in a real app, you would implement actual video upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Mock upload delay
    setTimeout(() => {
      // Mock successful upload
      const mockVideoUrl = "/videos/sample.mp4";
      onVideoUploaded(mockVideoUrl);
      
      setIsUploading(false);
      setUploadSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }, 2000);
  };

  const handleEmbedVideo = () => {
    // Simple validation for YouTube embed URL
    if (!embedUrl) {
      toast.error("الرجاء إدخال رابط الفيديو");
      return;
    }

    // Check if it's a YouTube or Vimeo URL
    if (embedUrl.includes("youtube.com") || embedUrl.includes("youtu.be")) {
      // Extract YouTube video ID
      let videoId;
      if (embedUrl.includes("youtube.com/watch?v=")) {
        videoId = embedUrl.split("v=")[1]?.split("&")[0];
      } else if (embedUrl.includes("youtu.be/")) {
        videoId = embedUrl.split("youtu.be/")[1];
      }
      
      if (videoId) {
        const embedCode = `https://www.youtube.com/embed/${videoId}`;
        onVideoUploaded(embedCode);
        toast.success("تم تضمين فيديو YouTube بنجاح");
        setEmbedUrl("");
      } else {
        toast.error("رابط YouTube غير صالح");
      }
    } else if (embedUrl.includes("vimeo.com")) {
      // Extract Vimeo video ID
      const vimeoId = embedUrl.split("vimeo.com/")[1];
      
      if (vimeoId) {
        const embedCode = `https://player.vimeo.com/video/${vimeoId}`;
        onVideoUploaded(embedCode);
        toast.success("تم تضمين فيديو Vimeo بنجاح");
        setEmbedUrl("");
      } else {
        toast.error("رابط Vimeo غير صالح");
      }
    } else {
      // Just use the URL as is
      onVideoUploaded(embedUrl);
      toast.success("تم تضمين رابط الفيديو بنجاح");
      setEmbedUrl("");
    }
  };

  return (
    <div className="space-y-4">
      {currentUrl && (
        <div className="mb-4">
          <Label className="block mb-2">الفيديو الحالي</Label>
          {currentUrl.includes("youtube.com/embed/") || currentUrl.includes("player.vimeo.com/") ? (
            <iframe
              src={currentUrl}
              width="100%"
              height="200"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded video"
              className="rounded-md"
            ></iframe>
          ) : (
            <video
              src={currentUrl}
              controls
              className="w-full h-48 object-cover rounded-md border"
            ></video>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="video-upload">رفع فيديو</Label>
        <div className="flex items-center gap-2">
          <Input 
            type="file" 
            id="video-upload" 
            accept="video/*" 
            onChange={handleFileChange} 
            className="hidden"
          />
          <Button
            type="button"
            variant={uploadSuccess ? "outline" : "default"}
            onClick={() => document.getElementById('video-upload')?.click()}
            disabled={isUploading}
            className={`w-full ${uploadSuccess ? "border-green-500 text-green-500" : ""}`}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                جاري رفع الفيديو...
              </span>
            ) : uploadSuccess ? (
              <span className="flex items-center gap-2">
                <Check size={16} />
                تم رفع الفيديو بنجاح
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload size={16} />
                رفع فيديو
              </span>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          الحد الأقصى لحجم الملف: 100 ميجابايت. الصيغ المدعومة: MP4, WebM, OGV.
        </p>
      </div>
      
      <div className="space-y-2 pt-2">
        <Label htmlFor="video-embed">تضمين فيديو (YouTube, Vimeo, إلخ)</Label>
        <div className="flex gap-2">
          <Input 
            id="video-embed"
            placeholder="https://www.youtube.com/watch?v=..."
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
          />
          <Button type="button" onClick={handleEmbedVideo}>
            <Video className="mr-2 h-4 w-4" />
            تضمين
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          أدخل رابط فيديو YouTube أو Vimeo لتضمينه في الصفحة.
        </p>
      </div>
    </div>
  );
};

export default VideoUpload;
