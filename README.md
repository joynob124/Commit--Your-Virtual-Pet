# Commit — A Virtual Pet That Lives By Your Commit

**Course**: Web Engineering  
**Institution**: Notre Dame University Bangladesh (NDUB)  
**Professor**: Poly Rani Ghosh 


## Team Members
- Joynob Bint Jamal
- Syed Nafish Shakir


## What is Commit - an Overview

**Commit** is a web-based virtual pet application. The core idea is simple — your pet stays alive as long as you keep commiting your code in your Github. Every GitHub commit heals your pet. Neglect it, and its health slowly drains. If health reaches zero, the pet dies permanently, with no way to bring it back, and is memorialized forever in the **Fossil Record**.
Instead of forcing discipline, it creates emotional attachment. Your pet is yours. It has a name you chose, a lifespan you can watch in real time, and a history that survives even after it's gone.

## User Flow

```
/ (Login using github username)
    │
    └──► /name (Set Pet Name)
              │
              └──► /pet (Main Pet Home Page)
                        │
                        └──► /fossils (Fossil Record)
                                  │
                                  └──► /pet (Back to pet)
```

## Pages Overview

### Login
Enter your GitHub username to adopt your pet.

### Name Your Pet
Give your companion a name. It will be displayed throughout the app and saved to the fossil record if the pet dies.

### Main Pet View
Your pet lives here. Feed it to increase health. Watch it bob, and flap its wings. Monitor its health bar and live age timer. Navigate to the Fossil Record from here.

### Fossil Record
A memorial page for every pet that has died. Shows name, generation, cause of death, lifespan.

> *"Commit, or your pet dies."*
