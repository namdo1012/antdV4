import request from '@/utils/request';
import axios from 'axios';

const ip = 'https://apivanphongso.aisenote.com';
export async function login({ username, password }) {
  return axios.post(`${ip}/auth/login`, { username, password });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
