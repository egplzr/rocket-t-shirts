angular.module("lojaApp").factory("ProductService", function ($http, AuthService) {
    const API = "http://localhost:3000/products";

    return {
        listar: () => $http.get(API).then(res => res.data),
        criar: (produto) => {
            const formData = new FormData();
            formData.append('name', produto.name);
            formData.append('price', produto.price);
            formData.append('description', produto.description);

            const fileInput = document.getElementById("imagemInput");
            if (fileInput.files.length > 0) {
                formData.append('image', fileInput.files[0]);
            }

            return $http.post(API, formData, {
                headers: {
                    Authorization: "Bearer " + AuthService.getToken(),
                    'Content-Type': undefined
                }
            });
        }
    };
});
