-- Create feedback table
CREATE TABLE public.feedback (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  response_id uuid NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  text_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_feedback_conversation ON public.feedback(conversation_id);
CREATE INDEX idx_feedback_response ON public.feedback(response_id);