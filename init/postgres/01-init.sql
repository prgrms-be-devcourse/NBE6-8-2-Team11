-- PetMatching Database Initialization Script for PostgreSQL

--  Create database if not exists
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'petmatching') THEN
       CREATE DATABASE petmatching
       WITH
         ENCODING 'UTF8'
         LC_COLLATE='en_US.UTF-8'
         LC_CTYPE='en_US.UTF-8'
         TEMPLATE=template0;
END IF;
END
$$;

-- Connect to the database
\c petmatching;

-- Create regular DB user if not exists
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'petmatching_user') THEN
CREATE ROLE petmatching_user WITH LOGIN PASSWORD 'secure_user_password_change_me';
END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE petmatching TO petmatching_user;

-- Create health_check table
CREATE TABLE IF NOT EXISTS health_check (
                                            id SERIAL PRIMARY KEY,
                                            status VARCHAR(10) DEFAULT 'OK',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO health_check (status) VALUES ('OK');


-- Insert admin account if not exists 비번 : 1234
INSERT INTO MEMBER (MEMBER_EMAIL, MEMBER_NAME, MEMBER_PASSWORD, MEMBER_ROLE, MEMBER_PHONE)
VALUES ('admin@example.com', '관리자', '$2a$12$W9aCR.tjkvxf1ZyGNpFw2uViuoF7GyvdjC8uU6PNmgVRo4wEA8Nru', 'ADMIN', '010-0000-0000')
    ON CONFLICT (MEMBER_EMAIL) DO NOTHING;

--  Print success message
SELECT 'PetMatching database initialized successfully with admin account!' AS message;
