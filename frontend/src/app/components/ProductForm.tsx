"use client";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "../types/product";

interface ProductFormProps {
  isLoading: boolean;
  editedProduct: Product[];
  handleChange: (id: number, field: string, value: any) => void;
  handleSave: (id: number) => void;
  setEditingProductId: (id: number | null) => void;
}

export default function ProductForm({
  isLoading,
  editedProduct,
  handleChange,
  handleSave,
  setEditingProductId
}: ProductFormProps) {
  return(
    <>
      <div className="flex mb-5">
        <button
          onClick={() => setEditingProductId(null)}
          className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
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
                className="cursor-pointer flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-xl shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
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
    </>
  )
}