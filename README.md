# Linkedin
#What this does

It's a dead simple script that just works. Tired of seeing everyone talking about plugins & bulshit proxy IPs that get flagged in 48h so I built this for our sales team, & it works pretty well :) 

You give it a salesNav search URL (people), login & pw, and it: 

  1. Returns a .csv with 250 leads (250 people = the 1st 10 pages)
  2. Saves everyone as a lead on salesNav (250 people)
  3. Sends a connection request to everyone (250 people)

Because it adds everyone as a lead, in theory you can use it over & over on the same search by excluding saved, viewed, & contacted leads.

It's not really recommended to do that though, as I've had some issues with LI not excluding saved leads before. 

#How to use

1. Install NodeJS on your laptop (skip to 2 if you already have)

  1. Open the terminal and type in `node -v`. If the terminal answers with something like v10.blabla or v8.blabla something you can skip to 2. 

  2. If not, go to https://nodejs.org/en/download/ and download node.js. Install it. 

  3. To make sure everything went smoothly, open a terminal window and type in `node -v`. Should now answer with a version number. 

2. To launch the script, you'll need to open a terminal window (cmd + space -> terminal on mac).

  1. Type in `node` (don't hit enter yet). 
  2. Open a finder window and drag the linkedinRobot.js file into the terminal.
  3. Hit enter

  You'll get 3 prompts: salesNav URL - login email & pw. They'll all be written in clear before being hidden (I'm lazy), so  don't type in your pw with 10 friends looking you'll feel stupid.

  4. Enter a SalesNav lead search URL (people). Make sure you exclude saved leads & primary relations.
  5. Enter your salesNav login email (the one you usually use, don't try to outsmart linkedin, just pretend like you're you, easy enough isn't it?)
  6. Enter your pw. 

That's it. The script will run for 5 - 10mn & send a request to 250 people. You can run the script again right after. 

#Things to consider

The dead simple logic of saving people as leads & excluding them from future searches is efficient, but it's not always 100% accurate. LI might block you from saving a lead but still send a connection request, or the other way around, etc. The best solution is to stick to "precise" enough search URLs so you use the full power of the script. Try targetting cities for ex. Or job titles.

2nd relations is what works best.

I'm happy to tailor the script to your needs. Sure you can find how to reach out to me.
