var _a;
var todos = loadTodos();
renderTodos();
(_a = document.getElementById('addButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addTodo);
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
        tag: tagInput.value || 'InBox', // ここでInBox強制
        done: false
    });
    input.value = '';
    dateInput.value = '';
    tagInput.value = 'InBox'; // 選択状態もリセット
    saveTodos();
    renderTodos();
}
function renderTodos() {
    var list = document.getElementById('todoList');
    if (!list)
        return;
    list.innerHTML = '';
    todos.forEach(function (todo, index) {
        var li = document.createElement('li');
        if (todo.done)
            li.classList.add('done');
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
        var deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', function () {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function loadTodos() {
    var data = localStorage.getItem('todos');
    return data ? JSON.parse(data) : [];
}
