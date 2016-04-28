import React from 'react'
import Input from '../controls/input'
import Radio from '../controls/radio'

class SignupStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xingMing:     '', // 姓名
      schoolName:   '', // 学校名
      major:        '', // 专业
      entranceTime: '', // 入学时间
      gender:       '0',// 性别：0:female,1:male
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.props.notifyParent('student', this.state);
    });
  }

  render () {
    return (
      <div>
        <Input type='text' value={this.state.xingMing} name='xingMing' onChange={this.handleChange} label='姓名：'/>
        <Radio name="gender" leftlabel="性别："
          radios={[{id: 'gender1', value: '0', label: '女'},
                   {id: 'gender2', value: '1', label: '男'}]}
          selectedVal={this.state.gender}
          onChange={this.handleChange}
        />
        <Input type='text' value={this.state.schoolName} name='schoolName' onChange={this.handleChange} label='学校：'/>
        <Input type='text' value={this.state.major} name='major' onChange={this.handleChange} label='专业：'/>
        <Input type='text' value={this.state.entranceTime} name='entranceTime' onChange={this.handleChange} label='入学时间：'/>
      </div>
    )
  }
}

export default SignupStudent
