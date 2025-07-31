-- Users table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('manager', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Employee-User association
ALTER TABLE employees ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Updated RLS policies with role checking
DROP POLICY IF EXISTS "Employees access by owner" ON employees;
DROP POLICY IF EXISTS "Manager access to all employees" ON employees;

CREATE POLICY "Employees access by owner" ON employees FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Manager access to all employees"
ON employees FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'manager'
  )
);

-- Allow managers to insert/update employees
CREATE POLICY "Manager can manage employees" ON employees FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'manager'
  )
);

-- Function to get user employees
CREATE OR REPLACE FUNCTION get_user_employees()
RETURNS SETOF employees AS $$
  SELECT * FROM employees 
  WHERE user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'manager');
$$ LANGUAGE SQL SECURITY DEFINER;

-- Insert sample manager user (you'll need to create this user in Supabase Auth first)
-- INSERT INTO users (id, email, role) VALUES 
-- ('your-auth-user-id', 'manager@clientin.com', 'manager');
