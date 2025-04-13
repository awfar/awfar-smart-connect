
import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const predefinedColors = [
  "#000000", "#ffffff", "#f44336", "#e91e63",
  "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
  "#03a9f4", "#00bcd4", "#009688", "#4caf50",
  "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107",
  "#ff9800", "#ff5722", "#795548", "#9e9e9e"
];

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [selectedColor, setSelectedColor] = useState(color || "#000000");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedColor(color);
  }, [color]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
    onChange(e.target.value);
  };

  const handleColorSelect = (colorValue: string) => {
    setSelectedColor(colorValue);
    onChange(colorValue);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          style={{ backgroundColor: color }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="h-4 w-4 rounded border"
              style={{ backgroundColor: color }}
            />
            <span className={color === "#ffffff" ? "text-black" : color === "#000000" ? "text-white" : ""}>
              {color}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>اختر لون</Label>
            <Input 
              type="color" 
              value={selectedColor} 
              onChange={handleColorChange}
              className="h-10 p-1"
            />
          </div>
          
          <div className="space-y-2">
            <Label>الألوان المقترحة</Label>
            <div className="grid grid-cols-5 gap-2">
              {predefinedColors.map((colorValue) => (
                <button
                  key={colorValue}
                  type="button"
                  className={`h-6 w-6 rounded-md border ${selectedColor === colorValue ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  style={{ backgroundColor: colorValue }}
                  onClick={() => handleColorSelect(colorValue)}
                  aria-label={`اللون ${colorValue}`}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>قيمة اللون</Label>
            <Input 
              type="text" 
              value={selectedColor} 
              onChange={handleColorChange}
              pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
