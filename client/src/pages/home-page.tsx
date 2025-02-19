import { Header } from "@/components/header";
import { LocationForm } from "@/components/location-form";
import { LocalUpdates } from "@/components/local-updates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Container } from '../components/ui/container'

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <Container>
      <h1 className="text-4xl font-bold">Welcome to CivicConnect</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Connecting communities through digital civic engagement.
      </p>
    </Container>
  );
}