# Glide: Wheelchair-Friendly Campus Map of Ewha Womans University

Glide is a web application that provides campus maps for easy navigation within a university campus, aiming to provide wheelchair-friendly routes ensuring accessibility within a complicated campus. 
Users can input their origin and destination to find routes, find detailed information about each campus building including accessible entrances and parking.
A downloadable wheelchair-friendly campus map is also provided, with even more detailed road information so that users can take campus paths into account.

## Curious to see how it looks?
This project is live at: 
http://ewhaglide.live

## Features

* **User-Friendly Interface:** Simple and intuitive web interface for inputting origin and destination.
* **T-Map Integration:** Utilizes T-Map API for initial route calculations.
* **Firebase Integration:** Fetches building information (such as coordinates, accessible entrance, accessible parking space, building details) from Firebase for accurate route calculations.
* **User Location:** Displays user's current location when granted access to the user's current location through the browser.
* **Route Description:** Displays the directions in text utilizing result data given by T Map API.
* **Downloadable Campus Map:** Added a map legend for better understandability when using the map. A Downloadable wheelchair-friendly campus map is provided on the legend.
* **Building Details:** Provides detailed information about each buildings mentioning its accessibility or other useful information for the students.

### Coming Soon:

* **Custom Accessibility Data:** Avoids paths with stairs or other accessibility issues based on custom campus data using custom data and route calculating algorithm.
* **Path choice:** users have the option to choose among different routes (shortest time, shortest distance, least incline without stairs)

## Technologies Used

HTML, CSS, JavaScript<br>
Flask (Python)<br>
Firebase (for database)<br>
T Map API<br>
(Google Maps API)<br>

## Branches 

This project was completed in incremental steps using a new branch for a new component or service/function.<br>
The main branch is the code currently deployed.

### Chronologically Ordered Branches:
**mvp/layout:** Basic layout structure of the website, using HTML and CSS.

**mvp/routing:** Makes requests to Google Maps API, passing on origin and destination.

**mvp/database:** Uses T Map API to get directions from origin to destination, fetches building data (e.g., coordinates) from the database.

**userlocation:** Requests access to the user's current location through the browser.

_**initial_deploy:** Used AWS Elastic Beanstalk to deploy the initial version_

**routedescription:** Displays the directions in text utilizing result data given by T Map API.

**maplegend:** Added a map legend for better understandability when using the map.

_**third_deploy:** Deployed the updated code_

**maplegend: (The final version of the Ewha Challenge Semester)** Worked further on this branch, adding a renewed logo and a wheelchair-friendly downloadable map.

