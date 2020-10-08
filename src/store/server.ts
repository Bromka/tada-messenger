export default {
    action: {
        async fetchRooms(commit:any){
            const roomsData = await fetch('https://nane.tada.team/api/rooms')
            try{
                const json = await roomsData.json()
                commit('setRooms', json)
            } catch (e) {
                console.error(e)
            }

        }
    },
    mutations: {
        setRooms(state:any, data:any){
            state.rooms = data
            }
    },
    state: {
        rooms: {}

    },
    getters: {

    }


}