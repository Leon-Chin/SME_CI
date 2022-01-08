import { Fragment, useState, useEffect } from "react";
import Container from "@mui/material/Container";
import DashBar from "../../../DashBar/DashBar";
import AppointmentCard from "../../../Cards/AppointmentCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import jwt from "jsonwebtoken";
import api from "../../../../api";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  useEffect(() => {
    async function fetchAppointments() {
      setOpenBackdrop(true);
      try {
        const token = localStorage.getItem("accessToken");
        const payload = token && jwt.decode(token);
        const ptemail = payload.userType === "patient" && payload.email;
        const res = await api.myAppointments();
        if (res.data.error) {
          setOpenBackdrop(false);
          alert(res.data.errorMsg);
        } else {
          setOpenBackdrop(false);
          const appoints = res.data.filter(
            (appoint) => appoint.pemail === ptemail
          );
          setAppointments(appoints);
        }
      } catch (error) {
        setOpenBackdrop(false);
        alert(error.response.data.errorMsg);
        console.log(error);
      }
    }
    fetchAppointments();
  }, []);

  if (appointments.length > 0) {
    return (
      <Fragment>
        <DashBar />
        <Container className="dash-container" maxWidth="md">
          <Grid container spacing={3}>
            {appointments.map((appointment, index) => {
              return (
                <Grid key={index} item xs={12}>
                  <AppointmentCard
                    doc={appointment.doctor}
                    date={appointment.date}
                    pemail={appointment.pemail}
                    demail={appointment.demail}
                    doa={appointment.doa}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <DashBar />
        <Container sx={{ textAlign: "center" }}>
          <Typography
            sx={{ marginTop: "30vh" }}
            variant="h5"
            gutterBottom
            component="div"
          >
            **You have not booked any appointment yet.**
          </Typography>
        </Container>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Fragment>
    );
  }
}

export default MyAppointments;
