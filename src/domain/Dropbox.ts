import dropbox from 'dropbox';
import { AccessToken } from '../constants/AccessToken';

import FileMetadataReference = DropboxTypes.files.FileMetadataReference;
import FolderMetadataReference = DropboxTypes.files.FolderMetadataReference;
import DeletedMetadataReference = DropboxTypes.files.DeletedMetadataReference;

export class Dropbox {
    private _dropbox: DropboxTypes.Dropbox;

    constructor() {
        this._dropbox = new dropbox.Dropbox({ accessToken: AccessToken });
    }

    /**
     * 追加されたファイルを取得する。
     */
    public async getAddedFile(): Promise<FileMetadataReference> {
        console.log(`Request to dropboxAPI POST /files/list_folder`);
        const { entries, cursor, has_more: hasMore } = await this._dropbox.filesListFolder({
            path: '',
        });
        if (!hasMore) {
            const latestFile = this.getLatestFile(entries);
            console.log(`GetAddedFile OK: [latestFile: ${JSON.stringify(latestFile)}]`);
            return latestFile;
        }

        const nextEntries = await this.getLastEntries(cursor);
        const latestFile = this.getLatestFile(nextEntries);
        console.log(`GetAddedFile OK: [latestFile: ${JSON.stringify(latestFile)}]`);
        return latestFile;
    }

    /**
     * そのファイルの共有リンクを作成する。
     * ※既に存在する場合はそのリンクを取得する。
     * @param path
     */
    public async createSharedLink(path?: string): Promise<string> {
        if (!path) {
            throw new Error('共有リンクを作成する元のパスが存在しません');
        }
        try {
            console.log(`Request to dropboxAPI POST /sharing/create_shared_link_with_settings`);
            const { url } = await this._dropbox.sharingCreateSharedLinkWithSettings({ path });
            if (!url) {
                throw new Error('共有リンクの作成に失敗しました');
            }
            console.log(`CreateSharedLink OK: [url: ${url}]`);
            return url;
        } catch (e) {
            const { error } = e;
            const { error: inError } = error;
            console.log(`Error in createSharedList: ${inError['.tag']}`);
            if (inError['.tag'] === 'shared_link_already_exists') {
                console.log(`既存の共有リンクを取得`);
                const url = await this.getSharedLinks(path);
                console.log(`GetSharedLink OK: [url: ${url}]`);
                return url;
            }
            console.error(e);
            throw new Error('共有リンクの取得に失敗しました');
        }
    }

    /**
     * 既に作成されている共有リンクを取得する。
     * @param filePath
     */
    private async getSharedLinks(filePath: string): Promise<string> {
        console.log(`Request to dropboxAPI POST /sharing/list_shared_links`);
        const { links } = await this._dropbox.sharingListSharedLinks({ path: filePath });
        const linkData = links.find(link => link['.tag'] === 'file');
        if (!linkData) {
            throw new Error(`FilePath: ${filePath} の共有リンクが取得できませんでした`);
        }
        console.log(`GetListSharedLinks OK: [url: ${linkData.url}]`);
        return linkData.url;
    }

    /**
     * 共有リンクからファイルのデータを取得する。
     * @param sharedLink
     */
    public async getFileData(
        sharedLink: string
    ): Promise<
        | DropboxTypes.sharing.FileLinkMetadataReference
        | DropboxTypes.sharing.FolderLinkMetadataReference
        | DropboxTypes.sharing.SharedLinkMetadataReference
    > {
        console.log(`Request to dropboxAPI POST /sharing/get_shared_link_file`);
        const data = await this._dropbox.sharingGetSharedLinkFile({ url: sharedLink });
        console.log(`GetSharedLinkFile OK`);
        return data;
    }

    /**
     * Folderの最後までファイルを確認しに行く。
     * @param cursor
     */
    private async getLastEntries(
        cursor: string
    ): Promise<Array<FileMetadataReference | FolderMetadataReference | DeletedMetadataReference>> {
        let nextCursor = cursor;
        let nextEntries: Array<
            FileMetadataReference | FolderMetadataReference | DeletedMetadataReference
        > = [];
        const toTheLast = true;
        while (toTheLast) {
            console.log(`Request to dropboxAPI POST /files/list_folder/continue`);
            const {
                entries,
                cursor: next,
                has_more: hasMore,
            } = await this._dropbox.filesListFolderContinue({
                cursor: nextCursor,
            });
            if (!hasMore) {
                nextEntries = entries;
                break;
            }
            nextCursor = next;
        }
        return nextEntries;
    }

    /**
     * 最新の追加ファイルを取得する。
     * @param entries
     */
    private getLatestFile(
        entries: Array<FileMetadataReference | FolderMetadataReference | DeletedMetadataReference>
    ): FileMetadataReference {
        const onlyAddedFiles = entries.filter(
            entry => entry['.tag'] === 'file'
        ) as FileMetadataReference[];
        return onlyAddedFiles[onlyAddedFiles.length - 1];
    }
}
