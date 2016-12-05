import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {_} from 'meteor/underscore';
import {Messages, MessagesSchema} from '../../api/messages/messages.js';

Template.Messages_Page.helpers({

  /**
   * @returns {*} All of the Messages documents.
   */
  messagesList() {
    return Messages.find({}, { sort: { createdAt: -1 } });
  },
  ifUser(user) {
    if (user == Meteor.user().profile.name) {
      return true;
    } else {
      return false;
    }
  },
  updateScroll(){
    var element = document.getElementById('message-container');
    element.scrollTop = element.scrollHeight + 1;
  },
  clearThis(){
    var target = document.getElementById('message');
    if (target.value != '') {
      target.value = "";
    }
  },
});

Template.Messages_Page.onCreated(function onCreated() {
  this.autorun(() => {
    this.subscribe('Messages');
  });
});

Template.Messages_Page.events({
  'submit .new-message'(event){
    event.preventDefault();

    const user = Meteor.user().profile.name;
    const message = event.target.message.value;
    const time = new Date();

    const newMessage = { user, message, time };
    // Clear out any old validation errors.
    // instance.context.resetValidation();
    // Invoke clean so that newSessionData reflects what will be inserted.
    MessagesSchema.clean(newMessage);
    Messages.insert(newMessage);

    //clear form
    event.target.text = '';
  }
});
