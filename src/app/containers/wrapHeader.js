import { connect } from 'react-redux'
import Header from '../components/header'

const mapStateToProps = (state) => {
  return { ...state }
}

const WrapHeader = connect(mapStateToProps)(Header);

export default WrapHeader
