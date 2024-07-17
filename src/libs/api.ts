import { createAxios } from '@blocklet/js-sdk';
import { message } from 'antd';

const api = createAxios({
  baseURL: window?.blocklet?.prefix || '/',
});

api.interceptors.response.use(
  function (res) {
    return res;
  },
  function (error) {
    // console.log(error.response.data.error);
    message.error(error.response.data.error || '系统错误');
    return Promise.reject(error);
  },
);

export default api;
