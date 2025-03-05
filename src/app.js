var _a;
var todos = loadTodos();
var currentFilter = 'all'; // 今の表示対象
renderTodos();
// ボタンやタグのイベント登録
(_a = document.getElementById('addButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addTodo);
document.querySelectorAll('.tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
        var selectedTag = tag.getAttribute('data-tag') || 'all';
        currentFilter = selectedTag;
        document.querySelectorAll('.tag').forEach(function (t) { return t.classList.remove('active'); });
        tag.classList.add('active');
        renderTodos();
    });
});
function addTodo() {
    var input = document.getElementById('todoInput');
    var dateInput = document.getElementById('dueDateInput');
    var tagInput = document.getElementById('tagInput');
    if (input.value.trim() === '') {
        alert('やることを入力してください！');
        return;
    }
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
    renderTodos();
}
function renderTodos() {
    var list = document.getElementById('todoList');
    if (!list)
        return;
    list.innerHTML = '';
    var filteredTodos = filterTodos();
    filteredTodos.forEach(function (todo, index) {
        var li = document.createElement('li');
        if (todo.done)
            li.classList.add('done');
        var todoContent = document.createElement('div');
        todoContent.classList.add('todo-content');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        var textSpan = document.createElement('span');
        var dueDateText = todo.dueDate ? "\uFF08".concat(todo.dueDate, "\uFF09") : '（期日なし）';
        textSpan.textContent = "".concat(todo.text).concat(dueDateText, " [").concat(todo.tag, "]");
        checkbox.addEventListener('change', function () {
            todos[index].done = checkbox.checked;
            saveTodos();
            renderTodos();
        });
        todoContent.appendChild(checkbox);
        todoContent.appendChild(textSpan);
        var deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', function () {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });
        li.appendChild(todoContent);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}
function filterTodos() {
    if (currentFilter === 'all') {
        return todos;
    }
    if (currentFilter === 'today') {
        var today_1 = new Date().toISOString().split('T')[0];
        return todos.filter(function (todo) { return todo.dueDate === today_1; });
    }
    return todos.filter(function (todo) { return todo.tag === currentFilter; });
}
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function loadTodos() {
    var data = localStorage.getItem('todos');
    var parsed = data ? JSON.parse(data) : [];
    parsed.forEach(function (todo) {
        if (!todo.tag) {
            todo.tag = 'InBox';
        }
    });
    return parsed;
}
