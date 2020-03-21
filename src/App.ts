import express from 'express';
import * as bodyParser from 'body-parser';
import { HttpStatusCode } from './constants/HttpStatusCode';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config() {
        this.app.use(bodyParser.json());

        const router = express.Router();
        router.get('/hearthcheck', (req, res) => {
            return res.status(HttpStatusCode.OK).send({ message: 'API OK' });
        });
        router.get('/webhook', (req, res) => {
            const { challenge } = req.params;
            res.set({
                'Content-Type': 'text/plain',
                'X-Content-Type-Options': 'nosniff',
            });
            return res.status(HttpStatusCode.OK).send(challenge);
        });
        router.post('/', (req, res) => {
            // Receiving notifications Requestからアカウントを取得する
            const { body } = req;
            console.log(`Request body: ${JSON.stringify(body)}`);

            // 次に /files/list_folder/continue を呼び出して変更があったファイルを取得する

            // ファイル情報を取得したら files/download を呼び出してファイル内容を取得する

            // そのファイルをサーバーのどこかに保存する

            // 最後にシェルスクリプトを実行する
            //   シェルスクリプトの中身
            //     angular-scully-appのblogディレクトリにコピーする
            //     git addする
            //     git commitする
            //     git pushする
        });

        this.app.use('/', router);
    }
}

export default new App().app;
