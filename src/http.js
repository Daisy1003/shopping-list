import axios from 'axios'
import {Message, Loading} from 'element-ui'
import router from './router'

let loading;

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0,0,0,0.7)'
  })
}

function endLoading() {
  loading.close();
}

//请求拦截
axios.interceptors.request.use(config => {
    startLoading();
    if(localStorage.manageToken) {
      //设置统一请求头
      config.headers.Authorization = localStorage.manageToken
    }
    return config;
  }, error => {
    return Promise.reject(error)
  }
);

//响应拦截
axios.interceptors.response.use(res => {
    endLoading();
    return res;
  }, error => {
    endLoading();
    Message.error(error.response.data);
    const { status } = error.response;
    //token过期
    if (status == 401) {
      Message.error('token过期，请重新登录！');
      //清除token
      localStorage.removeItem('manageToken');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default axios