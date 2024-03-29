import Script from 'next/script'
import styles from './page.module.css'

export default function WebGL() {
	return (
		<>
			<Script src="/gl/hello_world.js" />
			<main className={styles.main}>
				<h1>WebGL Demo</h1>
				<canvas
					id="hello_world"
					className={styles.webgl_demo}
					width={1280}
					height={720}
				/>
			</main>
		</>
	)
}
