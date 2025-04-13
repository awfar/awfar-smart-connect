
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Copy, 
  Eye, 
  Code, 
  Edit, 
  Trash2, 
  FormInput, 
  FileCheck, 
  FileText,
  Mail,
  Phone,
  User,
  MessageSquare,
  CalendarDays,
  Check,
  ListChecks,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fields: number;
  category: string;
}

interface Form {
  id: string;
  name: string;
  description: string;
  submissions: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

const formTemplates: FormTemplate[] = [
  {
    id: "contact",
    name: "نموذج اتصال",
    description: "نموذج اتصال أساسي مع الاسم والبريد الإلكتروني والرسالة",
    icon: <Mail className="h-5 w-5" />,
    fields: 4,
    category: "اتصال"
  },
  {
    id: "feedback",
    name: "نموذج ملاحظات",
    description: "نموذج لجمع آراء وملاحظات المستخدمين",
    icon: <MessageSquare className="h-5 w-5" />,
    fields: 5,
    category: "ملاحظات"
  },
  {
    id: "registration",
    name: "نموذج تسجيل",
    description: "نموذج تسجيل للمستخدمين الجدد",
    icon: <User className="h-5 w-5" />,
    fields: 6,
    category: "تسجيل"
  },
  {
    id: "appointment",
    name: "حجز موعد",
    description: "نموذج لحجز المواعيد مع تقويم",
    icon: <CalendarDays className="h-5 w-5" />,
    fields: 5,
    category: "مواعيد"
  },
  {
    id: "survey",
    name: "استبيان",
    description: "نموذج استبيان مع أسئلة متنوعة",
    icon: <ListChecks className="h-5 w-5" />,
    fields: 8,
    category: "استطلاعات"
  },
  {
    id: "payment",
    name: "نموذج دفع",
    description: "نموذج لإدخال بيانات الدفع",
    icon: <CreditCard className="h-5 w-5" />,
    fields: 7,
    category: "مدفوعات"
  }
];

const existingForms: Form[] = [
  {
    id: "form-1",
    name: "نموذج اتصل بنا",
    description: "نموذج الاتصال في صفحة تواصل معنا",
    submissions: 124,
    createdAt: "2023-09-15",
    updatedAt: "2023-10-20",
    isActive: true
  },
  {
    id: "form-2",
    name: "طلب عرض أسعار",
    description: "نموذج طلب عرض سعر للخدمات",
    submissions: 58,
    createdAt: "2023-08-22",
    updatedAt: "2023-10-15",
    isActive: true
  },
  {
    id: "form-3",
    name: "استطلاع رضا العملاء",
    description: "نموذج استطلاع آراء العملاء حول الخدمات",
    submissions: 87,
    createdAt: "2023-07-10",
    updatedAt: "2023-09-05",
    isActive: false
  }
];

const FormManager = () => {
  const [forms, setForms] = useState<Form[]>(existingForms);
  const [embedCodeDialog, setEmbedCodeDialog] = useState({
    isOpen: false,
    formId: ""
  });

  const handleDuplicateForm = (formId: string) => {
    const formToDuplicate = forms.find(form => form.id === formId);
    
    if (formToDuplicate) {
      const newForm: Form = {
        ...formToDuplicate,
        id: `form-${Date.now()}`,
        name: `${formToDuplicate.name} (نسخة)`,
        submissions: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      setForms([...forms, newForm]);
      toast.success(`تم نسخ النموذج "${formToDuplicate.name}" بنجاح`);
    }
  };

  const handleDeleteForm = (formId: string) => {
    const formToDelete = forms.find(form => form.id === formId);
    setForms(forms.filter(form => form.id !== formId));
    
    if (formToDelete) {
      toast.success(`تم حذف النموذج "${formToDelete.name}" بنجاح`);
    }
  };

  const handleToggleFormStatus = (formId: string) => {
    const updatedForms = forms.map(form => {
      if (form.id === formId) {
        const newStatus = !form.isActive;
        toast.success(`تم ${newStatus ? 'تفعيل' : 'إلغاء تفعيل'} النموذج "${form.name}" بنجاح`);
        return {
          ...form,
          isActive: newStatus,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return form;
    });
    
    setForms(updatedForms);
  };

  const showEmbedCode = (formId: string) => {
    setEmbedCodeDialog({
      isOpen: true,
      formId
    });
  };

  const embedCode = `<iframe 
  src="https://your-website.com/embed/form/${embedCodeDialog.formId}" 
  width="100%" 
  height="500" 
  style="border: none; border-radius: 8px;">
</iframe>`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-medium">إدارة النماذج</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          نموذج جديد
        </Button>
      </div>
      
      <Tabs defaultValue="myForms" className="w-full">
        <TabsList className="mb-4 grid grid-cols-2 w-full">
          <TabsTrigger value="myForms">النماذج الخاصة بي</TabsTrigger>
          <TabsTrigger value="templates">قوالب النماذج</TabsTrigger>
        </TabsList>
        
        <TabsContent value="myForms">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم النموذج</TableHead>
                    <TableHead className="hidden md:table-cell">عدد الاستجابات</TableHead>
                    <TableHead className="hidden md:table-cell">آخر تحديث</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">
                        <div>
                          {form.name}
                          <p className="text-xs text-muted-foreground">{form.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{form.submissions}</TableCell>
                      <TableCell className="hidden md:table-cell">{form.updatedAt}</TableCell>
                      <TableCell>
                        <Badge variant={form.isActive ? "default" : "outline"}>
                          {form.isActive ? "مفعل" : "غير مفعل"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost">
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => showEmbedCode(form.id)}
                          >
                            <Code size={16} />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <FileCheck size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleDuplicateForm(form.id)}
                          >
                            <Copy size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleToggleFormStatus(form.id)}
                          >
                            {form.isActive ? <FileText size={16} /> : <Check size={16} />}
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteForm(form.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {template.icon}
                    <span>{template.name}</span>
                    <Badge variant="outline" className="ml-auto">
                      {template.fields} حقول
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    معاينة
                  </Button>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    استخدام
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Embed Code Dialog */}
      <Dialog 
        open={embedCodeDialog.isOpen} 
        onOpenChange={(open) => setEmbedCodeDialog({...embedCodeDialog, isOpen: open})}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>كود تضمين النموذج</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <pre className="text-sm overflow-x-auto">{embedCode}</pre>
            </div>
            <p className="text-sm text-muted-foreground">
              انسخ هذا الكود والصقه في أي صفحة HTML لتضمين النموذج.
            </p>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(embedCode);
                toast.success("تم نسخ الكود بنجاح");
              }}
            >
              نسخ الكود
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormManager;
