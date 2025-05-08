angular.module("lojaApp").factory("AuthService", function ($http) {
    const API = "http://localhost:3000";
    let token = localStorage.getItem("token");

    function saveToken(t) {
        token = t;
        localStorage.setItem("token", t);
    }

    return {
        login: (data) => $http.post(API + "/auth/login", data).then(res => {
            saveToken(res.data.token);
        }),
        register: (data) => $http.post(API + "/users/register", {
            username: data.username,
            password: data.password
        }),
        logout: () => localStorage.removeItem("token"),
        getToken: () => token,
        isLoggedIn: () => !!token
    };
});
