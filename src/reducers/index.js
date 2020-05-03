import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import login from './login'
import tickets from './tickets'

export default combineReducers({
  todos,
  visibilityFilter,
  login,
  tickets
})
