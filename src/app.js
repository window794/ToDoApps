var todos = [];
var currentFilter = 'all';
var isDarkMode = false;
window.onload = function () {
    loadSettings();
    setupEventListeners();
    applyDarkMode(); // ここでデザイン＋renderも呼ぶ
};
function loadSettings() {
    var _a;
    var saved = localStorage.getItem('todos') || localStorage.getItem('tasks');
    todos = saved ? JSON.parse(saved).map(function (t) {
        var _a, _b, _c, _d;
        return ({
            text: (_a = t.text) !== null && _a !== void 0 ? _a : '',
            dueDate: t.dueDate,
            tag: (_b = t.tag) !== null && _b !== void 0 ? _b : 'InBox',
            priority: (_c = t.priority) !== null && _c !== void 0 ? _c : '中',
            done: (_d = t.done) !== null && _d !== void 0 ? _d : false
        });
    }) : [];
    isDarkMode = JSON.parse((_a = localStorage.getItem('darkMode')) !== null && _a !== void 0 ? _a : 'false');
}
function setupEventListeners() {
    var _a, _b;
    (_a = document.getElementById('addButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addTodo);
    (_b = document.getElementById('themeToggle')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', toggleDarkMode);
    document.querySelectorAll('.tag').forEach(function (tag) {
        tag.addEventListener('click', function () {
            var _a;
            currentFilter = (_a = tag.dataset.tag) !== null && _a !== void 0 ? _a : 'all';
            document.querySelectorAll('.tag').forEach(function (t) { return t.classList.remove('active'); });
            tag.classList.add('active');
            render();
        });
    });
}
function addTodo() {
    var text = document.getElementById('todoInput').value.trim();
    var dueDate = document.getElementById('dueDateInput').value || undefined;
    var tag = document.getElementById('tagInput').value;
    var priority = document.getElementById('priorityInput').value;
    if (!text)
        return alert('タスク名を入力してください');
    todos.push({ text: text, dueDate: dueDate, tag: tag, priority: priority, done: false });
    saveTodos();
    render();
}
function render() {
    var list = document.getElementById('todoList');
    list.innerHTML = '';
    filterTodos().forEach(function (todo, index) {
        var _a;
        var li = document.createElement('li');
        li.className = "todo-item ".concat(getPriorityClass(todo.priority));
        var icon = todo.priority === '高' ? '❗' : todo.priority === '低' ? '↓' : '';
        li.innerHTML = "".concat(icon, " ").concat(todo.text, " (").concat((_a = todo.dueDate) !== null && _a !== void 0 ? _a : '期日なし', ") [").concat(todo.tag, "]");
        li.appendChild(makeButton('編集', function () { return editTodo(index); }));
        li.appendChild(makeButton('削除', function () {
            todos.splice(index, 1);
            saveTodos();
            render();
        }));
        list.appendChild(li);
    });
}
function getPriorityClass(priority) {
    var _a;
    return (_a = { 高: 'high', 低: 'low', 中: '' }[priority]) !== null && _a !== void 0 ? _a : '';
}
function makeButton(label, action) {
    var button = document.createElement('button');
    button.textContent = label;
    button.onclick = action;
    return button;
}
function filterTodos() {
    if (currentFilter === 'all')
        return todos;
    if (currentFilter === 'today')
        return todos.filter(function (t) { return t.dueDate === today(); });
    if (currentFilter === 'week')
        return todos.filter(function (t) { return isThisWeek(t.dueDate); });
    return todos.filter(function (t) { return t.tag === currentFilter; });
}
function editTodo(index) {
    var newText = prompt('タスク名を編集', todos[index].text);
    if (newText) {
        todos[index].text = newText.trim();
        saveTodos();
        render();
    }
}
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function today() {
    return new Date().toISOString().split('T')[0];
}
function isThisWeek(date) {
    if (!date)
        return false;
    var target = new Date(date);
    var monday = getMonday(new Date());
    var sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return target >= monday && target <= sunday;
}
function getMonday(date) {
    var day = date.getDay();
    var diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    return date;
}
// ダークモード関連
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    applyDarkMode();
}
function applyDarkMode() {
    document.body.classList.toggle('dark-mode', isDarkMode);
    render(); // ← ここ大事
}
