let nextTodoId = 0

export const addTodo = (Comment, temp, token) => {
  console.log('addTodo was caused in actions file')
  return ({
    type: 'ADD_TODO',
    id: nextTodoId++,
    Comment,
    temp,
    token,
    addTodo : "addTodo"
  })
}

export const postTemp = (Comment, temp, token) => {
  console.log('data reached at postTemp function')
  return({
    type: 'POST_TEMP',
    Comment,
    temp,
    token
  })

}

export const sendLogin = (usr, pas) => {
  return({
    type: 'SEND_LOGIN',
    usr,
    pas,
    login: "login",
    success: setToken
  })

}

export const setToken = (usr, token) => {
  //console.log('token data reached at ACTION - ')
  console.log('token data reached at ACTION - ' + token)
  return(
      {
        type: 'SET_TOKEN',
        usr, 
        token,
        success: setTicket
      }
    )
}

const setTicket = (tickets) => {
  console.log('tickets data reached at ACTIOn - ' + tickets);
  return (
      {
        type: 'SET_TICKETS', 
        tickets
      }
    )
}

export default setTicket;

export const setTickets = (tickets) => {
  console.log('tickets data reached at ACTIOn - ' + tickets);
  return (
      {
        type: 'SET_TICKETS', 
        tickets
      }
    )
}

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
