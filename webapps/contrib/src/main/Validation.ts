export type Validator = (value: string) => void;

export function required(name: string): Validator {
    return (value: string) => {
        if (value == null || value.trim().length < 1) {
            throw Error(`${name} is required`);
        }
    };
}
