# BarangayELink - Supabase Setup Guide

## Overview
Your landing page is now connected to Supabase for dynamic data management. This guide will help you set up the database tables and start using your application.

## Prerequisites
- Supabase Project URL: `https://lczbqviltkfcfulqfizy.supabase.co`
- Anon Key is already configured in your project

## Setup Steps

### Step 1: Create Database Tables
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to the **SQL Editor** section
4. Create a new query
5. Copy and paste the contents of `supabase/migrations/create_landing_tables.sql`
6. Run the SQL script

### Step 2: Verify Tables Were Created
After running the migration, you should see these tables in your Supabase:
- `announcements` - For barangay announcements
- `barangay_statistics` - For population statistics
- `barangay_officials` - For official information
- `assistance_programs` - For assistance program details
- `barangay_events` - For events management
- `barangay_contact` - For contact information
- `document_types` - For available documents

### Step 3: Manage Your Data
You can manage all data directly from the Supabase Dashboard:

#### Adding Announcements
1. Go to the `announcements` table
2. Click "Insert row"
3. Fill in: `title`, `description`, `date`, `is_active`

#### Managing Officials
1. Go to the `barangay_officials` table
2. Add or edit official information
3. Use `display_order` to arrange them

#### Managing Statistics
1. Go to the `barangay_statistics` table
2. Update values as needed

#### Setting Contact Information
1. Go to the `barangay_contact` table
2. Update phone, email, address, etc.

## Data Fetching

The app uses custom React hooks to fetch data:

```javascript
import { useLandingData } from '../hooks/useLandingData'

// In your component:
const { announcements, statistics, officials, loading, error } = useLandingData()
```

Available hooks:
- `useLandingData()` - Fetches all landing page data
- `useAnnouncements()` - Fetches announcements only
- `useBarangayOfficials()` - Fetches officials only
- `useContactInfo()` - Fetches contact information
- `useAssistancePrograms()` - Fetches assistance programs

## Real-time Updates

The data is fetched when the component mounts. For real-time updates, you can use Supabase subscriptions:

```javascript
useEffect(() => {
  const subscription = supabase
    .from('announcements')
    .on('*', payload => {
      console.log('Real-time update:', payload)
    })
    .subscribe()

  return () => subscription.unsubscribe()
}, [])
```

## Troubleshooting

### Data not showing?
1. Check that the SQL migration was run successfully
2. Verify RLS policies are enabled (they should be from the migration)
3. Check browser console for errors
4. Ensure Supabase URL and key are correct in `src/supabase.js`

### Getting CORS errors?
1. Go to Supabase Dashboard
2. Project Settings → API
3. Ensure your domain is in the allowed list

### Need to reset data?
Run this in Supabase SQL Editor to delete all tables:
```sql
DROP TABLE IF EXISTS barangay_contact;
DROP TABLE IF EXISTS document_types;
DROP TABLE IF EXISTS barangay_events;
DROP TABLE IF EXISTS assistance_programs;
DROP TABLE IF EXISTS barangay_officials;
DROP TABLE IF EXISTS barangay_statistics;
DROP TABLE IF EXISTS announcements;
```

Then re-run the migration script.

## File Locations
- **Supabase Config**: `src/supabase.js`
- **Data Hooks**: `src/hooks/useLandingData.js`
- **Landing Page**: `src/pages/Landing.jsx`
- **Migration**: `supabase/migrations/create_landing_tables.sql`

## Next Steps
1. Run the SQL migration
2. Add your actual barangay data through the Supabase Dashboard
3. Test the app locally with `npm run dev`
4. Deploy when ready!
