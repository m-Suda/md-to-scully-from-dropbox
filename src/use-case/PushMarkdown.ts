import { Dropbox } from '../domain/Dropbox';
import { SaveFile } from '../repository/SaveFile';
import { CommandExec } from '../domain/CommandExec';

export async function pushMarkdown() {
    try {
        console.log('Start Push Markdown Use-Case');

        const dropbox = new Dropbox();
        const { name, path_display: pathDisplay } = await dropbox.getAddedFile();
        const sharedLink = await dropbox.createSharedLink(pathDisplay);
        const fileData = await dropbox.getFileData(sharedLink);
        const savePath = await SaveFile.saveTextAsMarkdown(name, fileData);

        const commandExec = new CommandExec();
        commandExec.cp(savePath);
        commandExec.gitAdd();
        commandExec.gitCommit();
        commandExec.gitPush();
    } catch (e) {
        console.error(e);
        throw new Error('Markdownの取得に失敗');
    }
}
