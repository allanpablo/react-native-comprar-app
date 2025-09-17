export type Category = {
  id: string;
  name: string;
  icon: string; // nome do ícone (ex: 'cart', 'apple', etc.)
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentos', icon: 'restaurant' },
  { id: '2', name: 'Bebidas', icon: 'local-drink' },
  { id: '3', name: 'Limpeza', icon: 'cleaning-services' },
  { id: '4', name: 'Higiene', icon: 'soap' },
  { id: '5', name: 'Padaria', icon: 'bakery-dining' },
  { id: '6', name: 'Carnes', icon: 'set-meal' },
  { id: '7', name: 'Frios', icon: 'icecream' },
  { id: '8', name: 'Frutas', icon: 'emoji-food-beverage' },
  { id: '9', name: 'Verduras', icon: 'spa' },
  { id: '10', name: 'Outros', icon: 'category' },
];

export const POPULAR_MATERIAL_ICONS = [
  'restaurant', 'local-drink', 'cleaning-services', 'soap', 'bakery-dining',
  'set-meal', 'icecream', 'emoji-food-beverage', 'spa', 'category',
  'shopping-cart', 'local-grocery-store', 'egg', 'cake', 'local-pizza',
  'local-cafe', 'local-bar', 'local-florist', 'local-pharmacy', 'local-offer',
];
