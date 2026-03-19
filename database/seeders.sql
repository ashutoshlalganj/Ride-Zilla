-- Seed data for Ride Zilla
-- Insert sample data for testing

-- Sample Users
INSERT INTO users (id, full_name, email, phone, password_hash, is_verified, email_verified_at, phone_verified_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Raj Kumar', 'raj@example.com', '+919876543210', '$2a$10$...hashed_password...', TRUE, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Priya Singh', 'priya@example.com', '+919876543211', '$2a$10$...hashed_password...', TRUE, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Amit Patel', 'amit@example.com', '+919876543212', '$2a$10$...hashed_password...', TRUE, NOW(), NOW());

-- Sample Captains
INSERT INTO captains (id, full_name, email, phone, password_hash, driving_license_number, license_expiry_date, is_verified, is_approved) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Mohit Singh', 'mohit@example.com', '+919876543220', '$2a$10$...hashed_password...', 'DL123456', '2026-12-31', TRUE, TRUE),
('650e8400-e29b-41d4-a716-446655440002', 'Vikram Kumar', 'vikram@example.com', '+919876543221', '$2a$10$...hashed_password...', 'DL789012', '2025-12-31', TRUE, TRUE),
('650e8400-e29b-41d4-a716-446655440003', 'Arjun Verma', 'arjun@example.com', '+919876543222', '$2a$10$...hashed_password...', 'DL345678', '2026-06-30', TRUE, TRUE);

-- Sample Vehicles
INSERT INTO vehicles (id, captain_id, vehicle_type, vehicle_number, vehicle_model, seating_capacity) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'bike', 'DL01AB1234', 'Honda CB 200', 1),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'auto', 'DL01CD5678', 'Bajaj Auto', 3),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', 'car', 'DL02EF9012', 'Hyundai i20', 4),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440003', 'sedan', 'DL03GH3456', 'Maruti Swift Dzire', 4);

-- Sample Coupons
INSERT INTO coupons (id, code, discount_type, discount_value, max_discount_amount, min_ride_amount, is_active, valid_from, valid_until) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'WELCOME50', 'percentage', 50.00, 200.00, 100.00, TRUE, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days'),
('850e8400-e29b-41d4-a716-446655440002', 'RIDE100', 'fixed', 100.00, NULL, 300.00, TRUE, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days'),
('850e8400-e29b-41d4-a716-446655440003', 'NEWUSER30', 'percentage', 30.00, 150.00, 50.00, TRUE, CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days');

-- Sample Saved Addresses
INSERT INTO saved_addresses (id, user_id, label, address, location, is_default) VALUES
('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'home', 'Delhi, India', ST_GeographyFromText('SRID=4326;POINT(28.6139 77.2090)'), TRUE),
('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'work', 'Bangalore, India', ST_GeographyFromText('SRID=4326;POINT(12.9716 77.5946)'), FALSE);

-- Sample Support Tickets
INSERT INTO support_tickets (id, user_id, subject, description, category) VALUES
('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'High fare issue', 'Fare was higher than expected', 'payment'),
('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Driver behavior', 'Driver was driving recklessly', 'driver_behavior'),
('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Lost item', 'Lost wallet in the vehicle', 'other');

-- Sample Admins
INSERT INTO admins (id, full_name, email, password_hash, role) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'Admin Panel', 'admin@ridezilla.com', '$2a$10$...hashed_password...', 'super_admin'),
('b50e8400-e29b-41d4-a716-446655440002', 'Finance Admin', 'finance@ridezilla.com', '$2a$10$...hashed_password...', 'finance_admin');
