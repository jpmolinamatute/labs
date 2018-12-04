import Vue from 'vue';
import Router from 'vue-router';
import type from '../components/type.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/types',
            name: 'type',
            component: type
        }
    ]
});
