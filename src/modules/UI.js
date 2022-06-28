import TodoItem from "./TodoItem";
import Storage from "./Storage";
import { format } from "date-fns";

//A class for dealing with all of the user interface elements on the page
export default class UI {
    static toggleSidebarVisibility() {
        const sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("collapse");
    }

    static clearSelected() {
        const selected = document.querySelectorAll('.selected');
        selected.forEach(element => {
            element.classList.remove('selected');
        });
    }

    static selectProject(e) {
        const btn = e.currentTarget;
        const todoHeader = document.querySelector('.todo-header');
        const addTaskBtn = document.querySelector('.add-task');
        let projectTitle = btn.textContent.trim().split("\n")[0];
        if (btn.classList.contains("selected")) {
            return;
        }
        UI.clearSelected();
        btn.classList.toggle('selected');
        todoHeader.textContent = projectTitle;
        if (projectTitle === "Inbox" || projectTitle === "Today" || projectTitle === "This Week") {
            addTaskBtn.classList.add("hidden");
        }
        else {
            addTaskBtn.classList.remove("hidden");
        }
        UI.clearTasks();
        UI.displayTasks();
        UI.eventListeners();
    }

    static toggleNewProjectForm(e) {
        e.preventDefault();
        const addProjectBtn = document.querySelector('.add-project');
        const newProjectForm = document.querySelector('.add-new-project');
        newProjectForm.reset();
        newProjectForm.classList.toggle('hidden');
        addProjectBtn.classList.toggle('hidden');
    }

    static projectTemplate(title) {
        const addProjectBtn = document.querySelector('.add-project');
        const sidebar = document.querySelector('.sidebar');
        const newProject = document.createElement('button');
            newProject.classList.add('project');
            newProject.innerHTML = `<i class="fa-solid fa-list-check"></i>
                ${title}
            <div class="edit-project" title="Edit Project"><i class="fa-solid fa-pen-to-square"></i></div>
            <div class="delete-project" title="Delete Project">X</div>`;
            sidebar.insertBefore(newProject, addProjectBtn);
    }

    static checkForDuplicateProjects() {
        const addProjectFormInput = document.getElementById('new-project');
        const renameProjectFormInput = document.getElementById('rename-project');
        const projects = document.querySelectorAll('.project');
        let duplicatedName = false;
        projects.forEach(button => {
            let projectTitle = button.textContent.trim().split("\n");
            if (renameProjectFormInput) {
                if (projectTitle[0] === renameProjectFormInput.value) {
                    duplicatedName = true;
                }
            }
            if (projectTitle[0] === addProjectFormInput.value) {
                duplicatedName = true;
            }
        })
        return duplicatedName;
    }

    static addNewProject(e) {
        e.preventDefault();
        const header = document.querySelector('.todo-header');
        const form = document.querySelector('.add-new-project');
        const formInput = document.getElementById('new-project');
        const addTaskBtn = document.querySelector('.add-task');
        if (formInput.value.length === 0) {
            return;
        }
        else if (UI.checkForDuplicateProjects()) {
            window.alert("You can't duplicate project names!");
            form.reset();
        }
        else {
            Storage.addProject(formInput.value);
            header.textContent = formInput.value;
            UI.clearProjects();
            UI.displayProjects();
            UI.toggleNewProjectForm(e);
            UI.clearTasks();
            UI.clearSelected();
            const projects = document.querySelectorAll('.project');
            const newProject = projects[projects.length-1];
            newProject.classList.add('selected');
            addTaskBtn.classList.remove('hidden');
            UI.eventListeners();
        }
    }

    static renameProject(e) {
        const form = document.querySelector(".rename-project-form");
        const formInput = document.getElementById("rename-project");
        const projectTitle = formInput.placeholder;
        if (formInput.value.length === 0) {
            return;
        }
        else if (UI.checkForDuplicateProjects()) {
            window.alert("You can't duplicate project names!");
            form.reset();
        }
        else {
            Storage.renameProject(projectTitle, formInput.value);
            UI.clearProjects();
            UI.displayProjects();
            UI.removeProjectRenameForm(e);
            UI.toggleProjectButtons();
            UI.eventListeners();
        }
    }

