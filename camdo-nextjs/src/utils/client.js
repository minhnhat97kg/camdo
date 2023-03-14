import axios, { Axios } from "axios";

let instance = null;
class Client {
    Instance() {
        if (!instance) {
            instance = axios.create({ baseURL: process.env.REACT_APP_HOST || '/api/' });
        }
        return instance;
    }
}
export default new Client().Instance();