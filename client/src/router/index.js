import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import Posts from '../components/Posts.vue';

Vue.use(Router);

export default new Router({
    routes: [
        // {
        //     path: '/',
        //     name: 'HelloWorld',
        //     component: HelloWorld
        // },
        {
            path: '/posts',
            name: 'Posts',
            component: Posts
        }
    ]
});
