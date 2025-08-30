export const formatDateTo_dd_mmm_yyyy = (dateInput: string | number | Date): string | null => {
    // Array of month abbreviations
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    let date;
    // Try to create a Date object from the input
    try {
      date = new Date(dateInput);
    } catch (error) {
      // Handle potential errors during Date object creation
      console.error("Error creating Date object:", error);
      return null; // Return null for invalid input
    }
    // Check if the created Date object is valid
    if (isNaN(date.getTime())) {
      // Date is invalid
      console.error("Invalid Date input:", dateInput);
      return null; // Return null for invalid date
    }
    // Get day, month, and year
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    // Format day with leading zero if necessary
    const formattedDay = day < 10 ? '0' + day : day.toString();
    // Get month abbreviation
    const formattedMonth = monthNames[monthIndex];
    // Combine parts into 'dd-mmm-yyyy' format
    return `${formattedDay}-${formattedMonth}-${year}`;
  }

export const click = async (page: any, selector: string) => {
    await page.click(selector);
    console.log("Clicked on: " + selector);
  }

export const type = async (page: any, selector: string, value: string) => {
    await page.click(selector);
    await page.fill(selector, value);
    console.log("Value typed: " + value);
  }

export const clear = async (page: any, selector: string) => {
    await page.click(selector);
    await page.fill(selector, "");
    console.log("Value cleared: " + selector);
  }

export const typeAndTab = async (page: any, selector: string, value: string) => {
    await page.click(selector);
    await page.fill(selector, value);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);  
    await page.keyboard.press('Tab');
    await page.waitForTimeout(3000); 
    console.log("Value typed and Tab pressed: " + value);
  }

export const dropdown = async (page: any, selector: string, value: string) => {
    await page.click(selector);
    await page.waitForTimeout(2000);
    await page.click(`//li[text()="${value}"]`);  
    console.log("Value selected: " + value);
  }

export const dropdownWithIndex = async (page: any, selector: string, index: number) => {
    await page.click(selector);
    await page.waitForTimeout(2000);
    // 获取下拉选项列表并按索引选择
    const options = await page.locator('xpath=//li[contains(@class, "select2-results__option")]').all();
    if (index >= 0 && index < options.length) {
      await options[index].click();
      console.log(`Value selected by index: ${index}`);
    } else {
      console.error(`Index ${index} out of range. Available options: ${options.length}`);
    }
  }

export const checkboxisChecked = async (page: any, selector: string) => {
  const locator = page.locator(selector);

  if (await locator.count() === 0) {
    console.log("Checkbox status: No (element not found)");
    return "No";
  }

  const isChecked = await locator.isChecked();
  const checkboxStatus = isChecked ? "Yes" : "No";
  console.log("Checkbox status: " + checkboxStatus);
  return checkboxStatus;
}


  export const attributeValue= async (page: any, selector: string, attribute: string,) => {
    const value = await page.locator(selector).getAttribute(attribute);
    console.log("Attribute value: " + value);
    return value;
  }


export const multipleSelection = async (page: any, selector: string, value: string) => {
    await page.click(selector);
    await page.waitForTimeout(2000);
    const values = value.split(',');
    for (const val of values) {
      await page.click(`//li[text()="${val}"]`);
    }
  }

export const popupselection = async (page: any, popupbuttonselector: string, frameselector: string,
  value: string) => {
  await page.click(popupbuttonselector);
  const frame = page.frameLocator(frameselector);
  await frame.locator('//input[@id="txtBPName"]').fill(value);
  await frame.locator('//input[@id="btnSearch"]').click();
  await page.waitForTimeout(3000);
  await frame.locator("//table[@id='grdBP_t']//tbody/tr[2]/td[1]").click();
  await page.waitForTimeout(1000);
  console.log("pop up value selected: " + value);
}

export const popupbuttonselector = async (page: any, popupbuttonselector: string, frameselector: string, fieldselector: string,
  itemselector: string, value: string) => {
  await page.click(popupbuttonselector);
  const frame = page.frameLocator(frameselector);
  await frame.locator(fieldselector).fill(value);
  await frame.locator('//input[@id="btnSearch"]').click();
  await page.waitForTimeout(3000);
  await frame.locator(itemselector).click();
  await page.waitForTimeout(1000);
  console.log("pop up value selected: " + value);
}


export const popupBrokerSelector = async (page: any, popupbuttonselector: string, frameselector: string,) => {
  await page.click(popupbuttonselector);
  const frame = page.frameLocator(frameselector);
  await frame.locator("input[value='Select']").click();
  await page.waitForTimeout(1000);
  console.log("pop up broker selected." );
}

