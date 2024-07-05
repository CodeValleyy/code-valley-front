import { defineStore } from "pinia";
import type { Pipeline, PipelineRaw, SavePipelineDto, Snippets } from "@/types";
import pipelineAxiosInstance from "@/config/pipelineAxiosInstance";

const endpoint = "/pipeline";
export const usePipelineStore = defineStore('pipeline', {
    state: () => ({
        pipelines: [] as Pipeline[],
        pipelineRaw: [] as PipelineRaw[],
    }),
    actions: {
        async fetchPipelineById(id: string) {
            try {
                const response = await pipelineAxiosInstance.get(`${endpoint}/${id}`);
                this.pipelineRaw = response.data;
                this.pipelines = this.pipelineRaw.map((pipeline) => {
                    return {
                        id: pipeline._id.$oid,
                        owner_id: pipeline.owner_id,
                        name: pipeline.name,
                        description: pipeline.description,
                        steps: pipeline.steps,
                        created_date: pipeline.created_date
                    };
                });
            } catch (error) {
                console.error('Error fetching contents:', error);
            }
        },
        async fetchPipelineByOwner(ownerId: number) {
            try {
                const response = await pipelineAxiosInstance.get(`${endpoint}/owner/${ownerId}`);
                this.pipelineRaw = response.data;
                this.pipelines = this.pipelineRaw.map((pipeline) => {
                    return {
                        id: pipeline._id.$oid,
                        owner_id: pipeline.owner_id,
                        name: pipeline.name,
                        description: pipeline.description,
                        steps: pipeline.steps,
                        created_date: pipeline.created_date
                    };
                });

            } catch (error) {
                console.error('Error fetching contents:', error);
            }
        },
        async getPipelineList() {
            try {
                const response = await pipelineAxiosInstance.get(`${endpoint}/list`);
                this.pipelineRaw = response.data;
                this.pipelines = this.pipelineRaw.map((pipeline) => {
                    return {
                        id: pipeline._id.$oid,
                        owner_id: pipeline.owner_id,
                        name: pipeline.name,
                        description: pipeline.description,
                        steps: pipeline.steps,
                        created_date: pipeline.created_date
                    };
                });
                console.log(this.pipelines);
            } catch (error) {
                console.error('Error fetching contents:', error);
            }
        },
        async savePipeline(savePipelineDto: SavePipelineDto) {
            try {
                await pipelineAxiosInstance.post(`${endpoint}/save`, savePipelineDto);
            } catch (error) {
                console.error('Error saving pipeline:', error);
            }
        },
        async deletePipeline(pipelineId: string) {
            try {
                await pipelineAxiosInstance.delete(`${endpoint}/${pipelineId}`);
                this.pipelines = this.pipelines.filter((pipeline) => pipeline.id !== pipelineId);
            } catch (error) {
                console.error('Error deleting pipeline:', error);
            }
        }
    }
});