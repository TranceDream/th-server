#ifndef _TEMPHUMI_H__
#define _TEMPHUMI_H__

#include "Arduino.h"
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <FS.h>

#define ADDRESS_AM2321 0x5C
#define SDA_PIN A4
#define SCL_PIN A5

class temphumi{
  public:
    temphumi(); //构造函数
    ~temphumi(); //析构函数
    void th_setup(); //初始化
    void check_time(); //检查当前时间，判断是否测温
    String read_AM2321(); //获得传感器测量的数据
    void CheckCRC(); //检查测量数据是否有效
    String cur_time(); //计算当前时间
    void write_file(String str); //写入文件
    String read_file(); //读取文件
    boolean get_time(); //通过WIFI校准时间
    void addToDB(); //将数据写入数据库
    //获取时间的变量
    String cur_mon, cur_day, cur_hour;
    boolean firstFlag = true;
    unsigned long AM2321Previous = 0;
    unsigned long AM2321Interval = 1000*3600;
    //连接WIFI的变量
    const char* ssid = "DESKTOP-OISTSQI 4858"; 
    const char* password = "&D358f99";
    WiFiClient client;
    HTTPClient http;
    String GetUrl;
    String response;
    //测量温湿度的变量，浮点数
    byte fuctionCode = 0;
    byte dataLength = 0;
    byte humiHigh = 0;
    byte humiLow = 0;
    byte tempHigh = 0;
    byte tempLow = 0;
    byte crcHigh = 0;
    byte crcLow = 0;
    float humidity = 0;
    float temperature = 0;
    unsigned int crcCode = 0;
    //写入文件的字符串
    String file_cont;
    //文件位置
    String filename = "/data.txt";
    //连接数据库
    HTTPClient https;
    String postData;
};

#endif
