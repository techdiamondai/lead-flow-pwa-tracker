
// IndexedDB wrapper for offline storage

export interface DBOptions {
  storeName: string;
  dbVersion?: number;
}

export class IndexedDB<T> {
  private dbName: string;
  private storeName: string;
  private dbVersion: number;

  constructor(dbName: string, options: DBOptions) {
    this.dbName = dbName;
    this.storeName = options.storeName;
    this.dbVersion = options.dbVersion || 1;
  }

  private connect(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          // Add indexes if needed
          store.createIndex('created_at', 'created_at', { unique: false });
          store.createIndex('updated_at', 'updated_at', { unique: false });
        }
      };
    });
  }

  async getAll(): Promise<T[]> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result as T[]);
        db.close();
      };
      
      request.onerror = () => {
        reject(request.error);
        db.close();
      };
    });
  }

  async getById(id: string): Promise<T | undefined> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      
      request.onsuccess = () => {
        resolve(request.result as T);
        db.close();
      };
      
      request.onerror = () => {
        reject(request.error);
        db.close();
      };
    });
  }

  async add(item: Partial<T>): Promise<string> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      // Add timestamps
      const itemWithTimestamp = { 
        ...item, 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      };
      
      const request = store.add(itemWithTimestamp as any);
      
      request.onsuccess = () => {
        resolve(request.result as string);
        db.close();
      };
      
      request.onerror = () => {
        reject(request.error);
        db.close();
      };
    });
  }

  async update(id: string, changes: Partial<T>): Promise<boolean> {
    const db = await this.connect();
    const item = await this.getById(id);
    
    if (!item) return false;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const updatedItem = { 
        ...item, 
        ...changes, 
        updated_at: new Date().toISOString() 
      };
      
      const request = store.put(updatedItem);
      
      request.onsuccess = () => {
        resolve(true);
        db.close();
      };
      
      request.onerror = () => {
        reject(request.error);
        db.close();
      };
    });
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve(true);
        db.close();
      };
      
      request.onerror = () => {
        reject(request.error);
        db.close();
      };
    });
  }

  async clear(): Promise<boolean> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        resolve(true);
        db.close();
      };
      
      request.onerror = () => {
        reject(request.error);
        db.close();
      };
    });
  }
}
