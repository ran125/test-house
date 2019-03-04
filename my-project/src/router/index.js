import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Three from '@/components/Three';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/a',
            name: 'HelloWorld',
            component: HelloWorld,
        },
        {
            path: '/',
            name: 'Three',
            component: Three,
        },
    ],
});