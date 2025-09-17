-- Create blogs table for storing blog posts
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    image TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'RIII Team',
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);

-- Create index on published for filtering
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(published);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at DESC);


-- Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public to read published blogs
CREATE POLICY "Public can read published blogs" ON public.blogs
    FOR SELECT USING (published = true);

-- Create policy to allow service role to manage all blogs (for admin operations)
CREATE POLICY "Service role can manage all blogs" ON public.blogs
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blogs_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON public.blogs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_blogs_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON public.blogs TO authenticated;
GRANT ALL ON public.blogs TO service_role;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
