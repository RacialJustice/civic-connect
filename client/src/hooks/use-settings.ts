import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./use-auth";

interface Settings {
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  publicProfile: boolean;
  theme?: string;
}

export function useSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["settings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;

      return data as Settings;
    },
    enabled: !!user?.id,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<Settings>) => {
      const { data, error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user?.id,
          ...newSettings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", user?.id] });
    },
  }).mutateAsync;

  return {
    settings,
    updateSettings,
  };
}
