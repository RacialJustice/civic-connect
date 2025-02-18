
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export function PollCreator() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  if (user?.role !== 'admin') {
    return null;
  }

  const createPoll = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("/api/polls", {
        method: "POST",
        body: JSON.stringify(data)
      });
      return response.json();
    }
  });

  return (
    <div className="space-y-4">
      <Input 
        placeholder="Poll question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((option, i) => (
        <Input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={option}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[i] = e.target.value;
            setOptions(newOptions);
          }}
        />
      ))}
      <Button onClick={() => setOptions([...options, ''])}>
        Add Option
      </Button>
      <Button onClick={() => createPoll.mutate({ question, options })}>
        Create Poll
      </Button>
    </div>
  );
}
