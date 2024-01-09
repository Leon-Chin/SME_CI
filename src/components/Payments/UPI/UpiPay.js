import { useState, Fragment } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckIcon from "@mui/icons-material/Check";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../../../api";
import { message } from "antd";

function UpiPay() {
  const navigate = useNavigate();
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [searchParams] = useSearchParams();
  const patientEmail = searchParams ? searchParams.get("patientEmail") : null;
  const doctorEmail = searchParams ? searchParams.get("doctorEmail") : null;
  const appointmentDate = searchParams
    ? searchParams.get("appointmentDate")
    : null;
  const [confirm, setConfirm] = useState(false);

  async function handleConfirm() {
    setOpenBackdrop(true);
    try {
      const res = await API.makePayment({
        patientEmail,
        doctorEmail,
        appointmentDate,
      });
      if (res.data.error) {
        setOpenBackdrop(false);
        message.error(res.data.errorMsg);
      } else {
        setOpenBackdrop(false);
        message.error(res.data.msg);
        setConfirm(true);
      }
    } catch (error) {
      setOpenBackdrop(false);
      message.error(error.response.data.errorMsg);
      console.error(error);
    }
  }

  function handleClick() {
    navigate("/signin");
  }

  return (
    <Fragment>
      <Container
        maxWidth="lg"
        sx={{
          height: "100vh",
          textAlign: "center",
          paddingTop: "20vh",
          paddingBottom: "3%",
        }}
      >
        <img alt="qr-code" src="/images/paymentQR.png" />
        <br /> <br />
        <Typography variant="body1" gutterBottom component="div">
          {confirm
            ? "Download the invoice."
            : "Scan the above QR to pay appointment fee."}
        </Typography>
        <br /> <br />
        {confirm ? (
          <Fab
            href="/downloadFiles/invoice-demo.pdf"
            download="mhc-pms-payment-invoice"
            color="primary"
            variant="extended"
            onClick={handleClick}
          >
            <FileDownloadIcon /> {" Invoice"}
          </Fab>
        ) : (
          <Fab color="primary" variant="extended" onClick={handleConfirm}>
            <CheckIcon /> {" Confirm"}
          </Fab>
        )}
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

export default UpiPay;
