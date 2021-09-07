#include "temphumi.h"
#include "Arduino.h"

temphumi::temphumi(){
}

temphumi::~temphumi(){
}

void temphumi::th_setup(){
  boolean timeflag = false;
  while(!timeflag){
    timeflag = get_time();
  }
}

void temphumi::check_time(){
    if((millis() - AM2321Previous >= AM2321Interval) || firstFlag){
      AM2321Previous = millis();
      get_time();
      read_AM2321();
      CheckCRC();
      firstFlag = false;
    }
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
    //写入数据库
    addToDB();
    //写入文件
    file_cont = cur_mon + cur_day + cur_hour + "-" + file_cont;
    write_file(file_cont);
  }
  else
    Serial.println("AM2321: CRC Error");  
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
    //Serial.println("文件内容是：");
    while (dataFile.available())
      content = content + (char)dataFile.read();
    //Serial.println(content);
  }
  if(content.length() >= 480)
    content = content.substring(content.length()-461, content.length()-1);
  dataFile.close();
  return content;
}

boolean temphumi::get_time(){
  GetUrl = "http://quan.suning.com/getSysTime.do";
  http.setTimeout(5000);
  http.begin(client,GetUrl);

  int httpCode = http.GET();
  if(httpCode > 0) {
      if (httpCode == HTTP_CODE_OK) {
        //读取响应内容
        response = http.getString();
        cur_mon = response.substring(50, 52);
        cur_day = response.substring(52, 54);
        cur_hour = response.substring(54, 56);
      }
      Serial.println("AM2321: Get current time done.");
      return true;
  } 
  else {
      Serial.printf("AM2321:GET current time failed, error: %s\n", http.errorToString(httpCode).c_str());
      return false;
  }
  http.end();
  delay(3000);
}

void temphumi::addToDB(){
  boolean DBflag = true;
 // if(WiFi.status()!=WL_CONNECTED) connectWiFi();
  while(DBflag){
    std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);
    client->setInsecure();
    https.begin(*client,"https://th-server-backend-xgxx111-outlookcom.vercel.app/api/insert");
    https.addHeader("Content-Type", "application/x-www-form-urlencoded");
    int httpCode = https.POST("temperature=" + (String)temperature +  "&humidity=" + (String)humidity);
    if(httpCode == 200)
      DBflag = false;
    https.end();
  }
  Serial.println("AM2321: Add to DB Successfully. temperature: " + (String)temperature + " humidity: " + (String)humidity);
}
