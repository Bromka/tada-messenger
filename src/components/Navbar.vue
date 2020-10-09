<template>
    <nav>
        <div class="nav-wrapper">
            <div class="column">
                <span class="brand-logo">{{title}}</span>
            </div>
            <div class="column right">
                <div
                        ref="nameEditable"
                        spellcheck="false"
                        class="editme"
                        contenteditable="true"
                        :class="{ invalid: $v.name.$invalid }"
                        @blur="onEdit"
                        @keydown.enter.prevent="endEdit"
                        v-text="userName"
                        @input="validateName">
                </div>
                <i class="material-icons right" @click="$refs.nameEditable.focus()">edit</i>

            </div>
        </div>


    </nav>
</template>
<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    import {Validate} from "vuelidate-property-decorators";
    import {maxLength, minLength, required} from "vuelidate/lib/validators";

    @Component({})
    export default class App extends Vue {
        @Prop() title: string | undefined;

        @Validate({ required, minLength: minLength(3), maxLength: maxLength(49) })
        name = ''

        userName = this.$store.getters.name;

        validateName(e: any){
            this.name = e.target.textContent.trim()
        }

        onEdit() {
            if (this.$v.$invalid) {
                this.userName = this.$store.getters.name
            } else {
                this.changeName()
            }
        }

        endEdit() {
            if (this.$v.$invalid) {
                this.$v.$touch();
                return;
            } else {
                this.$refs.nameEditable.blur()
                this.changeName()
            }
        }

        changeName() {
            this.$store.commit('setName', this.name)
            this.userName = this.$store.getters.name;
        }

        mounted(){
            this.name = this.userName;
        }

    }

</script>

<style lang="scss">
    @import "../assets/variables";

    .nav-wrapper {
        background-color: $base-color;
        border-bottom: 1px solid $border-color;
        display: flex;
        justify-content: space-between;
    }


    div.column.right{
       display: flex;
        align-items: center;
        i{
            margin-right: 10px
        }

    }
    .username {
        margin-right: 1em;

    }

    .invalid {
        color: red;

    }
    div.editme{
        text-align: center;
        height: 2em;
        line-height: normal;
        margin: 10px;
        padding: 5px;
        box-sizing: border-box;
        &:focus{

            outline: none;
            height: 2em;
            line-height: normal;
            border-radius: 5px;

            outline: 2px solid $border-color;
        }
    }

    div.editme.invalid{

        &:focus{
            outline: none;
            height: 2em;
            line-height: normal;
            border-radius: 5px;

            outline: 2px solid red;
        }
    }

    span.brand-logo {
        margin-left: 6px;
        font-size: 18px;
        color: #eceff1;
    }

</style>
