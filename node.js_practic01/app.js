//httpにアクセスする
const http = require('http');
//ファイルの読み込み
const fs = require('fs');
//ejsオブジェクトの読み込み
const ejs = require('ejs');
const url = require('url');
const qs = require('querystring');

//テンプレートファイルの読み込み(同期処理)
const index_page = fs.readFileSync('./index.ejs', 'utf-8');
//テンプレートファイルの読み込み（同期処理）
const style_css = fs.readFileSync('./style.css', 'utf-8');
//テンプレートファイルの読み込み（同期処理）
const other_page = fs.readFileSync('./other.ejs', 'utf-8');

//getFormClientの呼び出し
let server = http.createServer(getFormClient);

server.listen(3001);
console.log('Server Start!');

//createServerの処理
function getFormClient(request, response) {
    let url_parts = url.parse(request.url, true);
    
    switch (url_parts.pathname) {

        case '/':
            response_index(request, response);
            break;
        
        case '/other':
            response_other(request, response);
            break;
        
        case '/style.css':
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(style_css);
            response.end();
            break;
        

            default:
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('No page');
            break;
    }
}

let data = { msg: 'no message...' };
//indexへのアクセス処理
function response_index(request, response) {
    //POSTアクセスの処理
    if (request.method == 'POST') {
        let body = '';

        //データ受信のイベント処理
        request.on('data', (data) => {
            body += data;
        });

        //データ受信終了のイベント処理
        request.on('end', () => {
            data = qs.parse(body);//データのパース
            //クッキーの保存
            setCookie('msg', data.msg, response);
            write_index(request, response);
        });
    } else {
        write_index(request, response);
    }

    //indexのページ作成
    function write_index(request, response) {
        let msg = '伝言を作成します。';
        let cookie_data = getCookie('msg', request);
        let content = ejs.render(index_page, {
            title: "index",
            content: msg,
            data: data,
            cookie_data: cookie_data,
        });

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(content);
        response.end();
    }

    //クッキーの値を設定
    function setCookie(key,value,response) {
        let cookie = escape(value);
        response.setHeader('Set-Cookie', [key + '=' + cookie]);
    }

    //クッキーの値を取得
    function getCookie(key, request) {
        //変数  ＝  条件  ?  値1  :  値2 ;
        cookie_data = request.headers.cookie != undefined ? request.headers.cookie : '';
        let data = cookie_data.split(';');

        for (let i in data) {
            if (data[i].trim().startsWith(key + '=')) {
                let result = data[i].trim().substring(key.length + 1);
                return unescape(result);
                }
        }
        return '';
    }
}

//otherへのアクセス処理
function response_other(request, response) {
    let msg = "これはotherのページです。"

    //postアクセス時の処理
    if(request.method == 'POST'){
    let body = '';

    //データ受信のイベント処理
    request.on('data', (data) => {
        body += data;
    });
        

    //データ受信終了時のイベント処理
    request.on('end', () => {
        let post_data = qs.parse(body);//データのパース
        msg += 'あなたは「' + post_data.msg + '」と書きました。';
        content = ejs.render(other_page, {
            title: "Other",
            content: msg,
        });
        response.writeHead(200, { 'Content-type': 'text/html' });
        response.write(content);
        response.end();
    });
    //Getアクセス時の処理
}else {
    msg = "ページがありません。"
    content = ejs.render(other_page, {
        title: "Other",
        content: msg,
    });
        response.writeHead(200, { 'Content-type': 'text/html' });
        response.write(content);
        response.end();
    }
}

// //createServerの処理
// function getFormClient(request, response) {
//     let content = ejs.render(index_page, {
//         title: "Indexページ",
//         content:"これはサンプルページです。",
//     });
//     response.writeHead(200, { 'Content-Type': 'text/html' });
//     response.write(content);
//     response.end();
// }

// //createServerの処理
// function getFormClient(req, res) {
//     request = req;
//     response = res;
//     //indexファイルの読み込み(非同期)
//     fs.readFile('./index.html', 'utf-8',
//         (error, data) => {
//             response.writeHead(200, { 'Content-Type': 'text/html' });;
//             response.write(data);
//             response.end();
//     }
//     )
// }

// let server = http. createServer(
//     (request, response) => {
//         response.setHeader('Content-Type', 'text/html');
//         response.write('<!DOCTYPE html><html lang="ja">');
//         response.write('<head><meta charset="utf-8">');
//         response.write('<title>Hello</title>');
//         response.write('<body><h1>Hello Node.js</h1>');
//         response.write('<p>This is Node,js sample page.</p>');
//         response.write('<p>これはNode.jsのサンプルページです。</p>');
//         response.write('</body></html>');
//         response.end('<html><body><h1>Hello</h1><p>Welcome to node.js</p></body></html>');
//         response.end('Hello Node.js');
//         response.end();//処理修了

//     }
// );

//httpサーバーを作成
// let server = http.createServer(
//     (request, response) => {
//         //index.htmlファイルの読み込み
//         fs.readFile('./index.html', 'utf-8',
//             (error, data) => {
//                 response.writeHead(200, { 'Content-Type': 'text/html' });
//                 response.write(data);
//                 response.end();
//             });
//     }
// );

            // let content = "これはindexページです。";
            // let query = url_parts.query;
            // if (query.msg != undefined) {
            //     content += 'あなたは、「'+ query.msg + '」と送りました。';
            // }

            // content = ejs.render(index_page, {
            //     title: "Index",
            //     content: content,
            // });

            // response.writeHead(200, { 'Content-type': 'text/html' });
            // response.write(content);
// response.end();
            
        //     content = ejs.render(other_page, {
        //         title: "other",
        //         content: content,
        //     });
        //     response.writeHead(200, { 'Content-Type': 'text/html' });
        //     response.write(content);
        //     response.end();