import React from 'react'
import {
  Outlet,
  Link,
} from 'react-router-dom'

const Main = () => (
  <div>
    {/* A "layout route" is a good place to put markup you want to
        share across all the pages on your site, like navigation. */}
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/templates">Templates</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/nothing-here">Nothing Here</Link>
        </li>
      </ul>
    </nav>

    <hr />

    <Outlet />
  </div>
)

export {
  Main,
}
