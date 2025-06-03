import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps, View, useWindowDimensions } from "react-native";

type Props = TouchableOpacityProps & {
    data: {
        nome: string
        telefone: string
        quantidadeComprada: number

    }
        onDelete: () => void
        onOpen: () => void
        excluirVisivel: boolean
}

export function ClienteComprador({data, excluirVisivel, onDelete, onOpen, ...rest}: Props) {
    const { width } = useWindowDimensions();
    return <TouchableOpacity
    onPress={onOpen}
     style={{
        backgroundColor: '#EFE3F5',
        padding: 15,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        flexDirection: 'row',
        elevation: 10,
        alignSelf: 'center'
    }}
    {...rest}>

        <View style={{flexDirection: 'row', width: width-50}}>


            {excluirVisivel && (
            <TouchableOpacity onPress={onDelete} style={{alignSelf: 'center', justifyContent: 'center'}}>
                    <MaterialIcons name="delete" 
                                    size={25} 
                                    color={'red'} 
                                    style={{marginLeft: -5, marginRight: 7, }} />
            </TouchableOpacity>
            )}
                
            <View style={{flexDirection:'column', gap: 5}}>
                <Text style={{fontWeight: 'bold', color: '#4B006E'}}>
                    Nome     : {data.nome}
                </Text>

                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontWeight: 'bold', color: '#4B006E'}}>
                        Telefone: {data.telefone}
                    </Text>
                    <MaterialIcons name='phone' style={{alignSelf: 'center', paddingLeft: 5, color: '#4B006E'}} size={15} />
                </View>

                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontWeight: 'bold', color: '#4B006E'}}>
                        Comprou: {data.quantidadeComprada}
                    </Text>
                </View>
            </View>

        </View>



    </TouchableOpacity>
}