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

function updateUI() {
    function renderUsers(list) {
        const container = document.getElementById('userList');
        container.innerHTML = '';

        list.forEach((u, index) => {
            container.innerHTML += `
            <div class="user-card">
                <img src="${u.photo || 'images/default.png'}" class="avatar">
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

    function applyFiltersAndSorting() {
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

    renderUsers(applyFiltersAndSorting());
    saveState();
}

function saveState() {
    const state = {
        users,
        filter18: document.getElementById('filter18').checked,
        sortSelect: document.getElementById('sortSelect').value,
    };

    localStorage.setItem('userAppState', JSON.stringify(state));
}

function loadState() {
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

document.getElementById('filter18').addEventListener('change', updateUI);
document.getElementById('sortSelect').addEventListener('change', updateUI);

// Делегируем событие загрузки фото
document.getElementById('userList').addEventListener('change', function (e) {
    if (!e.target.classList.contains('upload-photo')) return;

    const index = e.target.dataset.index;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
        users[index].photo = reader.result;
        updateUI(); // сохраняет сортировку и фильтры
    };
    reader.readAsDataURL(file);
});

loadState();
updateUI();
