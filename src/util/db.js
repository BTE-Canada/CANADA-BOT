const Redis = require('ioredis')
const redis = new Redis({
    db: 6,
})
const CronJob = require('cron').CronJob
const { mysqlConnection2 } = require('../../config.json')
const mysql = require('mysql2')

async function db(client) {
    const con = mysql.createConnection({
        host: mysqlConnection2[0],
        user: mysqlConnection2[1],
        password: mysqlConnection2[2],
        database: mysqlConnection2[3],
        supportBigNumbers: true,
        flags: 'autoReconnect=true',
    })

    await con.connect((err) => {
        if (err) throw err
        console.log('Connected to local mysql!!!!')
    })

    client.con = con
    client.redis = redis

    const job = new CronJob(`1 1 */7 * * *`, function () {
        con.query('select * from road', (results) => {})
        console.log('refreshhshed!')
    })
    job.start()

    const result = await con
        .promise()
        .query(
            `select user_id, sum(points_total) as pointsTotal from submissions group by user_id`
        )

    await redis.flushdb()
    result[0].forEach((row) => {
        redis.zadd('leaderboard', parseFloat(row.pointsTotal), row.user_id)
    })
    console.log('db setup done!')
}

module.exports = db
