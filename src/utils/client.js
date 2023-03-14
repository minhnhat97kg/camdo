import axios, { Axios } from "axios";

let instance = null;
class Client {
    Instance() {
        if (!instance) {
            instance = axios.create({ baseURL: '/api/' });
        }
        return instance;
    }
}
export default new Client().Instance();