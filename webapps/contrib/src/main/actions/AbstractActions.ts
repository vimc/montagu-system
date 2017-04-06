import Alt = require("alt");

export abstract class AbstractActions implements AltJS.ActionsClass {
  constructor(alt:AltJS.Alt) {

  }
  dispatch: (...payload: Array<any>) => void;
}