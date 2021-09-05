//一下为该项目需要引入的函数库
#include <ESP8266WiFi.h>
#include <Wire.h>
#include <ESP8266WebServer.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <FS.h>
#include "temphumi.h"
#include "font.h"
#include "LED.h"

//以下为一些常量
#define esp8266_ssid "esp8266_zwld"       //自身作为热点时的ssid
#define esp8266_pwd "tju1895!"             //自身密码
#define SCREEN_WIDTH 128 // 设置OLED宽度,单位:像素
#define SCREEN_HEIGHT 64 // 设置OLED高度,单位:像素
#define OLED_RESET 3  //RES引脚

HTTPClient http;
String wifissid;
String wifipwd;
unsigned long previousMillis = 0;
unsigned long WiFiPrevious = 0;
unsigned long WiFiInterval = 1000*10;
unsigned long interval = 1000*60*30;
bool first = true;
bool WiFiFlag = true;
bool WiFifirst = true;
const String TimeUrl = "http://quan.suning.com/getSysTime.do";
const char* host = "api.seniverse.com";     // 将要连接的心知天气地址 
const int httpPort = 80;                    // 将要连接的服务器端口     
String reqUserKey = "SehIsBRZtDBmW7Wc2";   // 私钥
String reqLocation = "Tianjin";            // 城市
String reqUnit = "c";                      // 摄氏/华氏
String reqRes = "/v3/weather/now.json?key=" + reqUserKey +
                  + "&location=" + reqLocation + 
                  "&language=en&unit=" +reqUnit;   //天气预报请求url
String RoughHttp = String("GET ")+reqRes+" HTTP/1.1\r\n"+"HOST: "+host+"\r\n"+"Connection:close\r\n\r\n";


String DetailReq = "/v3/weather/daily.json?key=" + reqUserKey +
                  + "&location=" + reqLocation + "&language=en&unit=" +
                  reqUnit + "&start=0&days=3";    //详细天气信息请求url
String DetailHttp = String("GET ")+DetailReq+" HTTP/1.1\r\n"+"HOST: "+host+"\r\n"+"Connection:close\r\n\r\n";

DynamicJsonDocument detailDoc(256);

int roughTem;
String weather;

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

//定义服务器 端口号80
ESP8266WebServer server(80);
temphumi TH; //温湿度对象
LED led;  //LED对象

int second; //系统重置后的秒数

//建立局域网
void initWiFi(){
  WiFi.mode(WIFI_AP_STA);
  WiFi.softAP(esp8266_ssid,esp8266_pwd);
  Serial.println("");
  Serial.println(WiFi.softAPIP());
  Serial.println(WiFi.localIP());
}

//连接WIFI
void connectWiFi(const char*ssid,const char*pwd){
  WiFi.mode(WIFI_STA);
  Serial.println(ssid);
  Serial.println(pwd);
  WiFi.begin(ssid,pwd);
  Serial.print("Connecting to ");
  int i=0;
  while(WiFi.status()!= WL_CONNECTED){
    if(i==30){
      Serial.println("");
      Serial.print("OVER TIME!!!");
      //return;
    }
    Serial.print(".");
    i++;
    delay(2000);
  }
  Serial.println("Connection Established!!!");
  Serial.println("Connected to "+WiFi.SSID());
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  WiFiFlag = false;
  TH.th_setup();
}

//启动服务器
void setupServer(){
  server.on("/getTH",getTH);//获取当前温湿度
  server.on("/setLed",setLed); //开关LED
  server.on("/adjustLed",adjustLed);//调节LED亮度
  server.on("/getWeather",getWeather);//返回天气信息
  //server.on("/",toconnect);  //获取网络列表
  server.on("/wifi",towifiApi);  //选择SSID
  server.on("/getWiFiList",getWiFi);  //扫描并发送SSID
  server.on("/getPWD",getPWD); //获取密码
  server.onNotFound(handleRequest); //响应用户信息
  server.begin(); 
  Serial.println("HTTP server started");
  if(SPIFFS.begin()){
    Serial.println("SPIFFS ON");
  }
}

//首页
/*void toconnect(){
  String url = "/connect.html";
  if(SPIFFS.exists(url)){
    Serial.println(url);
    File file = SPIFFS.open(url,"r");
    server.streamFile(file, "text/html");
    file.close();
  }
}*/

//后端获取ssid
void towifiApi(){
  Serial.println("get HERE!!!!");
  wifissid = server.arg("ssid");
  server.send(200,"text/plain","OK");
}

//扫描Wifi
void getWiFi(){
  WiFi.scanNetworks(true);
  delay(3000);
  int n = WiFi.scanComplete();  
  DynamicJsonDocument doc(512);
  for(int i = 0;i<n;i++){
    doc[WiFi.SSID(i)] = WiFi.SSID(i);
  }
  String wifiJson;
  serializeJson(doc,wifiJson);
  server.send(200,"application/json",wifiJson);
}

