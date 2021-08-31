#include <Wire.h>
#include <time.h>

#define ADDRESS_AM2321 0x5C
#define SDA_PIN A4
#define SCL_PIN A5

byte fuctionCode = 0;
byte dataLength = 0;
byte humiHigh = 0;
byte humiLow = 0;
byte tempHigh = 0;
byte tempLow = 0;
byte crcHigh = 0;
byte crcLow = 0;

int humidity = 0;
int temperature = 0;
unsigned int crcCode = 0;

void setup() {
  // put your setup code here, to run once:
  Wire.begin();
  Serial.begin(115200);
}

void loop() {
  // put your main code here, to run repeatedly:
  //1
  Wire.beginTransmission(ADDRESS_AM2321);
  Wire.endTransmission();

  delayMicroseconds(800);
  
  //2 
  Wire.beginTransmission(ADDRESS_AM2321);
  Wire.write(0x03);
  Wire.write(0x00);
  Wire.write(0x04);
  Wire.endTransmission();

  delayMicroseconds(1500);
  
  //3
  Wire.requestFrom(ADDRESS_AM2321, 8);
  fuctionCode = Wire.read();
  dataLength = Wire.read();
  humiHigh = Wire.read();
  humiLow = Wire.read();
  tempHigh = Wire.read();
  tempLow = Wire.read();
  crcLow = Wire.read();
  crcHigh = Wire.read();

  //4
  humidity = (humiHigh<<8) | humiLow;
  temperature = (tempHigh<<8) | tempLow;
  crcCode = (crcHigh<<8) | crcLow;

  Serial.print(temperature/10.0, 1);
  Serial.println(" 摄氏度");
  Serial.print(humidity/10.0, 1);
  Serial.println(" \%RH");

  CheckCRC();
  delay(400);
}

void CheckCRC() {
  byte result[] = {fuctionCode, dataLength, humiHigh, humiLow, tempHigh, tempLow};
  unsigned int crc = 0xFFFF;
  int tmp = 0;
  for(int i = 0; i < 6; i++){
    crc ^= result[tmp];
    tmp++;
    for(int j = 0; j < 8; j++){
      if(crc & 0x01){
        crc >>= 1;
        crc ^= 0xA001;
      }
      else{
        crc >>= 1;  
      }
    }
  }
  if(crc == crcCode){
    Serial.println("当前温湿度：");
    //char *wday[] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
    //time_t timep;
    //struct tm *p;
    //time(&timep);
    //p = gmtime(&timep);
    //Serial.printf("%d/%d/%d", (1900+p->tm_year), (1+p->tm_mon), p->tm_mday);
    //Serial.printf("%s %d:%d:%d\n", wday[p->tm_wday], p->tm_hour, p->tm_min, p->tm_sec);
  }
  else
    Serial.println("CRC Error");
}
