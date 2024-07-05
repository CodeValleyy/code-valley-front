
export const languages = [
    'python',
    'rust',
    'javascript',
    'lua',
];

export const getLanguageFromExtension = (extension: string): string => {
    switch (extension) {
        case 'py':
            return languages[0];
        case 'rs':
            return languages[1];
        case 'js':
            return languages[2];
        case 'lua':
            return languages[3];
        default:
            return languages[0];
    }
}

export const parseLanguageFromCodeUrl = (code: string): string => {
    const extension = code.split('.').pop()?.split('?')[0];
    switch (extension) {
        case 'py':
            return languages[0];
        case 'rs':
            return languages[1];
        case 'js':
            return languages[2];
        case 'lua':
            return languages[3];
        default:
            return languages[0];
    }
}

export const fetchRawContentFromUrl = async (code_url: string): Promise<string> => {
    try {
        const response = await fetch(code_url);
        if (!response.ok) {
            throw new Error(`Error fetching the content: ${response.statusText}`);
        }
        const rawContent = await response.text();
        return rawContent;
    } catch (error) {
        console.error('Error fetching raw content:', error);
        throw error;
    }
};
export const getExtensionFromContentType = (content_type: string): string => {
    switch (content_type) {
        case 'text/x-python':
            return '.py';
        case 'text/x-rustsrc':
            return '.rs';
        case 'text/javascript':
            return '.js';
        case 'text/x-lua':
            return '.lua';
        default:
            return '';
    }
}

export const getContent_type = (language: string): string => {
    switch (language) {
        case 'python':
            return 'text/x-python';
        case 'rust':
            return 'text/x-rustsrc';
        case 'javascript':
            return 'text/javascript';
        case 'lua':
            return 'text/x-lua';
        default:
            return 'text/plain';
    }
}

export const pythonBoilerplate = `def main():
    print("Hello, World!")\n
main()`;

export const rustBoilerplate = `fn main() {
    println!("Hello, World!");
}`;

export const javascriptBoilerplate = `console.log("Hello, World!");`;

export const luaBoilerplate = `print("Hello, World!")`;
