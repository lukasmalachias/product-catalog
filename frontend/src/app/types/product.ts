export type Product = {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
    available: boolean;
  };
};