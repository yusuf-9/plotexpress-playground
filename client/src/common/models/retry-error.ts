export default class RetryError extends Error {
    public message: string;
    constructor(message: string) {
      super(message);
      this.message = message;
  
      // Set the prototype explicitly
      Object.setPrototypeOf(this, RetryError.prototype);
    }
  }
  