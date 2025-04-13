
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Subscription, BillingCycle, createSubscription, updateSubscription } from "@/services/catalogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

const subscriptionSchema = z.object({
  name: z.string().min(1, { message: "الإسم مطلوب" }),
  description: z.string().min(1, { message: "الوصف مطلوب" }),
  price: z.coerce.number().positive({ message: "السعر يجب أن يكون رقماً موجباً" }),
  billingCycle: z.enum(["monthly", "quarterly", "annually"], {
    required_error: "يرجى تحديد دورة الفوترة",
  }),
  features: z.array(z.string()),
  isActive: z.boolean().default(true),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSuccess: () => void;
}

export default function SubscriptionForm({ subscription, onSuccess }: SubscriptionFormProps) {
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: subscription
      ? {
          ...subscription,
        }
      : {
          name: "",
          description: "",
          price: 0,
          billingCycle: "monthly" as BillingCycle,
          features: [""],
          isActive: true,
        },
  });

  const addFeature = () => {
    const currentFeatures = form.getValues("features");
    form.setValue("features", [...currentFeatures, ""]);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features");
    form.setValue(
      "features",
      currentFeatures.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: SubscriptionFormValues) => {
    try {
      // Filter out empty features
      const filteredFeatures = data.features.filter((feature) => feature.trim() !== "");
      
      // Ensure all required fields are present
      const subscriptionData: Omit<Subscription, 'id'> = {
        name: data.name,
        description: data.description,
        price: data.price,
        billingCycle: data.billingCycle,
        features: filteredFeatures,
        isActive: data.isActive
      };
      
      if (subscription) {
        await updateSubscription(subscription.id, subscriptionData);
        toast.success("تم تحديث الاشتراك بنجاح");
      } else {
        await createSubscription(subscriptionData);
        toast.success("تم إنشاء الاشتراك بنجاح");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving subscription:", error);
      toast.error("حدث خطأ أثناء حفظ الاشتراك");
    }
  };

  const billingCycleOptions = [
    { value: "monthly", label: "شهري" },
    { value: "quarterly", label: "ربع سنوي" },
    { value: "annually", label: "سنوي" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإسم</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="أدخل إسم الاشتراك" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="أدخل وصف الاشتراك" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السعر</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>دورة الفوترة</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر دورة الفوترة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {billingCycleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-2">
                    <FormLabel>نشط</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">المميزات</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" /> إضافة ميزة
                  </Button>
                </div>

                {form.watch("features").map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`features.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="أدخل الميزة" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                      disabled={form.watch("features").length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            إلغاء
          </Button>
          <Button type="submit">{subscription ? "تحديث" : "إنشاء"} الاشتراك</Button>
        </div>
      </form>
    </Form>
  );
}
