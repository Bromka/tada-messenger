<template>
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
                <div class="single_room" ref="singleRoom">

                    <ul>
                        <li :key="(message.timestamp).toString() + Math.random()" v-for="(message) in messages">
                            <Message :message="message"/>
                        </li>
                    </ul>


                </div>
                <form @submit.prevent="sendMessage" ref="form">

                    <div class="column i_wrap">
                  <i class="material-icons right">send</i>
                    </div>
                    <div class="column input_wrap">

                        <input autocomplete="false" class="message_input" spellcheck="false" type="text"
                               v-model="newMessage">

                    </div>

                </form>
            </div>

        </div>

        <div class="modal" id="modal1" ref="modalel">
            <form @submit.prevent="messageToRoom">
                <div class="modal-content">

                    <input autocomplete="false" class="message_input" spellcheck="false" type="text" :class="{invalid: $v.newRoom.$invalid}"
                           v-model.trim="newRoom">
                    <label>Название комнаты</label>
                    <input autocomplete="false" class="message_input" spellcheck="false" type="text"
                           v-model.trim="newMessage" :class="{invalid: $v.newMessage.$invalid}">

                    <label>Сообщение</label>

                </div>
                <div class="modal-footer">
                    <input class="modal-close waves-effect waves-green btn" href="#!" type=submit>
                </div>
            </form>
        </div>
    </div>



</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import Navbar from "@/components/Navbar.vue"
    import Message from "@/components/Message.vue"
    import MessageModel from '@/models/Message.ts'

    import {Validate} from "vuelidate-property-decorators";
    import {maxLength, minLength, required} from "vuelidate/lib/validators";

    @Component({
        components: {Message, Navbar},
    })
    export default class App extends Vue {
        rooms: any = {};
        activeRoom: any = {};
        messages = [];
        Socket: any;



        @Validate({ required, minLength: minLength(1), maxLength: maxLength(5000) })
        newMessage = '';

        @Validate({ required, minLength: minLength(3), maxLength: maxLength(49) })
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

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

            this.scrollTo()


        }


        activateWS() {

            const Username = this.$store.getters.name
            const Socket = new WebSocket(`wss://nane.tada.team/ws?username=${Username}`)
            this.Socket = Socket;

            this.$store.commit('setSocket', Socket)

            Socket.onopen = () => {
                // console.log("Соединение установлено.");
                this.Socket = Socket;

            };

            Socket.onclose = function (event) {
                if (event.wasClean) {
                    // console.log('Соединение закрыто чисто');
                } else {
                    // console.log('Обрыв соединения'); // например, "убит" процесс сервера
                }
                // console.log('Код: ' + event.code + ' причина: ' + event.reason);
            };

            Socket.onmessage = (event) => {

                // console.log("Получены данные " + event.data);
                const data = JSON.parse(event.data)
                // console.log(data)
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

                this.scrollTo()

            };

            Socket.onerror = function (error) {
                console.log(`Ошибка ${error}`);

            };
        }
        scrollTo(){
            this.$nextTick(function () {
                const $el: any = this.$refs.singleRoom
                $el.scrollTop = $el.scrollHeight
            })
        }
        sendMessage(e: any, room: string | null | undefined = null) {
            const message = {
                "room": room || this.activeRoom.name,
                "text": this.newMessage
            }
            // console.log(message)
            this.Socket.send(JSON.stringify(message))
            this.newMessage = ''
        }

        messageToRoom() {
            if (this.$v.$invalid) {
                this.$v.$touch();
                return;
            }
            this.sendMessage('', this.newRoom)
            this.newMessage = ''
            this.newRoom = ''
        }

    }
</script>
<style lang="scss" scoped>

    input.message_input{
        color: #eceff1;
    }
</style>