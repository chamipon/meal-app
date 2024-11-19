const { Pool } = require("pg");

let mainPool = null;

function createPool() {
	const pool = new Pool({
		user: process.env.POSTGRES_USER || "postgres",
		password: process.env.POSTGRES_PWD || "admin",
		host: process.env.POSTGRES_HOST || "localhost",
		port: process.env.POSTGRES_PORT || "5432",
		database: process.env.POSTGRES_DB || "mydatabase",
	});
	return pool;
}

function getPool() {
	if (!mainPool) {
		mainPool = createPool();
	}
	return mainPool;
}

module.exports = { getPool };
