<template>
    <div id="app">
        <div v-if="!userName" class="nameform">
            Вы кто такие?
            <form @submit.prevent="changeUserName" class="changeUserName">
            <input type="text" v-model="name" class="nameForm" @input="empty = false" :class="{invalid: $v.name.$invalid && !empty}" spellcheck="false">
                <input type="submit" class="btn brnsubmit" value="Это я">
            </form>
        </div>
        <Messenger v-else/>




    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Messenger from '@/components/Messenger.vue'
    import { Validate } from "vuelidate-property-decorators";
    import { maxLength, required, minLength } from "vuelidate/lib/validators";


    @Component({
        components: {Messenger},
    })


    export default class App extends Vue {
        get userName(){
            return this.$store.getters.name
        }
        @Validate({ required, minLength: minLength(3), maxLength: maxLength(49) })
        name = ''
        empty = true;

        changeUserName(){
            if (this.$v.name.$invalid) {
                this.$v.$touch();
                return;
            }
            this.$store.commit('setName', this.name)
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
            border-top: 1px solid $border-color;



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

                i{
                    color: #90a4ae;
                }

            }

        }
    }

    .nameform{
        display: flex;
        margin-top: 10%;
        flex-direction: column;
        align-items: center;
        color: #eceff1

    }

    .modal {
        width: 600px;
        background-color: $base-color;

        .modal-footer {
            background-color: $base-color;
        }
    }
    .changeUserName{
        text-align: center;

    }
    input.nameForm{
        color: #eceff1;

    }
    .brnsubmit{
        margin-top: 10px;
    }
</style>
