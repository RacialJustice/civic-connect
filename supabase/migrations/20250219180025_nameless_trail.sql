/*
  # Moderation System Enhancements
  
  1. New Tables
    - `moderator_actions` - Tracks all moderation actions
    - `moderator_permissions` - Stores granular permissions
    - `content_moderation_queue` - Manages content pending review
  
  2. Changes
    - Add email verification for moderators
    - Expand permission system
    
  3. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Create moderator actions table for audit logging
CREATE TABLE IF NOT EXISTS moderator_actions (
  id SERIAL PRIMARY KEY,
  moderator_id INTEGER NOT NULL REFERENCES users(id),
  action_type TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_id INTEGER NOT NULL,
  action_details JSONB NOT NULL DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create moderator permissions table
CREATE TABLE IF NOT EXISTS moderator_permissions (
  id SERIAL PRIMARY KEY,
  moderator_id INTEGER NOT NULL REFERENCES users(id),
  permission TEXT NOT NULL,
  content_type TEXT NOT NULL,
  granted_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(moderator_id, permission, content_type)
);

-- Create content moderation queue
CREATE TABLE IF NOT EXISTS content_moderation_queue (
  id SERIAL PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id INTEGER NOT NULL,
  submitted_by INTEGER NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  moderator_notes TEXT,
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_type, content_id)
);

-- Add moderator verification
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS moderator_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS moderator_verification_token TEXT,
ADD COLUMN IF NOT EXISTS moderator_verification_sent_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS
ALTER TABLE moderator_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderator_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_moderation_queue ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Moderators can view all actions" ON moderator_actions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'moderator')
    )
  );

CREATE POLICY "Only admins can insert actions" ON moderator_actions
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Moderators can view their permissions" ON moderator_permissions
  FOR SELECT TO authenticated
  USING (
    moderator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can manage permissions" ON moderator_permissions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Moderators can view moderation queue" ON content_moderation_queue
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'moderator')
    )
  );

CREATE POLICY "Moderators can update queue items" ON content_moderation_queue
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'moderator')
    )
  );