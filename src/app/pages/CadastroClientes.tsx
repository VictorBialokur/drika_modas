import { Input } from "@/components/Input";
import { ClienteDatabase, EnderecoDatabase, useClientDatabase } from "@/database/useClientDatabase";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./estilos.style";

export default function CadastroClientes() {
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [cep, setCep] = useState('')
    const [estado, setEstado] = useState('')


    const clientDatabase = useClientDatabase()

    async function inserir(cliente: Omit<ClienteDatabase, 'id' | 'valor_a_pagar'>, 
    endereco: Omit<EnderecoDatabase, 'id'>) {
        try {
            if (!nome || !telefone || !rua || !numero || !cep || !estado || !cpf) {
                return Alert.alert('Campo Vazio', 'Preencha todos os campos')
            }
    
            if (isNaN(Number(telefone))) {
                return Alert.alert('Erro', 'Telefone deve ser um número.')
            } else if(telefone.length != 11) {
                return Alert.alert('Tamanho inválido', 'Número de telefone inválido.')
            }
    
            if (isNaN(Number(numero))) {
                return Alert.alert('Erro', 'Digite um número inteiro para o número de residência.')
            }
    
            if (isNaN(Number(cep))) {
                return Alert.alert('Erro', 'CEP deve ser um número.')
            }

            if (estado.length != 2) {
                return Alert.alert('Tamanho inválido', 'Digite a sigla do estado.')
            }

            if (cpf.length != 11) {
                return Alert.alert('CPF inválido', 'CPF deve ter 11 digitos.')
            }

            await clientDatabase.insertCliente(cliente, endereco)
            Alert.alert('Inserção realizada com sucesso', `${cliente.nome.trim()} inserido com sucesso!`)
            router.replace('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.principalCadastroCliente} edges={['bottom', 'right', 'left']} >
            <Stack.Screen 
            options={{
                headerTitle: 'Cadastro de Clientes',
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
                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Nome: </Text>
                            <Input placeholder="Insira o Nome Completo" onChangeText={setNome} />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>CPF: </Text>
                            <Input placeholder="Insira o CPF" onChangeText={setCpf} maxLength={11} 
                            keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Telefone: </Text>
                            <Input placeholder="Ex: 11940028922" onChangeText={setTelefone} 
                            inputMode="tel"
                            maxLength={11}
                            />
                        </View>

                        <Text style={styles.textoTitulo}>ENDEREÇO</Text>
                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Rua: </Text>
                            <Input placeholder="Insira o nome da rua" onChangeText={setRua} 
                            maxLength={30}
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Número: </Text>
                            <Input placeholder="Insira o número da casa" onChangeText={setNumero} 
                            keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>CEP: </Text>
                            <Input placeholder="Insira o CEP" onChangeText={setCep} 
                            keyboardType="numeric"
                            maxLength={8}
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Estado: </Text>
                            <Input placeholder="Insira a sigla do estado (ex: SP)" 
                                    onChangeText={setEstado} 
                                    maxLength={2} 
                                    autoCapitalize="characters"
                            />
                        </View>
                    
                        <TouchableOpacity style={styles.botaoCadastro}
                            onPress={() => inserir({nome, cpf ,telefone}, {rua, numero, cep, estado})}
                        >
                            <Text style={styles.botaoCadastroTexto}>Cadastrar</Text>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
            </KeyboardAvoidingView>
            
        </SafeAreaView>
    )
}
