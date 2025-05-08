angular.module("lojaApp").factory("CartService", function ($http, AuthService) {
    const API = "http://localhost:3000/cart";

    function auth() {
        return { headers: { Authorization: "Bearer " + AuthService.getToken() } };
    }

    return {
        adicionar: (produto) => $http.post(API, { productId: produto.id, quantity: 1 }, auth()),
        listar: () => $http.get(API, auth()).then(res => res.data.map(i => ({
            ...i,
            novaQuantidade: i.quantity
        }))),
        atualizar: (id, quantity) => $http.patch(`${API}/${id}`, { quantity }, auth()),
        remover: (id) => $http.delete(`${API}/${id}`, auth())
    };
});
