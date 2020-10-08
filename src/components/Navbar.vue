<template>
    <nav>
        <div class="nav-wrapper">
            <span class="brand-logo">{{title}}</span>

            <div class="right hide-on-med-and-down username" id="nav-mobile">
                {{userName}}
                <a class="btn-floating btn-small waves-effect waves-light btn-flat blue-grey lighten-2 modal-trigger"
                   data-target="modal2"><i class="material-icons right">edit</i></a>
            </div>

        </div>

        <div class="modal" id="modal2" ref="modalName">
            <form @submit.prevent="changeName">
                <div class="modal-content">
                    <input id="name" :class="{
            invalid:
              ($v.name.$dirty && !$v.name.required) ||
              ($v.name.$dirty && !$v.name.minLength) ||
              ($v.name.$dirty && !$v.name.maxLength)
          }"
                           autocomplete="false"
                           class="message_input"
                           spellcheck="false"
                           type="text"
                           v-model="name"

                    >
                    <label for="name">Имя</label>
                    <small
                            class="helper-text invalid"
                            v-if="$v.name.$dirty && !$v.name.required"
                    >Поле не должно быть пустым</small
                    >
                    <small
                            class="helper-text invalid"
                            v-else-if="$v.name.$dirty && !$v.name.minLength"
                    >Имя не должен состоять из менее чем 3 символов</small
                    >
                </div>
                <input class="modal-close waves-effect waves-green btn-flat" href="#!" type=submit>
            </form>
        </div>

    </nav>
</template>
<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    import {Validate} from "vuelidate-property-decorators";
    import {maxLength, minLength, required} from "vuelidate/lib/validators";

    @Component({})
    export default class App extends Vue {
        @Prop() title: string;

        @Validate({required, minLength: minLength(3), maxLength: maxLength(49)})
        userName = this.$store.getters.name;

        @Validate({required, minLength: minLength(3), maxLength: maxLength(49)})
        name = ''

        changeName() {
            this.$store.commit('setName', this.name)
            this.name = ''
            this.userName = this.$store.getters.name;


        }

        mounted() {
            const M = window.M
            const instance = M.Modal.init(this.$refs.modalName, {})
        }
    }

</script>

<style lang="scss">
    @import "../assets/variables";

    .nav-wrapper {
        background-color: $base-color;
        border-bottom: 1px solid $border-color;
    }

    .username {
        margin-right: 1em;
    }
    .invalid{
        color: red;
        background-color: red;
    }
    span.brand-logo{
        margin-left: 1em;
        color: #eceff1;
    }
</style>
