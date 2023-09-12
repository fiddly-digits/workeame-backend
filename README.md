# Workea.me Backend

---

## What is Workea

## Routes Explanation

### User Routes

- `/api/v1/user/register` ✅\
  Register one user into Workea | **No Authentication Needed**
- `/api/v1/user/all` ✅\
  Get all Workers registered in Workea | **No Authentication Needed**
- `/api/v1/user/:id` ✅\
  Get one User/Worker registered in Workea | **No Authentication Needed**
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
  Login into Workea | **No Authentication Needed**

### Microsite Routes

- `/api/v1/ms/create/:id` 🚧\
  Create Microsite for User | **Auth Needed and UserID as Param**
- `/api/v1/ms/:id` 🚧\
  Get User Microsite | **Auth Needed and UserID as Param**
- `/api/v1/ms/update/:id` 🚧\
  Update Microsite | **Auth Needed and UserID as Param**

### Service Route

- `/api/v1/service/create/:id` 🚧\
  Create one service for one Worker | **Auth Needed and UserID as Param**
- `/api/v1/service/:id` 🚧\
  Get All Services from one Worker | **Auth Needed and UserID as Param**
- `/api/v1/service/update/:id` 🚧\
  Update one service | **Auth Needed**
