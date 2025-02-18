import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import React, { useState } from 'react';

export function PollCreator() {
  const { user } = useAuth();
  const [pollTitle, setPollTitle] = useState('');
  const [pollOptions, setPollOptions] = useState(['']);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPollTitle(event.target.value);
  };

  const handleOptionChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = [...pollOptions];
    newOptions[index] = event.target.value;
    setPollOptions(newOptions);
  };

  const addOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const createPoll = async () => {
    if (pollTitle && pollOptions.length > 0) {
      await apiRequest('/createPoll', {
        method: 'POST',
        body: JSON.stringify({
          title: pollTitle,
          options: pollOptions,
          createdBy: user.id,
        }),
      });
      setPollTitle('');
      setPollOptions(['']);
    }
  };

  return (
    <div>
      <h1>Create a new poll</h1>
      <input
        type="text"
        value={pollTitle}
        onChange={handleTitleChange}
        placeholder="Enter poll title"
      />
      {pollOptions.map((option, index) => (
        <div key={index}>
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e)}
            placeholder={`Option ${index + 1}`}
          />
        </div>
      ))}
      <button onClick={addOption}>Add Option</button>
      <button onClick={createPoll}>Create Poll</button>
    </div>
  );
}