export const pageReload = async (page: any) => {
        await page.evaluate(() => {location.reload(); });
  }

//common button
export const editViewButton = async (page: any) => {
  await page.click("//input[@id='btnEditView']");
  await page.waitForTimeout(2000);
  console.log("Edit / View button clicked." );
}


export const elementIsExists = async (page: any, selector: string) => {
  const element = await page.locator(selector);
  return await element.isVisible();
}


export const submitforApprovalButton = async (page: any) => {
  await page.click("//input[@id='btnSubmitForApproval']");
  await page.waitForTimeout(2000);
  await page.click("//button[@id='button-0']");
  console.log("Submit for approval button clicked." );
}

export const approveButton = async (page: any) => {
  await page.click("//input[@id='btnApprove']");
  await page.waitForTimeout(2000);
  await page.click("//button[@id='button-0']");
  console.log("Approve button clicked." );
}

export const okButton = async (page: any) => {
  await page.click("//button[@id='button-0']");
  await page.waitForTimeout(2000);
  console.log("OK button clicked." );
}


export const scrolldown = async (page: any) => {
  await page.evaluate(() => { window.scrollBy(0, 500); });
  console.log("Scrolled down by 500px");
}

export const scrollToBottom = async (page: any, selector?: string) => {
  if (selector) {
    await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, selector);
    console.log(`Scrolled to bottom of element: ${selector}`);
  } else {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    console.log("Scrolled to bottom of page");
  }
}

export const scrollToTop = async (page: any, selector?: string) => {
  if (selector) {
    await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element) {
        element.scrollTop = 0;
      }
    }, selector);
    console.log(`Scrolled to top of element: ${selector}`);
  } else {
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    console.log("Scrolled to top of page");
  }
}

export const scrollup = async (page: any) => {
  await page.evaluate(() => { window.scrollBy(0, -500); });
  console.log("Scrolled up by 500px");
}

// Enhanced scroll functions for better element targeting
export const scrollToElement = async (page: any, selector: string, options?: {
  behavior?: 'auto' | 'smooth';
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
}) => {
  try {
    await page.evaluate(({sel, opts}) => {
      // Handle both CSS selectors and XPath
      let element;
      if (sel.startsWith('//') || sel.startsWith('(')) {
        // XPath selector
        const result = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        element = result.singleNodeValue;
      } else {
        // CSS selector
        element = document.querySelector(sel);
      }
      
      if (element) {
        element.scrollIntoView({
          behavior: opts?.behavior || 'smooth',
          block: opts?.block || 'center',
          inline: opts?.inline || 'nearest'
        });
      } else {
        throw new Error(`Element not found: ${sel}`);
      }
    }, {sel: selector, opts: options});
    console.log(`Scrolled to element: ${selector}`);
  } catch (error) {
    console.error(`Failed to scroll to element ${selector}:`, error.message);
    throw error;
  }
}

export const scrollHorizontally = async (page: any, selector: string, direction: 'left' | 'right', distance: number = 300) => {
  try {
    await page.evaluate((sel, dir, dist) => {
      const element = document.querySelector(sel);
      if (element) {
        const scrollAmount = dir === 'right' ? dist : -dist;
        element.scrollBy(scrollAmount, 0);
      } else {
        throw new Error(`Element not found: ${sel}`);
      }
    }, selector, direction, distance);
    console.log(`Scrolled ${direction} by ${distance}px in element: ${selector}`);
  } catch (error) {
    console.error(`Failed to scroll horizontally in element ${selector}:`, error.message);
    throw error;
  }
}

export const scrollToTableColumn = async (page: any, tableSelector: string, columnName: string) => {
  try {
    await page.evaluate((tableSel, colName) => {
      const table = document.querySelector(tableSel);
      if (!table) {
        throw new Error(`Table not found: ${tableSel}`);
      }
      
      // Find the column header
      const headers = table.querySelectorAll('th');
      let targetColumnIndex = -1;
      
      headers.forEach((header, index) => {
        if (header.textContent?.includes(colName)) {
          targetColumnIndex = index;
        }
      });
      
      if (targetColumnIndex === -1) {
        throw new Error(`Column '${colName}' not found in table`);
      }
      
      // Scroll to make the column visible
      const targetHeader = headers[targetColumnIndex];
      targetHeader.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }, tableSelector, columnName);
    console.log(`Scrolled to column '${columnName}' in table: ${tableSelector}`);
  } catch (error) {
    console.error(`Failed to scroll to column '${columnName}':`, error.message);
    throw error;
  }
}

