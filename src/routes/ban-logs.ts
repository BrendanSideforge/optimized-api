
import axios from "axios";
import express from "express";

import { getAuthorizedFilterLogs, getBanIdsFromBans, getBanLogLink, getJustifiedBanLogs } from "../utils/BanLogs";
import { getBanDateString } from "../utils/Dates";

const router: express.Router = new express.Router();

router.post("/evidence", async (req: express.Request, res: express.Response ) => {
    
})

router.post("/filter", async (req: express.Request, res: express.Response) => {

    const filters: object | any = req.body;

    // check if there is no server
    if (!filters.server) return res.json({ error: "Server not found." });

    const endpoint_link: string = getBanLogLink(filters.server);
    const endpoint_ban_logs: Array<object | any> = (await axios.get(endpoint_link)).data;
    const justified_ban_logs: Array<object | any> = await getJustifiedBanLogs(filters.server);
    const justified_ban_ids: Array<string> = getBanIdsFromBans(justified_ban_logs);

    const filtered_ban_logs: Array<object | any> = endpoint_ban_logs.filter((log: object | any) => {

        // make sure everything is true, setting the local scope to true 
        const current_date: Date = new Date();
        const logged_date: Date = new Date(log['timestamp']);
        
        let matched_date: boolean = true;
        let matched_name: boolean = true;
        let matched_moderator: boolean = log['moderator'] == 0 ? false : true;
        let matched_justified: boolean = true;

        /* 
            If there is no set filter in the body, or filters object, then we just continue on to the next statement. 
            No reason to run a filter check if there isn't even a filter set.
        */

        if (filters.justified) {
            if (!justified_ban_ids.includes(log['banid'].toString())) matched_justified = false; // the banid attribute in the log is the type of integer, includes function doesn't type match
        }

        if (filters.name) {
            if (log['name'] !== filters.name) matched_name = false;
        }

        if (filters.moderator) {
            if (+log['moderator'] !== +filters.moderator) matched_moderator = false;
        }

        if (filters.date) {
            const current_date_string: string = getBanDateString(current_date);
            const log_date_string: string = getBanDateString(logged_date);

            if (!(current_date_string === log_date_string)) matched_date = false;
        }

        return matched_justified && matched_name && matched_moderator && matched_date;

    });

    const authorized_filter_logs: Array<object | any> = await getAuthorizedFilterLogs(filters.discord_id, filtered_ban_logs)

    res.json(authorized_filter_logs);

});

export = router;
