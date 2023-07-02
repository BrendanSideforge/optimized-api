

import express from "express";
import { bans, players } from "..";
import { getBansFromEveryServer, getPlayersFromEveryServer } from "../utils/BanLogs";

const router: express.Router = new express.Router();

router.get("/basic", async (req: express.Request, res: express.Response) => {

    await getBansFromEveryServer();
    await getPlayersFromEveryServer();

    res.json({
        bans: bans.total_bans,
        players: players.total_players,
        status: "Secure"
    })

})

export = router;
