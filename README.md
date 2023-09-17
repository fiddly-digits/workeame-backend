# Workea.me Backend

---

## What is Workea

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
  Update Schedule of one day of the week | **No Auth Needed**

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
