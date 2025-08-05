# Product Vision - RateMyPet

## Overview

RateMyPet is a social web app where users can post photos of their pets ( dogs or cats ), and receive feedback, likes, and fun AI-generated content.
The goal is to create a playful community for pet lovers while serving as a portfolio project that follows real-world backend scalable practices like Clean Architecture and TDD.

This product is built for pet lovers who enjoy sharing photos and discovering new pets, and for developers aiming to create a maintainable, scalable, and test-driven backend architecture.

---

## Target Audience

- Casual pet owners who want to showcase their pets in a gamified social environment  
- Pet lovers looking for a fun and uplifting way to interact online  
- Developers seeking inspiration or reference for building backend systems with scalable architecture and TDD practices

---

## Core Features (MVP Scope)

- User registration and login  
- Upload pet photos (cat or dog)  
- Public feed of pet posts  
- Like and comment on photos  
- Rank pets by popularity
- AI-generated pet personality phrases  
- Profile page 

---

## ⚙️ Backend Technical Goals & Constraints

- Use Clean Architecture across all layers with Nodejs and Typescript
- 90~100% coverage by automated tests using TDD
- Modular design with clear separation of concerns
- PostgreSQL as the primary database  
- REST API documented with Swagger/OpenAPI  
- GitHub Actions for CI/CD pipelines  
- Linting, formatting, and commit hooks enforced