
-- Add read_at to messages for seen/read receipts
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS read_at timestamptz DEFAULT NULL;

-- Create storage buckets for uniforms, school supplies, and chat media
INSERT INTO storage.buckets (id, name, public) VALUES ('uniform-images', 'uniform-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('school-supply-images', 'school-supply-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-media', 'chat-media', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for uniform-images
CREATE POLICY "Public read uniform images" ON storage.objects FOR SELECT USING (bucket_id = 'uniform-images');
CREATE POLICY "Auth upload uniform images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uniform-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth update own uniform images" ON storage.objects FOR UPDATE USING (bucket_id = 'uniform-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth delete own uniform images" ON storage.objects FOR DELETE USING (bucket_id = 'uniform-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for school-supply-images
CREATE POLICY "Public read school supply images" ON storage.objects FOR SELECT USING (bucket_id = 'school-supply-images');
CREATE POLICY "Auth upload school supply images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'school-supply-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth update own school supply images" ON storage.objects FOR UPDATE USING (bucket_id = 'school-supply-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth delete own school supply images" ON storage.objects FOR DELETE USING (bucket_id = 'school-supply-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for chat-media
CREATE POLICY "Public read chat media" ON storage.objects FOR SELECT USING (bucket_id = 'chat-media');
CREATE POLICY "Auth upload chat media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'chat-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth delete own chat media" ON storage.objects FOR DELETE USING (bucket_id = 'chat-media' AND auth.uid()::text = (storage.foldername(name))[1]);
