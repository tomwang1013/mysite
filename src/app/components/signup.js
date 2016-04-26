/**
 * signup and login
 */
import React from 'react'
import { connect } from 'react-redux'
import { userLogin } from '../actions'
import Input from './controls/input'
import Submit from './controls/submit'
import Radio from './controls/radio'
import SignupStudent from './signup/_student'
import SignupEnt from './signup/_ent'

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      userType: 'student',
      message: '',  // message if signup failed
      student: {},
      ent: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.childrenChangeHandler = this.childrenChangeHandler.bind(this);
  }

  childrenChangeHandler(type, newInfo) {
    this.setState({[type]: newInfo})
  }

  // form submit
  submitHandler(event) {
    event.preventDefault();

    let that = this;

    $.post('/signup', this.state, function(data) {
      if (data.error) {
        that.setState({ message: data.message });
      } else {
        that.setState({ message: '' });
        that.context.router.push(data.redirect_url);
      }
    });
  }

  // change input value
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    let userTypeEle;

    if (this.state.userType == 'student') {
      userTypeEle = <SignupStudent notifyParent={this.childrenChangeHandler}/> 
    } else {
      userTypeEle = <SignupEnt notifyParent={this.childrenChangeHandler}/> 
    }

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-lg-8 col-lg-offset-2'>
            <form className="form-horizontal" method='post' onSubmit={this.submitHandler}>
              <Input type="email" name="email" value={this.state.email}
                onChange={this.handleChange} label="邮箱："/>
              <Input type="password" name="password" value={this.state.password}
                onChange={this.handleChange} label="密码："/>
              <Radio name="userType" leftlabel="用户类型："
                radios={[{id: 'ur1', value: 'student', label: '学生'},
                         {id: 'ur2', value: 'ent', label: '企业'}]}
                selectedVal={this.state.userType}
                onChange={this.handleChange}
              />
              {userTypeEle}
              <Submit text="注册"/>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

Signup.contextTypes = {
  router: React.PropTypes.object,
};

export default connect()(Signup);
