/**
 * text-based input control, include a bootstrap label
 */

import React, {PropTypes} from 'react'

const Input = ({type, value, name, onChange, label}) => (
  <div className="form-group">
    <label className="col-lg-2 control-label" htmlFor={name}>{label}</label>
    <div className="col-lg-10">
      <input
        type={type}
        name={name}
        id={name}
        className="form-control"
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
)

Input.propTypes = {
  type:     PropTypes.string.isRequired,
  value:    PropTypes.string.isRequired,
  name:     PropTypes.string.isRequired,
  label:    PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired 
}

export default Input
