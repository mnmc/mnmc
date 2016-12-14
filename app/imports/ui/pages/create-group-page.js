import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Groups, GroupsSchema } from '../../api/groups/groups.js';

/* eslint-disable no-param-reassign */

const displayErrorMessages = 'displayErrorMessages';

Template.Create_Group_Page.onCreated(function onCreated() {
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displayErrorMessages, false);
  this.context = GroupsSchema.namedContext('Create_Group_Page');
});

Template.Create_Group_Page.helpers({
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  displayFieldError(fieldName) {
    const errorKeys = Template.instance().context.invalidKeys();
    return _.find(errorKeys, (keyObj) => keyObj.name === fieldName);
  },
});

Template.Create_Group_Page.onRendered(function enableSemantic() {
  const instance = this;
  instance.$('select.ui.dropdown').dropdown();
  instance.$('.ui.selection.dropdown').dropdown();
  instance.$('ui.fluid.search.dropdown').dropdown();
});

Template.Create_Group_Page.events({
  'submit .group-data-form'(event, instance) {
    event.preventDefault();
    // console.log(Groups.get('eventModal'));
    // let newGroup = Groups.get('eventModal');

    const name = event.target.name.value;
    const description = event.target.description.value;
    const course =  event.target.course.value;
    let members = [];
    let image = 'images/CSLogo1.png';
    if (event.target.image.value != '' ) {
      image = event.target.image.value;
    }

    // const newGroup = { name, course, description};
    newGroup = {name, course, description, members, image };
    // Clear out any old validation errors.
    instance.context.resetValidation();
    // Invoke clean so that newGroup reflects what will be inserted.
    GroupsSchema.clean(newGroup);
    // Determine validity.
    instance.context.validate(newGroup);
    if (instance.context.isValid()) {
      Groups.insert(newGroup);
      instance.messageFlags.set(displayErrorMessages, false);
      $('.ui.modal.groups-modal')
          .modal('hide')
      ;
      //FlowRouter.go('Public_Landing_Page');
    } else {
      console.log("invalid");
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },

  'click .cancel'(event, instance){
    event.preventDefault();
    console.log('cancel');
    $('.ui.modal.groups-modal')
        .modal('hide')
    ;
  },
});