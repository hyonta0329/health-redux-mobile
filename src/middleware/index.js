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
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (authresult) {
            authtoken = authresult.getIdToken().getJwtToken();
            window.alert('ログインしました')
            var currenttime = new Date();
            //20200502 仕方ないのでここにチケット取得のところまで入力する
            getTickets(authresult.getIdToken().getJwtToken(), usr);
        }, onFailure: (err) => {
            return(err);
            console.log(err);
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

  $.ajax( {
    contentType: "application/json",
    type: 'POST',
    url: "https://tcnsvn5d6b.execute-api.us-east-2.amazonaws.com/prod/goodbye?username="+username,
    processdata: false,
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
      'Priority' : 'None'
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
function getTickets(token, usr) {
  var url = "https://tcnsvn5d6b.execute-api.us-east-2.amazonaws.com/prod/goodbye?username="+usr;
  $.ajax({
            contentType: "application/json",
            type: 'GET',
            url: url,
            processdata: false,
            dataType: 'json',
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
              //console.log(Object.keys(filterresults).length);
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
}

function compare( a, b ){
 var r = 0;
  if( a.Created > b.Created ){ r = -1; }
  else if( a.Created < b.Created ){ r = 1; }
  return r;
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
  	console.log(store.getState().login[0].usr);
  	const usr = store.getState().login[0].usr;
  	const pas = store.getState().login[0].pas;
  	var aleartToken = function(){
  		console.log('triggering setToken function');
  		//ここに、Storeへトークンを追加するための新しいアクションを追加する
  		next(action.success(usr, authtoken));
  		setTimeout(function(){
  			//このやり方は結構最悪のやり方。一旦文字列に落としてからpropsから引き出し、再度JSONとして処理する。気が狂っている
  			//配列をStateに登録し、その都度全部を塗り替えるような方法を探すべきである
  			//またstoreを直接いじりに行くのもご法度。基本的にはthunk, sagaを利用するべき
  			//これらはリリース後に残課題として対応。やれやれ…
  			store.dispatch(setTicket(tickets))
  		}, 3000)
  	}
  	SignIn(usr, pas);
  	setTimeout(aleartToken, 2000);
  //ここの分岐がなぜか発生しない。他のパラメータで試してみる
  }else if(action.type === "ADD_TODO"){
  	const token = store.getState().login[0].token;
  	const usr = store.getState().login[0].usr;
  	const temp = store.getState().todos[0].temp;
  	const Comment = store.getState().todos[0].Comment;
  	console.log('triggering putTicket function');
  	putTicket(temp, Comment, usr, token);
  	getTickets(token, usr);
  	console.log(JSON.stringify(tickets));
  	setTimeout(function(){
  			//このやり方は結構最悪のやり方。一旦文字列に落としてからpropsから引き出し、再度JSONとして処理する。気が狂っている
  			//配列をStateに登録し、その都度全部を塗り替えるような方法を探すべきである
  			//またstoreを直接いじりに行くのもご法度。基本的にはthunk, sagaを利用するべき
  			//これらはリリース後に残課題として対応。やれやれ…
  			store.dispatch(setTicket(tickets))
  		}, 3000)
  }
  //else if(action.type === "SET_TOKEN"){
  		//ここに設定されたトークンとユーザーネームで最新のチケットを登録するアクションにつなぐ
  		//console.log('trigerring getTicket function');
  		//getTickets(authtoken, store.getState().login[0].usr);
  		//var alertTickets = function(){
  		//	next(action.success(tickets));
  		//	console.log('tickets are' + tickets);
  		//}
  		//setTimeout(alertTickets, 2000);
  	//}
  };


//別ミドルウェア。これはしっかり整理しないとあかんなぁ…なぜかこちらばかり呼び出され、上のやつが呼び出されない事態が発生している
//const AfterLoginUpdate = store => next => action => {
  //ここでログイン情報を取れることを確認する
  //console.log(action);
  //if(action.type === "SET_TOKEN"){
  	//console.log(tickets + authtoken);
  	//var alertTickets = function(){
  		//console.log('triggering setTicket function');
  		//ここに、Storeへトークンを追加するための新しいアクションを追加する
  		//next(action.success(tickets));
  	//}
  	//setTimeout(alertTickets, 2000);
  //ここの分岐がなぜか発生しない。他のパラメータで試してみる
  //}
 //}

export default logger;