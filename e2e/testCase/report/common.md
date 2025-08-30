  
  - Buyer selection
  await popupselection(page, "//input[@id='psacBuyer_pop']", "//iframe[@id='psacBuyer_pop_pop_fr1']", buyername);
  
  - Country 
  await typeAndTab(page, "//span[@id='acCountryOfIncorporationID']//input[@placeholder='<Type & tab for single value>']", country);

 - Multiple division 
  await dropdown(page, "//div[@id='jAutochecklist_wrapper_chkddDivisionIDs_lb']", division);

  - Product filter
  await popupbuttonselector(page, "//input[@id='psacItem_pop']", "//iframe[@id='psacItem_pop_pop_fr1']",
  "//input[@id='txtItemName']","//table[@id='grdItem_t']/tbody/tr[2]/td[1]/span", productName);

  - Click division label
  await page.click("//label[normalize-space()='Division']");

  - Search the filter
  await searchButton(page);

  - Export to Excel
  await exportExcelButton(page);
  
  - Download the file
  await downloadFile(page);

    - Verify the search result
  try{
   
    await expectResult(page, "//table[@id='grdShipments_t_frozen']/tbody/tr[2]/td[2]/span", specialOrderType);

    await expectResult(page, "//table[@id='grdShipments_t_frozen']/tbody/tr[2]/td[3]/span", division);
    
    await expectResult(page, "//table[@id='grdShipments_t_frozen']/tbody/tr[2]/td[5]/span", seller);

    await expectResult(page, "//table[@id='grdShipments_t']/tbody/tr[2]/td[8]/span", buyerName);

    await expectResult(page, "//table[@id='grdShipments_t']/tbody/tr[2]/td[9]/span", productName);

  }catch(error){
    await console.log(error);
  }


