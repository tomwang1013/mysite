/**
 * signup and login
 */
import React from 'react'
import { connect } from 'react-redux'
import { userLogin } from '../actions'

class Sign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: '',  // message if signup or login failed
      alertKlass: 'alert alert-success',
      alertStyle: { display: 'none' },
      submitUrl: this.props.location.pathname,
      submitText: this.props.location.pathname == '/signup' ? '注册' : '登陆'
    };
  }

  submitHandler(event) {
    event.preventDefault();

    let that = this;

    $.post(this.state.submitUrl, this.state, function(data) {
      if (data.error) {
        that.setState({
          message: data.message,
          alertKlass: 'alert alert-warning',
          alertStyle: { display: 'block' }
        });
      } else {
        that.setState({
          message: '',
          alertKlass: 'alert alert-success',
          alertStyle: { display: 'none' }
        });

        // TODO how to pass props to new router component?
        if (that.props.location.pathname == '/signup') {
          that.context.router.push(data.redirect_url);
        } else {
          that.props.dispatch(userLogin(data.email));
          that.context.router.push('/');
        }
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
              <button type="submit" className="btn btn-primary">{this.state.submitText}</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

Sign.contextTypes = {
  router: React.PropTypes.object,
};

export default connect()(Sign);