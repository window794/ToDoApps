// Todoの型定義
type Todo = {
    text: string;   // やることの内容
    done: boolean;  // 完了フラグ
};

// Todo一覧（初期読み込み）
let todos: Todo[] = loadTodos();

// 初期表示
renderTodos();

// 「追加ボタン」のクリックイベント登録
document.getElementById('addButton')?.addEventListener('click', addTodo);

// Todoを追加する関数
function addTodo() {
    const input = document.getElementById('todoInput') as HTMLInputElement;
    if (input.value.trim() === '') return;

    todos.push({ text: input.value.trim(), done: false });

    input.value = '';  // 入力欄をクリア

    saveTodos();       // 保存
    renderTodos();     // 画面更新
}

// Todo一覧を表示する関数
function renderTodos() {
    const list = document.getElementById('todoList');
    if (!list) return;

    list.innerHTML = '';  // 一旦クリア

    todos.forEach((todo, index) => {
        const li = document.createElement('li');

        // ✅ チェックボックス作成
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;

        // ✅ テキスト（やること）部分
        const span = document.createElement('span');
        span.textContent = todo.text;

        // ✅ チェック済みなら取り消し線
        span.style.textDecoration = todo.done ? 'line-through' : 'none';

        // ✅ チェックボックスの変更イベント
        checkbox.addEventListener('change', () => {
            todos[index].done = checkbox.checked;
            saveTodos();
            renderTodos();  // 変更を反映
        });

        // ✅ 削除ボタン
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
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
function loadTodos(): Todo[] {
    const data = localStorage.getItem('todos');
    return data ? JSON.parse(data) : [];
}