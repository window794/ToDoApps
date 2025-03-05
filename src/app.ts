// Todoの型定義（タグ・期日あり）
type Todo = {
    text: string;
    dueDate?: string;
    tag: string;
    done: boolean;
};

// Todo一覧（初期読み込み）
let todos: Todo[] = loadTodos();

// 初期表示
renderTodos();

// 「追加ボタン」のイベント登録
document.getElementById('addButton')?.addEventListener('click', addTodo);

// 新しいTodoを追加
function addTodo() {
    const input = document.getElementById('todoInput') as HTMLInputElement;
    const dateInput = document.getElementById('dueDateInput') as HTMLInputElement;
    const tagInput = document.getElementById('tagInput') as HTMLSelectElement;

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
    const list = document.getElementById('todoList');
    if (!list) return;

    list.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        if (todo.done) li.classList.add('done');

        // チェックボックス＋テキスト＋期日＋タグをまとめる
        const todoContent = document.createElement('div');
        todoContent.classList.add('todo-content');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;

        const textSpan = document.createElement('span');
        const dueDateText = todo.dueDate ? `（${todo.dueDate}）` : '（期日なし）';
        textSpan.textContent = `${todo.text}${dueDateText} [${todo.tag}]`;

        checkbox.addEventListener('change', () => {
            todos[index].done = checkbox.checked;
            saveTodos();
            renderTodos();
        });

        todoContent.appendChild(checkbox);
        todoContent.appendChild(textSpan);

        // 削除ボタン
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });

        li.appendChild(todoContent);  // 左側に内容
        li.appendChild(deleteButton);  // 右側に削除ボタン

        list.appendChild(li);
    });
}

// Todoを保存
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Todoを読み込み（古いデータもInBox補正）
function loadTodos(): Todo[] {
    const data = localStorage.getItem('todos');
    const parsed: Todo[] = data ? JSON.parse(data) : [];

    // 過去データの補正（タグがないものはInBoxに）
    parsed.forEach(todo => {
        if (!todo.tag) {
            todo.tag = 'InBox';
        }
    });

    return parsed;
}