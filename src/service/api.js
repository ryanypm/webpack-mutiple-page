import { get, post, put, toBody, appendParams } from "./http";
import config from './config';

const _session = '';
const onAPIResponse = (data) => {
    if (data.err > 0) {
        throw data;
    }
    return data;
}

const getDefaultHeaders = () => {
    return {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${_session}`,
    };
}

const composeOptions = (opts) => {
    // default options
    const defaultOptions = {
        headers: getDefaultHeaders(),
    };
    return Object.assign(defaultOptions, opts);
};

const getAPI = (path, params, opts) => {
    return get(`${config.API_SERVER}${path}`, params, composeOptions(opts)).then(onAPIResponse);
};

const postAPI = (path, params, opts) => {
    return post(`${config.API_SERVER}${path}`, params, composeOptions(opts)).then(onAPIResponse);
};

const putAPI = (path, params, opts) => {
    return put(`${config.API_SERVER}${path}`, params, composeOptions(opts)).then(onAPIResponse);
};


/**
 * 获取用户信息
 */
export const getUserInfo = () => {
    return getAPI('/v1/user/info');
}
