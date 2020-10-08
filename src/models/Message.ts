export default class Message{
    text:string = '';
    author:string = 'John Doe';
    timestamp: Date | undefined;
    room: string | undefined;

    constructor({created = Date.now(), sender = 'John Doe', text = '', room = sender}:any) {
        this.room = room;
        this.timestamp = new Date(created);
        this.author = sender;
        this.text = text;
    }
}