import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";

type MessageFormData = {
  content: string;
};

export function Chat() {
  const { messages, sendMessage, isConnected } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const form = useForm<MessageFormData>({
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = (data: MessageFormData) => {
    if (data.content.trim()) {
      sendMessage(data.content);
      form.reset();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Chat
          {!isConnected && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea ref={scrollRef} className="flex-1">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  message.type === "system"
                    ? "bg-muted text-muted-foreground text-center text-sm"
                    : "bg-primary/10"
                }`}
              >
                {message.type === "message" && (
                  <div className="font-semibold">{message.sender}</div>
                )}
                <div>{message.content}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <Textarea
            {...form.register("content")}
            placeholder="Type a message..."
            className="resize-none"
          />
          <Button type="submit" size="icon" disabled={!isConnected}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
