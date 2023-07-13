# mnmk9-bookings-app
Full Stack Application using T3 stack 

## Technology and Libraries Used
- NEXT.js
- Clerk for Authentication and User Management
- Webhooks based on user.created/user.updated/user.deleted events from clerk to modify user table 
- Tailwind
- Typescript
- Prisma
- SQL DB (Planetscale)
- AWS S3 & SES
- tRPC 
- Zod
- React Hook Form
- Sweet Alerts
- React Calendar 
- Splide for Carousel components
- Vercel for deployment

## Features
- Customer/Client and Admin View using role based authorization
- React Hook Form to handle all the form logic with typescript
- ReCaptcha to validate that the user is not a bot
- rate limiting on the API's 
- caching using upstash and redis
- AWS S3 bucket to store images and documents
- AWS SES to handle sending admin and client the booking details to their email
- Admin dashboard has 4 widgets: 
  1. Dashboard - metrics for how many total bookings there are for a specific service. 
  2. Calendar - admin can select a date and will display all the clients checking in and checking out for that selected day
  3. Bookings - ability to easily confirm bookings right from the widget instead of going to the manage bookings page
  4. Todo List - list out the priorities for the day to help the admin stay on track

Client can:
- book services (daycare, grooming, boarding, training).
- cancel bookings
- edit/manage their bookings
- add pets to their profile by filling out vital information like breed, age, weight, ovariohysterectamy status, temperament, etc.
- edit their pets profile information
- delete/remove pets from their profile
- update their own profile information such as phone number, address (for home training).
- upload profile images for their pets
- download and upload waiver documents
- add their Vetrinary Information in case of an emergency
- upload, edit and delete vaccination documents from their pet's profile
- submit a contact form for any technical issues
- clients receive email confirmation when booking a service

Admin can:
- View a metric dashboard of all the current bookings for that day (how many clients are checking in and out for each of the core services)
- add/delete TODOs for the day to stay on top of their priorities
- use the calendar to view what bookings are scheduled for the date selected
- can quickly confirm bookings from the dashboard page
- book services for their clients if they are in the database
- view the list of users; can search by name or by pet
- from the list of users, can promote a user to admin
- from the list of users, can click user details and will route you to their profile page

## Coming Soon
 - incident reporting (admin)
 - Generate Invoice when they create a booking
 - use Stripe for payment in the app 
 - Waitlist feature (admin)
 - Email Confirmation sent to admin when a customer cancels an appointment
 - More robust booking experience (multi-step form)
   - fill out booking details
   - add-on services
   - summary
   - invoice
   - submit
 - Recurring bookings (selected days of week for # of weeks]
 - Revenue/Customer reporting once revenue is collected through the application (admin)
