type TimetableResponse = {
    url: string;
    time: string;
    items?: Substitutions;
}

type Substitutions = {
    dates: string[];
    days: Map<string, ClassEntry[]>;
    information: Map<string, string>;
    absentClasses: AbsentClass[];
}

type ClassEntry = {
    name?: string;
    items: Substitution[];
}

type Substitution = {
    teacher: string;
    period: string;
    subTeacher: string;
    room: string;
    info: string;
}

type AbsentClass = {
    date?: string;
    class?: string;
    period?: string;
}
