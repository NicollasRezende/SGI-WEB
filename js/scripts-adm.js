console.log('Arquivo scripts-adm.js carregado');

const addUserForm = document.getElementById('add-user-form');
const userList = document.getElementById('user-list');
const updateForm = document.getElementById('updateForm');

async function listUsers() {
    try {
        const response = await fetch('http://localhost:3000/api/users/all');
        const users = await response.json();

        if (!Array.isArray(users)) {
            throw new Error('Resposta inesperada da API');
        }

        userList.innerHTML = '';

        users.forEach((user) => {
            const row = userList.insertRow();
            row.setAttribute('data-id', user.id);

            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.user_type}</td>
                <td>
                    <button class="remove" onclick="removeUser(${user.id})">Remover</button>
                </td>
            `;
        });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
    }
}

async function showUpdateForm(userId) {
    try {
        const response = await fetch(
            `http://localhost:3000/api/users/id/${userId}`
        );
        const user = await response.json();

        updateForm.querySelector('input[id="update-id"]').value = user.id;
        updateForm.querySelector('input[id="update-username"]').value =
            user.username;
        updateForm.querySelector('input[id="update-password"]').value =
            user.password;
        updateForm.querySelector('select[id="update-role"]').value =
            user.user_type;

        document.getElementById('updateModal').style.display = 'block';
    } catch (error) {
        console.error('Erro ao buscar o usuário:', error);
    }
}

async function updateUser(event) {
    event.preventDefault();

    const userId = updateForm.querySelector('input[id="update-id"]').value;
    const username = updateForm.querySelector(
        'input[id="update-username"]'
    ).value;
    const password = updateForm.querySelector(
        'input[id="update-password"]'
    ).value;
    const userType = updateForm.querySelector('select[id="update-role"]').value;

    if (!userId || !username || !password || !userType) {
        console.error('Erro: Um ou mais campos estão faltando no formulário.');
        return;
    }

    const updatedUser = { username, password, user_type: userType };

    try {
        const response = await fetch(
            `http://localhost:3000/api/users/update/${userId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao atualizar o usuário');
        }

        await listUsers();
        closeModal();
    } catch (error) {
        console.error('Erro ao tentar atualizar o usuário:', error);
    }
}

function closeModal() {
    document.getElementById('updateModal').style.display = 'none';
}

async function addUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-role').value;

    const newUser = { username, password, user_type: userType };

    try {
        const response = await fetch('/api/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });

        await listUsers();
    } catch (err) {
        console.error('Erro ao adicionar usuário:', err);
    }

    addUserForm.reset();
}

async function removeUser(id) {
    try {
        const response = await fetch(`/api/users/remove/${id}`, {
            method: 'DELETE',
        });

        await listUsers();
    } catch (err) {
        console.error('Erro ao remover usuário:', err);
    }
}

addUserForm.addEventListener('submit', addUser);
window.onload = listUsers;
