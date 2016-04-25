/**
 * signup and login
 */
import React from 'react'
import { connect } from 'react-redux'
import { userLogin } from '../actions'
import Input from './controls/input'
import Submit from './controls/submit'
import Radio from './controls/radio'

class Sign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: '',  // message if signup or login failed
      submitUrl: this.props.location.pathname,
      submitText: this.props.location.pathname == '/signup' ? '注册' : '登陆'
    };
  }

  submitHandler(event) {
    event.preventDefault();

    let that = this;

    $.post(this.state.submitUrl, this.state, function(data) {
      if (data.error) {
        that.setState({ message: data.message });
      } else {
        that.setState({ message: '' });

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
          <div className='col-lg-8 col-lg-offset-2'>
            <form className="form-horizontal" method='post' onSubmit={this.submitHandler.bind(this)}>
              <Input type="email" name="email" value={this.state.email}
                onChange={this.handleChange.bind(this)} label="邮箱："/>
              <Input type="password" name="password" value={this.state.password}
                onChange={this.handleChange.bind(this)} label="密码："/>
              <Radio name="userType" leftlabel="用户类型："
                radios={[{id: 'ur1', value: 'student', label: '学生'},
                         {id: 'ur2', value: 'ent', label: '企业'}]}/>
              <Submit text={this.state.submitText}/>
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
