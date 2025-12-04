---
id: 2
title: "Secure Blog Application"
size: "L"
tech: ["Flask", "Python", "SQLite"]
summary: "A security-focused Flask blog implementing encryption, MFA, role-based access control, attack detection, and detailed security logging."
link: "#"
image: "/projects/blog-login.png"
showMoreButton: true
---

# Secure Blog Application

A Flask-based blog application built to practice secure web development, implementing encryption at rest, strong authentication, role-based access control, attack detection, and detailed security logging.

## Project Overview

The app lets users register, log in with multi-factor authentication, and create, edit, and delete their own blog posts. Posts are stored encrypted in the database, and different user roles (end user, security admin, database admin) have different levels of access to content and admin tooling. Google reCAPTCHA, rate limiting, and custom input validation help protect against bots, brute-force attempts, and common web attacks such as SQL injection and XSS.

## Security Features

- **Authentication & MFA**: Login uses email and password plus a TOTP-based one-time code generated with pyotp, with QR codes to set up the second factor.
- **Password Hardening**: Passwords are hashed with Argon2, following modern recommendations for secure password storage.
- **Role-Based Access Control (RBAC)**: Roles such as end_user, sec_admin, and db_admin control access to admin views, security dashboards, and data operations.
- **Encryption at Rest**: Sensitive blog fields (like titles and bodies) are encrypted using keys derived from user-specific data so that content is protected even if the database is leaked.
- **Bot & Abuse Protection**: Login routes are protected with Google reCAPTCHA, rate limits, and login attempt tracking to slow down automated attacks and brute force.
- **Attack Detection & Input Validation**: Inputs are scanned for SQL injection, XSS, and path traversal patterns, with strict validation for emails, phone numbers, and names.
- **Security Headers & HTTPS**: Flask-Talisman enforces HTTPS and sets security headers such as HSTS and Content Security Policy to reduce XSS and downgrade risks.

## Technical Implementation

- **Stack & Architecture**: Built with Flask using blueprints in an MVC-style structure, SQLAlchemy for ORM, and Alembic/Flask-Migrate for database migrations on top of SQLite.
- **Models & OOP Design**: User, Post, and Log models encapsulate authentication, encryption, logging, and relationships, with methods for verifying passwords/MFA, encrypting/decrypting data, and tracking login history.
- **Forms & Validation**: Flask-WTF and WTForms define registration, login, and post forms, including the reCAPTCHA field on login and server-side validation rules for all fields.
- **Admin & Monitoring**: Flask-Admin provides restricted views for managing users and posts, while security events (registrations, logins, attacks, blocked access) are written to a dedicated log file for auditing.
- **Front End**: Jinja templates use Bootstrap and small amounts of JavaScript/jQuery for layout, feedback, and form behaviour.

## What I Learned

This project provided hands-on experience with implementing multiple layers of security in a real web app rather than treating each feature in isolation. It strengthened skills in Flask, authentication flows, encryption, RBAC design, and logging, and showed how important it is to think about both user experience (MFA, error messages, reCAPTCHA) and attacker behaviour (brute force, injection, scripting) when building production-like systems.
