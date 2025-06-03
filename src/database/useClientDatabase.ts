import { useSQLiteContext } from "expo-sqlite";

export type ClienteDatabase = {
    id: number
    nome: string
    telefone: string
    cpf: string
    valor_a_pagar: number
}

export type EnderecoDatabase = {
    id: number
    rua: string
    numero: string
    cep: string
    estado: string
}

export type ClienteEnderecoDatabase = ClienteDatabase & EnderecoDatabase

export function useClientDatabase() {
    const database = useSQLiteContext()

    async function insertCliente (cliente: Omit<ClienteDatabase, 'id' | 'valor_a_pagar'>, endereco: Omit<EnderecoDatabase, 'id'>) {

        const statement1 = await database.prepareAsync(
            `INSERT INTO endereco (rua, numero, cep, estado) VALUES ($rua, $numero, $cep, $estado)`
        )

        const statement2 = await database.prepareAsync(
            `INSERT INTO cliente (nome, endereco_id, telefone, cpf, valor_a_pagar) VALUES ($nome, last_insert_rowid(), $telefone, $cpf, $valor_a_pagar)`
        )

        try {
            await statement1.executeAsync({
                $rua: endereco.rua.trim(),
                $numero: endereco.numero.trim(),
                $cep: endereco.cep.trim(),
                $estado: endereco.estado.trim(),
            })

            await statement2.executeAsync({
                $nome: cliente.nome.trim(),
                $telefone: String(cliente.telefone).trim(),
                $cpf: cliente.cpf.trim(),
                $valor_a_pagar: 0
            })
        } catch (error) {
            throw error
        } finally {
            await statement1.finalizeAsync()
            await statement2.finalizeAsync()
        }
    }

    async function searchByName(nome: string) {
        try {
            const query =  'SELECT * from cliente WHERE nome LIKE ?'

            const response = await database.getAllAsync<ClienteDatabase>(query, `%${nome}%`)

            return response
        } catch (error) {
            throw error
        }
        
    }

    async function remove(id: number) {
        try {
            await database.execAsync(
                `DELETE FROM vendas WHERE cliente_id = ${id}`
            )

            await database.execAsync(
                'DELETE FROM cliente WHERE id = ' + id
            )
        } catch (error) {
            throw error
        }
    }
    
    async function mostrar(id:number) {
        try {
            const query = (`SELECT * FROM cliente INNER JOIN endereco 
            ON cliente.endereco_id = endereco.id WHERE cliente.id = ?`)

            const response = await database.getFirstAsync<ClienteEnderecoDatabase>(query, id)

            return response
        } catch (error) {
            throw error
        }
    }

    async function updateCliente(cliente: ClienteEnderecoDatabase) {
        const updateCliente = await database.prepareAsync(
            `UPDATE cliente 
            SET nome = $nome, telefone = $telefone, cpf = $cpf, valor_a_pagar = $valor_a_pagar
            WHERE id = $id`
        )

        const updateEndereco = await database.prepareAsync(
            `UPDATE endereco
            SET rua = $rua, numero = $numero, cep = $cep, estado = $estado
            WHERE id = $id`
        )
        
        try {
            await updateCliente.executeAsync({
                $nome: cliente.nome.trim(),
                $telefone: cliente.telefone.trim(),
                $cpf: cliente.cpf.trim(),
                $id: cliente.id,
                $valor_a_pagar: cliente.valor_a_pagar
            })

            await updateEndereco.executeAsync({
                $rua: cliente.rua,
                $numero: cliente.numero,
                $cep: cliente.cep,
                $estado: cliente.estado,
                $id: cliente.id
            })

        } catch (error) {
            throw error
        } finally {
            await updateCliente.finalizeAsync()
            await updateEndereco.finalizeAsync()
        }
    }

    return { insertCliente, searchByName, remove, mostrar, updateCliente }
}