import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import moment from "moment";
import SmjerService from "../../services/SmjerService";
import { useEffect, useState } from "react";


export default function SmjeroviPromjena(){

    const navigate = useNavigate();
    const [smjer,setSmjer] = useState({});
    const [vaucer,setVaucer] = useState(false)
    const routeParams = useParams();

    async function dohvatiSmjer(){
        const odgovor = await SmjerService.getBySifra(routeParams.sifra)

        if(odgovor.izvodiSeOd!=null){
            odgovor.izvodiSeOd = moment.utc(odgovor.izvodiSeOd).format('yyyy-MM-DD')
        }
        
        setSmjer(odgovor)
        setVaucer(odgovor.vaucer)
    }

    useEffect(()=>{
        dohvatiSmjer();
    },[])

    async function promjena(smjer){
        const odgovor = await SmjerService.promjena(routeParams.sifra,smjer);
        if(odgovor.greska){
            alert(odgovor.poruka)
            return
        }
        navigate(RouteNames.SMJER_PREGLED)
    }

    function odradiSubmit(e){ // e je event
        e.preventDefault(); // nemoj odraditi zahtjev na server pa standardnom načinu

        let podaci = new FormData(e.target);

        promjena(
            {
                naziv: podaci.get('naziv'),
                cijenaSmjera: parseFloat(podaci.get('cijenaSmjera')),
                izvodiSeOd: moment.utc(podaci.get('izvodiSeOd')),
                vaucer: podaci.get('vaucer')=='on' ? true : false
            }
        );
    }

    return(
    <>
    Promjena smjera
    <Form onSubmit={odradiSubmit}>

        <Form.Group controlId="naziv">
            <Form.Label>Naziv</Form.Label>
            <Form.Control type="text" name="naziv" required 
            defaultValue={smjer.naziv}/>
        </Form.Group>

        <Form.Group controlId="cijenaSmjera">
            <Form.Label>Cijena</Form.Label>
            <Form.Control type="number" name="cijenaSmjera" step={0.01} 
            defaultValue={smjer.cijenaSmjera}/>
        </Form.Group>

        <Form.Group controlId="izvodiSeOd">
            <Form.Label>Izvodi se od</Form.Label>
            <Form.Control type="date" name="izvodiSeOd" 
            defaultValue={smjer.izvodiSeOd}/>
        </Form.Group>


        <Form.Group controlId="vaucer">
            <Form.Check label="Vaučer" name="vaucer" 
                onChange={(e)=>setVaucer(e.target.checked)}
                checked={vaucer}  />
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
                    Promjeni smjer
                </Button>
            </Col>
        </Row>


    </Form>




   
    </>
    )
}