
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

// Mock data for charts
const leadsBySource = [
  { name: 'نموذج موقع', value: 35 },
  { name: 'إحالة', value: 25 },
  { name: 'معرض', value: 20 },
  { name: 'واتساب', value: 15 },
  { name: 'اتصال مباشر', value: 5 },
];

const salesData = [
  { name: 'يناير', total: 10000 },
  { name: 'فبراير', total: 15000 },
  { name: 'مارس', total: 12000 },
  { name: 'أبريل', total: 18000 },
  { name: 'مايو', total: 22000 },
  { name: 'يونيو', total: 19000 },
  { name: 'يوليو', total: 25000 },
  { name: 'أغسطس', total: 28000 },
  { name: 'سبتمبر', total: 30000 },
  { name: 'أكتوبر', total: 35000 },
  { name: 'نوفمبر', total: 40000 },
  { name: 'ديسمبر', total: 50000 },
];

const conversionRateData = [
  { name: 'جديد', value: 100 },
  { name: 'مؤهل', value: 75 },
  { name: 'فرصة', value: 50 },
  { name: 'عرض سعر', value: 30 },
  { name: 'مغلق', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const ReportsManagement = () => {
  const [period, setPeriod] = useState('yearly');
  
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">التقارير</h1>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  فلترة
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              </div>
            </div>
            
            <div className="flex items-center">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="اختر الفترة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">اليوم</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="quarterly">ربع سنوي</SelectItem>
                  <SelectItem value="yearly">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="sales">
              <TabsList className="mb-4">
                <TabsTrigger value="sales">المبيعات</TabsTrigger>
                <TabsTrigger value="leads">العملاء المحتملين</TabsTrigger>
                <TabsTrigger value="performance">الأداء</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sales">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>إيرادات المبيعات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={salesData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="total" stroke="#8884d8" fillOpacity={1} fill="url(#colorTotal)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>المبيعات حسب المنتج</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'المنتج أ', value: 400 },
                              { name: 'المنتج ب', value: 300 },
                              { name: 'المنتج ج', value: 200 },
                              { name: 'المنتج د', value: 100 },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="leads">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>العملاء المحتملين حسب المصدر</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={leadsBySource}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {leadsBySource.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>معدل التحويل</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={conversionRateData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="performance">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>أداء الفريق</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { name: 'محمد', value: 85 },
                              { name: 'سارة', value: 90 },
                              { name: 'أحمد', value: 65 },
                              { name: 'خالد', value: 78 },
                              { name: 'منى', value: 72 },
                            ]}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>معدل إغلاق الصفقات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              { name: 'يناير', rate: 35 },
                              { name: 'فبراير', rate: 40 },
                              { name: 'مارس', rate: 38 },
                              { name: 'أبريل', rate: 45 },
                              { name: 'مايو', rate: 50 },
                              { name: 'يونيو', rate: 55 },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="rate" stroke="#82ca9d" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsManagement;
