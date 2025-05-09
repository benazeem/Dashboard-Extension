// judge0Client.js
import axios from 'axios';

const judge0Client = axios.create({
  baseURL: 'https://compiler.maksrv.live',
  headers: {
    'X-Auth-Token': import.meta.env.VITE_JUDGE0APITOKEN,
    'Content-Type': 'application/json'
  }
});
export default judge0Client;
