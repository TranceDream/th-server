#ifndef _TEMPHUMI_H__
#define _TEMPHUMI_H__

#include "Arduino.h"
#include <Wire.h>
#include <time.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <stdio.h>
#include <string.h>
#include <FS.h>

#define ADDRESS_AM2321 0x5C
#define SDA_PIN A4
#define SCL_PIN A5

class temphumi{
  public:
    temphumi(); //构造函数
    ~temphumi(); //析构函数
    String read_AM2321(); //获得传感器测量的数据
    void CheckCRC(); //检查测量数据是否有效
    String cur_time(); //计算当前时间
    void write_file(String str); //写入文件
    String read_file(); //读取文件
    boolean get_time(); //通过WIFI校准时间
    //获取时间的变量
    int cur_mon, cur_day, cur_hour;
    time_t now;
    struct tm *tm_now;
    //连接WIFI的变量
    const char* ssid = "nova 8 Pro"; 
    const char* password = "20010130";
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
};

#endif
