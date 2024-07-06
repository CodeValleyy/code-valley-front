import { defineStore } from "pinia";
import axiosInstance from "@/config/axiosInstance";
import type { Content, ContentRaw, Snippets } from "@/types";
import { getLanguageFromFilename } from "@/config/languagesConfig";

const endpoint = "/content";
export const useContentStore = defineStore('content', {
    state: () => ({
        contents: [] as Content[],
        contentRaw: [] as ContentRaw[],
        snippets: [] as Snippets[]
    }),
    actions: {
        async fetchContentsByOwner(ownerId: number) {
            try {
                const response = await axiosInstance.get(`${endpoint}/owner/${ownerId}`);
                this.contentRaw = response.data;
                this.contents = this.contentRaw.map((content) => {
                    return {
                        id: content._id.$oid,
                        code_url: content.code_url,
                        content_type: content.content_type,
                        file_hash: content.file_hash,
                        file_path: content.file_path,
                        file_size: content.file_size,
                        filename: content.filename,
                        owner_id: content.owner_id,
                        update_time: content.update_time,
                        upload_time: content.upload_time
                    };
                });

                this.snippets = this.contents.map((content) => {
                    return {
                        id: content.id,
                        owner_id: content.owner_id,
                        filename: content.filename,
                        code: content.code_url,
                        language: getLanguageFromFilename(content.filename)
                    };
                });
            } catch (error) {
                console.error('Error fetching contents:', error);
            }
        },
        async fetchContentById(contentId: string) {
            try {
                const response = await axiosInstance.get(`${endpoint}/${contentId}`);
                this.contents = response.data;
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        },
        async uploadProgram(file: File) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                await axiosInstance.post(`${endpoint}/upload`, formData);
            } catch (error) {
                console.error('Error uploading program:', error);
            }
        }
    }
});