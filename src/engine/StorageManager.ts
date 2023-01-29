export class StorageDB {

    constructor(private prefix:string = 'pe_'){}
    
    save(key: string, value: any) {
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
    }

    load(key: string) {
        if(key !== null) {
            return JSON.parse(localStorage.getItem(this.prefix + key) as string);
        }
    }

    clear(key?: string) {
        if (key) {
            localStorage.removeItem(this.prefix + key);
        } else {
            localStorage.clear();
        }
    }

}