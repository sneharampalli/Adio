# Adio

Adio is a location-based audio advertising platform for rideshare drivers that intersperses geographically targeted audio advertisements between music played during rides and provides a portion of the advertisement revenue to the rideshare drivers. There are two main components to the product: a cross-platform mobile application that rideshare drivers can use to play advertisements between music and a web application that advertisers can use to create geographically targeted audio advertising campaigns. Adio enables advertisers to target specific geographic customer segments, drivers to earn passive income, and riders to learn about businesses and offerings nearby. Adio aims to revolutionize the worlds of audio and rideshare advertising. 

## Web Application

The web application is designed for advertiser-partners to easily create audio advertising campaigns that are seamlessly delivered to consumers via our driver-partners. The website allows advertiser-partners to sign up and sign in, upload audio advertisements, and set a rectangular geographic area in which their advertisements will be broadcast using our drag-and-drop map interface or using latitude and longitude coordinates. In addition to creating advertisement campaigns, advertiser-partners can also monitor and adjust their existing campaigns.

### Technologies Used

* Node.js
* JavaScript
* EJS
* HTML/CSS
* Amazon DynamoDB
* Amazon S3
* Amazon Elastic Beanstalk
* Google Maps API

### Instructions to Run

`cd Adio-Webapp`

`npm install`

`node app.js`

### Demo

View our web application hosted on Amazon Elastic Beanstalk at http://adio.us-east-1.elasticbeanstalk.com/.

View a video demo of our web application at http://tiny.cc/adio-web-demo/.

## Mobile Application

The mobile application allows driver-partners to sign in, start/stop usage of Adio, set various parameters regarding the advertisements that they wish to broadcast, such as volume and frequency, and view their earning history.

### Technologies Used
* React Native
* Expo CLI
* AWS Amplify
* Amazon Cognito
* Amazon DynamoDB
* Amazon S3

### Instructions to Run

`cd AdioMobileFinal`

`npm install`

`expo start`

The QR code can then be scanned to test the mobile app in the Expo Client app on a device, or the app can be opened on an iPhone or Android simulator.

### Demo

View a video demo of our mobile application at http://tiny.cc/adio-mobile-demo/.
