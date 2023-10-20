// expressオブジェクトの用意
const express = require('express');
//Applicationオブジェクトの作成
let app = express();
let router = express.Router();

//ルーティングの設定
app.get('/', (req, res) => {
    res.send('Welcome to Express!');
});

//待ち受けの設定
app.listen(3000, () => {
    console.log('Start Server port:3000');
});