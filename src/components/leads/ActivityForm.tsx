
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, CalendarClock, FileText } from "lucide-react";
import { toast } from "sonner";
import { LeadActivity, createLeadActivity } from "@/services/leadsService";

interface ActivityFormProps {
  onClose: () => void;
  onSuccess: (activity: LeadActivity) => void;
  leadId: string;
  title: string;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onClose, onSuccess, leadId, title }) => {
  const [formData, setFormData] = useState<Partial<LeadActivity>>({
    lead_id: leadId,
    type: "note",
    description: "",
    scheduled_at: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof Partial<LeadActivity>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createLeadActivity(formData);
      if (result) {
        onSuccess(result);
      } else {
        throw new Error("Failed to create activity");
      }
    } catch (error) {
      console.error("Error submitting activity:", error);
      toast.error("فشل إضافة النشاط");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">نوع النشاط</Label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع النشاط" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">ملاحظة</SelectItem>
                  <SelectItem value="call">مكالمة</SelectItem>
                  <SelectItem value="meeting">اجتماع</SelectItem>
                  <SelectItem value="email">بريد إلكتروني</SelectItem>
                  <SelectItem value="task">مهمة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">التفاصيل</Label>
            <Textarea 
              id="description" 
              rows={4}
              value={formData.description} 
              onChange={(e) => handleChange("description", e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled_at">التاريخ المحدد</Label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <CalendarClock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input 
                id="scheduled_at" 
                type="date"
                value={formData.scheduled_at ? formData.scheduled_at.toString().split('T')[0] : ""} 
                onChange={(e) => handleChange("scheduled_at", e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>إلغاء</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "جاري الحفظ..." : "إضافة"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ActivityForm;
