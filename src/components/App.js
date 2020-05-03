import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import Login from '../containers/Login'
import TodaysStatistics from './TodaysStatistics'
import ShowTodaysStatistics from '../containers/ShowTodaysStatistics'
import ShowList from '../containers/ShowList'
import Home from './Home'
import { BrowserRouter, Route, Link } from 'react-router-dom'

const App = () => (
<BrowserRouter>
    <div>
        <ul class="sidebarMenuInner">
          <li class="nav-item"><Link to='/home'>ほーむ</Link></li>
          <li class="nav-item"><Link to='/list'>いちらん</Link></li>
        </ul>
      <hr />
    
      <Route exact path='/home' component={Home} />
      <Route exact path='/index.html' component={Home} />
      <Route path='/list' component={ShowList} />
    </div>
  </BrowserRouter>
)

export default App
