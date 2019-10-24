import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'company', ...(require('D:/job/thb_admin_antd_pro/src/models/company.js').default) });
app.model({ namespace: 'global', ...(require('D:/job/thb_admin_antd_pro/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('D:/job/thb_admin_antd_pro/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('D:/job/thb_admin_antd_pro/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('D:/job/thb_admin_antd_pro/src/models/menu.js').default) });
app.model({ namespace: 'message', ...(require('D:/job/thb_admin_antd_pro/src/models/message.js').default) });
app.model({ namespace: 'order', ...(require('D:/job/thb_admin_antd_pro/src/models/order.js').default) });
app.model({ namespace: 'project', ...(require('D:/job/thb_admin_antd_pro/src/models/project.js').default) });
app.model({ namespace: 'setting_thb', ...(require('D:/job/thb_admin_antd_pro/src/models/setting_thb.js').default) });
app.model({ namespace: 'setting', ...(require('D:/job/thb_admin_antd_pro/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('D:/job/thb_admin_antd_pro/src/models/user.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
