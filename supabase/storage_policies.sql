-- Storage Bucket Policies for Avatars
-- Run this AFTER creating the "avatars" bucket in Supabase Dashboard
-- Go to: Storage → New bucket → Name: "avatars" → Check "Public bucket" → Create

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT TO authenticated 
  WITH CHECK (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update/replace their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE TO authenticated 
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE TO authenticated 
  USING (
    bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Anyone can view avatars (public bucket)
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
