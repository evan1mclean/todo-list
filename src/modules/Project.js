export default class Project {
    constructor(title) {
        this.title = title;
        this.items = [];
    }

    addItemToProject(item) {
        this.items.push(item);
    }

    getItemFromProject(item) {
        return this.items[item];
    }

    removeItemFromProject(item) {
        this.items.splice(this.items[item], 1);
    }
}