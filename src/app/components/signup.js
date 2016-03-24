import React from 'react'

class Signup extends React.Component {
  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-lg-6 col-lg-offset-3'>
            <form method='post' action='/signup'>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" placeholder="Email"/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password"/>
              </div>
              <button type="submit" className="btn btn-default">注册</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Signup;
