import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorBoundary } from "@/components/error-boundary";

const locationSchema = z.object({
 village: z.string().optional(),
 ward: z.string().optional(),
 constituency: z.string().min(1, "Constituency is required"),
 county: z.string().min(1, "County is required")
});

type LocationFormValues = z.infer<typeof locationSchema>;

function LocationFormContent() {
 const { user } = useAuth();
 const { toast } = useToast();
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [county, setCounty] = useState<string | null>(null);

 // Debug auth state on mount and changes
 useEffect(() => {
   const checkAuth = async () => {
     const { data: { session } } = await supabase.auth.getSession();
     console.log("Auth Check:", {
       sessionUser: session?.user,
       contextUser: user,
       userId: user?.id
     });
   };
   checkAuth();
 }, [user]);

 const form = useForm<LocationFormValues>({
   resolver: zodResolver(locationSchema),
   defaultValues: {
     village: "",
     ward: "",
     constituency: "",
     county: ""
   }
 });

 // Fetch current profile data
 const { data: profile } = useQuery({
   queryKey: ['profile', user?.id],
   queryFn: async () => {
     const { data, error } = await supabase
       .from('profiles')
       .select('*')
       .eq('user_id', user?.id)
       .single();

     if (error) throw error;
     return data;
   },
   enabled: !!user?.id
 });

 // Set form defaults from profile
 useEffect(() => {
   if (profile) {
     form.reset({
       village: profile.location_village || "",
       ward: profile.location_ward || "",
       constituency: profile.location_constituency || "",
       county: profile.location_county || ""
     });
     setCounty(profile.location_county);
   }
 }, [profile]);

 // Updated constituencies query
 const { data: constituencies = [], isLoading } = useQuery({
   queryKey: ['constituencies'],
   queryFn: async () => {
     const { data, error } = await supabase
       .from('constituency_counties')
       .select('constituency, county')
       .order('constituency');
     
     if (error) throw error;
     return data;
   }
 });

 // Fetch wards for selected constituency
 const { data: wards = [] } = useQuery({
   queryKey: ['wards', form.watch('constituency')],
   queryFn: async () => {
     const { data, error } = await supabase
       .from('wards')
       .select('name')
       .eq('constituency', form.watch('constituency'))
       .order('name');
     
     if (error) throw error;
     return data.map(ward => ward.name);
   },
   enabled: !!form.watch('constituency')
 });

 // Remove mutation code and replace with direct submission

 async function onSubmit(data: LocationFormValues) {
   try {
     const { data: { session } } = await supabase.auth.getSession();
     
     if (!session?.user) {
       console.error("No active session");
       toast({
         title: "Session Error",
         description: "Please sign in again",
         variant: "destructive"
       });
       return;
     }

     console.log("Submitting with user ID:", session.user.id);

     const profileData = {
       id: session.user.id,
       user_id: session.user.id,
       location_village: data.village || null,
       location_ward: data.ward || null,
       location_constituency: data.constituency,
       location_county: county,
       updated_at: new Date().toISOString()
     };

     const { error } = await supabase
       .from('profiles')
       .upsert(profileData)
       .select()
       .single();

     if (error) {
       console.error("Update failed:", error);
       throw error;
     }

     toast({
       title: "Success",
       description: "Location updated successfully"
     });
   } catch (error: any) {
     console.error("Submit error:", error);
     toast({
       title: "Error",
       description: "Failed to update location. Please try again.",
       variant: "destructive"
     });
   } finally {
     setIsSubmitting(false);
   }
 }

 // Add loading state for no user
 if (!user) {
   return (
     <div className="p-4 text-center">
       <p>Please sign in to update your location</p>
     </div>
   );
 }

 return (
   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
     <div className="space-y-2">
       <Label htmlFor="village">Village (Optional)</Label>
       <Input
         id="village"
         {...form.register("village")}
         placeholder="Enter your village name"
       />
     </div>

     <div className="space-y-2">
       <Label htmlFor="constituency">
         Constituency <span className="text-destructive">*</span>
       </Label>
       <Select
         value={form.watch('constituency')}
         onValueChange={(value) => {
           form.setValue('constituency', value);
           const selected = constituencies.find(c => c.constituency === value);
           if (selected) {
             setCounty(selected.county);
             form.setValue('county', selected.county);
           }
         }}
         disabled={isLoading}
       >
         <SelectTrigger>
           <SelectValue placeholder={isLoading ? "Loading..." : "Select constituency"} />
         </SelectTrigger>
         <SelectContent>
           {constituencies.map((c) => (
             <SelectItem key={c.constituency} value={c.constituency}>
               {c.constituency} ({c.county})
             </SelectItem>
           ))}
         </SelectContent>
       </Select>
       {form.formState.errors.constituency && (
         <p className="text-sm text-destructive">
           {form.formState.errors.constituency.message}
         </p>
       )}
     </div>

     <div className="space-y-2">
       <Label htmlFor="ward">Ward</Label>
       <Select
         value={form.watch('ward')}
         onValueChange={(value) => form.setValue('ward', value)}
         disabled={!form.watch('constituency')}
       >
         <SelectTrigger>
           <SelectValue placeholder="Select ward" />
         </SelectTrigger>
         <SelectContent>
           {wards.map((ward) => (
             <SelectItem key={ward} value={ward}>
               {ward}
             </SelectItem>
           ))}
         </SelectContent>
       </Select>
     </div>

     <div className="space-y-2">
       <Label htmlFor="county">County</Label>
       <Input
         id="county"
         value={county || ""}
         readOnly
         disabled
         className="bg-muted"
       />
     </div>

     <Button
       type="submit"
       className="w-full"
       disabled={isSubmitting}
     >
       {isSubmitting && (
         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
       )}
       Update Location
     </Button>
   </form>
 );
}

export function LocationForm() {
 return (
   <ErrorBoundary
     fallback={
       <div className="p-4 text-center">
         <p className="text-destructive mb-2">Something went wrong loading the location form.</p>
         <Button 
           onClick={() => window.location.reload()}
           variant="outline"
         >
           Try Again
         </Button>
       </div>
     }
   >
     <LocationFormContent />
   </ErrorBoundary>
 );
}