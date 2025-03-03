from machine import Pin, PWM
import time

# Définition des broches pour les moteurs
PWM_LEFT = 18  # Broche PWM pour le moteur gauche
DIR_LEFT = 19  # Direction pour le moteur gauche

PWM_RIGHT = 20  # Broche PWM pour le moteur droit
DIR_RIGHT = 21  # Direction pour le moteur droit

# Configuration des broches
pwm_left = PWM(Pin(PWM_LEFT))
pwm_right = PWM(Pin(PWM_RIGHT))

pwm_left.freq(1000)  # 1 kHz
pwm_right.freq(1000)  # Même fréquence pour éviter les conflits

dir_left = Pin(DIR_LEFT, Pin.OUT)
dir_right = Pin(DIR_RIGHT, Pin.OUT)

from machine import Pin, PWM
import time

# Configuration des broches pour les moteurs
PWM_A = PWM(Pin(18))  # Contrôle de vitesse moteur A
DIR_A = Pin(19, Pin.OUT)  # Direction moteur A

PWM_B = PWM(Pin(20))  # Contrôle de vitesse moteur B
DIR_B = Pin(21, Pin.OUT)  # Direction moteur B

# Définition de la fréquence PWM (1 kHz)
PWM_A.freq(1000)
PWM_B.freq(1000)

def set_motor(motor, speed, direction):
    """ 
    Contrôle un moteur donné.
    - motor: 'A' ou 'B'
    - speed: 0 à 100 (vitesse en %)
    - direction: 1 = avant, 0 = arrière
    """
    duty = int(speed * 65535 / 100)  # Conversion en 16 bits (0-65535)
    
    if motor == 'A':
        PWM_A.duty_u16(duty)
        DIR_A.value(direction)
    elif motor == 'B':
        PWM_B.duty_u16(duty)
        DIR_B.value(direction)

def avancer():
    """ Fait avancer le robot en mettant les deux moteurs en marche avant. """
    set_motor('A', 70, 1)
    set_motor('B', 70, 1)

def reculer():
    """ Fait reculer le robot en mettant les deux moteurs en marche arrière. """
    set_motor('A', 70, 0)
    set_motor('B', 70, 0)

def tourner_gauche():
    """ Fait tourner le robot à gauche (moteur droit actif). """
    set_motor('A', 0, 1)
    set_motor('B', 70, 1)

def tourner_droite():
    """ Fait tourner le robot à droite (moteur gauche actif). """
    set_motor('A', 70, 1)
    set_motor('B', 0, 1)

def stop():
    """ Arrête les deux moteurs. """
    set_motor('A', 0, 0)
    set_motor('B', 0, 0)
    

# Test des moteurs
avancer()
time.sleep(3)
stop()

def set_motor(pwm, direction, direction_state, speed):
    """ Active un moteur avec une direction et une vitesse donnée. """
    direction.value(direction_state)
    duty_cycle = int(speed * 65535 / 100)  # Conversion pour PWM 16 bits
    pwm.duty_u16(duty_cycle)

def avancer():
    """ Fait avancer les deux moteurs en même temps. """
    set_motor(pwm_left, dir_left, True, 50)
    set_motor(pwm_right, dir_right, True, 50)

def reculer():
    """ Fait reculer les deux moteurs en même temps. """
    set_motor(pwm_left, dir_left, False, 50)
    set_motor(pwm_right, dir_right, False, 50)

def tourner_droite():
    """ Tourne à droite (un moteur en avant, l'autre en arrière). """
    set_motor(pwm_left, dir_left, True, 50)
    set_motor(pwm_right, dir_right, False, 50)

def tourner_gauche():
    """ Tourne à gauche (un moteur en arrière, l'autre en avant). """
    set_motor(pwm_left, dir_left, False, 50)
    set_motor(pwm_right, dir_right, True, 50)

def stop():
    """ Arrête les moteurs. """
    pwm_left.duty_u16(0)
    pwm_right.duty_u16(0)

# Test : avancer pendant 3 secondes puis s'arrêter


stop()
