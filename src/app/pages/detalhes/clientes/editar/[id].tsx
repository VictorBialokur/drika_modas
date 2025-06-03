import { Input } from "@/components/Input";
import { ClienteEnderecoDatabase, useClientDatabase } from "@/database/useClientDatabase";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../../../estilos.style";

export default function Editar() {
    const [id, setId] = useState(0)
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [valor_a_pagar, setValor_a_pagar] = useState(0)
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [cep, setCep] = useState('')
    const [estado, setEstado] = useState('')


    const clientDatabase = useClientDatabase()
    const params = useLocalSearchParams<{ id:string }>()

    const handleValor = (text: string) => {
        const textoCerto = text.replace(',','.')
        const precoValidado = textoCerto.match(/^(\d*\.?\d{0,2})$/)
        if (precoValidado) {
          setValor_a_pagar(Number(precoValidado[0])*100)
        }
      }

    async function update(cliente: ClienteEnderecoDatabase) {
        try {
            await clientDatabase.updateCliente(cliente)
            Alert.alert('Update Completo', 'Update realizado com sucesso!')
            router.replace('/')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (params.id) {
            clientDatabase.mostrar(Number(params.id)).then((resposta) => {
                if (resposta) {
                        setId(Number(params.id)),
                        setNome(resposta.nome),
                        setCpf(resposta.cpf),
                        setTelefone(resposta.telefone),
                        setValor_a_pagar(resposta.valor_a_pagar),
                        setRua(resposta.rua),
                        setNumero(resposta.numero),
                        setCep(resposta.cep),
                        setEstado(resposta.estado)
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
                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Nome: </Text>
                            <Input value={nome} onChangeText={setNome} />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>CPF: </Text>
                            <Input value={cpf} onChangeText={setCpf} maxLength={11} 
                            keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Telefone: </Text>
                            <Input value={telefone} onChangeText={setTelefone} 
                            inputMode="tel"
                            
                            />
                        </View>

                        <Text style={styles.textoTitulo}>ENDEREÇO</Text>
                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Rua: </Text>
                            <Input value={rua} onChangeText={setRua} 
                            maxLength={40}
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Número: </Text>
                            <Input value={String(numero)} onChangeText={setNumero} 
                            keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>CEP: </Text>
                            <Input value={String(cep)} onChangeText={setCep} 
                            keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Estado: </Text>
                            <Input value={estado} 
                                    onChangeText={setEstado} 
                                    maxLength={2} 
                                    autoCapitalize="characters"
                            />
                        </View>

                        <View style={styles.clientes}>
                            <Text style={styles.texto}>Valor a Pagar: </Text>
                            <Input value={String(valor_a_pagar/100)} 
                            onChangeText={handleValor} 
                            keyboardType="numeric"        
                            />
                        </View>
                    
                        <TouchableOpacity style={styles.botaoCadastro}
                        onPress={() => update({nome, telefone, cpf, rua, numero, estado, cep, id, valor_a_pagar})}
                        >
                            <Text style={styles.botaoCadastroTexto}>Confirmar Edição</Text>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
            </KeyboardAvoidingView>
            
        </SafeAreaView>
    )
}
