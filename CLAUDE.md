## Code Quality

- Always use descriptive variable names

## Testing and Authentication

- Direct URL Access: Visit any page directly - you'll be auto-logged in
- Switch Roles via URL: Add ?role=admin to any URL
- Switch Roles via UI: Use the dropdown in the test mode indicator
- Test Different Permissions: Visit /dashboard to see role-specific content

- The system maintains security in production (when VITE_TEST_MODE=false) while providing convenient testing during development