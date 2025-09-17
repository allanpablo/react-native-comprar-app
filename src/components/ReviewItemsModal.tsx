import React from "react"
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Category, DEFAULT_CATEGORIES } from "@/types/Category"

export type ReviewItem = {
  id: string
  description: string
  category: Category
  quantity?: number
}

type Props = {
  visible: boolean
  items: ReviewItem[]
  onChangeCategory: (itemId: string, category: Category) => void
  onChangeQuantity: (itemId: string, quantity: number) => void
  onConfirm: () => void
  onCancel: () => void
}

export function ReviewItemsModal({ visible, items, onChangeCategory, onChangeQuantity, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: "#0008", justifyContent: "center", alignItems: "center" }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 20, width: "90%", maxHeight: "80%" }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>Revisar itens</Text>
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 16 }}>{item.description}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                  <Text style={{ marginRight: 8 }}>Qtd:</Text>
                  <TextInput
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 6, width: 50, padding: 4, textAlign: 'center' }}
                    keyboardType="numeric"
                    value={item.quantity ? String(item.quantity) : ''}
                    onChangeText={text => onChangeQuantity(item.id, Number(text) || 1)}
                  />
                </View>
                <FlatList
                  horizontal
                  data={DEFAULT_CATEGORIES}
                  keyExtractor={cat => cat.id}
                  renderItem={({ item: cat }) => (
                    <TouchableOpacity
                      style={{
                        padding: 6,
                        backgroundColor: item.category.id === cat.id ? "#e0e0e0" : "#fff",
                        borderRadius: 8,
                        marginRight: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: item.category.id === cat.id ? 2 : 1,
                        borderColor: item.category.id === cat.id ? "#2196f3" : "#ccc",
                      }}
                      onPress={() => onChangeCategory(item.id, cat)}
                    >
                      <Icon name={cat.icon} size={18} color="#2196f3" />
                      <Text style={{ marginLeft: 4 }}>{cat.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            style={{ marginBottom: 12 }}
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity onPress={onCancel} style={{ marginRight: 16 }}>
              <Text style={{ color: "#2196f3", fontWeight: "bold" }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm}>
              <Text style={{ color: "#2196f3", fontWeight: "bold" }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
