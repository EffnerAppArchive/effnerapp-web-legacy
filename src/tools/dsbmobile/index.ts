import {HTTP} from "@ionic-native/http";
import {encode, decode} from './helpers'

export default class DSBMobile {
    private static URL = 'https://app.dsbcontrol.de/JsonHandler.ashx/GetData';

    private readonly username: string;
    private readonly password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    async fetch() {
        const response = await HTTP.post('https://app.dsbcontrol.de/JsonHandler.ashx/GetData', {
            Data: encode({
                PushId: '',
                UserId: this.username,
                UserPw: this.password,
                Device: 'iPhone',
                AppVersion: '2.5.6',
                Language: 'en-DE',
                Date: new Date(),
                BundleId: 'de.digitales-schwarzes-brett.dsblight',
                OsVersion: '13.2.2',
                LastUpdate: new Date(),
                AppId: 'BC86F8E5-5D4A-4A19-A317-04D1E52FF9ED'
            }),
            DataType: 1
        }, {});

        if(response.data.d) {
            console.log(decode(response.data.d))
        }
    }
}
