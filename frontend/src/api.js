import axios from 'axios'

const instance = axios.create({
  baseURL: `https://52.193.252.15/`
  /*'http://localhost:3005'*/
});

export default instance;
