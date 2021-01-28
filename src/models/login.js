import { stringify } from 'querystring';
import { history } from 'umi';
import { login } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { notification } from 'antd';

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message: `${message}`,
    description: `${description}`,
    placement: 'bottomRight',
  });
};

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const { userName: username, password } = payload;
      let response;
      try {
        response = yield call(login, { username, password });
      } catch {
        openNotificationWithIcon(
          'error',
          'Tên tài khoản hoặc mật khẩu không đúng',
          'Nhập từ từ thôi!',
        );
        return;
      }

      const { data } = response;
      // console.log('Response ==>', response?.data);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      // console.log('token==>', response.accessToken);
      if (data.accessToken) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！');
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');

        // Login success alert
        openNotificationWithIcon('success', 'Đăng nhập thành công', 'Gút chóp');
      }
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
