# Upload Pet - Requirements

## Functional Requirements

- [ ] The system must require a valid authenticated user to execute
- [ ] The system must not allow anonymous uploads
- [ ] The system must enforce a maximum of 5 pets per user
- [ ] The system must accept the upload as `multipart/form-data`
- [ ] The system must reject the upload if 
  - [x] The file is missing
  - [ ] The file exceeds the size limit
  - [ ] The file has an unsupported type
  - [x] The pet name has less than 3 or more than 70 characters
- [x] The system must accept only image files of type `jpeg`, `png`, or `webp`
- [ ] The system must has an AI classification service to classify the image as `cat` or `dog`
- [ ] The system must auto-generate pet names and descriptions using AI service
- [ ] The system must upload the image using `AWS S3` sdk
- [ ] The system must persist a new Pet record
- [ ] The system must not create a Pet if image storage fails
- [ ] Happy Path: On successful upload, the system must return the created Pet with a 201 status code

## Non-Functional Requirements

- [ ] The system must handle classification and caption generation failures
- [ ] The system must process the uploaded image before storage or analysis, converting to `WebP` format
- [ ] The system must validate that the image size does not exceed 5MB
- [x] The system must validate and normalize all textual inputs
- [ ] The system should produce structured logs for AI interactions
- [ ] The system must implement the `Circuit Breaker` pattern for AI service calls
- [ ] The system must implement rate limiting on the upload endpoint

## Error Handling

- [x] Returns **400** when the request is malformed (missing file, invalid format)
- [ ] Returns **401** when the user is not authenticated
- [ ] Returns **403** when the user has reached the maximum number of pets
- [ ] Returns **422** when the image has unsupported type
- [ ] Returns **500** when an unexpected server error occurs
- [ ] Returns **503** with retry-after hint when the AI service is unavailable


