export interface Content {
    id: string;
    code_url: string;
    content_type: string;
    file_hash: string;
    file_path: string;
    file_size: number;
    filename: string;
    owner_id: number;
    update_time: string;
    upload_time: string;
}

export interface ContentRaw {
    _id: {
        $oid: string;
    };
    code_url: string;
    content_type: string;
    file_hash: string;
    file_path: string;
    file_size: number;
    filename: string;
    owner_id: number;
    update_time: string;
    upload_time: string;
}

export interface Snippets {
    id: string;
    owner_id: number;
    filename: string;
    code: string;
    language: string;
}
