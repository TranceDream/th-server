#include "LED.h"
#include "Arduino.h"

LED::LED(){  
  
}

LED::~LED(){
  
}

void LED::LED_setup(){
  pinMode(LED_PIN,OUTPUT);
}

bool LED::handleLED(String sta) {                          
  if(sta.equals("OFF")){
    digitalWrite(LED_PIN,LOW);
    val=100;  return false;
  }else if(sta.equals("ON")){
    analogWrite(LED_PIN,val);
    return true;
  }
}

void LED::adjustLed(int brightness){
  val = brightness;
  analogWrite(LED_PIN,val);
}

void LED::handleBrightnessUp() {
  if(digitalRead (LED_PIN)==HIGH&&val<255){             //变亮
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
