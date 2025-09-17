import { ItemsStorage } from "@/storage/itemsStorage";

export type Shopping = {
  id: string;
  location: string;
  date: number;
  items: ItemsStorage[];
  total: number;
};
