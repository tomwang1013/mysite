import React from 'react'
import WrapHeader from '../containers/wrapHeader'
import Footer from './footer'

class App extends React.Component {
  render() {
    return (
      <div>
        <WrapHeader />
          {this.props.children}
        <Footer />
      </div>
    )
  }
}

export default App;
