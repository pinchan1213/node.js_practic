const express = require('express');
const router = express.Router();
const http = require('http');
const parseString = require('xml2js').parseString;
const sqlite3 = require('sqlite3');

//データベースオブジェクトの取得
const db = new sqlite3.Database('db.db');

//GETアクセスの処理
router.get('/', (req, res, next) => {
    //データベースのシリアライズ
    let opt = {
        host: 'news.google.com',
        port: 443,
        path: '/rss?hl=ja&ie=UTF-8&oe=UTF-8&gl=jp&ceid=JP:ja'
    };

    http.get(opt, (res2) => {
        let body = '';
        res2.on('data', (data) => {
            body += data;
        });

        res2.on('end', () => {
            parseString(body.trim(), (err, result) => {
                console.log(result);
                let data = {
                    title: 'Google News',
                    content: result.rss.channe[0].item
                };
                res.render('hello', data);
            });
        });
    });
});

module.exports = router;