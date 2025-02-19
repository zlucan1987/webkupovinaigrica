import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";
import SmjerService from "../../services/SmjerService";


export default function KupciDodaj(){

    const navigate = useNavigate();

    async function dodaj(kupac){
        const odgovor = await KupacService.dodaj(kupac);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.KUPAC_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        dodaj({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            ulica: podaci.get('ulica'),
            mjesto: podaci.get('mjesto'),
            vaucer: podaci.get('vaucer') === 'on' ? true : false
          }
        );
    }

    return(
    <>
    Dodavanje smjera
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="ime">
            <Form.Label>Ime</Form.Label>
            <Form.Control type="text" name="ime" required />
        </Form.Group>

        <Form.Group controlId="prezime">
            <Form.Label>Prezime</Form.Label>
            <Form.Control type="number" name="prezime" step={0.01} />
        </Form.Group>

        <Form.Group controlId="ulica">
            <Form.Label>Ulica</Form.Label>
            <Form.Control type="date" name="ulica" />
        </Form.Group>


        <Form.Group controlId="mjesto">
            <Form.Label>Mjesto</Form.Label>
            <Form.Control type="date" name="ulica" />
        </Form.Group>

        <hr/>

        <Row>
            <Col xs={6} sm={6} md={3} lg={2} xl={6} xxl={6}>
                <Link
                to={RouteNames.SMJER_PREGLED}
                className="btn btn-danger siroko"
                >Odustani</Link>
            </Col>
            <Col xs={6} sm={6} md={9} lg={10} xl={6} xxl={6}>
                <Button variant="success" type="submit" className="siroko">
                    Dodaj smjer
                </Button>
            </Col>
        </Row>


    </Form>




   
    </>
    )
}