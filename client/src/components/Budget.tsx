import { useState, useEffect } from 'react';
import { BudgetAllocation } from '../types';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { WithLocation } from '@/components/with-location';
import { useLocation } from '@/hooks/use-location';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Budget = () => {
  const navigate = useNavigate();
  const { location, loading: locationLoading } = useLocation();
  const [budgets, setBudgets] = useState<BudgetAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");

  const fetchBudgets = async () => {
    try {
      if (!location) return;

      const { data, error } = await supabase
        .from('budget_allocations')
        .select('*')
        .in('region_name', [location.ward, location.constituency, location.county]);
      
      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchBudgets();
    }
  }, [location]);

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.region_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' ? true : budget.region_type === filterType;
    return matchesSearch && matchesType;
  });

  const downloadCSV = () => {
    const headers = ['Region Name', 'Type', 'Amount', 'Fiscal Year', 'Description'];
    const csvData = filteredBudgets.map(budget => [
      budget.region_name,
      budget.region_type,
      budget.amount,
      budget.fiscal_year,
      budget.description || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'budget_allocations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (locationLoading || loading) return <div>Loading budgets...</div>;
  if (!location) return <div>Please update your location in profile settings to view budget information.</div>;

  return (
    <WithLocation>
      <div className="container mx-auto p-2 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Budget Allocations</h1>
          <Button onClick={downloadCSV} variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
          <div className="w-full sm:flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by region name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="ward">Ward</SelectItem>
              <SelectItem value="constituency">Constituency</SelectItem>
              <SelectItem value="county">County</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Region Name</TableHead>
                <TableHead className="whitespace-nowrap">Type</TableHead>
                <TableHead className="text-right whitespace-nowrap">Amount (KES)</TableHead>
                <TableHead className="whitespace-nowrap">Fiscal Year</TableHead>
                <TableHead className="whitespace-nowrap">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow 
                  key={budget.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => navigate(`/budgets/${budget.id}`)}
                >
                  <TableCell className="font-medium max-w-[150px] truncate">{budget.region_name}</TableCell>
                  <TableCell className="capitalize">{budget.region_type}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {budget.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{budget.fiscal_year}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{budget.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </WithLocation>
  );
};
