import styles from "@/app/pages/detalhes/detalhes.style";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, TouchableOpacityProps, View, useWindowDimensions } from "react-native";

type Props = TouchableOpacityProps & {
    data: {
        id: number,
        roupa_nome: string,
        tamanho: string,
        cor: string,
        preco: string,
        imagem: string | null,
        quantidadeComprada: number
    }

    onDelete: () => void
    onPlus: () => void
    onMinus: () => void
}
export function RoupasCompradas({data, onDelete, onPlus, onMinus, ...rest}: Props) {
    const { width } = useWindowDimensions();
    return <TouchableOpacity
     style={{
        backgroundColor: '#EFE3F5',
        padding: 15,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        flexDirection: 'row',
        elevation: 10,
        alignSelf: 'center',
    }}
    onPress={() => {router.push(`/pages/detalhes/roupa/${data.id}`)}}
    {...rest}>

        <View style={{flexDirection: 'row', width: width-170}}>

            <View style={{flexDirection: 'column', gap: 7}}>
                <TouchableOpacity onPress={onDelete} style={{alignSelf: 'flex-start'}}>
                        <MaterialIcons name="delete" 
                                        size={25} 
                                        color={'red'} 
                                        style={{marginLeft: -5, marginRight: 7, borderWidth: 0.3}} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onPlus} style={{alignSelf: 'flex-start'}}>
                    <MaterialIcons name='add' size={25} 
                                        color={'black'} 
                                        style={{marginLeft: -5, marginRight: 7, borderWidth: 0.3}}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={onMinus} style={{alignSelf: 'flex-start'}}>
                    <MaterialIcons name='remove' size={25} 
                                        color={'black'} 
                                        style={{marginLeft: -5, marginRight: 7, borderWidth: 0.3}}/>
                </TouchableOpacity>
            </View>        


            {data.imagem && (
                <Image 
                    source={{uri: data.imagem}}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                />
            )}
                
            <View style={styles.roupasCliente}>
                <Text style={{fontWeight: 'bold', color: '#4B006E'}}>
                    {data.roupa_nome}
                </Text>

                <Text style={{fontWeight: 'bold', color: '#4B006E'}}>
                    R$ {Number(data.preco)/100}
                </Text>

                <Text style={{fontWeight: 'bold', color: '#4B006E'}}>
                    Quantidade: {data.quantidadeComprada}
                </Text>
            </View>

        </View>
    </TouchableOpacity>
}

