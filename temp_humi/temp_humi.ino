#include <Wire.h>
#include <time.h>
#include <sys/time.h>
#include <ESP8266WiFi.h>
#include <stdio.h>
#include <string.h>
#include <FS.h>
#include <ESP8266HTTPClient.h>

#define ADDRESS_AM2321 0x5C
#define SDA_PIN A4
#define SCL_PIN A5

//当前时间
int cur_mon, cur_day, cur_hour, cur_min;
time_t now;
struct tm *tm_now;
//int mon_days[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
const char* ssid = "nova 8 Pro"; 
const char* password = "20010130";
WiFiClient client;
HTTPClient http;
String GetUrl;
String response;

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
  boolean flag = false;
  while(!flag){
    flag = get_time();
  }
  Serial.println("Get current time done.");
  //格式化SPIFFS
  //SPIFFS.format();
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
  delay(3600000);
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
  file_cont = (String)temperature + "-" + (String)humidity;

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
    time(&now); 
    tm_now = gmtime(&now);
    int m, d, h;
    h = tm_now->tm_hour + cur_hour;
    d = tm_now->tm_mday + cur_day - 1;
    m = tm_now->tm_mon + cur_mon;
    if(h > 24){
      d += (h / 24);
      h %= 24;  
    }
    String mon = m > 9 ? (String)m : "0" + (String)m;
    String day = d > 9 ? (String)d : "0" + (String)d;
    String hour = h > 9 ? (String)h : "0" + (String)h;
    //String minute = (tm_now->tm_min + cur_min) > 9 ? (String)(tm_now->tm_min + cur_min) : "0" + (String)(tm_now->tm_min + cur_min);
    //file_cont = mon + day + hour + minute + "-" + file_cont;
    file_cont = mon + day + hour + "-" + file_cont;
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

boolean get_time(){
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("Getting time.");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  GetUrl = "http://quan.suning.com/getSysTime.do";
  http.setTimeout(5000);
  http.begin(client,GetUrl);

  int httpCode = http.GET();
  if(httpCode > 0) {
      Serial.printf("[HTTP] GET... code: %d\n", httpCode);
      if (httpCode == HTTP_CODE_OK) {
        //读取响应内容
        response = http.getString();
        cur_mon = atoi(response.substring(50, 52).c_str());
        cur_day = atoi(response.substring(52, 54).c_str());
        cur_hour = atoi(response.substring(54, 56).c_str());
        //cur_min = atoi(response.substring(56, 58).c_str());
        //Serial.println(cur_mon);
        //Serial.println(cur_day);
        //Serial.println(cur_hour);
      }
      return true;
  } 
  else {
      Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      return false;
  }
  http.end();
  delay(3000);
}
