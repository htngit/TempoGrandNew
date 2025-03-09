import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const ProductsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Products Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder for the Products Management page. Here you
            will be able to manage your product catalog, including adding new
            products, updating existing ones, and organizing them into
            categories.
          </p>
          <div className="mt-6 p-8 border rounded-md bg-muted/20 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Product listing will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
