import { MaterialIcons } from '@expo/vector-icons';
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, View } from 'react-native';

import { Add } from '@/components/Add';
import { Roupa } from '@/components/Roupa';
import { RoupaDatabase, useRoupaDatabase } from '@/database/useRoupaDatabase';
import { useVendaDatabase } from '@/database/useVendaDatabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from "../../components/Input";
import styles from './estilos.style';

export default function Roupas() {
    const [search, setSearch] = useState('')
    const [roupa, setRoupa] = useState<RoupaDatabase[]>([])

    const RoupaDatabase = useRoupaDatabase()
    const VendaDatabase = useVendaDatabase()

    async function listar() {
        try {
            const response = await RoupaDatabase.searchByName(search)
            setRoupa(response)
        } catch (error) {
            console.log(error)
        }
    }

    async function remove(id: number) {
        try {
            await VendaDatabase.removerTodos(id)
            await RoupaDatabase.remove(id)
            listar()
            Alert.alert('Roupa excluída com Sucesso!')
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
                data={roupa}
                keyExtractor={(item) => String(item.id)}
                renderItem={({item}) => (
                    <Roupa 
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
                        onOpen={() => router.push(`/pages/detalhes/roupa/${item.id}`)}
                    />
                )}
                contentContainerStyle={{gap:16}}
            />
            
            <View style={{alignSelf: 'center'}}>
                <Add onPress={() => router.push('/pages/CadastroRoupas')} />
            </View>

        </SafeAreaView>
    )
}
