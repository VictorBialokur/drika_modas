import { ImagePickerInput } from "@/components/ImagePickerInput";
import { Input } from "@/components/Input";
import { RoupaDatabase, useRoupaDatabase } from "@/database/useRoupaDatabase";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../../estilos.style";

export default function EditarRoupas() {
    const [id, setId] = useState(0)
    const [imagem, setImagem] = useState<string | null>(null)
    const [roupa_nome, setRoupa_Nome] = useState('')
    const [tamanho, setTamanho] = useState('')
    const [preco, setPreco] = useState('')
    const [cor, setCor] = useState('')
    const [quantidade, setQuantidade] = useState(0)

    const RoupaDatabase = useRoupaDatabase()
    const params = useLocalSearchParams<{ id:string }>()

    const handleQuantidade = (text: string) => {
        const quantValidado = text.match(/[0-9]+/)
        if (quantValidado) {
            setQuantidade(Number(quantValidado))
        } else {
            Alert.alert('Erro', 'Digite apenas números inteiros.')
        }
    }


    async function update(roupa: RoupaDatabase) {
        try {
            await RoupaDatabase.updateRoupa(roupa)
            Alert.alert('Update Completo', 'Update realizado com sucesso!')
            router.replace('/')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (params.id) {
            RoupaDatabase.mostrar(Number(params.id)).then((resposta) => {
                if (resposta) {
                        setId(Number(params.id)),
                        setRoupa_Nome(resposta.roupa_nome),
                        setPreco(resposta.preco),
                        setTamanho(resposta.tamanho),
                        setCor(resposta.cor),
                        setQuantidade(resposta.quantidade),
                        setImagem(resposta.imagem)
                }
            })
        }
    },[params.id])

    return (
        <SafeAreaView style={styles.principalCadastroCliente} edges={['bottom', 'right', 'left']} >
            <Stack.Screen 
            options={{
                headerTitle: 'Editar Cliente',
                headerTitleStyle: {fontWeight:'bold', color: 'white'},
                headerTitleAlign: 'center',
                headerStyle: {backgroundColor: '#7B3FA0'},
                headerLeft: () => (
                    <Pressable>
                        <MaterialIcons 
                            name='arrow-back' size={30}
                            color={'white'}
                            onPress={() => (router.back())}
                        />
                    </Pressable> 
                )
            }}/>
            <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={100} style={{flex: 1}}>
                <ScrollView style={{width: '100%'}} 
                contentContainerStyle={{flexGrow: 1}}
                showsVerticalScrollIndicator={false}
                > 
                    <View style={styles.clientesContainer}>

                        <Text style={styles.textoTitulo}>DADOS DO CLIENTE</Text>

                        <ImagePickerInput onImagemSelecionada={setImagem} />

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Nome: </Text>
                            <Input value={roupa_nome} onChangeText={setRoupa_Nome} />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Tamanho: </Text>
                            <Input value={tamanho} onChangeText={setTamanho} maxLength={11} 
                            keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Cor: </Text>
                            <Input value={cor} onChangeText={setCor} 
                            inputMode="tel"
                            
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Quantidade Disponível em Estoque: </Text>
                            <Input value={String(quantidade)} onChangeText={handleQuantidade} 
                            maxLength={40}
                            />
                        </View>

                    
                        <TouchableOpacity style={styles.botaoCadastro}
                        onPress={() => update({id, roupa_nome, tamanho, cor, preco, quantidade, imagem})}
                        >
                            <Text style={styles.botaoCadastroTexto}>Confirmar Edição</Text>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
            </KeyboardAvoidingView>
            
        </SafeAreaView>
    )
}
