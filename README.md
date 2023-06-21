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
- edit bookings
- add pets, delete/remove pets, and edit pet profile
- update their profile information (address, vet information, etc)
- upload profile images for their pets
- upload vaccination documents for their pets
- download and upload waiver document

Admin can:
- do anything a client can do listed above
- in the dashboard page, view how many bookings for each service
- add/delete TODOs for the day
- use the calendar to view what bookings are scheduled for the date selected
- can quickly confirm bookings from the dashboard page as
- view the list of users; can search by name or by pet
- from the list of users, can promote a user to admin
- from the list of users, can click user details and will route you to their profile page


Coming Soon:
- more data fields when adding or editing your pet's profile
  - age
  - weight
  - temperament
  - microchip #
  - ovariohysterectomy (spayed/neutered)
  - vaccination uploads (name of vaccine, when its valid until)
  - feeding instructions
  - medical instructions
 - vetrinary details (address, city, phone numner, email)
 - incident reporting
 - Waitlist feature (admin)
 - More robust booking experience (multi-step form)
 - Email Confirmation sent to admin when a customer cancels an appointment
