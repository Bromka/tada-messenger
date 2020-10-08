<template>
    <div id="app">
        <div class="wrap_app">
            <Navbar :title="activeRoom.name"/>
            <div class="app_body">
                <div class="rooms_list_wrap">
                    <ul>
                        <li :class="{active: room == activeRoom}" :key="room.name" @click="doClick(room)"
                            class="room_unit"
                            v-for="(room) in rooms">
                            <div class="room__title">{{room.name}}</div>
                            <div class="room__last_message">
                        <span class="author">
                            от {{room.titleTextInList.author}}:
                        </span>
                                <span class="text">
                                    {{room.titleTextInList.text}}
                            </span>
                                <span class="date">
                                    {{room.titleTextInList.date | date('datetime')}}
                                </span>

                            </div>

                        </li>
                        <li class="modal-trigger room_unit grey darken-3" data-target="modal1">
                            <div class="room__title">Написать в новую комнату</div>
                        </li>
                    </ul>
                </div>
                <div class="one_room_wrap">
                    <div class="single_room">
                        <ul>
                            <li :key="(message.timestamp).toString() + Math.random()" v-for="(message) in messages">
                                <Message :message="message"/>
                            </li>
                        </ul>


                    </div>
                    <form @submit.prevent="sendMessage" ref="form">

                        <div class="column i_wrap">
                            <a class="btn-floating btn-small waves-effect waves-light btn-flat blue-grey lighten-2" type="submit" @click="$refs.form.submit()"><i
                                    class="material-icons right">send</i></a>
                        </div>
                        <div class="column input_wrap">

                            <input autocomplete="false" class="message_input" spellcheck="false" type="text"
                                   v-model="newMessage">

                        </div>

                    </form>
                </div>

            </div>
        </div>


        <div class="modal" id="modal1" ref="modalel">
            <form @submit.prevent="messageToRoom">
                <div class="modal-content">
                    <input autocomplete="false" class="message_input" spellcheck="false" type="text"
                           v-model="newRoom">
                    <label>Название комнаты</label>
                    <input autocomplete="false" class="message_input" spellcheck="false" type="text"
                           v-model="newMessage">
                    <label>Сообщение</label>
                </div>
                <div class="modal-footer">
                    <input class="modal-close waves-effect waves-green btn-flat" href="#!" type=submit>
                </div>
            </form>
        </div>


    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import Navbar from "./components/Navbar.vue"
    import Message from "@/components/Message.vue"
    import MessageModel from '@/models/Message.ts'

    @Component({
        components: {Message, Navbar},
    })
    export default class App extends Vue {
        rooms = {};
        activeRoom = {};
        messages = [];
        Socket: any;
        newMessage = '';
        newRoom = '';

        get userName() {
            return this.$store.getters.name
        }

        @Watch('userName')
        onChildChanged(val: string, oldVal: string) {
            this.Socket.close()
            this.activateWS()
        }

        async mounted() {
            const M = window.M
            const instance = M.Modal.init(this.$refs.modalel, {})

            if (!Object.keys(this.$store.getters.rooms).length) {
                await this.$store.dispatch('fetchRooms')
                this.rooms = this.$store.getters.rooms;
            }
            const firstRoom = Object.keys(this.rooms)[0]


            this.doClick(this.rooms[firstRoom])
            this.activateWS()


        }

        async doClick(roomName: {}) {
            if (this.activeRoom !== roomName) {
                this.activeRoom = roomName
                if (!this.activeRoom.messages.length) {
                    await this.activeRoom.fetchMessages()
                }
                this.messages = this.activeRoom.messages;

            }
        }


        activateWS() {

            const Username = this.$store.getters.name
            const Socket = new WebSocket(`wss://nane.tada.team/ws?username=${Username}`)
            this.Socket = Socket;

            this.$store.commit('setSocket', Socket)

            Socket.onopen = () => {
                console.log("Соединение установлено.");
                this.Socket = Socket;

            };

            Socket.onclose = function (event) {
                if (event.wasClean) {
                    console.log('Соединение закрыто чисто');
                } else {
                    console.log('Обрыв соединения'); // например, "убит" процесс сервера
                }
                console.log('Код: ' + event.code + ' причина: ' + event.reason);
            };

            Socket.onmessage = (event) => {

                console.log("Получены данные " + event.data);
                const data = JSON.parse(event.data)
                console.log(data)
                const message = {
                    room: data.room,
                    timestamp: data.created,
                    author: data.sender.username || 'some',
                    text: data.text
                }


                if (this.rooms[data.room]) {
                    this.rooms[data.room].addMessage(new MessageModel(data))
                } else {
                    this.$store.commit('addRoom', data);
                    console.log('появилась новая комната')
                    this.rooms[data.room].addMessage(new MessageModel(data))
                    this.rooms = this.$store.getters.rooms;
                    this.doClick(this.rooms[data.room])
                    this.$forceUpdate()
                }

            };

            Socket.onerror = function (error) {
                console.log(`Ошибка ${error}`);

            };
        }

        sendMessage(e, room = null) {


            const message = {
                "room": room || this.activeRoom.name,
                "text": this.newMessage
            }
            console.log(message)
            this.Socket.send(JSON.stringify(message))
            this.newMessage = ''
        }

        messageToRoom() {

            this.sendMessage('', this.newRoom)
            this.newMessage = ''
            this.newRoom = ''
        }

    }
</script>

<style lang="scss">
    @import "~materialize-css/dist/css/materialize.min.css";
    @import "./assets/variables";


    #app {
        display: flex;
        justify-content: center;
        padding: 3em 0em;
        background-color: $background-color;
        position: absolute;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;

        .wrap_app {
            width: 1000px;
            height: 80vh;
            box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3);

            .app_body {
                background-color: $base-color;
                height: 90%;

                display: flex;
                justify-content: center;

                .rooms_list_wrap {
                    width: 25%;
                    border-right: 1px solid $border-color;
                    overflow-y: auto;
                    overflow-x: hidden;
                }

                .one_room_wrap {
                    width: 75%;

                }
            }

        }

    }

    ul {
        list-style: none !important;
        padding: 0px !important;
        margin: 0px !important;
        cursor: pointer;
    }

    .room_unit {
        min-height: 50px;
        color: #eceff1;
        padding: 5px 10px;
        border-bottom: 1px solid $border-color;

        &:hover {
            background-color: #546e7a
        }

        .room__last_message {
            font-size: 10px;
            color: #90a4ae;
        }


    }

    .active {
        background-color: #455a64;
    }

    .one_room_wrap {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 0;
        flex-basis: border-box;

        .single_room {
            width: 100%;


            flex-grow: 2;
            flex-basis: border-box;

            max-height: 100%;
            overflow: auto;
        }

        form {
            display: flex;
            justify-content: space-between;
            align-items: center;



            .column {
                display: flex;
                align-items: center;
                input {
                    border-radius: 15px;
                    background-color: #546e7a;
                    color: #eceff1;
                    border: none;
                    padding: 2px 10px;
                    margin: 5px;


                }
            }


            .input_wrap {
                flex-grow: 2;
                display: flex;
                justify-content: center;

            }

            .i_wrap {
                width: 3em;
                display: flex;
                justify-content: center;

            }

        }
    }

    .modal {
        width: 600px;
        background-color: $base-color;

        .modal-footer {
            background-color: $base-color;
        }
    }
</style>
