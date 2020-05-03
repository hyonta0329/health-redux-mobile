const tickets = (state = [], action) => {
  switch (action.type) {
    case 'SET_TICKETS':
      return action.tickets
        //[
        //この部分をコメントアウトすることでアイテムを一意に更新する。配列の要素を追加しない
        //...state,
        //{
          //tickets: action.tickets
        //}
      //]
    default:
      return state
  }
}

export default tickets
