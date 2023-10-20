# Workea.me Backend

![GitHub language](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![GitHub language](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub language](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![GitHub language](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![GitHub language](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

---

## What is Workea

Workea.me is a service that addresses the challenge of swiftly and securely finding service providers, while also offering professionals and businesses a personalized online platform to promote their services clearly and succinctly. Our focus is on small and medium-sized enterprises, as well as independent professionals, providing them with a more efficient way to manage their schedules and services beyond conventional tools like spreadsheets or physical agendas.

For us, it's essential to provide a solution that allows professionals to establish an online presence where they can engage with their clients, automate processes such as appointment scheduling and payments, and provide detailed information about their availability and rates. This not only simplifies the lives of service providers but also enhances the customer experience by streamlining the booking process and access to information.

Moreover, our platform can be a significant aid for individuals facing urgent situations at their homes or workplaces. It's also a valuable option for those seeking specific services, such as tattoo artists, tutors, veterinarians, doctors, and personal trainers. The platform simplifies the search for professionals and appointment scheduling, enabling quicker and more efficient responses to users' needs.

## Routes Explanation

### User Routes

- `/api/v1/user/register` ✅\
  Register one user into Workea | **No Auth Needed**
- `/api/v1/user/all` ✅\
  Get all Workers registered in Workea | **No Auth Needed**
- `/api/v1/user/:id` ✅\
  Get one User/Worker registered in Workea | **No Auth Needed**
- `/api/v1/user/complete/` ✅\
  Complete user profile | **Auth Needed**
- `/api/v1/user/update/` ✅\
  Update Profile Data | **Auth Needed**
- `/api/v1/user/workerUpdate/` ✅\
  Update User to Worker | **Auth Needed**
- `/api/v1/user/mailChange/` ✅\
  Update User Mail | **Auth Needed**
- `/api/v1/user/passwordChange/` ✅\
  Update User Password | **Auth Needed**
- `/api/v1/user/delete/` ✅\
  Delete User Password | **Auth Needed**

### Auth Routes

- `/api/v1/auth/login` ✅\
  Login into Workea | **No Auth Needed**
- `/api/v1/auth/confirmation/:token` ✅\
  Login into Workea | **Needs Token Sent by Email No Auth Needed**
- `/api/v1/auth/resend` ✅\
  Login into Workea | **No Auth Needed**

### Microsite Routes

- `/api/v1/ms/create/` ✅\
  Create Microsite for User | **Auth Needed**
- `/api/v1/ms/:id` ✅\
  Get User Microsite | **No Auth Needed and UserID as Param Needed**
- `/api/v1/ms/update/` ✅\
  Update Microsite | **Auth Needed**

  ### Service Route

- `/api/v1/service/create/` ✅\
  Create one service for one Worker | **Auth Needed**
- `/api/v1/service/:id` ✅\
  Get All Services from one Worker | **No Auth Needed and UserID as Param**
- `/api/v1/service/update/:id` ✅\
  Update one service | **Auth Needed and ServiceID as Param**
- `/api/v1/service/delete/:id` ✅\
  Update one service | **Auth Needed and ServiceID as Param**

  ### Discounts Routes

- `/api/v1/discount/create/:id` ✅\
  Create one discount for one Worker | **Auth Needed and ServiceID as Param**
- `/api/v1/discount/:id` ✅\
  Get All Discounts from one Service | **No Auth Needed and ServiceID as Param**
- `/api/v1/discount/delete/:id` ✅\
  Delete one discount | **Auth Needed and DiscountID as Param**

### Schedule Routes

- `/api/v1/schedule/create/` ✅\
  Create Schedule for one day of the week | **Auth Needed**
- `/api/v1/update/` ✅\
  Update Schedule of one day of the week | **Auth Needed**
- `/api/v1/schedule/:id` ✅\
  Get next 7 days Schedule for one Worker | **No Auth Needed**

### Review Routes

- `/api/v1/review/create/:id` ✅\
  Create Review for One Worker | **Auth Needed and WorkerID as Param**
- `/api/v1/update/:id` ✅\
  Update Review for One Worker | **Auth Needed and WorkerID as Param**
- `/api/v1/schedule/delete/:id` ✅\
  Delete Review | **Auth Needed and WorkerID as Param**
- `/api/v1/score/:id` ✅\
  Get the Average Score of one worker | **No Auth Needed and WorkerID as Param**

### Booking Routes

- `/api/v1/booking/create/:id` ✅\
  Create Booking for One Service | **Auth Needed and ServiceID as Param**
- `/api/v1/booking/reschedule/:id` ✅\
  Reschedule Booking | **Auth Needed and ServiceID as Param**
- `/api/v1/booking/statusUpdate/:id` ✅\
  Change Status of | **Auth Needed and ServiceID as Param**
- `/api/v1/booking/?type={customer || provider}` ✅\
  Get All Bookings from one User | **Auth Needed as Param**
