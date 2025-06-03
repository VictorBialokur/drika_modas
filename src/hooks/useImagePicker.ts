import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export async function escolheImagemESalvaLocal(): Promise<string | null> {

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria.');
        return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7
    });

    if (!result.canceled && result.assets.length > 0) {
        const uriOriginal = result.assets[0].uri;
        const nomeArquivo = uriOriginal.split('/').pop();

        const documentoDir = FileSystem.documentDirectory;

        if (!documentoDir) {
            throw new Error('Diretório do documento não está disponível');
        }

        const caminhoDestino = documentoDir + nomeArquivo;

        try {
            await FileSystem.copyAsync({
                from: uriOriginal,
                to: caminhoDestino,
            });
            return caminhoDestino;
        } catch (error) {
            console.error('Erro ao salvar imagem: ', error);
            Alert.alert('Erro', 'Não foi possível salvar a imagem.')
        }
    }

    return null;
}