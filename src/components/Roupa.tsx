import { MaterialIcons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

type Props = TouchableOpacityProps & {
    data: {
        roupa_nome: string
        tamanho: string
        preco: string
        cor: string
        quantidade: number
        imagem: string | null
    }
        onDelete: () => void
        onOpen: () => void
        excluirVisivel: boolean
}

export function Roupa({data, excluirVisivel, onDelete, onOpen, ...rest}: Props) {
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
            <TouchableOpacity onPress={onDelete} style={{alignSelf: 'center', justifyContent: 'center'}}
            >
                    <MaterialIcons name="delete" 
                                    size={25} 
                                    color={'red'} 
                                    style={{marginLeft: -5, marginRight: 7, }} />
            </TouchableOpacity>)}
            

            {data.imagem && (
                <Image 
                    source={{uri: data.imagem}}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        marginRight: 12,
                        backgroundColor: '#D1B3E0'
                      }}
                      resizeMode="cover"
                />
            )}
                
            <View style={{flexDirection:'column', gap: 5, flex: 2, flexGrow:1}}>
                
                <View style={{flexDirection: 'row', flex: 1}}>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                        Nome.....:
                    </Text>

                    <Text style={{color: 'white', paddingLeft: 2, paddingRight: 10}}>
                        {data.roupa_nome}
                    </Text>
                </View>
                    
                <View style={{flexDirection: 'row', flex: 3}}>
                    <Text style={{fontWeight: 'bold', color: 'white'}}>
                        Tamanho: 
                    </Text>

                    <Text style={{color: 'white', paddingLeft: 2}}>
                        {data.tamanho}
                    </Text>
                </View>
            </View>

            <View style={{flex: 1, justifyContent: 'flex-end', alignSelf: 'flex-end', paddingLeft: 50}}>
                    <Text style={{fontWeight: 'bold', color: 'white', fontSize: 12}}>
                        Em Estoque: 
                    </Text>

                    <Text style={{fontWeight: 'bold', color:'white' , alignSelf: 'center', fontSize: 12}}>
                        {data.quantidade}
                    </Text>
            </View>
        </View>



    </TouchableOpacity>
}