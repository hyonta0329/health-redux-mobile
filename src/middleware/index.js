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

//Promise function definition
function PromiseProcess(data){
  return new Promise(function(callback){
    setTimeout(function(){
      callback(data);
    }, 100);
  });
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
    //20200507
    dispLoading('よみこみ中');
    const usr = store.getState().login[0].usr;
    const pas = store.getState().login[0].pas;
    const authenticationDetails = new AuthenticationDetails({
      Username : usr,
      Password : pas
    })
    const cognitoUser = new CognitoUser({
      Username : usr,
      Pool : userPool
    })
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (authresult) {
          var logintoken = authresult.getIdToken().getJwtToken();
          authtoken = logintoken;
          window.alert('ログインしました');
          PromiseProcess(logintoken).then((data) => {
            console.log('this is...' + data);
            return (data)
          }).then((data) => {
            console.log('revoking setToken function...');
            return setToken(data);
          }).then((data) =>{
            console.log('revoking getTickets function...');
            return getTickets(logintoken, usr, data);
          }).then((data) => {
            console.log('revoking setTicket function...');
            return setTicket(data);
          }).then((data) => {
            return store.dispatch(data);
          }).then((data) => {
            console.log('End of function!');
            removeLoading();
          });

      }, onFailure: (err) => {
          return(err);
          console.log(err);
          window.alert('ログインに失敗しました');
          //removeLoading();

      }
    })
  }else if(action.type === "ADD_TODO"){
    dispLoading('おねつを登録しています…');
    const token = store.getState().login[0].token;
    const usr = store.getState().login[0].usr;
    const temp = store.getState().todos[0].temp;
    const Comment = store.getState().todos[0].Comment;
    console.log('triggering putTicket function');
    PromiseProcess(100).then((data)=>{
      console.log(data);
      console.log('putting ticket...');
      return (putTicket(temp, Comment, usr, authtoken));
    }).then((data) =>{
      removeLoading();
      console.log('getting tickets...');
      return (getTickets(authtoken, usr, data));
    }).then((data)=>{
      //dispLoading('データを更新しています...');
      console.log('setting tickets...');
      return (setTicket(data));
    }).then((data) => {
      console.log('dispatching...');
      store.dispatch(data);
    }).then((data)=>{
      console.log('end of function!');
      removeLoading();
    })

  }
  };

export default logger;