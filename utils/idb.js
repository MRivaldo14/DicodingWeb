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
  async saveStory(story) {
    try {
      if (!story || !story.id) {
        console.warn('Story tidak valid untuk disimpan:', story);
        return;
      }
      const db = await dbPromise;
      await db.put(STORE_NAME, story);
      console.log('✅ Story berhasil disimpan:', story.id);
    } catch (err) {
      console.error('❌ Gagal menyimpan story:', err);
    }
  },

  async saveStories(stories = []) {
    if (!Array.isArray(stories)) return;
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    try {
      for (const story of stories) {
        if (story?.id) {
          await store.put(story);
        }
      }
      await tx.done;
      console.log('✅ Semua story berhasil disimpan.');
    } catch (err) {
      console.error('❌ Gagal menyimpan stories:', err);
    }
  },

  async getAllStories() {
    try {
      const db = await dbPromise;
      return await db.getAll(STORE_NAME);
    } catch (err) {
      console.error('❌ Gagal mengambil semua story:', err);
      return [];
    }
  },

  async getStoryById(id) {
    try {
      if (!id) return null;
      const db = await dbPromise;
      return await db.get(STORE_NAME, id);
    } catch (err) {
      console.error(`❌ Gagal mengambil story ID ${id}:`, err);
      return null;
    }
  },

  async deleteStory(id) {
    try {
      if (!id) return;
      const db = await dbPromise;
      await db.delete(STORE_NAME, id);
      console.log(`🗑️ Story dengan ID ${id} berhasil dihapus.`);
    } catch (err) {
      console.error(`❌ Gagal menghapus story ID ${id}:`, err);
    }
  },

  async clearAllStories() {
    try {
      const db = await dbPromise;
      await db.clear(STORE_NAME);
      console.log('🧹 Semua story berhasil dihapus.');
    } catch (err) {
      console.error('❌ Gagal menghapus semua story:', err);
    }
  },
};

export default IDBHelper;
