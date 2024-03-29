import { Fragment, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import jwt from "jsonwebtoken";
import DashBar from "../../../components/DashBar/DashBar";
import UploadPrescriptionCard from "../../../components/Cards/UploadPrescriptionCard";
import API from "../../../api";
import { message } from "antd";
import { Breadcrumbs, Link } from "@mui/material";

function UploadPrescription() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [defMsg, setDefMsg] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      setOpenBackdrop(true);
      try {
        const token = localStorage.getItem("accessToken");
        const payload = token && jwt.decode(token);
        const doctorEmail = payload.userType === "doctor" && payload.email;
        const res = await API.myAppointments();
        if (res.data.error) {
          setOpenBackdrop(false);
          message.error(res.data.errorMsg);
        } else {
          setOpenBackdrop(false);
          const appoints = res.data.filter(
            (appoint) =>
              appoint.doctorEmail === doctorEmail &&
              appoint.prescribed === false
          );
          setAppointments(appoints);
          setDefMsg(
            appoints.length === 0 && "**No Appointment to prescribe.**"
          );
        }
      } catch (error) {
        setOpenBackdrop(false);
        message.error(error.response.data.errorMsg);
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
        <Breadcrumbs aria-label="breadcrumb">
              <Link
                  underline="hover"
                  color="inherit"
                  href="/dashboard/doctor"
              >
                  Dashboard
              </Link>
              <Typography color="text.primary">Upload Prescription</Typography>
          </Breadcrumbs>
          <Grid container spacing={3}>
            {appointments.map((apmt, index) => {
              return (
                <Grid key={index} item xs={12}>
                  <UploadPrescriptionCard
                    useKey={index}
                    // TODO: replace with patient name
                    patient={apmt.patient}
                    date={apmt.date}
                    patientEmail={apmt.patientEmail}
                    doctorEmail={apmt.doctorEmail}
                    appointmentDate={apmt.appointmentDate}
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
        <Container className="dash-container" maxWidth="lg">
        <Breadcrumbs aria-label="breadcrumb">
              <Link
                  underline="hover"
                  color="inherit"
                  href="/dashboard/doctor"
              >
                  Dashboard
              </Link>
              <Typography color="text.primary">Upload Prescription</Typography>
          </Breadcrumbs>
          <Container sx={{ textAlign: "center" }}>
            <Typography
              sx={{ marginTop: "30vh" }}
              variant="h5"
              gutterBottom
              component="div"
            >
              {defMsg}
            </Typography>
          </Container>
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

export default UploadPrescription;
