import { useEffect, useState } from "react"
import SmjerService from "../../services/SmjerService"
import { Button, Table } from "react-bootstrap";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { GrValidate } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";


export default function SmjeroviPregled(){

    const[smjerovi, setSmjerovi] = useState();
    const navigate = useNavigate();

    async function dohvatiSmjerove(){
        const odgovor = await SmjerService.get()
        setSmjerovi(odgovor)
    }

    // hooks (kuka) se izvodi prilikom dolaska na stranicu Smjerovi
    useEffect(()=>{
        dohvatiSmjerove();
    },[])


    function formatirajDatum(datum){
        if(datum==null){
            return 'Nije definirano'
        }
        return moment.utc(datum).format('DD. MM. YYYY.')
    }

    function vaucer(v){
        if(v==null) return 'gray'
        if(v) return 'green'
        return 'red'
    }

    function vaucerText(v){
        if(v==null) return 'Nije definirano'
        if(v) return 'Vaučer'
        return 'NIJE vaučer'
    }

    function obrisi(sifra){
        if(!confirm('Sigurno obrisati')){
            return;
        }
        brisanjeSmjera(sifra);
    }

    async function brisanjeSmjera(sifra) {
        const odgovor = await SmjerService.obrisi(sifra);
        if(odgovor.greska){
            alert(odgovor.poruka);
            return;
        }
        dohvatiSmjerove();
    }


    return(
        <>
        <Link
        to={RouteNames.SMJER_NOVI}
        className="btn btn-success siroko"
        >Dodaj novi smjer</Link>
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Ime</th>
                    <th>Prezime</th>
                    <th>Ulica</th>
                    <th>Mjesto</th>
                    <th>Akcija</th>
                </tr>
            </thead>
            <tbody>
                {smjerovi && smjerovi.map((kupac,index)=>(
                    <tr key={index}>
                        <td>
                            {kupac.ime}
                        </td>
                        <td>
                            {kupac.prezime}
                        </td>
                        <td>
                            {kupac.ulica}
                        </td>
                        <td>
                            {kupac.mjesto}
                        </td>
                     
                        
                        <td>
                            <Button
                            onClick={()=>navigate(`/smjerovi/${kupac.sifra}`)}
                            >Promjena</Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            onClick={()=>obrisi(kupac.sifra)}
                            >Obriši</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    )


}