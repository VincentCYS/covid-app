const AsyncStorage = require("react-native").AsyncStorage;


var API = function() {}

// declare API endpoint
const EP = {
    prod : "https://api.n-cov.info",
    local : "http://localhost:13500"
}["prod"];
// set prototype
API.prototype.get = function(path, query = {}){
    return new Promise((resolve, reject) => {
        // set headers
        var headerParams = {
            'Content-Type'  : 'application/json'
        };
        // get user id and token
        new Promise((_resolve, _reject) => {
            var queryString = "";
            if(Object.keys(query).length > 0) queryString = `?${Object.keys(query).map(key => { return `${key}=${query[key]}`}).join("&")}`;
            // login
            fetch(`${EP}${path}${queryString}`, { 
                method  : 'GET', 
                headers : new Headers(headerParams)
            })
            // get respoonse
            .then((response) => response.json())
            // get res's json format
            .then(resolve)
            // error ?
            .catch(error => reject({
                code     : 500,
                messages : [error]
            }));
        })
        // error
        .catch(reject);
    });
};

module.exports = new API();