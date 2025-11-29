let users = [
    {
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        email: 'john@example.com',
        photo: null,
    },
    {
        firstName: 'Anna',
        lastName: 'Smith',
        age: 17,
        email: 'anna@example.com',
        photo: null,
    },
];

function loadFromLocalStorage() {
    const saved = localStorage.getItem('userAppState');
    if (!saved) return;

    try {
        const state = JSON.parse(saved);

        users = state.users || users;

        if (state.filter18 !== undefined) {
            document.getElementById('filter18').checked = state.filter18;
        }

        if (state.sortSelect !== undefined) {
            document.getElementById('sortSelect').value = state.sortSelect;
        }
    } catch (e) {
        console.error('Ошибка загрузки из localStorage', e);
    }
}

function updateUI() {
    function renderUsers(list) {
        const container = document.getElementById('userList');
        container.innerHTML = '';

        list.forEach((u, index) => {
            container.innerHTML += `
            <div class="user-card">
                <div class="user-avatar-wrapper ${
                    u.photo ? '' : 'user-avatar-wrapper--default'
                }">
                    <img src="${
                        u.photo || 'images/default.png'
                    }" class="user-avatar-pic">
                </div>                
                <div class="user-info">
                    <p><strong>${u.firstName} ${u.lastName}</strong></p>
                    <p>Возраст: ${u.age}</p>
                    <p>Email: ${u.email}</p>

                    <label>Добавить фото:
                        <input type="file" data-index="${index}" class="upload-photo">
                    </label>
                </div>
            </div>
        `;
        });
    }

    function getFilteredAndSortedUsers() {
        let result = [...users];

        if (document.getElementById('filter18').checked) {
            result = result.filter((user) => user.age > 18);
        }

        const sortValue = document.getElementById('sortSelect').value;

        if (sortValue === 'name') {
            result.sort((a, b) => a.firstName.localeCompare(b.firstName));
        }
        if (sortValue === 'age') {
            result.sort((a, b) => a.age - b.age);
        }

        return result;
    }

    function saveToLocalStorage() {
        const state = {
            users,
            filter18: document.getElementById('filter18').checked,
            sortSelect: document.getElementById('sortSelect').value,
        };

        localStorage.setItem('userAppState', JSON.stringify(state));
    }

    renderUsers(getFilteredAndSortedUsers());
    saveToLocalStorage();
}

async function loadFromAPI() {
    try {
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/users'
        );
        const apiUsers = await response.json();

        apiUsers.forEach((apiUser) => {
            const [firstName, lastName = ''] = apiUser.name.split(' ');

            const existing = users.find((u) => u.email === apiUser.email);

            if (existing) {
                existing.firstName = firstName;
                existing.lastName = lastName;
                existing.email = apiUser.email;
                existing.age =
                    existing.age || 18 + Math.floor(Math.random() * 30);
            } else {
                users.push({
                    firstName,
                    lastName,
                    email: apiUser.email,
                    age: 18 + Math.floor(Math.random() * 30),
                    photo: null,
                });
            }
        });

        updateUI();
    } catch (err) {
        console.error('Ошибка загрузки API:', err);
    }
}

// События фильтра и сортировки
document.getElementById('filter18').addEventListener('change', updateUI);
document.getElementById('sortSelect').addEventListener('change', updateUI);

// Событие загрузки фото
document.getElementById('userList').addEventListener('change', function (e) {
    if (!e.target.classList.contains('upload-photo')) return;

    const index = e.target.dataset.index;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
        users[index].photo = reader.result;
        updateUI();
    };
    reader.readAsDataURL(file);
});

// Событие запроса
document.getElementById('loadApiBtn').addEventListener('click', loadFromAPI);

// Событие сброса списка
document.getElementById('resetListBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.reload();
});

loadFromLocalStorage();
updateUI();
