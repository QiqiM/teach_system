'use strict';

const mysql = require('mysql');
const config = require('../config/config.js');

var pool = mysql.createPool(config.mysql);
pool.query('select 1', (err, res) => {
    if (err) {
        throw err;
    }
})

let getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, conn) => {
            if(error){
                if (error.code == 'ECONNREFUSED') {
                    throw error;
                    return;
                }else{
                    reject(error);
                    return;
                }
            }
            resolve(conn);
        })
    })
}

class MysqlHelper {
    //返回多条记录
    static async row(sql, ...params) {
        params = dealParams(params);
        let connection = await getConnection();
        return new Promise(function (resolve, reject) {
            connection.query(sql, params, function (error, res) {
                connection.release();
                if (error) {
                    reject(error);
                    return;
                }
                resolve(res);
            });
        });
    }

    //返回一条记录
    static async first(sql, ...params) {
        params = dealParams(params);
        let connection = await getConnection();
        return new Promise(function (resolve, reject) {
            connection.query(sql, params, function (error, res) {
                connection.release();
                if (error) {
                    reject(error);
                    return;
                }
                resolve(res[0] || null);
            });
        });
    }

    //返回单个数据
    static async single(sql, ...params) {
        params = dealParams(params);
        let connection = await getConnection();
        return new Promise(function (resolve, reject) {
            connection.query(sql, params, function (error, res) {
                connection.release();
                if (error) {
                    reject(error);
                    return;
                }
                for (let i in res[0]) {
                    resolve(res[0][i]);
                    return;
                }
                resolve(null);
            });
        });
    }

    //执行sql返回原生对象
    static async execute(sql, ...params) {
        params = dealParams(params);
        let connection = await getConnection();
        return new Promise(function (resolve, reject) {
            connection.query(sql, params, function (error, res) {
                connection.release();
                if (error) {
                    reject(error);
                    return;
                }
                resolve(res);
            });
        });
    }
}

function dealParams(params) {
    if (params.length == 1 && typeof (params[0] == 'object')) {
        return params[0];
    } else {
        return params;
    }
}
module.exports = MysqlHelper;

