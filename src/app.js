var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
var todos = loadTodos();
var currentFilter = 'all';
(_a = document.getElementById('addButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addTodo);
document.querySelectorAll('.tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
        currentFilter = tag.getAttribute('data-tag') || 'all';
        document.querySelectorAll('.tag').forEach(function (t) { return t.classList.remove('active'); });
        tag.classList.add('active');
        render();
    });
});
render();
function addTodo() {
    var input = document.getElementById('todoInput');
    var dateInput = document.getElementById('dueDateInput');
    var tagInput = document.getElementById('tagInput');
    if (input.value.trim() === '')
        return;
    todos.push({
        text: input.value.trim(),
        dueDate: dateInput.value || undefined,
        tag: tagInput.value || 'InBox',
        done: false
    });
    input.value = '';
    dateInput.value = '';
    tagInput.value = 'InBox';
    saveTodos();
    render();
}
function render() {
    if (currentFilter === 'week') {
        renderWeeklyTodos();
    }
    else {
        renderTodos();
    }
}
function renderTodos() {
    var list = document.getElementById('todoList');
    if (!list)
        return;
    list.innerHTML = '';
    var filtered = filterTodos();
    filtered.forEach(function (todo, index) {
        var _a;
        var li = document.createElement('li');
        if (todo.done)
            li.classList.add('done');
        var content = document.createElement('div');
        content.classList.add('todo-content');
        content.textContent = "".concat(todo.text, " (").concat((_a = todo.dueDate) !== null && _a !== void 0 ? _a : '期日なし', ") [").concat(todo.tag, "]");
        var buttons = document.createElement('div');
        buttons.classList.add('todo-buttons');
        var editButton = document.createElement('button');
        editButton.textContent = '編集';
        editButton.onclick = function () { return editTodo(index); };
        var deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.onclick = function () {
            todos.splice(index, 1);
            saveTodos();
            render();
        };
        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);
        li.appendChild(content);
        li.appendChild(buttons);
        list.appendChild(li);
    });
}
function renderWeeklyTodos() {
    var list = document.getElementById('todoList');
    if (!list)
        return;
    list.innerHTML = '';
    var monday = getMonday(new Date());
    var _loop_1 = function (i) {
        var date = new Date(monday);
        date.setDate(monday.getDate() + i);
        var dateStr = formatDate(date);
        var dayName = getWeekdayName(date);
        var dayBox = document.createElement('div');
        dayBox.classList.add('day-box');
        var header = document.createElement('div');
        header.classList.add('day-header');
        header.textContent = "".concat(dateStr, "\uFF08").concat(dayName, "\uFF09");
        var addButton = document.createElement('button');
        addButton.textContent = '＋タスク追加';
        addButton.onclick = function () { return addTaskForDate(dateStr); };
        header.appendChild(addButton);
        dayBox.appendChild(header);
        var ul = document.createElement('ul');
        todos.filter(function (todo) { return todo.dueDate === dateStr; }).forEach(function (todo) {
            var li = document.createElement('li');
            li.textContent = "".concat(todo.text, " [").concat(todo.tag, "]");
            ul.appendChild(li);
        });
        dayBox.appendChild(ul);
        list.appendChild(dayBox);
    };
    for (var i = 0; i < 7; i++) {
        _loop_1(i);
    }
}
function addTaskForDate(dateStr) {
    var _a;
    var task = prompt("".concat(dateStr, "\u306E\u30BF\u30B9\u30AF\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"));
    if (!task)
        return;
    var tag = (_a = prompt('タグを選んでください（InBox, 仕事, プライベート, その他）', 'InBox')) !== null && _a !== void 0 ? _a : 'InBox';
    todos.push({
        text: task.trim(),
        dueDate: dateStr,
        tag: tag,
        done: false,
    });
    saveTodos();
    render();
}
function editTodo(index) {
    var todo = todos[index];
    var newText = prompt('内容を編集', todo.text);
    if (newText === null)
        return;
    var newDate = prompt('期日を編集（YYYY-MM-DD）', todo.dueDate || '');
    if (newDate === null)
        return;
    todos[index] = __assign(__assign({}, todo), { text: newText.trim(), dueDate: newDate.trim() || undefined });
    saveTodos();
    render();
}
function filterTodos() {
    if (currentFilter === 'all')
        return todos;
    if (currentFilter === 'today') {
        var today_1 = new Date().toISOString().split('T')[0];
        return todos.filter(function (t) { return t.dueDate === today_1; });
    }
    return todos.filter(function (t) { return t.tag === currentFilter; });
}
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function loadTodos() {
    return JSON.parse(localStorage.getItem('todos') || '[]');
}
function getMonday(date) {
    var day = date.getDay();
    var diff = (day === 0 ? -6 : 1) - day;
    date.setDate(date.getDate() + diff);
    return date;
}
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
function getWeekdayName(date) {
    return ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
}
