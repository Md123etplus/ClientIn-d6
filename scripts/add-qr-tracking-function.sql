-- Function to track QR code scans
CREATE OR REPLACE FUNCTION track_qr_scan(p_qr_code_id UUID, p_device_info JSONB)
RETURNS VOID AS $$
BEGIN
    INSERT INTO qr_code_scans (qr_code_id, device_info)
    VALUES (p_qr_code_id, p_device_info);

    UPDATE qr_codes
    SET scan_count = scan_count + 1,
        last_scanned_at = NOW()
    WHERE id = p_qr_code_id;
END;
$$ LANGUAGE plpgsql;

-- Example of how to call the function (for testing purposes)
-- SELECT track_qr_scan('your-qr-code-uuid', '{"ip_address": "192.168.1.1", "user_agent": "Mozilla/5.0"}');
