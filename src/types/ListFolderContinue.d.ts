export type ListFolderContinue = {
    entries: Entries[];
    cursor: string;
    has_more: boolean;
};

export type Entries = {
    '.tag': string;
    name: string;
    path_lower: string;
    path_display: string;
    id?: string;
    client_modified?: string;
    server_modified?: string;
    rev?: string;
    size?: number;
    is_downloadable?: boolean;
    content_hash?: string;
};
