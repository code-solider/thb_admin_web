export default [
    // user
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            { path: '/user', redirect: '/user/login' },
            { path: '/user/login', name: 'login', component: './User/Login' },
            { path: '/user/register', name: 'register', component: './User/Register' },
            {
                path: '/user/register-result',
                name: 'register.result',
                component: './User/RegisterResult',
            },
            {
                component: '404',
            },
        ],
    },
    // app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        routes: [
            // dashboard
            { path: '/', redirect: '/company/list', authority: ['admin'] },
            // {
            //     path: '/dashboard',
            //     name: 'dashboard',
            //     icon: 'dashboard',
            //     component: './Dashboard/Analysis',
            //     // routes: [
            //     //   {
            //     //     path: '/dashboard/analysis',
            //     //     name: 'analysis',
            //     //     component: './Dashboard/Analysis',
            //     //   },
            //     //   {
            //     //     path: '/dashboard/monitor',
            //     //     name: 'monitor',
            //     //     component: './Dashboard/Monitor',
            //     //   },
            //     //   {
            //     //     path: '/dashboard/workplace',
            //     //     name: 'workplace',
            //     //     component: './Dashboard/Workplace',
            //     //   },
            //     // ],
            // },
            // forms
            // {
            //     path: '/form',
            //     icon: 'form',
            //     name: 'form',
            //     routes: [
            //         {
            //             path: '/form/basic-form',
            //             name: 'basicform',
            //             component: './Forms/BasicForm',
            //         },
            //         {
            //             path: '/form/step-form',
            //             name: 'stepform',
            //             component: './Forms/StepForm',
            //             hideChildrenInMenu: true,
            //             routes: [
            //                 {
            //                     path: '/form/step-form',
            //                     redirect: '/form/step-form/info',
            //                 },
            //                 {
            //                     path: '/form/step-form/info',
            //                     name: 'info',
            //                     component: './Forms/StepForm/Step1',
            //                 },
            //                 {
            //                     path: '/form/step-form/confirm',
            //                     name: 'confirm',
            //                     component: './Forms/StepForm/Step2',
            //                 },
            //                 {
            //                     path: '/form/step-form/result',
            //                     name: 'result',
            //                     component: './Forms/StepForm/Step3',
            //                 },
            //             ],
            //         },
            //         {
            //             path: '/form/advanced-form',
            //             name: 'advancedform',
            //             authority: ['admin'],
            //             component: './Forms/AdvancedForm',
            //         },
            //     ],
            // },
            {
                path: '/company/list',
                name: '公司名录',
                icon: 'book',
                component: './Company/index'
            },
            // list
            {
                path: '/list',
                icon: 'table',
                name: '同行名录',
                component: './List/TableList',

            },
            {
                path: '/message/list',
                name: '同行社交',
                icon: 'message',
                component: './Message/index'
            },
            {
                path: '/order/list',
                name: '订单管理',
                icon: 'snippets',
                component: './Order/index'
            },
            {
                path: '/setting',
                name: '系统设置',
                icon: 'setting',
                component: './Setting/index'
            },
            {
                component: '404',
            },
        ],
    },
];
