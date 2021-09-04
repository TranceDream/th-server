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

void temphumi::check_time(){
  String current_time = cur_time();
    if(fileflag(current_time)){
      read_AM2321();
      CheckCRC(current_time);
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

void temphumi::CheckCRC(String current_time){
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
    file_cont = current_time + "-" + file_cont;
    write_file(file_cont);
    //read_file();
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

/*void temphumi::connectWiFi(){
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to " + WiFi.SSID());
}*/

boolean temphumi::fileflag(String str){
  if(str == timer)
    return false;
  else{
    timer = str;
    return true;  
  }
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
  Serial.println("Add data to DB Successfully. temperature: " + (String)temperature + " humidity: " + (String)humidity);
}
