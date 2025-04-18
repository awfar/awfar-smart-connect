import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskForm from "@/components/tasks/TaskForm";
import { toast } from "sonner";

const TasksManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreateTask = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
  };

  const handleSaveTask = async () => {
    toast.success("تم حفظ المهمة بنجاح");
    setIsCreating(false);
    return Promise.resolve();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المهام</h1>
        
        {!isCreating && (
          <Button onClick={handleCreateTask}>
            إضافة مهمة جديدة
          </Button>
        )}
      </div>

      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>مهمة جديدة</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm 
              onCancel={handleCancelCreate}
              onSubmit={handleSaveTask}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Task lists will go here */}
          <p>قم بتطوير واجهة عرض المهام هنا</p>
        </div>
      )}
    </div>
  );
};

export default TasksManagement;
