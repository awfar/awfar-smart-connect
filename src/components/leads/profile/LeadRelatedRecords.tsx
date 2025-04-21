
import React from 'react';
import { Lead } from '@/types/leads';
import { 
  Building, 
  FileText, 
  Calendar, 
  BookText, 
  Briefcase, 
  TicketCheck,
  FileIcon,
  Plus,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface LeadRelatedRecordsProps {
  lead: Lead;
  tasks: any[];
  appointments: any[];
  isLoadingTasks: boolean;
  isLoadingAppointments: boolean;
  onAddTask: () => void;
  onAddAppointment: () => void;
}

const LeadRelatedRecords: React.FC<LeadRelatedRecordsProps> = ({
  lead,
  tasks,
  appointments,
  isLoadingTasks,
  isLoadingAppointments,
  onAddTask,
  onAddAppointment
}) => {
  return (
    <div className="space-y-6">
      {/* Company Card */}
      {lead.company && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Building className="ml-2 h-5 w-5" />
                الشركة
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{lead.company}</p>
                {lead.industry && <p className="text-sm text-muted-foreground">{lead.industry}</p>}
              </div>
              <Link to={`/dashboard/companies?search=${encodeURIComponent(lead.company)}`}>
                <Button variant="outline" size="sm">
                  عرض الشركة
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <FileText className="ml-2 h-5 w-5" />
              المهام
            </CardTitle>
            <Button size="sm" variant="outline" onClick={onAddTask}>
              <Plus className="ml-1 h-4 w-4" />
              إضافة مهمة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingTasks ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-start gap-2">
                    {task.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{task.title}</p>
                        <Badge variant="outline" className="mr-2">
                          {task.status === 'pending' ? 'قيد الانتظار' : 
                           task.status === 'in_progress' ? 'قيد التنفيذ' : 
                           task.status === 'completed' ? 'مكتمل' : task.status}
                        </Badge>
                      </div>
                      {task.due_date && (
                        <p className="text-xs text-muted-foreground">
                          تاريخ الاستحقاق: {format(new Date(task.due_date), 'yyyy/MM/dd', { locale: ar })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">لا توجد مهام مرتبطة بهذا العميل</p>
          )}
        </CardContent>
        {tasks.length > 3 && (
          <CardFooter className="pt-0">
            <Link to={`/dashboard/tasks?lead_id=${lead.id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                عرض كل المهام ({tasks.length})
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>

      {/* Appointments Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="ml-2 h-5 w-5" />
              المواعيد
            </CardTitle>
            <Button size="sm" variant="outline" onClick={onAddAppointment}>
              <Plus className="ml-1 h-4 w-4" />
              إضافة موعد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingAppointments ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.slice(0, 3).map(appointment => (
                <div key={appointment.id} className="flex items-start justify-between border-b pb-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-indigo-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{appointment.title}</p>
                      <div className="text-xs text-muted-foreground">
                        <p>{appointment.start_time && format(new Date(appointment.start_time), 'yyyy/MM/dd HH:mm', { locale: ar })}</p>
                        {appointment.location && <p>المكان: {appointment.location}</p>}
                      </div>
                    </div>
                  </div>
                  <Badge variant={appointment.status === 'scheduled' ? 'outline' : 'default'}>
                    {appointment.status === 'scheduled' ? 'مجدول' : 
                     appointment.status === 'completed' ? 'مكتمل' : 
                     appointment.status === 'cancelled' ? 'ملغي' : appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">لا توجد مواعيد مرتبطة بهذا العميل</p>
          )}
        </CardContent>
        {appointments.length > 3 && (
          <CardFooter className="pt-0">
            <Link to={`/dashboard/calendar?lead_id=${lead.id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                عرض كل المواعيد ({appointments.length})
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>

      {/* Empty Deals Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="ml-2 h-5 w-5" />
              الصفقات
            </CardTitle>
            <Button size="sm" variant="outline" disabled>
              <Plus className="ml-1 h-4 w-4" />
              إضافة صفقة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-muted-foreground">لا توجد صفقات مرتبطة بهذا العميل</p>
        </CardContent>
      </Card>

      {/* Empty Tickets Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <TicketCheck className="ml-2 h-5 w-5" />
              التذاكر
            </CardTitle>
            <Button size="sm" variant="outline" disabled>
              <Plus className="ml-1 h-4 w-4" />
              إنشاء تذكرة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-muted-foreground">لا توجد تذاكر دعم فني مرتبطة بهذا العميل</p>
        </CardContent>
      </Card>

      {/* Empty Invoices Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <FileIcon className="ml-2 h-5 w-5" />
              الفواتير والاشتراكات
            </CardTitle>
            <Button size="sm" variant="outline" disabled>
              <Plus className="ml-1 h-4 w-4" />
              إنشاء فاتورة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-muted-foreground">لا توجد فواتير أو اشتراكات مرتبطة بهذا العميل</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadRelatedRecords;
