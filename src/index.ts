
import express from "express";
import bodyparser from "body-parser";
import cors from "cors";

import * as pg from "pg";
import * as Redis from "redis";

import { ConfigLoader } from "./utils/ConfigLoader";
import { RouteLoader } from "./utils/RouteLoader";
import * as DatabaseLoader from "./utils/DatabaseLoader";
import { getBansFromEveryServer, getPlayersFromEveryServer } from "./utils/BanLogs";

const app: express.Application = express();
export const config = ConfigLoader('config.yaml');
export const pool = new pg.Pool(config.Postgres);
export const redis = new Redis.createClient();
export const bans: object | any = { total_bans: 0, bans: {}};
export const players: object | any = { total_players: 0, players: {}};

app.use(cors(config.ExpressServer.cors));
app.use(express.json({limit: config.ExpressServer.bandwidth_limit}));
app.use(express.urlencoded({limit: config.ExpressServer.bandwidth_limit}));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: config.ExpressServer.url_encoded }));

RouteLoader(app);

app.listen(config.ExpressServer.port, config.ExpressServer.host, async () => {

    console.info(`[SERVER] Listening on ${config.ExpressServer.host}:${config.ExpressServer.port}`);
    
    await getBansFromEveryServer();
    await getPlayersFromEveryServer();
    await DatabaseLoader.postgres(pool);
    await DatabaseLoader.redis(redis);

})
