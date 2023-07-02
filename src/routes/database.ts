
import express from "express";

import { pool } from "..";
import { objectToSqlFetchMethod, objectToSqlInsertMethod, objectToSqlUpdateMethod } from "../utils/SQLFormatter";

const router: express.Router = new express.Router();

router.post("/data", async (req: express.Request, res: express.Response) => {

    try {
        const formatted_entry = objectToSqlInsertMethod(req.body);
        await pool.query(formatted_entry.query, formatted_entry.ascended_values);
        res.json(formatted_entry);
    } catch(e) {
        console.log(e);
        res.json(e);
    }

});

router.patch("/data", async (req: express.Request, res: express.Response) => {

    try {
        console.log(req.body);
        const formatted_entry = objectToSqlUpdateMethod(req.body);
        await pool.query(formatted_entry.query, formatted_entry.ascended_values);

        res.json(formatted_entry)
    } catch(e) {
        console.log(e);
        res.json({
            error: true,
            code: e.error
        });
    }

});

router.post("/data-get", async (req: express.Request, res: express.Response) => {
    try {
        const formatted_entry = objectToSqlFetchMethod(req.body);
        const information = await pool.query(formatted_entry.query, formatted_entry.ascended_values);
        console.log(formatted_entry);
        res.json(information.rows);
    } catch(e) {
        console.log(e);
        res.json({ error: e })
    }

});


export = router;
