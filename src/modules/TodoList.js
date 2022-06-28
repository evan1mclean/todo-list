import Project from "./Project";
import { isToday, isThisWeek } from "date-fns";

//A class for handling the Todo List functionality
export default class TodoList {
    constructor() {
        this.projects = [];
        this.projects.push(new Project('Inbox'));
        this.projects.push(new Project('Today'));
        this.projects.push(new Project('This Week'));
    }

    addProject(project) {
        this.projects.push(project);
    }

    getProjects() {
        return this.projects;
    }

    getProject(project) {
        return this.projects.find(item => item.title === project);
    }

    deleteProject(project) {
        this.projects.splice(this.projects.indexOf(this.getProject(project)), 1);
    }

    //Clears the inbox tasks and repopulates from every project that isn't today or this week
    updateInbox() {
        let inbox = this.getProject("Inbox");
        inbox.resetItems();

        this.projects.forEach(project => {
            if (project.title === this.getProject("Today").title || project.title === this.getProject("This Week").title) {
                return;
            }
            else {
                let items = project.getItems();
                items.forEach(item => {
                    inbox.addItemToProject(item);
                });
            }
        });
    }

    //Clears todays tasks and repopulates from every project that isn't inbox or this week if the due date is today
    updateTodaysItems() {
        let today = this.getProject("Today");
        today.resetItems();

        this.projects.forEach(project => {
            if (project.title === this.getProject("Inbox").title || project.title === this.getProject("This Week").title) {
                return;
            }
            else {
                let items = project.getItems();
                items.forEach(item => {
                    if (isToday(new Date(item.getDueDate()))) {
                        today.addItemToProject(item);
                    }
                });
            }
        });
    }

    ///Clears this weeks tasks and repopulates from every project that isn't inbox or todayif the due date is this week
    updateThisWeeksItems() {
        let thisWeek = this.getProject("This Week");
        thisWeek.resetItems();

        this.projects.forEach(project => {
            if (project.title === this.getProject("Inbox").title || project.title === this.getProject("Today").title) {
                return;
            }
            else {
                let items = project.getItems();
                items.forEach(item => {
                    if (isThisWeek(new Date(item.getDueDate()), { weekStartsOn: 1 })) {
                        thisWeek.addItemToProject(item);
                    }
                });
            }
        });
    }
}