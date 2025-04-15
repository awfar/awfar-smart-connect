
import * as React from "react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface TimePickerDemoProps {
  value: string;
  onChange: (time: string) => void;
  disabled?: boolean;
}

export function TimePickerDemo({ value, onChange, disabled }: TimePickerDemoProps) {
  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        disabled={disabled}
      />
    </div>
  )
}
