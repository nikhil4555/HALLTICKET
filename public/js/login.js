const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");

const loginRadio = document.getElementById('login');
const signupRadio = document.getElementById('signup');

signupBtn.onclick = (() => {
  loginForm.style.marginLeft = "-50%";
  loginText.style.marginLeft = "-50%";
  loginForm.action = '/register';
});

loginBtn.onclick = (() => {
  loginForm.style.marginLeft = "0%";
  loginText.style.marginLeft = "0%";
  loginForm.action = '/login';
});

signupLink.onclick = (() => {
  signupBtn.click();
  return false;
});

loginRadio.addEventListener('change', function() {
  if (this.checked) {
    loginForm.action = '/login';
  }
});

signupRadio.addEventListener('change', function() {
  if (this.checked) {
    loginForm.action = '/register';
  }
});

//handeling errors in registration
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');

   if (error) {
   // Display the popup based on the error type
    if (error === 'phone') {
    alert('Phone number exists already!!.Try a new nummber');
    } 
    else if (error === 'email') {
    alert('Email exists already!! Try a new Email for registeration');
    }
    else if (error === 'phonecheck') {
     alert('Phone number must be exactly 10 digits long.');
   } else if (error === 'password') {
     alert('Password must be at least 8 characters long, contain at least one number, one lowercase letter, one uppercase letter, and one special character.');
   }
 }
});


