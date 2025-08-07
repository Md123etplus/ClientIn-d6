-- Create the 'employees' table
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cin_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT,
    photo_url TEXT,
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'feedbacks' table
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating &lt;= 5),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT TRUE,
    device_info JSONB, -- Stores device information (e.g., user agent, IP, etc.)
    source TEXT, -- e.g., 'nfc', 'qr', 'direct'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'qr_codes' table (for tracking QR code specific data)
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID UNIQUE REFERENCES public.employees(id) ON DELETE CASCADE,
    qr_code_url TEXT NOT NULL, -- The URL the QR code points to
    qr_code_style JSONB, -- Stores customization options like color, background, logo preference
    scan_count INTEGER DEFAULT 0,
    last_scanned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the 'qr_code_scans' table (for detailed scan logs)
CREATE TABLE IF NOT EXISTS public.qr_code_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id UUID REFERENCES public.qr_codes(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    device_info JSONB -- Detailed device info for each scan
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_code_scans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'employees' table
-- Managers can view all employees
CREATE POLICY "Managers can view all employees."
ON public.employees FOR SELECT
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager'));

-- Managers can insert, update, and delete employees
CREATE POLICY "Managers can manage employees."
ON public.employees FOR ALL
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager'));

-- RLS Policies for 'feedbacks' table
-- Anyone can insert feedback (public access for feedback collection)
CREATE POLICY "Anyone can insert feedback."
ON public.feedbacks FOR INSERT
WITH CHECK (TRUE);

-- Managers can view all feedbacks
CREATE POLICY "Managers can view all feedbacks."
ON public.feedbacks FOR SELECT
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager'));

-- RLS Policies for 'qr_codes' table
-- Managers can view all QR codes
CREATE POLICY "Managers can view all QR codes."
ON public.qr_codes FOR SELECT
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager'));

-- Managers can insert, update, and delete QR codes
CREATE POLICY "Managers can manage QR codes."
ON public.qr_codes FOR ALL
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager'));

-- RLS Policies for 'qr_code_scans' table
-- Anyone can insert QR code scans (public access for tracking)
CREATE POLICY "Anyone can insert QR code scans."
ON public.qr_code_scans FOR INSERT
WITH CHECK (TRUE);

-- Managers can view all QR code scans
CREATE POLICY "Managers can view all QR code scans."
ON public.qr_code_scans FOR SELECT
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager'));
