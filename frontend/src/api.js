import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3005'
  /*`http://52.193.252.15/`,*/
});

export default instance;
