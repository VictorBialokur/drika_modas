import { ClienteComprador } from "@/components/ClienteComprador";
import { useRoupaDatabase } from "@/database/useRoupaDatabase";
import { Comprador, useVendaDatabase } from "@/database/useVendaDatabase";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../detalhes.style";

export default function RoupaDetalhes() {
    const [data, setData] = useState({
        id: 0,
        roupa_nome: '',
        imagem: '',
        preco: '',
        tamanho: '',
        cor: '',
        quantidade: 0
    })

    const [clientes, setClientes] = useState<Comprador[]>([])

    const params = useLocalSearchParams<{id:string}>()
    const roupaDatabase = useRoupaDatabase()
    const vendaDatabase = useVendaDatabase()

    useEffect(() => {
        
        if (params.id) {
            roupaDatabase.mostrar(Number(params.id)).then((resposta) => {
                if (resposta) {
                    setData({
                        id: resposta.id,
                        roupa_nome: resposta.roupa_nome,
                        preco: resposta.preco,
                        tamanho: resposta.tamanho,
                        cor: resposta.cor,
                        quantidade: resposta.quantidade,
                        imagem: resposta.imagem !== null ? resposta.imagem : ''
                    })
                }
            })

            vendaDatabase.mostrarCliente(Number(params.id)).then((resposta) => {
                if (resposta) {
                    setClientes(resposta)
                }
            })
        }
    },[params.id])

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>

            <Stack.Screen 
            options={{
                headerTitle: data.roupa_nome,
                headerTitleStyle: {fontWeight:'bold', color: 'white', fontSize: 20},
                headerTitleAlign: 'left',
                headerStyle: {backgroundColor: '#7B3FA0'},
                headerLeft: () => (
                    <Pressable>
                        <MaterialIcons 
                            name='arrow-back' size={30}
                            color={'white'}
                            onPress={() => (router.replace('/'))}
                            style={{paddingRight: 10}}
                        />
                    </Pressable> 
                )
            }}/>

            <View style={styles.principalInfoRoupas}>

                {data.imagem && (
                    <Image 
                        source={{uri: data.imagem}}
                        style={{
                            width: 120, 
                            height: 120, 
                            borderRadius: 10, 
                            alignSelf: 'center',
                            backgroundColor: '#D1B3E0'
                          }}
                          resizeMode="cover"
                    />
                )}

                <View style={styles.infoRoupas}>
                    <Text style={styles.textoTitulo}>Tamanho:</Text>
                    <Text style={styles.texto}>
                        {data.tamanho}
                    </Text>
                </View>
                
                <View style={styles.infoRoupas}>
                    <Text style={styles.textoTitulo}>Preço:</Text>
                    <Text style={styles.texto}>
                        R$ {Number(data.preco)/100}
                    </Text>
                </View>

                <View style={styles.infoRoupas}>
                    <Text style={styles.textoTitulo}>Cor:</Text>
                    <Text style={styles.texto}>
                        {data.cor}
                    </Text>
                </View>

                <View style={styles.infoRoupas}>
                    <Text style={styles.textoTitulo}>Quantidade Disponível em Estoque:</Text>
                    <Text style={styles.texto}>
                        {data.quantidade}
                    </Text>
                </View>

                <View style={styles.infoRoupas}>
                    <Text style={styles.textoTitulo}>Clientes que compraram:</Text>
                </View>

            </View>

            <ScrollView style={styles.principalClientesComprador} 
            contentContainerStyle={{justifyContent: 'center', alignSelf: 'center'}}
            >
                {clientes.map((cliente) => {
                    return <ClienteComprador key={cliente.id} data={cliente} 
                    onDelete={() => null}
                    onOpen={()=> router.push(`/pages/detalhes/clientes/${cliente.id}`)}
                    excluirVisivel={false}
                    />
                    })
                }

            </ScrollView>

            <View style={styles.principalBotaoCadastrar}>
                <TouchableOpacity style={styles.botaoCadastrar} 
                onPress={() => router.push(`/pages/detalhes/roupa/editar/${data.id}`)}>

                    <Text style={styles.botaoCadastrarTexto}>
                        Editar
                    </Text>

                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}