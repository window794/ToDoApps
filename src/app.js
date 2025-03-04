var _a;
// Todo一覧（初期読み込み）
var todos = loadTodos();
// 初期表示
renderTodos();
// 「追加ボタン」のクリックイベント登録
(_a = document.getElementById('addButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addTodo);
// Todoを追加する関数
function addTodo() {
    var input = document.getElementById('todoInput');
    if (input.value.trim() === '')
        return;
    todos.push({ text: input.value.trim(), done: false });
    input.value = ''; // 入力欄をクリア
    saveTodos(); // 保存
    renderTodos(); // 画面更新
}
// Todo一覧を表示する関数
function renderTodos() {
    var list = document.getElementById('todoList');
    if (!list)
        return;
    list.innerHTML = ''; // 一旦クリア
    todos.forEach(function (todo, index) {
        var li = document.createElement('li');
        // ✅ チェックボックス作成
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        // ✅ テキスト（やること）部分
        var span = document.createElement('span');
        span.textContent = todo.text;
        // ✅ チェック済みなら取り消し線
        span.style.textDecoration = todo.done ? 'line-through' : 'none';
        // ✅ チェックボックスの変更イベント
        checkbox.addEventListener('change', function () {
            todos[index].done = checkbox.checked;
            saveTodos();
            renderTodos(); // 変更を反映
        });
        // ✅ 削除ボタン
        var deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', function () {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });
        // リストに要素を追加
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });
}
// Todoを保存する関数（ローカルストレージに保存）
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
// Todoを読み込む関数（ローカルストレージから取得）
function loadTodos() {
    var data = localStorage.getItem('todos');
    return data ? JSON.parse(data) : [];
}
