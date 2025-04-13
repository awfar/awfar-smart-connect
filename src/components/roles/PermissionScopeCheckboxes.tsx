
import { Checkbox } from "@/components/ui/checkbox";
import { PermissionAction, PermissionScope } from "@/services/permissions/permissionTypes";

interface PermissionScopeCheckboxesProps {
  module: string;
  action: PermissionAction;
  availableScopes: PermissionScope[];
  isPermissionSelected: (module: string, action: PermissionAction, scope: PermissionScope) => boolean;
  togglePermission: (module: string, action: PermissionAction, scope: PermissionScope | null) => void;
  scopeLabels: Record<PermissionScope, string>;
}

const PermissionScopeCheckboxes = ({
  module,
  action,
  availableScopes,
  isPermissionSelected,
  togglePermission,
  scopeLabels
}: PermissionScopeCheckboxesProps) => {
  return (
    <>
      <td className="text-center">
        <Checkbox 
          checked={!isPermissionSelected(module, action, 'own') && 
                  !isPermissionSelected(module, action, 'team') &&
                  !isPermissionSelected(module, action, 'all')}
          onCheckedChange={() => togglePermission(module, action, null)}
        />
      </td>
      {(['own', 'team', 'all'] as PermissionScope[]).map(scope => {
        const isAvailable = availableScopes.includes(scope);
        return (
          <td key={`${module}_${action}_${scope}`} className="text-center">
            {isAvailable ? (
              <Checkbox 
                checked={isPermissionSelected(module, action, scope)}
                onCheckedChange={(checked) => togglePermission(module, action, checked ? scope : null)}
              />
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </td>
        );
      })}
    </>
  );
};

export default PermissionScopeCheckboxes;
