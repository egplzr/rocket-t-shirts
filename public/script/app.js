// Aplicativo Angular para a Rocket T-Shirts
const app = angular.module("lojaApp", []);

app.controller("LojaController", function ($scope, $http, $window) {
    // Configurações de API
    const API = "http://localhost:3000";

    // Estado inicial da aplicação
    $scope.loginData = {};
    $scope.cadastroData = {
        nome: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };
    $scope.novoProduto = {};
    $scope.produtos = [];
    $scope.carrinho = [];
    $scope.mostraLogin = false;
    $scope.errorMessage = "";
    $scope.successMessage = "";

    // Verificar se já existe um token armazenado
    $scope.token = localStorage.getItem("token");

    // Função para verificar se o usuário está logado
    $scope.estaLogado = function () {
        return !!$scope.token;
    };

    // Função para configurar o cabeçalho de autenticação
    function setAuthHeader() {
        return { headers: { Authorization: "Bearer " + $scope.token } };
    }

    // Função para alternar formulário de login
    $scope.toggleLogin = function () {
        $scope.mostraLogin = !$scope.mostraLogin;
    };

    // Função para realizar cadastro de usuário
    $scope.cadastrar = function () {
        // Validar se as senhas são iguais
        if ($scope.cadastroData.password !== $scope.cadastroData.confirmPassword) {
            $scope.errorMessage = "As senhas não coincidem!";
            $scope.successMessage = "";
            return;
        }

        // Enviar apenas os dados esperados pelo backend
        $http.post(API + "/users/register", {
            username: $scope.cadastroData.username,
            password: $scope.cadastroData.password
        }).then(function (res) {
            $scope.errorMessage = "";
            $scope.successMessage = "Cadastro realizado com sucesso!";

            // Redirecionar para a página inicial após o cadastro
            setTimeout(function () {
                $window.location.href = '../index.html';
            }, 2000);
        }).catch(function (err) {
            $scope.successMessage = "";
            $scope.errorMessage = err.data?.message || "Erro ao realizar cadastro. Tente novamente.";
            console.error("Erro ao cadastrar:", err);
        });
    };

    // Função de login
    $scope.login = function () {
        $http.post(API + "/auth/login", $scope.loginData).then(res => {
            $scope.token = res.data.token;
            localStorage.setItem("token", $scope.token);
            $scope.errorMessage = "";

            // Carregar produtos e carrinho após login
            $scope.getProdutos();
            $scope.verCarrinho();
        }).catch(err => {
            $scope.errorMessage = "Login inválido.";
        });
    };

    // Função de logout
    $scope.logout = function () {
        $scope.token = null;
        localStorage.removeItem("token");
        $scope.carrinho = [];
    };

    // Buscar produtos da API
    $scope.getProdutos = function () {
        $http.get(API + "/products").then(res => {
            $scope.produtos = res.data;
        }).catch(err => {
            console.error("Erro ao buscar produtos:", err);
        });
    };

    // Criar um novo produto (requer autenticação)
    $scope.criarProduto = function () {
        if (!$scope.estaLogado()) {
            alert("Você precisa estar logado para criar produtos");
            return;
        }

        $http.post(API + "/products", $scope.novoProduto, setAuthHeader()).then(res => {
            alert("Produto criado com sucesso!");
            $scope.novoProduto = {};
            $scope.getProdutos();
        }).catch(err => {
            console.error("Erro ao criar produto:", err);
            alert("Erro ao criar produto");
        });
    };

    // Adicionar item ao carrinho
    $scope.adicionarAoCarrinho = function (produto) {
        // Verificar se produto é um ID ou um objeto
        let produtoId;
        if (typeof produto === 'number') {
            produtoId = produto;
        } else if (produto && produto.id) {
            produtoId = produto.id;
        } else if (produto && typeof produto === 'object') {
            // Se for um objeto sem ID definido (como nos cards estáticos)
            // Vamos usar uma propriedade alternativa ou gerar um ID temporário
            produtoId = produto.productId || produto.id || Date.now();
        } else {
            console.error("Produto inválido:", produto);
            alert("Erro: Produto inválido");
            return;
        }

        console.log("Adicionando produto ao carrinho:", produtoId);

        // Se não estiver autenticado, o produto será armazenado temporariamente
        if (!$scope.estaLogado()) {
            // Adiciona item ao carrinho temporário ou incrementa a quantidade
            let encontrado = false;
            for (let i = 0; i < $scope.carrinho.length; i++) {
                if ($scope.carrinho[i].productId === produtoId) {
                    $scope.carrinho[i].quantity += 1;
                    encontrado = true;
                    break;
                }
            }

            if (!encontrado) {
                $scope.carrinho.push({
                    productId: produtoId,
                    product: produto,
                    quantity: 1
                });
            }

            alert("Item adicionado ao carrinho local!");
            return;
        }

        // Se autenticado, enviar para a API
        $http.post(API + "/cart", {
            productId: produtoId,
            quantity: 1
        }, setAuthHeader())
            .then(res => {
                alert("Produto adicionado ao carrinho!");
                $scope.verCarrinho();
            })
            .catch(err => {
                console.error("Erro ao adicionar ao carrinho:", err);
                if (err.status === 401) {
                    alert("Sessão expirada. Por favor, faça login novamente.");
                    $scope.logout();
                } else {
                    alert("Erro ao adicionar ao carrinho: " + (err.data?.message || err.statusText || "Erro desconhecido"));
                }
            });
    };

    // Visualizar o carrinho
    $scope.verCarrinho = function () {
        if (!$scope.estaLogado()) {
            // Se não estiver logado, apenas mostra o carrinho local
            console.log("Mostrando carrinho local:", $scope.carrinho);
            return;
        }

        $http.get(API + "/cart", setAuthHeader())
            .then(res => {
                $scope.carrinho = res.data;
                console.log("Carrinho carregado da API:", $scope.carrinho);
            })
            .catch(err => {
                console.error("Erro ao buscar carrinho:", err);
                if (err.status === 401) {
                    alert("Sessão expirada. Por favor, faça login novamente.");
                    $scope.logout();
                }
            });
    };

    // Remover item do carrinho
    $scope.removerDoCarrinho = function (produtoId) {
        if (!$scope.estaLogado()) {
            // Remove do carrinho local
            $scope.carrinho = $scope.carrinho.filter(item => item.productId !== produtoId);
            return;
        }

        // Remove da API
        $http.delete(API + "/cart/" + produtoId, setAuthHeader())
            .then(() => {
                alert("Item removido do carrinho!");
                $scope.verCarrinho();
            })
            .catch(err => {
                console.error("Erro ao remover do carrinho:", err);
                alert("Erro ao remover item do carrinho");
            });
    };

    // Carregar produtos ao iniciar
    $scope.getProdutos();

    // Se estiver logado, carregar o carrinho também
    if ($scope.estaLogado()) {
        $scope.verCarrinho();
    }
});