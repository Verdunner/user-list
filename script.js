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

function renderUsers(list) {
    const container = document.getElementById('userList');
    container.innerHTML = '';

    list.forEach((u, index) => {
        const div = document.createElement('div');
        div.className = 'user-card';

        div.innerHTML = `
            <img src="${u.photo || 'images/default.png'}" class="avatar">
            <p><strong>${u.firstName} ${u.lastName}</strong></p>
            <p>Age: ${u.age}</p>
            <p>Email: ${u.email}</p>

            <label>Добавить фото:
                <input type="file" data-index="${index}" class="upload-photo">
            </label>
        `;

        container.appendChild(div);
    });
}

function applyFiltersAndSorting() {
    let result = [...users];

    // Фильтр по возрасту
    const filter18 = document.getElementById('filter18').checked;
    if (filter18) {
        result = result.filter((u) => u.age > 18);
    }

    // Сортировка
    const sortValue = document.getElementById('sortSelect').value;

    if (sortValue === 'name') {
        result.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortValue === 'age') {
        result.sort((a, b) => a.age - b.age);
    }

    renderUsers(result);
}

document.getElementById('filter18').addEventListener('change', () => {
    applyFiltersAndSorting();
});

document.addEventListener('change', function (e) {
    if (e.target.classList.contains('upload-photo')) {
        const index = e.target.dataset.index;
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            users[index].photo = reader.result;
            renderUsers(users);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('sortSelect').addEventListener('change', () => {
    applyFiltersAndSorting();
});

applyFiltersAndSorting();