//后端获取密码
void getPWD(){
  wifipwd = server.arg("pwd");
  Serial.println(wifipwd);
  connectWiFi(wifissid.c_str(),wifipwd.c_str());
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
    url="/connect.html";
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

String getTime(){
  WiFiClient client;
  http.begin(client,TimeUrl);
  int httpCode = http.GET();
  if(httpCode>0){
    Serial.printf("HTTPCODE: %d\n",httpCode);
    if(httpCode == HTTP_CODE_OK){
      String res = http.getString();
      String timeString = res.substring(50,60);
      return timeString;
    }
  }
  else return "getTime ERROR!!!";
}

void getTH(){
  Serial.println("getTH...");
  String temhum = TH.read_AM2321();
  int i = temhum.indexOf('-');
  float tem = temhum.substring(0,i).toFloat();
  float hum = temhum.substring(i+1,temhum.length()).toFloat();
  String t = getTime();
  DynamicJsonDocument doc(96);
  doc["temperature"] = tem;
  doc["humidity"] = hum;
  doc["time"] = t;
  String THjson;
  serializeJson(doc,THjson);
  server.send(200,"application/json",THjson);
}

void setLed(){
  led.handleLED();
}

void adjustLed(){
  int brightness = server.arg("brightness").toInt();
  led.adjustLed(brightness);
}

void getWeather(){
  WeatherRequest(DetailHttp);
  String WeatherJson;
  serializeJson(detailDoc,WeatherJson);
  server.send(200,"application/json",WeatherJson);
}

void WeatherRequest(String httpRes){
  WiFiClient wc;
  //String httpRes = String("GET ")+reqRes+" HTTP/1.1\r\n"+"HOST: "+host+"\r\n"+"Connection:close\r\n\r\n";
  Serial.println("");
  delay(2000);
  if(wc.connect(host,80)){
    Serial.println("Connected to Weather!!!");
    wc.print(httpRes);
    String status_res = wc.readStringUntil('\n');
    Serial.println("status_res: "+status_res);

    if(wc.find("\r\n\r\n")){
      Serial.println("Skip Header");
    }
    if(httpRes.equals(RoughHttp))
    parseRoughWeatherJson(wc);
    else
    parseDetailWeatherJson(wc);
  }else{
    Serial.println("Connection failed!!!");
  }
  wc.stop();
}

void parseRoughWeatherJson(WiFiClient wc){
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
  drawWeather(results_0_now_temperature_int,results_0_now_text_str);
}

void parseDetailWeatherJson(WiFiClient wc){
  const size_t capacity = JSON_ARRAY_SIZE(1) + JSON_ARRAY_SIZE(3) + JSON_OBJECT_SIZE(1) + JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(6) + 3*JSON_OBJECT_SIZE(14) + 860;
  
  DynamicJsonDocument doc(capacity);
  
  deserializeJson(doc, wc);
  
  JsonObject results_0 = doc["results"][0];
  
  JsonArray results_0_daily = results_0["daily"];
  
  JsonObject results_0_daily_0 = results_0_daily[0];
  const char* results_0_daily_0_date = results_0_daily_0["date"]; 
  const char* results_0_daily_0_text_day = results_0_daily_0["text_day"]; 
  const char* results_0_daily_0_code_day = results_0_daily_0["code_day"];
  const char* results_0_daily_0_text_night = results_0_daily_0["text_night"]; 
  const char* results_0_daily_0_code_night = results_0_daily_0["code_night"]; 
  const char* results_0_daily_0_high = results_0_daily_0["high"];
  const char* results_0_daily_0_low = results_0_daily_0["low"]; 
  const char* results_0_daily_0_rainfall = results_0_daily_0["rainfall"];
  const char* results_0_daily_0_precip = results_0_daily_0["precip"]; 
  const char* results_0_daily_0_wind_direction = results_0_daily_0["wind_direction"]; 
  const char* results_0_daily_0_wind_direction_degree = results_0_daily_0["wind_direction_degree"];
  const char* results_0_daily_0_wind_speed = results_0_daily_0["wind_speed"];
  const char* results_0_daily_0_wind_scale = results_0_daily_0["wind_scale"];
  const char* results_0_daily_0_humidity = results_0_daily_0["humidity"];
  
  JsonObject results_0_daily_1 = results_0_daily[1];
  const char* results_0_daily_1_date = results_0_daily_1["date"];
  const char* results_0_daily_1_text_day = results_0_daily_1["text_day"];
  const char* results_0_daily_1_code_day = results_0_daily_1["code_day"];
  const char* results_0_daily_1_text_night = results_0_daily_1["text_night"]; 
  const char* results_0_daily_1_code_night = results_0_daily_1["code_night"]; 
  const char* results_0_daily_1_high = results_0_daily_1["high"];
  const char* results_0_daily_1_low = results_0_daily_1["low"]; 
  const char* results_0_daily_1_rainfall = results_0_daily_1["rainfall"]; 
  const char* results_0_daily_1_precip = results_0_daily_1["precip"]; 
  const char* results_0_daily_1_wind_direction = results_0_daily_1["wind_direction"];
  const char* results_0_daily_1_wind_direction_degree = results_0_daily_1["wind_direction_degree"]; 
  const char* results_0_daily_1_wind_speed = results_0_daily_1["wind_speed"];
  const char* results_0_daily_1_wind_scale = results_0_daily_1["wind_scale"];
  const char* results_0_daily_1_humidity = results_0_daily_1["humidity"]; 
  
  JsonObject results_0_daily_2 = results_0_daily[2];
  const char* results_0_daily_2_date = results_0_daily_2["date"];
  const char* results_0_daily_2_text_day = results_0_daily_2["text_day"];
  const char* results_0_daily_2_code_day = results_0_daily_2["code_day"];
  const char* results_0_daily_2_text_night = results_0_daily_2["text_night"];
  const char* results_0_daily_2_code_night = results_0_daily_2["code_night"];
  const char* results_0_daily_2_high = results_0_daily_2["high"]; 
  const char* results_0_daily_2_low = results_0_daily_2["low"]; 
  const char* results_0_daily_2_rainfall = results_0_daily_2["rainfall"];
  const char* results_0_daily_2_precip = results_0_daily_2["precip"]; 
  const char* results_0_daily_2_wind_direction = results_0_daily_2["wind_direction"]; 
  const char* results_0_daily_2_wind_direction_degree = results_0_daily_2["wind_direction_degree"]; 
  const char* results_0_daily_2_wind_speed = results_0_daily_2["wind_speed"];
  const char* results_0_daily_2_wind_scale = results_0_daily_2["wind_scale"]; 
  const char* results_0_daily_2_humidity = results_0_daily_2["humidity"]; 
  
  const char* results_0_last_update = results_0["last_update"]; 
  
  // 从以上信息中摘选几个通过串口监视器显示
  String data = results_0_daily_0["date"].as<String>();
  String day_weather = results_0_daily_0["text_day"].as<String>(); 
  //int results_0_daily_0_code_day_int = results_0_daily_0["code_day"].as<int>(); 
  String night_weather = results_0_daily_0["text_night"].as<String>(); 
  //int results_0_daily_0_code_night_int = results_0_daily_0["code_night"].as<int>(); 
  int highTem = results_0_daily_0["high"].as<int>();
  int lowTem = results_0_daily_0["low"].as<int>();
  String rainfall = results_0_daily_0["rainfall"].as<String>();
  String wind_direction = results_0_daily_0["wind_direction"].as<String>();
  int wind_speed = results_0_daily_0["wind_speed"].as<int>();
  int humidity = results_0_daily_0["humidity"].as<int>();
  //String results_0_last_update_str = results_0["last_update"].as<String>();
  detailDoc["data"]=data;
  detailDoc["day_weather"]=day_weather;
  detailDoc["night_weather"]=night_weather;
  detailDoc["highTem"]=highTem;
  detailDoc["lowTem"]=lowTem;
  detailDoc["rainfall"]=rainfall;
  detailDoc["wind_direction"]=wind_direction;
  detailDoc["wind_speed"]=wind_speed;
  detailDoc["humidity"]=humidity;
}

void drawWeather(int temperature,String weather){
  Serial.println(temperature);
  Serial.println(weather);
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1.5);
  if(weather.equals("Sunny")) display.drawBitmap(30,10,epd_bitmap_sunny,20,20,1);
  else if(weather.equals("Clear")) {display.drawBitmap(30,10,epd_bitmap_clear,20,20,1);}
  else if(weather.equals("Cloudy")) display.drawBitmap(30,10,epd_bitmap_cloudy,20,19,1);
  else if(weather.equals("Overcast")) display.drawBitmap(30,10,epd_bitmap_overcast,20,20,1);
  display.setCursor(35,35);
  display.print(weather);
  display.setTextSize(2.5);
  display.setCursor(60,15);
  display.print(temperature);
  display.drawBitmap(82,12,hans_sheshidu,20,20,1);
  display.display();
}

void Draw(){
  if(WiFiFlag) return;
  if((millis()-previousMillis>=interval)||first){
    previousMillis = millis();
    first = false;
    WeatherRequest(RoughHttp);
  }
}

void checkWiFi(){
  if(WiFiFlag) return;
  //Serial.println("dd");
  if(millis()-WiFiPrevious>=WiFiInterval){
    WiFiPrevious = millis();
    if(WiFi.status()!=WL_CONNECTED){
      initWiFi();WiFiFlag=true;
    }
  }
}

void setup(void){
  Serial.begin(9600);
  Serial.println("");
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);  // 初始化OLED并设置其IIC地址为 0x3C
  initWiFi();
  setupServer();
  led.LED_setup();
}

void loop(){
  server.handleClient();
  if(WiFiFlag==false)TH.check_time();
  Draw();
  checkWiFi();
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
