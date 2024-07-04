export const languages = [
    'python',
    'rust',
    'javascript',
    'lua',
];

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

export const pythonBoilerplate = `def main():
    print("Hello, World!")\n
main()`;

export const rustBoilerplate = `fn main() {
    println!("Hello, World!");
}`;

export const javascriptBoilerplate = `console.log("Hello, World!");`;

export const luaBoilerplate = `print("Hello, World!")`;
