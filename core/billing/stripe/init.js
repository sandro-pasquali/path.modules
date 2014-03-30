path
.open('_/module/core/billing/stripe')
.ready(function() {
	console.log("stripe");
	console.log(this);
	Stripe.setPublishableKey('pk_test_B5AfGOPo8XB16Ymo7Neff2bV');
});