    static renameProjectForm(e) {
        e.stopPropagation();
        const sidebar = document.querySelector(".sidebar");
        const form = document.createElement("form");
        form.classList.add("rename-project-form");
        const projectButton = e.target.parentElement.parentElement;
        const projectTitle = projectButton.textContent.trim().split("\n")[0];
        form.innerHTML = `<input type="text" id="rename-project" placeholder="${projectTitle}" maxlength="25" required>
        <div class="rename-project-buttons">
            <button class="rename-project">Rename Project</button>
            <button class="cancel-rename">Cancel</button>
        </div>`;
        UI.toggleAddProjectButton();
        UI.toggleProjectButtons();
        sidebar.insertBefore(form, projectButton.nextSibling);
        UI.eventListeners();
    }

    static removeProjectRenameForm(e) {
        e.preventDefault();
        const form = document.querySelector(".rename-project-form");
        form.remove();
        UI.toggleProjectButtons();
        UI.toggleAddProjectButton();
    }

    static toggleAddProjectButton() {
        const addProjectBtn = document.querySelector('.add-project');
        if (addProjectBtn.classList.contains("hidden")) {
            addProjectBtn.classList.remove("hidden");
        }
        else {
            addProjectBtn.classList.add("hidden");
        }
    }

    //A function for hiding edit/delete buttons. Used when renaming projects or adding new projects
    static toggleProjectButtons() {
        const editButtons = document.querySelectorAll(".edit-project");
        const deleteButtons = document.querySelectorAll(".delete-project");
        editButtons.forEach(button => {
            if (button.classList.contains("hidden")) {
                button.classList.remove("hidden");
            }
            else {
                button.classList.add("hidden");
            }
        });
        deleteButtons.forEach(button => {
            if (button.classList.contains("hidden")) {
                button.classList.remove("hidden");
            }
            else {
                button.classList.add("hidden");
            }
        })
    }

    static clearProjects() {
        const projects = document.querySelectorAll('.project');
        projects.forEach(project => {
            let projectTitle = project.textContent.trim().split("\n")[0];
            if (projectTitle === "Inbox" || projectTitle === "Today" || projectTitle === "This Week") {
                return;
            }
            else {
                project.remove();
            }
        })
    }

    static displayProjects() {
        const projects = Storage.getTodoList().getProjects();
        projects.forEach(project => {
            if (project.title === "Inbox" || project.title === "Today" || project.title === "This Week") {
                return;
            }
            else {
                UI.projectTemplate(project.title);
            }
        })
    }

    static deleteProject(e) {
        e.stopPropagation();
        const projectTitle = e.target.parentElement.textContent.trim().split("\n")[0];
        Storage.deleteProject(projectTitle);
        e.target.parentElement.remove();
        UI.displayInbox();
    }

    static displayInbox() {
        UI.clearSelected();
        const inbox = document.querySelector('.inbox');
        inbox.classList.add("selected");
        const todoHeader = document.querySelector('.todo-header');
        todoHeader.textContent = "Inbox";
        const addTaskBtn = document.querySelector('.add-task');
        addTaskBtn.classList.add("hidden");
        UI.clearTasks();
        UI.displayTasks();
    }

    static displayAddTaskModal() {
        const modal = document.querySelector(".modal");
        const modalContent = document.querySelector(".modal-content");
        modalContent.classList.add("show-modal");
        modal.classList.add("show-modal");
    }

    static closeAddTaskModal(e) {
        e.preventDefault();
        const modal = document.querySelector(".modal");
        const modalContent = document.querySelector(".modal-content");
        const form = document.querySelector(".add-item-form");
        form.reset();
        modalContent.classList.remove("show-modal");
        modal.classList.remove("show-modal");
    }

