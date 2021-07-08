// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import pako from 'pako';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import {StringView} from './DSBDecode'

export function encode(o: any) {
    return btoa(pako.deflate(JSON.stringify(o), {
        to: 'string',
        gzip: !0
    }));
}

export function decode(ToDecode: any) {
    return JSON.parse(new StringView(pako.inflate(StringView.base64ToBytes(ToDecode))).toString());
}
