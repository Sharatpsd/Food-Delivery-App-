<div align="center">

# Bite

**Bangladesh's Fastest Growing Food Delivery App**  
*Hot food delivered in minutes — from your favorite local restaurants*

![Bite Hero](https://drive.google.com/uc?id=1u5G5jZ9v0Z9Z9v0Z9v0Z9v0Z9v0Z9v0Z)  
*(Premium orange-red hero with creamy "Bite" logo)*

<p align="center">
  <a href="https://bite-demo.netlify.app">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-installation">Get Started</a>
</p>

![GitHub stars](https://img.shields.io/github/stars/Sharatpsd/Food-Delivery-App-.svg?style=social&label=Star)
![GitHub forks](https://img.shields.io/github/forks/Sharatpsd/Food-Delivery-App-.svg?style=social&label=Fork)
![License](https://img.shields.io/github/license/Sharatpsd/Food-Delivery-App-)

</div>

---

## Features

| For Customers                          | For Restaurants                     |
|----------------------------------------|-------------------------------------|
| Browse 10,000+ restaurants             | Zero commission in beta            |
| Real-time order tracking               | Easy partner registration          |
| Lightning-fast delivery (avg. 28 min)  | Live order dashboard               |
| Secure payment (bKash ready)           | Menu & analytics management        |
| Save addresses & favorites             | Grow with zero risk                |

---

## Tech Stack

| Layer         | Technology                                   |
|---------------|----------------------------------------------|
| **Backend**   | Django 5.2 + Django REST Framework          |
| **Frontend**  | React 18 + Vite + Tailwind CSS               |
| **Database**  | SQLite (dev) → PostgreSQL (production ready) |
| **Images**    | Cloudinary (auto-optimized)                  |
| **Auth**      | JWT Authentication                           |
| **Styling**   | Tailwind + Custom Premium Gradients          |
| **Animations**| Framer Motion + AOS                          |
| **Icons**     | Lucide React                                 |

---

## Screenshots

<div align="center">

**Home – Premium Hero**  
![Home Page](https://drive.google.com/uc?id=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q)

**Restaurant Grid**  
![Restaurants](https://drive.google.com/uc?id=1x1x1x1x1x1x1x1x1x1x1x1x1x1x1x1x)

**Login & Register**  
![Auth Pages](https://drive.google.com/uc?id=1y2y2y2y2y2y2y2y2y2y2y2y2y2y2y2y)

**Become a Partner**  
![Partner Page](https://drive.google.com/uc?id=1z9z9z9z9z9z9z9z9z9z9z9z9z9z9z9z)

**Premium Footer**  
![Footer](https://drive.google.com/uc?id=1w1w1w1w1w1w1w1w1w1w1w1w1w1w1w1w)

</div>

---

## Installation (Run Locally)

### Backend (Django)
```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
cp .env.example .env     # Add your Cloudinary keys
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