    static addTask(e) {
        const project = document.querySelector(".todo-header").textContent;
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const dueDate = document.getElementById("dueDate").value.split('-').join('/');
        const priority = document.getElementById("priority").value;
        const newItem = new TodoItem(title, project, description, dueDate, priority, false);
        if (title.length === 0 || dueDate.length === 0) {
            return;
        }
        else {
            e.preventDefault();
            Storage.addItemToProject(project, newItem);
            UI.closeAddTaskModal(e);
            UI.clearTasks();
            UI.displayTasks();
            UI.eventListeners();
        }
    }

    static taskTemplate(title, dueDate, completed) {
        const todoContainer = document.querySelector('.todo-list');
        const addTaskBtn = document.querySelector('.add-task');
        const newItem = document.createElement('div');
        newItem.classList.add('todo-item');
        //If a task is completed, render it with the checkbox already checked, else render it normally
        if (completed) {
            newItem.innerHTML = `<input type="checkbox" class="completed" checked>
                <p>${title}</p>
                <button class="item-details">Details</button>
                <p class="due-date">${format(new Date(dueDate), 'P')}</p>
                <i class="fa-solid fa-pen-to-square"></i>
                <i class="fa-solid fa-trash-can"></i>`;
        }
        else {
            newItem.innerHTML = `<input type="checkbox" class="completed">
                <p>${title}</p>
                <button class="item-details">Details</button>
                <p class="due-date">${format(new Date(dueDate), 'P')}</p>
                <i class="fa-solid fa-pen-to-square edit-task"></i>
                <i class="fa-solid fa-trash-can delete-task"></i>`;
        }
        if (addTaskBtn.classList.contains("hidden")) {
            todoContainer.appendChild(newItem);
        }
        else {
            todoContainer.insertBefore(newItem, addTaskBtn);
        }
    }

    static displayTasks() {
        const projectTitle = document.querySelector('.todo-header').textContent;
        const project = Storage.getTodoList().getProject(projectTitle);
        const tasks = project.getItems();
        tasks.forEach(task => {
            UI.taskTemplate(task.getTitle(), task.getDueDate(), task.getCompleted());
        })
    }

    static clearTasks() {
        const tasks = document.querySelectorAll('.todo-item');
        const taskDetails = document.querySelector('.todo-item-expanded');
        tasks.forEach(task => {
            task.remove();
        })
        if (taskDetails) {
            taskDetails.remove();
        }
    }

    static displayTodoDetails(e) {
        const todoContainer = document.querySelector('.todo-list');
        const itemElement = e.target.parentElement;
        const todos = document.querySelectorAll('.todo-item');
        const project = document.querySelector('.todo-header').textContent;
        const title = e.target.parentElement.textContent.trim().split("\n")[0];
        const item = Storage.getTodoList().getProject(project).getItemFromProject(title);
        const container = document.createElement('div');
        container.classList.add('todo-item-expanded');
        let completed;
        if (item.getCompleted()) {
            completed = "Completed";
        }
        else {
            completed = "Not Complete";
        }
        container.innerHTML = `<div class="item-header">
                <p>${item.title}</p>
                <button class="close-task">X</button>
            </div>
            <p>${item.description}</p>
            <div class="information">
                <p>${format(new Date(item.dueDate), 'P')}</p>
                <p>${item.priority}</p>
                <p>${completed}</p>
            </div>`;
        //changes where it's rendered depending on how many tasks exist
        if (todos.length === 1) {
            itemElement.remove();
            todoContainer.appendChild(container);
        }
        else {
            todoContainer.insertBefore(container, itemElement.nextSibling);
            itemElement.remove();
        }
        UI.eventListeners();
        const detailsBtn = document.querySelectorAll('.item-details');
        detailsBtn.forEach(button => {
            button.removeEventListener('click', UI.displayTodoDetails);
        })
    }

