import AsyncStorage from "@react-native-async-storage/async-storage";
import { Shopping } from "@/types/Shopping";

const SHOPPINGS_STORAGE_KEY = "@comprar:shoppings";

async function getAll(): Promise<Shopping[]> {
  try {
    const storage = await AsyncStorage.getItem(SHOPPINGS_STORAGE_KEY);
    return storage ? JSON.parse(storage) : [];
  } catch (error) {
    throw new Error("SHOPPINGS_GET_ALL: " + error);
  }
}

async function save(shopping: Shopping): Promise<void> {
  try {
    const allShoppings = await getAll();
    const updatedShoppings = [...allShoppings, shopping];
    await AsyncStorage.setItem(SHOPPINGS_STORAGE_KEY, JSON.stringify(updatedShoppings));
  } catch (error) {
    throw new Error("SHOPPINGS_SAVE: " + error);
  }
}

export const shoppingsStorage = {
  getAll,
  save,
};
