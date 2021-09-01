#include <Wire.h>
#include <time.h>
#include <sys/time.h>
#include <stdio.h>
#include <string.h>
#include <FS.h>
//#include <SPIFFS.h>

#define ADDRESS_AM2321 0x5C
#define SDA_PIN A4
#define SCL_PIN A5

//当前时间，手动输入
int cur_mon = 8;
int cur_day = 31;
int cur_hour = 17;
byte fuctionCode = 0;
byte dataLength = 0;
byte humiHigh = 0;
byte humiLow = 0;
byte tempHigh = 0;
byte tempLow = 0;
byte crcHigh = 0;
byte crcLow = 0;
//温湿度，浮点数
float humidity = 0;
float temperature = 0;
unsigned int crcCode = 0;
//写入文件的字符串
String file_cont;
//文件位置
String filename = "/data.txt";

void setup() {
  // put your setup code here, to run once:
  Wire.begin();
  Serial.begin(115200);

  //格式化SPIFFS
  SPIFFS.format();
  // 启动SPIFFS
  if(SPIFFS.begin()){
    Serial.println("SPIFFS Started.");
  } else {
    Serial.println("SPIFFS Failed to Start.");
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  //读取AM2321测量的数据
  read_AM2321();
  //控制测数据的时间间隔，1000为1s
  delay(10000);
}

void read_AM2321(){
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
  
  //3 读取传感器数据
  Wire.requestFrom(ADDRESS_AM2321, 8);
  fuctionCode = Wire.read();
  dataLength = Wire.read();
  humiHigh = Wire.read();
  humiLow = Wire.read();
  tempHigh = Wire.read();
  tempLow = Wire.read();
  crcLow = Wire.read();
  crcHigh = Wire.read();

  //4 处理数据
  temperature = ((float)((tempHigh << 8) | tempLow)) / 10;
  humidity = ((float)((humiHigh << 8) | humiLow)) / 10;
  crcCode = (crcHigh << 8) | crcLow;

  //5 数据存入字符串，保留两位小数
  file_cont = (String)temperature + "#" + (String)humidity;

  //6 检查数据是否有效
  CheckCRC();
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
    time_t now;
    struct tm *tm_now;
    time(&now); 
    tm_now = gmtime(&now);
    String mon = (tm_now->tm_mon + cur_mon) > 9 ? (String)(tm_now->tm_mon + cur_mon) : "0" + (String)(tm_now->tm_mon + cur_mon);
    String day = (tm_now->tm_mday + cur_day) > 9 ? (String)(tm_now->tm_mday + cur_day - 1) : "0" + (String)(tm_now->tm_mon + cur_day - 1);
    String hour = (tm_now->tm_hour + cur_hour) > 9 ? (String)(tm_now->tm_hour + cur_hour) : "0" + (String)(tm_now->tm_hour + cur_hour);
    file_cont = mon + day + hour + "#" + file_cont;
    //Serial.println(file_cont);
    //写入文件
    write_file(file_cont);
    read_file();
  }
  else
    Serial.println("CRC Error");
}

void write_file(String str){
  String content = read_file();
  File dataFile = SPIFFS.open(filename, "w");
  dataFile.println(content + str);
  dataFile.close();
}

String read_file(){
  File dataFile = SPIFFS.open(filename, "r");
  String content = "";
  if (dataFile)
  {
    Serial.println("文件内容是：");
    while (dataFile.available())
      content = content + (char)dataFile.read();
    Serial.println(content);
  }
  dataFile.close();
  return content;
}
