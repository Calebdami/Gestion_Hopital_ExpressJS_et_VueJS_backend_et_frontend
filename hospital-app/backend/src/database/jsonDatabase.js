import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

class JSONDatabase {
    constructor() {
        this.dataDir = dataDir;
    }

    readFile(filename) {
        try {
            const filePath = path.join(this.dataDir, filename);
            if (!fs.existsSync(filePath)) {
                return [];
            }
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error(`Error reading ${filename}:`, err.message);
            return [];
        }
    }

    writeFile(filename, data) {
        try {
            const filePath = path.join(this.dataDir, filename);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            return true;
        } catch (err) {
            console.error(`Error writing ${filename}:`, err.message);
            return false;
        }
    }

    // Generic methods
    all(table) {
        return this.readFile(`${table}.json`);
    }

    get(table, id) {
        const data = this.readFile(`${table}.json`);
        return data.find(item => item.id === id || item.id === parseInt(id));
    }

    // Insert
    insert(table, data) {
        const items = this.readFile(`${table}.json`);
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        const newItem = {
            id: newId,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        items.push(newItem);
        this.writeFile(`${table}.json`, items);
        return { id: newId, ...newItem };
    }

    // Update
    update(table, id, data) {
        const items = this.readFile(`${table}.json`);
        const index = items.findIndex(item => item.id === id || item.id === parseInt(id));
        if (index !== -1) {
            items[index] = {
                ...items[index],
                ...data,
                updated_at: new Date().toISOString()
            };
            this.writeFile(`${table}.json`, items);
            return true;
        }
        return false;
    }

    // Delete
    delete(table, id) {
        const items = this.readFile(`${table}.json`);
        const index = items.findIndex(item => item.id === id || item.id === parseInt(id));
        if (index !== -1) {
            const deleted = items[index];
            items.splice(index, 1);
            this.writeFile(`${table}.json`, items);
            return deleted;
        }
        return null;
    }

    // Filter operations
    filter(table, filterFn) {
        const items = this.readFile(`${table}.json`);
        return items.filter(filterFn);
    }

    // Custom query methods
    filterByField(table, field, value) {
        const items = this.readFile(`${table}.json`);
        return items.filter(item => item[field] === value);
    }

    // Health check
    health() {
        return { status: 'healthy', type: 'json-database', dataDir: this.dataDir };
    }
}

export default new JSONDatabase();
