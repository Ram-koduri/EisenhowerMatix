document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const signupToggle = document.getElementById('signup-toggle');
    const loginToggle = document.getElementById('login-toggle');
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const logoutBtn = document.getElementById('logout-btn');

    const quadrants = document.querySelectorAll('.quadrant');
    const addTaskButtons = document.querySelectorAll('.add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeBtn = document.querySelector('.close-button');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const taskContent = document.getElementById('task-content');
    const taskDueDate = document.getElementById('task-due-date');
    const taskTags = document.getElementById('task-tags');
    const searchInput = document.getElementById('search-input');
    const tagFilter = document.getElementById('tag-filter');
    const toggleDarkModeCheckbox = document.getElementById('toggle-dark-mode');
    const completedToggleBtn = document.querySelector('.completed-toggle');
    const completedTasksContainer = document.getElementById('completed-tasks');

    let currentQuadrant = null;
    let isEditing = false;
    let editingTaskId = null;
    let token = localStorage.getItem('token') || null;

    // Authentication Events
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    logoutBtn.addEventListener('click', handleLogout);

    signupToggle.addEventListener('click', () => {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form-container').style.display = 'block';
    });

    loginToggle.addEventListener('click', () => {
        document.getElementById('signup-form-container').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });

    // Functions for Authentication
    async function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (data.token) {
                token = data.token;
                localStorage.setItem('token', token);
                showApp();
                loadTasks();
            } else {
                alert('Login failed!');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    async function handleSignup(event) {
        event.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('Registration successful! You can now log in.');
                document.getElementById('login-form').style.display = 'block';
                document.getElementById('signup-form-container').style.display = 'none';
            } else {
                alert('Signup failed!');
            }
        } catch (error) {
            console.error('Error signing up:', error);
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        token = null;
        hideApp();
    }

    function showApp() {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
    }

    function hideApp() {
        authContainer.style.display = 'flex';
        appContainer.style.display = 'none';
    }

    // Task management
    async function loadTasks() {
        try {
            const response = await fetch('/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    async function saveTask() {
        const content = taskContent.value.trim();
        const dueDate = taskDueDate.value;
        const tags = taskTags.value.split(',').map(tag => tag.trim()).filter(tag => tag);

        if (content === '') {
            alert('Task content cannot be empty.');
            return;
        }

        const task = {
            content,
            dueDate,
            tags,
            quadrant: currentQuadrant,
            completed: false
        };

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/tasks/${editingTaskId}` : '/tasks';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(task)
            });

            if (response.ok) {
                closeTaskModal();
                loadTasks();
            } else {
                alert('Failed to save task');
            }
        } catch (error) {
            console.error('Error saving task:', error);
        }
    }

    // Other functions remain the same...
});
