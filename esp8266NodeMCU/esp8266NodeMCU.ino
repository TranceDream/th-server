//一下为该项目需要引入的函数库
#include <ESP8266WiFi.h>
#include <Wire.h>
#include <ESP8266WebServer.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>
#include <FS.h>
#include "font.h"

//以下为一些常量
#define esp8266_ssid "esp8266_zwld"       //自身作为热点时的ssid
#define esp8266_pwd "tju1895"             //自身密码
#define ssid1 "DESKTOP-OISTSQI 4858"      
#define pwd1 "&D358f99"
#define SCREEN_WIDTH 128 // 设置OLED宽度,单位:像素
#define SCREEN_HEIGHT 64 // 设置OLED高度,单位:像素
#define OLED_RESET 3  //RES引脚

const char* host = "api.seniverse.com";     // 将要连接的心知天气地址 
const int httpPort = 80;                    // 将要连接的服务器端口     
String reqUserKey = "SehIsBRZtDBmW7Wc2";   // 私钥
String reqLocation = "Tianjin";            // 城市
String reqUnit = "c";                      // 摄氏/华氏
String reqRes = "/v3/weather/now.json?key=" + reqUserKey +
                  + "&location=" + reqLocation + 
                  "&language=en&unit=" +reqUnit;   //天气预报请求url

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

//定义服务器 端口号80
ESP8266WebServer server(80);

//连接WIFI
void connectWiFi(){
  WiFi.begin(ssid1,pwd1);
  Serial.print("Connecting to ");
  int i=0;
  while(WiFi.status()!= WL_CONNECTED){
    if(i==30){
      Serial.println("");
      Serial.print("OVER TIME!!!");
      return;
    }
    Serial.print(".");
    i++;
    delay(2000);
  }
  Serial.println("Connection Established!!!");
  Serial.println("Connected to "+WiFi.SSID());
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

//启动服务器
void setupServer(){
  server.on("/getRecord",getRecord); //获取温湿度记录
  server.onNotFound(handleRequest); //响应用户信息
  server.begin(); 
}

void handleRequest(){
  //获取资源url
  String url = server.uri();
  Serial.print("Requesting: ");
  Serial.println(url);

  //处理资源文件
  bool fileExit = handleFile(url);
  if(!fileExit){
    server.send(404,"text/plain","404 NOT FOUND!!!");
  }
}

//处理资源文件
bool handleFile(String url){
  if(url.endsWith("/")){
    url="/home.html";
  }

  String contentType = getContentType(url);

  if(SPIFFS.exists(url)){
    File file = SPIFFS.open(url,"r");
    server.streamFile(file,contentType);
    file.close();
    return true;
  }
  return false;
}

void getRecord(){
  Serial.println("getRecord...");
  File recordFile = SPIFFS.open("record.txt","r");
  int i,j; String line;
  for(i=0;i<120;i++){
    line="";
    for(j=0;j<17;j++){
      line += recordFile.read();
    }
  }
}

void WeatherRequest(){
  WiFiClient wc;
  String httpRes = String("GET ")+reqRes+" HTTP/1.1\r\n"+"HOST: "+host+"\r\n"+"Connection:close\r\n\r\n";
  Serial.println("");
  if(wc.connect(host,80)){
    Serial.println("Connected to Weather!!!");
    wc.print(httpRes);
    String status_res = wc.readStringUntil('\n');
    Serial.println("status_res: "+status_res);

    if(wc.find("\r\n\r\n")){
      Serial.println("Skip Header");
    }
    parseWeatherJson(wc);
  }else{
    Serial.println("Connection failed!!!");
  }
  wc.stop();
}

void parseWeatherJson(WiFiClient wc){
  const size_t capacity = JSON_ARRAY_SIZE(1) + JSON_OBJECT_SIZE(1) + 2*JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(6) + 230;
  DynamicJsonDocument doc(capacity);
  
  deserializeJson(doc, wc);
  
  JsonObject results_0 = doc["results"][0];
  
  JsonObject results_0_now = results_0["now"];
  const char* results_0_now_text = results_0_now["text"]; 
  const char* results_0_now_code = results_0_now["code"];
  const char* results_0_now_temperature = results_0_now["temperature"]; 
  
  const char* results_0_last_update = results_0["last_update"]; 
  String results_0_now_text_str = results_0_now["text"].as<String>(); 
  int results_0_now_code_int = results_0_now["code"].as<int>(); 
  int results_0_now_temperature_int = results_0_now["temperature"].as<int>(); 
  String results_0_last_update_str = results_0["last_update"].as<String>(); 
  drawWeather(results_0_now_temperature_int);
}

void drawWeather(int temperature){
  Serial.println(temperature);
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(2);
  display.drawBitmap(5,5,hans_dang,12,12,1);
  display.drawBitmap(20,5,hans_qian,12,12,1);
  display.drawBitmap(35,5,hans_wen,12,12,1);
  display.drawBitmap(50,5,hans_du,12,12,1);
  display.setCursor(65,5);
  display.print(":");
  display.print(temperature);

  display.display();
  delay(2000);
}

void setup(void){
  Serial.begin(115200);
  Serial.println("");
  
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  // 初始化OLED并设置其IIC地址为 0x3C
  connectWiFi();
  setupServer();
}

void loop(){
  WeatherRequest();
  //server.handleClient();
  
}

// 获取文件类型
String getContentType(String filename){
  if(filename.endsWith(".htm")) return "text/html";
  else if(filename.endsWith(".html")) return "text/html";
  else if(filename.endsWith(".css")) return "text/css";
  else if(filename.endsWith(".js")) return "application/javascript";
  else if(filename.endsWith(".png")) return "image/png";
  else if(filename.endsWith(".gif")) return "image/gif";
  else if(filename.endsWith(".jpg")) return "image/jpeg";
  else if(filename.endsWith(".ico")) return "image/x-icon";
  else if(filename.endsWith(".xml")) return "text/xml";
  else if(filename.endsWith(".pdf")) return "application/x-pdf";
  else if(filename.endsWith(".zip")) return "application/x-zip";
  else if(filename.endsWith(".gz")) return "application/x-gzip";
  return "text/plain";
}
