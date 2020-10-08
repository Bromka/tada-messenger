import Message from "@/models/Message";

export default class Room{


    name = '';
    private _messages: Message[] = []
    private _lastMessage: any;
    titleTextInList = {}

    constructor(name: string, args: any) {
        this.name = name;
        this.lastMessage = args.last_message;

    }


    get lastMessage(): any {
        return this._lastMessage;
    }

    set lastMessage(value: any) {
        this._lastMessage = value;
        const obj = {
            author: value.sender.username,
            text: value.text,
            date: value.created
        }
        this.titleTextInList = obj;
    }

    async fetchMessages(){
        const response = await fetch(`https://nane.tada.team/api/rooms/${this.name}/history`)
        const data = await response.json();
        this.messages = [];
        data.result.forEach(item => {
            this.addMessage(new Message(item))
        })
    }

    get messages(): Message[] {
        return this._messages;
    }

    set messages(value: Message[]) {
        this._messages = value;
    }


    addMessage(message: Message){
        this._messages.push(message);
    }


}