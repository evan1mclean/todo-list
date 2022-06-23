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

    static displayProject(e) {
        const btn = e.currentTarget;
        const todoHeader = document.querySelector('.todo-header');
        let projectTitle = btn.textContent.trim().split("\n");
        if (btn.classList.contains("selected")) {
            return;
        }
        else {
            UI.clearSelected();
            btn.classList.toggle('selected');
            todoHeader.textContent = projectTitle[0];
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
            <div class="delete-project" title="Delete Project">X</div>`;
            sidebar.insertBefore(newProject, addProjectBtn);
    }

    static addNewProject(e) {
        e.preventDefault();
        const form = document.querySelector('.add-new-project');
        const formInput = document.getElementById('new-project');
        const projects = document.querySelectorAll('.project');
        let duplicatedName = false;
        projects.forEach(button => {
            let projectTitle = button.textContent.trim().split("\n");
            if (projectTitle[0] === formInput.value) {
                duplicatedName = true;
            }
        })
        if (formInput.value.length === 0) {
            return;
        }
        else if (duplicatedName) {
            window.alert("You can't duplicate project names!");
            form.reset();
        }
        else {
            UI.projectTemplate(formInput.value);
            UI.toggleNewProjectForm(e);
            UI.eventListeners();
        }
    }

    static deleteProject(e) {
        e.stopPropagation();
        e.target.parentElement.remove();
        UI.displayInbox();
    }

    static displayInbox() {
        UI.clearSelected();
        const inbox = document.querySelector('.inbox');
        inbox.classList.add("selected");
        const todoHeader = document.querySelector('.todo-header');
        todoHeader.textContent = "Inbox";
    }

    static eventListeners() {
        const sidebarToggle = document.querySelector(".sidebar-toggle");
        const project = document.querySelectorAll('.project');
        const newProjectForm = document.querySelector('.add-project');
        const cancelProjectBtn = document.querySelector('.cancel-project');
        const form = document.querySelector('.add-new-project');
        const deleteProjectBtn = document.querySelector('.delete-project');

        sidebarToggle.addEventListener('click', this.toggleSidebarVisibility);
        project.forEach(btn => btn.addEventListener('click', this.displayProject));
        newProjectForm.addEventListener('click', this.toggleNewProjectForm);
        cancelProjectBtn.addEventListener('click', this.toggleNewProjectForm);
        form.addEventListener('submit', this.addNewProject);
        if (deleteProjectBtn) {
            deleteProjectBtn.addEventListener('click', this.deleteProject);
        }
    }

    static pageLoad() {
        this.eventListeners();
    }
}