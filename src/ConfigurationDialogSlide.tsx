import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {Grid, TextField} from "@mui/material";
import {Item} from "semantic-ui-react";
import Slider from '@mui/material/Slider';


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  mostrar: (atributos: any, ejemplos: any, valorPositivo: string, valorNegativo: string, camino: Map<number, string>) => void;
};

export default function ConfigurationDialogSlide(props: Props) {
    const [open, setOpen] = React.useState(true);
    const [valorPositivo, setValorPositivo] = React.useState('');
    const [valorNegativo, setValorNegativo] = React.useState('');
    const [atributos, setAtributos] = React.useState<string>();
    const [ejemplos, setEjemplos] = React.useState<string>();
    const [camino, setCamino] = React.useState<Map<number, string>>(new Map([[0, '']]));

    const handleClose = () => {
        setOpen(false);
        props.mostrar(atributos, ejemplos, valorPositivo, valorNegativo, camino);
    };

    const guardarAtributos = async (e: any) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (e.target) {
                const text = (e.target.result);
                setAtributos(text as string);
            }
        };
        reader.readAsText(e.target.files[0]);
    }

    const guardarEjemplos = async (e: any) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async (e) => {
            if (e.target) {
                const text = (e.target.result);
                setEjemplos(text as string);
            }
        };
        reader.readAsText(e.target.files[0]);
    }



    const marcasNAtributos = [
        {
            value: 1,
            label: '1',
        },
        {
            value: 50,
            label: '50',
        },
        {
            value: 100,
            label: '100',
        },
    ];

    const camposDeAtributos = [];
    for (let i = 0; i < camino.size; i++) {
        camposDeAtributos.push(
            <Grid item xs={3}>
                <Item>
                    <TextField
                        label={'Valor para atributo Nº' + (i + 1)}
                        fullWidth
                        value={camino.get(i)}
                        onChange={event => cambiarValorCamino(i, event.target.value)}
                    />
                </Item>
            </Grid>
        );
    }

    const cambiarValorCamino = (pos: number, valor: string) => {
        const _camino = new Map(camino);
        _camino.set(pos, valor);
        setCamino(_camino);
    };

    const cambiarCamino = (nAtributos: number) => {
        const _camino = new Map();

        for (let i = 0; i < nAtributos; i++) {
            if (camino.has(i)) {
                _camino.set(i, camino.get(i));
            } else {
                _camino.set(i, '');
            }
        }

        setCamino(_camino);
    };

    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                maxWidth={'xl'}
                fullWidth
            >
                <DialogTitle>{"Configuración algoritmo ID3"}</DialogTitle>
                <DialogContent style={{paddingTop: 10}}>
                    <Grid container rowSpacing={2} spacing={2} >
                        <Grid item xs={3}>
                            <Item style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    fullWidth
                                    style={{height: '100%'}}
                                    endIcon={!atributos ? <AttachFileIcon /> : <CheckCircleOutlineIcon />}
                                    color={!atributos ? 'primary' : 'success'}
                                >
                                    {!atributos && 'Subir atributos'}
                                    {atributos && 'Atributos subidos'}
                                    {!atributos && (
                                        <input type="file" hidden onChange={(e) => guardarAtributos(e)} />
                                    )}
                                </Button>
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    fullWidth
                                    style={{height: '100%'}}
                                    endIcon={!ejemplos ? <AttachFileIcon /> : <CheckCircleOutlineIcon />}
                                    color={!ejemplos ? 'primary' : 'success'}
                                >
                                    {!ejemplos && 'Subir ejemplos'}
                                    {ejemplos && 'Ejemplos subidos'}
                                    {!ejemplos && (
                                        <input type="file" hidden onChange={(e) => guardarEjemplos(e)} />
                                    )}
                                </Button>
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <TextField
                                    label={'Valor positivo'}
                                    fullWidth
                                    value={valorPositivo}
                                    onChange={event => setValorPositivo(event.target.value)}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={3}>
                            <Item>
                                <TextField
                                    label={'Valor negativo'}
                                    fullWidth
                                    value={valorNegativo}
                                    onChange={event => setValorNegativo(event.target.value)}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={12}>
                            <Item>
                                <h3>Configuración de camino a seguir:</h3>
                            </Item>
                        </Grid>
                        <Grid item xs={2}>
                            <Item>
                                <h5>Número de atributos</h5>
                            </Item>
                        </Grid>
                        <Grid item xs={10}>
                            <Item>
                                <Slider
                                    defaultValue={1}
                                    step={1}
                                    min={1}
                                    max={100}
                                    valueLabelDisplay='on'
                                    marks={marcasNAtributos}
                                    onChange={(event: Event, newValue: number | number[]) => cambiarCamino(newValue as number)}
                                />
                            </Item>
                        </Grid>
                        {camposDeAtributos}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        disabled={!atributos || !ejemplos || valorPositivo === '' || valorNegativo === ''}
                    >
                        Mostrar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
