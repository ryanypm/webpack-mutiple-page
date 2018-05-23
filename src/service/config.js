// const isProd = process.env.NODE_ENV === 'production';

let env = 'beta', isProd = false;
if(location.protocol === 'https:'){
    env = 'prod';
    isProd = true;
}

const serverConfig = {
    beta: {
        API_SERVER: 'http://localhost:3000',
    },
    prod: {
        API_SERVER: 'http://localhost:3000',
    },
}

const config = {
    PROD: isProd,
    // API server
    API_SERVER: serverConfig[env].API_SERVER,
};

export default config;
