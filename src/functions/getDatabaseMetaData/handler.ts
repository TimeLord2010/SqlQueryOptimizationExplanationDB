import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
//import { middyfy } from '@libs/lambda';
import { getLambdaInput } from '@libs/utils/AWSLambda';
import { MysqlHandler } from '@libs/db/mysqlHandler';

async function getMetaData(body) {
    try {
        const host = process.env.db_url
        const user = process.env.db_user
        const password = process.env.db_password
        const mysqlHandler = new MysqlHandler(host, user, password)
        await mysqlHandler.connect()
        var tables = await mysqlHandler.getTableNames('Exercicios')
        for (var table of tables) {
            table.COLUMNS = await mysqlHandler.getColumnInfo('Exercicios', table.TABLE_NAME)
        }
        return tables
    } catch (e) {
        return {message: e.message}
    }
}

// sls deploy -f getDatabaseMetaData
// sls invoke local -f getDatabaseMetaData

const handler = async (event) => {
    const body = getLambdaInput(event)
    const result = await getMetaData(body) as any
    return formatJSONResponse({
        result,
        date: new Date()
    });
}

//export const main = middyfy(handler);
export const main = handler;