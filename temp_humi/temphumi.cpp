#include "temphumi.h"
#include "Arduino.h"

temphumi::temphumi(){
}

temphumi::~temphumi(){
}

String temphumi::read_AM2321(){
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

  return file_cont;
}

void temphumi::CheckCRC(){
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
    String current_time = cur_time();
    file_cont = current_time + "-" + file_cont;
    //写入文件
    write_file(file_cont);
    read_file();
  }
  else
    Serial.println("CRC Error");  
}

String temphumi::cur_time(){
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

  return (mon + day + hour);
}

void temphumi::write_file(String str){
  String content = read_file();
  File dataFile = SPIFFS.open(filename, "w");
  dataFile.println(content + str);
  dataFile.close();
}

String temphumi::read_file(){
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

boolean temphumi::get_time(){
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
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
