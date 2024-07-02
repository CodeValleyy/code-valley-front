import type { Content, Snippets } from "@/types";
import { reactive, ref, type Ref } from "vue";
import { useContentStore } from "@/stores/useContentStore";
import { useUserStore } from "@/stores/useUserStore";
import type { CreatePipelineDto, StepResultDto } from "@/types/Pipeline";
import { languages } from "@/config/languagesConfig";
import { Socket, io } from "socket.io-client";

export function usePipeline() {
    const contentStore = useContentStore();
    const userStore = useUserStore();

    const contents = ref(contentStore.contents as Content[]);
    const snippets = ref(contentStore.snippets as Snippets[])
    const form = ref(null);
    const formValid = ref(false)
    const initialInputType = ref('file')
    const initialInput = reactive<{ text: string | undefined, file: string | undefined }>({ text: '', file: undefined })


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
            { service: 'dyno-code', endpoint: 'execute', payload: { code: '', language: languages[0], input: undefined }, inputType: 'text' }
        ]
    })
    const results = ref<StepResultDto[]>([])
    const socket = io('wss://pipeline-orchestrator.code-valley.xyz')

    const rules = {
        required: (v: any) => !!v || 'Field is required'
    }

    const addStep = () => {
        if (form.value) {
            steps.steps.push({
                service: 'dyno-code',
                endpoint: 'execute',
                payload: { code: '', language: languages[0], input: undefined },
                inputType: 'text'
            });
        }
    };

    // This function is called when the form is submitted 
    // It sets the initial input for the first step and the outputs as inputs for subsequent steps
    const submitPipeline = () => {
        console.log('submitPipeline called');
        console.error('Submitting pipeline');

        if (form.value) {
            console.log('Form is valid');

            steps.steps[0].payload.input = initialInputType.value === 'text' ? initialInput.text : initialInput.file
            for (let i = 1; i < steps.steps.length; i++) {
                steps.steps[i].payload.input = results.value[i - 1]?.output
            }
            socket.emit('executePipeline', steps)
        } else {
            console.error('Form is not valid')
        }
    }

    const validateForm = () => {
        formValid.value = (initialInput.file !== undefined) &&
            steps.steps.every((step) => {
                const isValid = step.payload.language && step.payload.code;
                console.log(`Step ${JSON.stringify(step)}: ${isValid ? 'valid' : 'invalid'}`);
                return isValid;
            });
        console.log(`Form validation result: ${formValid.value}`);
    }

    return {
        contents,
        snippets,
        form,
        formValid,
        initialInputType,
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
