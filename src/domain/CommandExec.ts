import childProcess from 'child_process';

export class CommandExec {
    private _targetRepository = '';

    public cp(savePath: string) {
        childProcess.execSync(`cp ${savePath} ~/angular-scully-blog/blog/`);
    }

    public gitAdd() {
        childProcess.execSync(
            `git --work-tree=${this._targetRepository} --git-dir=${this._targetRepository}/.git add ${this._targetRepository}/blog/.`
        );
    }

    public gitCommit() {
        childProcess.execSync(
            `git --work-tree=${this._targetRepository}/ --git-dir=${this._targetRepository}/.git commit -b "Create new article with Type and Push from API Server"`
        );
    }

    public gitPush() {
        childProcess.execSync(
            `git --work-tree=${this._targetRepository}/ --git-dir=${this._targetRepository}/.git push`
        );
    }
}
