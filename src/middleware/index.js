import AWS from "aws-sdk";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';
import React from 'react';
import $ from "jquery";
import setTicket from '../actions/index';
import setToken from '../actions/index';

//login-const variables
const userPool = new CognitoUserPool({
    UserPoolId: 'us-east-2_J3czsOpsv',
    ClientId: '3atuib3usf88b9cd72qbs1jvod'
})
var authtoken = '';

function SignIn(usr, pas){
    const authenticationDetails = new AuthenticationDetails({
        Username : usr,
        Password : pas
    })
    const cognitoUser = new CognitoUser({
        Username : usr,
        Pool : userPool
    })
    //20200504
    //dispLoading('ログイン中…');
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (authresult) {
            authtoken = authresult.getIdToken().getJwtToken();
            window.alert('ログインしました');
            //getTickets(authresult.getIdToken().getJwtToken(), usr);
            return (authresult.getIdToken().getJwtToken());
        }, onFailure: (err) => {
            return(err);
            console.log(err);
            window.alert('ログインに失敗しました');
            //removeLoading();

        }
    })
}

//function for sending tempinfo POST
function putTicket(temp, comment, username, token){
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var createdtime = date.getHours() + ':' + date.getMinutes();
  //console.log(createdtime)
  if (month.length === 1){
    month = '0' + month;
  }else{
    //console.log('zero');
  }
  var day = date.getDate();
  var created = year + '-' + month + '-' + day + '-' + createdtime;

  return $.ajax( {
    contentType: "application/json",
    type: 'POST',
    url: "https://tcnsvn5d6b.execute-api.us-east-2.amazonaws.com/prod/goodbye?username="+username,
    processdata: false,
    async: false,
    dataType: 'json',
    data: JSON.stringify({
      'created' : created,
      'username' : username,
      'title' : temp,
      'Issuetype' : 'health',
      'Status' : 'NS',
      'timezone' : 'health',
      'Due' : createdtime.toString(),
      'Comment' : comment,
      'EstTime' : 'None',
      'Priority' : 'None',
    }),
    headers: {
      'Authorization': token, 
    },
    success: function(data){
      //console.log(data);
      window.alert('おねつが正常に登録されました');
    },
    error: function(data){
      console.log('error', data);
      }                
    })
}

//function to get ticket from API GET
var tickets = [];
function getTickets(token, usr, previousprocess) {
  var url = "https://tcnsvn5d6b.execute-api.us-east-2.amazonaws.com/prod/goodbye?username="+usr;
  var results = $.ajax({
            contentType: "application/json",
            type: 'GET',
            url: url,
            processdata: false,
            dataType: 'json',
            async: false,
            headers: {
                'Authorization': token, 
                },
            success: function(data){               
              console.log(data['body']['Items'][0]['TaskID']);
              console.log(data['body']['Items'][1]['TaskID']);
              var filterresults = '';
              filterresults = data['body']['Items'].filter(function(a){
                return a.timezone === 'health'
              });
              filterresults.sort(compare);
              console.log(filterresults);
              console.log(Object.keys(filterresults).length);
              tickets = filterresults;
              if(filterresults.length === 0){
               //ここにticketsを登録するアクションを入れる
               console.log('new tickets got from API' + filterresults);
              }else{
                console.log('blank tickets');
                console.log(usr);
                console.log(token);
            }
              }
    })
    console.log(results);
    var returnedresults = results.responseJSON.body.Items.filter(function(a){
      return a.timezone === 'health'
    }).sort(compare)
    return(returnedresults);
}

function compare( a, b ){
 var r = 0;
  if( a.Created > b.Created ){ r = -1; }
  else if( a.Created < b.Created ){ r = 1; }
  return r;
  }

//loading effect function
/* ------------------------------
 Loading イメージ表示関数
 引数： msg 画面に表示する文言
 ------------------------------ */
    function dispLoading(msg){
      // 引数なし（メッセージなし）を許容
      if( msg == undefined ){
        msg = "";
      }
      // 画面表示メッセージ
      var dispMsg = "<div class='loadingMsg'>" + msg + "</div>";
      // ローディング画像が表示されていない場合のみ出力
      if($("#loading").length == 0){
        $("body").append("<div id='loading'>" + dispMsg + "</div>");
      }
    }
 
/* ------------------------------
 Loading イメージ削除関数
 ------------------------------ */
    function removeLoading(){
      $("#loading").remove();
    }


//actual middleware coding - 1
const logger = store => next => action => {
  console.log("before: %O", store.getState());
  next(action);
  console.log("after: %O", store.getState());
  //ここでタイプを確認する
  console.log(action.type);
  //ここでログイン情報を取れることを確認する
  if(action.login){
    //20200504
    dispLoading('よみこみ中');
    console.log(store.getState().login[0].usr);
    const usr = store.getState().login[0].usr;
    const pas = store.getState().login[0].pas;
      console.log('triggering setToken function');
      SignIn(usr, pas);
      //ここに、Storeへトークンを追加するための新しいアクションを追加する
      next(action.success(usr, authtoken));
      setTimeout(function(){
        setToken(authtoken);
        setTimeout(
          function(){
            store.dispatch(setTicket(getTickets(authtoken, usr, setToken(authtoken))));
            setTimeout(function(){
              //storeを直接いじりに行くのもご法度。基本的にはthunk, sagaを利用するべき
              //store.dispatch(setTicket(tickets))
              //20200504
              removeLoading();
            }, 100)}
        , 100)}
      , 1800)
    //SignIn(usr, pas);
    //setTimeout(aleartToken, 2000);
  }else if(action.type === "ADD_TODO"){
    dispLoading('データを更新しています…');
    const token = store.getState().login[0].token;
    const usr = store.getState().login[0].usr;
    const temp = store.getState().todos[0].temp;
    const Comment = store.getState().todos[0].Comment;
    console.log('triggering putTicket function');
    store.dispatch(setTicket(getTickets(authtoken, usr, putTicket(temp, Comment, usr, authtoken))))
    setTimeout(function(){
      removeLoading();
      }, 500)
  }
  };

export default logger;