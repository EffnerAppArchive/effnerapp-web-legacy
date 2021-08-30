import {Http} from "@capacitor-community/http";
import {decode, encode} from './helpers'

export default class DSBMobile {
    private readonly username: string;
    private readonly password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    async getTimetable(): Promise<TimetableResponse> {
        const meta = await this.fetchMetaData();

        if (!meta) {
            throw new Error('Could not fetch timetable meta data.')
        }

        const {Detail: url, Date: time} = meta['ResultMenuItems'][0]['Childs'][0]['Root']['Childs'][0]['Childs'][0];

        return {
            url,
            time,
            items: await this.parseTimetable(url)
        };
    }

    async fetchMetaData() {
        try {
            const response = await Http.request({
                method: 'POST',
                url: 'https://app.dsbcontrol.de/JsonHandler.ashx/GetData',
                data: {
                    req: {
                        Data: encode({
                            PushId: '',
                            UserId: this.username,
                            UserPw: this.password,
                            Device: 'Nexus 4',
                            AppVersion: '2.5.9',
                            Language: 'en-DE',
                            Date: new Date(),
                            BundleId: 'de.heinekingmedia.dsbmobile',
                            OsVersion: '27 8.1.0',
                            LastUpdate: new Date(),
                            AppId: this.uuidv4()
                        }),
                        DataType: 1
                    }
                },
                headers: {
                    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 8.1.0; Nexus 4 Build/OPM7.181205.001)',
                    'Accept-Encoding': 'gzip, deflate',
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });

            if (response.data.d) {
                return decode(response.data.d)
            } else {
                return null
            }

        } catch (e) {
            console.error(e)
            return null;
        }
    }

    async parseTimetable(url: string): Promise<Substitutions> {
        try {
            const response = await Http.request({
                method: 'GET',
                url
            });

            const {data} = response

            const parser = new DOMParser();
            const document = parser.parseFromString(data, 'text/html');

            const documents = this.splitDocuments(document)

            const dates: string[] = []
            const days = new Map<string, ClassEntry[]>();
            const information = new Map()
            let absentClasses: AbsentClass[] = []

            documents.forEach(document => {
                const date = document.querySelector('a')?.getAttribute('name') as string
                if (date) {
                    dates.push(date)
                }

                document.querySelectorAll('table').forEach(table => {
                    switch (table.getAttribute('class')) {
                        case 'F':
                            if (table.innerText.trim()) {
                                information.set(date, Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim()).join('\n'));
                            }
                            break;
                        case 'K':
                            absentClasses = absentClasses.concat(Array.from(table.querySelectorAll('tr')).map(tr => {
                                return {
                                    date: date,
                                    class: tr.querySelector('th')?.innerText.trim(),
                                    period: tr.querySelector('td')?.innerText.trim()
                                }
                            }));
                            break;
                        case 'k':
                            days.set(date, Array.from(table.querySelectorAll('tbody')).filter(tbody => !tbody.innerText.trim().startsWith('Klasse')).map(tbody => {
                                const items = Array.from(tbody.querySelectorAll('tr')).map(tr => {
                                    const td = tr.querySelectorAll('td');

                                    return {
                                        teacher: td.item(0).innerText.trim(),
                                        period: td.item(1).innerText.trim(),
                                        subTeacher: td.item(2).innerText.trim(),
                                        room: td.item(3).innerText.trim(),
                                        info: td.item(4).innerText.trim(),
                                    };
                                });

                                return {
                                    name: tbody.querySelector('th')?.innerText.trim(),
                                    items
                                }
                            }));
                            break;

                        // don't know what 'G' was :C
                        // case 'G':
                        //     table.querySelectorAll('tr').forEach(tr => {
                        //
                        //     })
                        //     break;
                    }
                })
            })

            // console.log(`dates: ${JSON.stringify(dates)}`)
            // console.log(`information: ${JSON.stringify(Array.from(information))}`)
            // console.log(`absentClasses: ${JSON.stringify(absentClasses)}`)
            // console.log(`days: ${JSON.stringify(Array.from(days))}`)

            return {
                dates,
                days,
                information,
                absentClasses
            }

        } catch (e) {
            return Promise.reject(e);
        }
    }

    // adopted from https://github.com/EffnerApp/EffnerApp/blob/master/app/src/main/java/de/effnerapp/effner/data/dsbmobile/DSBClient.java#L157
    private splitDocuments(document: Document): Document[] {
        const parser = new DOMParser();

        const elements: string[] = [];

        document.querySelectorAll('a').forEach(a => {
            if (a.getAttribute('name')) {
                elements.push(a.outerHTML);
            }
        });

        const documents = [];
        const outer = document.documentElement.outerHTML;
        for (let i = 0; i < elements.length; i++) {
            if (i === elements.length - 1) {
                documents.push(parser.parseFromString(outer.substr(outer.indexOf(elements[i])), 'text/html'));
            } else if (i !== 0) {
                documents.push(parser.parseFromString(outer.substr(outer.indexOf(elements[i]), outer.indexOf(elements[i + 1])), 'text/html'));
            }
        }

        return documents;
    }

    private uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
