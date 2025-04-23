
// Enhanced TasksManagement: live data, modal, new/edit, filtering

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskForm from "@/components/tasks/TaskForm";
import TasksList from "@/components/tasks/TasksList";
import { toast } from "sonner";
import { createTask, updateTask, deleteTask } from "@/services/tasks/api";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";

type ViewTab = "myTasks" | "all" | "team";
const TABS: { value: ViewTab; label: string }[] = [
  { value: "myTasks", label: "مهامي" },
  { value: "all", label: "كل المهام" },
  { value: "team", label: "مهام الفريق" }
];

const TasksManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [viewTab, setViewTab] = useState<ViewTab>("myTasks");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateTask = () => setIsCreating(true);

  const handleCancelCreate = () => setIsCreating(false);

  const handleSaveTask = async (data: any) => {
    try {
      await createTask(data);
      toast.success("تم حفظ المهمة بنجاح");
      setIsCreating(false);
      setRefreshKey(prev => prev + 1);
    } catch {
      toast.error("لم يتم حفظ المهمة");
    }
  };

  const handleEdit = (task: any) => setEditTask(task);

  const handleUpdateTask = async (data: any) => {
    try {
      await updateTask(editTask.id, data);
      toast.success("تم تحديث المهمة");
      setEditTask(null);
      setRefreshKey(prev => prev + 1);
    } catch {
      toast.error("لم يتم تحديث المهمة");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف المهمة؟')) return;
    try {
      await deleteTask(taskId);
      toast.success("تم حذف المهمة");
      setRefreshKey(prev => prev + 1);
    } catch {
      toast.error("لم يتم حذف المهمة");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المهام</h1>
        {!isCreating && !editTask && (
          <Button onClick={handleCreateTask}>
            إضافة مهمة جديدة
          </Button>
        )}
      </div>
      <div className="flex gap-4 mt-2">
        {TABS.map(tab => (
          <Button
            key={tab.value}
            size="sm"
            variant={viewTab === tab.value ? "default" : "outline"}
            onClick={() => setViewTab(tab.value)}
          >{tab.label}</Button>
        ))}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="ml-2 border rounded p-1 text-sm"
        >
          <option value="all">كل الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="in_progress">قيد التنفيذ</option>
          <option value="completed">مكتملة</option>
          <option value="cancelled">ملغاة</option>
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="ml-2 border rounded p-1 text-sm"
        >
          <option value="all">كل الأولويات</option>
          <option value="low">منخفضة</option>
          <option value="medium">متوسطة</option>
          <option value="high">عالية</option>
        </select>
      </div>
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>مهمة جديدة</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm onSubmit={handleSaveTask} isSubmitting={false} onCancel={handleCancelCreate} />
          </CardContent>
        </Card>
      )}
      {editTask && (
        <Card>
          <CardHeader>
            <CardTitle>تعديل المهمة</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              onSubmit={handleUpdateTask}
              isSubmitting={false}
              task={editTask}
              onCancel={() => setEditTask(null)}
            />
          </CardContent>
        </Card>
      )}
      {!isCreating && !editTask && (
        <div className="grid grid-cols-1 gap-4">
          <TasksList
            view={viewTab}
            filterStatus={filterStatus}
            filterPriority={filterPriority}
            onEdit={handleEdit}
            onDelete={handleDeleteTask}
            onShowDetails={setSelectedTask}
            key={refreshKey}
          />
        </div>
      )}
      <TaskDetailModal open={!!selectedTask} task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
};

export default TasksManagement;

