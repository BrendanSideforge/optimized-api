import axios from "axios";
import { players, bans, config, pool } from "..";
import { getAuthorizedUser } from "./AuthorizedUsers";

export function getBanLogLink(server: string): string {

    return `https://${server}.sploop.io/ws/banLog_UIW0NDKALZ79`;

}

export async function getBanLogsFromEndpoint(server: string): Promise<any> {

    const server_link: string = getBanLogLink(server);
    const ban_logs: any = await axios.get(server_link);

    return ban_logs.data;

}

export function getBanIdsFromBans(ban_logs: Array<object | any>): Array<string> {

    return ban_logs.map((log: object | any) => {
        return log.ban_id;
    });

}

export async function getJustifiedBanLogs(server: string): Promise<Array<object | any>> {

    const query: string = "SELECT * FROM ban_logs WHERE server=$1";
    const justified_ban_logs: any = await pool.query(query, [server]);

    return justified_ban_logs.rows;

}

export async function getAuthorizedFilterLogs(user_id: string, ban_logs: Array<object | any>): Promise<Array<object | any>> {

    const authorized_user = await getAuthorizedUser(user_id);

    if (!authorized_user) return null;
    if (authorized_user.access_level >= config.Moderation.minimum_banid_access_level) {
        return ban_logs;
    }

    const excluded_property: string = "banid";
    return ban_logs.map((log: any) => {

        const { [excluded_property]: excluded, ...rest } = log;
        return rest;

    });

}

export async function getPlayersFromEveryServer() {

    for (let i: number = 0; i < config.Moderation.servers.length; i++) {

        const server: object | any = config.Moderation.servers[i];
        const player_logs: any = `https://${server.value}.sploop.io/ws/playerList_BUG7NFGNA1UY`

        if (!players.players[server.value]) players.players[server.value] = [];

        players.total_players += player_logs.length;
        players.players[server.value] = player_logs;

    }

}

export async function getBansFromEveryServer() {

    for (let i: number = 0; i < config.Moderation.servers.length; i++) {

        const server: object | any = config.Moderation.servers[i];
        const ban_logs: any = await getBanLogsFromEndpoint(server.value);

        if (!bans.bans[server.value]) bans.bans[server.value] = [];

        bans.total_bans += ban_logs.length;
        bans.bans[server.value] = ban_logs;

    }

}
