import { Lambda } from 'aws-sdk'

export interface lambdaGenericResponse {
    StatusCode: number,
    Payload: string,
    ExecutedVersion: string
}

var lambda = new Lambda({
    region: 'eu-west-1' //change to your region
})

export async function callLambda (funcName: string, input?: object | null | string) {
    if (input == null) input = {}
    let result = await lambda.invoke({
        FunctionName: funcName,
        Payload: typeof input == 'string' ? input : JSON.stringify(input, null, 2),
        //InvocationType: 'Event'
    }).promise()
    return result.$response.data as lambdaGenericResponse
}

export function getLambdaInput (obj) : any {
    if (typeof obj == 'string') obj = JSON.parse(obj)
    if (obj.body) return getLambdaInput(obj.body)
    return obj
}

export function apiReturn (code: number, value: any) {
    return {
        statusCode: code,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(value, null, 2)
    }
}


// EF BB BF 
export function sendFileViaLambda (file: {name: string, content: string}) {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Content-Type": "application/octet-stream",
            "Content-Disposition": "attachment; filename=" + file.name
        },
        body: file.content
    }
}