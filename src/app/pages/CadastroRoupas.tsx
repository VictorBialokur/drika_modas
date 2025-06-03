import { Input } from "@/components/Input";
import { RoupaDatabase, useRoupaDatabase } from "@/database/useRoupaDatabase";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./estilos.style";

import { ImagePickerInput } from "@/components/ImagePickerInput";
import { useClientDatabase } from "@/database/useClientDatabase";
import { useVendaDatabase } from "@/database/useVendaDatabase";
import { SelectList } from 'react-native-dropdown-select-list';

export default function CadastroRoupas() {
    const [imagem, setImagem] = useState<string | null>(null)
    const [roupa_nome, setRoupa_Nome] = useState('')
    const [tamanho, setTamanho] = useState('')
    const [preco, setPreco] = useState('')
    const [cor, setCor] = useState('')
    const [quantidade, setQuantidade] = useState(0)
    const [cliente_id, setCliente_id] = useState(0)
    const [selecionado, setSelecionado] = useState('')
    const [clientes, setClientes] = useState<{}[]>([])

    const clienteDatabase = useClientDatabase()
    const roupaDatabase = useRoupaDatabase()
    const vendaDatabase = useVendaDatabase()

    const handlePreco = (text: string) => {
        const textoCerto = text.replace(',','.')
        const precoValidado = textoCerto.match(/^(\d*\.?\d{0,2})$/)
        if (precoValidado) {
          setPreco(String(Number(precoValidado[0])*100))
        }
      }

    const handleQuantidade = (text: string) => {
        const quantValidado = text.match(/[0-9]+$/)
        if (quantValidado) {
            setQuantidade(Number(quantValidado))
        } else {
            Alert.alert('Erro', 'Digite apenas números inteiros.')
        }
    }

    async function listarClientes() {
        try {
            clienteDatabase.searchByName('').then(
                (resposta) => {
                    let novaLista = resposta.map((item) => {
                        return {key: item.id, value: item.nome}
                    })
                    setClientes(novaLista)
                })
            
        } catch (error) {
            console.log(error)
        }
    }

    async function inserir(roupa: Omit<RoupaDatabase, 'id'>) {
        try {
            if (!roupa_nome || !tamanho || !preco || !cor) {
                return Alert.alert('Campo Vazio', 'Preencha todos os campos')
            }
    
            if(isNaN(Number(preco))) {
                return Alert.alert('Preço Inválido', 'Preço deve ser um número.')
            }
            
            const roupa_id = await roupaDatabase.insertRoupa(roupa)
            
            if (cliente_id !== 0) {
                const lastId = roupa_id? roupa_id : 0
                if(await vendaDatabase.inserir(cliente_id, lastId, 1, Number(preco))) {
                    Alert.alert('Inserção realizada com sucesso', `${roupa.roupa_nome} inserida com sucesso!`)
                    router.replace('/')
                } else {
                    Alert.alert('Estoque Indisponível', 'Não possui roupa em estoque.')
                }
            } else {
                Alert.alert('Inserção realizada com sucesso', `${roupa.roupa_nome} inserida com sucesso!`)
                router.replace('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        listarClientes()
    },[])


    return (
        <SafeAreaView style={styles.principalCadastroCliente} edges={['bottom', 'right', 'left']} >
            <Stack.Screen 
            options={{
                headerTitle: 'Cadastro de Roupas',
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

                        <ImagePickerInput onImagemSelecionada={setImagem} />

                        <Text style={styles.textoTitulo}>DADOS DA ROUPA</Text>
                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Nome: </Text>
                            <Input placeholder="Insira o Nome Completo" onChangeText={setRoupa_Nome} 
                            autoCapitalize="words"
                            maxLength={40}
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Tamanho: </Text>
                            <Input placeholder="Insira o tamanho da roupa" 
                            onChangeText={setTamanho} 
                            maxLength={11} 
                            autoCapitalize='characters'
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Preço: </Text>
                            <Input placeholder="Insira o preço" onChangeText={handlePreco}
                            keyboardType="number-pad" 
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Cor: </Text>
                            <Input placeholder="Insira a cor da Roupa" onChangeText={setCor} />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Quantidade em Estoque: </Text>
                            <Input placeholder="Insira a quantidade." onChangeText={handleQuantidade}
                            keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>(Opcional) Cliente que comprou:</Text>
                            <SelectList 
                                setSelected={(val: string) => {
                                    setSelecionado(val)
                                    setCliente_id(Number(val))
                                }} 
                                data={clientes} 
                                save='key'
                                placeholder="Escolha o Cliente"
                                boxStyles={styles.cadastroRoupasSelectDropdownBoxStyles}
                                inputStyles={styles.cadastroRoupasSelectDropdownInputText}
                                dropdownStyles={styles.cadastroRoupasSelectDropdownStyles}
                                dropdownItemStyles={styles.cadastroRoupasSelectDropdownItems}
                                searchPlaceholder='Pesquisar pelo nome.'
                                arrowicon={<MaterialIcons name='arrow-drop-down' size={35} />}
                            />
                        </View>
                        <TouchableOpacity style={styles.botaoCadastro}
                            onPress={() => inserir({imagem, roupa_nome, tamanho, preco, cor, quantidade})}
                        >
                            <Text style={styles.botaoCadastroTexto}>Cadastrar</Text>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
            </KeyboardAvoidingView>
            
        </SafeAreaView>
    )
}
