import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Threat from "../../../../components/Threat";
import { Card } from "antd";
import { CloseButton } from "react-bootstrap";
import { apiURL } from "../../../../App";

export default function AdminForumEdit() {
  //refs
  const location = useLocation();
  const navigate = useNavigate();

  //states
  const [threat, setThraet] = useState();

  //effects
  useEffect(() => {
    const api = apiURL + "threats/" + location.state.id;

    fetch(api)
      .then((res) => res.json())
      .then((threat) => {
        setThraet(threat);
      });
  }, []);

  console.log(threat);

  return (
    <Card className="bg-white s">
      <CloseButton
        onClick={() => navigate("./..")}
        className="d-block ms-auto mb-2"
      />
      {threat && <Threat threat={threat} isAdmin={true} />}
    </Card>
  );
}
