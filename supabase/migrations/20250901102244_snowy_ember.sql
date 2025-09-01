/*
  # Add religion column to profiles table

  1. Changes
    - Add `religion` column to `profiles` table (text, optional)

  2. Security
    - No changes to RLS policies needed
*/

-- Add religion column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'religion'
  ) THEN
    ALTER TABLE profiles ADD COLUMN religion text;
  END IF;
END $$;