    static closeTodoDetails() {
        UI.clearTasks();
        UI.displayTasks();
        UI.eventListeners();
    }

    static toggleCompletedTasks(e) {
        const todoList = Storage.getTodoList();
        const currentProject = document.querySelector('.todo-header').textContent;
        const title = e.target.parentElement.textContent.trim().split("\n")[0];
        const currentProjectItem = todoList.getProject(currentProject).getItemFromProject(title);
        const item = todoList.getProject(currentProjectItem.project).getItemFromProject(title);
        item.toggleCompleted();
        Storage.storeTodoList(todoList);
        Storage.updateProjects();
    }

    static deleteTask(e) {
        const currentProject = document.querySelector('.todo-header').textContent;
        const title = e.target.parentElement.textContent.trim().split("\n")[0];
        const currentProjectItem = Storage.getTodoList().getProject(currentProject).getItemFromProject(title);
        const item = Storage.getTodoList().getProject(currentProjectItem.project).getItemFromProject(title);
        Storage.deleteItemFromProject(item.project, item);
        UI.clearTasks();
        UI.displayTasks();
        UI.eventListeners();
    }

    //Redisplays the add task modal and modifies it for editing current tasks
    static displayTaskEditForm(e) {
        const todoHeader = document.querySelector('.todo-header').textContent;
        const itemTitle = e.target.parentElement.textContent.trim().split("\n")[0];
        const item = Storage.getTodoList().getProject(todoHeader).getItemFromProject(itemTitle);
        const modal = document.querySelector('.modal');
        const modalContent = document.querySelector('.modal-content')
        modal.classList.add('show-modal');
        modalContent.classList.add('show-modal');
        const header = document.querySelector('.form-header');
        const closeBtn = document.querySelector('.close');
        closeBtn.remove();
        const newCloseButton = document.createElement('button');
        newCloseButton.classList.add('close-edit-button');
        newCloseButton.textContent = "X";
        header.appendChild(newCloseButton);
        const form = document.querySelector('.add-item-form');
        const formTitle = document.querySelector('.form-title');
        formTitle.textContent = "Edit Task";
        const submitTaskBtn = document.querySelector('.submit-item');
        submitTaskBtn.remove();
        const newBtn = document.createElement('button');
        newBtn.classList.add('confirm-edit');
        newBtn.textContent = "Confirm Edit";
        form.appendChild(newBtn);

        const taskTitle = document.getElementById('title');
        const description = document.getElementById('description');
        const priority = document.getElementById('priority');
        taskTitle.value = item.title;
        description.value = item.description;
        priority.value = item.priority;
        UI.eventListeners();
        newBtn.addEventListener('click', () => {UI.editTask(e, item)});
    }

    static editTask(e, currentItem) {
        const todoList = Storage.getTodoList();
        const item = todoList.getProject(currentItem.project).getItemFromProject(currentItem.title);

        const taskTitle = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const priority = document.getElementById('priority').value;
        const dueDate = document.getElementById('dueDate').value;

        if (taskTitle.length === 0 || dueDate.length === 0) {
            return;
        }
        else {
            e.preventDefault();
            item.setTitle(taskTitle);
            item.setDescription(description);
            item.setPriority(priority);
            item.setDueDate(dueDate);
            Storage.storeTodoList(todoList);
            Storage.updateProjects();
            UI.closeTaskEditForm();
            UI.clearTasks();
            UI.displayTasks();
            UI.eventListeners();
        }

    }

