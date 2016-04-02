import React from 'react'

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isEmailValid: true,
      emailHint: ''
    };
  }

  submitHandler(event) {
    event.preventDefault();

    $.post('/signup', this.state, function(data) {
      location.assign(data.url);
    });
  }

  // check if this email is valid
  emailChecker(event) {
    $.get('/email_check', { email: this.state.email }, (function(data) {
      if (data.error) {
        this.setState({
          isEmailValid: false,
          emailHint: 'user already exists'
        });
      } else {
        this.setState({
          isEmailValid: true,
          emailHint: 'you can use this email'
        });
      }
    }).bind(this));
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
            <form onSubmit={this.submitHandler.bind(this)}>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  name='email'
                  className="form-control"
                  value={this.state.email}
                  onBlur={this.emailChecker.bind(this)}
                  onChange={this.handleChange.bind(this)}
                />
                <div
                  style={this.state.isEmailValid ? {display: 'none'} : {display: 'block'}}
                  className={this.state.isEmailValid ? 'alert alert-success' : 'alert alert-warning'}
                >
                  {this.state.emailHint}
                </div>
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
              <button type="submit" className="btn btn-primary">注册</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Signup;
