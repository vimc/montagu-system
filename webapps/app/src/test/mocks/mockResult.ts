import { ErrorInfo, Result, ResultStatus } from "../../main/shared/models/APITypes";

export function mockResult<T>(data: T,
                              errors?: Array<ErrorInfo>,
                              status?: ResultStatus): Result {
    errors = errors || [];
    status = status || "success";

    return { data, errors, status };
}

export function mockError(code: string, message: string): ErrorInfo {
    return { code, message };
}

