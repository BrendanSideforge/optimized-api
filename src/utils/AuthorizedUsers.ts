import { pool } from "..";

export async function getAuthorizedUser(user_id: string) {

    const query: string = "SELECT * FROM authorized_users WHERE user_id=$1";
    const authorized_user: any = await pool.query(query, [user_id]);

    if (authorized_user.rows.length === 0) return null;

    return authorized_user.rows[0];
}
