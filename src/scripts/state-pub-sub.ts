type Subscriber = {
	subscriberId: string;
	callback: Function;
};

type Subscribers = {
	[key: string]: Subscriber[];
};

export class StatePubSub<T> {
	subscribers: Subscribers = {};
	state: T;

	constructor(initialState: T) {
		this.state = initialState;
	}

	// TODO: Add unsubscribe, will need to pass key and subscriber id

	subscribe(key: string, callback: Function): string {
		if (!this.subscribers[key]) {
			this.subscribers[key] = [];
		}
		const subscriberId = `${key}:${this.subscribers[key].length}`;
		this.subscribers[key].push({ subscriberId, callback });

		return subscriberId;
	}

	publish(key: string): void {
		this.subscribers[key]?.forEach((subscription) => {
			subscription.callback(this.state[key]);
		});
	}

	// Make this only allow setting keys that exist in initial state
	// How to not let the value by any?  Needs to be barcode info
	setKey<K extends keyof T>(key: string, value: T[K]) {
		if (typeof value === "string") {
			this.state[key] = value;
		}

		if (typeof value === "object") {
			this.state[key] = {
				// TODO: if this is null does something need to be fixed???
				...this.state[key],
				...value,
			};
		}
		this.publish(key);
	}

	getKey<K extends keyof T>(key: K) {
		return this.state[key];
	}
}
