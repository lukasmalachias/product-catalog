"use client";
import React, { useEffect, useState } from "react";
import { Product } from "../page";
import { ArrowLeft, Check, Pencil, Save, Trash2 } from "lucide-react";

interface ProductPageProps {
  itens: Product[];
}

export default function ProductCard({ itens }: ProductPageProps) {
  const [products, setProducts] = useState(itens);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product[]>([]);

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
  };

  function handleChange (id: number, field: string, value: any) {
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
  };

  async function handleSave (id: number) {
    const edited = editedProduct[0];

    if (!edited) return;

    const { name, description, price, available } = edited.attributes;

    const updatedData = {
      data: {
        name,
        description,
        price,
        available,
      },
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Erro ao atualizar");

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? edited : p))
      );

      alert("Produto atualizado com sucesso!");
      setEditingProductId(null);

    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar o produto.");
    }
  };

  async function handleDelete(idProduct: number) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${idProduct}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir produto");
      }

      setProducts(products.filter((product) => product.id !== idProduct));
      alert("Produto excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto. Tente novamente.");
    }
  }

  return (
    <>
      {editingProductId === null ? (
        <main className="min-h-screen bg-white p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((item) => (
              <React.Fragment key={item.id}>
                <div
                  className="border rounded-2xl p-6 shadow-md transition-colors hover:bg-blue-100"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.attributes.name}
                  </h2>
                  <p className="text-gray-700 mb-2">{item.attributes.description}</p>
                  <p className="text-blue-800 font-extrabold">
                    R$ {item.attributes.price.toFixed(2)}
                  </p>
                  {item.attributes.available ? (
                    <p className="text-green-400 font-bold">Produto em Estoque</p>
                  ) : (
                    <p className="text-red-400 font-bold">Produto Indisponível</p>
                  )}
                  <div className="flex justify-end gap-4 mt-4">
                  <button onClick={() => handleEdit(item.id)} title="Editar">
                    <Pencil className="cursor-pointer w-5 h-5 text-blue-500 hover:text-blue-700" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} title="Excluir">
                    <Trash2 className="cursor-pointer w-5 h-5 text-red-500 hover:text-red-700" />
                  </button>
                </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </main>
      ) : (
        <main className="min-h-screen bg-white p-8">
          <div className="mb-6">
            <button
              onClick={() => setEditingProductId(null)}
              className="flex items-center text-blue-600 hover:underline"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar para listagem
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {editedProduct.map((item) => (
              <React.Fragment key={item.id}>
                <div className="border rounded-2xl p-6 shadow-lg bg-white hover:shadow-xl transition-all">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-1">Nome do Produto</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                      value={item.attributes.name}
                      onChange={(e) => handleChange(item.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="mb-1">
                    <label className="block text-gray-700 font-bold mb-1">Descrição do Produto</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                      rows={2}
                      value={item.attributes.description}
                      onChange={(e) => handleChange(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-1">Preço</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-800 font-semibold"
                      value={item.attributes.price}
                      onChange={(e) => handleChange(item.id, "price", parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-1">Disponibilidade</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={item.attributes.available ? "true" : "false"}
                      onChange={(e) => handleChange(item.id, "available", e.target.value === "true")}
                    >
                      <option value="true">Produto em Estoque</option>
                      <option value="false">Produto Indisponível</option>
                    </select>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => handleSave(item.id)} title="Salvar"
                      className="cursor-pointer flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow transition"
                    >
                      <Check size={18} />
                      Salvar
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </main>
      )}
    </>
  );
}