const login = (state = [], action) => {
  switch (action.type) {
    case 'SEND_LOGIN':
      return [
        //この部分をコメントアウトすることでアイテムを一意に更新する。配列の要素を追加しない
        //...state,
        {
          usr: action.usr,
          pas: action.pas
        }
      ]
    case 'SET_TOKEN':
      //ここのケース分岐が呼び出されていない…
      console.log('token data reached at reducer - ' + action.token)
      console.log(action.type)
      return [{
        token: action.token,
        usr: action.usr
      }]
    default:
      return state
  }
}

export default login