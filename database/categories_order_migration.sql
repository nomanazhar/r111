-- Add order field to categories table
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index on display_order for faster sorting
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);

-- Update existing categories with incremental order values
UPDATE public.categories 
SET display_order = subquery.row_number 
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_number 
  FROM public.categories
) AS subquery 
WHERE public.categories.id = subquery.id;
