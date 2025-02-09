import { useCallback, useEffect, useRef, useState } from "react"
import { Message, WebGlLog } from "../web-gl/models/WebGlLog"
import { rem, Text } from "@mantine/core"

import './LogBox.css'

function padStart(value: number) {
	if (value < 10) {
		return `0${value}`
	}

	return value;
}

function formatTime(date: Date) {
	const hours = padStart(date.getHours())
	const minutes = padStart(date.getMinutes())
	const seconds = padStart(date.getSeconds())

	return `${hours}:${minutes}:${seconds}`
}

export const WebGlLogBox = () => {
	const [messages, setMessages] = useState<Message[]>([])
	const [scrollToEnd, setScrollToEnd] = useState(true);
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const sub = WebGlLog.observer().subscribe({
			next: (message) => {
				setMessages((oldMessages) => [...oldMessages, message])
			},
		})

		return () => sub.unsubscribe()
	}, [])

	useEffect(() => {
		if (!ref.current || !scrollToEnd) {
			return;
		}

		ref.current.scrollTop = ref.current?.scrollHeight
	}, [messages, scrollToEnd])
	
	const onScroll = useCallback(() => {
		if (!ref.current) {
			return
		}

		const isBottom = ref.current.scrollHeight - ref.current.scrollTop === ref.current.clientHeight;
		setScrollToEnd(isBottom)
	}, [])

	return (
		<div ref={ref} className="logbox" onScroll={onScroll}>
			{messages.map((message) => {
				const date = new Date(message.timestamp)
				return (
					<div className={`logbox-line ${message.severity}`} key={`${message.text}-${message.timestamp}`}>
						<Text size={rem(10)} className="logbox-time">
							{formatTime(date)}
						</Text>
						<Text size={rem(10)} className="logbox-text">{message.text}</Text>
					</div>
				)
			})}
		</div>
	)
}
