import { LocalStorage } from "quasar";
class SaveData {
  constructor(uniqName) {
    this._uniqName = uniqName;
  }
  get storageName() {
    return `SaveData_${this._uniqName}`;
  }
  get storage() {
    return LocalStorage.getItem(this.storageName);
  }
  getList() {
    const storage = this.storage;
    if (Array.isArray(storage)) {
      return storage.map(({ id, title, dateUpdate }) => ({
        id,
        title,
        dateUpdate
      }));
    }

    return [];
  }
  getData(id) {
    const storage = this.storage;
    if (Array.isArray(storage)) {
      const elById = storage.find(item => item.id === id);
      if (elById) {
        return elById.data;
      }
    }

    return null;
  }
  save({ id, title, data }) {
    const storage = this.storage ? this.storage : [];
    let isNew = true;
    let elById = null;

    if (0 < storage.length) {
      if (id) {
        elById = storage.find(item => item.id === id);
        if (elById) {
          isNew = false;
        }
      }
    }

    if (!isNew) {
      elById.dateUpdate = Date.now();
      elById.data = data;
      if (title) elById.title = title;
    } else {
      id = id ? id : Date.now();
      const newEl = {
        id,
        title: title ? title : id,
        data
      };
      storage.push(newEl);
    }

    LocalStorage.set(this.storageName, storage);

    return id;
  }
  delete(id) {
    let storage = this.storage ? this.storage : [];
    if (0 < storage.length) {
      storage.splice(
        storage.findIndex(item => item.id == id),
        1
      );
      LocalStorage.set(this.storageName, storage);
    }
  }
}

export default SaveData;
