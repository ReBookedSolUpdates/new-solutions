-- Task 1, 3, 4 support migration
-- Adds seller away mode, wishlist persistence, and auto-cancel helpers.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_away boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS wishlists_user_listing_unique
  ON public.wishlists (user_id, listing_id);

CREATE INDEX IF NOT EXISTS wishlists_listing_id_idx
  ON public.wishlists (listing_id);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wishlists'
      AND policyname = 'wishlists_select_own'
  ) THEN
    CREATE POLICY wishlists_select_own
      ON public.wishlists
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wishlists'
      AND policyname = 'wishlists_insert_own'
  ) THEN
    CREATE POLICY wishlists_insert_own
      ON public.wishlists
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wishlists'
      AND policyname = 'wishlists_delete_own'
  ) THEN
    CREATE POLICY wishlists_delete_own
      ON public.wishlists
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_seller_wishlist_contacts(p_seller_id uuid)
RETURNS TABLE (
  wishlist_user_id uuid,
  wishlist_email text,
  wishlist_name text,
  listing_id uuid,
  listing_title text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH listings AS (
    SELECT id, title FROM public.books WHERE seller_id = p_seller_id
    UNION ALL
    SELECT id, title FROM public.uniforms WHERE seller_id = p_seller_id
    UNION ALL
    SELECT id, title FROM public.school_supplies WHERE seller_id = p_seller_id
  )
  SELECT
    w.user_id AS wishlist_user_id,
    p.email AS wishlist_email,
    COALESCE(p.full_name, p.name, split_part(p.email, '@', 1)) AS wishlist_name,
    w.listing_id,
    l.title AS listing_title
  FROM public.wishlists w
  INNER JOIN listings l ON l.id = w.listing_id
  INNER JOIN public.profiles p ON p.id = w.user_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_seller_wishlist_contacts(uuid) TO service_role;
