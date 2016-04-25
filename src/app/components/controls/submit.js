import React, {PropTypes} from 'react'

const Submit = ({text}) => (
  <div className="form-group">
    <div className="col-lg-offset-2 col-lg-10">
      <button type="submit" className="btn btn-primary">{text}</button>
    </div>
  </div>
)

Submit.propTypes = {
  text: PropTypes.string.isRequired
}

export default Submit
