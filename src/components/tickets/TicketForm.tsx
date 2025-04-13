
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createTicket, fetchClients, fetchStaff, Ticket } from "@/services/ticketsService";
import { Loader2 } from "lucide-react";

interface TicketFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onCancel, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [staff, setStaff] = useState<{ id: string; name: string }[]>([]);
  
  useEffect(() => {
    // Load clients and staff data when component mounts
    const loadData = async () => {
      const clientsData = await fetchClients();
      const staffData = await fetchStaff();
      setClients(clientsData);
      setStaff(staffData);
    };
    
    loadData();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !client || !category || !priority) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    setLoading(true);
    
    try {
      const ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'> = {
        subject: title,
        description,
        status: 'open',
        priority: priority as Ticket['priority'],
        category,
        client_id: client,
        assigned_to: assignedTo || undefined
      };
      
      const result = await createTicket(ticketData);
      
      if (result) {
        onSave();
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "customer-service", label: "خدمة العملاء" },
    { value: "technical-support", label: "الدعم الفني" },
    { value: "sales", label: "المبيعات" },
    { value: "finance", label: "المالية" },
    { value: "other", label: "أخرى" }
  ];

  const priorities = [
    { value: "منخفض", label: "منخفض" },
    { value: "متوسط", label: "متوسط" },
    { value: "عالي", label: "عالي" },
    { value: "عاجل", label: "عاجل" }
  ];

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">عنوان التذكرة</Label>
          <Input 
            id="title" 
            placeholder="أدخل عنوان التذكرة" 
            className="mt-1" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">وصف المشكلة</Label>
          <Textarea
            id="description"
            placeholder="اكتب وصفاً تفصيلياً للمشكلة"
            className="mt-1"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client">العميل</Label>
            <Select value={client} onValueChange={setClient} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر العميل" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>العملاء</SelectLabel>
                  {clients.length > 0 ? (
                    clients.map((clientItem) => (
                      <SelectItem key={clientItem.id} value={clientItem.id}>
                        {clientItem.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-clients" disabled>
                      لا يوجد عملاء
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">الفئة</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الفئات</SelectLabel>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">الأولوية</Label>
            <Select value={priority} onValueChange={setPriority} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>مستوى الأولوية</SelectLabel>
                  {priorities.map((pri) => (
                    <SelectItem key={pri.value} value={pri.value}>
                      {pri.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assignedTo">تعيين إلى</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="تعيين المسؤول" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الموظفين</SelectLabel>
                  {staff.length > 0 ? (
                    staff.map((staffItem) => (
                      <SelectItem key={staffItem.id} value={staffItem.id}>
                        {staffItem.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-staff" disabled>
                      لا يوجد موظفين
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="attachments">المرفقات (اختياري)</Label>
          <Input 
            id="attachments" 
            type="file" 
            className="mt-1" 
            multiple
          />
          <p className="text-xs text-muted-foreground mt-1">يمكنك إرفاق ملفات متعددة (الحد الأقصى: 5 ملفات، 10 ميجابايت لكل ملف)</p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel} type="button">إلغاء</Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ التذكرة"
          )}
        </Button>
      </div>
    </form>
  );
};

export default TicketForm;
