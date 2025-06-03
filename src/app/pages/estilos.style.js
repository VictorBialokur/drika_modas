import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    principalCliente: {
            flex:1, 
            backgroundColor: '#D1B3E0', 
            justifyContent: 'center',
            alignItems: 'center', 
            padding: 10,
            gap: 16,
            paddingTop: -10
    },
    principalCadastroCliente: {
        backgroundColor: '#D1B3E0',
        padding: 15,
        flex: 1
    },
    textoTitulo: {
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'white',
        fontSize: 20,
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1
    },
    texto: {
        flex: 1,
        fontSize: 20,
        flexGrow: 0,
        textAlign: 'left',
        color: 'white',
        marginBottom: 10
    }, 
    clientesContainer: {
        flex: 1,
        backgroundColor: '#7B3FA0',
        flexDirection: 'column',
        gap: 35,
        paddingTop: 20,
        paddingBottom: 25,
        borderRadius: 25,
        paddingLeft: 10,
        paddingRight: 10,
    },
    clientes: {
        marginTop: -20,
        flex: 1
    },
    botaoCadastro: {
        backgroundColor: '#D1B3E0', 
        flex: 1,
        borderRadius: 25, 
        alignSelf: 'center',
        elevation: 5,
        width: '100%'
    },
    botaoCadastroTexto: {
        flex: 1,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#7B3FA0',
        fontSize: 20,
        padding: 20
    },
    cadastroRoupasSelectDropdownBoxStyles: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 25,
        height: 60,
    },
    cadastroRoupasSelectDropdownItems: {
        flex: 1,
        borderRadius: 25,
        alignSelf: 'flex-start'
    },
    cadastroRoupasSelectDropdownStyles: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 25,
    },
    cadastroRoupasSelectDropdownInputText: {
        alignSelf: 'center'
    }
});
export default styles;