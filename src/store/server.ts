import Room from '../models/Room'
export default {
    actions:{
        async fetchRooms({commit}: any) {
            const roomsData = await fetch('https://nane.tada.team/api/rooms')
            try {
                const json = await roomsData.json()
                console.log('Rooms has been loaded.')
                commit('setRooms', json.result)

            } catch (e) {
                console.error(e)
            }

        }
    },
    mutations: {
        setRooms(state: any, data: any[]) {
            data.forEach((item) => {
                state.rooms[item.name] = new Room(item.name, item)
            })
        },
        setSocket(ctx: any){
            console.log(ctx)
            ctx.Socket = 'asdasdasd'
            // state.Socket = new WebSocket(`wss://nane.tada.team/ws?username=${state.name}`)
        },
        clearSocket(state: any){
            state.Socket.close();
            state.Socket = null;
        },
        addRoom(state: any, data: any) {
            console.log('addRoom', data)
            state.rooms[data.room] = new Room(data.room, {
                'last_message': {
                    "room": data.room,
                    "created": data.created,
                    "sender": data.sender,
                    "text": data.text
                }
            })
            console.log(state.rooms)
        }
    },
    state: {
        rooms: {},
        Socket: null
    },
    getters: {
        rooms(state: any){
            return state.rooms
        },
        socket({state}: any){
            return state.Socket
        }

    }


}