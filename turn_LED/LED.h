#ifndef _LED_H__
#define _LED_H__

#include "Arduino.h"
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>  
#include <ESP8266WebServer.h>

#define LED_PIN D5

class LED{
  public:
    LED();
    ~LED();
    void LED_setup();
    void handleLED();
    void handleBrightnessUp();
    void handleBrightnessDown();
    int val=100;
};

#endif
