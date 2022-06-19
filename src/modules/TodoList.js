import Project from "./Project";

//A class for handling the Todo List functionality
export default class TodoList {
    constructor() {
        this.projects = [];
        this.projects.push(new Project('Inbox'));
        this.projects.push(new Project('Today'));
        this.projects.push(new Project('This Week'));
        this.currentDate = new Date().toLocaleDateString();
    }

    addProject(project) {
        this.projects.push(project);
    }

    getProjects() {
        return this.projects;
    }

    deleteProject(project) {
        this.projects.splice(this.projects[project], 1);
    }
}