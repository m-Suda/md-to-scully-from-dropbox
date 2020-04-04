import fs from 'fs';
import path from 'path';

export class SaveFile {
    public static async saveTextAsMarkdown(
        fileName: string,
        data:
            | DropboxTypes.sharing.FileLinkMetadataReference
            | DropboxTypes.sharing.FolderLinkMetadataReference
            | DropboxTypes.sharing.SharedLinkMetadataReference
    ): Promise<string> {
        console.log('Save text as markdown start');
        try {
            const fileNameExtension = path.extname(fileName);
            const fileNameWithoutExtension = path
                .basename(fileName, fileNameExtension)
                .replace(/\s+/g, '_');
            const fileNameWithMarkdown = `${fileNameWithoutExtension}.md`;
            const saveDirectory = path.resolve(__dirname, '../../files');
            const savePath = `${saveDirectory}/${fileNameWithMarkdown}`;
            fs.writeFileSync(savePath, (data as any).fileBinary, { encoding: 'binary' });
            console.log(`Save text as markdown success: ${savePath}`);
            return savePath;
        } catch (e) {
            console.error(e);
            throw new Error('ファイルの保存に失敗しました');
        }
    }
}
