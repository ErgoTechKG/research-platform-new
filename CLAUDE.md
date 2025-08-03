## Code Quality

- Always use descriptive variable names

## Testing and Authentication

- Direct URL Access: Visit any page directly - you'll be auto-logged in
- Switch Roles via URL: Add ?role=admin to any URL
- Switch Roles via UI: Use the dropdown in the test mode indicator
- Test Different Permissions: Visit /dashboard to see role-specific content

- The system maintains security in production (when VITE_TEST_MODE=false) while providing convenient testing during development

## Project Structure

- The frontend code is at frontend folder, follow old style and pattern

## Development Principles

- Remember this is role-based platform, always make sure which role you are designing