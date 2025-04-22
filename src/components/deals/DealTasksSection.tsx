
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DealTasksSectionProps {
  dealId: string;
}

const DealTasksSection = ({ dealId }: DealTasksSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>المهام</CardTitle>
          <Button size="sm">
            <Plus className="h-4 w-4 ml-2" />
            مهمة جديدة
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-muted-foreground">لا توجد مهام مرتبطة بهذه الصفقة.</p>
          <p className="text-muted-foreground text-sm mt-2">
            أضف مهاماً جديدة لتتبع العمل المطلوب إنجازه على هذه الصفقة.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealTasksSection;
