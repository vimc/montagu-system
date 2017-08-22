export type Validator = (value: string) => void;

export function multi(name: string, children: Array<(name: string) => Validator>): Validator {
    return (value: string) => {
        children.forEach(child => {
            child(name)(value);
        });
    };
}

export function required(name: string): Validator {
    return (value: string) => {
        if (value == null || value.trim().length < 1) {
            throw Error(`${name} is required`);
        }
    };
}

export function usernameFormat(name: string): Validator {
    const pattern = /^[a-z]+(\.[a-z]+)*$/;
    return (value: string) => {
        if (value && !pattern.test(value)) {
            throw Error(
                `${name} must be in the format 'something.something'. ` +
                "It must be lowercase, and only consist of letters and full stops."
            );
        }
    }
}
