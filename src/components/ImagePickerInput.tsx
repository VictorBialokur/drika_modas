import styles from "@/app/pages/estilos.style";
import { escolheImagemESalvaLocal } from "@/hooks/useImagePicker";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export function ImagePickerInput({ onImagemSelecionada }: { onImagemSelecionada: (uri: string) => void }) {

    const [imagem, setImagem] = useState<string | null>(null)

    const handleSelecionar = async () => {
        const uri = await escolheImagemESalvaLocal();
        if (uri) {
            setImagem(uri);
            onImagemSelecionada(uri);
        }
    };


    return (
        <View style={{flex: 1, gap: 20, padding: 15}}>

            <TouchableOpacity style={styles.botaoCadastro} onPress={handleSelecionar}>
                <Text style={styles.botaoCadastroTexto}>Selecionar Imagem</Text>
            </TouchableOpacity>

            {imagem && (
                <Image 
                    source={{ uri: imagem }}
                    style={{
                        width: 240, 
                        height: 240, 
                        borderRadius: 10, 
                        alignSelf: 'center',
                        
                    }}
                /> 
            )}
            
        </View>
    )
}