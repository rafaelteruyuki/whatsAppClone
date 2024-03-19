import Dexie from "dexie";
import { from } from "rxjs";
import { LocalUserImage } from "./local-user-image.model";

export class LocalDB {
  private localDB = new Dexie('clone-whats-app');

  constructor() {
    this.localDB.version(1)
      .stores({
        users: '&id, name, initials, imageBlob'
      })
  }

  private get userTable() {
    return this.localDB.table<LocalUserImage>('users');
  }

  public addUsers(users: LocalUserImage[]) {
    return from(this.userTable.bulkPut(users));
  }
}