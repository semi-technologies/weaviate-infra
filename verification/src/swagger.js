const Swagger = require('swagger-client');

module.exports = (options) => {
  const insertTokenRequestInterceptor = (req) => {
    req.headers['X-API-KEY'] = options.authorization.apiKey;
    req.headers['X-API-TOKEN'] = options.authorization.apiToken;
    req.url = req.url.replace(/^https/, 'http');

    return req;
  };

  return Swagger({
    url: 'http://localhost:8080/swagger.json',
    requestInterceptor: insertTokenRequestInterceptor,
  });
};