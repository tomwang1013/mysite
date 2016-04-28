import React from 'react'
import Input from '../controls/input'

class SignupEnt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entName:      '', // 企业名称
      website:      '', // 企业网站
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.props.notifyParent('ent', this.state);
    });
  }

  render () {
    return (
      <div>
        <Input type='text' value={this.state.entName} name='entName' onChange={this.handleChange} label='企业名称：'/>
        <Input type='text' value={this.state.website} name='website' onChange={this.handleChange} label='企业网站：'/>
      </div>
    )
  }
}

export default SignupEnt
