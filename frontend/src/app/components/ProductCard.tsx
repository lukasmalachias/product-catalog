"use client";
import React, { useEffect, useState } from "react";
import { Product } from "../page";
import { ArrowLeft, Check, Pencil, Save, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

interface ProductPageProps {
  itens: Product[];
}

export default function ProductCard({ itens }: ProductPageProps) {
  const [products, setProducts] = useState(itens);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingProductId !== null) {
      const productToEdit = products.find((p) => p.id === editingProductId);
      if (productToEdit) {
        setEditedProduct([{ ...productToEdit }]);
      }
    } else {
      setEditedProduct([]);
    }
  }, [editingProductId, products]);

  function handleEdit(idProduct: number) {
    setEditingProductId(idProduct);
  }

  function handleChange(id: number, field: string, value: any) {
    setEditedProduct((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              attributes: {
                ...item.attributes,
                [field]: value,
              },
            }
          : item
      )
    );
  }

  async function handleSave(id: number) {
    const edited = editedProduct[0];
    if (!edited) return;

    const { name, description, price, available } = edited.attributes;
    const updatedData = {
      data: { name, description, price, available },
    };

    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      setIsLoading(false);
      if (!res.ok) throw new Error("Erro ao atualizar");

      setProducts((prev) => prev.map((p) => (p.id === id ? edited : p)));
      toast.success("Produto atualizado com sucesso!");
      setEditingProductId(null);
    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao atualizar produto:", error);
      toast.error("Erro ao atualizar o produto.");
    }
  }

  async function handleDelete(idProduct: number) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${idProduct}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir produto");

      setProducts(products.filter((product) => product.id !== idProduct));
      toast.success("Produto excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast.error("Erro ao excluir produto. Tente novamente.");
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <AnimatePresence>
        {editingProductId === null ? (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 10 }}
            exit={{ opacity: 0 }}
            className="bg-gray-50 dark:bg-gray-900 px-4 py-8 sm:px-6 lg:px-8 rounded-md"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:ring-2 hover:ring-blue-200"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {item.attributes.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    {item.attributes.description}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-2">
                    R$ {item.attributes.price.toFixed(2)}
                  </p>
                  {item.attributes.available ? (
                    <span className="inline-block text-sm font-medium text-green-600 bg-green-50 dark:bg-green-800/40 dark:text-green-400 px-3 py-1 rounded-full">
                      Em Estoque
                    </span>
                  ) : (
                    <span className="inline-block text-sm font-medium text-red-600 bg-red-50 dark:bg-red-800/40 dark:text-red-400 px-3 py-1 rounded-full">
                      Indisponível
                    </span>
                  )}
                  <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => handleEdit(item.id)} title="Editar">
                      <Pencil className="w-5 h-5 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} title="Excluir">
                      <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.main>
        ) : (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 10 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8 sm:px-6 lg:px-8"
          >
            <div className="mb-6">
              <button
                onClick={() => setEditingProductId(null)}
                className="flex items-center text-blue-600 hover:underline text-sm dark:text-blue-400"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar para listagem
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {editedProduct.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="border rounded-2xl p-6 shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-all space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3 text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-400 outline-none transition"
                      value={item.attributes.name}
                      onChange={(e) => handleChange(item.id, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Descrição</label>
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3 text-gray-800 dark:text-white bg-white dark:bg-gray-700 resize-none focus:ring-2 focus:ring-blue-400 outline-none transition"
                      value={item.attributes.description}
                      onChange={(e) => handleChange(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Preço</label>
                    <input
                      type="number"
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3 text-blue-800 dark:text-blue-300 bg-white dark:bg-gray-700 font-semibold focus:ring-2 focus:ring-blue-400 outline-none transition"
                      value={item.attributes.price}
                      onChange={(e) => handleChange(item.id, "price", parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Disponibilidade</label>
                    <select
                      className="w-full rounded-xl border border-gray-300 dark:border-gray-600 p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 outline-none transition"
                      value={item.attributes.available ? "true" : "false"}
                      onChange={(e) => handleChange(item.id, "available", e.target.value === "true")}
                    >
                      <option value="true">Produto em Estoque</option>
                      <option value="false">Produto Indisponível</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSave(item.id)}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-xl shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check size={18} />
                      )}
                      Salvar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
