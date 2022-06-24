import Storage from "./Storage";

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
            if (projectTitle[0] === addProjectFormInput.value || projectTitle[0] === renameProjectFormInput.value) {
                duplicatedName = true;
            }
        })
        return duplicatedName;
    }

    static addNewProject(e) {
        e.preventDefault();
        const form = document.querySelector('.add-new-project');
        const formInput = document.getElementById('new-project');
        if (formInput.value.length === 0) {
            return;
        }
        else if (UI.checkForDuplicateProjects()) {
            window.alert("You can't duplicate project names!");
            form.reset();
        }
        else {
            Storage.addProject(formInput.value);
            UI.clearProjects();
            UI.displayProjects();
            UI.toggleNewProjectForm(e);
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

        sidebarToggle.addEventListener('click', this.toggleSidebarVisibility);
        project.forEach(btn => btn.addEventListener('click', this.selectProject));
        newProjectForm.addEventListener('click', this.toggleNewProjectForm);
        cancelProjectBtn.addEventListener('click', this.toggleNewProjectForm);
        form.addEventListener('submit', this.addNewProject);
        addTaskBtn.addEventListener('click', this.displayAddTaskModal);
        closeModalBtn.addEventListener('click', this.closeAddTaskModal);

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
    }

    static pageLoad() {
        this.displayProjects();
        this.eventListeners();
    }
}