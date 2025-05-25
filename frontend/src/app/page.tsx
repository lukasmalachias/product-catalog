"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import ProductCard from "../app/components/ProductCard";

export type Product = {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
    available: boolean;
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`
        );
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const data = await res.json();
        setProducts(data.data);
      } catch (error) {
        toast.error("Erro ao carregar produtos.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6 text-black">
        Lista de Produtos
      </h1>

      {loading && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
        >
          <div className="loader rounded-full w-8 h-8 border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </motion.div>
      )}

      {!loading && products && products.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
          Não existem produtos disponíveis.
        </p>
      )}

      {!loading && products && products.length > 0 && (
        <AnimatePresence>
          <motion.div
            key="product-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ProductCard itens={products} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}