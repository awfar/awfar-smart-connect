
import { PermissionLevel, PermissionScope } from "@/services/permissions/permissionTypes";
import PermissionScopeCheckboxes from "./PermissionScopeCheckboxes";

interface PermissionActionRowProps {
  object: string;
  level: PermissionLevel;
  levelLabel: string;
  getAvailableScopesForLevel: (object: string, level: PermissionLevel) => PermissionScope[];
  isPermissionSelected: (object: string, level: PermissionLevel, scope: PermissionScope) => boolean;
  togglePermission: (object: string, level: PermissionLevel, scope: PermissionScope | null) => void;
  scopeLabels: Record<PermissionScope, string>;
}

const PermissionActionRow = ({
  object,
  level,
  levelLabel,
  getAvailableScopesForLevel,
  isPermissionSelected,
  togglePermission,
  scopeLabels
}: PermissionActionRowProps) => {
  const availableScopes = getAvailableScopesForLevel(object, level);
  
  if (availableScopes.length === 0) return null;
  
  return (
    <tr key={`${object}_${level}`} className="border-b">
      <td className="py-3 px-3 font-medium">
        {levelLabel}
      </td>
      <PermissionScopeCheckboxes
        object={object}
        level={level}
        availableScopes={availableScopes}
        isPermissionSelected={isPermissionSelected}
        togglePermission={togglePermission}
        scopeLabels={scopeLabels}
      />
    </tr>
  );
};

export default PermissionActionRow;
