import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

let dadosSensor = {
  temperatura: 0.0,
  umidade: 0.0,
  umidadeSolo: 0,
  timestamp: null
};

// Endpoint para leitura dos dados (GET)
app.get('/api/leitura-sensores', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(dadosSensor);
});

// Endpoint para atualização dos dados pelo Gateway (POST)
app.post('/api/leitura-sensores', (req, res) => {
  const { temperatura, umidade, umidadeSolo } = req.body;

  if (temperatura !== undefined && umidade !== undefined && umidadeSolo !== undefined) {
    dadosSensor = {
      temperatura,
      umidade,
      umidadeSolo,
      timestamp: new Date().toISOString()
    };
    return res.status(200).json({
      mensagem: 'Dados atualizados com sucesso.',
      dados: dadosSensor
    });
  }

  res.status(400).json({ erro: 'Dados incompletos ou formato inválido.' });
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});
