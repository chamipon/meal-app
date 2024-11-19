-- CREATE TYPE status AS ENUM ('pending','in progress','completed');

CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at DATE NOT NULL DEFAULT CURRENT_DATE
);