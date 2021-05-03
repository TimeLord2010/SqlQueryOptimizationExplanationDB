import { Connection, createConnection, QueryOptions } from 'mysql'

export class MysqlHandler {

    private host: string
    private user: string
    private password: string

    private connection: Connection

    constructor (host: string, user: string, password: string) {
        if (typeof host !== 'string') throw new Error(`'host' must be a string.`)
        this.host = host
        if (typeof user !== 'string') throw new Error(`'user' must be a string.`)
        this.user = user
        if (typeof password !== 'string') throw new Error(`'password' must be a string.`)
        this.password = password
    }

    connect () {
        this.connection = createConnection({
            host: this.host,
            user: this.user,
            password: this.password
        })
        return new Promise((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(this.connection)
                }
            })
        })
    }

    query (sql: string | QueryOptions) : Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }

    async getTableNames (db: string) {
        const sql = `SELECT table_name FROM information_schema.tables WHERE table_schema = '${db}';`
        return await this.query(sql)
    }

    async getColumnInfo (db: string, table: string) {
        const sql = `select 
            column_name,
            data_type,
            is_nullable
        from 
            information_schema.columns 
        where 
            table_schema = '${db}' and table_name = '${table}'`
        return await this.query(sql)
    }
}