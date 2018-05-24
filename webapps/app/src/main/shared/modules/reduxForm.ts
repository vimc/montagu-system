export const validations = {
    required: (value: string) => (value
        ? undefined
        : ' is required'),
    email: (value: string) => (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? ' is invalid'
        : undefined),
    username: (value: string) => (value && !/^[a-z]+(\.[a-z]+)*$/.test(value)
        ? `${name} must be in the format 'something.something'. It must be lowercase, and only consist of letters and full stops.`
        : undefined)

}

