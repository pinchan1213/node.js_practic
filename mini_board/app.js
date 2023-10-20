const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs','utf-8');
const login_page = fs.readFileSync('./login.ejs', 'utf-8');

//最大保管数
const max_num = 10;

//データファイル名
const filename = 'mydata.txt';

//データ
let message_data;
readFromFile(filename);

let server = http.createServer(getFromClient);

server.listen(3000);
console.log('サーバーに接続します。');

//createServerの処理
function getFromClient(request,response) {
    let url_parts = url.parse(request.url, true);
    switch (url_parts.pathname) {
        
        //トップページ
        case '/':
            response_index(request, response);
            break;
        
        //ログインページ
        case '/login':
            response_login(request, response);
            break;
        
        default:
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('no page...');
            break;
    }
}

//loginのアクセス処理
function response_login(request, response) {
    let content = ejs.render(login_page, {});
    response.writeHead(200, { 'Content-type': 'text/html' });
    response.write(content);
    response.end();
}

//indexのアクセス処理
function response_index(request, response) {
    
    //POSTアクセスの処理
    if (request.method == 'POST') {
        let body = '';

        //データ受信のアクセス処理
        request.on('data', function (data) {
            body += data;
        });

        //データ受信修了の処理
        request.on('end', function () {
            data = qs.parse(body);
            addToData(data.id, data.msg, filename, request);
            write_index(request, response);
        });
    } else {
        write_index(request, response);
    }
}

//indexページ作成
function write_index(request, response) {
    let msg = '何かメッセージを書いてください。';
    let content = ejs.render(index_page, {
        title: 'index',
        content: msg,
        data: message_data,
        filename: 'data_item',
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(content);
    response.end();
}

//テキストファイルをロード
function readFromFile(fname) {
    fs.readFile(fname, 'utf8', (err, data) => {
        message_data = data.split('\n');
    });
}

//データを更新
function addToData(id, msg, fname, request) {
    let obj = { 'id': id, 'msg': msg };
    //stringifyオブジェクトをテキストに変換する
    let obj_str = JSON.stringify(obj);
    console.log('add data:' + obj_str);
    //unshift  配列の最初に値を追加する「最後に追加したのが最初に追加される」
    message_data.unshift(obj_str);
    if (message_data.length > max_num) {
        message_data.pop();
    }
    saveToFile(fname);
}

//データを保存
function saveToFile(fname) {
    let data_str = message_data.join('\n');
    fs.writeFile(fname, data_str, (err) => {
        if (err) { throw err; }
    });
}