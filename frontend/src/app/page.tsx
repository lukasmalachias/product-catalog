import ProductCard from "../app/components/ProductCard";

export type Product = {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
    available: boolean;
  }
};

export default async function ProductsPage() {
  let products: Product[] = [];
  let hasError = false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    const data = await res.json();
    products = data.data;
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    hasError = true;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb- text-gray-800">Lista de Produtos</h1>

      {hasError ? (
        <p className="text-red-500">Erro ao carregar produtos.</p>
      ) : !products || products.length === 0 ? (
        <p className="text-gray-600">Não existem produtos disponíveis.</p>
      ) : (
        <ProductCard itens={products} />
      )}
    </div>
  );
}