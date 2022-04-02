<template>
    <div class="page-my-account">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">Hi {{ user.username }}</h1>
                {{ user }}
            </div>

            <div class="column is-12">
                <button @click="logout()" class="button is-danger">Log out</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'MyAccount',

    computed: {
        ...mapGetters({
            user: 'user',
        }),
    },

    mounted() {
        // document.title = 'My account | Djackets'
        // this.getMyOrders()
    },
    methods: {
        logout() {
            this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push(`/`);
                })
                .catch(err => {
                    console.log('err in MyAccount logout()', err);
                })
            // axios.defaults.headers.common["Authorization"] = "";

            
        },
        // async getMyOrders() {
        //     this.$store.commit('setIsLoading', true)
        //     console.log("we are in get my orders")
        //     console.log("was losd", axios.defaults.headers.common["Authorization"])
        //     console.log(localStorage.getItem('token'), "yoyo")
        //     // axios.defaults.headers.common["Authorization"] = localStorage.getItem('token')
        //     // axios.defaults.headers.post['Content-Type'] = 'application/json'
        //     await axios
        //         .get('/api/v1/orders/')
        //         .then(response => {
        //             this.orders = response.data
        //         })
        //         .catch(error => {
        //             console.log(error)
        //         })
        //     this.$store.commit('setIsLoading', false)
        // }
    }
}
</script>