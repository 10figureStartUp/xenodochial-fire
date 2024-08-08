import { openDB } from "idb";

const DB_NAME = "intentionalEating";
const DB_VERSION = 1;
const STORE_NAME = "meals";

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  });
}

export async function getMealsFromDB() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function saveMealToDB(meal) {
  const db = await initDB();
  return db.put(STORE_NAME, meal);
}

export async function deleteMealFromDB(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}
