-- Create databases for OnSite360 services (run as postgres user)
SELECT 'CREATE DATABASE onsite360_auth' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'onsite360_auth')\gexec
SELECT 'CREATE DATABASE onsite360_users' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'onsite360_users')\gexec
SELECT 'CREATE DATABASE onsite360_jobs' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'onsite360_jobs')\gexec
