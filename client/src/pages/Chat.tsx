import { useChat } from '../hooks/use-chat';

export default function Chat() {
  const { messages, sendMessage, isConnected } = useChat();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Community Chat</h1>
      <div className="bg-gray-100 p-4 rounded">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <span className="font-bold">{msg.sender}: </span>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
