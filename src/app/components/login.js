/**
 * signup and login
 */
import React from 'react'
import { connect } from 'react-redux'
import { userLogin } from '../actions'
import Input from './controls/input'
import Submit from './controls/submit'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: '',  // message if login failed
    };
  }

  submitHandler(event) {
    event.preventDefault();

    let that = this;

    $.post('/login', this.state, function(data) {
      if (data.error) {
        that.setState({ message: data.message });
      } else {
        that.setState({ message: '' });
        that.props.dispatch(userLogin(data.email));
        that.context.router.push('/');
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
          <div className='col-lg-8 col-lg-offset-2'>
            <form className="form-horizontal" method='post' onSubmit={this.submitHandler.bind(this)}>
              <Input type="email" name="email" value={this.state.email}
                onChange={this.handleChange.bind(this)} label="邮箱："/>
              <Input type="password" name="password" value={this.state.password}
                onChange={this.handleChange.bind(this)} label="密码："/>
              <Submit text='登陆'/>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.object,
};

export default connect()(Login);
