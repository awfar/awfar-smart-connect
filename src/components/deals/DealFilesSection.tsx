
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

interface DealFilesSectionProps {
  dealId: string;
}

const DealFilesSection = ({ dealId }: DealFilesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>الملفات</CardTitle>
          <Button size="sm">
            <Upload className="h-4 w-4 ml-2" />
            رفع ملف
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-muted-foreground">لا توجد ملفات مرتبطة بهذه الصفقة.</p>
          <p className="text-muted-foreground text-sm mt-2">
            قم برفع المستندات المهمة مثل العروض والعقود.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealFilesSection;
