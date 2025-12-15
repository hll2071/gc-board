-- 1. Create Users (Password: password123 encoded via BCrypt)
-- You may need to adjust the password hash if your encoder is different, but for demo:
-- $2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRkgVduVhz.yYUfliNpYR2h0S9e corresponds to 'password123'
INSERT INTO users (email, password, nickname, created_at, updated_at) VALUES 
('demo_user@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRkgVduVhz.yYUfliNpYR2h0S9e', 'DemoUser', NOW(), NOW()),
('browser_user@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRkgVduVhz.yYUfliNpYR2h0S9e', 'BrowserUser', NOW(), NOW());

-- 2. Create Board
INSERT INTO board (name, created_at, updated_at) VALUES ('Free Board', NOW(), NOW());

-- 3. Create Dummy Articles
INSERT INTO article (title, content, image_url, board_id, writer_id, created_at, updated_at) VALUES 
('Welcome to GC Gallery', 'This is the first post.', 'https://picsum.photos/id/1/400/300', 1, 1, NOW(), NOW()),
('Infinite Scroll Demo #1', 'Demo content 1', 'https://picsum.photos/id/10/400/300', 1, 2, NOW(), NOW()),
('Infinite Scroll Demo #2', 'Demo content 2', 'https://picsum.photos/id/11/400/300', 1, 1, NOW(), NOW()),
('Infinite Scroll Demo #3', 'Demo content 3', 'https://picsum.photos/id/12/400/300', 1, 2, NOW(), NOW()),
('Infinite Scroll Demo #4', 'Demo content 4', 'https://picsum.photos/id/13/400/300', 1, 1, NOW(), NOW()),
('Infinite Scroll Demo #5', 'Demo content 5', 'https://picsum.photos/id/14/400/300', 1, 2, NOW(), NOW()),
('Infinite Scroll Demo #6', 'Demo content 6', 'https://picsum.photos/id/15/400/300', 1, 1, NOW(), NOW()),
('Infinite Scroll Demo #7', 'Demo content 7', 'https://picsum.photos/id/16/400/300', 1, 2, NOW(), NOW()),
('Infinite Scroll Demo #8', 'Demo content 8', 'https://picsum.photos/id/17/400/300', 1, 1, NOW(), NOW()),
('Infinite Scroll Demo #9', 'Demo content 9', 'https://picsum.photos/id/18/400/300', 1, 2, NOW(), NOW()),
('Infinite Scroll Demo #10', 'Demo content 10', 'https://picsum.photos/id/19/400/300', 1, 1, NOW(), NOW()),
('Infinite Scroll Demo #11', 'Demo content 11', 'https://picsum.photos/id/20/400/300', 1, 2, NOW(), NOW()),
('Infinite Scroll Demo #12', 'Demo content 12', 'https://picsum.photos/id/21/400/300', 1, 1, NOW(), NOW()),
('Infinite Scroll Demo #13', 'Demo content 13', 'https://picsum.photos/id/22/400/300', 1, 2, NOW(), NOW()),
('Infinite Scroll Demo #14', 'Demo content 14', 'https://picsum.photos/id/23/400/300', 1, 1, NOW(), NOW()),
('Infinite Scroll Demo #15', 'Demo content 15', 'https://picsum.photos/id/24/400/300', 1, 2, NOW(), NOW()),
('Infinite Scroll Demo #16', 'Demo content 16', 'https://picsum.photos/id/25/400/300', 1, 1, NOW(), NOW()),
('Infinite Scroll Demo #17', 'Demo content 17', 'https://picsum.photos/id/26/400/300', 1, 2, NOW(), NOW()),
('Infinite Scroll Demo #18', 'Demo content 18', 'https://picsum.photos/id/27/400/300', 1, 1, NOW(), NOW()),
('Infinite Scroll Demo #19', 'Demo content 19', 'https://picsum.photos/id/28/400/300', 1, 1, NOW(), NOW()),
('Infinite Scroll Demo #20', 'Infinite scroll works!', 'https://picsum.photos/id/29/400/300', 1, 2, NOW(), NOW());
