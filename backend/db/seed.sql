-- Seed default service plans
INSERT INTO service_plans (service_type, cycle, name, description, base_price) VALUES
('maid', 'hourly', 'Hourly Cleaning', 'Pay-as-you-go home cleaning', 250),
('maid', 'monthly', 'Monthly Housekeeping', 'Daily housekeeping, billed monthly', 8000),
('maid', 'yearly', 'Annual Housekeeping', 'Daily housekeeping, billed yearly at a discount', 88000),
('babysitter', 'hourly', 'Hourly Babysitting', 'On-demand child care', 300),
('babysitter', 'monthly', 'Monthly Babysitting', 'Part-time daily babysitting, billed monthly', 12000),
('nanny', 'monthly', 'Live-out Nanny', 'Full-time daytime nanny, billed monthly', 18000),
('nanny', 'yearly', 'Annual Nanny Contract', 'Full-time nanny, billed yearly at a discount', 200000);

-- Seed an admin user (password: Admin@123, hash generated with bcrypt cost 10)
INSERT INTO users (full_name, email, phone, password_hash, role, city)
VALUES ('Platform Admin', 'admin@gmail.com', '9999999999',
'$2a$10$YoVbDE3AeUFSI9iyR75L2.2OLICdZjlmXFguiUzRC.C96JBp9kRr.', 'admin', 'Kolkata');
