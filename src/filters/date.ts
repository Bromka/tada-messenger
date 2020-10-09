interface Options {
    day?: string;
    month?: string;
    year?: string;
    second?: string;
    minute?: string;
    hour?: string;
}

export default function (val: Date, opt: string): string {
    const options: Options = {}
    if (opt.includes('date')){
        options.day = '2-digit';
        options.month = 'long';
        options.year = 'numeric';
    }
    if (opt.includes('time')){
        options.second = 'numeric';
        options.minute = 'numeric';
        options.hour = 'numeric';
    }
    return new Intl.DateTimeFormat('ru-RU', options).format(new Date(val))
}