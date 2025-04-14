
-- Create a table for storing system test results
CREATE TABLE IF NOT EXISTS public.system_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  status TEXT NOT NULL,
  execution_time NUMERIC NOT NULL,
  error_message TEXT,
  success_flag BOOLEAN NOT NULL DEFAULT false,
  stack_trace TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Add RLS policies to the system_test_results table
ALTER TABLE public.system_test_results ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert test results" 
ON public.system_test_results FOR INSERT TO authenticated USING (true);

-- Create a policy to allow users to select their own test results or all results if they are an admin
CREATE POLICY "Allow users to select test results" 
ON public.system_test_results FOR SELECT USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Create an index on created_at for better query performance
CREATE INDEX system_test_results_created_at_idx ON public.system_test_results(created_at DESC);

-- Create an index on module_name for filtering by module
CREATE INDEX system_test_results_module_name_idx ON public.system_test_results(module_name);

-- Create an index on success_flag for filtering by success/failure
CREATE INDEX system_test_results_success_flag_idx ON public.system_test_results(success_flag);
