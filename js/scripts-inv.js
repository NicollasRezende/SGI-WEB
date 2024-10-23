const addProductForm = document.getElementById('add-product-form');
const productList = document
    .getElementById('product-list')
    .getElementsByTagName('tbody')[0];

async function listProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products/all');
        const products = await response.json();

        if (!Array.isArray(products)) {
            throw new Error('Resposta inesperada da API');
        }

        productList.innerHTML = '';

        products.forEach((product) => {
            const row = productList.insertRow();
            row.setAttribute('data-id', product.id);
            const formattedPrice = parseFloat(product.price);

            row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.quantity}</td>
            <td>${
                isNaN(formattedPrice) ? 'N/A' : formattedPrice.toFixed(2)
            }</td>
            <td>${product.location}</td> <!-- Adicione esta linha -->
            <td>
                <button class="remove" onclick="removeProduct(${
                    product.id
                })">Remover</button>
                <button class="update" onclick="showUpdateForm(${
                    product.id
                })">Atualizar</button>
            </td>
        `;
        });

        async function updateProduct(event) {
            event.preventDefault();
            const form = event.target;
            const productId = form.id.value;
            const updatedProduct = {
                name: form.name.value,
                description: form.description.value,
                quantity: parseInt(form.quantity.value),
                price: parseFloat(form.price.value),
            };

            try {
                const response = await fetch(
                    `http://localhost:3000/api/products/update/${productId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedProduct),
                    }
                );

                if (!response.ok) {
                    throw new Error('Erro ao atualizar o produto');
                }

                await listProducts();
                form.reset();
                closeModal();
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
    }
}

function showUpdateForm(productId) {
    const form = document.getElementById('updateForm');
    const productRow = productList.querySelector(`tr[data-id="${productId}"]`);
    const productData = {
        id: productId,
        name: productRow.cells[0].innerText,
        description: productRow.cells[1].innerText,
        quantity: productRow.cells[2].innerText,
        price: productRow.cells[3].innerText,
    };

    form.querySelector('input[name="id"]').value = productData.id;
    form.querySelector('input[name="name"]').value = productData.name;
    form.querySelector('textarea[name="description"]').value =
        productData.description;
    form.querySelector('input[name="quantity"]').value = productData.quantity;
    form.querySelector('input[name="price"]').value = productData.price;

    const modal = document.getElementById('updateModal');
    modal.style.display = 'block';
}

async function updateProduct(event) {
    event.preventDefault();
    const form = event.target;
    const productId = form.id.value;
    const updatedProduct = {
        name: form.name.value,
        description: form.description.value,
        quantity: parseInt(form.quantity.value),
        price: parseFloat(form.price.value),
        location: form.location.value,
    };

    try {
        const response = await fetch(
            `http://localhost:3000/api/products/update/${productId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao atualizar o produto');
        }

        await listProducts();

        const modal = document.getElementById('updateModal');
        modal.style.display = 'none';
    } catch (error) {
        console.error(error);
    }
}

function closeModal() {
    const modal = document.getElementById('updateModal');
    modal.style.display = 'none';
}

async function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const quantity = document.getElementById('product-quantity').value;
    const price = document.getElementById('product-price').value;
    const productLocation = document.getElementById('product-location').value;

    const newProduct = {
        name,
        description,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        location: productLocation,
    };

    try {
        const response = await fetch('/api/products/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });

        const addedProduct = await response.json();
        console.log('Produto adicionado:', addedProduct);
        listProducts();
    } catch (err) {
        console.error('Erro ao adicionar produto:', err);
    }

    addProductForm.reset();
}

async function removeProduct(id) {
    try {
        const response = await fetch(`/api/products/remove/${id}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        console.log('Produto removido:', result);
        listProducts();
    } catch (err) {
        console.error('Erro ao remover produto:', err);
    }
}

addProductForm.addEventListener('submit', addProduct);

window.onload = listProducts;
