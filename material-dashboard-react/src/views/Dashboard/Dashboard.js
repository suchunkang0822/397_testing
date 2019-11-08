import React, { useState, useEffect } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import EventIcon from '@material-ui/icons/Event';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import firebase from "firebase/app";
import "firebase/database";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import TableList from "views/TableList/TableList.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { bugs, website, server } from "variables/general.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);
const db = firebase.database();

export default function Dashboard() {
  const classes = useStyles();
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
    db.ref("studies").on("value", handleStudies, error => alert(error));
    db.ref("users").on("value", handleUsers, error => alert(error));
    return () => {
      db.ref("studies").off("value", handleStudies);
      db.ref("users").off("value", handleUsers);
    };
  }, []);
  const studyId = users.filter((x)=>x.uid == "001");

  var currDate = new Date();
  var study = studyId[0];

  var studyIds = [];
  var pastStudiesIds = [];
  var upcomingStudiesIds = [];
  var upcomingStudies = [];
  var pastStudies = [];
  if (study !== undefined) {
    studyIds = Object.keys(study["studies"]);
    pastStudiesIds = studyIds.filter((x)=>new Date(study["studies"][x]["start"]) < currDate);
    upcomingStudiesIds = studyIds.filter((x)=>new Date(study["studies"][x]["start"]) >= currDate);
    upcomingStudies = studies.filter((x)=>upcomingStudiesIds.includes(x.sid));
    pastStudies = studies.filter((x)=>pastStudiesIds.includes(x.sid));
  }

  const pastList = pastStudies.map(x => [
    x.sid,
    x.title,
    x.time,
    x.requirement,
    x.payment,
    x.location,
    study["studies"][x.sid]["start"],
    study["studies"][x.sid]["end"]
  ]);
  const futureList = upcomingStudies.map(x => [
    x.sid,
    x.title,
    x.time,
    x.requirement,
    x.payment,
    x.location,
    study["studies"][x.sid]["start"],
    study["studies"][x.sid]["end"]
  ]);
  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <CustomTabs
            title="Your Research Studies:"
            headerColor="primary"
            tabs={[
              {
                tabName: "Upcoming Studies",
                tabIcon: EventIcon,
                tabContent: (
                <Card>
                  <CardBody>
                    <Table
                      tableHeaderColor="primary"
                      tableHead={[
                        "Study ID",
                        "title",
                        "time",
                        "requirement",
                        "payment",
                        "location",
                        "start date/time",
                        "end date/time"
                      ]}
                      tableData={futureList}
                    />
                  </CardBody>
                </Card>
                )
              },
              {
                tabName: "Past Studies",
                tabIcon: ScheduleIcon,
                tabContent: (
                <Card>
                  <CardBody>
                    <Table
                      tableHeaderColor="primary"
                      tableHead={[
                        "Study ID",
                        "title",
                        "time",
                        "requirement",
                        "payment",
                        "location",
                        "start date/time",
                        "end date/time"
                      ]}
                      tableData={pastList}
                    />
                  </CardBody>
                </Card>
                )
              }
            ]}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}
