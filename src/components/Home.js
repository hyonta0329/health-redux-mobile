import React from 'react'
import Login from '../containers/Login'
import TodaysStatistics from './TodaysStatistics'
import ShowTodaysStatistics from '../containers/ShowTodaysStatistics'
import AddTodo from '../containers/AddTodo'

const Home = () => {
return (
	<div>
    	<Login />
    	<AddTodo />
    	<ShowTodaysStatistics />   
	</div>
	)

}

export default Home