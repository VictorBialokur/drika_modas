import { MaterialIcons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Input } from '@/components/Input';
import { Roupa } from '@/components/Roupa';
import { RoupaDatabase, useRoupaDatabase } from '@/database/useRoupaDatabase';
import { useVendaDatabase } from '@/database/useVendaDatabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../../estilos.style';

export default function AddRoupas() {
    const [search, setSearch] = useState('')
    const [roupa, setRoupa] = useState<RoupaDatabase[]>([])
    const [cliente_id, setCliente_Id] = useState(0)
    const [roupa_id, setRoupa_id] = useState(0)
    const [quantidade, setQuantidade] = useState(0)
    const [preco, setPreco] = useState(0)
    const [modalVisible, setModalVisible] = useState(false);


    const params = useLocalSearchParams()

    const RoupaDatabase = useRoupaDatabase()
    const VendaDatabase = useVendaDatabase()

    const handleQuantidade = (text: string) => {
        const quantValidado = text.match(/[0-9]+/)
        if (quantValidado) {
            setQuantidade(Number(quantValidado[0]))
        } else {
            Alert.alert('Erro', 'Digite apenas números inteiros.')
        }
    }

    async function addRoupa(cliente_id: number, roupa_id: number, quantidade: number, r_preco: number) {
        try {
            const result = await VendaDatabase.inserir(cliente_id, roupa_id, quantidade, r_preco)
                if (result) {
                    Alert.alert('Roupa Inserida', 'Roupa inserida com sucesso!')
                    router.replace('/')
                } else {
                    Alert.alert('Estoque Indisponível', 'Não possui roupa em estoque.')
                }

        } catch (error) {
            console.log(error)
        }
    }

    async function listar() {
        try {
            const response = await RoupaDatabase.searchByName(search)
            setRoupa(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect (() => {
        setCliente_Id(Number(params.id))
        listar()
    }, [search])
    
    return (
        
        <SafeAreaView  style={styles.principalCliente}>
        <Stack.Screen 
          options={{
              headerTitle: 'Adicionar Roupa',
              headerTitleStyle: {fontWeight:'bold', color: 'white'},
              headerTitleAlign: 'center',
              headerShadowVisible: false,
              headerStyle: {backgroundColor: '#7B3FA0'},
              headerLeft: () => (
                <Pressable>
                    <MaterialIcons 
                        name='arrow-back' size={30}
                        color={'white'}
                        onPress={() => (router.back())}
                        style={{paddingRight: 10}}
                    />
                </Pressable> 
              )
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
                        onDelete={()=> null}
                        excluirVisivel={false}
                        onOpen={() => {
                            setModalVisible(!modalVisible)
                            setRoupa_id(item.id)
                            setPreco(Number(item.preco))
                        }}
                    />
                )}
                contentContainerStyle={{gap:16}}
            />

            <Modal visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)} transparent={true}>
                <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center', width: '80%'}}>
                    <View style={{padding: 35, borderRadius: 30, backgroundColor: '#7B3FA0'}}>
                        
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <MaterialIcons name='close' color={'red'} size={25}/>
                    </TouchableOpacity>

                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontWeight: 'bold', paddingRight: 5}}>Quantidade:</Text>
                        <TextInput placeholder='Quantidade Desejada' 
                        style={{height: 60, width: '75%', backgroundColor: 'white', borderRadius: 25, paddingLeft: 10}} 
                        keyboardType='numeric'
                        onChangeText={handleQuantidade}
                        />
                    </View>

                    <View style={{justifyContent: 'center', alignSelf: 'center', paddingTop: 20}}>
                        <TouchableOpacity style={{backgroundColor: '#D1B3E0', padding: 20, borderRadius: 25, elevation: 5}}
                        onPress={() => addRoupa(cliente_id, roupa_id, quantidade, preco)}
                        >
                            <Text>Adicionar</Text>
                        </TouchableOpacity>
                    </View>

                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    )
}
