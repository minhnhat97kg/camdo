import axios, { Axios } from "axios";

let instance = null;
class Client {
    Instance() {
        if (!instance) {
            instance = axios.create({ baseURL: 'http://localhost:3001' });
        }
        return instance;
    }
}
const i = new Client();
export default i.Instance();