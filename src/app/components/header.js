import React from 'react'

class Header extends React.Component {
  render() {
    let rightPart;

    if (this.props.isLogin) {
      rightPart = 
        <p className="navbar-text navbar-right">
          你好，{this.props.loginEmail}
          <a style={{ cursor: 'pointer' }}
            onClick={(event) => this.props.onLogoutClick(event)}
            className="navbar-link">退出</a>
        </p>
    } else {
      rightPart =
        <ul className="nav navbar-nav navbar-right">
          <li><a href="/login">登录</a></li>
          <li><a href="/signup">注册</a></li>
        </ul>
    }

    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">学做</a>
          </div>
          <div className="collapse navbar-collapse">
            {rightPart}
          </div>
        </div>
      </nav>
    )
  }
}

export default Header;
