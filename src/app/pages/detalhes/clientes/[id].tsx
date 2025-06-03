import { RoupasCompradas } from "@/components/RoupasCompradas";
import { useClientDatabase } from "@/database/useClientDatabase";
import { VendaDatabase, useVendaDatabase } from "@/database/useVendaDatabase";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../detalhes.style";

export default function Detalhes() {
    const [data, setData] = useState({
        id: 0,
        nome: '',
        cpf: '',
        telefone: '',
        valor_a_pagar: 0,
        rua: '',
        numero: '',
        cep: '',
        estado: ''
    })
    const [roupas, setRoupas] = useState<VendaDatabase[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const params = useLocalSearchParams<{id:string}>()
    const clientDatabase = useClientDatabase()
    const vendaDatabase = useVendaDatabase()

    async function remove(roupa_id: number, cliente_id: number, valor_a_pagar: number) {
        try {
            await vendaDatabase.removerUm(roupa_id, cliente_id, valor_a_pagar)
            vendaDatabase.mostrarRoupas(Number(cliente_id)).then((resposta) => {
                if (resposta) {
                    setRoupas(resposta)
                }
            })
            router.replace(`/pages/detalhes/clientes/${params.id}`)
        } catch (error) {
            console.log(error)
        }
    }

    async function onPlus(roupa_id: number, cliente_id: number, sinal: string) {
        try {
        const result = await vendaDatabase.reduzirQuantidade(roupa_id, cliente_id, sinal)
        if (result) {
            router.replace(`/pages/detalhes/clientes/${params.id}`)
        } else {
            Alert.alert('Erro', 'Algo deu errado.')
        }
        
        } catch (error) {
            console.log(error)
        }
    }
    
    async function onMinus(roupa_id: number, cliente_id: number, sinal: string) {
        try {
        const result = await vendaDatabase.reduzirQuantidade(roupa_id, cliente_id, sinal)
        if (result) {
            router.replace(`/pages/detalhes/clientes/${params.id}`)
        } else {
            Alert.alert('Erro', 'Algo deu errado.')
        }
        
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setIsLoading(true)
        if (params.id) {
            try {
                clientDatabase.mostrar(Number(params.id)).then((resposta) => {
                    if (resposta) {
                        setData({
                            nome: resposta.nome,
                            cpf: resposta.cpf,
                            telefone: resposta.telefone,
                            valor_a_pagar: Number(resposta.valor_a_pagar),
                            rua: resposta.rua,
                            numero: resposta.numero,
                            cep: resposta.cep,
                            estado: resposta.estado,
                            id: Number(resposta.id),
                        })
                    }
                })
    
                vendaDatabase.mostrarRoupas(Number(params.id)).then((resposta) => {
                    if (resposta) {
                        setRoupas(resposta)
                    }
                })
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }      
    }},[params.id])

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>

            <Stack.Screen 
            options={{
                headerTitle: data.nome,
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

            <View style={styles.principalInfoCliente}>
              
              <View style={styles.infoCliente}>
                <Text style={styles.textoTitulo}>CPF:</Text>
                <Text style={styles.texto}>
                    {data.cpf}
                </Text>
              </View>

              <View style={styles.infoCliente}>
                <Text style={styles.textoTitulo}>Telefone:</Text>
                <Text style={styles.texto}>
                    {data.telefone}
                </Text>
              </View>

              <View style={styles.infoCliente}>
                <Text style={styles.textoTitulo}>Rua:</Text>
                <Text style={styles.texto}>
                    {data.rua}
                </Text>
              </View>

              <View style={styles.infoCliente}>
                <Text style={styles.textoTitulo}>Número:</Text>
                <Text style={styles.texto}>
                    {data.numero}
                </Text>
              </View>

              <View style={styles.infoCliente}>
                <Text style={styles.textoTitulo}>Estado:</Text>
                <Text style={styles.texto}>
                    {data.estado}
                </Text>
              </View>
                
              <View style={styles.infoCliente}>
                <Text style={styles.textoTitulo}>CEP:</Text>
                <Text style={styles.texto}>
                    {data.cep}
                </Text>
              </View>

              <View style={styles.infoCliente}>
                    <Text style={styles.textoTituloTotalDevido}>Total Devido:</Text> 
                    <Text style={styles.texto}>
                        R$ {data.valor_a_pagar/100}
                    </Text>
              </View>
            
              <View style={styles.infoCliente}>
                <Text style={styles.textoTitulo}>Roupas Compradas: </Text>
              </View>
            </View>
        
            <ScrollView style={styles.principalRoupasCliente} horizontal={true}
            showsHorizontalScrollIndicator={true}
            >
                {roupas.map((roupa) => {
                    return <RoupasCompradas key={roupa.id} data={roupa} 
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
                                    onPress: () => remove(roupa.id, data.id, data.valor_a_pagar)
                                }
                                ]
                                )}
                            onPlus={() => onPlus(roupa.id, data.id, '+')} 
                            onMinus={() => onMinus(roupa.id, data.id, '-')}
                            />
                    })
                }
                <TouchableOpacity style={styles.botaoAdicionarRoupas}
                onPress={() => {
                    router.push({
                        pathname: '/pages/detalhes/clientes/editar/AddRoupas', 
                        params: {id: data.id}})
                }}
                >
                    <MaterialIcons name='add' size={92}/>
                </TouchableOpacity>
            </ScrollView>
            
            <View style={styles.principalBotaoCadastrar}>
                <TouchableOpacity style={styles.botaoCadastrar} 
                onPress={() => router.push(`/pages/detalhes/clientes/editar/${data.id}`)}>

                    <Text style={styles.botaoCadastrarTexto}>
                        Editar
                    </Text>

                </TouchableOpacity>
            </View>           
        </SafeAreaView>
    )
}