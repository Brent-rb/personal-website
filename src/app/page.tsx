import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.content}>
				<div className={styles.content_card}>
					<h1>Brent Berghmans</h1>
					<p>Welcome to my personal website!</p>
					<p>
						You&#39;ve somehow stumbled upon this website even
						though it is a work in progress
					</p>
					<p>
						There&#39;s not much to see yet, only a very basic WebGL
						demo.
					</p>
				</div>

				<div className={styles.content_card}>
					<a
						href="/webgl"
						className={styles.card}
						target="_blank"
						rel="noopener noreferrer"
					>
						<h2>
							WebGL <span>-&gt;</span>
						</h2>
						<p>Go to the WebGL demo.</p>
					</a>
				</div>
			</div>
		</main>
	)
}
