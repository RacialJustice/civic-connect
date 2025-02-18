
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Trash } from "lucide-react";

export function DocumentManager() {
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload');
      return response.json();
    }
  });

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    uploadMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
          <Button onClick={handleUpload} disabled={!file}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
