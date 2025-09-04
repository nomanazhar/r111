-- Create users table for storing contact form submissions and user data
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    message TEXT,
    source TEXT NOT NULL DEFAULT 'contact_form' CHECK (source IN ('contact_form', 'order', 'registration')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Create index on source for filtering
CREATE INDEX IF NOT EXISTS idx_users_source ON public.users(source);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own data
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Create policy to allow service role to manage all users (for admin operations)
CREATE POLICY "Service role can manage all users" ON public.users
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow public to insert (for contact forms)
CREATE POLICY "Public can insert users" ON public.users
    FOR INSERT WITH CHECK (true);

-- Create policy to allow service role to update users
CREATE POLICY "Service role can update users" ON public.users
    FOR UPDATE USING (auth.role() = 'service_role');

-- Create policy to allow service role to delete users
CREATE POLICY "Service role can delete users" ON public.users
    FOR DELETE USING (auth.role() = 'service_role');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional - remove in production)
-- INSERT INTO public.users (name, email, phone, message, source) VALUES
-- ('John Doe', 'john@example.com', '+971501234567', 'Interested in cleaning services', 'contact_form'),
-- ('Jane Smith', 'jane@example.com', '+971507654321', 'Need help with plumbing', 'contact_form');

-- Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
