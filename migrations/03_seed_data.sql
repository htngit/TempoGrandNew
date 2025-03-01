-- Migration file for seeding initial data for Xalesin CRM

-- Insert a demo tenant
INSERT INTO tenants (id, name, industry, website, address, phone)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Xalesin Demo Company',
  'Technology',
  'https://xalesin-demo.com',
  '123 Demo Street, Tech City, TC 12345',
  '+1 (555) 123-4567'
);

-- Insert demo users
-- Note: In a real application, passwords would be properly hashed
INSERT INTO users (id, email, password, first_name, last_name, role, tenant_id, avatar_url, job_title)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'admin@xalesin-demo.com', 'password123', 'Admin', 'User', 'admin', '00000000-0000-0000-0000-000000000001', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', 'Administrator'),
  ('00000000-0000-0000-0000-000000000003', 'staff@xalesin-demo.com', 'password123', 'Staff', 'User', 'staff', '00000000-0000-0000-0000-000000000001', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff', 'Sales Representative'),
  ('00000000-0000-0000-0000-000000000004', 'viewer@xalesin-demo.com', 'password123', 'Viewer', 'User', 'viewer', '00000000-0000-0000-0000-000000000001', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viewer', 'Analyst');

-- Insert demo contacts
INSERT INTO contacts (first_name, last_name, email, phone, company, job_title, tenant_id, created_by)
VALUES 
  ('John', 'Smith', 'john@company.com', '+1 (555) 234-5678', 'Tech Corp', 'CEO', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('Sarah', 'Johnson', 'sarah@startup.io', '+1 (555) 345-6789', 'Startup.io', 'Marketing Director', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
  ('Michael', 'Brown', 'michael@enterprise.com', '+1 (555) 456-7890', 'Enterprise Ltd', 'CTO', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003');

-- Insert demo leads
INSERT INTO leads (name, email, phone, company, status, source, value, tenant_id, assigned_to, created_by)
VALUES 
  ('Alex Wilson', 'alex@prospect.com', '+1 (555) 567-8901', 'Prospect Inc', 'new', 'website', 5000.00, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002'),
  ('Emily Davis', 'emily@newclient.com', '+1 (555) 678-9012', 'New Client LLC', 'contacted', 'referral', 10000.00, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003'),
  ('Robert Johnson', 'robert@bigcorp.com', '+1 (555) 789-0123', 'Big Corp', 'qualified', 'conference', 25000.00, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002');

-- Insert demo activities
INSERT INTO activities (type, description, related_to, related_type, scheduled_at, completed_at, tenant_id, created_by)
VALUES 
  ('call', 'Initial discovery call', (SELECT id FROM leads WHERE email = 'alex@prospect.com'), 'lead', NOW() + INTERVAL '2 days', NULL, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
  ('email', 'Sent proposal', (SELECT id FROM leads WHERE email = 'emily@newclient.com'), 'lead', NULL, NOW() - INTERVAL '1 day', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003'),
  ('meeting', 'Product demo', (SELECT id FROM leads WHERE email = 'robert@bigcorp.com'), 'lead', NOW() + INTERVAL '5 days', NULL, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('note', 'Discussed partnership opportunities', (SELECT id FROM contacts WHERE email = 'john@company.com'), 'contact', NULL, NOW() - INTERVAL '3 days', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002');

-- Insert tenant settings
INSERT INTO settings (tenant_id, theme, language, timezone, date_format)
VALUES ('00000000-0000-0000-0000-000000000001', 'light', 'en', 'America/New_York', 'MM/DD/YYYY');
