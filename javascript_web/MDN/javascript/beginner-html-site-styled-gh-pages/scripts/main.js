/**
 * Created by shawn on 2017. 5. 2..
 */
var myHeading = document.querySelector('h1');
var myButton = document.querySelector('button');

var myImage = document.querySelector('img');

myImage.onclick = function() {
  var mySrc = myImage.getAttribute('src');
  if(mySrc === 'images/firefox-icon.png') {
    myImage.setAttribute ('src','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNCB4FK7dqSNiIVpFvHmXukLk0ig6QXxQjqylmhclzf7UE5h9h');
  } else {
    myImage.setAttribute ('src','images/firefox-icon.png');
  }
};

function setUserName() {
  var myName = prompt('please enter your name');
  localStorage.setItem('name', myName);
  myHeading.innerHTML = 'hello ' + myName;
}

if(!localStorage.getItem('name')){
  setUserName();
}else {
  var storedName = localStorage.getItem('name');
  myHeading.innerHTML = 'Hello ' + storedName;
}

myButton.onclick = function () {
  setUserName();
};