// @graph-mind
// Remove the previous line to stop Ada from updating this file
import cuid from 'cuid';
import objectPath from 'object-path';

function genId() {
    return cuid();
}

function find(root: { [name: string]: any } | any[], path, value?) {
    if (arguments.length === 3) {
        const arrayRef = objectPath.get(root, path);
        return arrayRef.find((element) => element === value);
    }
    const arrayRef = root;
    return arrayRef.find((element) => element === path);
}

function add(root: { [name: string]: any } | any[], path, value?) {
    if (arguments.length === 3) {
        const arrayRef = objectPath.get(root, path);
        arrayRef.push(value);
    } else {
        const arrayRef = root;
        arrayRef.push(path);
    }
}

function remove(root: { [name: string]: any } | any[], path, value?) {
    if (arguments.length === 3) {
        const arrayRef = objectPath.get(root, path);
        const index: number = arrayRef.findIndex(
            (element) => element === value,
        );
        if (index > -1) {
            arrayRef.splice(index, 1);
        }
    } else {
        const arrayRef = root;
        const index: number = arrayRef.findIndex((element) => element === path);
        if (index > -1) {
            arrayRef.splice(index, 1);
        }
    }
}

function findObject(root: { [name: string]: any } | any[], path, value?) {
    if (arguments.length === 3) {
        const arrayRef = objectPath.get(root, path);
        return arrayRef.find((element) => element.id === value);
    }
    const arrayRef = root;
    return arrayRef.find((element) => element.id === path);
}

function addObject(root: { [name: string]: any } | any[], path, value?) {
    if (arguments.length === 3) {
        const arrayRef = objectPath.get(root, path);
        arrayRef.push(value);
    } else {
        const arrayRef = root;
        arrayRef.push(path);
    }
}

function updateObject(root: { [name: string]: any } | any[], path, value?) {
    if (arguments.length === 3) {
        const arrayRef = objectPath.get(root, path);
        const index: number = arrayRef.findIndex(
            (element) => element.id === value.id,
        );
        if (index > -1) {
            arrayRef.splice(index, 1, value);
        } else {
            arrayRef.push(value);
        }
    } else {
        const arrayRef = root;
        const index: number = arrayRef.findIndex(
            (element) => element.id === path.id,
        );
        if (index > -1) {
            arrayRef.splice(index, 1, path);
        } else {
            arrayRef.push(path);
        }
    }
}

function removeObject(root: { [name: string]: any } | any[], path, value?) {
    if (arguments.length === 3) {
        const arrayRef = objectPath.get(root, path);
        const index: number = arrayRef.findIndex(
            (element) => element.id === value,
        );
        if (index > -1) {
            arrayRef.splice(index, 1);
        }
    } else {
        const arrayRef = root;
        const index: number = arrayRef.findIndex(
            (element) => element.id === path,
        );
        if (index > -1) {
            arrayRef.splice(index, 1);
        }
    }
}

export default {
    genId,
    find,
    add,
    remove,
    findObject,
    addObject,
    updateObject,
    removeObject,
};