
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PermissionLevel, PermissionScope } from "@/services/permissions/permissionTypes";

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
    <AccordionItem value={object} className="border rounded-md mb-2">
      <AccordionTrigger className="px-4 hover:bg-accent hover:text-accent-foreground">
        <span className="text-sm font-medium">{objectLabel}</span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>مستوى الصلاحية</TableHead>
              {['own', 'team', 'all', 'unassigned'].map((scope) => (
                <TableHead key={scope} className="text-center">
                  {scopeLabels[scope as PermissionScope]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(levelLabels).map(([level, levelLabel]) => {
              const availableScopes = getAvailableScopesForLevel(object, level as PermissionLevel);
              
              return (
                <TableRow key={level}>
                  <TableCell className="font-medium">{levelLabel}</TableCell>
                  {['own', 'team', 'all', 'unassigned'].map((scope) => {
                    const scopeType = scope as PermissionScope;
                    const isAvailable = availableScopes.includes(scopeType);
                    
                    return (
                      <TableCell key={scope} className="text-center">
                        {isAvailable ? (
                          <Checkbox
                            checked={isPermissionSelected(object, level as PermissionLevel, scopeType)}
                            onCheckedChange={(checked) => 
                              togglePermission(object, level as PermissionLevel, checked ? scopeType : null)
                            }
                          />
                        ) : (
                          <span className="text-gray-300">–</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ObjectAccordionItem;
