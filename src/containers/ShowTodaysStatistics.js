import { connect } from 'react-redux'
import TodaysStatistics from '../components/TodaysStatistics'
import {setTickets} from '../actions'

const GetAllTickets = (tickets) => {
	if (JSON.stringify(tickets)==="[]"){
		return JSON.stringify(tickets);
		console.log('notickets!');
	}else{
		console.log('severaltickets!')
		return JSON.stringify(tickets);
	}
}

const mapStateToProps = state => ({
  tickets: GetAllTickets(state.tickets)
})

const mapDispatchToProps = dispatch => ({
 //dipatch時の対応考えていなかった
 setTicket: tickets => dispatch(setTickets(tickets))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodaysStatistics)