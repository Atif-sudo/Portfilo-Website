# Portfilo Website

A portfolio website with a premium frontend experience, a floating AI assistant, and a database-ready backend.

## Features
- React-style portfolio UI rendered from a single front-end app
- Floating chat assistant with one-click launcher
- Python backend exposing `/api/health`, `/api/chat`, and `/api/contact`
- MySQL-ready contact persistence with SQLite fallback for local development
- OpenAI-compatible AI chat integration

## Local setup
1. Copy `.env.example` to `.env`.
2. Add your real OpenAI API key.
3. Set MySQL values if you want to use MySQL instead of the SQLite fallback.
4. Start the app:

   python server.py

Then open http://localhost:3000

## MySQL setup
A schema file is included at `database/mysql_schema.sql`.

Run:

```sql
CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;
CREATE TABLE IF NOT EXISTS portfolio_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Then set your `.env` values to match your MySQL instance.

## Notes
- The server will use MySQL automatically when valid configuration is present.
- If MySQL is not reachable, it falls back to the local SQLite database so the site keeps working.
- The AI assistant requires a valid OpenAI-compatible API key to return live responses.
