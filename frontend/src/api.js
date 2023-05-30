import axios from 'axios'

const instance = axios.create({
  baseURL: `https://thrifty-tw.shop/`
  /*'http://localhost:3005'*/
});

export default instance;
