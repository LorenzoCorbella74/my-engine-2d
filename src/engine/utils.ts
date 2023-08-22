import { ENGINE_MSG_PREFIX } from "./Engine";

export function massiveRequire(req: any): { key: string, type: string, data: any }[] {
    const files: { key: string, type: string, data: any }[] = [];
    req.keys().forEach(key => {
        files.push({ key, data: req(key), type: key.split('.')[2] });
    });
    console.log(`${ENGINE_MSG_PREFIX}All files in folder:`, files);
    return files;
}