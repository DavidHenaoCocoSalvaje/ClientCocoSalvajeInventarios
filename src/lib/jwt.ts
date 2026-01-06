import { sign, type Algorithm } from 'jsonwebtoken'
import { readFileSync } from 'fs'

type ReadPrivateKeyParams = { path: string }
function read_private_key({ path }: ReadPrivateKeyParams) {
    return readFileSync(path, 'utf-8')
}

type GetPayloadParams = {
    sub: string,
    iat?: number
}

function get_payload({
    sub,
    iat = Math.floor(Date.now() / 1000),
}: GetPayloadParams) {
    return {
        sub,
        iat,
    }
}

type GetTokenParams = {
    private_key_path: string,
    payload: GetPayloadParams,
    algorithm?: Algorithm
}
export function get_token({
    private_key_path,
    payload,
    algorithm = 'RS256'
}: GetTokenParams) {
    return sign(get_payload(payload), read_private_key({ path: private_key_path }), {
        algorithm,
    })
}