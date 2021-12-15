import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate, useLocation } from "react-router-dom";
import "./DashCard.css";

export default function DashCard(props) {
  let navigate = useNavigate();
  const { pathname } = useLocation();

  function handleClick(cardTitle) {
    let tab = cardTitle.toLowerCase();
    const tabName = tab.split(" ").join("-");
    navigate(`${pathname}/${tabName}`);
  }

  return (
    <Card
      className="card-bg"
      sx={{ maxWidth: "100%" }}
      variant="outlined"
      onClick={() => handleClick(props.cardTitle)}
    >
      <CardContent>
        <br /> <br />
        <Typography variant="h4" component="div">
          {props.cardTitle}
        </Typography>
        <br /> <br />
      </CardContent>
    </Card>
  );
}