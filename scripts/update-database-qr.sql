-- Add QR code support to employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS qr_code_id VARCHAR(255) UNIQUE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS qr_code_url TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS qr_code_style JSONB DEFAULT '{"color": "#7c3aed", "background": "#ffffff", "logo": true}';
ALTER TABLE employees ADD COLUMN IF NOT EXISTS qr_code_generated_at TIMESTAMPTZ;

-- Create QR codes table for tracking
CREATE TABLE IF NOT EXISTS qr_codes (
  id VARCHAR(255) PRIMARY KEY,
  employee_id VARCHAR(255) REFERENCES employees(id),
  url TEXT NOT NULL,
  style JSONB DEFAULT '{"color": "#7c3aed", "background": "#ffffff", "logo": true}',
  scans_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update existing employees with QR codes
UPDATE employees SET 
  qr_code_id = CONCAT('QR_', id),
  qr_code_url = CONCAT('https://clientin.app/feedback?id=', id, '&source=qr'),
  qr_code_generated_at = NOW()
WHERE qr_code_id IS NULL;

-- Insert QR code records
INSERT INTO qr_codes (id, employee_id, url, scans_count)
SELECT 
  CONCAT('QR_', id),
  id,
  CONCAT('https://clientin.app/feedback?id=', id, '&source=qr'),
  0
FROM employees
WHERE id NOT IN (SELECT COALESCE(employee_id, '') FROM qr_codes);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_qr_codes_employee_id ON qr_codes(employee_id);
