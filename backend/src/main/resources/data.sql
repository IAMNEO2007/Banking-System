INSERT INTO users (id, balance, name, email, phone, address, account_type, account_number) VALUES (1, 12450.45, 'Vikas Sharma', 'vikas.sharma@example.com', '+91 9876543210', '123, Palm Grove, Hiranandani Estate, Thane West', 'Savings Account', 'XXXX-XXXX-1234');

INSERT INTO transactions (id, user_id, type, to_from, amount, date_string, category) 
VALUES (1, 1, 'paid', 'Krishna General Store', '₹140', 'Today, 10:24 AM', 'Shopping');

INSERT INTO transactions (id, user_id, type, to_from, amount, date_string, category) 
VALUES (2, 1, 'received', 'Amit Sharma', '₹500', 'Yesterday, 8:15 PM', 'Transfer');

INSERT INTO transactions (id, user_id, type, to_from, amount, date_string, category) 
VALUES (3, 1, 'bill', 'MSEB - Thane West', '₹2,450', '14 Apr, 2026', 'Utility');

INSERT INTO transactions (id, user_id, type, to_from, amount, date_string, category) 
VALUES (4, 1, 'paid', 'Starbucks Thane', '₹450', '13 Apr, 2026', 'Food');

INSERT INTO transactions (id, user_id, type, to_from, amount, date_string, category) 
VALUES (5, 1, 'paid', 'Airtel Recharge', '₹299', '12 Apr, 2026', 'Mobile');

INSERT INTO transactions (id, user_id, type, to_from, amount, date_string, category) 
VALUES (6, 1, 'received', 'Refund: Amazon', '₹1,200', '11 Apr, 2026', 'Refund');
