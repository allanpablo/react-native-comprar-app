import { Alert, FlatList, Image, Text, TouchableOpacity, View, SectionList } from "react-native";
import { styles } from "./styles";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Filter } from "@/components/Filter";
import { FilterStatus } from "@/types/FilterStatus";
import { DEFAULT_CATEGORIES, Category, POPULAR_MATERIAL_ICONS } from "@/types/Category";
import { MaterialIcons } from '@expo/vector-icons';
import { Item } from "@/components/Item";
import { ReviewItemsModal, ReviewItem } from "@/components/ReviewItemsModal";
import { FinishShoppingModal } from "@/components/FinishShoppingModal";
import { useEffect, useState, useMemo } from "react";
import { itemsStorage, ItemsStorage } from "@/storage/itemsStorage";
import { shoppingsStorage } from "@/storage/shoppingsStorage";

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE];

export function Home() {
  const [filter, setFilter] = useState(FilterStatus.PENDING);
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<ItemsStorage[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORIES[0]);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [customCategoryIcon, setCustomCategoryIcon] = useState("");
  const [reviewVisible, setReviewVisible] = useState(false);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [finishModalVisible, setFinishModalVisible] = useState(false);

  const doneItems = useMemo(() => items.filter(item => item.status === FilterStatus.DONE), [items]);
  const shoppingTotal = useMemo(() => {
    return doneItems.reduce((total, item) => {
      return total + (item.price || 0) * (item.purchasedQuantity || item.quantity || 1);
    }, 0);
  }, [doneItems]);

  function suggestCategory(itemName: string): Category {
    const name = itemName.toLowerCase();
    if (name.match(/(carne|frango|bife|peixe|porco|tempero)/)) return DEFAULT_CATEGORIES.find(c => c.name === 'Carnes')!;
    if (name.match(/(pão|padaria|bolo|torta|croissant|francês|goma|tapioca)/)) return DEFAULT_CATEGORIES.find(c => c.name === 'Padaria')!;
    if (name.match(/(leite|queijo|presunto|frios|iogurte|yougurte|creme de leite)/)) return DEFAULT_CATEGORIES.find(c => c.name === 'Frios')!;
    if (name.match(/(banana|maçã|fruta|laranja|uva|mamão|melão|goiaba|tangerina|manga|melancia|morango|polpa|cajá|maracujá|acerola)/)) return DEFAULT_CATEGORIES.find(c => c.name === 'Frutas')!;
    if (name.match(/(alface|tomate|cenoura|verdura|couve|rúcula|acelga|repolho|batata|macaxeira|brócolis|couve flor)/)) return DEFAULT_CATEGORIES.find(c => c.name === 'Verduras')!;
    if (name.match(/(detergente|sabão|limpeza|desinfetante|cloro)/)) return DEFAULT_CATEGORIES.find(c => c.name === 'Limpeza')!;
    if (name.match(/(shampoo|sabonete|higiene|creme|escova|fraldas|desodorante)/)) return DEFAULT_CATEGORIES.find(c => c.name === 'Higiene')!;
    if (name.match(/(cerveja|refrigerante|suco|bebida|vinho)/)) return DEFAULT_CATEGORIES.find(c => c.name === 'Bebidas')!;
    if (name.match(/(arroz|feijão|macarrão|alimento|farinha|óleo|açúcar)/)) return DEFAULT_CATEGORIES.find(c => c.name === 'Alimentos')!;
    return DEFAULT_CATEGORIES[0];
  }

  function extractQuantity(itemName: string): number | null {
    const match = itemName.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  async function handleAdd() {
    if (!description.trim()) {
      return Alert.alert("Adicionar", "Informe a descrição para adicionar.");
    }

    let itemsList: string[] = [];
    let raw = description.replace(/\n/g, ',');
    raw.split(',').forEach(item => {
      if (item.includes(':')) {
        const [_, sublist] = item.split(':');
        itemsList.push(...sublist.split(',').map(i => i.trim()).filter(i => i.length > 0));
      } else {
        itemsList.push(item.trim());
      }
    });
    itemsList = itemsList.filter(i => i.length > 0);

    if (itemsList.length > 1) {
      const newItems: ReviewItem[] = itemsList.map(itemName => ({
        id: Math.random().toString(36).substring(2, 9),
        description: itemName.replace(/\(.*\)/, '').replace(/\d+/, '').trim(),
        category: suggestCategory(itemName),
        quantity: extractQuantity(itemName) ?? 1,
        purchasedQuantity: extractQuantity(itemName) ?? 1,
      }));
      setReviewItems(newItems);
      setReviewVisible(true);
      return;
    }

    let finalCategory = category;
    if (category.name === "Outros") {
      if (!customCategoryName.trim() || DEFAULT_CATEGORIES.some(c => c.name.toLowerCase() === customCategoryName.trim().toLowerCase())) {
        return Alert.alert("Categoria", "Informe um nome válido e único para a nova categoria.");
      }
      if (!customCategoryIcon.trim()) {
        return Alert.alert("Categoria", "Selecione um ícone para a nova categoria.");
      }
      finalCategory = {
        id: Math.random().toString(36).substring(2, 9),
        name: customCategoryName,
        icon: customCategoryIcon,
      };
    }

    const newItem: ItemsStorage = {
      id: Math.random().toString(36).substring(2, 9),
      description: description,
      status: FilterStatus.PENDING,
      category: finalCategory,
      quantity: 1,
      purchasedQuantity: 1,
    };

    await itemsStorage.add(newItem);
    await itemsByStatus();

    Alert.alert("Adicionado", `Adicionado ${description}`);
    setDescription("");
    setCategory(DEFAULT_CATEGORIES[0]);
    setCustomCategoryName("");
    setCustomCategoryIcon("");
  }

  function handleChangeReviewCategory(itemId: string, newCategory: Category) {
    setReviewItems(currentItems =>
      currentItems.map(item => (item.id === itemId ? { ...item, category: newCategory } : item))
    );
  }

  function handleChangeReviewQuantity(itemId: string, quantity: number) {
    setReviewItems(currentItems =>
      currentItems.map(item => (item.id === itemId ? { ...item, quantity } : item))
    );
  }

  async function handleConfirmReview() {
    try {
      for (const item of reviewItems) {
        await itemsStorage.add({
          id: item.id,
          description: item.description,
          status: FilterStatus.PENDING,
          category: item.category,
          quantity: item.quantity,
          purchasedQuantity: item.quantity,
        });
      }
      await itemsByStatus();
      setReviewVisible(false);
      setReviewItems([]);
      setDescription("");
      Alert.alert("Adicionado", `Adicionados ${reviewItems.length} itens da lista.`);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível salvar os itens da lista.");
    }
  }

  async function itemsByStatus() {
    try {
      const response = await itemsStorage.getByStatus(filter);
      setItems(response);
      
      const grouped = response.reduce((acc, item) => {
        const catName = item.category?.name || "Sem categoria";
        if (!acc[catName]) {
          acc[catName] = {
            title: catName,
            icon: item.category?.icon || 'category',
            data: []
          };
        }
        acc[catName].data.push(item);
        return acc;
      }, {} as Record<string, { title: string; icon: string; data: ItemsStorage[] }>);

      const sectionsData = Object.values(grouped);
      setSections(sectionsData);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível filtrar os itens.");
    }
  }

  function handlePriceChange(itemId: string, price: number) {
    setItems(currentItems =>
      currentItems.map(item => (item.id === itemId ? { ...item, price } : item))
    );
  }

  function handlePurchasedQuantityChange(itemId: string, quantity: number) {
    setItems(currentItems =>
      currentItems.map(item => (item.id === itemId ? { ...item, purchasedQuantity: quantity } : item))
    );
  }

  async function handleFinishShopping(location: string) {
    try {
      const doneItemsToSave = items.filter(item => item.status === FilterStatus.DONE);
      if (doneItemsToSave.length === 0) {
        return Alert.alert("Finalizar", "Nenhum item foi marcado como comprado.");
      }

      const total = doneItemsToSave.reduce((acc, item) => acc + (item.price || 0) * (item.purchasedQuantity || 1), 0);

      const newShopping = {
        id: Math.random().toString(36).substring(2, 9),
        location,
        date: new Date().getTime(),
        items: doneItemsToSave,
        total,
      };

      await shoppingsStorage.save(newShopping);

      const remainingItems = items.filter(item => item.status === FilterStatus.PENDING);
      await itemsStorage.save(remainingItems);

      await itemsByStatus();
      setFinishModalVisible(false);
      Alert.alert("Compra finalizada!", `Sua compra no local "${location}" foi salva com sucesso.`);

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível finalizar a compra.");
    }
  }

  async function handleRemove(id: string) {
    try {
      await itemsStorage.remove(id);
      await itemsByStatus();
    } catch (error) {
      console.log(error);
      Alert.alert("Remover", "Não foi possível remover o item.");
    }
  }

  function handleClear() {
    Alert.alert("Limpar", "Deseja remover todos?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: onClear }
    ]);
  }

  async function onClear() {
    try {
      await itemsStorage.clear();
      await itemsByStatus();
    } catch (error) {
      console.log(error);
      Alert.alert("Limpar", "Não foi possível remover todos os itens.");
    }
  }

  async function handleToggleItemStatus(id: string) {
    try {
      const allItems = await itemsStorage.get();
      const updatedItems = allItems.map((item) => {
        if (item.id === id) {
          const newStatus = item.status === FilterStatus.PENDING ? FilterStatus.DONE : FilterStatus.PENDING;
          return {
            ...item,
            status: newStatus,
            purchasedQuantity: item.purchasedQuantity ?? item.quantity,
          };
        }
        return item;
      });
      await itemsStorage.save(updatedItems);
      await itemsByStatus();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    }
  }

  useEffect(() => {
    itemsByStatus();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/logo.png')} style={styles.logo} />

      <View style={styles.form}>
        <Input 
          placeholder="O que você precisa comprar?" 
          onChangeText={setDescription}
          value={description}
        />
        <Text style={{marginTop: 8, fontWeight: 'bold'}}>Categoria:</Text>
        <FlatList
          horizontal
          data={DEFAULT_CATEGORIES}
          keyExtractor={cat => cat.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 8,
                backgroundColor: category.id === item.id ? '#e0e0e0' : '#fff',
                borderRadius: 8,
                marginRight: 8,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: category.id === item.id ? 2 : 1,
                borderColor: category.id === item.id ? '#2196f3' : '#ccc',
              }}
              onPress={() => setCategory(item)}
            >
              <MaterialIcons name={item.icon as any} size={20} color="#2196f3" />
              <Text style={{marginLeft: 4}}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={{marginVertical: 8}}
        />
        {category.name === "Outros" && (
          <View style={{marginBottom: 8, backgroundColor: '#f7f7f7', borderRadius: 8, padding: 8}}>
            <Text style={{fontWeight: 'bold', marginBottom: 4}}>Nova categoria</Text>
            <Input
              placeholder="Nome da nova categoria"
              value={customCategoryName}
              onChangeText={setCustomCategoryName}
              style={{marginBottom: 4, backgroundColor: '#fff', borderColor: '#2196f3'}}
            />
            {customCategoryName.trim() && DEFAULT_CATEGORIES.some(cat => cat.name.toLowerCase() === customCategoryName.trim().toLowerCase()) && (
              <Text style={{color: 'red', fontSize: 12, marginBottom: 4}}>Já existe uma categoria com esse nome.</Text>
            )}
            {!customCategoryName.trim() && (
              <Text style={{color: 'red', fontSize: 12, marginBottom: 4}}>Informe o nome da categoria.</Text>
            )}
            <Text style={{marginBottom: 4}}>Selecione um ícone:</Text>
            <FlatList
              horizontal
              data={POPULAR_MATERIAL_ICONS}
              keyExtractor={icon => icon}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 8,
                    backgroundColor: customCategoryIcon === item ? '#e0e0e0' : '#fff',
                    borderRadius: 8,
                    marginRight: 8,
                    borderWidth: customCategoryIcon === item ? 2 : 1,
                    borderColor: customCategoryIcon === item ? '#2196f3' : '#ccc',
                  }}
                  onPress={() => setCustomCategoryIcon(item)}
                >
                  <MaterialIcons name={item as any} size={28} color="#2196f3" />
                </TouchableOpacity>
              )}
              style={{marginBottom: 8}}
            />
            {!customCategoryIcon && (
              <Text style={{color: 'red', fontSize: 12, marginBottom: 4}}>Selecione um ícone.</Text>
            )}
            {customCategoryIcon ? (
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}>
                <MaterialIcons name={customCategoryIcon as any} size={28} color="#2196f3" />
                <Text style={{marginLeft: 8}}>Ícone selecionado: {customCategoryIcon}</Text>
              </View>
            ) : null}
          </View>
        )}
        <Button title="Adicionar" onPress={handleAdd} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => (
            <Filter
               key={status}
               status={status} 
               isActive={filter === status}
               onPress={() => setFilter(status)} 
            />
          ))}

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item
              data={item}
              onStatus={() => handleToggleItemStatus(item.id)}
              onRemove={() => handleRemove(item.id)}
              onPriceChange={(price) => handlePriceChange(item.id, price)}
              onPurchasedQuantityChange={(quantity) => handlePurchasedQuantityChange(item.id, quantity)}
            />
          )}
          renderSectionHeader={({ section }) => (
            <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 8}}>
              <MaterialIcons name={section.icon as any} size={20} color="#2196f3" />
              <Text style={{marginLeft: 6, fontWeight: 'bold', fontSize: 16}}>{section.title}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => <Text style={styles.empty}>Nenhum item aqui.</Text>}
        />

        {doneItems.length > 0 && (
          <Button
            title={`Finalizar Feira (R$ ${shoppingTotal.toFixed(2).replace('.', ',')})`}
            onPress={() => setFinishModalVisible(true)}
            style={{ marginTop: 10, backgroundColor: '#4CAF50' }}
          />
        )}
      </View>

      <ReviewItemsModal
        visible={reviewVisible}
        items={reviewItems}
        onChangeCategory={handleChangeReviewCategory}
        onChangeQuantity={handleChangeReviewQuantity}
        onConfirm={handleConfirmReview}
        onCancel={() => { setReviewVisible(false); setReviewItems([]); }}
      />

      <FinishShoppingModal
        visible={finishModalVisible}
        total={shoppingTotal}
        onConfirm={handleFinishShopping}
        onCancel={() => setFinishModalVisible(false)}
      />
    </View>
  )
}