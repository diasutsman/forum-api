/* istanbul ignore file */
import pool from "../src/Infrastructures/database/postgres/pool";

const UsersLikesTableTestHelper = {
	async addUserLikes({
		id = "like-123",
		userId = "user-123",
		commentId = "comment-123",
	}) {
		const query = {
			text: "INSERT INTO users_likes VALUES($1, $2, $3)",
			values: [id, userId, commentId],
		};

		await pool.query(query);
	},

	async findUsersLikesByUserId(userId: string): Promise<object> {
		const query = {
			text: "SELECT * FROM users_likes WHERE user_id = $1",
			values: [userId],
		};

		const result = await pool.query(query);

		return result.rows;
	},

	async findUsersLikesByCommentId(commentId: string): Promise<object> {
		const query = {
			text: "SELECT * FROM users_likes WHERE comment_id = $1",
			values: [commentId],
		};

		const result = await pool.query(query);

		return result.rows;
	},

	async cleanTable() {
		await pool.query("DELETE FROM users_likes WHERE 1=1");
	},
};

export default UsersLikesTableTestHelper;
