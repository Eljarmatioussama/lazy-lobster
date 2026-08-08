CREATE TABLE IF NOT EXISTS diet_attributes (
  attribute_id INT AUTO_INCREMENT PRIMARY KEY,
  diet_id INT NOT NULL,
  attribute_label VARCHAR(80) NOT NULL,
  attribute_value VARCHAR(50) NOT NULL,
  attribute_color VARCHAR(20) NOT NULL DEFAULT '#10e689',
  attribute_order INT NOT NULL DEFAULT 0,
  INDEX (diet_id)
);
