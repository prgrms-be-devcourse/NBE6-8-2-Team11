ENCODING 'UTF8'
         LC_COLLATE='en_US.UTF-8'
         LC_CTYPE='en_US.UTF-8'
         TEMPLATE=template0;
END IF;
END
$$;

-- Connect to the database
\c petmatching;

-- Create user if not exists and grant privileges
DO $$
BEGIN
   IF NOT EXISTS (
       SELECT FROM pg_roles WHERE rolname = 'petmatching_user'
   ) THEN
CREATE ROLE petmatching_user WITH LOGIN PASSWORD 'secure_user_password_change_me';
END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE petmatching TO petmatching_user;

-- Create a test table to verify connection (will be replaced by JPA)
CREATE TABLE IF NOT EXISTS health_check (
                                            id SERIAL PRIMARY KEY,
                                            status VARCHAR(10) DEFAULT 'OK',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

INSERT INTO health_check (status) VALUES ('OK');

-- Print success message
SELECT 'PetMatching database initialized successfully!' AS message;
