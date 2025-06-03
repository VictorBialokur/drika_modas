import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type Props = TouchableOpacityProps & {
    data: {
        nome: string
        telefone: string
        valor_a_pagar: number

    }
        onDelete: () => void
        onOpen: () => void
        excluirVisivel: boolean
}

export function Cliente({data, excluirVisivel, onDelete, onOpen, ...rest}: Props) {

    return <TouchableOpacity
    onPress={onOpen}
     style={{
        backgroundColor: '#7B3FA0',
        padding: 15,
        borderRadius: 5,
        flexDirection: 'row',
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        elevation: 10
    }}
    {...rest}>

        <View style={{flexDirection: 'row', width: '100%'}}>


            {excluirVisivel && (
            <TouchableOpacity onPress={onDelete} style={{alignSelf: 'center', justifyContent: 'center'}}>
                    <MaterialIcons name="delete" 
                                    size={25} 
                                    color={'red'} 
                                    style={{marginLeft: -5, marginRight: 7, }} />
            </TouchableOpacity>
            )}
                
            <View style={{flexDirection:'column', gap: 5}}>
                <Text style={{fontWeight: 'bold', color: 'white'}}>
                    Nome....: {data.nome}
                </Text>

                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                        Telefone: {data.telefone}
                    </Text>
                    <MaterialIcons name='phone' style={{alignSelf: 'center', paddingLeft: 5, color: 'white'}} size={15} />
                </View>

                <Text style={{fontWeight: 'bold', color: 'white'}}>
                    Deve: R$ {data.valor_a_pagar/100}
                </Text>
            </View>

        </View>



    </TouchableOpacity>
}