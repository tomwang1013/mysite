import React from 'react'
import Header from './components/header'
import Footer from './components/footer'

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}
