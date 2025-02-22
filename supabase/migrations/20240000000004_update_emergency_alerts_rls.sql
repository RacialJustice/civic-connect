-- Drop the existing admin policy
DROP POLICY IF EXISTS "Admins can view all emergency alerts" ON public.emergency_alerts;
DROP POLICY IF EXISTS "Admins can update all emergency alerts" ON public.emergency_alerts;
DROP POLICY IF EXISTS "Admins can delete all emergency alerts" ON public.emergency_alerts;

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can create emergency alerts" ON public.emergency_alerts;
DROP POLICY IF EXISTS "Users can view their own emergency alerts" ON public.emergency_alerts;

-- Create hierarchical admin policies with proper type casting
CREATE POLICY "Super admins can access all emergency alerts"
  ON public.emergency_alerts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.admin_level = 'super_admin'::auth.admin_level
    )
  );

CREATE POLICY "County admins can access emergency alerts within their county"
  ON public.emergency_alerts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN public.wards w ON w.name::text = emergency_alerts.ward::text
      JOIN public.constituencies c ON c.id = w.constituency_id
      JOIN public.counties co ON co.id = c.county_id
      WHERE u.id = auth.uid()
      AND u.admin_level = 'county_admin'::auth.admin_level
      AND u.county_id = co.id
    )
  );

CREATE POLICY "Constituency admins can access emergency alerts within their constituency"
  ON public.emergency_alerts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN public.wards w ON w.name::text = emergency_alerts.ward::text
      WHERE u.id = auth.uid()
      AND u.admin_level = 'constituency_admin'::auth.admin_level
      AND u.constituency_id = w.constituency_id
    )
  );

CREATE POLICY "Ward admins can access emergency alerts within their ward"
  ON public.emergency_alerts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      JOIN public.wards w ON w.name::text = emergency_alerts.ward::text
      WHERE u.id = auth.uid()
      AND u.admin_level = 'ward_admin'::auth.admin_level
      AND u.ward_id = w.id
    )
  );