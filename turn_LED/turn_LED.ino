#include "LED.h"
#include "Arduino.h"

LED led;
void setup(void) {
  // put your setup code here, to run once:
  Serial.begin(9600);
  led.LED_setup();
}

void loop() {
  // put your main code here, to run repeatedly:
}
