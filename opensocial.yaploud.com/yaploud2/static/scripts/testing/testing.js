

// For Non Firefox
if (!console) {
	var console = {};
	console.log = function(msg) {
		return false;
	};
}

var Owner = {};

Owner.displayName = null;

Owner.getDisplayName = function() {
    var data = "my name";
    this.displayName = data;
}

Owner.getDisplayName();
//alert(Owner.displayName);


// testing javascript class
function Hello() {
    var greeting = "hello HELLO";
    this.greeting = greeting;

}

console.log(Hello.greeting);
x = new Hello();
console.log(x.greeting);


