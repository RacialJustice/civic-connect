import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from '@/hooks/use-location';

interface BudgetDetails {
  id: string;
  region_type: 'ward' | 'constituency' | 'county';
  region_name: string;
  amount: number;
  fiscal_year: string;
  description: string | null;
}

interface BudgetItemAllocation {
  id: string;
  item_id: string;
  amount: number;
  fiscal_year: string;
  description: string;
}

interface BudgetItemExpenditure {
  id: string;
  item_id: string;
  amount: number;
  fiscal_year: string;
  description: string;
  created_at: string;
}

export const BudgetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { location, loading: locationLoading } = useLocation();
  const [budget, setBudget] = useState<BudgetDetails | null>(null);
  const [allocations, setAllocations] = useState<BudgetItemAllocation[]>([]);
  const [expenditures, setExpenditures] = useState<BudgetItemExpenditure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        if (!location) return;

        // Fetch basic budget info
        const { data: budgetData, error: budgetError } = await supabase
          .from('budget_allocations')
          .select('*')
          .eq('id', id)
          .single();

        if (budgetError) throw budgetError;

        // Verify user has access to this budget
        if (![location.ward, location.constituency, location.county].includes(budgetData.region_name)) {
          throw new Error('Unauthorized to view this budget');
        }

        setBudget(budgetData);

        // Fetch allocations
        const { data: allocationsData, error: allocationsError } = await supabase
          .from('budget_item_allocations')
          .select('*')
          .eq('budget_id', id);

        if (allocationsError) throw allocationsError;
        setAllocations(allocationsData || []);

        // Fetch expenditures
        const { data: expendituresData, error: expendituresError } = await supabase
          .from('budget_item_expenditures')
          .select('*')
          .eq('budget_id', id);

        if (expendituresError) throw expendituresError;
        setExpenditures(expendituresData || []);

      } catch (error) {
        console.error('Error fetching budget details:', error);
        navigate('/budgets'); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchBudgetData();
    }
  }, [id, location]);

  if (locationLoading || loading) return <div>Loading budget details...</div>;
  if (!location) return <div>Please update your location in profile settings to view budget information.</div>;
  if (!budget) return <div>Budget not found</div>;

  const totalAllocated = allocations.reduce((sum, item) => sum + item.amount, 0);
  const totalSpent = expenditures.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = totalAllocated - totalSpent;
  const spendingPercentage = (totalSpent / totalAllocated) * 100;
  const isOverBudget = totalSpent > totalAllocated;

  return (
    <div className="container mx-auto p-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/budgets')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Budgets
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{budget.region_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Budget</h3>
              <p className="text-2xl font-semibold">KES {totalAllocated.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Spent</h3>
              <p className="text-2xl font-semibold">KES {totalSpent.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Remaining</h3>
              <p className={`text-2xl font-semibold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                KES {remainingBudget.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Budget Utilization</span>
              <span>{Math.round(spendingPercentage)}%</span>
            </div>
            <Progress value={spendingPercentage} className={isOverBudget ? 'text-red-500' : ''} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="allocations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="expenditures">Expenditures</TabsTrigger>
        </TabsList>

        <TabsContent value="allocations">
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount (KES)</TableHead>
                    <TableHead>Fiscal Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map((allocation) => (
                    <TableRow key={allocation.id}>
                      <TableCell>{allocation.description}</TableCell>
                      <TableCell className="text-right">{allocation.amount.toLocaleString()}</TableCell>
                      <TableCell>{allocation.fiscal_year}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenditures">
          <Card>
            <CardHeader>
              <CardTitle>Expenditures</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount (KES)</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenditures.map((expenditure) => (
                    <TableRow key={expenditure.id}>
                      <TableCell>{expenditure.description}</TableCell>
                      <TableCell className="text-right">{expenditure.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(expenditure.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
