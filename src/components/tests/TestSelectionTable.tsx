import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TestModule {
  id: string;
  name: string;
  description: string;
  actions: TestAction[];
}

export interface TestAction {
  id: string;
  name: string;
  description: string;
  validations: TestValidation[];
}

export interface TestValidation {
  id: string;
  name: string;
  description: string;
}

export interface SelectedTests {
  [moduleId: string]: {
    selected: boolean;
    actions: {
      [actionId: string]: {
        selected: boolean;
        validations: {
          [validationId: string]: boolean;
        };
      };
    };
  };
}

interface TestSelectionTableProps {
  modules: TestModule[];
  onSelectionChange: (selected: SelectedTests) => void;
}

const TestSelectionTable: React.FC<TestSelectionTableProps> = ({ modules, onSelectionChange }) => {
  const [selectedTests, setSelectedTests] = useState<SelectedTests>(() => {
    // تهيئة الحالة الأولية بناءً على الوحدات المتوفرة
    const initial: SelectedTests = {};
    
    modules.forEach(module => {
      const actions: { [actionId: string]: { selected: boolean; validations: { [validationId: string]: boolean } } } = {};
      
      module.actions.forEach(action => {
        const validations: { [validationId: string]: boolean } = {};
        
        action.validations.forEach(validation => {
          validations[validation.id] = false;
        });
        
        actions[action.id] = { selected: false, validations };
      });
      
      initial[module.id] = { selected: false, actions };
    });
    
    return initial;
  });

  // تغيير حالة وحدة كاملة
  const toggleModule = (moduleId: string, checked: boolean) => {
    setSelectedTests(prev => {
      const updated = { ...prev };
      
      if (updated[moduleId]) {
        updated[moduleId].selected = checked;
        
        // تحديث حالة كل الإجراءات في هذه الوحدة
        Object.keys(updated[moduleId].actions).forEach(actionId => {
          updated[moduleId].actions[actionId].selected = checked;
          
          // تحديث حالة كل التحققات في هذا الإجراء
          Object.keys(updated[moduleId].actions[actionId].validations).forEach(validationId => {
            updated[moduleId].actions[actionId].validations[validationId] = checked;
          });
        });
      }
      
      onSelectionChange(updated);
      return updated;
    });
  };

  // تغيير حالة إجراء
  const toggleAction = (moduleId: string, actionId: string, checked: boolean) => {
    setSelectedTests(prev => {
      const updated = { ...prev };
      
      if (updated[moduleId]?.actions[actionId]) {
        updated[moduleId].actions[actionId].selected = checked;
        
        // تحديث حالة كل التحققات في هذا الإجراء
        Object.keys(updated[moduleId].actions[actionId].validations).forEach(validationId => {
          updated[moduleId].actions[actionId].validations[validationId] = checked;
        });
        
        // تحديث حالة الوحدة الأم بناءً على حالة جميع الإجراءات
        const allActionsSelected = Object.values(updated[moduleId].actions).every(action => action.selected);
        updated[moduleId].selected = allActionsSelected;
      }
      
      onSelectionChange(updated);
      return updated;
    });
  };

  // تغيير حالة تحقق
  const toggleValidation = (moduleId: string, actionId: string, validationId: string, checked: boolean) => {
    setSelectedTests(prev => {
      const updated = { ...prev };
      
      if (updated[moduleId]?.actions[actionId]?.validations) {
        updated[moduleId].actions[actionId].validations[validationId] = checked;
        
        // تحديث حالة الإجراء الأب بناءً على حالة جميع التحققات
        const allValidationsSelected = Object.values(updated[moduleId].actions[actionId].validations).every(v => v);
        updated[moduleId].actions[actionId].selected = allValidationsSelected;
        
        // تحديث حالة الوحدة الأم بناءً على حالة جميع الإجراءات
        const allActionsSelected = Object.values(updated[moduleId].actions).every(action => action.selected);
        updated[moduleId].selected = allActionsSelected;
      }
      
      onSelectionChange(updated);
      return updated;
    });
  };

  // تحديد كل الاختبارات
  const selectAll = (checked: boolean) => {
    setSelectedTests(prev => {
      const updated = { ...prev };
      
      modules.forEach(module => {
        updated[module.id].selected = checked;
        
        module.actions.forEach(action => {
          updated[module.id].actions[action.id].selected = checked;
          
          action.validations.forEach(validation => {
            updated[module.id].actions[action.id].validations[validation.id] = checked;
          });
        });
      });
      
      onSelectionChange(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">اختيار الاختبارات</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => selectAll(true)}
        >
          <Check className="h-4 w-4" />
          تحديد الكل
        </Button>
      </div>
      
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">اختيار</TableHead>
              <TableHead>الوحدة / الإجراء</TableHead>
              <TableHead className="text-center">تسجيل</TableHead>
              <TableHead className="text-center">عرض</TableHead>
              <TableHead className="text-center">تأكد من تسجيله</TableHead>
              <TableHead className="text-center">ظهور في لوحة التحكم</TableHead>
              <TableHead className="text-center">تعديل</TableHead>
              <TableHead className="text-center">حذف</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {modules.map(module => (
              <React.Fragment key={module.id}>
                <TableRow className="bg-muted/20">
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedTests[module.id]?.selected || false}
                      onCheckedChange={(checked) => toggleModule(module.id, checked === true)}
                    />
                  </TableCell>
                  <TableCell className="font-bold">
                    <div className="flex items-center">
                      <span>{module.name}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 mr-2">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{module.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell colSpan={6}></TableCell>
                </TableRow>
                
                {module.actions.map(action => (
                  <TableRow key={`${module.id}-${action.id}`}>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedTests[module.id]?.actions[action.id]?.selected || false}
                        onCheckedChange={(checked) => toggleAction(module.id, action.id, checked === true)}
                      />
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center">
                        <span>{action.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 mr-2">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{action.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    
                    {/* Rendering validation checkboxes for each action */}
                    {action.validations.map(validation => (
                      <TableCell key={`${module.id}-${action.id}-${validation.id}`} className="text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Checkbox
                                  checked={selectedTests[module.id]?.actions[action.id]?.validations[validation.id] || false}
                                  onCheckedChange={(checked) => toggleValidation(module.id, action.id, validation.id, checked === true)}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{validation.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TestSelectionTable;
