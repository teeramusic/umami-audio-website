# Umami Audio Website

This repository contains the static website files for Umami Audio / MSO Server.

## About

This is a GPU processing platform with the following features:
- Beautiful landing page with modern design
- Download page for software packages
- Real-time processing capabilities
- Secure authentication with OAuth providers

## Deployment

The site is automatically deployed via GitHub Pages.

## Backend

The backend API server is hosted separately and handles:
- User authentication (Google, Microsoft, Apple, Facebook, Email)
- Job processing with GPU workers
- Real-time WebSocket connections
- File upload and processing

## Configuration

Update the `BACKEND_URL` in the JavaScript files to point to your production backend server.
