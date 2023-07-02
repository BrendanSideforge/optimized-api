
import express from "express";
import * as fs from "fs";

/**
 * Loads static exports from the "routes" folder
 * @param app express.Application
 */

export function RouteLoader(app: express.Application): void {

    fs.readdir("./dist/routes", async (err: any, filenames: Array<string>) => {
        if (err) return console.error(`[ROUTE INIT] ${err}`);

        filenames.forEach(async (filename: string) => {
            
            if (!filename.endsWith(".js")) return;
            const filename_without_suffix = filename.split(".js")[0]

            try {
                const default_export: any = await (await import(`../routes/${filename}`)).default;
                const route_string: string = `/api/${filename_without_suffix}`;

                app.use(route_string, default_export);
                
                console.info(`[ROUTE SUCCESS] ${filename_without_suffix}`)
            } catch(e) {
                console.error(`[ROUTE FAILURE] ${filename_without_suffix} ${e}`)
            }

        });
    })

}
