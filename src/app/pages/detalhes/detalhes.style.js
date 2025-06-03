import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
            flex:1, 
            backgroundColor: '#D1B3E0', 
            justifyContent: 'center',
            alignItems: 'center', 
            padding: 10,
    },
    principalInfoCliente: {
        flex: 3,
        backgroundColor: '#7B3FA0',
        flexDirection: 'column',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        width: '100%',
    },
    infoCliente: {
        padding: 20,
        gap: 15,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
    },
    principalInfoRoupas: {
        flex: 3,
        backgroundColor: '#7B3FA0',
        flexDirection: 'column',
        paddingTop: 25,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        gap: 15,
        alignItems: 'center',
        width: '100%',
    },
    infoRoupas: {
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
    },
    principalRoupasCliente: {
        backgroundColor: '#7B3FA0',
        flexDirection: 'row',
        width: '100%',
        flex: 1
    },
    roupasCliente: {
        padding: 15,
        flexDirection:'column',
    },
    principalClientesComprador: {
        backgroundColor: '#7B3FA0',
        flexDirection: 'column',
        paddingBottom: 60,
        paddingRight: 25,
        paddingLeft: 25,
        width: '100%',
        flex: 1,
    },
    principalBotaoCadastrar: {
        backgroundColor: '#7B3FA0',
        flex: 0.5,
        width: '100%',
        padding: 10,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    botaoCadastrar: {
        backgroundColor: '#D1B3E0',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 25, 
        width: '50%',
        elevation: 5,
        flex: 1,
        padding: 10
    },
    botaoAdicionarRoupas: {
        backgroundColor: '#EFE3F5',
        padding: 15,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        flexDirection: 'row',
        elevation: 10,
        alignSelf: 'center',
    },
    botaoCadastrarTexto: {
        fontWeight: 'bold',
        alignSelf: 'center',
        alignItems: 'center',
        color: '#7B3FA0',
        fontSize: 20,
        
    },
    textoTitulo: {
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'white',
        fontSize: 20,
        flex: 1.1,
        flexShrink: 0
    },
    texto: {
        fontSize: 20,
        textAlign: 'left',
        alignSelf: 'center',
        color: 'white',
        flex: 2,
    },
    textoTituloTotalDevido: {
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'white',
        fontSize: 15,
        paddingRight: 15,
        flex: 1,
        flexShrink: 0
    },
});
export default styles;