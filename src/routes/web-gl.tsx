import { createFileRoute } from "@tanstack/react-router"
import { SceneRenderer } from "../ui/SceneRenderer"
import { HelloWorldScene } from "../web-gl/scenes/HelloWorld"

import "./web-gl.css"
import { Button, ComboboxItem, em, Select, Text, Title } from "@mantine/core"
import { useMemo, useState } from "react"
import { useFullscreen } from "@mantine/hooks"
import { WebGlLogBox } from "../ui/LogBox"

export const Route = createFileRoute("/web-gl")({
	component: RouteComponent,
})

const scenes = new Map([
	[
		"squares",
		{
			value: "squares",
			label: "Hello World",
			description: "This scene is the equivalent to Hello World for graphics.\nIt has a rendering loop, it can render triangles and squares.\n The triangles are rendered using a simple vertex buffer, the squares are rendered using an Element Buffer Object so they have indices on top vertices. I added movement based on the color of the vertex to make it more interesting.",
			scene: (canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) =>
				new HelloWorldScene(canvas, gl),
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
				<Text mt={em(8)}>
					{scenes.get(selectedScene?.value ?? '')?.description}
				</Text>
				<div className="spacer" />
				<div className="logbox-container">
					<WebGlLogBox />
				</div>
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
