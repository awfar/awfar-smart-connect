
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PermissionAction, PermissionScope } from "@/services/permissions/permissionTypes";
import ModulePermissionsTable from "./ModulePermissionsTable";

interface ModuleAccordionItemProps {
  module: string;
  moduleLabel: string;
  getAvailableScopesForAction: (module: string, action: PermissionAction) => PermissionScope[];
  isPermissionSelected: (module: string, action: PermissionAction, scope: PermissionScope) => boolean;
  togglePermission: (module: string, action: PermissionAction, scope: PermissionScope | null) => void;
  actionLabels: Record<PermissionAction, string>;
  scopeLabels: Record<PermissionScope, string>;
}

const ModuleAccordionItem = ({
  module,
  moduleLabel,
  getAvailableScopesForAction,
  isPermissionSelected,
  togglePermission,
  actionLabels,
  scopeLabels
}: ModuleAccordionItemProps) => {
  return (
    <AccordionItem key={module} value={module}>
      <AccordionTrigger className="text-lg font-medium hover:no-underline">
        {moduleLabel}
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-2">
          <ModulePermissionsTable
            module={module}
            getAvailableScopesForAction={getAvailableScopesForAction}
            isPermissionSelected={isPermissionSelected}
            togglePermission={togglePermission}
            actionLabels={actionLabels}
            scopeLabels={scopeLabels}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ModuleAccordionItem;
