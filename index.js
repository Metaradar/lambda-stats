// metaradar.io | STats Lambda function
// This file is part of the metardar.io project.
// Author: Ralph Kuepper
// Contact: info@metaradar.io
// License: MIT

const mysql = require('mysql2/promise');

exports.handler = async function (event, context) {

	var con = await mysql.createConnection({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DB
	});

	var sql = "SELECT COUNT(*) as count, network FROM addresses WHERE confirmed = 1 GROUP BY network ";

	let res = await con.execute(sql, []);

	let notis = await con.execute("SELECT COUNT(id) as c FROM notifications");

	return { "addresses": res[0], "notifications": notis[0][0].c };
}