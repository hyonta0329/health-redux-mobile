import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import List from './List'

const TodaysStatistics = ({dispatch, tickets}) => {
//console.log('data is handed over to component: '+tickets);
const alignedtickets = tickets.replace('[', "").replace(']', "");
const jasontickets = JSON.parse(tickets).slice(0, 1);
const latestticket = [jasontickets[0]]
console.log(jasontickets);
console.log(latestticket);

//以下の記述はリスト作成用に残しておく
//	<div>{jasontickets.map(jasonticket => <li>{jasonticket.Comment}</li>)}</div>);

return (
	<div >
	<br />
      <ul>
      <li class="grid-box box-big">
      <div class="rounded border border-info">
      <h4 class="text-light bg-dark">&nbsp;直近のおねつ</h4>
		<table class="table">
          <tr><td>直近のおねつ: </td><td>	{jasontickets.map(jasonticket => <li>{jasonticket.title}</li>)} </td></tr>
          <tr><td>いつはかった: </td><td> {jasontickets.map(jasonticket => <li>{jasonticket.Created}</li>)}</td></tr>
        </table>
        <Link to='/list'>&nbsp;&nbsp;&nbsp;>>>>すべてのおねつを見る</Link>
        <Route path='/list' component={List} />
	<div>
	</div>
	</div></li></ul>
	</div>
		);
}

export default TodaysStatistics