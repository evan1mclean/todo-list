//A class for handling Todo Item functionality
export default class TodoItem {
    constructor(title, project, description, dueDate, priority, completed) {
        this.title = title;
        this.project = project;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = completed;
    }

    setTitle(newTitle) {
        this.title = newTitle;
    }

    getTitle() {
        return this.title;
    }

    setDescription(newDescription) {
        this.description = newDescription;
    }
    
    getDescription() {
        return this.description;
    }

    setDueDate(newDueDate) {
        this.dueDate = newDueDate;
    }

    getDueDate() {
        return this.dueDate;
    }

    setPriority(newPriority) {
        this.priority = newPriority;
    }

    getPriority() {
        return this.priority;
    }

    getCompleted() {
        return this.completed;
    }

    toggleCompleted() {
        if (this.completed === true) {
            this.completed = false;
        }
        else {
            this.completed = true;
        }
    }
}