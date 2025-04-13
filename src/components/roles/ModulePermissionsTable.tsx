
import { PermissionAction, PermissionScope } from "@/services/permissions/permissionTypes";
import PermissionActionRow from "./PermissionActionRow";

interface ModulePermissionsTableProps {
  module: string;
  getAvailableScopesForAction: (module: string, action: PermissionAction) => PermissionScope[];
  isPermissionSelected: (module: string, action: PermissionAction, scope: PermissionScope) => boolean;
  togglePermission: (module: string, action: PermissionAction, scope: PermissionScope | null) => void;
  actionLabels: Record<PermissionAction, string>;
  scopeLabels: Record<PermissionScope, string>;
}

const ModulePermissionsTable = ({
  module,
  getAvailableScopesForAction,
  isPermissionSelected,
  togglePermission,
  actionLabels,
  scopeLabels
}: ModulePermissionsTableProps) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted">
        <tr>
          <th className="text-right py-2 px-3">الصلاحية</th>
          <th className="text-center py-2 px-3">لا صلاحية</th>
          {['own', 'team', 'all'].map(scope => (
            <th key={scope} className="text-center py-2 px-3">
              {scopeLabels[scope as PermissionScope]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(['create', 'read', 'update', 'delete'] as PermissionAction[]).map(action => (
          <PermissionActionRow 
            key={`${module}_${action}`}
            module={module}
            action={action}
            actionLabel={actionLabels[action]}
            getAvailableScopesForAction={getAvailableScopesForAction}
            isPermissionSelected={isPermissionSelected}
            togglePermission={togglePermission}
            scopeLabels={scopeLabels}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ModulePermissionsTable;
