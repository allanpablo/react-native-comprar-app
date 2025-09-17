import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Alert } from 'react-native';
import { styles } from './styles';
import { Button } from '../Button';

type Props = {
  visible: boolean;
  total: number;
  onConfirm: (location: string) => void;
  onCancel: () => void;
};

export function FinishShoppingModal({ visible, total, onConfirm, onCancel }: Props) {
  const [location, setLocation] = useState('');

  function handleConfirm() {
    if (!location.trim()) {
      return Alert.alert("Localização", "Por favor, informe o local da compra.");
    }
    onConfirm(location);
    setLocation('');
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Finalizar Compra</Text>
          <Text style={styles.totalText}>
            Total: R$ {total.toFixed(2).replace('.', ',')}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Local da compra (ex: Supermercado X)"
            onChangeText={setLocation}
            value={location}
          />

          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={onCancel} style={{ flex: 1, marginRight: 10, backgroundColor: '#f44336' }} />
            <Button title="Confirmar" onPress={handleConfirm} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