export const extractValue = async (page: any, selector: string) => {
  try {
    const locator = page.locator(selector);
    
    // First, try to get the text content
    const textContent = await locator.textContent();
    if (textContent !== null && textContent !== undefined && textContent.trim() !== '') {
      console.log("Value extracted: " + textContent.trim());
      return textContent.trim();
    }
    
    // If no text content, try to get the title attribute
    const titleAttribute = await locator.getAttribute('title');
    if (titleAttribute !== null && titleAttribute !== undefined && titleAttribute.trim() !== '') {
      console.log("Value extracted (title): " + titleAttribute.trim());
      return titleAttribute.trim();
    }
    
    // If it's an input element, try to get the input value
    try {
      const inputValue = await locator.inputValue();
      if (inputValue !== null && inputValue !== undefined && inputValue.trim() !== '') {
        console.log("Value extracted (inputValue): " + inputValue.trim());
        return inputValue.trim();
      }
    } catch (inputError) {
      // Element is not an input, continue to other methods
    }
    
    // Try to get the value attribute
    const valueAttribute = await locator.getAttribute('value');
    if (valueAttribute !== null && valueAttribute !== undefined && valueAttribute.trim() !== '') {
      console.log("Value extracted (value attribute): " + valueAttribute.trim());
      return valueAttribute.trim();
    }
    
    // If no value found, return null
    console.log("No value found for selector: " + selector + ", returning null");
    return null;
    
  } catch (error) {
    console.error("Error extracting value from selector '" + selector + "':", error.message);
    return null;
  }
}

export const getValue = async (page: any, selector: string) => {
  try {
    const locator = page.locator(selector);
    
    // First, try to get the text content
    const textContent = await locator.textContent();
    if (textContent !== null && textContent !== undefined && textContent.trim() !== '') {
      console.log("Value extracted: " + textContent.trim());
      return textContent.trim();
    }
      } catch (error) {
    console.error("Error extracting value from selector '" + selector + "':", error.message);
    return null;
  }
};

export const expectResult = async (page: any, selector: string, value: string) => {
 const extractedValue = await extractValue(page, selector);
  if (!extractedValue.includes(value)) {
    throw new Error(`Expected "${extractedValue}" to contain ${value}`);
  }
    console.log("the expect value : " + extractedValue + " is equal to the expected value: " + value);
    return value;
}


export const downloadFile = async (page: any, downloadPath: string = './downloads/', timeoutMs: number = 30000) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Ensure download directory exists
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }
    
    // Start waiting for download
    const downloadPromise = page.waitForEvent('download', { timeout: timeoutMs });
    
    // Wait for the download to start
    const download = await downloadPromise;
    const fileName = download.suggestedFilename();
    const fullPath = path.join(downloadPath, fileName);
    
    // Save the download
    await download.saveAs(fullPath);
    
    // Verify the file exists
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      console.log(`✅ Download successful: ${fileName} (${stats.size} bytes)`);
      console.log(`📁 File location: ${fullPath}`);
      
      // Delete the file after verification
      fs.unlinkSync(fullPath);
      console.log(`🗑️ File deleted: ${fileName}`);
      
      return { 
        success: true, 
        fileName: fileName, 
        path: fullPath, 
        size: stats.size,
        deleted: true
      };
    } else {
      console.error(`❌ File not found after download: ${fullPath}`);
      return { success: false, error: 'File not found after download' };
    }
    
  } catch (error) {
    console.error('❌ Download failed:', error.message);
    return { success: false, error: error.message };
  }

}



export const uploadFile  = async (page: any, selector: string, filepath: string) => {

        const fileInput2 = page.locator(selector);
        await fileInput2.setInputFiles(filepath);      
        console.log(`File attached : ${filepath}`);        
        await page.waitForTimeout(3000);

}



// Helper function to add one month to a date string in format DD-MMM-YYYY (e.g., 21-Oct-2025)
export const addOneMonth = async (dateStr: string): Promise<string> => {
    if (!dateStr) return '';
    
    // Parse the date string
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    
    const day = parseInt(parts[0], 10);
    const monthStr = parts[1];
    const year = parseInt(parts[2], 10);
    
    // Map month names to their numeric values
    const monthMap: {[key: string]: number} = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    // Get the month number
    const month = monthMap[monthStr];
    if (month === undefined) return dateStr;
    
    // Create a date object and add one month
    const date = new Date(year, month, day);
    date.setMonth(date.getMonth() + 1);
    
    // Format the date back to DD-MMM-YYYY
    const newDay = date.getDate().toString().padStart(2, '0');
    
    // Map month numbers back to month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const newMonth = monthNames[date.getMonth()];
    
    const newYear = date.getFullYear();
    
    return `${newDay}-${newMonth}-${newYear}`;
}
