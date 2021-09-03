#ifndef _LED_H__
#define _LED_H__

#include "Arduino.h"

#define LED_PIN D5

class LED{
  public:
    LED();
    ~LED();
    void LED_setup();
    void handleLED();
    void adjustLed(int brightness);
    void handleBrightnessUp();
    void handleBrightnessDown();
    int val=100;
};

#endif
