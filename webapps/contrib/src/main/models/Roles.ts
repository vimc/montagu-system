export interface Role {
    name: string;
    scope: Scope;
}

export interface Scope {
    prefix: string;
    id: string;
}

function parseScope(raw: string): Scope {
    if (raw == "*") {
        return {
            prefix: "*",
            id: undefined
        };
    } else {
        const parts = raw.split(":");
        return {
            prefix: parts[ 0 ],
            id: parts[ 1 ]
        };
    }
}

export function parseRole(raw: string): Role {
    const parts = raw.split("/");
    return {
        name: parts[ 1 ],
        scope: parseScope(parts[ 0 ])
    }
}