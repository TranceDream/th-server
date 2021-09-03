#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>  
#include <ESP8266WebServer.h>

ESP8266WiFiMulti wifiMulti;
ESP8266WebServer esp8266_server(80);
int ledPin=14;
int val=100;
 
void setup(void) {
  Serial.begin(9600);
  pinMode(ledPin,OUTPUT);
  analogWrite(ledPin,val);
  
 /* wifiMulti.addAP("smile", "wgc2001613");
  wifiMulti.run();
 Serial.print("Connected to ");
  Serial.println(WiFi.SSID());        
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP()); 

*/
  wifiMulti.addAP("smile", "wgc2001613"); 
  Serial.println("Connecting ...");  
  
  int i = 0;                                 
  while (wifiMulti.run() != WL_CONNECTED) {  
    delay(1000);                             
    Serial.print(i++); Serial.print(' ');    
  }                                          
                                          
  Serial.println('\n');
  Serial.print("Connected to ");
  Serial.println(WiFi.SSID());      
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());  
  
  
  esp8266_server.begin();
  esp8266_server.on("/",HTTP_GET,handleRoot);
  esp8266_server.on("/LED",HTTP_POST,handleLED);
  esp8266_server.on("/brightnessUP",HTTP_POST,handleBrightnessUp);
  esp8266_server.on("/brightnessDown",HTTP_POST,handleBrightnessDown);
  esp8266_server.onNotFound(handleNotFound);
  // put your setup code here, to run once:

}

void loop() {
  esp8266_server.handleClient();
  // put your main code here, to run repeatedly:

}
void handleLED() {                          
  digitalWrite(ledPin,!digitalRead(ledPin));// 改变LED的点亮或者熄灭状态
  esp8266_server.sendHeader("Location","/");          // 跳转回页面根目录
  esp8266_server.send(303);                           // 发送Http相应代码303 跳转  
}
void handleBrightnessUp() {
  if(digitalRead(ledPin)==HIGH&&val<255){             //变亮
    val=val+10;
    analogWrite(ledPin,val);
    esp8266_server.sendHeader("Location","/");          // 跳转回页面根目录
    esp8266_server.send(303);
  }
}
void handleBrightnessDown() {                          //变暗
  if(digitalRead(ledPin)==HIGH&&val>0){
    val=val-10;
    analogWrite(ledPin,val);
    esp8266_server.sendHeader("Location","/");          // 跳转回页面根目录
    esp8266_server.send(303);
  }
}
void handleRoot() {       
  esp8266_server.send(200, "text/html", "<form action=\"/LED\" method=\"POST\"><input type=\"submit\" value=\"Toggle LED\"></form><form action=\"/brightnessUp\" method=\"POST\"><input type=\"submit\" vlaue=\"BrightnessUp\"></form><form action=\"/brightnessDown\" method=\"POST\"><input type=\"submit\" vlaue=\"BrightnessDown\"></form>");
}

void handleNotFound(){
  esp8266_server.send(404, "text/plain", "404: Not found"); // 发送 HTTP 状态 404 (未找到页面) 并向浏览器发送文字 "404: Not found"
}
