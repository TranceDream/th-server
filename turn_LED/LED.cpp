#include "LED.h"
#include "Arduino.h"

LED::LED(){  
  
}

LED::~LED(){
  
}

void LED::LED_setup(){
  pinMode(LED_PIN,OUTPUT);
  analogWrite(LED_PIN,val);  
}

void LED::handleLED() {                          
  digitalWrite(LED_PIN,!digitalRead(LED_PIN));// 改变LED的点亮或者熄灭状态
}

void LED::handleBrightnessUp() {
  if(digitalRead(LED_PIN)==HIGH&&val<255){             //变亮
    val=val+10;
    analogWrite(LED_PIN,val);
  }
}

void LED::handleBrightnessDown() {                          //变暗
  if(digitalRead(LED_PIN)==HIGH&&val>0){
    val=val-10;
    analogWrite(LED_PIN,val);
  }
}
