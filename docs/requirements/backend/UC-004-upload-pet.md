# Upload Pet - Requirements

## Functional Requirements

- [x] The system must require a valid authenticated user to execute
- [x] The system must not allow anonymous uploads
- [x] The system must enforce a maximum of 5 pets per user
- [x] The system must accept the upload as `multipart/form-data`
- [x] The system must reject the upload if 
  - [x] The file is missing
  - [x] The file exceeds the size limit
  - [x] The file has an unsupported type
  - [x] The pet name has less than 3 or more than 70 characters
- [x] The system must accept only image files of type `jpeg`, `png`, or `webp`
- [x] The system must has an AI classification service to classify the image as `cat` or `dog`
- [x] The system must auto-generate pet descriptions using AI service
- [x] The system must upload the image using `AWS S3` sdk
- [x] The system must persist a new Pet record
- [x] The system must not create a Pet if image storage fails
- [x] Happy Path: On successful upload, the system must return the created Pet with a 200 status code

## Non-Functional Requirements

- [x] The system must handle classification and caption generation failures
- [x] The system must process the uploaded image before storage or analysis, converting to `WebP` format
- [x] The system must validate that the image size does not exceed 5MB
- [x] The system must validate and normalize all textual inputs
- [x] The system should produce structured logs for AI failures
- [x] The system must implement rate limiting on the upload endpoint

## Error Handling

- [x] Returns **400** when the request is malformed (missing file, invalid format)
- [x] Returns **401** when the user is not authenticated
- [x] Returns **422** when the user has reached the maximum number of pets
- [x] Returns **422** when the image has unsupported type
- [x] Returns **500** when an unexpected server error occurs

