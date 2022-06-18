export default class TodoItem {
    constructor(title, description, dueDate, completed) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
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