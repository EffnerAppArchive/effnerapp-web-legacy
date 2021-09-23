import {Http} from '@capacitor-community/http';

export default class DSBMobile {
    private static readonly BASE_URL = 'https://mobileapi.dsbcontrol.de';
    private static readonly BUNDLE_ID = 'de.heinekingmedia.dsbmobile';
    private static readonly APP_VERSION = '36';
    private static readonly OS_VERSION = '30';

    private readonly username: string;
    private readonly password: string;

    private token: string | undefined;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    async login(): Promise<void> {
        const url = `${DSBMobile.BASE_URL}/authid?bundleid=${DSBMobile.BUNDLE_ID}&appversion=${DSBMobile.APP_VERSION}&osversion=${DSBMobile.OS_VERSION}&pushid&user=${this.username}&password=${this.password}`;

        // the native implementations of @capacitor-community/http are kinda broken, so we can only accept the content-type 'text/json' instead of 'application/json'
        const token = await Http.request({
            method: 'GET',
            url,
            responseType: 'text',
            headers: {
                'Accept': 'text/*'
            }
        }).then(response => JSON.parse(response.data));

        if (!token) {
            throw new Error('Error while authenticating with dsbmobile');
        }

        this.token = token;
    }

    async getTimetable(): Promise<TimetableResponse> {
        const meta = await this.fetchMetaData();

        if (!meta) {
            throw new Error('Could not fetch timetable meta data.');
        }

        const {Detail: url, Date: time} = meta[0]['Childs'][0];

        return {
            url,
            time,
            items: await this.parseTimetable(url)
        };
    }

    async fetchMetaData(): Promise<any> {
        const json = await Http.request({
            method: 'GET',
            url: `${DSBMobile.BASE_URL}/dsbtimetables?authid=${this.token}`
        }).then(response => response.data);

        if (json['Message']) {
            throw new Error('dsbError: ' + json['Message']);
        }

        return json;
    }

    async parseTimetable(url: string): Promise<Substitutions> {
        try {
            const response = await Http.request({
                method: 'GET',
                url
            });

            const {data} = response;

            const parser = new DOMParser();
            const document = parser.parseFromString(data, 'text/html');

            const documents = this.splitDocuments(document);

            const dates: string[] = [];
            const days = new Map<string, ClassEntry[]>();
            const information = new Map();
            let absentClasses: AbsentClass[] = [];

            documents.forEach(document => {
                const date = document.querySelector('a')?.getAttribute('name') as string;
                if (date) {
                    dates.push(date);
                }

                document.querySelectorAll('table').forEach(table => {
                    switch (table.getAttribute('class')) {
                        case 'F':
                            if (table.innerText.trim()) {
                                information.set(date, Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim()).join('\n'));
                            }
                            break;
                        case 'K':
                            absentClasses = absentClasses.concat(Array.from(table.querySelectorAll('tbody')).map(tbody => {
                                return {
                                    date: date,
                                    class: tbody.querySelector('th')?.innerText.trim(),
                                    period: Array.from(tbody.querySelectorAll('td')).map(td => td.innerText.trim()).join(', ')
                                };
                            }));
                            break;
                        case 'k':
                            days.set(date, Array.from(table.querySelectorAll('tbody')).filter(tbody => !tbody.innerText.trim().startsWith('Klasse')).map(tbody => {
                                const className = tbody.querySelector('th')?.innerText.trim() as string;

                                const items = Array.from(tbody.querySelectorAll('tr')).map(tr => {
                                    const td = tr.querySelectorAll('td');

                                    return {
                                        teacher: td.item(0).innerText.trim(),
                                        period: td.item(1).innerText.trim(),
                                        subTeacher: td.item(2).innerText.trim(),
                                        room: td.item(3).innerText.trim(),
                                        info: td.item(4).innerText.trim(),
                                        fullClass: className
                                    };
                                });

                                return {
                                    name: className,
                                    items
                                };
                            }));
                            break;
                        case 'G':
                            absentClasses = absentClasses.concat(Array.from(table.querySelectorAll('tbody')).map(tbody => {
                                return {
                                    date: date,
                                    class: 'Gesamte Schule',
                                    period: tbody.querySelector('th')?.innerText.trim(),
                                    info: Array.from(tbody.querySelectorAll('td')).map(td => td.innerText.trim()).join(', ')
                                };
                            }));
                            break;
                    }
                });
            });

            return {
                dates,
                days,
                information,
                absentClasses
            };

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
}
