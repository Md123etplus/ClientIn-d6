-- Add qr_code_id, qr_code_url, qr_code_style, qr_scans to employees table
ALTER TABLE public.employees
ADD COLUMN qr_code_id UUID UNIQUE REFERENCES public.qr_codes(id) ON DELETE SET NULL,
ADD COLUMN qr_code_url TEXT,
ADD COLUMN qr_code_style JSONB DEFAULT '{"color": "#000000", "background": "#ffffff", "logo": true}',
ADD COLUMN qr_scans INTEGER DEFAULT 0;

-- Update existing employee records to link to qr_codes if they exist
-- This is a placeholder. In a real scenario, you'd migrate data carefully.
-- For now, we'll assume new QR codes will be generated and linked.

-- Create a function to update qr_scans in employees table when qr_code_scans is inserted
CREATE OR REPLACE FUNCTION update_employee_qr_scans()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.employees
    SET qr_scans = (SELECT COUNT(*) FROM public.qr_code_scans WHERE qr_code_id = NEW.qr_code_id)
    WHERE qr_code_id = NEW.qr_code_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function after an insert on qr_code_scans
CREATE TRIGGER trg_update_employee_qr_scans
AFTER INSERT ON public.qr_code_scans
FOR EACH ROW EXECUTE FUNCTION update_employee_qr_scans();

-- Add a policy to allow public insert on qr_code_scans
CREATE POLICY "Allow public insert for qr_code_scans"
ON public.qr_code_scans FOR INSERT
WITH CHECK (TRUE);
