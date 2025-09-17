import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 7,
  },
  description: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  priceInput: {
    width: 60,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 2,
    marginHorizontal: 5,
    fontSize: 14,
  },
})