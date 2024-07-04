import { defineStore } from "pinia";
import axiosInstance from "@/config/axiosInstance";
import type { Content, Snippets } from "@/types";

const endpoint = "/content";
export const useContentStore = defineStore('content', {
    state: () => ({
        contents: [] as Content[],
        snippets: [] as Snippets[]
    }),
    actions: {
        async fetchContentsByOwner(ownerId: number) {
            try {
                const response = await axiosInstance.get(`${endpoint}/owner/${ownerId}`);
                this.contents = response.data;
                this.snippets = this.contents.map((content) => {
                    return {
                        id: content.id,
                        filename: content.filename,
                        code: content.code_url
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
        }
    }
});