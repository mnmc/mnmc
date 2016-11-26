import {Tracker} from 'meteor/tracker';
import {Sessions, SessionsSchema} from '../../api/sessions/sessions.js';

let isPast = (date) => {
  // Get access to today's moment
  let today = moment().format();
  return moment(today).isAfter(date);
};

// Subscribe to the "events" collection.
Template.Calendar_Page.onCreated(() => {
  let template = Template.instance();
  template.subscribe('Sessions');
});

Template.Calendar_Page.onRendered(() => {
  // Initialize the calendar.
  $('#sessions-calendar').fullCalendar({
    // Add events to the calendar.
    events(start, end, timezone, callback) {
      let data = Sessions.find().fetch().map((session) => {
        // Don't allow already past study sessions to be editable.
        session.editable = !isPast(session.start);
        return session;
      });

      if (data) {
        callback(data);
      }
    },
    eventRender(session, element) {
      element.find('.fc-content').html(
          `<h4 class="course">${ session.course }</h4>
         <p class="topic">${ session.topic }</p>
        `
      );
    },
    // Drag and drop events.
    eventDrop(session, delta, revert) {
      let date = session.start.format();
      if (!isPast(date)) {
        let update = {
          _id: session._id,
          start: date,
          end: date
        };

        Meteor.call('editEvent', update, (error) => {
          if (error) {
            Bert.alert(error.reason, 'danger');
          }
        });
      } else {
        revert();
        Bert.alert('Sorry, you can\'t move items to the past!', 'danger');
      }
    },
    // Modal to add event when clicking on a day.
    dayClick(date, session) {
      Session.set('eventModal', { type: 'add', date: date.format() });
      console.log("here");
      //$( '#add-edit-event-modal' ).modal( 'show' );
      $('#add-edit-event-modal')
          .modal('show')
      ;
    },

    // Directs to study session detail page.
    eventClick(event) {
      Session.set('eventModal', { type: 'edit', event: event._id });
      FlowRouter.go('Study_Session_Detail_Page', { _id: event._id });
      // $( '#add-edit-event-modal' ).modal( 'show' );
    }
  });

  // Updates the calendar if there are changes.
  Tracker.autorun(() => {
    Sessions.find().fetch();
    $('#sessions-calendar').fullCalendar('refetchEvents');
  });
});