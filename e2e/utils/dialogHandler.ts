import { Page } from '@playwright/test';

/**
 * Sets up a handler for prompt dialogs with the specified message and input value
 * @param page - Playwright Page object
 * @param expectedMessage - Optional message to validate in the prompt
 * @param inputValue - Value to enter in the prompt dialog
 * @returns Promise<void>
 */
export const handlePromptDialog = async (
  page: Page,
  expectedMessage?: string,
  inputValue: string = ''
): Promise<void> => {
  // Set up the dialog handler before the action that triggers it
  page.on('dialog', async (dialog) => {
    // Verify it's a prompt dialog
    if (dialog.type() === 'prompt') {
      // Optionally validate the dialog message
      if (expectedMessage) {
        console.log(`Prompt message: ${dialog.message()}`);
        // You can add an assertion here if needed
      }
      
      // Enter the input value and accept the dialog
      await dialog.accept(inputValue);
      console.log(`Entered "${inputValue}" in prompt dialog`);
    } else {
      // Handle other dialog types if needed
      await dialog.accept();
      console.log(`Accepted dialog of type: ${dialog.type()}`);
    }
  });
};

/**
 * Sets up a handler for confirmation dialogs (OK/Cancel)
 * @param page - Playwright Page object
 * @param accept - Whether to accept (true) or dismiss (false) the dialog
 * @param expectedMessage - Optional message to validate in the confirmation dialog
 * @returns Promise<void>
 */
export const handleConfirmDialog = async (
  page: Page,
  accept: boolean = true,
  expectedMessage?: string
): Promise<void> => {
  // Set up the dialog handler before the action that triggers it
  page.on('dialog', async (dialog) => {
    // Verify it's a confirm dialog
    if (dialog.type() === 'confirm') {
      // Optionally validate the dialog message
      if (expectedMessage) {
        console.log(`Confirm message: ${dialog.message()}`);
        // You can add an assertion here if needed
      }
      
      // Accept or dismiss the dialog based on the parameter
      if (accept) {
        await dialog.accept();
        console.log('Clicked OK on confirm dialog');
      } else {
        await dialog.dismiss();
        console.log('Clicked Cancel on confirm dialog');
      }
    } else {
      // Handle other dialog types if needed
      await dialog.accept();
      console.log(`Accepted non-confirm dialog of type: ${dialog.type()}`);
    }
  });
};

/**
 * Sets up a handler for alert dialogs
 * @param page - Playwright Page object
 * @param expectedMessage - Optional message to validate in the alert
 * @returns Promise<void>
 */
export const handleAlertDialog = async (
  page: Page,
  expectedMessage?: string
): Promise<void> => {
  // Set up the dialog handler before the action that triggers it
  page.on('dialog', async (dialog) => {
    // Verify it's an alert dialog
    if (dialog.type() === 'alert') {
      // Optionally validate the dialog message
      if (expectedMessage) {
        console.log(`Alert message: ${dialog.message()}`);
        // You can add an assertion here if needed
      }
      
      // Accept the alert
      await dialog.accept();
      console.log('Clicked OK on alert dialog');
    } else {
      // Handle other dialog types if needed
      await dialog.accept();
      console.log(`Accepted non-alert dialog of type: ${dialog.type()}`);
    }
  });
};