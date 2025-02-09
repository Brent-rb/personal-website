import { createFileRoute } from "@tanstack/react-router"
import { SceneRenderer } from "../ui/SceneRenderer"
import { HelloWorld } from "../web-gl/scenes/hello_world/HelloWorld"

import "./web-gl.css"
import { Button, ComboboxItem, Select, Title } from "@mantine/core"
import { useMemo, useState } from "react"
import { useFullscreen } from "@mantine/hooks"

export const Route = createFileRoute("/web-gl")({
	component: RouteComponent,
})

const scenes = new Map([
	[
		"squares",
		{
			value: "squares",
			label: "Squares (Hello World)",
			scene: (canvas: HTMLCanvasElement, gl: WebGLRenderingContext) =>
				new HelloWorld(canvas, gl),
		},
	],
])

const selectData = [...scenes.values()].map((scene) => ({
	value: scene.value,
	label: scene.label,
}))

function RouteComponent() {
	const { ref, toggle, fullscreen } = useFullscreen()

	const [selectedScene, setSelectedScene] = useState<ComboboxItem | null>(
		scenes.get("squares")!
	)

	const sceneCreator = useMemo(() => {
		if (!selectedScene) {
			return undefined;
		}

		return scenes.get(selectedScene.value)?.scene
	}, [selectedScene])

	return (
		<div className="webgl-container">
			<div className="webgl-sidebar">
				<Title order={2}>WebGL Demo's</Title>
				<Select
					label="Select Scene"
					data={selectData}
					value={selectedScene?.value}
					onChange={(_, option) => setSelectedScene(option)}
					allowDeselect={false}
					defaultValue={'squares'}
				/>
				<Button mt={12} onClick={toggle}>Toggle Fullscreen</Button>
			</div>
			<div className="webgl-canvas">
				{sceneCreator && (
					<SceneRenderer
						ref={ref}
						onGlContext={sceneCreator}
						aspectRatio={16 / 9}
						fullscreen={fullscreen}
					/>
				)}
			</div>
		</div>
	)
}
