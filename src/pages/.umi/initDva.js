import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'company', ...(require('F:/thb_admin_antd_pro/src/models/company.js').default) });
app.model({ namespace: 'global', ...(require('F:/thb_admin_antd_pro/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('F:/thb_admin_antd_pro/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('F:/thb_admin_antd_pro/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('F:/thb_admin_antd_pro/src/models/menu.js').default) });
app.model({ namespace: 'message', ...(require('F:/thb_admin_antd_pro/src/models/message.js').default) });
app.model({ namespace: 'order', ...(require('F:/thb_admin_antd_pro/src/models/order.js').default) });
app.model({ namespace: 'project', ...(require('F:/thb_admin_antd_pro/src/models/project.js').default) });
app.model({ namespace: 'setting_thb', ...(require('F:/thb_admin_antd_pro/src/models/setting_thb.js').default) });
app.model({ namespace: 'setting', ...(require('F:/thb_admin_antd_pro/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('F:/thb_admin_antd_pro/src/models/user.js').default) });
