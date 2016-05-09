if (Meteor.isClient) {
	Meteor.subscribe("friends");
    Template.body.helpers({
        friends: function() {
            return Friends.find();
        }
    });
}