    //closes the modal and returns it back to it's original values
    static closeTaskEditForm() {
        const modal = document.querySelector('.modal');
        const modalContent = document.querySelector('.modal-content')
        modal.classList.remove('show-modal');
        modalContent.classList.remove('show-modal');
        const header = document.querySelector('.form-header');
        const newCloseBtn = document.querySelector('.close-edit-button');
        newCloseBtn.remove();
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('close');
        closeBtn.textContent = "X";
        header.appendChild(closeBtn);
        const form = document.querySelector('.add-item-form');
        form.reset();
        const formTitle = document.querySelector('.form-title');
        formTitle.textContent = "New Task";
        const newBtn = document.querySelector('.confirm-edit');
        newBtn.remove();
        const submitBtn = document.createElement('button');
        submitBtn.classList.add('submit-item');
        submitBtn.textContent = "Add Task";
        form.appendChild(submitBtn);
        UI.eventListeners();
    }

    //function for calling all of the event listeners on the page
    static eventListeners() {
        const sidebarToggle = document.querySelector(".sidebar-toggle");
        const project = document.querySelectorAll('.project');
        const newProjectForm = document.querySelector('.add-project');
        const cancelProjectBtn = document.querySelector('.cancel-project');
        const form = document.querySelector('.add-new-project');
        const deleteProjectBtns = document.querySelectorAll('.delete-project');
        const editProjectBtns = document.querySelectorAll('.edit-project');
        const cancelProjectRenameBtn = document.querySelector('.cancel-rename');
        const renameProjectBtn = document.querySelector('.rename-project');
        const addTaskBtn = document.querySelector('.add-task');
        const closeModalBtn = document.querySelector('.close');
        const submitTaskBtn = document.querySelector('.submit-item');
        const detailsBtn = document.querySelectorAll('.item-details');
        const todoDetailsCloseBtn = document.querySelector('.close-task');
        const checkbox = document.querySelectorAll('.completed');
        const deleteTaskBtn = document.querySelectorAll('.delete-task');
        const editTaskBtn = document.querySelectorAll('.edit-task');
        const closeEditTaskBtn = document.querySelector('.close-edit-button');

        sidebarToggle.addEventListener('click', this.toggleSidebarVisibility);
        project.forEach(btn => btn.addEventListener('click', this.selectProject));
        newProjectForm.addEventListener('click', this.toggleNewProjectForm);
        cancelProjectBtn.addEventListener('click', this.toggleNewProjectForm);
        form.addEventListener('submit', this.addNewProject);
        addTaskBtn.addEventListener('click', this.displayAddTaskModal);

        if (submitTaskBtn) {
            submitTaskBtn.addEventListener('click', this.addTask);
        }
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', this.closeAddTaskModal);
        }
        if (deleteProjectBtns) {
            deleteProjectBtns.forEach(button => {
                button.addEventListener('click', this.deleteProject);
            })
        }
        if (editProjectBtns) {
            editProjectBtns.forEach(button => {
                button.addEventListener('click', this.renameProjectForm);
            })
        }
        if (cancelProjectRenameBtn) {
            cancelProjectRenameBtn.addEventListener('click', this.removeProjectRenameForm);
        }
        if (renameProjectBtn) {
            renameProjectBtn.addEventListener('click', this.renameProject);
        }
        if (detailsBtn) {
            detailsBtn.forEach(button => {
                button.addEventListener('click', this.displayTodoDetails);
            })
        }
        if (todoDetailsCloseBtn) {
            todoDetailsCloseBtn.addEventListener('click', this.closeTodoDetails);
        }
        if (checkbox) {
            checkbox.forEach(box => {
                box.addEventListener('click', this.toggleCompletedTasks);
            })
        }
        if (deleteTaskBtn) {
            deleteTaskBtn.forEach(button => {
                button.addEventListener('click', this.deleteTask);
            })
        }
        if (editTaskBtn) {
            editTaskBtn.forEach(button => {
                button.addEventListener('click', this.displayTaskEditForm);
            })
        }
        if (closeEditTaskBtn) {
            closeEditTaskBtn.addEventListener('click', this.closeTaskEditForm);
        }
    }

    //Function for what happens when the page is loaded
    static pageLoad() {
        Storage.updateProjects();
        this.displayProjects();
        this.displayTasks();
        this.eventListeners();
    }
}