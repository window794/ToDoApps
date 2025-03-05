type Todo = {
    text: string;
    dueDate?: string;
    tag: string;
    done: boolean;
};

let todos: Todo[] = loadTodos();
let currentFilter: string = 'all'; // 今の表示対象

renderTodos();

// ボタンやタグのイベント登録
document.getElementById('addButton')?.addEventListener('click', addTodo);

document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const selectedTag = (tag as HTMLElement).getAttribute('data-tag') || 'all';
        currentFilter = selectedTag;

        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');

        renderTodos();
    });
});

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

function renderTodos() {
    const list = document.getElementById('todoList');
    if (!list) return;

    list.innerHTML = '';

    const filteredTodos = filterTodos();

    filteredTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        if (todo.done) li.classList.add('done');

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

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });

        li.appendChild(todoContent);
        li.appendChild(deleteButton);

        list.appendChild(li);
    });
}

function filterTodos(): Todo[] {
    if (currentFilter === 'all') {
        return todos;
    }
    if (currentFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        return todos.filter(todo => todo.dueDate === today);
    }
    return todos.filter(todo => todo.tag === currentFilter);
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos(): Todo[] {
    const data = localStorage.getItem('todos');
    const parsed: Todo[] = data ? JSON.parse(data) : [];

    parsed.forEach(todo => {
        if (!todo.tag) {
            todo.tag = 'InBox';
        }
    });

    return parsed;
}