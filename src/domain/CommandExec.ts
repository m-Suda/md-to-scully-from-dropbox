import childProcess from 'child_process';

export class CommandExec {
    private _targetRepository = '';

    public cp(savePath: string) {
        console.log('作成されたファイルをブログアプリにコピー');
        childProcess.execSync(`cp ${savePath} ~/angular-scully-blog/blog/`);
    }

    public gitAdd() {
        console.log('ブログアプリのリポジトリでgit add');
        childProcess.execSync(
            `git --work-tree=${this._targetRepository} --git-dir=${this._targetRepository}/.git add ${this._targetRepository}/blog/.`
        );
    }

    public gitCommit() {
        console.log('ブログアプリのリポジトリでgit commit');
        childProcess.execSync(
            `git --work-tree=${this._targetRepository}/ --git-dir=${this._targetRepository}/.git commit -b "Create new article with Type and Push from API Server"`
        );
    }

    public gitPush() {
        console.log('ブログアプリのリポジトリでgit push');
        childProcess.execSync(
            `git --work-tree=${this._targetRepository}/ --git-dir=${this._targetRepository}/.git push`
        );
    }
}
