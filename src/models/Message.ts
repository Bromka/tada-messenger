export default class Message{
    text = '';
    author = 'John Doe';
    timestamp: Date | undefined;
    room: string | undefined;

    constructor(item: any) {
        this.room = item.room;
        this.timestamp = new Date(item.created);
        this.author = item.sender.username;
        this.text = item.text;
    }
}