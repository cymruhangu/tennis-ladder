The Tennis Ladder App:

link:  https://serene-shore-12858.herokuapp.com/


![A screenshot of my Tennis Ladder App](Ladder-Screenshot.png)
Technology:
---------
HTML5, CSS, Javascript, jQuery, Node, Express, mongoDB

Test userid:
---------
userid: stefanos  password: 1qazxsw23e

BACKGROUND:

The Tennis Ladder App was developed to replace a static web page that a group of players in Burlington, Vermont
have used over the past ~7-8 years to create a friendly competition over spring and summer months. Challenges 
were made by counting up the ladder up to 5 spots on the ladder, looking up the player's email address and 
issuing a challenge.  No indication of current challenges was shown.  When matches were completed the ladder 
admins would have to manually update the ladder and type in scores on another page.  Every Sunday the admins 
would have to calculate who hadn't played a match within 2 weeks and drop those players. This was quite cumbersome
and limited how competition was structured.  This app was developed to automate challenges and recording scores and 
facilitate greater participation and match play.  This app needs a bit of enhancement before going production but 
already fufills most of the basic requirements. NOTE: There is an admin view where users can be deleted or edited. 


Enhancements that will be required before the Tennis Ladder App can go production in Spring 2019:
- Date tracking and display will be required to track and dates of challenges and matches played. 
- A cron job must run so that players that have not played a match in a certain period (2 weeks) will be penalized by
  having their ranking dropped a predetermined number of spots.
- email and/or text notification when a challenge is placed. 
- Ability for users to reset password. 



