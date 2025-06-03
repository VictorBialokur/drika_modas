import { TextInput, TextInputProps } from "react-native";
import inputStyle from "./inputStyle";

export function Input({...rest}: TextInputProps) {
    return <TextInput 
    style={inputStyle.estilo}
    {...rest}
    />
}