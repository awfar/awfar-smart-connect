
-- Function to count activities by action
CREATE OR REPLACE FUNCTION count_activities_by_action()
RETURNS TABLE (action text, count bigint) 
LANGUAGE SQL
AS $$
  SELECT action, COUNT(*) as count
  FROM activity_logs
  GROUP BY action
  ORDER BY count DESC;
$$;

-- Function to count activities by user
CREATE OR REPLACE FUNCTION count_activities_by_user()
RETURNS TABLE (user_id text, first_name text, last_name text, count bigint) 
LANGUAGE SQL
AS $$
  SELECT al.user_id, p.first_name, p.last_name, COUNT(*) as count
  FROM activity_logs al
  LEFT JOIN profiles p ON p.id = al.user_id::uuid
  GROUP BY al.user_id, p.first_name, p.last_name
  ORDER BY count DESC
  LIMIT 10;
$$;

-- Function to count activities by entity type
CREATE OR REPLACE FUNCTION count_activities_by_entity_type()
RETURNS TABLE (entity_type text, count bigint) 
LANGUAGE SQL
AS $$
  SELECT entity_type, COUNT(*) as count
  FROM activity_logs
  GROUP BY entity_type
  ORDER BY count DESC;
$$;
