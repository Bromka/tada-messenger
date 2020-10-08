export default function (val: Date, opt:string): string {

    const options:any = {}
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