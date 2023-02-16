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

	let [notificationStats] = await con.execute(`
		SELECT DATE_FORMAT(notificationDate, '%Y-%m-%d') AS notification_date, network, COUNT(*) AS notification_count 
		FROM notifications 
		WHERE notificationDate >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
		GROUP BY notification_date, network
	`);
	
	let [addressStats] = await con.execute(`
		SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') AS created_date, network, COUNT(*) AS address_count 
		FROM addresses 
		WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
		GROUP BY created_date, network
	`);

	return { 
		"addresses": res[0], 
		"addressesDailyStats": addressStats,
		"notifications": notis[0][0].c, 
		"notificationsDailyStats": notificationStats
	};
}
