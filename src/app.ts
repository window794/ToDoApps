type Todo = {
    text: string;
    date?: string;
    tag: string;
    done: boolean;
};

let todos: Todo[] = loadTodos();
let currentFilter: 'all' | 'today' | 'inbox' | 'work' | 'private' | 'others' = 'all';

// ✅ 各種ボタンのイベント設定
document.getElementById('addButton')!.addEventListener('click', addTodo);
document.getElementById('darkModeToggle')!.addEventListener('click', toggleDarkMode);

document.getElementById('filterAll')!.addEventListener('click', () => changeView('all'));
document.getElementById('filterToday')!.addEventListener('click', () => changeView('today'));
document.getElementById('filterInbox')!.addEventListener('click', () => changeView('inbox'));
document.getElementById('filterWork')!.addEventListener('click', () => changeView('work'));
document.getElementById('filterPrivate')!.addEventListener('click', () => changeView('private'));
document.getElementById('filterOthers')!.addEventListener('click', () => changeView('others'));

function changeView(filter: typeof currentFilter) {
    currentFilter = filter;
    renderTodos();
}

// ✅ タスク追加
function addTodo() {
    const input = document.getElementById('todoInput') as HTMLInputElement;
    const dateInput = document.getElementById('dateInput') as HTMLInputElement;
    const tagSelect = document.getElementById('tagSelect') as HTMLSelectElement;

    if (input.value.trim() === '') return;

    todos.push({
        text: input.value.trim(),
        date: dateInput.value || undefined,
        tag: tagSelect.value,
        done: false,
    });

    input.value = '';
    dateInput.value = '';
    tagSelect.value = 'InBox';

    saveTodos();
    renderTodos();
}

// ✅ タスク描画
function renderTodos() {
    const list = document.getElementById('todoList')!;
    list.innerHTML = '';

    filteredTodos().forEach((todo, index) => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        checkbox.addEventListener('change', () => {
            todo.done = checkbox.checked;
            saveTodos();
            renderTodos();
        });

        const span = document.createElement('span');
        span.textContent = `${todo.text} (${todo.date ?? '期限なし'}) [${todo.tag}]`;
        if (todo.done) span.style.textDecoration = 'line-through';

        const editButton = document.createElement('button');
        editButton.textContent = '編集';
        editButton.onclick = () => editTodo(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.onclick = () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        };

        li.append(checkbox, span, editButton, deleteButton);
        list.appendChild(li);
    });
}

function filteredTodos() {
    const today = new Date().toISOString().split('T')[0];
    return todos.filter(todo => {
        switch (currentFilter) {
            case 'today': return todo.date === today;
            case 'inbox': return todo.tag === 'InBox';
            case 'work': return todo.tag === '仕事';
            case 'private': return todo.tag === 'プライベート';
            case 'others': return !['InBox', '仕事', 'プライベート'].includes(todo.tag);
            default: return true;
        }
    });
}

function editTodo(index: number) {
    const newText = prompt('タスクを編集:', todos[index].text);
    if (newText !== null) {
        todos[index].text = newText;
        saveTodos();
        renderTodos();
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos(): Todo[] {
    return JSON.parse(localStorage.getItem('todos') ?? '[]');
}

// ✅ ダークモード
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode').toString());
}

function applyDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

applyDarkMode();
renderTodos();