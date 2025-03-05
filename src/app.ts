type Todo = {
    text: string;
    dueDate?: string;
    tag: string;
    done: boolean;
};

let todos: Todo[] = loadTodos();
let currentFilter: string = 'all';

document.getElementById('addButton')?.addEventListener('click', addTodo);
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        currentFilter = (tag as HTMLElement).getAttribute('data-tag') || 'all';
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        render();
    });
});

render();

function addTodo() {
    const input = document.getElementById('todoInput') as HTMLInputElement;
    const dateInput = document.getElementById('dueDateInput') as HTMLInputElement;
    const tagInput = document.getElementById('tagInput') as HTMLSelectElement;

    if (input.value.trim() === '') return;

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
    } else {
        renderTodos();
    }
}

function renderTodos() {
    const list = document.getElementById('todoList');
    if (!list) return;
    list.innerHTML = '';

    const filtered = filterTodos();
    filtered.forEach((todo, index) => {
        const li = document.createElement('li');
        if (todo.done) li.classList.add('done');

        const content = document.createElement('div');
        content.classList.add('todo-content');
        content.textContent = `${todo.text} (${todo.dueDate ?? '期日なし'}) [${todo.tag}]`;

        const buttons = document.createElement('div');
        buttons.classList.add('todo-buttons');

        const editButton = document.createElement('button');
        editButton.textContent = '編集';
        editButton.onclick = () => editTodo(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.onclick = () => {
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
    const list = document.getElementById('todoList');
    if (!list) return;
    list.innerHTML = '';

    const monday = getMonday(new Date());

    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);

        const dateStr = formatDate(date);
        const dayName = getWeekdayName(date);

        const dayBox = document.createElement('div');
        dayBox.classList.add('day-box');

        const header = document.createElement('div');
        header.classList.add('day-header');
        header.textContent = `${dateStr}（${dayName}）`;

        const addButton = document.createElement('button');
        addButton.textContent = '＋タスク追加';
        addButton.onclick = () => addTaskForDate(dateStr);
        header.appendChild(addButton);

        dayBox.appendChild(header);

        const ul = document.createElement('ul');
        todos.filter(todo => todo.dueDate === dateStr).forEach(todo => {
            const li = document.createElement('li');
            li.textContent = `${todo.text} [${todo.tag}]`;
            ul.appendChild(li);
        });

        dayBox.appendChild(ul);
        list.appendChild(dayBox);
    }
}

function addTaskForDate(dateStr: string) {
    const task = prompt(`${dateStr}のタスクを入力してください`);
    if (!task) return;

    const tag = prompt('タグを選んでください（InBox, 仕事, プライベート, その他）', 'InBox') ?? 'InBox';

    todos.push({
        text: task.trim(),
        dueDate: dateStr,
        tag,
        done: false,
    });

    saveTodos();
    render();
}

function editTodo(index: number) {
    const todo = todos[index];
    const newText = prompt('内容を編集', todo.text);
    if (newText === null) return;
    const newDate = prompt('期日を編集（YYYY-MM-DD）', todo.dueDate || '');
    if (newDate === null) return;

    todos[index] = { ...todo, text: newText.trim(), dueDate: newDate.trim() || undefined };
    saveTodos();
    render();
}

function filterTodos(): Todo[] {
    if (currentFilter === 'all') return todos;
    if (currentFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        return todos.filter(t => t.dueDate === today);
    }
    return todos.filter(t => t.tag === currentFilter);
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos(): Todo[] {
    return JSON.parse(localStorage.getItem('todos') || '[]');
}

function getMonday(date: Date): Date {
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    date.setDate(date.getDate() + diff);
    return date;
}

function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

function getWeekdayName(date: Date): string {
    return ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
}