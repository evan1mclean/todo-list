import TodoItem from "./TodoItem";
import Project from "./Project";
import TodoList from "./TodoList";

//Class for handling interaction of Todo List and local storage
export default class Storage {

    //Stores the list
    static storeTodoList(list) {
        localStorage.setItem('TodoList', JSON.stringify(list));
    }

    //Retrieves the list and assigns class methods back to Todo Items, Projects, and Todo List
    static getTodoList() {
        const todoList = Object.assign(new TodoList, JSON.parse(localStorage.getItem('TodoList')));
        const projects = todoList.getProjects();
        projects.forEach((project, index) => {
            projects[index] = Object.assign(new Project, project)});
        projects.forEach((project) => {
            const items = project.getItems();
            items.forEach((item, index) => {
                items[index] = Object.assign(new TodoItem, item);
            })
        })
        return todoList;
    }

    //Updates Inbox/today/this week and stores the values
    static updateProjects() {
        const todoList = Storage.getTodoList();
        todoList.updateInbox();
        todoList.updateTodaysItems();
        todoList.updateThisWeeksItems();
        Storage.storeTodoList(todoList);
    }

    //Adds project and stores values
    static addProject(project) {
        const todoList = Storage.getTodoList();
        todoList.addProject(new Project(project));
        Storage.storeTodoList(todoList);
        Storage.updateProjects();
    }

    //Deletes project and stores value
    static deleteProject(project) {
        const todoList = Storage.getTodoList();
        todoList.deleteProject(project);
        Storage.storeTodoList(todoList);
        Storage.updateProjects();
    }

    //Changes project title and stores value
    static renameProject(project, newTitle) {
        const todoList = Storage.getTodoList();
        todoList.getProject(project).setTitle(newTitle);
        Storage.storeTodoList(todoList);
        Storage.updateProjects();
    }

    //Adds item to project and stores values
    static addItemToProject(project, item) {
        const todoList = Storage.getTodoList();
        todoList.getProject(project).addItemToProject(new TodoItem(item));
        Storage.storeTodoList(todoList);
        Storage.updateProjects();
    }

    //Deletes item from project and stores value
    static deleteItemFromProject(project, item) {
        const todoList = Storage.getTodoList();
        todoList.getProject(project).deleteItemFromProject(item);
        Storage.storeTodoList(todoList);
        Storage.updateProjects();
    }
}