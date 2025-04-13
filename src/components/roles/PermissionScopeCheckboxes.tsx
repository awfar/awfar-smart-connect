
import { Checkbox } from "@/components/ui/checkbox";
import { PermissionLevel, PermissionScope } from "@/services/permissions/permissionTypes";

interface PermissionScopeCheckboxesProps {
  object: string;
  level: PermissionLevel;
  availableScopes: PermissionScope[];
  isPermissionSelected: (object: string, level: PermissionLevel, scope: PermissionScope) => boolean;
  togglePermission: (object: string, level: PermissionLevel, scope: PermissionScope | null) => void;
  scopeLabels: Record<PermissionScope, string>;
}

const PermissionScopeCheckboxes = ({
  object,
  level,
  availableScopes,
  isPermissionSelected,
  togglePermission,
  scopeLabels
}: PermissionScopeCheckboxesProps) => {
  return (
    <>
      <td className="text-center">
        <Checkbox 
          checked={!isPermissionSelected(object, level, 'own') && 
                  !isPermissionSelected(object, level, 'team') &&
                  !isPermissionSelected(object, level, 'all') &&
                  !isPermissionSelected(object, level, 'unassigned')}
          onCheckedChange={() => togglePermission(object, level, null)}
        />
      </td>
      {(['own', 'team', 'all', 'unassigned'] as PermissionScope[]).map(scope => {
        const isAvailable = availableScopes.includes(scope);
        return (
          <td key={`${object}_${level}_${scope}`} className="text-center">
            {isAvailable ? (
              <Checkbox 
                checked={isPermissionSelected(object, level, scope)}
                onCheckedChange={(checked) => togglePermission(object, level, checked ? scope : null)}
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
