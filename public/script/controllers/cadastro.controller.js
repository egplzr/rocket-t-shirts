angular.module("lojaApp").controller("CadastroController", function ($scope, $window, AuthService) {
    $scope.cadastroData = {
        nome: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };
    
    $scope.errorMessage = "";
    $scope.successMessage = "";

    $scope.cadastrar = function () {
        if ($scope.cadastroData.password !== $scope.cadastroData.confirmPassword) {
            $scope.errorMessage = "As senhas não coincidem!";
            $scope.successMessage = "";
            return;
        }

        AuthService.register($scope.cadastroData)
            .then(() => {
                $scope.successMessage = "Cadastro realizado com sucesso!";
                $scope.errorMessage = "";
                setTimeout(() => {
                    $window.location.href = '../index.html';
                }, 2000);
            })
            .catch((err) => {
                $scope.errorMessage = err.data?.message || "Erro ao realizar cadastro.";
                $scope.successMessage = "";
            });
    };
});
