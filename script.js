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

document.getElementById('filter18').addEventListener('change', (e) => {
    if (e.target.checked) {
        renderUsers(users.filter((u) => u.age > 18));
    } else {
        renderUsers(users);
    }
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
