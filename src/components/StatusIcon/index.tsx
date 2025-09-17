import { FilterStatus } from "@/types/FilterStatus";
import { MaterialIcons } from '@expo/vector-icons';

export function StatusIcon({ status }: { status: FilterStatus }) {
  return status === FilterStatus.DONE ? (
    <MaterialIcons name="check-circle" size={18} color="#2C46B1" />
  ) : (    
    <MaterialIcons name="radio-button-unchecked" size={18} color="#000000" />
  )
}