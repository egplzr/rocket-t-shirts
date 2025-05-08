angular.module("lojaApp").controller("LojaController", function ($scope, ProductService, CartService, AuthService) {
    $scope.loginData = {};
    $scope.novoProduto = {};
    $scope.produtos = [];
    $scope.token = AuthService.getToken();
    $scope.carrinho = [];
    $scope.errorMessage = "";

    $scope.estaLogado = AuthService.isLoggedIn;

    $scope.logout = function () {
        AuthService.logout();
        $scope.token = null;
        $scope.carrinho = [];
    };

    $scope.login = function () {
        AuthService.login($scope.loginData).then(() => {
            $scope.token = AuthService.getToken();
            $scope.getProdutos();
            $scope.verCarrinho();
        }).catch(() => {
            $scope.errorMessage = "Login inválido.";
        });
    };

    $scope.getProdutos = function () {
        ProductService.listar().then(produtos => {
            $scope.produtos = produtos;
        });
    };

    $scope.criarProduto = function () {
        ProductService.criar($scope.novoProduto).then(() => {
            alert("Produto criado!");
            $scope.getProdutos();
        });
    };

    $scope.adicionarAoCarrinho = function (produto) {
        CartService.adicionar(produto).then(() => {
            alert("Adicionado ao carrinho!");
            $scope.verCarrinho();
        });
    };

    $scope.verCarrinho = function () {
        if (!$scope.estaLogado()) {
            console.log("Carrinho local:", $scope.carrinho);
            return;
        }
        CartService.listar().then(carrinho => {
            $scope.carrinho = carrinho;
        });
    };

    $scope.getProdutos();
    if ($scope.estaLogado()) $scope.verCarrinho();
});
