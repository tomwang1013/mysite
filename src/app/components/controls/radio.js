import React, {PropTypes} from 'react'

const Radio = ({name, leftlabel, radios, selectedVal, onChange}) => (
  <div className="form-group">
    <label className="col-lg-2 control-label">{leftlabel}</label>
    <div className="col-lg-10">
      {radios.map(r => (
        <label key={r.id} className="radio-inline">
          <input type="radio" name={name} value={r.value}
            checked={r.value === selectedVal} onChange={onChange}/>
          {r.label}
        </label>
      ))}
    </div>
  </div>
)

export default Radio
