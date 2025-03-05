type Todo = {
    text: string;
    dueDate?: string;
    tag: string;
    priority: string;
    done: boolean;
};

let todos: Todo[] = [];
let currentFilter = 'all';
let isDarkMode = false;

window.onload = () => {
    loadSettings();
    setupEventListeners();
    applyDarkMode(); // ここでデザイン＋renderも呼ぶ
};

function loadSettings() {
    const saved = localStorage.getItem('todos') || localStorage.getItem('tasks');
    todos = saved ? JSON.parse(saved).map((t: Partial<Todo>) => ({
        text: t.text ?? '',
        dueDate: t.dueDate,
        tag: t.tag ?? 'InBox',
        priority: t.priority ?? '中',
        done: t.done ?? false
    })) : [];

    isDarkMode = JSON.parse(localStorage.getItem('darkMode') ?? 'false');
}

function setupEventListeners() {
    document.getElementById('addButton')?.addEventListener('click', addTodo);
    document.getElementById('themeToggle')?.addEventListener('click', toggleDarkMode);
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            currentFilter = (tag as HTMLElement).dataset.tag ?? 'all';
            document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            render();
        });
    });
}

function addTodo() {
    const text = (document.getElementById('todoInput') as HTMLInputElement).value.trim();
    const dueDate = (document.getElementById('dueDateInput') as HTMLInputElement).value || undefined;
    const tag = (document.getElementById('tagInput') as HTMLSelectElement).value;
    const priority = (document.getElementById('priorityInput') as HTMLSelectElement).value;

    if (!text) return alert('タスク名を入力してください');

    todos.push({ text, dueDate, tag, priority, done: false });
    saveTodos();
    render();
}

function render() {
    const list = document.getElementById('todoList')!;
    list.innerHTML = '';
    filterTodos().forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${getPriorityClass(todo.priority)}`;
        const icon = todo.priority === '高' ? '❗' : todo.priority === '低' ? '↓' : '';
        li.innerHTML = `${icon} ${todo.text} (${todo.dueDate ?? '期日なし'}) [${todo.tag}]`;
        li.appendChild(makeButton('編集', () => editTodo(index)));
        li.appendChild(makeButton('削除', () => {
            todos.splice(index, 1);
            saveTodos();
            render();
        }));
        list.appendChild(li);
    });
}

function getPriorityClass(priority: string): string {
    return { 高: 'high', 低: 'low', 中: '' }[priority] ?? '';
}

function makeButton(label: string, action: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = label;
    button.onclick = action;
    return button;
}

function filterTodos(): Todo[] {
    if (currentFilter === 'all') return todos;
    if (currentFilter === 'today') return todos.filter(t => t.dueDate === today());
    if (currentFilter === 'week') return todos.filter(t => isThisWeek(t.dueDate));
    return todos.filter(t => t.tag === currentFilter);
}

function editTodo(index: number) {
    const newText = prompt('タスク名を編集', todos[index].text);
    if (newText) {
        todos[index].text = newText.trim();
        saveTodos();
        render();
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function today(): string {
    return new Date().toISOString().split('T')[0];
}

function isThisWeek(date?: string): boolean {
    if (!date) return false;
    const target = new Date(date);
    const monday = getMonday(new Date());
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return target >= monday && target <= sunday;
}

function getMonday(date: Date): Date {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    return date;
}

// ダークモード関連
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    applyDarkMode();
}

function applyDarkMode() {
    document.body.classList.toggle('dark-mode', isDarkMode);
    render();  // ← ここ大事
}