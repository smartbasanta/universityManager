# Sports Form Migration Guide

## Overview
This migration adds new fields to the university sports system to support sports teams with additional information links.

## Changes Made

### Backend Changes

#### 1. Entity Updates (`University_Sports.entity.ts`)
- Added `men_sports_teams: string[]` - Array of men's sports team names
- Added `women_sports_teams: string[]` - Array of women's sports team names  
- Added `men_sports_teams_info: string[]` - Array of information links for men's teams
- Added `women_sports_teams_info: string[]` - Array of information links for women's teams

#### 2. DTO Updates (`sports.dto.ts`)
- Extended `UniversitySportsDto` with new team fields
- Added validation and API documentation for new fields

#### 3. Service Updates (`university.service.ts`)
- Updated `addUniversitySports` method to handle new team fields
- Maintains backward compatibility with existing data

### Frontend Changes

#### 1. Form Updates (`sports-form.tsx`)
- **Facility Inputs**: Changed from vertical to horizontal layout with equal width using CSS Grid
- **New Sections**: Added "Men's Sport Teams" and "Women's Sport Teams" sections
- **Additional Fields**: Each team now has a name and information link field
- **State Management**: Added new state variables for team data
- **Form Handling**: Updated save/submit functions to include new fields

#### 2. Type Updates
- Updated `UniversitySports` interface in multiple type files
- Added new fields to maintain type safety

## Database Migration

### Running the Migration
1. Execute the SQL migration file:
```bash
psql -d your_database_name -f migrations/add_sports_teams_fields.sql
```

### Migration SQL
```sql
-- Add new columns for sports teams
ALTER TABLE university_sports 
ADD COLUMN IF NOT EXISTS men_sports_teams VARCHAR[],
ADD COLUMN IF NOT EXISTS women_sports_teams VARCHAR[],
ADD COLUMN IF NOT EXISTS men_sports_teams_info VARCHAR[],
ADD COLUMN IF NOT EXISTS women_sports_teams_info VARCHAR[];

-- Set default values for existing records
UPDATE university_sports 
SET 
    men_sports_teams = ARRAY[]::VARCHAR[],
    women_sports_teams = ARRAY[]::VARCHAR[],
    men_sports_teams_info = ARRAY[]::VARCHAR[],
    women_sports_teams_info = ARRAY[]::VARCHAR[]
WHERE men_sports_teams IS NULL 
   OR women_sports_teams IS NULL 
   OR men_sports_teams_info IS NULL 
   OR women_sports_teams_info IS NULL;
```

## Testing

### Backend Testing
1. Ensure the new fields are properly saved when creating/updating sports data
2. Verify that existing data remains intact after migration
3. Test API endpoints with new field data

### Frontend Testing
1. Verify facility inputs are displayed horizontally with equal width
2. Test adding/removing sports teams
3. Ensure team information links are properly saved
4. Verify form submission includes all new fields

## Rollback Plan

If rollback is needed, execute:
```sql
ALTER TABLE university_sports 
DROP COLUMN IF EXISTS men_sports_teams,
DROP COLUMN IF EXISTS women_sports_teams,
DROP COLUMN IF EXISTS men_sports_teams_info,
DROP COLUMN IF EXISTS women_sports_teams_info;
```

## Notes
- The migration is backward compatible
- Existing sports data will remain unchanged
- New fields default to empty arrays for existing records
- Frontend form maintains the same user experience with enhanced functionality
