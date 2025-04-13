
import { PermissionLevel, PermissionScope } from "@/services/permissions/permissionTypes";
import PermissionActionRow from "./PermissionActionRow";

interface ObjectPermissionsTableProps {
  object: string;
  getAvailableScopesForLevel: (object: string, level: PermissionLevel) => PermissionScope[];
  isPermissionSelected: (object: string, level: PermissionLevel, scope: PermissionScope) => boolean;
  togglePermission: (object: string, level: PermissionLevel, scope: PermissionScope | null) => void;
  levelLabels: Record<PermissionLevel, string>;
  scopeLabels: Record<PermissionScope, string>;
}

const ObjectPermissionsTable = ({
  object,
  getAvailableScopesForLevel,
  isPermissionSelected,
  togglePermission,
  levelLabels,
  scopeLabels
}: ObjectPermissionsTableProps) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted">
        <tr>
          <th className="text-right py-2 px-3">الصلاحية</th>
          <th className="text-center py-2 px-3">لا صلاحية</th>
          {['own', 'team', 'all', 'unassigned'].map(scope => (
            <th key={scope} className="text-center py-2 px-3">
              {scopeLabels[scope as PermissionScope]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(['read-only', 'read-edit', 'full-access'] as PermissionLevel[]).map(level => (
          <PermissionActionRow 
            key={`${object}_${level}`}
            object={object}
            level={level}
            levelLabel={levelLabels[level]}
            getAvailableScopesForLevel={getAvailableScopesForLevel}
            isPermissionSelected={isPermissionSelected}
            togglePermission={togglePermission}
            scopeLabels={scopeLabels}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ObjectPermissionsTable;
