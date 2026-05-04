import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';

const caminhoPortaSerial = '/dev/ttyUSB0';
const urlBackend = 'http://localhost:3000/api/leitura-sensores';

let dadosSensor = {
  temperatura: 0.0,
  umidade: 0.0,
  umidadeSolo: 0
};

// Inicializa a conexão com a porta serial configurando o caminho e a taxa de transmissão
const serialPort = new SerialPort({
  path: caminhoPortaSerial,
  baudRate: 115200,
});

// Cria um analisador de linha que divide o fluxo de dados sempre que encontra uma quebra de linha
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Executa a função assíncrona sempre que uma linha completa é recebida da porta serial
parser.on('data', async (linha) => {
  const partes = linha.trim().split(',');

  if (partes.length === 3) { // Verifica se a divisão gerou exatamente três elementos
    dadosSensor.umidadeSolo = parseInt(partes[0], 10) || 0; // 10: Define a base numérica (base decimal)
    dadosSensor.umidade = parseFloat(partes[1]) || 0.0;
    dadosSensor.temperatura = parseFloat(partes[2]) || 0.0;

    try {
      await fetch(urlBackend, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosSensor),
      });
    } catch (err) {
      console.error('Erro de conexão:', err.message);
    }
  }
});

console.log(`Gateway iniciado. Enviando para ${urlBackend} usando a porta ${caminhoPortaSerial}`);
