import Alt = require("alt");
import { Result } from '../Models';

export abstract class AbstractActions implements AltJS.ActionsClass {
  constructor(alt:AltJS.Alt) {

  }
  dispatch: (...payload: Array<any>) => void;

  // Note that despite the more specialized FetchActions class,
  // I have left this method here, as we can still make use of this
  // even if we can't inherit FetchActions due to single-inheritance constraints
  handleResponse(promise: Promise<Response>, success: (data: any) => void, failure: (message: string) => void): void {
      promise.then((response: Response) => {
            return response.json();
        })
        .then((response: any) => {
            const apiResponse = <Result>response;
            switch (apiResponse.status)
            {
                case "success":
                    success(apiResponse.data);
                    break;
                case "failure":
                    failure(apiResponse.errors[0].message);
                    break;
                default:
                    failure("The server response was not correctly formatted: " + response.toString());
            }
        })
        .catch((errorMessage: string) => {
            failure(errorMessage);
        });
    }
}