CREATE TABLE IF NOT EXISTS exercise_progress (
  user_uid VARCHAR(191) NOT NULL,
  exercise_id INT NOT NULL,
  progress_percent TINYINT UNSIGNED NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (user_uid, exercise_id)
);
