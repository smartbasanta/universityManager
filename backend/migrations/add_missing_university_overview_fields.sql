-- Migration: Add missing fields to university_overview table
-- Date: 2024-12-19
-- Description: Add city, zip_code, and research_expenditure_currency columns

-- Add city column
ALTER TABLE university_overview 
ADD COLUMN city VARCHAR NULL;

-- Add zip_code column  
ALTER TABLE university_overview 
ADD COLUMN zip_code VARCHAR NULL;

-- Add research_expenditure_currency column
ALTER TABLE university_overview 
ADD COLUMN research_expenditure_currency VARCHAR NULL;

-- Add comments for documentation
COMMENT ON COLUMN university_overview.city IS 'City name for university location';
COMMENT ON COLUMN university_overview.zip_code IS 'ZIP/Postal code for university location';
COMMENT ON COLUMN university_overview.research_expenditure_currency IS 'Currency code for research expenditure amount';

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'university_overview' 
AND column_name IN ('city', 'zip_code', 'research_expenditure_currency');
