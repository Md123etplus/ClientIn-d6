-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create employees table with new structure
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cin_number VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  photo_url TEXT,
  hire_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_employees_cin ON employees(cin_number);

-- Create feedbacks table with new structure
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  device_info JSONB, -- Stocke type device/navigateur
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_feedback CHECK (
    comment IS NULL OR 
    (LENGTH(TRIM(comment)) > 0 AND LENGTH(comment) <= 500)
  )
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_feedbacks_employee ON feedbacks(employee_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_rating ON feedbacks(rating);

-- Create pending sync table for offline functionality
CREATE TABLE IF NOT EXISTS pending_sync (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payload JSONB NOT NULL, -- Stocke le feedback complet
  retry_count INTEGER DEFAULT 0,
  last_attempt TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Met à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_employees_modtime
BEFORE UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Autorise l'accès public sécurisé
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Policies pour feedbacks
CREATE POLICY "Lecture publique des feedbacks" ON feedbacks FOR SELECT USING (true);
CREATE POLICY "Insertion feedbacks anonymes" ON feedbacks FOR INSERT WITH CHECK (is_anonymous = true);

-- Policies pour employees
CREATE POLICY "Lecture publique employés" ON employees FOR SELECT USING (true);

-- Vue pour le dashboard manager
CREATE OR REPLACE VIEW employee_stats AS
SELECT 
  e.id,
  e.full_name,
  e.position,
  e.department,
  e.cin_number,
  COUNT(f.id) AS feedback_count,
  AVG(f.rating) AS avg_rating,
  MAX(f.created_at) AS last_feedback
FROM employees e
LEFT JOIN feedbacks f ON e.id = f.employee_id
GROUP BY e.id;

-- Insert sample employees with CIN numbers
INSERT INTO employees (cin_number, full_name, position, department, photo_url, hire_date) VALUES
('AB123456', 'Mohammed Benali', 'Serveur', 'Restaurant', '/placeholder.svg?height=100&width=100', '2023-01-15'),
('CD789012', 'Sarah Khalil', 'Caissière', 'Vente', '/placeholder.svg?height=100&width=100', '2023-02-20'),
('EF345678', 'Meriem Alami', 'Conseillère', 'Service Client', '/placeholder.svg?height=100&width=100', '2023-03-10'),
('GH901234', 'Ahmed Tazi', 'Chef de Cuisine', 'Restaurant', '/placeholder.svg?height=100&width=100', '2022-11-05'),
('IJ567890', 'Fatima Zahra', 'Responsable RH', 'Administration', '/placeholder.svg?height=100&width=100', '2022-08-12')
ON CONFLICT (cin_number) DO NOTHING;
