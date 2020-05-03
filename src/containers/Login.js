import React from 'react'
import { connect } from 'react-redux'
import { sendLogin } from '../actions'

const Login = ({ dispatch }) => {
  //const titlestyle = {}...
    return (
      <div>
        <div class = "container">
          <div class="wrapper">
            <h2 class="form-signin-heading" >こんにちは！！！</h2>
            <hr class="colorgraph" />
            <input class="form-control" placeholder="Email" id="loginuser" />
            <input type="password" placeholder="Password" class="form-control" id="loginpas" />
            <br />
            <input class="btn btn-lg btn btn-pale btn-block" type="button" value="ログインする" onClick={e => dispatch(sendLogin(document.getElementById('loginuser').value, document.getElementById('loginpas').value))} />
          </div>
        </div>
      </div>
  )
}

export default connect()(Login)
