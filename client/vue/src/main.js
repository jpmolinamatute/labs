// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
// import type from './components/type.vue';
import pokemonList from './components/pokemonList.vue'

Vue.config.productionTip = false;
const routes = [
    {
        path: '/',
        name: 'pokemonList',
        component: pokemonList
    }
];



Vue.use(VueRouter);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router: new VueRouter({ routes }),
    components: { App },
    template: '<App/>'
});
