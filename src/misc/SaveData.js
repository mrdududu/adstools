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
    if (id) {
      const elById = storage.find(item => item.id === id);
      if (elById) {
        elById.dateUpdate = Date.now();
        elById.data = data;
        if (title) elById.title = title;
      }
    } else {
      id = Date.now();
      const newEl = {
        id,
        title,
        data
      };
      storage.push(newEl);
    }

    LocalStorage.set(this.storageName, storage);

    return id;
  }
}

export default SaveData;
