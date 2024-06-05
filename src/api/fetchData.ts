import axiosInstance from "@/config/axiosInstance";
import type { ExecuteCodeRequest, ExecuteCodeResponse } from "@/types";

export async function fetchData(requestDto: ExecuteCodeRequest): Promise<string> {
    const endpoint = 'execute';
    try {
        const response = await axiosInstance.post(`/code/${endpoint}`, requestDto);

        if (response.status !== 201) {
            throw new Error('Network response was not ok');
        }

        const responseData: ExecuteCodeResponse = response.data;

        if (responseData.error && responseData.error !== '') {
            throw new Error(responseData.error);
        }

        return responseData.output;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
