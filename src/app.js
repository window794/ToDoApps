var _a;
// Todo一覧（初期読み込み）
var todos = loadTodos();
// 初期表示
renderTodos();
// 「追加ボタン」のイベント登録
(_a = document.getElementById('addButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addTodo);
// 新しいTodoを追加
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
// Todo一覧を表示する
function renderTodos() {
    var list = document.getElementById('todoList');
    if (!list)
        return;
    list.innerHTML = '';
    todos.forEach(function (todo, index) {
        var li = document.createElement('li');
        if (todo.done)
            li.classList.add('done');
        // チェックボックス＋テキスト＋期日＋タグをまとめる
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
        // 削除ボタン
        var deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', function () {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });
        li.appendChild(todoContent); // 左側に内容
        li.appendChild(deleteButton); // 右側に削除ボタン
        list.appendChild(li);
    });
}
// Todoを保存
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
// Todoを読み込み（古いデータもInBox補正）
function loadTodos() {
    var data = localStorage.getItem('todos');
    var parsed = data ? JSON.parse(data) : [];
    // 過去データの補正（タグがないものはInBoxに）
    parsed.forEach(function (todo) {
        if (!todo.tag) {
            todo.tag = 'InBox';
        }
    });
    return parsed;
}
