# ankietapp-backend

## Description
Backend for the survey management app "ankietApp"

## Features
- A system administrator can create a survey and assign users as respondents or make a survey public so that each user in the app will be asked to fill the survey
- Each survey has multiple questions and the due date
- Each question is one of the four types: date, text, single choice, multiple-choice
- Every time survey is created, each respondent will be asked via email to fill survey (using <span style="color:green">Mailgun integration</span>)
- The respondent will be reminded to fill the survey a day before its due date (<span style="color:green">cron scheduled job + Mailgun.js</span>)
### Example of survey creation
![AnkietApp](/AnkietApp.jpg)

## Entity Relationship Diagram
![erd-survey](/erd-survey.jpg)

## Technologies
- Mailgun integration ✅
- TypeScript ✅
- TypeORM ✅
- MySQL ✅
- Passport.js (JWT authorization) ✅
- cron (schedule sending email notifications) ✅

## Requirements
- Node.js
- MySQL
- Mailgun account and private key

## Install
1. Create database
```
mysql> CREATE DATABASE ankietApp;
```
2. Install typescript
```
$ npm install -g typescript
```
3. Install dependencies
```
$ npm install
```
4. Create .env from example.env then set MAILGUN_API_KEY and MAILGUN_DOMAIN  
5. Run app (PORT 8080)
```
$ npm run dev
```
Go to http://localhost:8080
