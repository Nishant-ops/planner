#!/bin/bash

# Test script for checkpoint flow end-to-end
# This script tests the full checkpoint functionality

set -e

echo "=== Checkpoint Flow End-to-End Test ==="
echo ""

# Configuration
DB_NAME="saksham"
DB_USER="root"
DB_PASS="rootpassword"
TEST_USER_UID="test_user_$(date +%s)"

echo "1. Setting up test user..."
docker exec mysql_container mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
INSERT INTO users (uid, email, name, created_at, updated_at)
VALUES ('$TEST_USER_UID', 'test@example.com', 'Test User', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();
" 2>/dev/null

echo "✓ Test user created: $TEST_USER_UID"
echo ""

echo "2. Initializing user mastery (all topics at 0% confidence)..."
TOPICS=("ARRAY_SCAN" "RECURSION_ROOTS" "SORTING" "HASHING" "STACKS" "PREFIX_SUM" "TWO_POINTERS" "QUEUES" "LINKED_LISTS" "SLIDING_WINDOW" "BINARY_SEARCH" "MONOTONIC_STACK" "BINARY_TREES" "INTERVALS" "GREEDY" "DFS_BFS" "BACKTRACKING" "TRIES" "TOPOLOGICAL_SORT" "UNION_FIND" "BIT_MANIPULATION" "DYNAMIC_PROGRAMMING")

for topic in "${TOPICS[@]}"; do
    docker exec mysql_container mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
    INSERT INTO user_mastery (firebase_uid, topic_key, confidence, solved_problems)
    VALUES ('$TEST_USER_UID', '$topic', 0, JSON_ARRAY())
    ON DUPLICATE KEY UPDATE confidence = 0;
    " 2>/dev/null
done

echo "✓ Initialized mastery for ${#TOPICS[@]} topics"
echo ""

echo "3. Initializing checkpoints (all tiers 0-6)..."
for tier in {0..6}; do
    docker exec mysql_container mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
    INSERT INTO tier_checkpoints (user_uid, tier_number, is_passed, attempts)
    VALUES ('$TEST_USER_UID', $tier, FALSE, 0)
    ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
    " 2>/dev/null
done

echo "✓ Initialized 7 checkpoints (tiers 0-6)"
echo ""

echo "4. Verifying checkpoint table structure..."
docker exec mysql_container mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
SELECT tier_number, is_passed, attempts 
FROM tier_checkpoints 
WHERE user_uid = '$TEST_USER_UID'
ORDER BY tier_number;
" 2>/dev/null

echo ""
echo "5. Testing checkpoint eligibility (should NOT be able to attempt - 0% confidence)..."
docker exec mysql_container mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
SELECT 
    tc.tier_number,
    tc.is_passed,
    tc.attempts,
    CASE 
        WHEN (SELECT MIN(confidence) FROM user_mastery WHERE firebase_uid = '$TEST_USER_UID' AND topic_key IN ('ARRAY_SCAN', 'RECURSION_ROOTS')) >= 70 
        THEN 'YES' 
        ELSE 'NO' 
    END as can_attempt_tier_0
FROM tier_checkpoints tc
WHERE tc.user_uid = '$TEST_USER_UID' AND tc.tier_number = 0;
" 2>/dev/null

echo ""
echo "6. Updating Tier 0 topics to 70% confidence..."
docker exec mysql_container mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
UPDATE user_mastery 
SET confidence = 70 
WHERE firebase_uid = '$TEST_USER_UID' 
AND topic_key IN ('ARRAY_SCAN', 'RECURSION_ROOTS');
" 2>/dev/null

echo "✓ Updated ARRAY_SCAN and RECURSION_ROOTS to 70%"
echo ""

echo "7. Testing checkpoint eligibility (should NOW be able to attempt)..."
docker exec mysql_container mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
SELECT 
    tc.tier_number,
    tc.is_passed,
    tc.attempts,
    CASE 
        WHEN (SELECT MIN(confidence) FROM user_mastery WHERE firebase_uid = '$TEST_USER_UID' AND topic_key IN ('ARRAY_SCAN', 'RECURSION_ROOTS')) >= 70 
        THEN 'YES' 
        ELSE 'NO' 
    END as can_attempt_tier_0
FROM tier_checkpoints tc
WHERE tc.user_uid = '$TEST_USER_UID' AND tc.tier_number = 0;
" 2>/dev/null

echo ""
echo "8. Simulating checkpoint attempt..."
docker exec mysql_container mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
UPDATE tier_checkpoints 
SET attempts = attempts + 1, 
    last_attempt_at = NOW(),
    submitted_code = 'def generate_subsets(arr):\n    result = []\n    def backtrack(index, current):\n        result.append(current[:])\n        for i in range(index, len(arr)):\n            current.append(arr[i])\n            backtrack(i + 1, current)\n            current.pop()\n    backtrack(0, [])\n    return result'
WHERE user_uid = '$TEST_USER_UID' AND tier_number = 0;
" 2>/dev/null

echo "✓ Recorded attempt for Tier 0 checkpoint"
echo ""

echo "9. Simulating successful checkpoint pass..."
docker exec mysql_container mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
UPDATE tier_checkpoints 
SET is_passed = TRUE, 
    passed_at = NOW()
WHERE user_uid = '$TEST_USER_UID' AND tier_number = 0;
" 2>/dev/null

echo "✓ Marked Tier 0 checkpoint as passed"
echo ""

echo "10. Final checkpoint status..."
docker exec mysql_container mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
SELECT 
    tier_number,
    is_passed,
    attempts,
    DATE_FORMAT(last_attempt_at, '%Y-%m-%d %H:%i:%s') as last_attempt,
    DATE_FORMAT(passed_at, '%Y-%m-%d %H:%i:%s') as passed_time
FROM tier_checkpoints 
WHERE user_uid = '$TEST_USER_UID'
ORDER BY tier_number;
" 2>/dev/null

echo ""
echo "=== Test Complete ==="
echo "Test user UID: $TEST_USER_UID"
echo ""
echo "To clean up test data, run:"
echo "docker exec mysql_container mysql -u root -prootpassword $DB_NAME -e \"DELETE FROM users WHERE uid = '$TEST_USER_UID';\""
