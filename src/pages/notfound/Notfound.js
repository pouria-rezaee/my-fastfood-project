import { NavLink } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import errorimg from "../../assets/svg/undraw_page_not_found_re_e9o6-orange.svg";
import "./Notfound.css";

function Notfound() {
  return (
    <div className="notfoundcontainer">
      <Container>
        <Row>
          <Col xs={12} md={6}>
            <p className="text">صفحه مورد نظر پیدا نشد!!</p>
            <NavLink to="/">
              <button className="button">بازگشت به خانه</button>
            </NavLink>
          </Col>
          <Col xs={12} md={6}>
            <img className="errorpic" src={errorimg} alt="" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default Notfound;
