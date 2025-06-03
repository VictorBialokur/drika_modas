import { type SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(database: SQLiteDatabase) {
    await database.execAsync(`
        PRAGMA foreign_keys = 1;
        
        CREATE TABLE IF NOT EXISTS endereco(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rua VARCHAR(255) NOT NULL,
            numero INTEGER NOT NULL,
            cep INTEGER NOT NULL,
            estado CHAR(2) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS cliente(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome VARCHAR(255) NOT NULL,
            endereco_id INTEGER,
            telefone VARCHAR(11),
            cpf VARCHAR(11),
            valor_a_pagar INTEGER,
            FOREIGN KEY (endereco_id) REFERENCES endereco(id)  
        );

        CREATE TABLE IF NOT EXISTS roupa(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roupa_nome VARCHAR(255) NOT NULL,
            tamanho VARCHAR(10) NOT NULL,
            preco INTEGER NOT NULL,
            cor VARCHAR(25) NOT NULL,
            quantidade INTEGER NOT NULL, 
            imagem TEXT
        );

        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER NOT NULL,
            roupa_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL,
            FOREIGN KEY (cliente_id) REFERENCES cliente(id),
            FOREIGN KEY (roupa_id) REFERENCES roupa(id)
        );
    `)
}