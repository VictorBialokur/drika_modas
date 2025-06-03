import { useSQLiteContext } from "expo-sqlite";

export type RoupaDatabase = {
    id: number
    roupa_nome: string
    tamanho: string
    preco: string
    cor: string
    quantidade: number
    imagem: string | null
}

export function useRoupaDatabase() {
    const database = useSQLiteContext()

    async function insertRoupa (roupa: Omit<RoupaDatabase, 'id'>) {
        
        const statement1 = await database.prepareAsync(
            `INSERT INTO roupa (roupa_nome, tamanho, preco, cor, quantidade, imagem)
            VALUES ($roupa_nome, $tamanho, $preco, $cor, $quantidade, $imagem)`
        )

        try {
            const resultRoupa = await statement1.executeAsync({
                $roupa_nome: roupa.roupa_nome.trim(),
                $tamanho: roupa.tamanho.trim(),
                $preco: Number(roupa.preco),
                $cor: roupa.cor.trim(),
                $quantidade: roupa.quantidade,
                $imagem: roupa.imagem !== null ? roupa.imagem.trim() : null
            })

            const result = await database.getFirstAsync<{id: number}>(
                'SELECT id FROM roupa WHERE id = last_insert_rowid()'
            )

            return result?.id
        } catch (error) {
            throw error
        } finally {
            await statement1.finalizeAsync()
        }
    }

    async function searchByName(roupa_nome: string) {
        try {
            const query =  'SELECT * from roupa WHERE roupa_nome LIKE ?'

            const response = await database.getAllAsync<RoupaDatabase>(query, `%${roupa_nome}%`)

            return response
        } catch (error) {
            throw error
        }
        
    }

    async function remove(id: number) {
        try {
            await database.execAsync(
                `DELETE FROM vendas WHERE roupa_id = ${id}`
            )

            await database.execAsync(
                'DELETE FROM roupa WHERE id = ' + id
            )
        } catch (error) {
            throw error
        }
    }

    async function mostrar(id:number) {
        try {
            const query = (
                `SELECT * FROM roupa WHERE id = ?`
            )
            
            const response = await database.getFirstAsync<RoupaDatabase>(query, id)
            
            return response
        } catch (error) {
            throw error
        }
    }

    async function updateRoupa(roupa: RoupaDatabase) {
        const roupaUpdate = await database.prepareAsync(
            `UPDATE roupa 
            SET roupa_nome = $roupa_nome, tamanho = $tamanho, preco = $preco, cor = $cor, quantidade = $quantidade, imagem = $imagem
            WHERE id = $id`
        )
        
        try {
            await roupaUpdate.executeAsync({
                $id: roupa.id,
                $roupa_nome: roupa.roupa_nome.trim(),
                $tamanho: roupa.tamanho.trim(),
                $preco: Number(roupa.preco),
                $cor: roupa.cor.trim(),
                $quantidade: roupa.quantidade,
                $imagem: roupa.imagem !== null ? roupa.imagem.trim() : null
            })

        } catch (error) {
            throw error
        } finally {
            await roupaUpdate.finalizeAsync()
        }
    }

    return { insertRoupa, searchByName, remove, mostrar, updateRoupa }
}