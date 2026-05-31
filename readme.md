# JS Frameworks CA: Online Store

A responsive online store built with React, TypeScript and Vite using the Noroff Online Shop API.

This project was developed as part of the Noroff Frontend Development JS Frameworks Course Assignment.

## Live Site

https://adrian-jsframework.netlify.app

## Repository

https://github.com/adring93/js-frameworks-ca

## Project Overview

The application allows users to browse products, search for products, view individual product pages, add products to the cart, adjust quantities, complete checkout and use a validated contact form.

The project uses React Router for navigation, Context API for cart state and localStorage to keep the cart after page refresh.

## Portfolio 2 Improvements

For Portfolio 2, I reviewed the project based on teacher feedback and improved the cart experience.

The main improvements were:

* Fixed the cart total calculation so discounted product prices are used correctly
* Added visible feedback when a user adds a product to the cart
* Added a toast message with accessible status text
* Improved the cart interaction so the user gets clearer confirmation after an action
* Added styling for the cart feedback message

These changes directly addressed feedback about small cart calculation bugs and interactions where the user action could feel invisible.

## Features

* Browse products from an external API
* View individual product pages
* Search products with live suggestions
* Add products to cart
* Receive feedback when a product is added to cart
* Adjust quantity in cart
* Cart total uses discounted prices correctly
* Checkout success page
* Contact form with validation
* Responsive design for mobile and desktop

## Tech Stack

* React
* TypeScript
* Vite
* React Router
* CSS
* Context API
* localStorage
* Netlify
* Noroff Online Shop API

## Installation

Clone the repository:

```bash
git clone https://github.com/adring93/js-frameworks-ca.git
```

Navigate into the project:

```bash
cd js-frameworks-ca
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```text
src
 ├ components
 ├ pages
 ├ services
 ├ store
 ├ types
 ├ App.tsx
 ├ main.tsx
 └ index.css
```

## Testing

The project was manually tested by checking:

* Products load from the API
* Search returns relevant suggestions
* Product detail pages open correctly
* Products can be added to cart
* Add to cart feedback appears
* Cart quantity can be changed
* Cart total calculates correctly with discounted prices
* Checkout flow works
* Contact form validation works
* Site works after refresh on deployed routes

## Credits

Special thanks to Mr De Souza for guidance and feedback during the assignment.

Thanks to my partner for testing the application and helping me think through the search experience.

## Author

Adrian Ingvartsen
Frontend Development Student at Noroff

GitHub: https://github.com/adring93
