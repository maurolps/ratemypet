# Create User - Requirements 

## Functional Requirements

- [x] The following fields are required: name, email and password
- [x] The email must be validated
- [x] The password must be at least 6 characters long
- [ ] The email must be unique in the database
- [x] The password must be hashed before being stored
- [ ] The user must be persisted in the database
- [ ] A JWT token must be generated and returned to the client
- [x] The response must include the user’s id, name and email
- [x] The system must return HTTP 201 when registration is successful
- [x] The name must be at least 3 characters long

## Non-Functional Requirements

- [x] The password hashing must use bcrypt with a salt factor of at least 10
- [ ] The JWT token must expire in 1 hour
- [ ] The JWT payload must not contain sensitive information
   
## Error Handling

- [x] Returns **400** when the name/email/password format is invalid
- [x] Returns **400** when the name/email/password is missing
- [x] Returns **409** when the email is already registered
- [x] Returns **500** when an unexpected server error occurs
