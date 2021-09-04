#include "temphumi.h"
#include "Arduino.h"

//unsigned long prevousMillis;
//unsigned long interval = 2000;
//if(millis()-previou>=interval) previou = millis();
temphumi TH;
void setup() {
  // put your setup code here, to run once:
  Wire.begin();
  Serial.begin(115200);
  TH.th_setup();
}

void loop() {
  // put your main code here, to run repeatedly:
  TH.check_time();
}
