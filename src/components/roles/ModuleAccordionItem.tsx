
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PermissionLevel, PermissionScope } from "@/services/permissions/permissionTypes";
import ObjectPermissionsTable from "./ModulePermissionsTable";

interface ObjectAccordionItemProps {
  object: string;
  objectLabel: string;
  getAvailableScopesForLevel: (object: string, level: PermissionLevel) => PermissionScope[];
  isPermissionSelected: (object: string, level: PermissionLevel, scope: PermissionScope) => boolean;
  togglePermission: (object: string, level: PermissionLevel, scope: PermissionScope | null) => void;
  levelLabels: Record<PermissionLevel, string>;
  scopeLabels: Record<PermissionScope, string>;
}

const ObjectAccordionItem = ({
  object,
  objectLabel,
  getAvailableScopesForLevel,
  isPermissionSelected,
  togglePermission,
  levelLabels,
  scopeLabels
}: ObjectAccordionItemProps) => {
  return (
    <AccordionItem key={object} value={object}>
      <AccordionTrigger className="text-lg font-medium hover:no-underline">
        {objectLabel}
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-2">
          <ObjectPermissionsTable
            object={object}
            getAvailableScopesForLevel={getAvailableScopesForLevel}
            isPermissionSelected={isPermissionSelected}
            togglePermission={togglePermission}
            levelLabels={levelLabels}
            scopeLabels={scopeLabels}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ObjectAccordionItem;
