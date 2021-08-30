//一下为该项目需要引入的函数库
#include <ESP8266WiFi.h>
#include <Wire.h>
#include <ESP8266WebServer.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>
#include <FS.h>

//以下为一些常量
#define esp8266_ssid "esp8266_zwld"       //自身作为热点时的ssid
#define esp8266_pwd "tju1895"             //自身密码
#define ssid1 "DESKTOP-OISTSQI 4858"      
#define pwd1 "&D358f99"
#define SCREEN_WIDTH 128 // 设置OLED宽度,单位:像素
#define SCREEN_HEIGHT 64 // 设置OLED高度,单位:像素
#define OLED_RESET 3  //RES引脚

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
      Serial.print("OVER TIME!!!")
      return;
    }
    Serial.print(".");
    i++;
    delay(2000);
  }
  Serial.println("Connection Established!!!");
  Serial.println("Connected to "+WiFi.SSID());
  Serial.println("IP Address: "+WiFi.localIP());
}

//启动服务器
void setupServer(){
  server.onNotFound(handleRequest); //响应用户信息
  server.begin(); 
}

void handleRequest(){
  
}

void setup(void){
  Serial.begin(115200);
  Serial.println("");
  
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  // 初始化OLED并设置其IIC地址为 0x3C
  connectWiFi();
  setupServer();
}

void loop(){
  server.handleClient();
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
