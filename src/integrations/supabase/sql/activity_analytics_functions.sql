
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
RETURNS TABLE (user_id text, count bigint) 
LANGUAGE SQL
AS $$
  SELECT user_id, COUNT(*) as count
  FROM activity_logs
  GROUP BY user_id
  ORDER BY count DESC;
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
