import EventEmitter from 'eventemitter3';

type EventName = string;
type EventPayload = any;

class EventManager {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  // public method for emitting an event with a specified payload
  public emit(eventName: EventName, payload?: EventPayload): void {
    this.eventEmitter.emit(eventName, payload);
  }

  // public method for subscribing to an event with a specified payload
  public subscribe(
    eventName: EventName,
    listener: (payload?: EventPayload) => void
  ): void {
    this.eventEmitter.on(eventName, listener);
  }

  // public method for unsubscribing from an event
  public unsubscribe(
    eventName: EventName,
    listener: (payload?: EventPayload) => void
  ): void {
    this.eventEmitter.off(eventName, listener);
  }
}

export default EventManager;
