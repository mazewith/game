import EventEmitter from "events";

/**
 * Abstract class for data services.
 */
export default class DataService extends EventEmitter {
  public addPlayerEvent = "addPlayer" as const;
  public playerMoveEvent = "playerMoveEvent" as const;

  constructor() {
    if (new.target === DataService) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    super();
  }
  connect() {
    throw new Error("Method not implemented.");
  }
  disconnect() {
    throw new Error("Method not implemented.");
  }
}
