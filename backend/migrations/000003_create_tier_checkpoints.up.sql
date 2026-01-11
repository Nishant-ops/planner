CREATE TABLE tier_checkpoints (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    tier_number TINYINT UNSIGNED NOT NULL CHECK (tier_number >= 0 AND tier_number <= 6),
    is_passed BOOLEAN DEFAULT FALSE,
    attempts INT UNSIGNED DEFAULT 0,
    last_attempt_at TIMESTAMP NULL,
    passed_at TIMESTAMP NULL,
    submitted_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_tier (user_id, tier_number),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_tier_passed (tier_number, is_passed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
