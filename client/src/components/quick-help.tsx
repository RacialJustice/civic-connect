import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatFormData = {
  message: string;
};

export function QuickHelp() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ]);

  const form = useForm<ChatFormData>({
    defaultValues: {
      message: "",
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      form.reset();
    },
  });

  const onSubmit = (data: ChatFormData) => {
    const userMessage = { role: "user" as const, content: data.message };
    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(data.message);
  };

  return (
    <>
      <Button
        size="lg"
        className="fixed bottom-4 right-4 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircleQuestion className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Help</DialogTitle>
            <DialogDescription>
              Ask me anything about CivicConnect!
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="flex flex-col gap-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "rounded-lg p-4",
                      message.role === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground ml-8"
                    )}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center gap-2"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Type your question..."
                          {...field}
                          disabled={chatMutation.isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={chatMutation.isPending}>
                  {chatMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
