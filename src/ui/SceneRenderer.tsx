import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
	useState,
} from "react"
import { Scene as GlScene } from "../web-gl/models/Scene"
import { useDebouncedCallback } from "@mantine/hooks"

interface HelloWorldSceneProps {
	onGlContext: (
		canvas: HTMLCanvasElement,
		gl: WebGL2RenderingContext
	) => GlScene

	aspectRatio?: number
	fullscreen?: boolean
}

export const SceneRenderer = forwardRef<HTMLDivElement, HelloWorldSceneProps>(
	({ onGlContext, aspectRatio, fullscreen }, ref) => {
		const canvasRef = useRef<HTMLCanvasElement>(null)
		const sceneRef = useRef<GlScene>(null)
		const containerRef = useRef<HTMLDivElement>(null)
		const [{ width, height }, setDimensions] = useState({
			width: 0,
			height: 0,
		})

		const resize = useDebouncedCallback(() => {
			const maxWidth = containerRef.current?.offsetWidth ?? 0
			const maxHeight = containerRef.current?.offsetHeight ?? 0

			if (maxHeight === 0 || maxWidth === 0) {
				return
			}

			if (!aspectRatio || aspectRatio === 0) {
				setDimensions({ width: maxWidth, height: maxHeight })
				return
			}

			const widthFromAr = maxHeight * aspectRatio
			const heightFromAr = maxWidth / aspectRatio

			if (widthFromAr > maxWidth) {
				setDimensions({
					width: maxWidth,
					height: heightFromAr,
				})

				return
			}

			setDimensions({
				width: widthFromAr,
				height: maxHeight,
			})
		}, 500)

		useImperativeHandle(ref, () => containerRef.current!, [])

		useLayoutEffect(() => {
			resize()
		}, [resize])

		useEffect(() => {
			resize()
		}, [fullscreen, resize])

		useEffect(() => {
			const canvas = canvasRef.current
			if (!canvas) {
				console.warn("Canvas is null")
				return
			}

			const gl = canvas.getContext("webgl2")
			if (!gl) {
				console.warn("Gl is null")
				return
			}

			const scene = onGlContext(canvas, gl)
			sceneRef.current = scene

			scene.start()

			return () => scene.stop()
		})

		useEffect(() => {
			if (!containerRef.current) return
			const resizeObserver = new ResizeObserver(() => {
				resize()
			})
			resizeObserver.observe(containerRef.current)
			return () => resizeObserver.disconnect() // clean up
		}, [])

		return (
			<div
				ref={containerRef}
				style={{
					width: "100%",
					height: "100%",
					alignItems: "center",
					alignContent: "center",
				}}
			>
				{width !== 0 && height !== 0 && (
					<canvas
						style={{
							boxShadow: "0px 0px 5px 3px rgba(0,0,0,0.48)",
						}}
						ref={canvasRef}
						width={width}
						height={height}
					/>
				)}
			</div>
		)
	}
)
