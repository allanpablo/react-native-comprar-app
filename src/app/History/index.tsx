import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { shoppingsStorage } from '@/storage/shoppingsStorage';
import { Shopping } from '@/types/Shopping';
import { styles } from './styles';

function ShoppingCard({ item }: { item: Shopping }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.shoppingItem}>
      <View style={styles.shoppingHeader}>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.total}>Total: R$ {item.total.toFixed(2).replace('.', ',')}</Text>
      {expanded && (
        <View style={{ marginTop: 10 }}>
          {item.items.map(detail => (
            <View key={detail.id} style={styles.itemDetail}>
              <Text style={styles.itemName}>{detail.description} (x{detail.purchasedQuantity})</Text>
              <Text style={styles.itemPrice}>R$ {(detail.price || 0).toFixed(2).replace('.', ',')}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

export function History() {
  const [shoppings, setShoppings] = useState<Shopping[]>([]);

  async function fetchHistory() {
    try {
      const data = await shoppingsStorage.getAll();
      setShoppings(data.sort((a, b) => b.date - a.date)); // Sort by most recent
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Compras</Text>
      <FlatList
        data={shoppings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ShoppingCard item={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma compra registrada ainda.</Text>}
      />
    </View>
  );
}
