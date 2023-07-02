
import * as pg from "pg";
import * as fs from "fs";
import * as utils from "util";

import { KeyspaceNotif } from "./KeyspaceNotifs";

/**
 * Create all new tables inside the "sql" directory
 * @param pool - pg.Pool
 */
export async function postgres(pool: pg.Pool): Promise<void> {

    fs.readdir("./dist/sql", async (err: any, filenames: Array<string>) => {
        if (err) return console.error(err);

        filenames.forEach(async (filename: string) => {
            fs.readFile(`./dist/sql/${filename}`, async (err: any, content: any) => {
                if (err) return console.error(err);

                await pool.query(content.toString());
                console.info(`[TABLE CREATED] ${filename}`)

            });
        });

    })

}

/**
 * sets up keyspace event notifications, i.e expired keys
 * @param redis - redisClient
 */
export async function redis(redis): Promise<void> {

    redis.get = utils.promisify(redis.get);
    redis.smembers = utils.promisify(redis.smembers);
    redis.send_command(
        'config',
        ['set', 'notify-keyspace-events', 'Ex'],
        KeyspaceNotif
    );

    console.info("[REDIS] Created keyspace event notifications, and promisified methods.")

}
