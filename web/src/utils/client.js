import axios, { Axios } from "axios";

let instance = null;
class Client {
    Instance() {
        if (!instance) {
            instance = axios.create({ baseURL: 'http://207.148.68.86:3001' });
        }
        return instance;
    }
}
const i = new Client();
export default i.Instance();