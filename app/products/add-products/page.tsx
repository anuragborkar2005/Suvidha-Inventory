import { PageTitle } from "@/components/app/page-title";
import AddProductForm from "@/components/AddProductForm";

export function AddProductsPage() {
  return (
    <div className="w-full flex flex-col justify-center p-4">
      <PageTitle>Add Products</PageTitle>
    </div>
  );
}

export default function Page() {
  return <AddProductForm />;
}
