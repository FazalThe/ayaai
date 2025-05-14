-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations table
CREATE POLICY "Users can view their own conversations"
ON conversations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
ON conversations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
ON conversations FOR DELETE USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
