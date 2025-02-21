import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const budgetAllocationSchema = z.object({
  region_type: z.enum(['ward', 'constituency', 'county']),
  region_name: z.string().min(1, 'Region name is required'),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number'),
  fiscal_year: z.string().min(1, 'Fiscal year is required'),
  description: z.string().optional()
});

const budgetItemSchema = z.object({
  budget_id: z.string().uuid(),
  description: z.string().min(1, 'Description is required'),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number'),
  fiscal_year: z.string().min(1, 'Fiscal year is required')
});

export default function BudgetManagement() {
  const { toast } = useToast();
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  const allocationForm = useForm({
    resolver: zodResolver(budgetAllocationSchema),
    defaultValues: {
      region_type: 'constituency',
      region_name: '',
      amount: '',
      fiscal_year: '',
      description: ''
    }
  });

  const itemForm = useForm({
    resolver: zodResolver(budgetItemSchema),
    defaultValues: {
      budget_id: '',
      description: '',
      amount: '',
      fiscal_year: ''
    }
  });

  const onSubmitAllocation = async (data: z.infer<typeof budgetAllocationSchema>) => {
    try {
      const { error } = await supabase.from('budget_allocations').insert({
        ...data,
        amount: Number(data.amount)
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Budget allocation created successfully'
      });
      
      allocationForm.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create budget allocation',
        variant: 'destructive'
      });
    }
  };

  const onSubmitItem = async (data: z.infer<typeof budgetItemSchema>) => {
    try {
      const { error } = await supabase.from('budget_item_allocations').insert({
        ...data,
        amount: Number(data.amount)
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Budget item created successfully'
      });
      
      itemForm.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create budget item',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Budget Management</h1>
      
      <Tabs defaultValue="allocations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="allocations">Budget Allocations</TabsTrigger>
          <TabsTrigger value="items">Budget Items</TabsTrigger>
        </TabsList>

        <TabsContent value="allocations">
          <Card>
            <CardHeader>
              <CardTitle>Create Budget Allocation</CardTitle>
              <CardDescription>Add a new budget allocation for a region</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...allocationForm}>
                <form onSubmit={allocationForm.handleSubmit(onSubmitAllocation)} className="space-y-4">
                  <FormField
                    control={allocationForm.control}
                    name="region_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select region type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ward">Ward</SelectItem>
                            <SelectItem value="constituency">Constituency</SelectItem>
                            <SelectItem value="county">County</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={allocationForm.control}
                    name="region_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={allocationForm.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (KES)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" step="0.01" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={allocationForm.control}
                    name="fiscal_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fiscal Year</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 2023-2024" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={allocationForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Create Budget Allocation
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Add Budget Items</CardTitle>
              <CardDescription>Add items to an existing budget allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...itemForm}>
                <form onSubmit={itemForm.handleSubmit(onSubmitItem)} className="space-y-4">
                  {/* Add form fields for budget items */}
                  {/* ... Similar to allocation form fields ... */}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
