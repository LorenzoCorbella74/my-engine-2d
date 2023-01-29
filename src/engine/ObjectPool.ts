/*
        Dato un game object:

        class GameObject {
            public x: number;
            public y: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
            }
        }

        const gameObjectPool = new ObjectPool<GameObject>(GameObject);

        // Acquisisce un oggetto dalla pool
        let obj1 = gameObjectPool.acquire(10, 20);
        console.log(obj1.x); // 10
        console.log(obj1.y); // 20

        // Utilizziamo l'oggetto
        obj1.x = obj1.x + 5;
        console.log(obj1.x); // 15

        // Rilasciamo l'oggetto nella pool per riutilizzarlo in futuro
        gameObjectPool.release(obj1);    
*/

export class ObjectPool<T> {
    private pool: T[] = [];
    private constructorFn: { new(...args: any[]): T };

    constructor(constructorFn: { new(...args: any[]): T }) {
        this.constructorFn = constructorFn;
    }

    acquire(...args: any[]): T {
        if (this.pool.length > 0) {
            return this.pool.pop() as T;
        } else {
            return new this.constructorFn(...args);
        }
    }

    release(obj: T): void {
        this.pool.push(obj);
    }
}