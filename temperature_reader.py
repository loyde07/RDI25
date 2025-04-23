from machine import Pin, Timer
import time
import dht  # Import correct du module DHT


# Définition des broches BCD
BCD_A = Pin(0, Pin.OUT)  # A → GP0
BCD_B = Pin(3, Pin.OUT)  # B → GP7
BCD_C = Pin(2, Pin.OUT)  # C → GP6
BCD_D = Pin(1, Pin.OUT)  # D → GP2

# Définition des transistors pour les dizaines et les unités
digit_tens = Pin(4, Pin.OUT)  # Contrôle l'afficheur des dizaines (GP4)
digit_units = Pin(5, Pin.OUT)  # Contrôle l'afficheur des unités (GP5)

# Initialisation du capteur DHT11 sur GP6
sensor = dht.DHT11(Pin(6))

# Variables pour les valeurs des dizaines et des unités
tens = 0
units = 0
counter = 0
# Fonction d'affichage d'un chiffre
def display_digit(value):
    """Affiche un chiffre sur l'afficheur en utilisant BCD"""
    bcd_values = [
        (0, 0, 0, 0),  # 0
        (0, 0, 0, 1),  # 1
        (0, 0, 1, 0),  # 2
        (0, 0, 1, 1),  # 3
        (0, 1, 0, 0),  # 4
        (0, 1, 0, 1),  # 5
        (0, 1, 1, 0),  # 6
        (0, 1, 1, 1),  # 7
        (1, 0, 0, 0),  # 8
        (1, 0, 0, 1)   # 9
    ]

    if 0 <= value <= 9:
        # Afficher la valeur sur les broches BCD
        BCD_A.value(bcd_values[value][3]) #LSB
        BCD_B.value(bcd_values[value][2])
        BCD_C.value(bcd_values[value][1])
        BCD_D.value(bcd_values[value][0]) #MSB
    else:
        print("Erreur : Valeur hors plage")

# Fonction de rappel du timer pour le multiplexage
def timer_interrupt(timer):
    """Alterne l'affichage entre les dizaines et les unités"""
    global tens, units, counter

    # Alterne entre les afficheurs des unités et des dizaines
    
    if counter % 2 == 0:
        # Affiche les dizaines
        digit_tens.value(1)  # Active l'afficheur des dizaines
        digit_units.value(0)  # Désactive l'afficheur des unités
        display_digit(tens)  # Affiche le chiffre des dizaines
        
    else:
        # Affiche les unités
        digit_tens.value(0)  # Désactive l'afficheur des dizaines
        digit_units.value(1)  # Active l'afficheur des unités
        display_digit(units)  # Affiche le chiffre des unités
        
    counter += 1

# Fonction pour afficher un nombre à 2 chiffres
def display_number(number):
    """Affiche un nombre à 2 chiffres (ex: 12, 34, 09)"""
    global tens, units

    if number < 0 or number > 99:
        print("Erreur : Valeur hors plage")
        return

    # Extraction des unités et des dizaines
    tens = number // 10  # Chiffre des dizaines
    units = number % 10  # Chiffre des unités


# Initialiser le timer pour le multiplexage    
def init_timer():
    timer = Timer()
    timer.init(freq=100, mode=Timer.PERIODIC, callback=timer_interrupt)

init_timer()
while True:
    try:
        sensor.measure()  # Lecture des données
        temp = sensor.temperature()  # Température en °C
        humidity = sensor.humidity()  # Humidité en %
        display_number(temp)
        print("Température: {}°C   Humidité: {:.0f}% ".format(temp, humidity))

    except OSError as e:
        print("Erreur de lecture du capteur DHT11, réessai...")

    time.sleep(2)  # Pause de 2 secondes avant la prochaine mesure

