-- Create the 'settings' table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    dark_mode_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the settings table
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policy for managers to view and update settings
CREATE POLICY "Managers can view settings."
ON public.settings FOR SELECT
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager'));

CREATE POLICY "Managers can update settings."
ON public.settings FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager'));

-- Optional: Insert default settings if the table is empty
INSERT INTO public.settings (company_name, contact_email, notifications_enabled, dark_mode_enabled)
VALUES ('ClientIn Inc.', 'contact@clientin.com', TRUE, FALSE)
ON CONFLICT DO NOTHING;

-- Function to update 'updated_at' column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update 'updated_at' on settings table
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
