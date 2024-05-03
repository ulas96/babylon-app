import logo from "./assets/babylon-logo.png";
import "./style.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

const Navigation = () => {
    


    return (
        

        <Navbar expand="lg" className="sticky-top navbar-container">
            <Container>
            <Navbar.Brand href="/" className="brand-container">
                <img
                    src={logo} // Replace with the path to your logo
                    width="100"
                    height="100"
                    className="d-inline-block align-top"
                    alt="Uruk logo"
                />
                <span className="navbar-text">
                    Babylon
                </span>
            </Navbar.Brand>
            <Navbar.Toggle className="wrap-toggle" aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse  className="basic-navbar-nav">
                <Nav>
                <div className="navbar-header">
                    <h1>Create your own AI powered educational journey</h1>  
                </div>
                </Nav>
            </Navbar.Collapse>

                
            

            </Container>
                     

        </Navbar>
    );
};

export default Navigation;
