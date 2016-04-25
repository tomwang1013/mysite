import React, {PropTypes} from 'react'

const Radio = ({name, leftlabel, radios}) => (
  <div className="form-group">
    <label className="col-lg-2 control-label">{leftlabel}</label>
    <div className="col-lg-10">
      {radios.map(r => (
        <label key={r.id} className="radio-inline">
          <input type="radio" name={name} id={r.id} value={r.value}/> {r.label}
        </label>
      ))}
    </div>
  </div>
)

export default Radio
