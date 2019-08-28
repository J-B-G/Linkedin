const puppeteer = require("puppeteer");
let prompt = require('password-prompt');
let date = new Date();
let timestamp = date.getTime();

const createCsvWriter = require('csv-writer').createObjectCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'linkedin'+timestamp+'.csv',
  header: [
    {id: 'name', title: 'name'},
    {id:'liProfileUrl', title:'liProfileUrl'},
    {id:'title', title:'title'},
    {id:'liCompanyUrl', title:'liCompanyUrl'},
    {id:'CompanyName', title:'CompanyName'}
  ]
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function getIDs(){
	const rootUrl = await prompt('salesNavUrl: ');
	const login = await prompt('login email: ');
	const pw = await prompt('password: ');
	const browser = await puppeteer.launch({
	headless:false,
    ignoreHTTPSErrors: true
  	});
	
	//login
	
	const page = await browser.newPage();
	await page.goto('https://www.linkedin.com/login', {timeout:30000, waituntil:'load'});	
	console.log("login page loaded");
	await sleep(2000);
	await page.keyboard.type(login);
	await sleep(150);
	await page.keyboard.press('Tab', {delay:(Math.random()+0.5)*400});
	await sleep(300);
	await page.keyboard.type(pw);
	await sleep(500);
	await page.keyboard.press('Tab', {delay:(Math.random()+0.5)*400});
	await sleep(200);
	await page.keyboard.press('Tab', {delay:(Math.random()+0.5)*400});
	await sleep(500);
	await page.keyboard.press('Enter', {delay:(Math.random()+0.5)*400});
	await sleep(5000);
	let results = [];
  	for(i=0;i<10;i++)
  	{
  		let o = i+1
	  	let url = i==0? rootUrl:rootUrl+"&page="+o;
		await page.goto(url, {timeout:30000, waituntil:'load'});
		await sleep(4000);
		await page.evaluate(() => {
			document.scrollingElement.scrollBy(0, 10000);
		});

		await sleep(4000);

		let blockLength = await page.evaluate(() => {
			let blocks = document.querySelectorAll("div.horizontal-person-entity-lockup-4.result-lockup__entity.ml4").length;
			return blocks;
		});
		console.log(blockLength+" blocks on page");

		let localResults = await page.evaluate((blockLength) => {
			let list = [];
			for(i=0;i<blockLength;i++){
				try{
					var object = {
					name:document.querySelectorAll("div.horizontal-person-entity-lockup-4.result-lockup__entity.ml4")[i].childNodes[3].childNodes[1].innerText,
					liProfileUrl:document.querySelectorAll("div.horizontal-person-entity-lockup-4.result-lockup__entity.ml4")[i].childNodes[3].childNodes[1].childNodes[1].href,
					title:document.querySelectorAll("div.horizontal-person-entity-lockup-4.result-lockup__entity.ml4")[i].childNodes[3].childNodes[6].childNodes[2].innerText,
					liCompanyUrl:document.querySelectorAll("div.horizontal-person-entity-lockup-4.result-lockup__entity.ml4")[i].childNodes[3].childNodes[6].childNodes[5].childNodes[3].childNodes[1].href,
					CompanyName:document.querySelectorAll("div.horizontal-person-entity-lockup-4.result-lockup__entity.ml4")[i].childNodes[3].childNodes[6].childNodes[5].childNodes[3].childNodes[1].childNodes[1].innerText
					}
				}
				catch(e){
					var object = undefined;
				}
				finally{
					if(object != undefined){
						list.push(object);
					}
				}
			}
			return list;
		}, blockLength);

		// follow everyone on page
		for(k=0;k<blockLength;k++){
			try{
				//launch connections request confirmation popup
				let triggerPopup = await page.evaluate ((k) => {		
					if(document.querySelectorAll("div.horizontal-person-entity-lockup-4.result-lockup__entity.ml4")[k].nextElementSibling.querySelector("button.result-lockup__connect.button--unstyled.full-width.text-align-left").innerHTML.trim() != "Pending"){
					document.querySelectorAll("div.horizontal-person-entity-lockup-4.result-lockup__entity.ml4")[k].nextElementSibling.querySelector("button.result-lockup__connect.button--unstyled.full-width.text-align-left").click();
					return true;
					}
				return false;
				}
				,k);
				await sleep (1000);
				//confirm connection request
				if(triggerPopup){
						let confirm = await page.evaluate(() => {
						if(document.getElementById("connect-cta-form__email") != null){
							document.querySelectorAll("button.artdeco-modal__dismiss.artdeco-button.artdeco-button--circle.artdeco-button--muted.artdeco-button--2.artdeco-button--tertiary.ember-view")[0].click();
						}
						else{
						document.querySelector("button.button-primary-medium.connect-cta-form__send").click();
						}
					});	
				}	
				await sleep(1000);
			}
			catch(e){
				//do nothing
			}
			finally{
				//do nothing
			}
		}
		
		//console.log(localResults);
		for(j=0;j<localResults.length;j++){
			results.push(localResults[j]);
		}
  	}
  	//console.log(results);
  	return results;
}

getIDs().then((data) => {
	//console.log(data);
	csvWriter  
  		.writeRecords(data)
  		.then(() => console.log('The CSV file was written successfully'));
	return JSON.stringify(data);
})

