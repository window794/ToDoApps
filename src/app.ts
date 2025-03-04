type Todo = {
    text: string;
    dueDate?: string;
    tag: string;
    done: boolean;
};

let todos: Todo[] = loadTodos();

renderTodos();

document.getElementById('addButton')?.addEventListener('click', addTodo);

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
        tag: tagInput.value || 'InBox',  // ここでInBox強制
        done: false
    });

    input.value = '';
    dateInput.value = '';
    tagInput.value = 'InBox';  // 選択状態もリセット

    saveTodos();
    renderTodos();
}

function renderTodos() {
    const list = document.getElementById('todoList');
    if (!list) return;

    list.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        if (todo.done) li.classList.add('done');

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

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
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

function loadTodos(): Todo[] {
    const data = localStorage.getItem('todos');
    return data ? JSON.parse(data) : [];
}