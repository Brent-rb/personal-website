import { Avatar, Box, Center, List, NavLink, Text, Title } from "@mantine/core"
import "./App.css"

import profilePicture from "../assets/profile_square.jpg"
import { GithubIcon } from "../icons/GithubIcon"
import { LinkedinRectIcon } from "../icons/LinkedInIcon"
import { LocationIcon } from "../icons/LocationIcon"
import { DocumentIcon } from "../icons/DocumentIcon"
import { Link } from "./Link"

function App() {
	return (
		<div className="app-container">
			<div className="profile-container">
				<Box w="100%">
					<Center mt={-12}>
						<Avatar
							className="outline-sm"
							size={256}
							src={profilePicture}
						/>
					</Center>
					<Center mt={24}>
						<Title>BRENT BERGHMANS</Title>
					</Center>
					<Center>
						<Title order={2}>Software Engineer</Title>
					</Center>
					<Center>
						<List
							spacing="xs"
							size="sm"
							mt={12}
						>
							<List.Item
								icon={
									<LocationIcon />
								}
							>
								Diest, Belgium
							</List.Item>
						</List>
					</Center>
					<div className="links">
						<div>
							<NavLink
								style={{ borderRadius: 32 }}
								href="https://github.com/Brent-rb"
								label="Github"
								leftSection={<GithubIcon />}
							/>
						</div>
						<div>
							<NavLink
								style={{ borderRadius: 32 }}
								href="https://linkedin.com/in/brent-rb/"
								label="LinkedIn"
								leftSection={<LinkedinRectIcon />}
							/>
						</div>
						<div>
							<NavLink
								style={{ borderRadius: 32 }}
								href="/files/brent-berghmans-resume-2024.pdf"
								label="Resume (2024)"
								leftSection={<DocumentIcon />}
							/>
						</div>
					</div>
				</Box>
			</div>
			<div className="info-container">
				<div>
					<Title order={2}>Hi, welcome to my page!</Title>
					<Text>You're a bit too early as this page is still under construction.</Text>
					<Text>In the future, this area should contain the projects I've worked, my skills, technologies I've worked with, etc.</Text>
					<br />
					<Text>As for now, here are some things I'm working on right now:</Text>
					<NavLink
						href="https://github.com/Brent-rb/fire-alias-v2"
						label="FireAlias"
					/>
					<div>
						<Link 
							to="/web-gl"
							label="WebGL"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
