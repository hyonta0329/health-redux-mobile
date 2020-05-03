import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

const AddTodo = ({ dispatch, login }) => {
  let input
  //入力されたインプット情報をもとにaddTodoメソッドでdispatchしているのはわかる
  //ここのnode=>input=>nodeの意味がわからない
  //document.getElementByIdで代用する
  //本スクリプト
  //<form onSubmit={e => {
    //e.preventDefault()
      //if (!input.value.trim()) {
        //return
        //}
      //dispatch(addTodo(input.value))
        //input.value = ''
    //}}>
    //<input ref={node => input = node} />
      //<button type="submit">
      //Add Todo
    //</button>
    console.log(login)
  return (
    <div>
      <br />
      <ul>
      <li class="grid-box box-big">
      <div class="rounded border border-info">
      <h4 class="text-light bg-dark">&nbsp;おねつを登録する</h4>
      <table class="table">
            <tr><td>おねつ: </td><td>
              <select name="int" id="int">
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
              </select> . 
              <select name="float" id="float">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </select>
            </td></tr>
            <tr><td>こめんと: </td><td><input type="text" id="comment_ticket" /></td></tr>
            <tr><td></td><td></td><input class="btn btn btn-pale" type="button" value = "OK" onClick={e => dispatch(addTodo(document.getElementById('comment_ticket').value, document.getElementById('int').value + '.' + document.getElementById('float').value, 'dummytoken'))} />
            </tr>
          </table>
      </div>
      </li>
      </ul>
    </div>
  )
}

//<input class="btn btn btn-pale" type="button" value = "OK" onClick={e => dispatch(addTodo(document.getElementById('comment_ticket').value, document.getElementById('int').value + '.' + document.getElementById('float').value))} />

export default connect()(AddTodo)
