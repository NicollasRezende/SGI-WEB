const { Pool } = require('pg');

const pool = new Pool({
    connectionString:
        'postgres://postgres:ObombuIqFbFEWQnmyIPDBmHZAkthCUxy@junction.proxy.rlwy.net:44940/railway',
});

module.exports = pool;
