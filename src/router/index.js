import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path: '/',
  		redirect: '/home/login'
  	},
    {
    	path: '/home',
    	component: resolve => require(['@/components/common/Home.vue'], resolve),
    	children: [
    		{
    			path: '',
    			component: resolve => require(['../components/page/Login-login.vue'], resolve) 
    		},
    		{
    			path: 'login',
    			component: resolve => require(['../components/page/Login.vue'], resolve),
          children: [
            {
              path: '',
              component: resolve => require(['../components/page/Login-login.vue'], resolve)
            },
            {
              path: 'login',
              component: resolve => require(['../components/page/Login-login.vue'], resolve)
            },
            {
              path: 'forget',
              component: resolve => require(['../components/page/Login-forgetPWD.vue'], resolve)
            },
            {
              path: 'fill',
              component: resolve => require(['../components/page/Login-fillPWD.vue'], resolve)
            }
          ] 
    		},
        {
          path: 'address',
          component: resolve => require(['../components/page/Address.vue'], resolve) 
        },
        {
          path: 'plan',
          component: resolve => require(['../components/page/Plan.vue'], resolve),
          children: [
            {
              path: '',
              component: resolve => require(['../components/page/Plan-detail.vue'], resolve)
            },
            {
              path: 'detail',
              component: resolve => require(['../components/page/Plan-detail.vue'], resolve)
            },
            {
              path: 'create',
              component: resolve => require(['../components/page/Plan-create.vue'], resolve)
            },
            {
              path: 'fill',
              component: resolve => require(['../components/page/Plan-fill.vue'], resolve)
            }
          ] 
        },
        {
          path: 'report',
          component: resolve => require(['../components/page/Report.vue'], resolve),
          children: [
            {
              path: '',
              component: resolve => require(['../components/page/Report-detail.vue'], resolve)
            },
            {
              path: 'detail',
              component: resolve => require(['../components/page/Report-detail.vue'], resolve)
            },
            {
              path: 'create',
              component: resolve => require(['../components/page/Report-create.vue'], resolve)
            },
            {
              path: 'fill',
              component: resolve => require(['../components/page/Report-fill.vue'], resolve)
            }
          ] 
        },
        {
          path: 'project',
          component: resolve => require(['../components/page/Project.vue'], resolve),
          children: [
            {
              path: '',
              component: resolve => require(['../components/page/Project-detail.vue'], resolve)
            },
            {
              path: 'detail',
              component: resolve => require(['../components/page/Project-detail.vue'], resolve) 
            },
            {
              path: 'create',
              component: resolve => require(['../components/page/Project-create.vue'], resolve) 
            },
            {
              path: 'createItem',
              component: resolve => require(['../components/page/Project-item.vue'], resolve) 
            }
          ]
        }
    	]
    }
  ]
})
