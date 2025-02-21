import { useLeaders } from "@/hooks/use-leaders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { WithLocation } from '@/components/with-location';

function LeadersPage() {
  // ...existing component code...
}

// Add proper export
export default LeadersPage;
