import React from 'react'

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      sucess: true, // if signup succeeded
      message: '',  // message if signup failed
      alertKlass: 'alert alert-success',
      alertStyle: { display: 'none' }
    };
  }

  submitHandler(event) {
    event.preventDefault();

    let that = this;

    $.post('/signup', this.state, function(data) {
      if (data.error) {
        that.setState({
          success: false,
          message: data.message,
          alertKlass: 'alert alert-warning',
          alertStyle: { display: 'block' }
        });
      } else {
        that.setState({
          success: true,
          message: '',
          alertKlass: 'alert alert-success',
          alertStyle: { display: 'none' }
        });

        // if signup succeeded, redirect to elsewhere
        location.assign(data.redirect_url);
      }
    });
  }

  // change input value
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-lg-6 col-lg-offset-3'>
            <form method='post' onSubmit={this.submitHandler.bind(this)}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  name='email'
                  className="form-control"
                  value={this.state.email}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name='password'
                  className="form-control"
                  value={this.state.password}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
              <div className={this.state.alertKlass} style={this.state.alertStyle}>
                {this.state.message}
              </div>
              <button type="submit" className="btn btn-primary">注册</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Signup;
