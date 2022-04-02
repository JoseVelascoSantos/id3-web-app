import React, {useEffect} from 'react';
import './App.css';
// @ts-ignore
import { AnimatedTree } from 'react-tree-graph';
import ID3 from './ID3';
import ConfigurationDialogSlide from "./ConfigurationDialogSlide";
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';

function App() {
  const [data, setData] = React.useState({});
  const [solucionCamino, setSolucionCamino] = React.useState('');
  const [id3, setID3] = React.useState<ID3>();

  useEffect(() => {
    id3?.toConsole();
    if (id3) {
      const carga = (_data: any, nodo: any, nombreAristaLlegada: string) => {
        if (nodo) {
          if (nombreAristaLlegada) {
            _data.name = '(' + nombreAristaLlegada + ') ' + nodo.nombre;
          } else {
            _data.name = nodo.nombre;
          }
          _data.textProps = {x: -25, y: 25};
          _data.children = [];
          _data.pathProps = {className: nodo.pasaCamino ? 'red' : 'black'};
          _data.gProps = {className: nodo.pasaCamino ? 'nodeSelected' : 'node'};

          if (nodo.aristas) {
            nodo.aristas.forEach((arista: any) => {
              const hijo = {}
              carga(hijo, arista.vertice, arista.nombre);
              _data.children.push(hijo);
            });
          } else if (nodo.pasaCamino) {
            setSolucionCamino(nodo.nombre);
          }
        }
      };

      let _data = {};
      carga(_data, id3.raiz, '');
      setData(_data);
    }
  }, [id3]);

  const calcular = (atributos: any, ejemplos: any, valorPositivo: string, valorNegativo: string, camino: Map<number, string>) => {
    setID3(new ID3(atributos, ejemplos, valorPositivo, valorNegativo, camino));
  };

  const handleClick = (event: any, node: any) => {
    console.log('handle click ', event);
    console.log('handle click node', node);
    alert(`${node} got clicked`);
  };

  return (
    <div className="container">
      <ConfigurationDialogSlide mostrar={calcular} />
      {id3 && (
        <>
          {solucionCamino !== '' && (
              <Alert variant='filled' severity="info" color="info">
                El resultado del camino es: <strong>{solucionCamino}</strong>
              </Alert>
          )}
          {solucionCamino === '' && (
              <Alert variant='filled' severity="warning">
                No se ha indicado un camino o no es válido el camino
              </Alert>
          )}
          <IconButton onClick={() => window.location.reload()}><ReplayIcon /></IconButton>
          <AnimatedTree
              data={data}
              nodeRadius={200}
              margins={{ top: 20, bottom: 10, left: 20, right: 200 }}
              gProps={{
                className: 'node',
                onClick: handleClick,
              }}
              height={window.innerHeight}
              width={window.innerWidth}
              animated
          />
        </>
      )}
    </div>
  );
}

export default App;
