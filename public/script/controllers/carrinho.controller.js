angular.module("lojaApp").controller("CarrinhoController", function ($scope, CartService, AuthService) {
    $scope.carrinho = [];
    $scope.token = AuthService.getToken();

    $scope.estaLogado = AuthService.isLoggedIn;

    $scope.verCarrinho = function () {
        if (!$scope.estaLogado()) {
            console.log("Mostrando carrinho local:", $scope.carrinho);
            return;
        }

        CartService.listar().then(carrinho => {
            $scope.carrinho = carrinho;
        });
    };

    $scope.atualizarQuantidade = function (itemId, novaQuantidade) {
        if (!novaQuantidade || novaQuantidade < 1) {
            alert("Quantidade inválida.");
            return;
        }

        CartService.atualizar(itemId, novaQuantidade)
            .then(() => {
                alert("Quantidade atualizada!");
                $scope.verCarrinho();
            });
    };

    $scope.removerDoCarrinho = function (itemId) {
        CartService.remover(itemId)
            .then(() => {
                alert("Item removido!");
                $scope.verCarrinho();
            });
    };

    if ($scope.estaLogado()) {
        $scope.verCarrinho();
    }
});
