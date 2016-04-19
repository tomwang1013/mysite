import { connect } from 'react-redux'
import Header from '../components/header'

const mapStateToProps = (state) => {
  return {
    isLogin:    state.isLogin,
    loginEmail: state.loginEmail
  }
}

const WrapHeader = connect(mapStateToProps)(Header);

export default WrapHeader
