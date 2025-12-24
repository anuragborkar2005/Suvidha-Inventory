import { PageTitle } from "@/components/app/page-title";

export default function AddProductsPage() {
    return (
        <div className="w-full flex flex-col justify-center p-4">
            <PageTitle>Add Products</PageTitle>
        </div>
    );
}
import AddProductForm from "@/components/AddProductForm"

export default function Page() {
  return <AddProductForm />
}
