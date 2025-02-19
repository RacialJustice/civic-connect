import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const emergencyServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  phone_numbers: z.array(z.string()).min(1, "At least one phone number is required"),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  operating_hours: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  personnel_count: z.number().min(0).optional(),
});

type EmergencyServiceFormData = z.infer<typeof emergencyServiceSchema>;

interface EmergencyServiceFormProps {
  onSubmit: (data: EmergencyServiceFormData) => Promise<void>;
  initialData?: Partial<EmergencyServiceFormData>;
}

export function EmergencyServiceForm({ onSubmit, initialData }: EmergencyServiceFormProps) {
  const { toast } = useToast();
  
  const form = useForm<EmergencyServiceFormData>({
    resolver: zodResolver(emergencyServiceSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "",
      phone_numbers: initialData?.phone_numbers || [""],
      description: initialData?.description || "",
      address: initialData?.address || "",
      operating_hours: initialData?.operating_hours || "",
      latitude: initialData?.latitude || "",
      longitude: initialData?.longitude || "",
      personnel_count: initialData?.personnel_count || 0,
    },
  });

  const handleSubmit = async (data: EmergencyServiceFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: "Emergency service saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save emergency service",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter service name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full p-2 rounded-md border border-input"
                >
                  <option value="">Select type</option>
                  <option value="police">Police</option>
                  <option value="hospital">Hospital</option>
                  <option value="fire">Fire Station</option>
                  <option value="ambulance">Ambulance</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_numbers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Numbers</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={phone}
                        onChange={(e) => {
                          const newPhones = [...field.value];
                          newPhones[index] = e.target.value;
                          field.onChange(newPhones);
                        }}
                        placeholder="Enter phone number"
                      />
                      {index === field.value.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => field.onChange([...field.value, ""])}
                        >
                          Add
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter latitude" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter longitude" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="operating_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operating Hours</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., 24/7 or Mon-Fri 8am-5pm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter service description"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personnel_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personnel Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  placeholder="Enter number of personnel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Emergency Service
        </Button>
      </form>
    </Form>
  );
}