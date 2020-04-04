import express from 'express';
import * as bodyParser from 'body-parser';
import * as nodeFetch from 'node-fetch';
import { HttpStatusCode } from './constants/HttpStatusCode';
import { pushMarkdown } from './use-case/PushMarkdown';

(global as any).fetch = nodeFetch;

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
        router.get('/', (req, res) => {
            const { challenge } = req.query;
            res.set({
                'Content-Type': 'text/plain',
                'X-Content-Type-Options': 'nosniff',
            });
            return res.status(HttpStatusCode.OK).send(challenge);
        });
        router.post('/', async (req, res) => {
            try {
                console.log('Start Push Markdown');
                await pushMarkdown();
                return res.status(200).send('Markdownの追加に成功');
            } catch (e) {
                console.error(e);
                return res.status(500).send('Markdownの追加に失敗');
            } finally {
                console.log('End Push Markdown');
            }
        });

        this.app.use('/', router);
    }
}

export default new App().app;
