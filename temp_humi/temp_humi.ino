#include "temphumi.h"
#include "Arduino.h"

temphumi TH;
void setup() {
  // put your setup code here, to run once:
  Wire.begin();
  Serial.begin(115200);
  boolean flag = false;
  while(!flag){
    flag = TH.get_time();
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
  TH.read_AM2321();
  //检查数据并写入文件
  TH.CheckCRC();
  //控制测数据的时间间隔，1000为1s
  delay(3600000);
}
