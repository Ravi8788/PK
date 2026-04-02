-- Add thumbnail_url column to portfolio table
-- Run this once for existing PostgreSQL databases

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'portfolio'
          AND column_name = 'thumbnail_url'
    ) THEN
        ALTER TABLE portfolio
        ADD COLUMN thumbnail_url TEXT;

        RAISE NOTICE 'Column thumbnail_url added successfully';
    ELSE
        RAISE NOTICE 'Column thumbnail_url already exists';
    END IF;
END $$;

SELECT 'Portfolio thumbnail column is ready.' AS message;
