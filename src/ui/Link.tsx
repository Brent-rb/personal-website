import * as React from "react"
import { createLink, LinkComponent } from "@tanstack/react-router"
import { NavLink, NavLinkProps } from "@mantine/core"

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
	(props, ref) => {
		return (
			<NavLink
				ref={ref}
				{...props}
			/>
		)
	}
)

const CreatedLinkComponent = createLink(BasicLinkComponent)

export const Link: LinkComponent<typeof BasicLinkComponent> = (props) => {
	return <CreatedLinkComponent preload={"intent"} {...props} />
}
