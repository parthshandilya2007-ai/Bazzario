# 🛍️ Bazzario

### AI-Powered Wholesale Marketplace

Bazzario is a modern full-stack wholesale e-commerce marketplace designed to connect buyers with verified suppliers and manufacturers. The platform provides a seamless shopping experience with product discovery, authentication, cart management, supplier interactions, and secure backend services.

---

## 🌐 Live Project

### 🚀 Website
👉 https://bazzario-fj8m-7q5ty9591-codelith1.vercel.app

### 🎨 Frontend
👉 https://bazzario-fj8m-7q5ty9591-codelith1.vercel.app

### ⚙️ Backend API
👉 https://bazzario-backend.onrender.com

### 📂 GitHub Repository
👉 https://github.com/parthshandilya2007-ai/Bazzario

---

## 📌 Project Overview

Bazzario is a full-stack e-commerce platform focused on the wholesale marketplace.

The platform aims to simplify the process of discovering products, connecting buyers with suppliers, and managing wholesale purchases through a modern and responsive web interface.

### Key Goals

- 🛒 Provide a smooth online shopping experience
- 🏭 Connect buyers with wholesale suppliers
- 🔍 Enable easy product discovery and search
- 🔐 Provide secure user authentication
- 📦 Manage products and orders efficiently
- ☁️ Support cloud-based image storage
- ⚡ Provide fast and scalable backend APIs

---

## ✨ Features

### 👤 User Authentication

- User registration
- User login
- JWT-based authentication
- Access and refresh tokens
- Protected routes

### 🛍️ Product Management

- Browse products
- Product details
- Product search
- Product categories
- Product images
- Supplier/product information

### 🛒 Shopping Cart

- Add products to cart
- Update product quantities
- Remove products
- Cart management

### 🏪 Wholesale Marketplace

- Supplier-focused marketplace
- Wholesale product discovery
- Direct supplier interaction
- Product-based purchasing workflow

### ☁️ Cloud Services

- Cloudinary for image management
- MongoDB for database storage
- Redis support for caching and performance

### 🔒 Security

- JWT authentication
- Password protection
- API rate limiting
- CORS configuration
- Environment-based secrets

### 📱 Responsive Design

The frontend is designed to provide a smooth experience across:

- 💻 Desktop
- 📱 Mobile
- 📟 Tablet

---

# 🏗️ Project Architecture

```text
                         ┌─────────────────────┐
                         │      Bazzario       │
                         │   Wholesale Market  │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
           ┌────────────────┐              ┌────────────────┐
           │    Frontend    │              │     Backend    │
           │     Vercel     │─────────────▶│     Render     │
           └────────────────┘              └───────┬────────┘
                                                    │
                              ┌─────────────────────┼─────────────────────┐
                              │                     │                     │
                              ▼                     ▼                     ▼
                       ┌────────────┐       ┌────────────┐       ┌────────────┐
                       │  MongoDB   │       │ Cloudinary │       │   Redis    │
                       │   Atlas    │       │   Storage  │       │   Cache    │
                       └────────────┘       └────────────┘       └────────────┘
