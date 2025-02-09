import { Subject } from "rxjs"

export interface Message {
	severity: "normal" | "warning" | "error"
	text: string
	timestamp: number
}

export class WebGlLog {
	private static log = new Subject<Message>()
	private static ms = new Subject<number>()

	public static info(text: string) {
		this.log.next({
			severity: 'normal',
			text,
			timestamp: Date.now()
		})
	}

	public static warning(text: string) {
		this.log.next({
			severity: 'warning',
			text,
			timestamp: Date.now()
		})
	}
	
	public static error(text: string) {
		this.log.next({
			severity: 'error',
			text,
			timestamp: Date.now()
		})
	}

	public static renderMs(ms: number) {
		this.ms.next(ms)
	}

	public static logObserver() {
		return this.log.asObservable()
	}

	public static renderMsObserver() {
		return this.ms.asObservable()
	}
}
