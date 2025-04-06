
CREATE OR REPLACE FUNCTION public.get_function_exists(function_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  func_exists boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 
    FROM pg_proc 
    WHERE proname = function_name
  ) INTO func_exists;
  
  RETURN func_exists;
END;
$$;
