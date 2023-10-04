export type Asset = {
    name: string;
    url: string;
    ext: string;
    category: 'img' | 'data' | 'audio';
    group: string;
};

export type Resources = Record<string, any>