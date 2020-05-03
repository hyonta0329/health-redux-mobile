import React from 'react'
import { connect } from 'react-redux'

const List = ({dispatch, tickets}) => {
//console.log('data is handed over to component: '+tickets);
const alignedtickets = tickets.replace('[', "").replace(']', "");
const jasonalltickets = JSON.parse(tickets);
const latestticket = [jasonalltickets[0]]
console.log(jasonalltickets);
console.log('list js is working');

//以下の記述はリスト作成用に残しておく
//	<div>{jasontickets.map(jasonticket => <li>{jasonticket.Comment}</li>)}</div>);

return (
	<div>
	<br />
      <ul>
      <li class="grid-box box-big">
      <div class="rounded border border-info">
      <h4 class="text-light bg-dark">&nbsp;これまでのおねつ</h4>
        <table class="table" id="table1">
    		<thead><tr><th>いつはかった</th><th>おねつ</th><th>こめんと</th><th>操作</th></tr></thead>
    		<tbody id="healthtable">
 				{jasonalltickets.map(jasonticket => 
 					<tr><td>{jasonticket.Created}</td><td>{jasonticket.title}</td><td>{jasonticket.Comment}</td><td><input type="button" class="btn btn btn-pale" id={tickets.TaskID} value="-" /></td></tr>
 					)}
    		</tbody>
    	</table>
	</div>
	</li></ul>
	</div>
		);
}

export default List