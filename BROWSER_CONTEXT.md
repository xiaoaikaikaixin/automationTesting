# Browser Context Sharing in Playwright Tests

## Problem

Previously, each test was performing a login operation in its `beforeEach` hook, which resulted in:

- Multiple redundant logins for each test
- Slower test execution due to repeated login operations
- Potential network issues during multiple login attempts
- Browser being closed and reopened between tests

## Solution

We've implemented a solution that performs a single login before all tests and shares the authenticated browser context across tests. This approach:

1. Uses Playwright's global setup to perform login once
2. Saves the authentication state to be reused across tests
3. Verifies login status before each test instead of performing a new login
4. Keeps the browser session active between tests

## Modified Files

1. **global-setup.ts** (new)
   - Performs login once before all tests
   - Saves authentication state to `playwright/.auth/user.json`

2. **playwright.config.ts**
   - Added `globalSetup: './global-setup.ts'`
   - Added `storageState: 'playwright/.auth/user.json'` to the Chromium project configuration

3. **e2e/utils/sharedContext.ts** (new)
   - Provides utility functions for working with the shared authenticated context
   - `verifyLoggedIn()`: Checks if the user is still logged in
   - `navigateTo()`: Navigates to pages within the application

4. **Test files (e.g., FC-02-freightChargewithDoorToDoor.spec.ts)**
   - Updated to use `verifyLoggedIn()` instead of `login()` in beforeEach hooks

## Usage for Test Developers

### In Test Files

Replace:

```typescript
import { login } from '../../utils/baseCase';

test.beforeEach(async ({ page }) => {
  await login(page);
});
```

With:

```typescript
import { verifyLoggedIn } from '../../utils/sharedContext';

test.beforeEach(async ({ page }) => {
  const isLoggedIn = await verifyLoggedIn(page);
  if (!isLoggedIn) {
    console.warn('User is not logged in. Tests may fail. Check global setup.');
  }
});
```

### For Navigation

You can use the `navigateTo` function for navigating within the application:

```typescript
import { navigateTo } from '../../utils/sharedContext';

// In your test
await navigateTo(page, 'path/to/page.aspx');
```

## Benefits

- **Faster Tests**: Eliminates redundant login operations
- **More Reliable**: Reduces network-related failures during login
- **Persistent Context**: Browser session remains active between tests
- **Simplified Test Code**: No need to handle login in each test
- **Better Error Handling**: Clear warnings when authentication issues occur

## Notes

- The global setup will run once before all tests in a test run
- If authentication expires during a long test run, tests may fail with clear warnings
- The authentication state is stored in `playwright/.auth/user.json` and is reused for all tests