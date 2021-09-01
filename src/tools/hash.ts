// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import crypto from 'crypto';

export function sha512(data: string) {
    return crypto.createHash('sha512').update(data, 'utf-8').digest('hex');
}
