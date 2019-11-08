import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import StudyTabs from "components/StudyTabs/StudyTabs.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import firebase from "firebase/app";
import "firebase/database";

import { red } from "@material-ui/core/colors";

const firebaseConfig = {
  apiKey: "AIzaSyCymwfasOIduBIlff5Axu-U_II1SFH1mpA",
  authDomain: "find-research-studies.firebaseapp.com",
  databaseURL: "https://find-research-studies.firebaseio.com",
  projectId: "find-research-studies",
  storageBucket: "find-research-studies.appspot.com",
  messagingSenderId: "261332989508",
  appId: "1:261332989508:web:a4c08614fc8efad90bae11",
  measurementId: "G-SZ4EF3S9C4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const uid = "001";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  StudyTabs_styles: {
    card: {
      maxWidth: 345
      // height: 70
    },
    media: {
      height: 0
      // paddingTop: '56.25%',
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto"
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: red[500]
    }
  }
};

const useStyles = makeStyles(styles);

const TableList = () => {
  const classes = useStyles();
  const [studies, setStudies] = useState([]);

  useEffect(() => {
    const handleData = snap => {
      let temp = Object.values(snap.val());
      setStudies(temp);
    };
    db.ref("studies").on("value", handleData, error => alert(error));
    return () => {
      db.ref("studies").off("value", handleData);
    };
  }, []);
  //console.log(studies);
  const makeList = studies.map(x => [
    x.sid,
    x.title,
    x.time,
    x.requirement,
    x.payment,
    x.location,
    x.description
  ]);
  //console.log(makeHead);
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        {studies.map(study => <StudyTabs key={study.sid} study={study} db={db} sid={study.sid} uid={uid}/>)}
      </GridItem>
    </GridContainer>
  );
};

export default TableList;