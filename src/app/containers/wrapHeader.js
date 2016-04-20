import { connect } from 'react-redux'
import Header from '../components/header'
import { userLogout } from '../actions'

const mapStateToProps = (state) => {
  return {
    isLogin:    state.isLogin,
    loginEmail: state.loginEmail
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogoutClick: (event) => {
      event.preventDefault();
      $.post('/logout', function() {
        dispatch(userLogout())
      });
    }
  }
}

const WrapHeader = connect(mapStateToProps, mapDispatchToProps)(Header);

export default WrapHeader
