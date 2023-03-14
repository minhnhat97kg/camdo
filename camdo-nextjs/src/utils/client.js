import axios, { Axios } from "axios";

let instance = null;
class Client {
    Instance() {
        if (!instance) {
            instance = axios.create({ baseURL: process.env.REACT_APP_HOST || 'http://localhost:3001/api' });
        }
        return instance;
    }
}
export default new Client().Instance();