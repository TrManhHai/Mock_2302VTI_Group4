import Api from './Api';

const url = "/groups";

const getAll = (page, size, sortField, sortType, search, minTotalMember, maxTotalMember) => {

    // default parameters
    if (sortField === null || sortField === undefined || sortType === null || sortType === undefined) {
        sortField = "id";
        sortType = "desc";
    }

    const requestParams = {
        page,
        size,
        sort: `${sortField},${sortType}`,
        search,
        minTotalMember,
        maxTotalMember
    }

    if (minTotalMember) {
        requestParams.minTotalMember = minTotalMember;
    }

    if (maxTotalMember) {
        requestParams.maxTotalMember = maxTotalMember;
    }

    return Api.get(url, { params: requestParams });
};

const existsByName = (name) => {
    return Api.get(`${url}/name/${name}`);
};

const create = (name) => {
    const body = {
        name
    };

    return Api.post(url, body);
};

const getByID = (id) => {
    return Api.get(`${url}/${id}`);
};

const update = (id, name, totalMember) => {
    const body = {
        name,
        totalMember
    }
    return Api.put(`${url}/${id}`, body);
};

const deleteByIds = (ids) => {
    return Api.delete(`${url}/${ids.toString()}`);
};

// export
const api = { getAll, existsByName, create, update, getByID, deleteByIds }
export default api;