#include "DHT.h"

#define SENSOR_PIN A0
#define DHTPIN 2
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(SENSOR_PIN, INPUT);
}

void loop() {
  // Sensor requer intervalo de leitura mínimo de 2 segundos
  delay(2000);

  float umidade = dht.readHumidity();
  float temperatura = dht.readTemperature();

  if (isnan(umidade) || isnan(temperatura)) {
    Serial.println(F("Falha na leitura do sensor DHT22"));
    return;
  }

  unsigned int sensorValor = analogRead(SENSOR_PIN);
  // converte intervalo de 10 bits (0 a  1023) para porcentagem proporcional
  unsigned int umidadeSolo = (sensorValor * 100UL) / 1023;
  // Unsigned long (UL) é usado na multiplicação para prevenir estouro de inteiro
  // pois 1023 * 100 > 16 bits

  Serial.println(F("---UMIDADE DO SOLO---"));
  Serial.print(F("Output: "));
  Serial.print(umidadeSolo);
  Serial.println(F("%"));

  Serial.println(F("---UMIDADE E TEMPERATURA DO AMBIENTE---"));
  Serial.print(temperatura);
  Serial.print(F(" ºC | Umidade: "));
  Serial.print(umidade);
  Serial.println(" %");
}
