
import { PermissionAction, PermissionScope } from "@/services/permissions/permissionTypes";
import PermissionScopeCheckboxes from "./PermissionScopeCheckboxes";

interface PermissionActionRowProps {
  module: string;
  action: PermissionAction;
  actionLabel: string;
  getAvailableScopesForAction: (module: string, action: PermissionAction) => PermissionScope[];
  isPermissionSelected: (module: string, action: PermissionAction, scope: PermissionScope) => boolean;
  togglePermission: (module: string, action: PermissionAction, scope: PermissionScope | null) => void;
  scopeLabels: Record<PermissionScope, string>;
}

const PermissionActionRow = ({
  module,
  action,
  actionLabel,
  getAvailableScopesForAction,
  isPermissionSelected,
  togglePermission,
  scopeLabels
}: PermissionActionRowProps) => {
  const availableScopes = getAvailableScopesForAction(module, action);
  
  if (availableScopes.length === 0) return null;
  
  return (
    <tr key={`${module}_${action}`} className="border-b">
      <td className="py-3 px-3 font-medium">
        {actionLabel}
      </td>
      <PermissionScopeCheckboxes
        module={module}
        action={action}
        availableScopes={availableScopes}
        isPermissionSelected={isPermissionSelected}
        togglePermission={togglePermission}
        scopeLabels={scopeLabels}
      />
    </tr>
  );
};

export default PermissionActionRow;
