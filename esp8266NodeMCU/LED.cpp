#include "LED.h"
#include "Arduino.h"

LED::LED(){  
  
}

LED::~LED(){
  
}

void LED::LED_setup(){
  pinMode(LED_PIN,OUTPUT);
}

void LED::handleLED() {                          
  if(digitalRead(LED_PIN)){
    digitalWrite(LED_PIN,LOW);
    val=100;
  }else{
    analogWrite(LED_PIN,val);
  }
}

void LED::adjustLED(int brightness){
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
