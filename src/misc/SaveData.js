import Dexie from "dexie";
class SaveData {
  constructor(group) {
    this._group = group;

    this._db = new Dexie("SaveData");
    this._db.version(1).stores({
      saves: "++id, dateUpdate, group"
    });
  }

  async getList() {
    const savesList = (
      await this._db.saves.where({ group: this._group }).toArray()
    ).map(({ id, title, dateUpdate }) => ({ id, title, dateUpdate }));
    // console.log({ savesList });

    return savesList;
  }

  async save({ id, title, data }) {
    console.log("save", { id, title, data });
    if (id) {
      const update = { dateUpdate: Date.now() };
      if (title) update.title = title;
      if (data) update.data = data;
      await this._db.saves.update(id, update);
    } else {
      id = await this._db.saves.add({
        dateUpdate: null,
        group: this._group,
        title,
        data
      });
    }

    return id;
  }

  async getData(id) {
    const save = await this._db.saves.where({ id }).first();
    if (save) return save.data;
    return null;
  }

  async delete(id) {
    const deleteCount = await this._db.saves.where({ id }).delete();
    return deleteCount;
  }
}

export default SaveData;
