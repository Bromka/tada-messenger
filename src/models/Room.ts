import Message from "@/models/Message";

export default class Room{

    private _name = '';
    private _messages: Message[] = []
    private _created: string | Date | undefined;
    private _text: string = '';

    constructor(name:string) {
        this.name = name;
    }

    get messages(): Message[] {
        return this._messages;
    }

    set messages(value: Message[]) {
        this._messages = value;
    }


    get name(): string {
        return this._name;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    set name(value: string) {
        this._name = value;
    }

    addMessage(message: Message){
        this._messages.push(message);
    }

    get created(): string | Date | undefined {
        return this._created;
    }

    set created(value: string | Date | undefined) {
        this._created = value;
    }


}