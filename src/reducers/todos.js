const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        //この部分をコメントアウトすることでアイテムを一意に更新する。配列の要素を追加しない
        //...state,
        {
          id: action.id,
          Comment: action.Comment,
          completed: false,
          temp: action.temp,
          token: action.token,
          addTodo: "addTodo"
        }
      ]
    case 'POST_TEMP':
      return [
      {
        Comment: action.Comment,
        completed: false,
        temp: action.temp,
        token: action.token
      }]
    case 'TOGGLE_TODO':
      return state.map(todo =>
        (todo.id === action.id)
          ? {...todo, completed: !todo.completed}
          : todo
      )
    default:
      return state
  }
}

export default todos
