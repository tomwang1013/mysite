import React from 'react'
import Header from './header'
import Footer from './footer'

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header {...this.props} />
          {this.props.children}
        <Footer />
      </div>
    )
  }
}

App.defaultProps = { isLogin: false, loginEmail: '' };

export default App;
