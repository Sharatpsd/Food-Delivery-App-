<div align="center">
  <h1>Bite</h1>
  <h3>🚀 Bangladesh's Fastest Growing Food Delivery Platform</h3>
  <p><em>Hot & Fresh Food Delivered in Minutes</em></p>

  <br/>

  <p>
    <strong>Frontend Live Demo:</strong>  
    <a href="https://food-delivery-frontend-mktt.onrender.com" target="_blank">https://food-delivery-frontend-mktt.onrender.com</a>
  </p>

  <p>
    <strong>Backend API Live:</strong>  
    <a href="https://food-delivery-app-1-ihcm.onrender.com" target="_blank">https://food-delivery-app-1-ihcm.onrender.com</a>
  </p>

  <br/>

  <img 
    src="https://drive.google.com/uc?id=1eLes5bb7NEak3KLgHyF_5zLqY7DsU1YN" 
    alt="Bite Hero Banner" 
    width="90%" 
    style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"
  />

  <br/><br/>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-screenshots">Screenshots</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-contact">Contact</a>
  </p>

  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge&logo=status" alt="Status" />
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" alt="Frontend" />
  <img src="https://img.shields.io/badge/Backend-Django-green?style=for-the-badge&logo=django" alt="Backend" />

</div>

---

## ✨ Features

| Customers                                      | Restaurants / Partners                          |
|------------------------------------------------|-------------------------------------------------|
| Browse & search nearby restaurants             | **Zero commission** during beta phase           |
| Real-time cart with live price calculation     | Simple & fast partner registration              |
| Secure JWT-based authentication                | Full menu management (add/edit/delete items)    |
| Premium responsive design (mobile-first)       | Order tracking & status updates                 |
| Order history & favorites                      | Basic analytics dashboard (coming soon)         |
| Dark/Light mode support (planned)              | Easy order acceptance & preparation flow        |

---

## 📸 Screenshots

<div align="center">

### Hero & Restaurant Listing
<img 
  src="https://drive.google.com/uc?id=1D8S87v9q0rTZ4xew-9dhvDrusaByjmRz" 
  alt="Home - Hero & Restaurants" 
  width="85%" 
  style="border-radius: 10px; margin: 12px 0;"
/>

### Search & Filters
<img 
  src="https://drive.google.com/uc?id=1kFJbf_nhZScldagyDyZeRdpxOiU3p3R4" 
  alt="Search & Filter Screen" 
  width="85%" 
  style="border-radius: 10px; margin: 12px 0;"
/>

### Cart & Checkout Flow
<img 
  src="https://drive.google.com/uc?id=1-rD4dNQHLeUitHPNJ1Jha2jaNYAmqOiE" 
  alt="Cart and Checkout Page" 
  width="85%" 
  style="border-radius: 10px; margin: 12px 0;"
/>

### Restaurant Partner Dashboard
<img 
  src="https://drive.google.com/uc?id=1jTadE5ehnE7K25A-GUhZzZEq1zqb_51I" 
  alt="Partner / Restaurant Dashboard" 
  width="85%" 
  style="border-radius: 10px; margin: 12px 0;"
/>

### Order Details & Management
<img 
  src="https://drive.google.com/uc?id=1iJ-T8Rr1IPJabJe8TxWuh1nnlICm3ToB" 
  alt="Order Management Screen" 
  width="85%" 
  style="border-radius: 10px; margin: 12px 0;"
/>

### Login & Registration Pages
<div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin: 20px 0;">
  <img src="https://drive.google.com/uc?id=15Veux7kxHjHMkqVQvi_T_v61L5s7oV_R" alt="Login" width="45%" style="border-radius: 10px;"/>
  <img src="https://drive.google.com/uc?id=1Zy4wI9NrBUu8o2kkIpkTAdMopFFMZKEd" alt="Register" width="45%" style="border-radius: 10px;"/>
</div>

### Become a Partner Page
<img src="https://drive.google.com/uc?id=1OdV_Z_0nb11PRS10O_0KrngSKqUW_J_g" alt="Become a Partner" width="85%" style="border-radius: 10px;"/>

### Contact & Footer Section
<img src="https://drive.google.com/uc?id=14M_m5ziYriu_jYNpEkKxFtKjIafMS2Hu" alt="Contact & Footer" width="85%" style="border-radius: 10px;"/>

</div>

---

## 🛠 Tech Stack

| Layer            | Technology                              |
|------------------|-----------------------------------------|
| **Frontend**     | React 18 + Vite + Tailwind CSS          |
| **Backend**      | Django 5.2 + Django REST Framework      |
| **Database**     | SQLite (development) → PostgreSQL (prod)|
| **Image Storage**| Cloudinary                              |
| **Authentication**| JWT (JSON Web Tokens)                   |
| **Styling**      | Tailwind CSS + Custom gradients         |
| **Icons**        | Lucide React                            |
| **Deployment**   | Render.com (frontend & backend)         |

---

## 🚀 Installation & Setup

### Backend (Django)

```bash
git clone https://github.com/Sharatpsd/Food-Delivery-App-.git
cd Food-Delivery-App-/backend

# Create & activate virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
# source venv/bin/activate

pip install -r requirements.txt

# Copy example env and configure (especially Cloudinary keys)
cp .env.example .env

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
