import { FilterStatus } from "@/types/FilterStatus"
import { Text, View, TouchableOpacity, TextInput } from "react-native"
import { styles } from "./styles"
import { StatusIcon } from "../StatusIcon"
import React from "react"
import { MaterialIcons } from '@expo/vector-icons'

type ItemData = {
  status: FilterStatus
  description: string
  quantity?: number
  purchasedQuantity?: number;
  price?: number
}

type Props = {
  data: ItemData
  onRemove: () => void
  onStatus: () => void
  onPriceChange: (price: number) => void
  onPurchasedQuantityChange: (quantity: number) => void;
}

export function Item({ data, onStatus, onRemove, onPriceChange, onPurchasedQuantityChange }: Props) {
  const [isEditing, setIsEditing] = React.useState(false);

  const isDone = data.status === FilterStatus.DONE;

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.8} onPress={onStatus}>
        <StatusIcon status={data.status} />
      </TouchableOpacity>

      <View style={{flex: 1}}>
        <Text style={[styles.description, isDone && {textDecorationLine: 'line-through'}]}>
          {data.description}
        </Text>
        <Text style={{fontSize: 12, color: '#888'}}>
          Planejado: {data.quantity ?? 1}
        </Text>
      </View>

      {isDone && (
        <>
          <TextInput
            style={styles.priceInput}
            placeholder="Qtd."
            keyboardType="numeric"
            onChangeText={(text) => onPurchasedQuantityChange(Number(text.replace(",", ".")))}
            value={data.purchasedQuantity ? String(data.purchasedQuantity) : ""}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
          />
          <TextInput
            style={styles.priceInput}
            placeholder="Preço"
            keyboardType="numeric"
            onChangeText={(text) => onPriceChange(Number(text.replace(",", ".")))}
            value={data.price ? String(data.price) : ""}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
          />
        </>
      )}

      <TouchableOpacity onPress={onRemove}>
        <MaterialIcons name="delete" size={22} color="#828282" />
      </TouchableOpacity>
    </View>
  )
}