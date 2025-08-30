import { expect } from '@playwright/test';
import { test } from '../../../../fixture';
import { login } from '../../../utils/baseCase';
import { expectResult, downloadFile}  from '../../../utils/baseTest';
import { reporturl, reportData } from '../../../data/reportData';
import { exportExcelButton, blDefaultDateVerify } from '../../../utils/report/reportBaseCase';

// Timeout removed - using global configuration


test('Download Accrual Listing For Brokerage Report', async ({ 
  page
}) => {
test.info().title = 'Downloads Accrual Listing For Brokerage Report';

    await login(page);
    await page.goto(`${reporturl.url}/report/Account/RptAccrualListingForBrokerage.aspx`);
    await blDefaultDateVerify(page);
    await exportExcelButton(page);
    await downloadFile(page);
 });