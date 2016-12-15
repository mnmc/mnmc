import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Groups } from '../../api/groups/groups.js';
import { Users } from '../../api/users/users.js';

Template.Group_Details_Page.onCreated(function onCreated() {
  this.autorun(() => {
    this.subscribe('Groups');
    this.subscribe('Users');
  });
});

Template.Group_Details_Page.helpers({
  groupsList() {
    return Groups.find();
  },
  groupDataField(fieldName) {
    const groupData = Groups.findOne(FlowRouter.getParam('_id'));
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    return groupData && groupData[fieldName];
  },
  membersList() {
    const groupData = Groups.findOne(FlowRouter.getParam('_id'));
    // See https://dweldon.silvrback.com/guards to understand '&&' in next line.
    console.log('Details Members' + groupData['members']);
    return groupData['members'];
  },
  hasTutorial(){
    return Users.findOne({ username: Meteor.user().profile.name }).tutorial;
  }
});

Template.Group_Details_Page.events({
  'click .edit-group'(event, instance) {
    $('.ui.modal.edit-modal')
        .modal('show')
    ;
  },
  'click .add-member'(event, instance) {
    $('.ui.modal.add-member-modal')
        .modal('show')
    ;
  },
});
