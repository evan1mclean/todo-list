//A class for handling Project object functionality
export default class Project {
    constructor(title) {
        this.title = title;
        this.items = [];
    }

    setTitle(newTitle) {
        this.title = newTitle;
    }

    getTitle() {
        return this.title;
    }

    addItemToProject(item) {
        this.items.push(item);
    }

    getItemFromProject(item) {
        return this.items.find(title => title.title === item);
    }

    getItems() {
        return this.items;
    }

    resetItems() {
        this.items = [];
    }

    deleteItemFromProject(item) {
        this.items.splice(this.items.indexOf(this.getItemFromProject(item)), 1);
    }
}