Must have CRUD for user, match, and ladder

User:
C - Registration form
R - Link that lists all players. Ability to click and see details of a specific player
U - Button Click brings up form that allows update of player info
D - Button allows delete 

Match:
C - Click of challenge button creates a match document
R - Matches link shows a list of all match results
U - Click of record button updates the match document
D - A cancel button deletes the match document

Ladder: 
C - Admin form allows creation of new ladder
R - Link lists ladder rankings, challenge, and record buttons
U - recording a successful challenge will update the ladder rankings
D - Button that allows deletion of an empty or inactive ladder

USER FLOW:

1) Login or Register
2) My Ladder 
  - "challenge" button next to each player I am eligible to challenge (match POST)
  a. My Profile link -> (User PUT) 
  b. My Matches link showing played matches and open challenges.
    * ability to record a score (match PUT) 
    * ability to delete a match (match DELETE)
3) All Matches view showing all matches played and active challenges
  

10/3/2018 TO DO:
1) Deleting a challenge removes in from both users match array -- Mongo Pull

2) Deleting a user should delete their matches and remove them from opponent arrays

3)Update the ladder on the server-side by pulling challenger then pushing using position.