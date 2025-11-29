  CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    notes TEXT,
    consultation_id INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    FOREIGN KEY (consultation_id) REFERENCES consultations(id)
  );