# Users Table Setup for Contact Form Submissions

This document explains how to set up the users table in your Supabase database to store contact form submissions and user data.

## Overview

The contact form system now saves all submissions to a `users` table in your Supabase database. This allows you to:

1. **Track all contact form submissions** in one place
2. **View user information** in the admin dashboard
3. **Manage user data** centrally
4. **Avoid duplicate entries** for the same email address
5. **Track how users were added** (contact form, orders, etc.)

## Database Setup

### Option 1: Run SQL Script (Recommended)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database/users_table.sql`
4. Click **Run** to execute the script

### Option 2: Manual Table Creation

If you prefer to create the table manually:

1. Go to **Table Editor** in your Supabase dashboard
2. Click **Create a new table**
3. Use these settings:

```sql
Table name: users
Columns:
- id: uuid (Primary Key, Default: gen_random_uuid())
- name: text (Not Null)
- email: text (Not Null, Unique)
- phone: text (Not Null)
- message: text (Nullable)
- source: text (Not Null, Default: 'contact_form')
- created_at: timestamptz (Default: now())
- updated_at: timestamptz (Default: now())
```

4. Enable Row Level Security (RLS)
5. Set up appropriate policies for security

## Table Structure

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier (auto-generated) |
| `name` | TEXT | User's full name |
| `email` | TEXT | User's email address (unique) |
| `phone` | TEXT | User's phone number |
| `message` | TEXT | Contact form message (optional) |
| `source` | TEXT | How user was added: 'contact_form', 'order', 'registration' |
| `created_at` | TIMESTAMP | When the record was created |
| `updated_at` | TIMESTAMP | When the record was last updated |

## Features

### Automatic User Management
- **New users**: Creates a new record when someone submits the contact form
- **Existing users**: Updates existing records if the email already exists
- **Message history**: Appends new messages to existing user records

### Admin Dashboard Integration
- **Users tab**: View all users and contact form submissions
- **Real-time data**: See contact form submissions as they come in
- **User metrics**: Dashboard shows total user count
- **Detailed view**: See name, email, phone, message, source, and creation date

### Data Integrity
- **Email validation**: Ensures proper email format
- **Required fields**: Name, email, and phone are mandatory
- **Unique emails**: Prevents duplicate user records
- **Timestamps**: Tracks when users were created and updated

## Security

The table includes Row Level Security (RLS) policies:

- **Public insert**: Anyone can submit contact forms
- **Service role access**: Admin operations require service role
- **User privacy**: Users can only see their own data (if authenticated)

## Usage

### Contact Form Submissions
When someone submits the contact form:
1. Data is validated (required fields, email format)
2. System checks if user already exists
3. If new user: creates record with `source: 'contact_form'`
4. If existing user: updates record and appends message
5. Success response is sent back to user

### Admin Access
In the admin dashboard (`/admin`):
1. Go to **Users** tab
2. View all contact form submissions
3. See user details and message history
4. Refresh to get latest data

## Troubleshooting

### Common Issues

1. **"Database connection not configured"**
   - Check your Supabase environment variables
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set

2. **"Table 'users' does not exist"**
   - Run the SQL script in Supabase SQL Editor
   - Check if table was created successfully

3. **Permission denied errors**
   - Ensure RLS policies are set up correctly
   - Check service role key permissions

4. **Contact form not saving**
   - Check browser console for errors
   - Verify API endpoint is working (`/api/contact`)
   - Check Supabase logs for database errors

### Testing

1. **Submit a test contact form**
2. **Check admin dashboard** - Users tab should show the submission
3. **Verify data** - Check if all fields are saved correctly
4. **Test duplicate email** - Submit another form with same email

## Future Enhancements

The system is designed to be easily extensible:

- **Email notifications**: Send admin alerts for new submissions
- **CRM integration**: Connect to external customer management systems
- **User authentication**: Allow users to log in and view their history
- **Analytics**: Track form submission trends and user behavior
- **Export functionality**: Download user data for analysis

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Review Supabase logs for database errors
3. Verify all environment variables are set correctly
4. Ensure the users table exists and has proper permissions
