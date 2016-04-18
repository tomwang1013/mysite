import React from 'react'

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">学做</a>
          </div>

          <div className="collapse navbar-collapse" style={{ display: this.props.isLogin ? 'none' : 'block' }}>
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/login">登录</a></li>
              <li><a href="/signup">注册</a></li>
            </ul>
          </div>
          <p className="navbar-text" style={{ display: this.props.isLogin ? 'block' : 'none' }}>你好，{this.props.loginEmail}<a href="#" className="navbar-link">退出</a></p>
        </div>
      </nav>
    )
  }
}

export default Header;
