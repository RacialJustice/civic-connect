
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

export function PollCreator() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  if (!user) {
    return null;
  }

  if (user.role !== 'admin') {
    return null;
  }

  const createPoll = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest.post('/api/polls', data);
    },
    onSuccess: () => {
      setLocation('/polls');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || options.some(opt => !opt)) return;
    
    createPoll.mutate({
      question,
      options: options.filter(Boolean),
    });
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Enter your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />

      {options.map((option, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            required
          />
          {options.length > 2 && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeOption(index)}
            >
              Remove
            </Button>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <Button type="button" onClick={addOption}>
          Add Option
        </Button>
        <Button type="submit">Create Poll</Button>
      </div>
    </form>
  );
}
