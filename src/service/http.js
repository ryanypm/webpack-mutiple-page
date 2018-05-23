export const appendParams = (url, params) => {
    if (!params) {
        return url;
    }
    let queryString = Object
        .entries(params)
        .map(entry => `${entry[0]}=${encodeURIComponent(entry[1])}`)
        .join('&');

    if (!queryString) {
        return url;
    }
    if (url.indexOf('?') === -1) {
        return `${url}?${queryString}`;
    }
    return `${url}&${queryString}`;
};

const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(response.statusText || response.msg);
        error.response = response;
        throw error;
    }
}

const request = (url, opts) => {
    return fetch(url, opts).then(checkStatus).then(response => response.json());
};

export const toBody = (params) => {
    if (params === null || params === undefined) {
        return '';
    }
    if (typeof params === 'object') {
        return JSON.stringify(params);
    }

    return params.toString();
}

export const get = (url, params = {}, opts = {}) => {
    return request(
        appendParams(url, params),
        Object.assign({}, opts, { method: 'GET' }));
};

export const post = (url, params = {}, opts = {}) => {
    return request(url,
        Object.assign({}, opts, { method: 'POST', body: toBody(params) }));
};

export const put = (url, params = {}, opts = {}) => {
    return request(url,
        Object.assign({}, opts, { method: 'PUT', body: toBody(params) }));
};

