import { createAxiosInstance } from "@/config/axiosInstance";
import type { ExecuteCodeResponse } from "@/types";

export async function fetchData(requestDto: FormData): Promise<string> {
    const endpoint = 'execute';
    const axiosInstance2 = createAxiosInstance();

    for (const pair of requestDto.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
        const response = await axiosInstance2.post(`/code/${endpoint}`, requestDto, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

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
