import { MaterialIcons } from '@expo/vector-icons';
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, View } from 'react-native';

import { Add } from '@/components/Add';
import { Cliente } from '@/components/Cliente';
import { ClienteDatabase, useClientDatabase } from '@/database/useClientDatabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from "../../components/Input";
import styles from './estilos.style';

export default function Clientes() {
    const [search, setSearch] = useState('')
    const [cliente, setCliente] = useState<ClienteDatabase[]>([])

    const clientDatabase = useClientDatabase()

    async function listar() {
        try {
            const response = await clientDatabase.searchByName(search)
            setCliente(response)
        } catch (error) {
            console.log(error)
        }
    }

    async function remove(id: number) {
        try {
            await clientDatabase.remove(id)
            listar()
            Alert.alert('Cliente excluído com Sucesso!')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect (() => {
        listar()
    }, [search])
    
    return (
        
        <SafeAreaView  style={styles.principalCliente}>
        <Stack.Screen 
          options={{
              headerTitle: 'Drika Modas',
              headerTitleStyle: {fontWeight:'bold', color: 'white'},
              headerTitleAlign: 'center',
              headerShadowVisible: false,
              headerStyle: {backgroundColor: '#7B3FA0'},
              headerBackVisible: false,
            }}/>
            
            <View style={{flexDirection: 'row', backgroundColor: 'white', borderRadius: 25}}>
                <Input placeholder='Pesquisar' onChangeText={setSearch} inputMode='search'/>
                
                <MaterialIcons name='search' size={55} style={{opacity: 0.3}} />
            </View>

            <FlatList 
                data={cliente}
                keyExtractor={(item) => String(item.id)}
                renderItem={({item}) => (
                    <Cliente 
                        data={item}
                        excluirVisivel={true}
                        onDelete = {() => Alert.alert(
                        'Excluir', 
                        'Você tem certeza que quer excluir?',
                        [
                        {
                            text: 'Cancelar',
                            style: 'cancel'
                        },
                        {
                            text: 'Excluir',
                            onPress: () => remove(item.id),
                        }
                        ]
                        )}
                        onOpen={() => router.push(`/pages/detalhes/clientes/${item.id}`)}
                    />
                )}
                contentContainerStyle={{gap:16}}
            />
            
            <View style={{alignSelf: 'center'}}>
                <Add onPress={() => router.push('/pages/CadastroClientes')} />
            </View>

        </SafeAreaView>
    )
}
