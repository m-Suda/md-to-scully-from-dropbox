import childProcess from 'child_process';
import { Dropbox } from '../domain/Dropbox';
import { SaveFile } from '../repository/SaveFile';

export async function pushMarkdown() {
    try {
        console.log('Start Push Markdown Use-Case');

        const dropbox = new Dropbox();
        const { name, path_display: pathDisplay } = await dropbox.getAddedFile();
        const sharedLink = await dropbox.createSharedLink(pathDisplay);
        const fileData = await dropbox.getFileData(sharedLink);
        const savePath = await SaveFile.saveTextAsMarkdown(name, fileData);

        const cpBlogResult = await childProcess
            .execSync(`cp ${savePath} ~/angular-scully-blog/blog/`)
            .toString();
        console.log(cpBlogResult);
        const gitPushBlogResult = await childProcess
            .execSync(`sh ~/angular-scully-blog/git-push.sh`)
            .toString();
        console.log(gitPushBlogResult);
    } catch (e) {
        console.error(e);
        throw new Error('Markdownの取得に失敗');
    }
}
