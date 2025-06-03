import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

export function Add({...rest}: TouchableOpacityProps) {
    return <TouchableOpacity style={{
        backgroundColor: '#7B3FA0',
        borderRadius: 50,
    }}
    {...rest}>
        <MaterialIcons name='add' size={50} color={'#D1B3E0'} />

        </TouchableOpacity>
}