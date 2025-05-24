import { openDB } from 'idb';

const DB_NAME = 'story-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const IDBHelper = {
  async saveStories(stories = []) {
    if (!Array.isArray(stories)) return;

    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    for (const story of stories) {
      if (story?.id) {
        await store.put(story);
      }
    }

    await tx.done;
  },

  async saveStory(story) {
    if (!story?.id) return;

    const db = await dbPromise;
    return db.put(STORE_NAME, story);
  },

  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  async getStoryById(id) {
    if (!id) return null;

    const db = await dbPromise;
    return db.get(STORE_NAME, id);
  },

  async deleteStory(id) {
    if (!id) return;

    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
  },

  async clearAllStories() {
    const db = await dbPromise;
    return db.clear(STORE_NAME);
  },
};

export default IDBHelper;
