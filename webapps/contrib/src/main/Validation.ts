type validator = (value: string) => void;

export function required(name: string): validator {
    return (value: string) => {
        if (value.trim().length < 1) {
            throw Error(`${name} is required`);
        }
    };
}
