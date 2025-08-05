# Create User - Requirements 

## Functional Requirements

- [ ] The system must accept only the following fields: name, email, password and confirm-password
- [ ] The email must be validated
- [ ] The password must be at least 6 characters long
- [ ] The email must be unique in the database
- [ ] The password must be hashed before being stored
- [ ] The user must be persisted in the database
- [ ] A JWT token must be generated and returned to the client
- [ ] The response must include the user’s id and email
- [ ] The system must return HTTP 201 when registration is successful

## Non-Functional Requirements

- [ ] The password hashing must use bcrypt with a salt factor of at least 10
- [ ] The JWT token must expire in 1 hour
- [ ] The JWT payload must not contain sensitive information
   
## Error Handling

- [ ] Returns **400** when the email format is invalid
- [ ] Returns **400** when the password is too short/mismatch
- [ ] Returns **409** when the email is already registered
- [ ] Returns **500** when an unexpected server error occurs


## Request Example

```json
POST /users/signup
{
  "name": "Jane Doe",
  "email": "Jane.Doe@example.com",
  "password": "strongpassword123"
}
```

---

## Expected Response (201 Created)

```json
{
  "token": "jwt.token",
  "user": {
    "id": "uuid",
    "email": "jane.doe@example.com"
  }
}
```
