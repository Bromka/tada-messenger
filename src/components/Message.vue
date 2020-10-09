<template>
    <div class="wrap" :class="{selfmessage: isMyMessage}">
        <div class="body">
            {{message.text}}
        </div>
        <div class="bottom">
        <div class="author">
            {{message.author}}
        </div>
        <div class="date">
            {{message.timestamp | date('time')}}
        </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    @Component({})
    export default class App extends Vue {
        @Prop() message: any;

        get isMyMessage(){
            return this.message.author === this.$store.getters.name
        }

    }




</script>
<style lang="scss" scoped>
    @import "../assets/variables";
    .wrap{
        max-width: 100%;
        border: 1px solid $background-color;
        background-color: $border-color;
        padding: 5px;
        border-radius: 10px;
        color: #eceff1;
        font-size: 13px;
        margin: 0px 20px;
        align-self: start;
        .bottom{
            display: flex;
            justify-content: space-between;
            .author, .date{
                font-size: 10px;
                color: #90a4ae;
            }
        }
        margin-top: 2em;

        .body{
            word-wrap: break-word;
        }



    }

    div.selfmessage{
        background-color: #2a363b;
    }
</style>
