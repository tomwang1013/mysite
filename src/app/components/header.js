import React from 'react'

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">学做</a>
          </div>

          <ul className="nav navbar-nav navbar-right">
            <button type="button" className="btn btn-default navbar-btn">登陆</button>
            <button type="button" className="btn btn-default navbar-btn">注册</button>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Header;
