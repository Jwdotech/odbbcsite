-- 003_fix_members_gender_constraint.sql
BEGIN;

-- Drop the old constraint
ALTER TABLE members DROP CONSTRAINT members_gender_check;

-- Add the new constraint with correct values
ALTER TABLE members ADD CONSTRAINT members_gender_check CHECK (gender IN ('Male','Female'));

COMMIT;
