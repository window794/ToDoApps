var todos = loadTodos();
var currentFilter = 'all';
// ✅ 各種ボタンのイベント設定
document.getElementById('addButton').addEventListener('click', addTodo);
document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
document.getElementById('filterAll').addEventListener('click', function () { return changeView('all'); });
document.getElementById('filterToday').addEventListener('click', function () { return changeView('today'); });
document.getElementById('filterInbox').addEventListener('click', function () { return changeView('inbox'); });
document.getElementById('filterWork').addEventListener('click', function () { return changeView('work'); });
document.getElementById('filterPrivate').addEventListener('click', function () { return changeView('private'); });
document.getElementById('filterOthers').addEventListener('click', function () { return changeView('others'); });
function changeView(filter) {
    currentFilter = filter;
    renderTodos();
}
// ✅ タスク追加
function addTodo() {
    var input = document.getElementById('todoInput');
    var dateInput = document.getElementById('dateInput');
    var tagSelect = document.getElementById('tagSelect');
    if (input.value.trim() === '')
        return;
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
    var list = document.getElementById('todoList');
    list.innerHTML = '';
    filteredTodos().forEach(function (todo, index) {
        var _a;
        var li = document.createElement('li');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        checkbox.addEventListener('change', function () {
            todo.done = checkbox.checked;
            saveTodos();
            renderTodos();
        });
        var span = document.createElement('span');
        span.textContent = "".concat(todo.text, " (").concat((_a = todo.date) !== null && _a !== void 0 ? _a : '期限なし', ") [").concat(todo.tag, "]");
        if (todo.done)
            span.style.textDecoration = 'line-through';
        var editButton = document.createElement('button');
        editButton.textContent = '編集';
        editButton.onclick = function () { return editTodo(index); };
        var deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.onclick = function () {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        };
        li.append(checkbox, span, editButton, deleteButton);
        list.appendChild(li);
    });
}
function filteredTodos() {
    var today = new Date().toISOString().split('T')[0];
    return todos.filter(function (todo) {
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
function editTodo(index) {
    var newText = prompt('タスクを編集:', todos[index].text);
    if (newText !== null) {
        todos[index].text = newText;
        saveTodos();
        renderTodos();
    }
}
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function loadTodos() {
    var _a;
    return JSON.parse((_a = localStorage.getItem('todos')) !== null && _a !== void 0 ? _a : '[]');
}
// ✅ ダークモード
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode').toString());
}
function applyDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    else {
        document.body.classList.remove('dark-mode');
    }
}
applyDarkMode();
renderTodos();
