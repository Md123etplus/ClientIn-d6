-- Create the feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the employees table
CREATE TABLE IF NOT EXISTS employees (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  department VARCHAR(255),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample employees
INSERT INTO employees (id, name, position, department, photo_url) VALUES
('EMP001', 'Mohammed Benali', 'Serveur', 'Restaurant', '/placeholder.svg?height=100&width=100'),
('EMP002', 'Sarah Khalil', 'Caissière', 'Vente', '/placeholder.svg?height=100&width=100'),
('EMP003', 'Meriem Alami', 'Conseillère', 'Service Client', '/placeholder.svg?height=100&width=100');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedbacks_employee_id ON feedbacks(employee_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at);
