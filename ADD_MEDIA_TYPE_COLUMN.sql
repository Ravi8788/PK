-- Add media_type column to portfolio table
-- This allows distinguishing between images and videos
-- Run this in Supabase SQL Editor if the column doesn't exist

-- Add the column (will fail silently if it already exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'portfolio' 
        AND column_name = 'media_type'
    ) THEN
        ALTER TABLE portfolio 
        ADD COLUMN media_type TEXT DEFAULT 'image';
        
        RAISE NOTICE 'Column media_type added successfully';
    ELSE
        RAISE NOTICE 'Column media_type already exists';
    END IF;
END $$;

-- Optional: Update existing records to have media_type = 'image'
UPDATE portfolio 
SET media_type = 'image' 
WHERE media_type IS NULL;

-- Optional: Add a check constraint (ensures only 'image' or 'video')
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.constraint_column_usage 
        WHERE constraint_name = 'portfolio_media_type_check'
    ) THEN
        ALTER TABLE portfolio 
        ADD CONSTRAINT portfolio_media_type_check 
        CHECK (media_type IN ('image', 'video'));
        
        RAISE NOTICE 'Check constraint added successfully';
    ELSE
        RAISE NOTICE 'Check constraint already exists';
    END IF;
END $$;

-- Success message
SELECT 'Portfolio table updated successfully! You can now upload both images and videos.' AS message;
