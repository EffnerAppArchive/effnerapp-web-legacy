// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import pako from 'pako';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import {StringView} from './decode';

export function encode(o: any) {
    return btoa(pako.deflate(JSON.stringify(o), {
        to: 'string',
        gzip: true
    }));
}

export function decode(o: any) {
    return JSON.parse(new StringView(pako.inflate(StringView.base64ToBytes(o))).toString());
}
