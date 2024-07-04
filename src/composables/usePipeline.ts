import type { Content, Snippets } from "@/types";
import { reactive, ref, watch, type Ref } from "vue";
import { useContentStore } from "@/stores/useContentStore";
import { useUserStore } from "@/stores/useUserStore";
import type { CreatePipelineDto, StepResultDto } from "@/types/Pipeline";
import { languages, parseLanguageFromCodeUrl } from "@/config/languagesConfig";
import { io } from "socket.io-client";

export function usePipeline() {
    const contentStore = useContentStore();
    const userStore = useUserStore();

    const contents = ref(contentStore.contents as Content[]);
    const snippets = ref(contentStore.snippets as Snippets[])

    watch(contentStore, (newVal) => {
        contents.value = newVal.contents;
        snippets.value = newVal.snippets;
    });


    const error = ref<string>('');

    const form = ref(null);
    const formValid = ref(false)
    const initialInput = ref<File | null>(null);

    if (userStore.user) {
        contentStore.fetchContentsByOwner(userStore.user.id).catch((error) => {
            console.error('Error fetching contents:', error);
        });
    } else {
        userStore.fetchUserProfile()
            .then((user) => {
                contentStore.fetchContentsByOwner(user.id).catch((error) => {
                    console.error('Error fetching contents:', error);
                });
            })
            .catch((error) => {
                console.error('Error fetching user profile:', error);
            });
    }

    const steps = reactive<CreatePipelineDto>({
        steps: [
            { service: 'dyno-code', endpoint: 'execute', payload: { code: '', language: languages[0], input_file: undefined } }
        ]
    })
    const results = ref<StepResultDto[]>([])
    const socket = io('wss://pipeline-orchestrator.code-valley.xyz')
    //const socket = io('ws://localhost:3000')
    const rules = {
        required: (v: any) => !!v || 'Field is required'
    }

    const addStep = () => {
        if (form.value) {
            steps.steps.push({
                service: 'dyno-code',
                endpoint: 'execute',
                payload: { code: '', language: languages[0], input_file: undefined },
            });
        }
    };

    const submitPipeline = async () => {
        if (form.value) {
            if (initialInput.value) {
                steps.steps[0].payload.input_file = await fileToBase64(initialInput.value);
            }
            for (let i = 1; i < steps.steps.length; i++) {
                steps.steps[i].payload.input_file = base64ToFileObject(results.value[i - 1]?.output_file_content, 'output');
            }
            socket.emit('executePipeline', steps);
        } else {
            console.error('Form is not valid');
        }
    };
    const validateForm = () => {
        formValid.value = (initialInput.value !== undefined) &&
            steps.steps.every((step) => {
                const isValid = !!step.payload.code;

                step.payload.language = parseLanguageFromCodeUrl(step.payload.code);
                console.log(`Step ${JSON.stringify(step)}: ${isValid ? 'valid' : 'invalid'}`);
                return isValid;
            });
    };
    const savePipeline = async () => {
        if (form.value) {
            if (initialInput.value) {
                steps.steps[0].payload.input_file = await fileToBase64(initialInput.value);
            }
            for (let i = 1; i < steps.steps.length; i++) {
                steps.steps[i].payload.input_file = base64ToFileObject(results.value[i - 1]?.output_file_content, 'output');
            }
            socket.emit('savePipeline', steps);
        } else {
            console.error('Form is not valid');
        }
    }
    function fileToBase64(file: File): Promise<{ name: string, data: string }> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ name: file.name, data: reader.result as string });
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };
    function base64ToFileObject(base64Data: string | undefined, fileName: string): { name: string, data: string } {
        return { name: fileName, data: base64Data ?? '' };
    }
    return {
        contents,
        snippets,
        error,
        form,
        formValid,
        initialInput,
        steps,
        results,
        addStep,
        submitPipeline,
        validateForm,
        socket,
        rules
    };


}
