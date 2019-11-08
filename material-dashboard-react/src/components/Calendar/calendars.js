import React, { useState, useEffect } from "react";
import moment from "moment";
import c_ss from "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";

import firebase from "firebase/app";
import "firebase/database";

const localizer = momentLocalizer(moment);

const MyCalendar = ({ db, sid, uid }) => {
  const [studies, setStudies] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleStudies = snap => {
      let temp = Object.values(snap.val());
      setStudies(temp);
    };
    const handleUsers = snap => {
      let temp = Object.values(snap.val());
      setUsers(temp);
    };
    //console.log(db);
    db.ref("studies").on("value", handleStudies, error => alert(error));
    db.ref("users").on("value", handleUsers, error => alert(error));
    return () => {
      db.ref("studies").off("value", handleStudies);
      db.ref("users").off("value", handleUsers);
    };
  }, []);

  const study = studies.filter(x => x.sid === sid);
  const event = study[0];
  let events = [];

  const handleSelect = event => {
    var eventDate = new Date(event.enddb);
    var now = new Date();
    if (eventDate <= now) {
      alert("Signup time has passed.");
    } else {
      let time = {
        start: event.startdb,
        end: event.enddb
      };
      //let regist = {};
      //regist[event.id] = time;
      const newPostKey = db
        .ref("users")
        .child(uid)
        .child("studies")
        .child(event.id);
      if (window.confirm("Press OK to sign up for this study.")) {
        newPostKey.set(time);
      }
    }
    // console.log(regist);
    //window.confirm("press") ? txt = "you press ok" : txt = "you press cancel";
  };

  if (event != null) {
    const title = event.title;
    const id = event.sid;
    event.times.map(y => {
      let sigleTime = {};
      sigleTime["id"] = id;
      sigleTime["title"] = title;
      sigleTime["start"] = new Date(y.start);
      sigleTime["end"] = new Date(y.end);
      sigleTime["startdb"] = y.start;
      sigleTime["enddb"] = y.end;
      events.push(sigleTime);
    });
  }
  return (
    <div>
      <Calendar
        onSelectEvent={handleSelect}
        selectable
        localizer={localizer}
        views={["week", "day"]}
        defaultView="week"
        step={60}
        events={events}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
};

export default MyCalendar;
