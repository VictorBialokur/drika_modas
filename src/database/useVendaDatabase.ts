import { useSQLiteContext } from "expo-sqlite"
import { ClienteDatabase } from "./useClientDatabase"
import { RoupaDatabase } from "./useRoupaDatabase"

export type VendaDatabase = RoupaDatabase & {
    quantidadeComprada: number
}

export type Comprador = Omit<ClienteDatabase, 'cpf'> & {
    quantidadeComprada: number
}

export function useVendaDatabase() {
    const database = useSQLiteContext()

    async function inserir(cliente_id:number, roupa_id:number, quantidade: number, preco: number) {
        
        const statement = await database.prepareAsync(
            `INSERT INTO vendas (cliente_id, roupa_id, quantidade) VALUES ($cliente_id, $roupa_id, $quantidade)`
        )
        
        try {
            const temEstoque = await database.getFirstAsync<{quantidade: number}>(
                `SELECT quantidade FROM roupa
                WHERE id = ${roupa_id}`
            )

            if (temEstoque!.quantidade === 0 || temEstoque!.quantidade < quantidade) {
                return false
            }

            const existeNoBanco = await database.getFirstAsync<{id: number, quantidade: number}>(
                `SELECT id, quantidade 
                FROM vendas 
                WHERE cliente_id = ${cliente_id} 
                AND roupa_id = ${roupa_id}`
            )
            
            if (existeNoBanco) {
                await database.execAsync(
                    `UPDATE vendas
                    SET quantidade = ${existeNoBanco.quantidade + quantidade}
                    WHERE id = ${existeNoBanco.id}`
                )
                return true
            } else {

                await statement.executeAsync({
                    $cliente_id: cliente_id,
                    $roupa_id: roupa_id,
                    $quantidade: quantidade
                })

                await database.execAsync(
                    `UPDATE cliente
                    SET valor_a_pagar = COALESCE(valor_a_pagar, 0) + ${preco*quantidade}
                    WHERE id = ${cliente_id}`
                )

                await database.execAsync(
                    `UPDATE roupa
                    SET quantidade = ${(temEstoque!.quantidade - quantidade)}
                    WHERE id = ${roupa_id}`
                )
                return true
            }
        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function mostrarRoupas(id:number) {
        try {
            const query = (
                `SELECT roupa.id, 
                    roupa.roupa_nome, 
                    roupa.tamanho,
                    roupa.preco,
                    roupa.imagem,
                    vendas.quantidade as quantidadeComprada
                FROM vendas
                INNER JOIN roupa
                ON vendas.roupa_id = roupa.id
                INNER JOIN cliente
                ON cliente.id = vendas.cliente_id
                WHERE vendas.cliente_id = ?`
                )

            const response = await database.getAllAsync<VendaDatabase>(query, id)

            return response
        } catch (error) {
            throw error
        }
    }

    async function mostrarCliente(id:number) {
        try {
            const query = (
                `SELECT cliente.id, 
                    cliente.nome, 
                    cliente.telefone,
                    vendas.quantidade as quantidadeComprada
                FROM vendas
                INNER JOIN roupa
                ON vendas.roupa_id = roupa.id
                INNER JOIN cliente
                ON vendas.cliente_id = cliente.id
                WHERE roupa.id = ?`
                )

            const response = await database.getAllAsync<Comprador>(query, id)
            return response
        } catch (error) {
            throw error
        }
    }
    
    async function removerUm(roupa_id:number, cliente_id:number, valor_a_pagar: number) {
        try {
            const result = await database.getFirstAsync<{preco:number}>(
                `SELECT roupa.preco
                FROM roupa 
                WHERE id = ${roupa_id}`
            )
            
            if (valor_a_pagar < result!.preco) {
                await database.execAsync(
                `UPDATE cliente
                SET valor_a_pagar = ${0}
                WHERE id = ${cliente_id}`
                )
            } else {
                await database.execAsync(
                    `UPDATE cliente
                    SET valor_a_pagar = COALESCE(valor_a_pagar, 0) - ${result!.preco}
                    WHERE id = ${cliente_id}`
                )
            }

            await database.execAsync(
                `DELETE FROM vendas WHERE roupa_id = ${roupa_id} AND cliente_id = ${cliente_id}`
            )

        } catch (error) {
            throw error
        }
    }

    async function removerTodos(id: number) {
        try {
            await database.execAsync(
                `DELETE FROM vendas WHERE roupa_id = ${id}`
            )
            
        } catch (error) {
            throw error
        }
    }

    async function reduzirQuantidade(roupa_id: number, cliente_id: number, sinal: string) {
        try {
            const result = await database.getFirstAsync<{v_quantidade: number, r_quantidade: number, preco: number}>(
                `SELECT vendas.quantidade AS v_quantidade, 
                roupa.quantidade AS r_quantidade,
                roupa.preco AS preco
                FROM vendas
                INNER JOIN roupa
                ON vendas.roupa_id = roupa.id
                WHERE vendas.roupa_id = ${roupa_id} AND vendas.cliente_id = ${cliente_id}`
            )

            if (result) {
                if (sinal === '+' && result.r_quantidade > 0) {
                    await database.execAsync(
                        `UPDATE vendas
                        SET quantidade = ${result.v_quantidade + 1}
                        WHERE roupa_id = ${roupa_id} AND cliente_id = ${cliente_id}`
                    )

                    await database.execAsync(
                        `UPDATE roupa
                        SET quantidade = ${result.r_quantidade - 1}
                        WHERE id = ${roupa_id}`
                    )

                    await database.execAsync(
                        `UPDATE cliente
                        SET valor_a_pagar = COALESCE(valor_a_pagar, 0) + ${result.preco}
                        WHERE id = ${cliente_id}`
                    )
                    return true
                } else if (sinal === '-' && result.v_quantidade > 1) {
                    await database.execAsync(
                        `UPDATE vendas
                        SET quantidade = ${result.v_quantidade - 1}
                        WHERE roupa_id = ${roupa_id} AND cliente_id = ${cliente_id}`
                    )

                    await database.execAsync(
                        `UPDATE roupa
                        SET quantidade = ${result.r_quantidade + 1}
                        WHERE id = ${roupa_id}`
                    )

                    await database.execAsync(
                        `UPDATE cliente
                        SET valor_a_pagar = COALESCE(valor_a_pagar, 0) - ${result.preco}
                        WHERE id = ${cliente_id}`
                    )
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        } catch (error) {
            throw error
        }
    }

    async function precoTotal(id:number) {
        try {
            const query = (
               `SELECT roupa.preco,
                       vendas.quantidade 
                FROM vendas
                INNER JOIN cliente
                ON vendas.cliente_id = cliente.id
                INNER JOIN roupa
                ON vendas.roupa_id = roupa.id
                WHERE vendas.cliente_id = ?`
            )

            const result = await database.getAllAsync<{preco: number, quantidade: number}>(query, id)
            let total = 0

            result.map((roupa) => {
                total = total + (roupa.preco * roupa.quantidade)
            })

            return total/100
        } catch (error) {
            throw error
        }
    }

    return { inserir, mostrarRoupas, mostrarCliente, removerUm, removerTodos, reduzirQuantidade, precoTotal }
}