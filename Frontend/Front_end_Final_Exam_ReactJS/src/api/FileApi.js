import Api from './Api';
import FormData from 'form-data';

const url = "/files";

const uploadImage = (imageFile) => {

    var body = new FormData();
    body.append('image', imageFile);

    return Api.post(`${url}/image`, body);
};

// export
const api = { uploadImage }
export default api;