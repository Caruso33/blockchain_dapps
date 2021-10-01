import React from "react"
import { Menu } from "semantic-ui-react"
import Link from "next/link"

export default ({}) => (
  <Menu style={{ marginTop: 10 }}>
    <Link href="/">
      <a className="item">kickStartR</a>
    </Link>

    <Menu.Menu position="right">
      <Link href="/">
        <a className="item">Campaigns</a>
      </Link>
      <Link href="/campaigns/new">
        <a className="item">+</a>
      </Link>
    </Menu.Menu>
  </Menu>
)
