-- FitBasic yoga migration 001
-- Non-destructive: adds yoga tables alongside the existing gym schema.
-- Target database: MySQL 8.x

CREATE TABLE IF NOT EXISTS poses (
  pose_id INT AUTO_INCREMENT PRIMARY KEY,
  pose_name VARCHAR(255) NOT NULL,
  sanskrit_name VARCHAR(255),
  category ENUM('warmup','standing','seated','supine','prone','balancing','peak') NOT NULL,
  difficulty TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1-5',
  duration_seconds INT DEFAULT 30,
  instructions TEXT,
  breathing_cues TEXT,
  contraindications TEXT,
  modifications_easier TEXT,
  modifications_harder TEXT,
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  target_areas JSON COMMENT 'e.g., ["hamstrings","lower_back"]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sequences (
  sequence_id INT AUTO_INCREMENT PRIMARY KEY,
  sequence_title VARCHAR(255) NOT NULL,
  sequence_description TEXT,
  category ENUM('beginner','intermediate','advanced','restorative','vinyasa','yin') NOT NULL,
  difficulty TINYINT(1) DEFAULT 1,
  total_duration INT DEFAULT 0,
  peak_pose_id INT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (peak_pose_id) REFERENCES poses(pose_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sequence_poses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sequence_id INT NOT NULL,
  pose_id INT NOT NULL,
  order_index TINYINT NOT NULL,
  duration_seconds INT DEFAULT 30,
  transition_note VARCHAR(255),
  FOREIGN KEY (sequence_id) REFERENCES sequences(sequence_id) ON DELETE CASCADE,
  FOREIGN KEY (pose_id) REFERENCES poses(pose_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_yoga_profile (
  user_id VARCHAR(128) PRIMARY KEY,
  display_name VARCHAR(255),
  age TINYINT,
  gender ENUM('male','female','other','prefer_not'),
  experience_level ENUM('beginner','intermediate','advanced'),
  yoga_goal ENUM('flexibility','strength','relaxation','meditation','weight_loss','overall_wellness'),
  preferred_style ENUM('hatha','vinyasa','yin','restorative','ashtanga'),
  daily_commitment_minutes TINYINT DEFAULT 15,
  flexibility_score TINYINT DEFAULT 3 COMMENT '1-10',
  tight_zones JSON COMMENT '["lower_back","hamstrings"]',
  injuries JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_yoga_sessions (
  session_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL,
  sequence_id INT NOT NULL,
  session_date DATE NOT NULL,
  duration_minutes TINYINT NOT NULL,
  flexibility_score_change TINYINT,
  mood ENUM('relaxed','energized','sore','challenged','peaceful'),
  completed BOOLEAN DEFAULT TRUE,
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES user_yoga_profile(user_id) ON DELETE CASCADE,
  FOREIGN KEY (sequence_id) REFERENCES sequences(sequence_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL,
  achievement_code VARCHAR(50) NOT NULL,
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_yoga_profile(user_id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_achievement (user_id, achievement_code)
);
