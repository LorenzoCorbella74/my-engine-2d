export function massiveRequire(req: any): { key: string, type: string, data: any }[] {
    const files:{ key: string, type: string, data: any }[] = [];
    req.keys().forEach(key => {
        files.push({key, data: req(key), type: key.split('.')[2]});
    });
    console.log('All files loaded: ', files);
    return files;
}