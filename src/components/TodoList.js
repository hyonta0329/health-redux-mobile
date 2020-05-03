import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'


const TodoList = ({ todos, toggleTodo, login }) => (
  <ul>
    {todos.map(todo => <li>{todo.Comment}---{todo.temp}---{todo.token}</li>)}
    {login.map(loginitem => <li>{loginitem.token}</li>)} 
  </ul>
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    Comment: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  toggleTodo: PropTypes.func.isRequired
}

export default TodoList
