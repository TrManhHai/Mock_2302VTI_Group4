import Api from './Api';
import FormData from 'form-data';

const login = (username, password) => {

    var body = new FormData();
    body.append('username', username);
    body.append('password', password);

    return Api.post("/login", body);
};

// export
const api = { login }
export default api;