import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackButtonsProps {
  responseId: string;
  conversationId: string;
}

export function FeedbackButtons({ responseId, conversationId }: FeedbackButtonsProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = async (ratingValue: number) => {
    setRating(ratingValue);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          responseId, 
          conversationId, 
          rating: ratingValue 
        }),
      });
      
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="flex space-x-2 mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          onClick={() => handleRating(star)}
          disabled={submitted}
          className={`p-1 ${rating === star ? 'text-yellow-400' : 'text-gray-400'}`}
        >
          <Star className={`h-5 w-5 ${rating === star ? 'fill-current' : ''}`} />
        </Button>
      ))}
    </div>
  );
}