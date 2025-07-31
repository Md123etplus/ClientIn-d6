-- Create function to increment QR scan count
CREATE OR REPLACE FUNCTION increment_qr_scans(emp_id VARCHAR)
RETURNS void AS $$
BEGIN
  UPDATE qr_codes 
  SET scans_count = scans_count + 1,
      updated_at = NOW()
  WHERE employee_id = emp_id;
END;
$$ LANGUAGE plpgsql;
