
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Mock data for chats
const MOCK_CHATS = [
  {
    id: 1,
    name: "أحمد محمد",
    avatar: "/placeholder.svg",
    initials: "أم",
    lastMessage: "شكراً لكم على المتابعة",
    timestamp: "10:30 ص",
    unread: 2,
  },
  {
    id: 2,
    name: "شركة التقنية الحديثة",
    avatar: "/placeholder.svg",
    initials: "شت",
    lastMessage: "متى يمكننا تحديد موعد للاجتماع؟",
    timestamp: "الأمس",
    unread: 0,
  },
  {
    id: 3,
    name: "خالد العبدالله",
    avatar: "/placeholder.svg",
    initials: "خع",
    lastMessage: "أرسلت لك تفاصيل المشروع",
    timestamp: "الأمس",
    unread: 0,
  },
  {
    id: 4,
    name: "سارة أحمد",
    avatar: "/placeholder.svg",
    initials: "سأ",
    lastMessage: "سأتصل بك لاحقاً لمناقشة التفاصيل",
    timestamp: "22/04",
    unread: 0,
  },
];

// Mock messages for a single chat
const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "أحمد محمد",
    isMe: false,
    content: "مرحباً، أود الاستفسار عن خدماتكم",
    timestamp: "10:15 ص",
  },
  {
    id: 2,
    sender: "أنا",
    isMe: true,
    content: "أهلاً بك، كيف يمكنني مساعدتك؟",
    timestamp: "10:18 ص",
  },
  {
    id: 3,
    sender: "أحمد محمد",
    isMe: false,
    content: "أبحث عن حل لإدارة المبيعات في شركتي",
    timestamp: "10:20 ص",
  },
  {
    id: 4,
    sender: "أنا",
    isMe: true,
    content: "لدينا حلول متكاملة لإدارة المبيعات، يمكننا تنظيم اجتماع لعرض المنتج",
    timestamp: "10:25 ص",
  },
  {
    id: 5,
    sender: "أحمد محمد",
    isMe: false,
    content: "شكراً لكم على المتابعة",
    timestamp: "10:30 ص",
  },
];

const ChatsManagement = () => {
  const [selectedChat, setSelectedChat] = React.useState<number | null>(1);
  const [activeTab, setActiveTab] = React.useState("all");
  const [messageInput, setMessageInput] = React.useState("");

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // Here you would typically send the message via API
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">المحادثات</h1>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 lg:gap-6">
          {/* Chats List */}
          <div className="md:h-[calc(100vh-200px)]">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="بحث في المحادثات..."
                      className="flex-1 pr-9"
                    />
                  </div>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full mt-2">
                    <TabsTrigger value="all" className="flex-1">
                      الكل
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="flex-1">
                      غير مقروءة
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  {MOCK_CHATS
                    .filter(chat => activeTab === "all" || chat.unread > 0)
                    .map(chat => (
                      <div
                        key={chat.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${
                          selectedChat === chat.id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <Avatar>
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback>{chat.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                            <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                        </div>
                        {chat.unread > 0 && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-[10px] text-white font-medium">{chat.unread}</span>
                          </div>
                        )}
                      </div>
                    ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Messages */}
          <div className="md:h-[calc(100vh-200px)]">
            <Card className="h-full flex flex-col">
              {selectedChat ? (
                <>
                  <CardHeader className="border-b pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>أم</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">أحمد محمد</CardTitle>
                        <CardDescription>متصل الآن</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-0 flex flex-col">
                    <ScrollArea className="flex-1 h-[calc(100vh-380px)] p-4">
                      <div className="space-y-4">
                        {MOCK_MESSAGES.map(message => (
                          <div
                            key={message.id}
                            className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.isMe
                                  ? "bg-primary text-white"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${message.isMe ? "text-white/70" : "text-muted-foreground"}`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t mt-auto">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="اكتب رسالتك هنا..."
                          value={messageInput}
                          onChange={e => setMessageInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Enter") handleSendMessage();
                          }}
                        />
                        <Button size="icon" onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="font-medium mb-2">لم يتم تحديد محادثة</h3>
                    <p className="text-muted-foreground">اختر محادثة من القائمة للبدء</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatsManagement;
