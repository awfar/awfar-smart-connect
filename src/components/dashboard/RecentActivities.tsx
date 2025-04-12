
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Calendar, MessageSquare, ClipboardList } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "call",
    user: { name: "أحمد محمد", avatar: "/placeholder.svg", initials: "أم" },
    customer: "شركة التقنية الحديثة",
    description: "اتصال هاتفي لمناقشة عرض السعر المقدم",
    time: "منذ 35 دقيقة",
    icon: Phone,
  },
  {
    id: 2,
    type: "email",
    user: { name: "سارة أحمد", avatar: "/placeholder.svg", initials: "سأ" },
    customer: "مؤسسة الأفكار",
    description: "تم إرسال عرض السعر بالبريد الإلكتروني",
    time: "منذ ساعتين",
    icon: Mail,
  },
  {
    id: 3,
    type: "meeting",
    user: { name: "محمود عبد الله", avatar: "/placeholder.svg", initials: "مع" },
    customer: "شركة الابتكار",
    description: "تم تحديد موعد اجتماع لمناقشة تفاصيل التعاقد",
    time: "غداً، 11:00 صباحاً",
    icon: Calendar,
  },
  {
    id: 4,
    type: "message",
    user: { name: "نورا سعيد", avatar: "/placeholder.svg", initials: "نس" },
    customer: "مجموعة المستقبل",
    description: "رسالة واتساب متابعة بخصوص المتطلبات التقنية",
    time: "منذ 4 ساعات",
    icon: MessageSquare,
  },
  {
    id: 5,
    type: "note",
    user: { name: "خالد محمود", avatar: "/placeholder.svg", initials: "خم" },
    customer: "مؤسسة التطوير",
    description: "تم إضافة ملاحظة حول الاحتياجات الإضافية للعميل",
    time: "منذ 5 ساعات",
    icon: ClipboardList,
  },
];

const getActivityIconColor = (type: string) => {
  switch (type) {
    case "call":
      return "bg-green-100 text-green-600";
    case "email":
      return "bg-blue-100 text-blue-600";
    case "meeting":
      return "bg-purple-100 text-purple-600";
    case "message":
      return "bg-yellow-100 text-yellow-600";
    case "note":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getActivityTypeText = (type: string) => {
  switch (type) {
    case "call":
      return "مكالمة";
    case "email":
      return "بريد";
    case "meeting":
      return "اجتماع";
    case "message":
      return "رسالة";
    case "note":
      return "ملاحظة";
    default:
      return type;
  }
};

const RecentActivities = () => {
  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`p-2 rounded-full ${getActivityIconColor(activity.type)}`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="w-px grow bg-border" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex gap-2 items-center">
              <Avatar className="h-6 w-6">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{activity.user.name}</span>
              <Badge variant="outline" className="text-xs">
                {getActivityTypeText(activity.type)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{activity.customer}</span> -{" "}
                {activity.description}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivities;
