import React from 'react'

const AfterLogin = ({ userType }) => {
  if (userType == 'student') {
    return
      <div>
        <Link to='/jobs'>浏览工作机会</Link>
      </div>
  } else {
    return
      <div>
        <Link to='/create_job'>发布工作岗位</Link>
        <Link to='/students'>寻找优秀员工</Link>
      </div>
  }
}

export default AfterLogin
